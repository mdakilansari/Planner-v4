# backend/app/crud.py
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime, timedelta
from backend.app.schemas import TaskCreate, TaskUpdate, Task, Reminder, ReminderUpdate

# In-memory storage to simulate database (Task ID -> Task Object)
# In a real app, 'db' would be a SQLAlchemy/Tortoise session
MOCK_DB: dict[UUID, Task] = {}

def get_tasks(db: dict = MOCK_DB) -> List[Task]:
    """Retrieve all tasks."""
    return list(db.values())

def get_task(db: dict, task_id: UUID) -> Optional[Task]:
    """Retrieve a single task by ID."""
    return db.get(task_id)

def create_task(db: dict, task: TaskCreate) -> Task:
    """Create a new task and associated reminders."""
    task_id = uuid4()
    now = datetime.now()
    
    # 1. Create Reminder objects with IDs
    reminders: List[Reminder] = []
    for r_create in task.reminders:
        reminder_id = uuid4()
        reminders.append(Reminder(
            id=reminder_id,
            task_id=task_id,
            time=r_create.time,
            snoozes_acknowledged=0
        ))

    # 2. Create Task object
    db_task = Task(
        id=task_id,
        created_at=now,
        reminders=reminders,
        title=task.title,
        subject=task.subject,
        type=task.type,
        due_date=task.due_date,
        notes=task.notes,
        is_completed=task.is_completed,
    )
    
    db[task_id] = db_task
    return db_task

def update_task(db: dict, task_id: UUID, task_update: TaskUpdate) -> Optional[Task]:
    """
    Update an existing task with partial data.
    Handles updating basic fields and complex reminder management.
    """
    db_task = db.get(task_id)
    if not db_task:
        return None

    # 1. Update basic fields (excluding reminders management fields)
    update_data = task_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        if key not in ['reminders', 'remove_reminder_ids']:
            setattr(db_task, key, value)
            
    # 2. Handle Reminder updates/creations/deletions
    current_reminders = {r.id: r for r in db_task.reminders}
    
    # a. Deletions: Remove reminders by ID
    if task_update.remove_reminder_ids:
        for rem_id in task_update.remove_reminder_ids:
            if rem_id in current_reminders:
                del current_reminders[rem_id]

    # b. Updates/Creations: Iterate through the update list from the frontend
    if task_update.reminders:
        for r_update in task_update.reminders:
            if r_update.id in current_reminders:
                # Update existing reminder
                existing_reminder = current_reminders[r_update.id]
                if r_update.time is not None:
                    existing_reminder.time = r_update.time
            else:
                # Create new reminder (ID was null/not present in TaskUpdate.reminders)
                new_reminder_id = uuid4()
                if r_update.time is not None:
                    new_reminder = Reminder(
                        id=new_reminder_id,
                        task_id=task_id,
                        time=r_update.time,
                        snoozes_acknowledged=0
                    )
                    current_reminders[new_reminder_id] = new_reminder

    # Reassemble the list
    db_task.reminders = list(current_reminders.values())
    
    db[task_id] = db_task
    return db_task

def delete_task(db: dict, task_id: UUID) -> bool:
    """Delete a task and its associated reminders."""
    if task_id in db:
        del db[task_id]
        return True
    return False

def acknowledge_snooze(db: dict, task_id: UUID) -> Optional[Task]:
    """
    Simulates snoozing a reminder. Increments snooze count and reschedules the first reminder time.
    """
    db_task = db.get(task_id)
    if not db_task:
        return None
        
    if not db_task.reminders:
        return db_task

    # Find the earliest reminder time (we don't strictly need the reminder object if we assume one main reminder)
    # But to use the snooze count, we need the object.
    
    active_reminders = sorted(
        [r for r in db_task.reminders if r.snoozes_acknowledged < 3], 
        key=lambda r: r.time
    )

    if active_reminders:
        reminder_to_snooze = active_reminders[0]
        
        # Increment count
        reminder_to_snooze.snoozes_acknowledged += 1
        
        # Reschedule for 15 minutes later (example logic)
        reminder_to_snooze.time = datetime.now() + timedelta(minutes=15)
        
    return db_task
