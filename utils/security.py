import bcrypt

def to_hash_password(password):
    """
    Função responsável por retornar a senha hasheada
    """
    salt = bcrypt.gensalt(12)
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()

def check_password(password, hash_password):
    """
    Função responsável por retornar se a senha condiz com o hash
    """
    comp = bcrypt.checkpw(password.encode(),hash_password.encode())
    return comp