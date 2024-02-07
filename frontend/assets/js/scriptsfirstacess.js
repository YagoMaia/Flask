obterEmail();

function obterEmail(){
    var email = sessionStorage.getItem('email');

    if(email != null){
        var posicao = email.search("@");
        var usuario = email.slice(0, posicao);

        document.getElementById('email').value = usuario;
        document.getElementById('email-obs-1').innerHTML = "* Um e-mail vinculado foi encontrado na base de dados.";
    }
}

$('#firstAcessRegisterForm').on("submit", function (event) {
    event.preventDefault();

    var usuario = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    document.getElementById('email-invalidation').innerHTML = "";
    document.getElementById('password-invalidation').innerHTML = "";
    document.getElementById('email-obs-1').innerHTML = "";

    if ((usuario.length >=1 && usuario.search("@")==-1 && usuario.search(" ")==-1)){
        const usuario_dominio = usuario + "@unimontes.br";

        if(password.length >= 6){
            if(password == confirmPassword){
                const token = sessionStorage.getItem('token');
                axios.post('/api/dados/send-email-firstacess/', {
                    username: usuario_dominio,
                    password: password
                }, {
                headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}`}
                })
                .then(response => {
                    const user = response.data;
                    // Save the token to use in subsequent requests
                    console.log(user);

                    window.alert("Um e-mail foi enviado para validação do seu cadastro. Certifique sua caixa de spam.");

                    const url = response.data.redirect;
                    document.location.href = url;
                })
                .catch(error => {
                    console.error('Create user error:', error);
                    document.getElementById('password-invalidation').innerHTML = "<p>Não foi possível criar uma conta de acesso vinculada a esse e-mail, verifique se já não foi utilizado ou tente novamente mais tarde.</p>";
                });
            }
            else
                document.getElementById('password-invalidation').innerHTML = "<p>Senhas não condizem.</p>";
        }
        else
            document.getElementById('password-invalidation').innerHTML = "<p>Senha muito curta (min. 6 dígitos).</p>";
    }
    else
        document.getElementById('email-invalidation').innerHTML = "<p>E-mail inválido!</p>";
  });
