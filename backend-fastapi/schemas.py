# from pydantic import BaseModel
# from typing import Optional, List
# from datetime import datetime

# # User schemas
# class UserBase(BaseModel):
#     name: str
#     email: str
#     role: str

# class UserCreate(UserBase):
#     password: Optional[str] = None
#     # pass
# # 
# class UserUpdate(UserBase):
#     pass

# class User(UserBase):
#     id: int
#     timestamp: datetime

#     class Config:
#         orm_mode = True

# # Token schemas
# class Token(BaseModel):
#     access_token: str
#     token_type: str

# class TokenData(BaseModel):
#     email: Optional[str] = None

# # Comment schemas
# class CommentBase(BaseModel):
#     content: str
#     parent_id: Optional[int] = None

# class CommentCreate(CommentBase):
#     pass

# class Comment(CommentBase):
#     id: int
#     task_id: int
#     timestamp: datetime
#     replies: List['Comment'] = []  # Use forward reference for Comment

#     class Config:
#         orm_mode = True


# # Task schemas
# class TaskBase(BaseModel):
#     title: str
#     description: Optional[str] = None
#     status: str
#     parent_id: Optional[int] = None
#     # project_id: int
#     # assignee_id: Optional[int] = None
#     # timestamp: datetime

# class TaskCreate(TaskBase):
#     pass

# class Task(TaskBase):
#     id: int
#     project_id: int
#     assignee_id: Optional[int] = None
#     timestamp: datetime
#     comments: List[Comment] = []  # Use forward reference for Comment
#     children: List['Task'] = []
#     assignee: Optional[User] = None
#     project: Project

#     class Config:
#         orm_mode = True

# # Project schemas
# class ProjectBase(BaseModel):
#     name: str

# class ProjectCreate(ProjectBase):
#     users: List[int] = []
#     tasks: List[int] = []
#     pass

# class Project(ProjectBase):
#     id: int
#     timestamp: datetime
#     users: List[User] = []
#     tasks: List[Task] = []

#     class Config:
#         orm_mode = True



# # Register forward references
# Comment.update_forward_refs()
# Task.update_forward_refs()


from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: str
    hashed_password: str

class UserCreate(UserBase):
    password: Optional[str] = None

class UserUpdate(UserBase):
    pass

class User(UserBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Comment schemas
class CommentBase(BaseModel):
    content: str
    parent_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    task_id: int
    timestamp: datetime
    replies: List['Comment'] = []  # Use forward reference for Comment

    class Config:
        orm_mode = True

# Project schemas
class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    users: List[int] = []
    tasks: List[int] = []
    pass

class Project(ProjectBase):
    id: int
    timestamp: datetime
    users: List[User] = []
    tasks: List['Task'] = []  # Use forward reference for Task

    class Config:
        orm_mode = True

# Task schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str
    parent_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    project_id: int
    assignee_id: Optional[int] = None
    timestamp: datetime
    comments: List[Comment] = []  # Use forward reference for Comment
    children: List['Task'] = []
    assignee: Optional[User] = None
    # project: Project

    class Config:
        orm_mode = True

# Register forward references
Comment.update_forward_refs()
Task.update_forward_refs()
Project.update_forward_refs()
