from pydantic import BaseModel

class Post_User(BaseModel):
    user_id: str
    user_pw: str