from fastapi import Depends, Response, Request, HTTPException, status
# from controller import token
# from uuid import uuid4
from passlib.context import CryptContext
# import redis
# from db.redis import redis as redi
from datetime import timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def login(id: str, pw: str):
    result_message = '어서오세요' + id + '님'
    return {"message": result_message}