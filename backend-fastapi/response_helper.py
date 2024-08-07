from typing import List, Union
from pydantic import BaseModel

class ResponseHelper:
    @staticmethod
    def success(data: Union[BaseModel, List[BaseModel]], message: str = "Success", status_code: int = 200):
        return {
            "status": "success",
            "message": message,
            "data": data,
            "status_code": status_code
        }

    @staticmethod
    def error(message: str = "An error occurred", status_code: int = 400):
        return {
            "status": "error",
            "message": message,
            "data": None,
            "status_code": status_code
        }
