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
	//console.log(radio)
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

			const user = response.data;
			if (user.is_superuser === true)
				$('#link-usuarios').show()
			else $('#link-usuarios').hide()

			var listPrograms = undefined;
		  
			axios.get('/api/dados/ppg/geral/lista', {
			  headers: {
				'accept': 'application/json',
				'Authorization': `Bearer ${token}`
			  }
			})
			  .then(response => {
				listPrograms = response.data.programas;
				//var programas_html = document.getElementById('row-programas');

				$('#nome-ies').text(listPrograms[0].nome_ies);

				var html_temp = '';

				for (var i = 0; i < listPrograms.length; i++) {
					html_temp += `<div class="col-md-6 col-lg-4 mb-4">
									<div class="card shadow" style="border-radius: 0%;">
										<div style="min-height: 5px; background: #91b0d0"></div>
										<div class="card-body">
											<div class="card-title text-black">
												<h6>${listPrograms[i].nome.toUpperCase()}</h6>
											</div>
											<p style="font-size:11px;">${listPrograms[i].area}<p>
											<div class="row">
												<div class="col-xl-6 col-lg-6">
													<a class="btn btn-outline-primary btn-sm" role="button" href="ppg.html?id=${listPrograms[i].id}&nome=${listPrograms[i].nome.toUpperCase()}&area=${listPrograms[i].area}">Ver Gráficos</a>
												</div>
												<div class="col-xl-6 col-lg-6 text-end">
													Nota: ${listPrograms[i].nota}<!--a role="button">PYTHON</a-->
												</div>
											</div>
										</div>
									</div>
								</div>
								`;
				}
				//programas_html.innerHTML = html_temp;
				$('#row-programas').html(html_temp);

				fetchChartsIndex();
			  })
			  .catch(error => {
				console.error('Error fetching list programs: ', error);
			  });
		  
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