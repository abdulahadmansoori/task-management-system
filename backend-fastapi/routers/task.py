from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import get_current_user, get_db
from schemas import TaskCreate, Task
from models import Task as TaskModel, User as UserModel, Project as ProjectModel

router = APIRouter()

@router.post("/project/{project_id}/task", response_model=Task)
def create_task(
    project_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)  # Ensure user authorization
):
    # Optionally: Check if the user is authorized to create tasks in the project
    db_task = TaskModel(**task.dict(), project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/project/{project_id}/task-option", response_model=list[Task])
def list_tasks(project_id: int, db: Session = Depends(get_db)):
    return db.query(TaskModel).filter(TaskModel.project_id == project_id).all()
@router.get("/project/{project_id}/my-tasks/{user_id}", response_model=list[Task])
def my_tasks(project_id: int, user_id: int, db: Session = Depends(get_db)):
    return db.query(TaskModel).filter(TaskModel.assignee_id == user_id).all()

# @router.get("/project/{project_id}/task", response_model=list[Task])
# def list_tasks(project_id: int, db: Session = Depends(get_db)):
#     tasks = db.query(TaskModel).filter(TaskModel.project_id == project_id).all()
#     task_dict = {task.id: task for task in tasks}

#     for task in tasks:
#         if task.parent_id:
#             parent = task_dict.get(task.parent_id)
#             if parent:
#                 if not hasattr(parent, 'children'):
#                     parent.children = []
#                 parent.children.append(task)
    
#     root_tasks = [task for task in tasks if task.parent_id is None]
#     return root_tasks

@router.get("/project/{project_id}/task", response_model=list[Task])
def list_tasks(project_id: int, db: Session = Depends(get_db)):
    tasks = db.query(TaskModel).filter(TaskModel.project_id == project_id).all()
    task_dict = {task.id: task for task in tasks}

    # Fetch assignees and projects
    for task in tasks:
        if task.assignee_id:
            task.assignee = db.query(UserModel).filter(UserModel.id == task.assignee_id).first()
        task.project = db.query(ProjectModel).filter(ProjectModel.id == task.project_id).first()

        if task.parent_id:
            parent = task_dict.get(task.parent_id)
            if parent:
                if not hasattr(parent, 'children'):
                    parent.children = []
                parent.children.append(task)
    
    root_tasks = [task for task in tasks if task.parent_id is None]
    return root_tasks


@router.get("/project/{project_id}/task/{task_id}", response_model=Task)
def get_task(project_id: int, task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.project_id == project_id, TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.put("/project/{project_id}/task/{task_id}", response_model=Task)
def update_task(
    project_id: int,
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)  # Ensure user authorization
):
    db_task = db.query(TaskModel).filter(TaskModel.project_id == project_id, TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    # Optionally: Check if the user is authorized to update the task
    db_task.title = task.title
    db_task.description = task.description
    db_task.status = task.status
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/project/{project_id}/task/{task_id}", response_model=Task)
def delete_task(
    project_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)  # Ensure user authorization
):
    db_task = db.query(TaskModel).filter(TaskModel.project_id == project_id, TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    # Optionally: Check if the user is authorized to delete the task
    db.delete(db_task)
    db.commit()
    return db_task

@router.post("/project/{project_id}/task/{task_id}/assign", response_model=Task)
def assign_task(
    project_id: int,
    task_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)  # Ensure user authorization
):
    db_task = db.query(TaskModel).filter(TaskModel.project_id == project_id, TaskModel.id == task_id).first()
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_task or not db_user:
        raise HTTPException(status_code=404, detail="Task or User not found")
    # Optionally: Check if the user is authorized to assign tasks
    db_task.assignee_id = user_id
    db.commit()
    db.refresh(db_task)
    return db_task
