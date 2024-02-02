import bcrypt

def to_hash_password(password):
    salt = bcrypt.gensalt(12)
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()

def check_password(password, hash_password):
    comp = bcrypt.checkpw(password.encode(),hash_password.encode())
    return comp