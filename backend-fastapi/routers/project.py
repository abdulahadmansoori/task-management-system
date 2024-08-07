from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth import get_db
from schemas import ProjectCreate, Project
from response_helper import ResponseHelper
from models import Project as ProjectModel, User as UserModel, Task as TaskModel, user_projects

router = APIRouter()

@router.post("/admin/project", response_model=Project)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = ProjectModel(name=project.name)
    db_project.users = db.query(UserModel).filter(UserModel.id.in_(project.users)).all()
    db_project.tasks = db.query(TaskModel).filter(TaskModel.id.in_(project.tasks)).all()
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    # return ResponseHelper.success(db_project,"Project Created SuccessFully")
    return db_project

@router.get("/admin/project", response_model=list[Project])
def list_projects(db: Session = Depends(get_db)):
    return db.query(ProjectModel).all()

@router.get("/admin/project/user/{user_id}", response_model=list[Project])
def get_projects_by_user(
    user_id: int, db: Session = Depends(get_db)
):
    # Query to get all projects associated with the user_id
    projects = (
        db.query(ProjectModel)
        .join(user_projects)
        .filter(user_projects.c.user_id == user_id)
        .distinct()
        .all()
    )
    
    if not projects:
        # raise HTTPException(status_code=404, detail="No projects found for this user")
        return []
    
    return projects

@router.put("/admin/project/{project_id}", response_model=Project)
def update_project(project_id: int, project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
   
    db_project.name = project.name
    
    # db_project.users = db.query(UserModel).filter(UserModel.id.in_(project.users)).all()
    # db_project.tasks = db.query(TaskModel).filter(TaskModel.id.in_(project.tasks)).all()

    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/admin/project/{project_id}", response_model=Project)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return db_project

@router.post("/admin/project/{project_id}/assign", response_model=Project)
def assign_project(project_id: int, user_id: int, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_project or not db_user:
        raise HTTPException(status_code=404, detail="Project or User not found")
    
    if db_user not in db_project.users:
        db_project.users.append(db_user)
        db.commit()
        db.refresh(db_project)
    
    return db_project


@router.post("/admin/project/{project_id}/unassign", response_model=Project)
def unassign_project(project_id: int, user_id: int, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    
    if not db_project or not db_user:
        raise HTTPException(status_code=404, detail="Project or User not found")
    
    if db_user in db_project.users:
        db_project.users.remove(db_user)
        db.commit()
        db.refresh(db_project)
    
    return db_project