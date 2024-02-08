from utils import db
from flask_login import UserMixin
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, validators, PasswordField, EmailField

DB = db.DataBase()

class MyForm(FlaskForm):
    """
    Classe responsável por criar um formulário para fazer o login
    """
    email = EmailField("Email", validators=[validators.DataRequired()])
    password = PasswordField("Senha", validators=[validators.DataRequired()]) 
    submit = SubmitField("Submit")

class FormNewWuser(FlaskForm):
    """
    Classe responsável por criar um formulário para inserir dados no usuário a ser inserido
    """
    user_id = StringField("Id Usuário", validators=[validators.DataRequired()])
    name = StringField("Nome", validators=[validators.DataRequired()])
    email = EmailField("Email", validators=[validators.DataRequired()])
    password = PasswordField("Senha", validators=[validators.DataRequired()]) 
    submit = SubmitField("Submit")

class User(UserMixin):
    """
    Classe do usuário
    """
    def __init__(self, idlattes, email, full_name, is_superuser:bool, is_admin:bool, id_ies, token = None):
        self.idlattes = idlattes
        self.email = email
        self.full_name = full_name
        #self.is_active = is_active
        self.is_superuser = is_superuser
        self.is_admin = is_admin
        self.id_ies = id_ies
        #self.hash_password = hash_password
        self.id = token
        
        