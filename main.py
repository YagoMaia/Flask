from flask import Flask, url_for, request, render_template, make_response, redirect, abort, session
from markupsafe import escape

#*A Minimal Application

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p> Hello World</p>"

@app.route("/<name>")
def teste(name):
    return f"""
    <script>alert("bad")</script>
    <h1>Hello, {escape(name)}</h1>
    """
    
@app.route("/user/<username>")
def show_user_name(username):
    return f"<p>Olá meu caro, {username}, tudo bem?</p>"

@app.route("/item/<int:id1>/<int:id2>") #Funciona mudar o tipo da variavel apenas se alterar no end point, se mudar na função não altera
def show_id(id1:int, id2:int):
    soma = id1 +id2
    return f"<p>Id:{soma}</p>"

@app.route("/projects/")
def projects():
    return "The project Page"

@app.route("/about")
def about():
    return "The about page"

@app.route("/login")
def login():
    return 'Login'

@app.route("/usuario/<username>")
def profile(username):
    return f"{username}\'s profile"


# with app.test_request_context():
#     print(url_for('hello_world')) #Nome das funções dentro dos endpoinst
#     print(url_for('login'))
#     print(url_for('login', next='/'))
#     print(url_for('profile', username = 'Yago Maia'))
    
#*HTTP Methods

@app.route('/log', methods = ['GET', 'POST'])
def log():
    if request.method == 'POST':
        return "LOGIN POST"
    else:
        return "LOGIN GET"

#*Rendering Templates

@app.route("/Hey")
@app.route("/Hey/<name>")
def hey(name = None):
    return render_template('hello.html', name = name)

#*The Request Object

# @app.route('/login', methods=['POST', 'GET'])
# def login():
#     error = None
#     if request.method == 'POST':
#         if valid_login(request.form['username'],
#                        request.form['password']):
#             return log_the_user_in(request.form['username'])
#         else:
#             error = 'Invalid username/password'
#     # the code below is executed if the request method
#     # was GET or the credentials were invalid
#     return render_template('login.html', error=error)

#* Cookies

@app.route("/cookie")
def cookie():
    resp = make_response(render_template("hello.html"))
    resp.set_cookie("username", 'Yago')
    
#* Redirects and Errors

@app.route('/red')
def red():
    return redirect(url_for('abor'))

@app.route('/abor')
def abor():
    abort(404)
    
@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404

#* Sessions

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

