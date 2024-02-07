function GenerateTable(){
    const token = sessionStorage.getItem('token');

    axios.get('/api/dados/popups/', {
        headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
        const popups = response.data;

        var tbody = document.getElementById('tbody-popups');
        tbody.innerHTML = '';
        for(var i=0; i<popups.length; i++){
            var row = '<tr>'
            // Inserção dos <td> aqui
            row += '</tr>'
            tbody.innerHTML += row;
        }
        })
        .catch(error => {
        console.error("Generate table error:", error);
        });
}

$(document).ready(function () {
    const token = sessionStorage.getItem('token');
  
    axios.get('/api/dados/login/test-token', {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const avatar = sessionStorage.getItem('avatar');
        const nome = sessionStorage.getItem('nome');
        if (avatar)
          $('#avatar-usuario').attr('src', avatar);
        if (nome === null)
          $('#nome-usuario').text('Usuário');
        $('#nome-usuario').text(nome);
  
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          document.location.href = 'login.html';
        }
      });
  });