from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from flask import Flask, request, redirect, url_for, render_template
from utils.crud import Crud_user
from utils.schemas import MyForm, FormNewWuser


app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    """
    Função executada toda vez que uma página com annotation login_required é acessada
    
    Paramêtros:
        user_id: Id do usuário para ser verificado
    """
    return Crud_user.get_user_by_id(user_id)

@app.route("/")
def index():
    """
    Renderiza o template da página index
    """
    return render_template("index.html")

@app.route("/user/<user_id>")
def wellcome_user(user_id):
    """
    Realiza a consulta no banco com o id do usuário passado e retorna uma mensagem de boas vindas com o nome do usuário
    """
    user = Crud_user.get_user_by_id(user_id)
    return f"Bem vindo, {user.name}"

# @app.route("/login", methods = ['GET','POST'])
# def login():
#     """
#     Função responsável pelo login sem o formulário WTF
#     """
#     if request.method == 'GET':
#         try:
#             return render_template("login.html", name = current_user.name)
#         except: 
#             return render_template("login.html")
#     else:
#         user = Crud_user.verify_user(request.form['email'], request.form['password'])
#         if user:
#             login_user(user)
#             return redirect(url_for('protected'))
#         return redirect(url_for("login")) #Se senha for incorreta pode colocar um alert 

@app.route("/login", methods = ['GET','POST'])
def login_wtf():
    """
    Função responsável pelo login com o formulário WTF
    """
    form = MyForm()
    if form.validate_on_submit():
        user = Crud_user.verify_user(form.email.data, form.password.data)
        if user:
            login_user(user)
            return redirect(url_for('protected'))
        return render_template("login_wtf.html", form = form, alert = "Dados incorretos")
    try:
        name = current_user.name
    except:
        name = None
    return render_template("login_wtf.html", form = form, name = name)

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
            mensagem = "Erro ao deletar usuário"
        case 'alert':
            mensagem = "Usuário deletado com suceso"
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
    return render_template("page_not_found.html"), 404

@app.route("/logout")
def logout():
    """
    Rota responsável por realizar o logout do usuário
    """
    logout_user()
    return render_template("logout.html")