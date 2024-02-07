/*
	Esse script foi criado com o intuito de padrozinar a inserção de charts aos modais. Além de modais, a padronização feita ao charts.js e fetchers.js pode fazer com que charts sejam inseridos em qualquer campo <canvas> com a passagem do id específico.
*/

import {
	// Charts ppg 
	fetchProfessorsByCategory,
	fetchStudentsGraduated,
	//fetchListQualisProductions,
	fetch_qualis_ppg,
	fetch_indprods_ppg,
	fetchLattesUpdate,
	fetchTimesConclusions,
	fetchPartDiss,
	fetchIndCoautorias,
	fetchIndOris,
	fetchIndDistOris,
	fetchIndAuts,
	fetchIndDiss,

	// Charts index
	// index_fetchListPeriodicProductions,
	// index_fetchListBiblioProductions,
	// index_fetchListTechnicalProductions,
	// index_fetchListProductions,
	// index_fetchListStudents,
} from '/assets/js/modules/ppg/fetchers.js';

export function ShowChartInModal(idChart){
	// Armazena qual chart foi inserido ao modal para posteriormente fechar
	document.getElementById('closeChartModal').value = idChart;

	var modalTitle;
	// Cada título em um container chart deve ter formato 'modaltitle' + id da tag <canvas> onde o chart é inserido
	modalTitle = document.getElementById('modaltitle' + idChart).textContent;

	var idChartModal = idChart + 'modal';
	document.getElementById('modalTitle').innerHTML = modalTitle;
	document.getElementById('modalBody').innerHTML = `<canvas class="chart-area" id="${idChartModal}"></canvas>`;

	// Verifica qual chart deve ser inserido ao modal
	switch(idChartModal){
		// Charts ppg
		case 'chartprofessorsbycategorymodal':
			fetchProfessorsByCategory(idChartModal);
			break;

		case 'chartstudentsgraduatedmodal':
			fetchStudentsGraduated(idChartModal);
			break;

		case 'chartqualisproductionsmodal':
			fetch_qualis_ppg(idChartModal);
			break;

		case 'chartindprodsproductionsmodal':
			fetch_indprods_ppg(idChartModal);
			break;

		case 'chartlattesupdatemodal':
			fetchLattesUpdate(idChartModal);
			break;

		case 'carttempodefesamodal':
			fetchTimesConclusions(idChartModal);
			break;

		case 'chartpartdismodal':
			fetchPartDiss(idChartModal);
			break;

		case 'chartindcoautoriamodal':
			fetchIndCoautorias(idChartModal);
			break;

		case 'chartindorimodal':
			fetchIndOris(idChartModal);
			break;

		case 'chartinddistorimodal':
			fetchIndDistOris(idChartModal);
			break;

		case 'chartindautmodal':
			fetchIndAuts(idChartModal);
			break;

		case 'chartinddismodal':
			fetchIndDiss(idChartModal);
			break;

		// Charts index
		// case 'charttotalsperiodicproductionsmodal':
		// 	index_fetchListPeriodicProductions(idChartModal);
		// 	break;

		// case 'charttotalsbiblioproductionsmodal':
		// 	index_fetchListBiblioProductions(idChartModal);
		// 	break;

		// case 'charttotalstechnicalproductionsmodal':
		// 	index_fetchListTechnicalProductions(idChartModal);
		// 	break;

		// case 'charttotalproductionsmodal':
		// 	index_fetchListProductions(idChartModal);
		// 	break;

		// case 'charttotalstudentslevelmodal':
		// 	index_fetchListStudents(idChartModal);
		// 	break;
	}
}

export function InsertChartAgain(){
	var idChart;
	// Chart a ser fechado e inserido novamente à página
	idChart = document.getElementById('closeChartModal').value;

	// Verifica qual chart deve ser inserido novamente à página
	switch(idChart){
		// Charts ppg
		case 'chartprofessorsbycategory':
			fetchProfessorsByCategory(idChart);
			break;

		case 'chartstudentsgraduated':
			fetchStudentsGraduated(idChart);
			break;

		case 'chartqualisproductions':
			//fetchListQualisProductions(idChart);
			fetch_qualis_ppg(idChart);

			break;

		case 'chartindprodsproductions':
			fetch_indprods_ppg(idChart);
			break;

		case 'chartlattesupdate':
			fetchLattesUpdate(idChart);
			break;

		case 'carttempodefesa':
			fetchTimesConclusions(idChart);
			break;

		case 'chartpartdis':
			fetchPartDiss(idChart);
			break;

		case 'chartindcoautoria':
			fetchIndCoautorias(idChart);
			break;

		case 'chartindori':
			fetchIndOris(idChart);
			break;

		case 'chartinddistori':
			fetchIndDistOris(idChart);
			break;

		case 'chartindaut':
			fetchIndAuts(idChart);
			break;

		case 'chartinddis':
			fetchIndDiss(idChart);
			break;

		// Charts index
		case 'charttotalsperiodicproductions':
			index_fetchListPeriodicProductions(idChart);
			break;

		case 'charttotalsbiblioproductions':
			index_fetchListBiblioProductions(idChart);
			break;

		case 'charttotalstechnicalproductions':
			index_fetchListTechnicalProductions(idChart);
			break;

		case 'charttotalproductions':
			index_fetchListProductions(idChart);
			break;

		case 'charttotalstudentslevel':
			index_fetchListStudents(idChart);
			break;
	}
}