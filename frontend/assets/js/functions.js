const colors = {
  blue: {
    default: "rgba(56, 108, 185, 1)",
    half: "rgba(56, 108, 185, 0.5)",
    quarter: "rgba(56, 108, 185, 0.25)",
    zero: "rgba(56, 108, 185, 0)"
  },
  indigo: {
    default: "rgba(163, 185, 221, 1)",
    half: "rgba(163, 185, 221, 0.5)",
    quarter: "rgba(163, 185, 221, 0.25)",
    zero: "rgba(163, 185, 221, 0)"
  },
  orange: {
    default: "rgba(255, 167, 46, 1)",
    half: "rgba(255, 167, 46, 0.5)",
    quarter: "rgba(255, 167, 46, 0.25)",
    zero: "rgba(255, 167, 46, 0)"
  },
  green: {
    default: "rgba(0, 157, 124, 1)",
    half: "rgba(0, 157, 124, 0.5)",
    quarter: "rgba(0, 157, 124, 0.25)",
    zero: "rgba(0, 157, 124, 0)"
  },
  purple: {
    default: "rgba(73, 32, 124, 1)",
    half: "rgba(73, 32, 124, 0.5)",
    quarter: "rgba(73, 32, 124, 0.25)",
    zero: "rgba(73, 32, 124, 0)"
  },
  pink: {
    default: "rgba(203, 61, 171, 1)",
    half: "rgba(203, 61, 171, 0.5)",
    quarter: "rgba(203, 61, 171, 0.25)",
    zero: "rgba(203, 61, 171, 0)"
  },
  gold: {
    default: "rgba(255, 215, 0, 1)",
    half: "rgba(255, 215, 0, 0.5)",
    quarter: "rgba(255, 215, 0, 0.25)",
    zero: "rgba(255, 215, 0, 0)"
  },
  crimson: {
    default: "rgba(220, 20, 60, 1)",
    half: "rgba(220, 20, 60, 0.5)",
    quarter: "rgba(220, 20, 60, 0.25)",
    zero: "rgba(220, 20, 60, 0)"
  }
};

// Função que exporta tabela HTML para arquivo excel
function ExportTableHTMLToExcel(type, fileName) {
  var elt = document.getElementById('chartTable');
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });

  return XLSX.writeFile(wb, fileName + "." + type);
}

// Salvar chart como imagem
function SaveChart(idChart) {
  const canvas = document.getElementById(idChart);
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');

  link.href = image;
  link.download = idChart;
  link.click();
}

// Essa função gera uma tabela html a partir do Array retornado pela requisição e depois a converte para .xlsx (Salva como arquivo excel)
function ExportToExcel(url, fileName, dataSeek) {
  const token = sessionStorage.getItem('token');

  if(!dataSeek) // Seguir padrão da página ppg (url + /id_ppg + /year1 + /year2)
    url += `/${sessionStorage.getItem('id_ppg')}/${sessionStorage.getItem('year1')}/${sessionStorage.getItem('year2')}`;

  axios.get(url, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      var data;

      switch(dataSeek){ // O parâmetro dataSeek foi criado com o intuito de saber onde o Array está localizado no retorno
        case 'producoes':
          data = response.data.producoes;
          break;

        case 'discentes':
          data = response.data.discentes;
          break;

        default:
          data = response.data;
          break;
      }

      var thead = document.getElementById('chartTableHead');
      thead.innerHTML = '';
      // Insere cabeçalho da tabela a partir do atributos presentes em cada elemento do Array
      var headRow = '';
      for (var key in data[0]) {
        headRow += `<th>${key}</th>`;
      }
      headRow = '<tr>' + headRow + '</tr>';
      thead.innerHTML = headRow;

      var tbody = document.getElementById('chartTableBody');
      tbody.innerHTML = '';
      // Insere dados na tabela
      for (var i = 0; i < data.length; i++) {
        var row = '';
        for (var key in data[i]) {
            row += `<td>${data[i][key]}</td>`
        }
        tbody.innerHTML += row;
      }

      ExportTableHTMLToExcel('xlsx', 'table_' + fileName);
    })
    .catch(error => {
      console.error('Table error: ', error);
    });
}

function selectPPG(sel) {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  //const urldest = `/ppg.html?token=${encodeURIComponent(token)}&id=${sel.options[sel.selectedIndex].value}&nome=${sel.options[sel.selectedIndex].label}`;
  const urldest = `/ppg.html?id=${sel.options[sel.selectedIndex].value}&nome=${sel.options[sel.selectedIndex].label}&area=${sel.options[sel.selectedIndex].text}`;
  document.location.href = urldest;
}

function selectIndex(sel) {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  const urldest = `/home.html`;//?token=${encodeURIComponent(token)}`;
  document.location.href = urldest;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function countOccurrences(arr) {
  const counts = {};
  arr.forEach(value => {
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
}

// function testToken() {
//   const url = new URL(window.location.href);
//   const token = sessionStorage.getItem('token');
//   //const token = decodeURIComponent(url.searchParams.get('token'));

//   axios.get('http://localhost:8000/api/dados/login/test-token', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//   .then(response => {
//     const avatar = sessionStorage.getItem('avatar');
//     const nome = sessionStorage.getItem('nome');
//     if (avatar)
//       $('#avatar-usuario').attr('src', avatar);
//     if (nome === null)
//       $('#nome-usuario').text('Usuário');
//     $('#nome-usuario').text(nome);

//     const user = response.data;
//     if(user.is_superuser === true)
//       $('#link-usuarios').show()
//     else $('#link-usuarios').hide()

//   })
// 	.catch(error => {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
//       document.location.href = 'login.html';
//     } 
// 		console.error('Error fetching test token: ', error);
// 	});

// }

// function logout(event) {
//   event.preventDefault();
//   const url = new URL(window.location.href);
//   const token = decodeURIComponent(url.searchParams.get('token'));

//   axios.get('http://localhost:8000/api/dados/logout/access-token', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const url = response.data.redirect;
//       // Redirect the user to the destination page
//       document.location.href = url;
//     })
//     .catch(error => {
//       console.error('Logout error:', error);
//     });
// }

$(document).ready(function(){
  const token = sessionStorage.getItem('token');

  axios.get('/api/dados/users/me', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const user = response.data;

      var menu = document.getElementById('menu');
      menu.innerHTML = '';

      // Insere opções globais
      var opcoes = `
        <a class="dropdown-item" href="#" onclick="selectIndex(this)"><i class="fa fa-home fa-sm fa-fw me-2 text-gray-400"></i> Início</a>
      `;
      
      // Insere opções de nível admin
      //if(user.is_admin === true){
        opcoes += `
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="usuarios.html"><i class="fas fa-users-cog fa-sm fa-fw me-2 text-gray-400"></i>Usuários</a>
        `;
      //}

      // Insere opções de nível superuser
      if(user.is_superuser === true){
        opcoes += `
          <a class="dropdown-item" href="logs.html"><i class="fas fa-clock fa-sm fa-fw me-2 text-gray-400"></i>Logs</a>
          <a class="dropdown-item" href="popups.html"><i class="fas fa-window-restore fa-sm fa-fw me-2 text-gray-400"></i>Pop-Ups</a>
        `;
      }

      menu.innerHTML += opcoes;
    })
    .catch(error => {
      console.error('Link menu error:', error);
    });

})

$('#logout').click(
  function (event) {
    event.preventDefault();
    const url = new URL(window.location.href);
    const token = sessionStorage.getItem('token');//decodeURIComponent(url.searchParams.get('token'));

    axios.get('/api/dados/logout/access-token', {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const url = response.data.redirect;
        // Redirect the user to the destination page
        document.location.href = url;
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  }
);

// document.getElementById('logout').addEventListener('click', logout);

/*$('#link-usuarios').click(function (event) {
  event.preventDefault();
  const url = new URL(window.location.href);
  const token = sessionStorage.getItem('token');//decodeURIComponent(url.searchParams.get('token'));

  axios.get('/api/dados/users/me', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const user = response.data;
      if (user.is_superuser === true)
        document.location.href = '/usuarios.html';
    })
    .catch(error => {
      console.error('Logout error:', error);
    });

});*/

