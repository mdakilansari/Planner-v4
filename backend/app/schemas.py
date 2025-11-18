# backend/app/schemas.py
from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4
from pydantic import BaseModel, Field, validator

# --- Reminder Schemas ---

class ReminderBase(BaseModel):
    # time should be an ISO 8601 string (e.g., "2023-11-20T10:00:00Z")
    time: datetime

class ReminderCreate(ReminderBase):
    # snoozes_acknowledged is managed by the backend, not created by user
    pass

class ReminderUpdate(BaseModel):
    # Supports partial update for time
    id: Optional[UUID] = None # Added for explicit reminder ID tracking in frontend/backend update
    time: Optional[datetime] = None

class Reminder(ReminderBase):
    id: UUID
    task_id: UUID
    snoozes_acknowledged: int = 0

    class Config:
        from_attributes = True

# --- Task Schemas ---

class TaskBase(BaseModel):
    title: str
    subject: str
    type: str # e.g., 'Study', 'Assignment', 'Exam'
    due_date: datetime
    notes: Optional[str] = None
    is_completed: bool = False

class TaskCreate(TaskBase):
    reminders: List[ReminderCreate] = Field(default_factory=list)

    # Note: Pydantic 2 validates against the model field types automatically.
    # The datetime validation below is for logic, but for simplification, 
    # we rely on the Pydantic type check and skip custom time logic here 
    # as the backend logic (crud.py) does not strictly enforce it.

class TaskUpdate(BaseModel):
    """
    Schema for partial updates (PATCH/PUT)
    Allows any field to be Optional
    """
    title: Optional[str] = None
    subject: Optional[str] = None
    type: Optional[str] = None
    due_date: Optional[datetime] = None
    notes: Optional[str] = None
    is_completed: Optional[bool] = None
    
    # Reminders are complex; the list sent from frontend will contain ReminderUpdate objects
    reminders: Optional[List[ReminderUpdate]] = None 
    
    # Optional field to specify which reminder IDs to remove completely
    remove_reminder_ids: Optional[List[UUID]] = None


class Task(TaskBase):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime
    reminders: List[Reminder] = Field(default_factory=list)

    class Config:
        from_attributes = True

# --- Consistent API Response Schemas ---

class ApiErrorResponse(BaseModel):
    """Standardized error response"""
    detail: str
    code: int = 400

class TaskListResponse(BaseModel):
    """Response containing a list of tasks (e.g., GET /tasks)"""
    tasks: List[Task]

class TaskOperationResponse(BaseModel):
    """Response containing a single task after CRUD operation"""
    task: Task
