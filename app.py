from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from flask import Flask, request, redirect, url_for, render_template, session
from flask_redis import FlaskRedis
from redis import Redis
from utils.crud import Crud_user
from utils.schemas import MyForm, FormNewWuser, User
from flask_cors import CORS, cross_origin
import requests

HOST_FASTAPI = "http://localhost:8000"

app = Flask(__name__, template_folder="frontend", static_folder="frontend/assets")
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['REDIS_HOST'] = 'localhost'
app.config['REDIS_PORT'] = 6379
app.config['REDIS_DB'] = 0
app.config['CORS_HEADERS'] = 'Content-Type'

redis_client = FlaskRedis(app, decode_responses = True)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_token):
    """
    Função executada toda vez que uma página com annotation login_required é acessada
    
    Paramêtros:
        user_id: Id do usuário para ser verificado
    """
    data_encode = redis_client.hgetall(f"User:{user_token}")
    return User(**data_encode)

@app.route("/")
def index():
    """
    Renderiza o template da página index
    """
    return render_template("login.html")

@app.route("/user/<user_id>")
def wellcome_user(user_id):
    """
    Realiza a consulta no banco com o id do usuário passado e retorna uma mensagem de boas vindas com o nome do usuário
    """
    user = Crud_user.get_user_by_id(user_id)
    return f"Bem vindo, {user.name}"

@app.route("/login_fastapi", methods = ['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def login_fastapi():
    if request.method == "POST":
        #request.headers.add('Access-Control-Allow-Origin', '*')
        # ret = requests.get(f"http://localhost:8000/api/dados/login/access-token/{request.form.get('username')}/{request.form.get('password')}")
        ret = requests.post(f"{HOST_FASTAPI}/api/dados/login/access-token", data={"username":request.form.get("username"), "password":request.form.get("password")})
        data = ret.json()
        data['user']['token'] = data['access_token']
        redis_client.hset(f"User:{data['access_token']}", mapping = data['user'])
        user = User(**data['user'])
        login_user(user)
        session['user'] = data['user']
        #return redirect(url_for('protected'))
        return data
        #return redirect(f"http://127.0.0.1:8000/api/dados/login/access-token/{request.form.get('username')}/{request.form.get('password')}")
        #a.headers
    #print("Algo")
    #ret =  redirect(f"http://127.0.0.1:8000/api/dados/login/access-token/{request.form.get('username')}/{request.form.get('password')}")
    
    #return "Certo"
    #return "Teste"


@app.route("/home")
@login_required
def home():
    return render_template("home.html", user = current_user)
# @app.route("/login", methods = ['GET','POST'])
# def login_wtf():
#     """
#     Função responsável pelo login com o formulário WTF
#     """
#     form = MyForm()
#     if form.validate_on_submit():
#         row = Crud_user.verify_user(form.email.data, form.password.data)
#         if row:
#             redis_client.hset(f"User:{row['id']}", mapping = row)
#             user = User(**row)
#             login_user(user)
#             return redirect(url_for('protected'))
#         return render_template("login_wtf.html", form = form, alert = "Dados incorretos")
#     try:
#         name = current_user.name
#     except:
#         name = None
#     return render_template("login_wtf.html", form = form, name = name)

@app.route("/protected")
@login_required
def protected():
    """
    Renderiza um template que para ser acessado precisa ter realizado o login
    """
    return render_template(
        "protected.html",
        user = current_user
    )

@app.route("/new_user", methods = ['GET','POST'])
@login_required
def new_user():
    """
    Rota responsável pela criação de usuários
    """
    form_user = FormNewWuser()
    if form_user.validate_on_submit():
        user_id = form_user.user_id.data
        email = form_user.email.data
        password = form_user.password.data
        name = form_user.name.data
        
        user_insert = Crud_user.create_user(user_id, name, email, password)
        
        if user_insert:
            return render_template("create_user.html", form = form_user, tipo = "sucess", mensagem = "Usuário criado com sucesso")
        return render_template("create_user.html", form = form_user, tipo = "alert", mensagem = "Erro ao criar usuário")  
        
    return render_template("create_user.html", form = form_user)

@app.route("/list_users", methods = ['GET','POST'])
@login_required
def list_users():
    """
    Rota responsável por listar todos os usuáios do banco
    """
    tipo = request.args.get('tipo')
    match tipo:
        case 'sucess':
            mensagem = "Usuário deletado com suceso"
        case 'alert':
            mensagem = "Erro ao deletar usuário"
        case 'invalid':
            mensagem = "O usuário não pode se deletar do sistema"
        case None:
            mensagem = None
    rows = Crud_user.get_all_users()
    users = [dict(user) for user in rows]
    return render_template("delete_user.html", users = users, mensagem = mensagem, tipo = tipo)

@app.route("/delete_user", methods = ['GET','POST'])
@login_required
def delete_user():
    """
    Rota responsável por deletar os usuários
    """
    user_id = request.args.get("user_id")
    if user_id == current_user.id:
        return redirect(url_for("list_users", tipo = "invalid"))
    ret = Crud_user.delete_user(user_id)
    if ret:
        return redirect(url_for("list_users", tipo = "sucess"))
    return redirect(url_for("list_users", tipo = "alert"))
    
@login_manager.unauthorized_handler
def unauthorized():
    """
    Função responsável por renderizar uma página de acesso não permitido quando o usuário tenta acessar uma página protegido sem ter feito o login
    """
    return render_template("unauthorized.html")

@app.errorhandler(404)
def page_not_found(error):
    """
    Função responsável por renderizar página de quando uma página não é encontrada
    """
    print(error)
    return "error"
    #return render_template("sobre.html"), 404

@app.route("/logout")
def logout():
    """
    Rota responsável por realizar o logout do usuário
    """
    redis_client.delete(f"User:{current_user.id}")
    logout_user()
    return render_template("logout.html")