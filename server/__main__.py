from typing import Union
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

_app = FastAPI()


@_app.get("/view")
async def get_main():
    return StaticFiles(directory='../web/dist', html=True)
