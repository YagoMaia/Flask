$("#primeiro-acesso").on("click", function(e){
  document.getElementById('CPF').value = "";
  document.getElementById('IDlattes').value = "";
  document.getElementById('first-acess-invalidation').innerHTML = "";
});

$("#esqueceu-senha").on("click", function(e){
  document.getElementById('forgot-password-validation').innerHTML = "";
  document.getElementById('forgot-password-invalidation').innerHTML = "";
});

$('#loginForm').on("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value + document.getElementById('selectUniversidade').value;
  const password = document.getElementById('password').value;

  axios.post('/login-fastapi', {
    username: username,
    password: password
  }, {
    headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(response => {
      const token = response.data.access_token;
      // Save the token to use in subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      sessionStorage.setItem('token', encodeURIComponent(token))
      if (response.data.avatar !== null)
        sessionStorage.setItem('avatar', response.data.avatar);
      else sessionStorage.setItem('avatar', '/assets/img/avatars/avatar1.jpeg');
      sessionStorage.setItem('nome', response.data.nome)

      window.sessionStorage.setItem('begin', 1);

      const url = response.data.redirect;// + `?token=${encodeURIComponent(token)}`;
      // Redirect the user to the destination page
      document.location.href = url;
    })
    .catch(error => {
      console.error('Login error:', error);
      document.getElementById('login-invalidation').innerHTML = `<p>${error.response.data.detail}</p>`;
    });
});

$('#firstAcessForm').on("submit", function (event) {
  event.preventDefault();
  const cpf = document.getElementById('CPF').value;
  const idlattes = document.getElementById('IDlattes').value;

  axios.post('/api/dados/firstacess/access-token', {
    username: cpf,
    password: idlattes
  }, {
    headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(response => {
      const token = response.data.access_token;
      // Save the token to use in subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      sessionStorage.setItem('token', encodeURIComponent(token));

      if (response.data.email !== '')
        sessionStorage.setItem('email', response.data.email);
      
      const url = response.data.redirect;
      document.location.href = url;
      //document.location.href = "../../login.html";
    })
    .catch(error => {
      console.error('First Acess error:', error);
      document.getElementById('first-acess-invalidation').innerHTML = `<p>${error.response.data.detail}</p>`;
    });
});

$('#forgotPasswordForm').on('submit', function (event){
  event.preventDefault();

  const email = document.getElementById('email').value;

  axios.get('/api/dados/send-email-password-recovery/' + email,{
  }, {
    headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(response => {
      console.log(response.data.msg);

      document.getElementById('forgot-password-invalidation').innerHTML = "";
      document.getElementById("forgot-password-validation").innerHTML = "<p>E-mail enviado! Não esqueça de checar sua caixa de spam.</p>";
    })
    .catch(error => {
      console.error('Search error:', error);
      
      document.getElementById('forgot-password-validation').innerHTML = "";
      document.getElementById("forgot-password-invalidation").innerHTML = `<p>${error.response.data.detail}</p>`;
    });
});