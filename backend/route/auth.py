from fastapi import APIRouter
from model import post_model
from controller import auth

router = APIRouter()

@router.post('/login')
async def login(value: post_model.Post_User):
    return await auth.login(value.user_id, value.user_pw)