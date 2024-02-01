from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from flask import Flask, request, redirect, url_for, render_template
import flask
from utils.crud import Crud_user
# from utils.schemas import User


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
    # return Crud_user.get_user_by_id(user_id)

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

@app.route("/protected")
@login_required
def protected():
    return flask.render_template(
        "protected.html",
        user = current_user
    )

@login_manager.unauthorized_handler
def unauthorized():
    return render_template("unauthorized.html")

@app.route("/logout")
def logout():
    logout_user()
    return render_template("logout.html")