import db
from flask_login import UserMixin

DB = db.DataBase()

class User(UserMixin):
    
    def __init__(self, email = None, hash_password = None, name = None, id = None):
        self.email = email
        self.hash_password = hash_password
        self.name = name
        self.id = id
        