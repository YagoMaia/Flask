
// import { 
	
// 	fetchListPrograms,
	
// 	fetchMapa_estadual,
// 	fetchMapa_federal,
	
// } from '/assets/js/modules/ppg/fetchers.js';

// $(document).ready(function () {
// 	const url = new URL(window.location.href);
// 	const token = sessionStorage.getItem('token');

// 	axios.get('/api/dados/login/test-token', {
// 		headers: {
// 			'accept': 'application/json',
// 			'Authorization': `Bearer ${token}`
// 		}
// 	})
// 		.then(response => {
// 			const avatar = sessionStorage.getItem('avatar');
// 			const nome = sessionStorage.getItem('nome');
// 			if (avatar)
// 				$('#avatar-usuario').attr('src', avatar);
// 			if (nome === null)
// 				$('#nome-usuario').text('Usuário');
// 			$('#nome-usuario').text(nome);

// 			const user = response.data;
// 			if (user.is_superuser === true)
// 				$('#link-usuarios').show()
// 			else $('#link-usuarios').hide()

// 			fetchListPrograms();
			
// 			fetchMapa_estadual();
// 			//fetchMapa_federal();


// 		})
// 		.catch(error => {
// 			if (error.response) {
// 				// The request was made and the server responded with a status code
// 				// that falls out of the range of 2xx
// 				console.log(error.response.data);
// 				console.log(error.response.status);
// 				console.log(error.response.headers);
// 				document.location.href = 'login.html';
// 			}
// 			console.error('Error fetching test token: ', error);
// 		});
// });


