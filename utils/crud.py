from utils import db, schemas, security
# from utils import 
import bcrypt


DB = db.DataBase()

class Crud_user:
    def get_all_users():
        query = "select * from users"
        rows = DB.fetch_all(query)
        return rows
    
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
    
    def create_user(id, name, email, password):
        query = "INSERT INTO users VALUES (%(id)s, %(name)s, %(email)s, %(hash_password)s)"
        insert = DB.insert(query, id = id, name = name, email = email, hash_password = security.to_hash_password(password))
        return insert
    
    def verify_user(email, password):
        query = "select * from users where email = %(email)s"
        row = DB.fetch_one(query, email = email)
        if row:
            user = schemas.User(**row)
            if security.check_password(password, user.hash_password):
                return user
            return None
        return None
    
    def delete_user(id):
        query = "Delete from users where id = %(id)s"
        ret = DB.delete(query, id = id)
        return ret