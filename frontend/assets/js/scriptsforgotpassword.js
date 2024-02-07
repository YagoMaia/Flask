function getTokenFromURL(){
    const currentURL = window.location; console.log(currentURL);

    const access_token = new URLSearchParams(currentURL.search).get('access_token');

    console.log(currentURL);
    console.log(access_token);

    return access_token;
};

$('#recoverpasswordForm').on("submit", function (event){
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = getTokenFromURL();
    
    if(password==confirmPassword){
        axios.post('/api/dados/finish-reset-password/', {
            password: password,
            token: token
        }, {
        headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}`}
        })
        .then(response => {
            const user = response.data;
            console.log(user);
            
            const url = response.data.redirect;
            document.location.href = url;
            //document.location.href = "../../login.html";
        })
        .catch(error => {
            console.error('Change password error:', error);
            document.getElementById('password-invalidation').innerHTML = `<p>${error.response.data.detail}</p>`;
        });
    }
    else{
        document.getElementById("password-invalidation").innerHTML = "<p>As senhas devem ser iguais e terem pelo menos 6 dígitos.</p>";
    }
})
