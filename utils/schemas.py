from utils import db
from flask_login import UserMixin
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, validators, PasswordField, EmailField

DB = db.DataBase()

class MyForm(FlaskForm):
    email = EmailField("Email", validators=[validators.DataRequired()])
    password = PasswordField("Senha", validators=[validators.DataRequired()]) 
    submit = SubmitField("Submit")

class FormNewWuser(FlaskForm):
    user_id = StringField("Id Usuário", validators=[validators.DataRequired()])
    name = StringField("Nome", validators=[validators.DataRequired()])
    email = EmailField("Email", validators=[validators.DataRequired()])
    password = PasswordField("Senha", validators=[validators.DataRequired()]) 
    submit = SubmitField("Submit")

class User(UserMixin):
    def __init__(self, email = None, hash_password = None, name = None, id = None):
        self.email = email
        self.hash_password = hash_password
        self.name = name
        self.id = id
        