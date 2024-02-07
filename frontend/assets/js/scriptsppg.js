import '/assets/js/config.js';
import '/assets/js/waitMe.js';
import '/assets/js/theme.js';
import '/assets/js/rSlider.min.js';

import { 
	fetchInfoPPG,
	fetchListPrograms,
	fetchSliderGeral,
	//fetchListQualisProductions,
	fetch_simulacao_qualis_ppg,
	fetch_simulacao_indprods_ppg
	//fetchParamentrosSimulacao
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
});

$('#closeChartModal').click(function(event){
	event.preventDefault();

	$('#chartModal').modal('hide');
});

$('#chartModal').on('hidden.bs.modal', function() {
	InsertChartAgain();
});

$('#bt_altera_simulacoes').click(function(event){
	var checkboxes = document.getElementsByName("chkdocentes");
	var selectedCboxes = Array.prototype.slice.call(checkboxes).filter(ch => ch.checked==false);

	var blacklist = selectedCboxes.map(ch => ch.value);

	//checkboxes = document.getElementsByName("chkindprods");
	//var curvas = Array.prototype.slice.call(checkboxes).filter(ch => ch.checked==true);
	
	//fetchListQualisProductions('chartqualisproductions', 'chartindprodsproductions', blacklist, curvas); //fetchListQualisProductions('chartqualisproductions', 'chartindprodsproductions', [], ['conceito_3']);
	fetch_simulacao_qualis_ppg('chartsimulacaoqualisproductions');
	fetch_simulacao_indprods_ppg('chartsimulacaoindprodsproductions');

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

			const user = response.data;
			if (user.is_superuser === true)
				$('#link-usuarios').show()
			else $('#link-usuarios').hide()

			$("div[data-includeHTML]").each(function () {                
					$(this).load($(this).attr("data-includeHTML"));
			});

			fetchInfoPPG();
			fetchSliderGeral();
			fetchListPrograms();
			//fetchParamentrosSimulacao();
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
});


