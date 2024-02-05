from utils import db, schemas, security 

DB = db.DataBase()

class Crud_user:
    def get_all_users():
        """
        Função responsável por retornar todos os usuários do banco
        """
        query = "select * from users"
        rows = DB.fetch_all(query)
        return rows
    
    def get_user(email):
        """
        Função responsável por retorna um usuário usando o email para buscar no banco
        """
        query =  "Select * from users where email = %(email)s" 
        row = DB.fetch_one(query, email = email)
        if row:
            user = schemas.User(**row)
            return user
        return None
    
    def get_user_by_id(id):
        """
        Função responsável por retorna um usuário usando o id para buscar no banco
        """
        query =  "Select * from users where id = %(id)s" 
        row = DB.fetch_one(query, id = id)
        if row:
            user = schemas.User(**row)
            return user
        return None
    
    def create_user(id, name, email, password):
        """
        Função responsável por criar um novo usuário no banco
        """
        query = "INSERT INTO users VALUES (%(id)s, %(name)s, %(email)s, %(hash_password)s)"
        insert = DB.insert(query, id = id, name = name, email = email, hash_password = security.to_hash_password(password))
        return insert
    
    def verify_user(email, password):
        """
        Função responsável por realizar a verificação do usuário, verificar se existe um usuário com o email e senha correspondentes no login
        """
        query = "select * from users where email = %(email)s"
        row = DB.fetch_one(query, email = email)
        if row:
            user = schemas.User(**row)
            if security.check_password(password, user.hash_password):
                return user
            return None
        return None
    
    def delete_user(id):
        """
        Função responsável por deletar o usuário no banco de dados
        """
        query = "Delete from users where id = %(id)s"
        ret = DB.delete(query, id = id)
        return ret