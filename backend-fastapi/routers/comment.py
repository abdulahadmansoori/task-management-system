from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import get_current_user, get_db
from schemas import CommentCreate, Comment
from models import Comment as CommentModel, Task as TaskModel, User as UserModel

router = APIRouter()

@router.post("/project/{project_id}/task/{task_id}/comment", response_model=Comment)
def create_comment(
    project_id: int,
    task_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)  # Ensure correct user authorization if needed
):
    # Verify that the task belongs to the specified project
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id, TaskModel.project_id == project_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found or does not belong to this project")

    db_comment = CommentModel(**comment.dict(), task_id=task_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/project/{project_id}/task/{task_id}/comment", response_model=list[Comment])
def list_comments(project_id: int, task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id, TaskModel.project_id == project_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found or does not belong to this project")
    
    return db.query(CommentModel).filter(CommentModel.task_id == task_id).all()

@router.get("/project/{project_id}/task/{task_id}/comment/{comment_id}", response_model=Comment)
def get_comment(project_id: int, task_id: int, comment_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id, TaskModel.project_id == project_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found or does not belong to this project")
    
    db_comment = db.query(CommentModel).filter(CommentModel.id == comment_id, CommentModel.task_id == task_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return db_comment

@router.put("/project/{project_id}/task/{task_id}/comment/{comment_id}", response_model=Comment)
def update_comment(
    project_id: int,
    task_id: int,
    comment_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db)
):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id, TaskModel.project_id == project_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found or does not belong to this project")
    
    db_comment = db.query(CommentModel).filter(CommentModel.id == comment_id, CommentModel.task_id == task_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    db_comment.content = comment.content
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete("/project/{project_id}/task/{task_id}/comment/{comment_id}", response_model=Comment)
def delete_comment(project_id: int, task_id: int, comment_id: int, db: Session = Depends(get_db)):
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id, TaskModel.project_id == project_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found or does not belong to this project")
    
    db_comment = db.query(CommentModel).filter(CommentModel.id == comment_id, CommentModel.task_id == task_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    db.delete(db_comment)
    db.commit()
    return db_comment
