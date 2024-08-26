from typing import Union
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os.path

_app = FastAPI()
__server__ = os.path.dirname(__file__)
__root__ = os.path.dirname(__server__)
__web__ = os.path.join(__root__, 'web', 'dist')

_app.mount('/', StaticFiles(directory=__web__, html=True, follow_symlink=True))