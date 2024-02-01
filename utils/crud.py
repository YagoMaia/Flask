from utils import db, schemas
# from utils import 
import bcrypt

DB = db.DataBase()

class Crud_user:
    
    def get_user(email):
        query =  "Select * from users where email = %(email)s" 
        row = DB.fetch_one(query, email = email)
        if row:
            user = schemas.User(**row)
            return user
        return None
    
    def get_user_by_id(id):
        query =  "Select * from users where id = %(id)s" 
        row = DB.fetch_one(query, id = id)
        if row:
            user = schemas.User(**row)
            return user
        return None
    
    def verify_user(email, password):
        # salt = bcrypt.gensalt(rounds=12)
        query = "select * from users where email = %(email)s"
        row = DB.fetch_one(query, email = email)
        if row:
            user = schemas.User(**row)
            if bcrypt.checkpw(password.encode('utf-8'), user.hash_password.encode('utf-8')):
                return user
            return None
        return None