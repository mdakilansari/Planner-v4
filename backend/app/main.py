# backend/app/main.py
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from uuid import UUID
from backend.app.schemas import (
    Task, TaskCreate, TaskUpdate, 
    TaskListResponse, TaskOperationResponse, ApiErrorResponse
)
from backend.app import crud

# --- FastAPI Setup ---
app = FastAPI(
    title="CA Planner v4 API",
    description="Full CRUD Task Management with FastAPI and Pydantic",
    version="4.0.0"
)

# --- CORS Configuration ---
# Allow all origins for development (Frontend running on a different port/host)
origins = ["*"] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes ---

@app.get(
    "/tasks/", 
    response_model=TaskListResponse, 
    summary="Get all tasks"
)
def read_tasks():
    """Retrieve a list of all tasks from the database."""
    tasks = crud.get_tasks()
    return TaskListResponse(tasks=tasks)

@app.post(
    "/tasks/", 
    response_model=TaskOperationResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task"
)
def create_new_task(task: TaskCreate):
    """Create a new task with associated reminders."""
    db_task = crud.create_task(crud.MOCK_DB, task)
    return TaskOperationResponse(task=db_task)


@app.put(
    "/tasks/{task_id}", 
    response_model=TaskOperationResponse,
    summary="Update an existing task (Full or Partial)"
)
def update_existing_task(task_id: UUID, task_update: TaskUpdate):
    """
    **PUT /tasks/{id}** Updates an existing task. Can handle partial updates.
    Returns the updated task object.
    """
    db_task = crud.update_task(crud.MOCK_DB, task_id, task_update)
    if db_task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found."
        )
    return TaskOperationResponse(task=db_task)


@app.delete(
    "/tasks/{task_id}", 
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        204: {"description": "Task successfully deleted"},
        404: {"model": ApiErrorResponse, "description": "Task not found"}
    },
    summary="Delete a task"
)
def delete_existing_task(task_id: UUID):
    """
    **DELETE /tasks/{id}** Deletes a task by ID. Returns 204 No Content on success.
    """
    if not crud.delete_task(crud.MOCK_DB, task_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found."
        )
    return 

@app.post(
    "/tasks/{task_id}/acknowledge",
    response_model=TaskOperationResponse,
    summary="Acknowledge/Snooze a task reminder"
)
def acknowledge_task_reminder(task_id: UUID):
    """
    **POST /tasks/{id}/acknowledge**
    Handles the Snooze action by rescheduling the next active reminder.
    Returns the updated task.
    """
    db_task = crud.acknowledge_snooze(crud.MOCK_DB, task_id)
    if db_task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found."
        )
    return TaskOperationResponse(task=db_task)
