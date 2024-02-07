function SetStatus(idLattes) {
  const token = sessionStorage.getItem('token');

  axios.post('/api/dados/users/set_status_user/', {
    idlattes: idLattes
  }, {
    params: {'active':true},
    headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}` }
  })
    .then(response => {
      const user = response.data;
      console.log(user.full_name, user.is_active);
    
      if (!user.is_active){
        document.getElementById('lock' + idLattes).setAttribute("class", "fas fa-user-slash");
        document.getElementById('ativo' + idLattes).innerHTML = 'Não';
        document.getElementById('lock' + idLattes).setAttribute("title", "Ativar");
      }
      else{
        document.getElementById('lock' + idLattes).setAttribute("class", "fas fa-user");
        document.getElementById('ativo' + idLattes).innerHTML = 'Sim';
        document.getElementById('lock' + idLattes).setAttribute("title", "Desativar");
      }
    })
    .catch(error => {
      console.log("Set status user error:", error);
    })
}

function GetUser(idLattes){
  const token = sessionStorage.getItem('token');

  axios.get('/api/dados/users/me', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const user = response.data;

      if(!(user.is_superuser === true)){
        axios.get(`/api/dados/users/${idLattes}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            const user = response.data;
      
            document.getElementById('editarIdLattes').value = user.idlattes;
            document.getElementById('editarFullName').value = user.full_name;
            document.getElementById('editarEmail').value = user.email;

            $('#modalEditarUsuario').modal('show');
          })
          .catch(error => {
            console.error('Get user error:', error);
          });
      }
      else{
        axios.get(`/api/dados/users/${idLattes}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            const user = response.data;
      
            document.getElementById('editarIdLattes').value = user.idlattes;
            document.getElementById('editarFullName').value = user.full_name;
            document.getElementById('editarEmail').value = user.email;

            if(user.is_superuser === true)
              document.getElementById('editarSelectPerfil').options[0].selected = true;
            else if(user.is_admin === true)
              document.getElementById('editarSelectPerfil').options[1].selected = true;
            else
              document.getElementById('editarSelectPerfil').options[2].selected = true;

            document.getElementById('editarIdIes').value = user.id_ies;
              
            $('#modalEditarUsuario').modal('show');
          })
          .catch(error => {
            console.error('Get user error:', error);
          });
      }
    })
    .catch(error => {
      console.error('Authentication error:', error);
    });
}

function DeleteUser(idLattes, nome){
  sessionStorage.setItem('idLattes', idLattes);

  document.getElementById('msgExclusao').innerHTML = `
    O usuário <strong>${nome}</strong> será excluído permanentemente do banco de dados. Deseja continuar com a operação?
  `

  $('#modalConfirmacao').modal('show');
}

// Separação do 'Ready' para maior coesão (single responsability)
function GenerateTable(){
  const token = sessionStorage.getItem('token');

  axios.get('/api/dados/users/', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const users = response.data;
      var tbody = document.getElementById("tbody-users");

      tbody.innerHTML = '';
      users.forEach((user, i) => {
        var perfil='Usuário comum';
        var row = '<tr>';

        user.email==null ? user.email='' : false;
        user.is_active ? user.is_active='Sim' : user.is_active='Não';

        if(user.is_admin===true)
          perfil = 'Administrador';
        
        if(user.is_superuser===true)
          perfil = 'Dono';

        row += `
          <td>${user.full_name}</td>
          <td>${user.idlattes}</td>
          <td>${user.email}</td>
          <td class="text-center">${perfil}</td>
          <td id="ativo${user.idlattes}" class="text-center">${user.is_active}</td>
        `;

        // Ações
        row += '<td class="text-center">'
        
        user.is_active == 'Sim' ? 
          row += `
            <a role="button" class="acoes" onclick="SetStatus('${user.idlattes}')" data-toggle="tooltip" title="Desativar"><i id="lock${user.idlattes}" class="fas fa-user"></i></a>
          `
        :
          row += `
            <a role="button" class="acoes" onclick="SetStatus('${user.idlattes}')" data-toggle="tooltip" title="Ativar"><i id="lock${user.idlattes}" class="fas fa-user-slash"></i></a>
          `
        ;
        
        row += `
          <a role="button" class="acoes" data-toggle="tooltip" title="Editar" onclick="GetUser('${user.idlattes}')"><i class="fas fa-edit fa-beat"></i></a>
          <a role="button" class="acoes" data-toggle="tooltip" title="Excluir" onclick="DeleteUser('${user.idlattes}', '${user.full_name}')"><i class="fas fa-trash"></i></a>
          <a role="button" class="acoes" data-toggle="tooltip" title="Mais"><i class="fas fa-ellipsis-v"></i></a>
        `;

        row +=  '</td>';

        row += '</tr>';

        tbody.innerHTML += row;
      });
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

      GenerateTable();

      const user = response.data;

      if(user.is_superuser === true){
        document.getElementById('superuserForm').innerHTML = `
          <div class="mb-3">
            <label for="selectPerfil" class="form-label">Tipo do perfil:</label>
            <select id="selectPerfil" class="form-select">
                <option>Dono</option>
                <option>Administrador</option>
                <option selected>Usuário comum</option>
            </select>
          </div>
          <div class="mb-3">
              <label for="idIes" class="form-label">ID IES</label>
              <input id="idIes" class="form-control" type="text">
          </div>
        `;

        document.getElementById('superuserEditForm').innerHTML = `
              <div class="mb-3">
                <label for="editarSelectPerfil" class="form-label">Tipo do perfil:</label>
                <select id="editarSelectPerfil" class="form-select">
                    <option>Dono</option>
                    <option>Administrador</option>
                    <option>Usuário comum</option>
                </select>
              </div>
              <div class="mb-3">
                  <label for="editarIdIes" class="form-label">ID IES</label>
                  <input id="editarIdIes" class="form-control" type="text">
              </div>
            `;
      }

      if(user.is_admin===false && user.is_superuser===false){
        var ele = document.getElementById('novoUsuario');
        ele.hidden = true;
      }
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

// Função de filtro aplicado apenas em Nome, ID Lattes, CPF ou E-mail
$("#search-users").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#tbody-users tr").each(function () {
    var $row = $(this);
    var $cells = $row.find("td:lt(3)"); // Seleciona as 3 primeiras colunas (índices 0 a 2)

    var rowContainsValue = false;

    $cells.each(function () {
      if ($(this).text().toLowerCase().indexOf(value) > -1) {
        rowContainsValue = true;
        return false; // Saia do loop interno se um valor for encontrado
      }
    });

    $row.toggle(rowContainsValue);
  });
});

$('#novoUsuario').on('click', function(event){
  event.preventDefault();

  $('#modalNovoUsuario').modal('show');
})

$('#modalNovoUsuario').on('hidden.bs.modal', function() {
  // Limpa inputs
  document.getElementById('cadastrarAlert').innerHTML = '';
  document.getElementById('idLattes').value = '';
  document.getElementById('fullName').value = '';
  document.getElementById('email').value = '';

  if(document.getElementById('superuserForm').textContent){
    document.getElementById('selectPerfil').options[2].selected = true;
    document.getElementById('idIes').value = '';
  }
});

$('#modalEditarUsuario').on('hidden.bs.modal', function() {
  // Limpa inputs
  document.getElementById('editarAlert').innerHTML = '';
  document.getElementById('editarIdLattes').value = '';
  document.getElementById('editarFullName').value = '';
  document.getElementById('editarEmail').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password').setAttribute('disabled', '');
  document.getElementById('checkboxPassword').checked = false;
  
  if(document.getElementById('superuserForm').textContent){
    document.getElementById('editarSelectPerfil').options[2].selected = true;
    document.getElementById('editarIdIes').value = '';
  }
});

$('#checkboxPassword').on('click', function(){
  const password = document.getElementById('password');

  if(document.getElementById('checkboxPassword').checked)
    password.removeAttribute('disabled');
  else{
    password.value = '';
    password.setAttribute('disabled', '');
  }
})

$('#cadastrar').on("submit", function (event) {
  event.preventDefault();
  const token = sessionStorage.getItem('token');

  const idLattes = document.getElementById('idLattes').value;
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  // const idIes = document.getElementById('idIes').value;

  axios.get('/api/dados/users/me', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const user = response.data;

      if(!(user.is_superuser===true)){
        axios.post('/api/dados/users/', {
            idlattes: idLattes,
            full_name: fullName,
            email: email,
            id_ies: user.id_ies
          }, {
            headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          const user = response.data;
          console.log(user);
    
          // Gera a tabela inserindo novo registro
          GenerateTable();
          // Limpa input de pesquisa para ilusão ao usuário
          document.getElementById('search-users').value = "";
    
          document.getElementById("cadastrarAlert").innerHTML = '<div class="alert alert-success alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>Usuário cadastrado com sucesso.</span></div>';
        })
        .catch(error => {
          console.error('Create user error:', error);
        
          document.getElementById("cadastrarAlert").innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>${error.response.data.detail}</span></div>`;
        });
      }
      else{
        const perfil = document.getElementById('selectPerfil').value;
        const idIes = document.getElementById('idIes').value;

        switch(perfil){
          case 'Dono':
            var is_superuser = true;
            var is_admin = true;
            break;

          case 'Administrador':
            var is_superuser = false;
            var is_admin = true;
            break;

          case 'Usuário comum':
            var is_superuser = false;
            var is_admin = false;
            break;
        }

        axios.post('/api/dados/users/', {
            idlattes: idLattes,
            full_name: fullName,
            email: email,
            is_admin: is_admin,
            is_superuser: is_superuser,
            id_ies: idIes
          }, {
            headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          const user = response.data;
          console.log(user);
    
          // Gera a tabela inserindo novo registro
          GenerateTable();
          // Limpa input de pesquisa para ilusão ao usuário
          document.getElementById('search-users').value = "";
    
          document.getElementById("cadastrarAlert").innerHTML = '<div class="alert alert-success alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>Usuário cadastrado com sucesso.</span></div>';
        })
        .catch(error => {
          console.error('Create user error:', error);
        
          document.getElementById("cadastrarAlert").innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>${error.response.data.detail}</span></div>`;
        });
      }
    })
    .catch(error => {
      console.error('Create user error:', error);
    });
});

$('#editar').on('submit', function(event){
  event.preventDefault();
  const token = sessionStorage.getItem('token');

  const idLattes = document.getElementById('editarIdLattes').value;
  const fullName = document.getElementById('editarFullName').value;
  const email = document.getElementById('editarEmail').value;
  const password = document.getElementById('password').value;

  axios.get('/api/dados/users/me', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const user = response.data;

      if(!(user.is_superuser===true)){
        axios.post('/api/dados/users/update_user/', {
            idlattes: idLattes,
            full_name: fullName,
            email: email,
            change_password: password,
            id_ies : user.id_ies
          }, {
            headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          const user = response.data;
          console.log(user);
    
          // Gera a tabela atualizando registro
          GenerateTable();
          // Limpa input de pesquisa para ilusão ao usuário
          document.getElementById('search-users').value = "";
    
          document.getElementById("editarAlert").innerHTML = '<div class="alert alert-success alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>Usuário editado com sucesso.</span></div>';
        })
        .catch(error => {
          console.error('Update user error:', error);
        
          document.getElementById("editarAlert").innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>${error.response.data.detail}</span></div>`;
        });
      }
      else{
        const perfil = document.getElementById('editarSelectPerfil').value;
        const idIes = document.getElementById('editarIdIes').value;

        switch(perfil){
          case 'Dono':
            var is_superuser = true;
            var is_admin = true;
            break;

          case 'Administrador':
            var is_superuser = false;
            var is_admin = true;
            break;

          case 'Usuário comum':
            var is_superuser = false;
            var is_admin = false;
            break;
        }

        axios.post('/api/dados/users/update_user/', {
            idlattes: idLattes,
            full_name: fullName,
            email: email,
            change_password: password,
            is_admin: is_admin,
            is_superuser: is_superuser,
            id_ies: idIes
          }, {
            headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          const user = response.data;
          console.log(user);
    
          // Gera a tabela atualizando registro
          GenerateTable();
          // Limpa input de pesquisa para ilusão ao usuário
          document.getElementById('search-users').value = "";
    
          document.getElementById("editarAlert").innerHTML = '<div class="alert alert-success alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>Usuário editado com sucesso.</span></div>';
        })
        .catch(error => {
          console.error('Update user error:', error);
        
          document.getElementById("editarAlert").innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>${error.response.data.detail}</span></div>`;
        });
      }
    })
    .catch(error => {
      console.error('Update user error:', error);
    });
})

$('#excluir').on('click', function(event){
  event.preventDefault();

  const token = sessionStorage.getItem('token');
  const idLattes = sessionStorage.getItem('idLattes');

  axios.post('/api/dados/users/delete_user/', {
    user_idlattes: idLattes,
  }, {
    headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}` }
  })
    .then(response => {
      const msg = response.data;
      
      // window.alert(msg);

      // Gera a tabela atualizando registros
      GenerateTable();
      // Limpa input de pesquisa para ilusão ao usuário
      document.getElementById('search-users').value = "";
    })
    .catch(error => {
      console.log("Delete user error:", error);
      
      // window.alert(error.response.data.detail);
    })

  $('#modalConfirmacao').modal('hide');
})