from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from flask import Flask, request, redirect, url_for, render_template
from utils.crud import Crud_user
from utils.schemas import MyForm, FormNewWuser


app = Flask(__name__)
app.secret_key = "secret"

login_manager = LoginManager() #Usa session
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    try:
        return current_user.get_id(user_id)
    except:
        return Crud_user.get_user_by_id(user_id)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/user/<user_id>")
def wellcome_user(user_id):
    user = Crud_user.get_user_by_id(user_id)
    return f"Wellcome, {user.name}"

@app.route("/login", methods = ['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template("login.html")
    else:
        user = Crud_user.verify_user(request.form['email'], request.form['password'])
        if user:
            login_user(user)
            return redirect(url_for('protected'))
        return redirect(url_for("login")) #Se senha for incorreta pode colocar um alert 

@app.route("/login_wtf", methods = ['GET','POST'])
def login_wtf():
    form = MyForm()
    if form.validate_on_submit():
        user = Crud_user.verify_user(form.email.data, form.password.data)
        if user:
            login_user(user)
            return redirect(url_for('protected'))
        return render_template("login_wtf.html", form = form, alert = "Dados incorretos")
    return render_template("login_wtf.html", form = form)

@app.route("/protected")
@login_required
def protected():
    return render_template(
        "protected.html",
        user = current_user
    )

@app.route("/new_user", methods = ['GET','POST'])
@login_required
def new_user():
    form_user = FormNewWuser()
    if form_user.validate_on_submit():
        user_id = form_user.user_id.data
        email = form_user.email.data
        password = form_user.password.data
        name = form_user.name.data
        
        user_insert = Crud_user.create_user(user_id, name, email, password)
        
        if user_insert:
            return render_template("create_user.html", form = form_user, sucess = "Usuário criado com sucesso")
        return render_template("create_user.html", form = form_user, alert = "Erro ao criar usuário")  
        
    return render_template("create_user.html", form = form_user)

@app.route("/list_users", methods = ['GET','POST'])
@login_required
def list_users():
    try:
        mensagem = request.args.get('mensagem')
        tipo = request.args.get('tipo')
    except:
        mensagem = tipo = None
    rows = Crud_user.get_all_users()
    users = [dict(user) for user in rows]
    return render_template("delete_user.html", users = users, mensagem = mensagem, tipo = tipo)

@app.route("/delete_user/", methods = ['GET','POST'])
@login_required
def delete_user():
    user_id = request.args.get("user_id")
    ret = Crud_user.delete_user(user_id)
    if ret:
        return url_for("list_users", mensagem = "Usuário delete com suceso", tipo = "sucess")
    return url_for("list_users", mensagem = "Erro ao deletar usuário", tipo = "alert")
    # if ret:
    #     return render_template("delete_user.html", sucess = "Usuário deletado com sucesso")
    # return render_template("delete_user.html", alert = "Erro ao deletar usuário")
    
@login_manager.unauthorized_handler
def unauthorized():
    return render_template("unauthorized.html")

@app.route("/logout")
def logout():
    logout_user()
    return render_template("logout.html")