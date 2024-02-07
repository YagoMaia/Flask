function mostrarSenha() {
    var x = document.getElementById("password");

    if(x.type === "password")
        x.type = "text";
    else
        x.type = "password";
}

function mostrarSenhas() {
    var x = document.getElementById("password");
    var y = document.getElementById("confirmPassword");

    if(x.type === "password"){
        x.type = "text";
        y.type = "text";
    }  
    else{
        x.type = "password";
        y.type = "password";
    }
}