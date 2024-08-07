from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

user_projects = Table(
    'user_projects',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id')),
    Column('user_id', Integer, ForeignKey('users.id'))
)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    hashed_password = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    role = Column(String)

    projects = relationship("Project", secondary=user_projects, back_populates="users")
    tasks = relationship("Task", back_populates="assignee")

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", secondary=user_projects, back_populates="projects")
    tasks = relationship("Task", back_populates="project")

class Task(Base):
    __tablename__ = 'tasks'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    parent_id = Column(Integer, ForeignKey('tasks.id'), nullable=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    assignee_id = Column(Integer, ForeignKey('users.id'))
    
    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")
    comments = relationship("Comment", back_populates="task")
    subtasks = relationship("Task", back_populates="parent", remote_side=[id])
    parent = relationship("Task", back_populates="subtasks")

class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey('comments.id'), nullable=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    task = relationship("Task", back_populates="comments")
    replies = relationship("Comment", back_populates="parent", remote_side=[id])
    parent = relationship("Comment", back_populates="replies")
