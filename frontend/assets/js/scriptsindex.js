import { 
	index_fetchGraph,
	fetchChartsIndex,
} from '/assets/js/modules/ppg/fetchers.js';

// Para modais
import{
	ShowChartInModal,
	InsertChartAgain,
} from '/assets/js/scriptsmodal.js';

$('.open-chart-modal').click(function(event){
	event.preventDefault();

	$('#chartModal').modal('show');
	// O data-value de cada link que acessa um modal deve ser o id da tag <canvas> do chart referente
	ShowChartInModal(this.getAttribute('data-value'));
})

$('#closeChartModal').click(function(event){
	event.preventDefault();

	$('#chartModal').modal('hide');
})

$('#chartModal').on('hidden.bs.modal', function() {
	InsertChartAgain();
});

$('#graph-index-button').on('click', function(){
	const value = $('#select-type-product').find(":selected").val();
	const radio = $('input[name=fonteRadioOptions]:checked').val()
	console.log(radio)
	index_fetchGraph(value, radio);
});

$(document).ready(function () {

	const url = new URL(window.location.href);
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

			fetchChartsIndex();
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
			console.error('Error fetching test token: ', error);
		});

	// if(window.sessionStorage.getItem('begin') == 1)
	// 	$('#welcomeModal').modal('show');
});

$('.close-modal').click(function(){
	$('#welcomeModal').modal('hide');
})

$('#welcomeModal').on('hidden.bs.modal', function() {
	window.sessionStorage.setItem('begin', 0);
});