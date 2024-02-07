import {
  renderChartTimesConclusions,
  renderChartStudentsGraduated,
  //renderChartQualisProductions,
  renderChartQualis_,
  renderChartQualis_simulacao,
  //renderChartIndprodsProductions,
  renderChartIndprods_,
  renderChartIndprods_simulacao,
  renderChartProfessorsByCategory,
  renderChartPartDiss,
  renderChartIndCoautorias,
  renderChartIndOris,
  renderChartIndDistOris,
  renderChartIndAuts,
  renderChartIndDiss,
  renderChartProfessorProductions,
  renderChartPositionIndProd,
  renderChartLattesUpdate,
  // index_renderChartProductions,
  // index_renderChartPeriodicProductions,
  // index_renderChartTechnicalProductions,
  // index_renderChartBiblioProductions,
  // index_renderChartStudentsLevel
  log_renderChartLogAcessos,
  log_renderChartLogGrafos
} from '/assets/js/modules/ppg/charts.js';

var nota_ppg;
var listProfs;
var year1 = 0;
var year2 = 0;

export function fetchSliderGeral() {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();

  //$( "#profile-tab" ).on( "click", function() {
  //  
  //});

  axios.get(`api/dados/ppg/geral/anos/${id_ppg}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      var rangeYears = response.data.anos;
      //year2 = rangeYears[rangeYears.length - 1];
      if (rangeYears[0] < 2013)
        rangeYears = Array.from({
          length: (rangeYears[rangeYears.length - 1] - 2013) + 1
        }, (value, index) => 2013 + index);
      new rSlider({
        target: '#slider-ppg-geral',
        values: rangeYears,
        range: true,
        tooltip: false,
        set: [rangeYears[0], rangeYears[rangeYears.length - 1]],
        onChange: (vals) => fetchCharts(vals)
        //onChange: (vals) => teste(vals)
      });
    })
    .catch(error => {
      console.error('Error fetching professors by category: ', error);
    });
}

export function fetchChartsIndex() {
  const value = $('#select-type-product').find(":selected").val();
  const radio = $('input[name=fonteRadioOptions]:checked').val()

  fetchListPrograms();
  index_sliderGraph();
  index_fetchGraph(value, radio);
  // index_fetchListProductions('charttotalproductions');
  // index_fetchListPeriodicProductions('charttotalsperiodicproductions');
  // index_fetchListTechnicalProductions('charttotalstechnicalproductions');
  // index_fetchListBiblioProductions('charttotalsbiblioproductions');
  // index_fetchListStudents('charttotalstudentslevel');
}

export function fetchChartsLogs(){
  log_fetchLogAcessos('chartlogacessos');
  log_fetchLogGrafos('chartloggrafos');
}

function fetchCharts(years) {
  const anos = years.split(',').map(Number);
  year1 = anos[0];
  year2 = anos[1];

  if (year1 > year2)
    year1 = year2;

  // Armazena no storage para facilitar o acesso no HTML
  window.sessionStorage.setItem('year1', year1);
  window.sessionStorage.setItem('year2', year2);

  fetchProfessorsByCategory('chartprofessorsbycategory');
  fetchStudentsGraduated('chartstudentsgraduated');
  fetchTimesConclusions('carttempodefesa');
  //fetchListQualisProductions('chartqualisproductions', 'chartindprodsproductions', [], []);
  fetch_qualis_ppg('chartqualisproductions');
  fetch_indprods_ppg('chartindprodsproductions');
  fetch_simulacao_qualis_ppg('chartsimulacaoqualisproductions');
  fetch_simulacao_indprods_ppg('chartsimulacaoindprodsproductions');
  fetchLattesUpdate('chartlattesupdate');
  fetchPartDiss('chartpartdis');
  fetchIndCoautorias('chartindcoautoria');
  fetchIndOris('chartindori');
  fetchIndDistOris('chartinddistori');
  fetchIndAuts('chartindaut');
  fetchIndDiss('chartinddis');
  getListProfessors();
  //fetchPositionIndProdSlider();
  fetchPositionIndProd();
  fetchProjectsData();
  fetchResearchLinesData();
  fetchProjectsResearchLinesData();
  fetchTCCsResearchLinesData();
  fetch_bancas_externos_ppg();
  //fetchLinksGraph();
  window.fetchGraph = fetchGraph
  window.fetchProfessorProducts_2 = fetchProfessorProducts_2
}

export function getTokenFromURL() {
  const url = new URL(window.location.href);
  const token = decodeURIComponent(sessionStorage.getItem('token'));//url.searchParams.get('token'));
  return token;
}

export function fetchNomePPG() {
  const url = new URL(window.location.href);
  const nome_ppg = url.searchParams.get('nome');
  return nome_ppg;
}

export function fetchIdPPG() {
  const url = new URL(window.location.href);
  const id_ppg = url.searchParams.get('id');

  // Armazena no storage para facilitar o acesso no HTML
  window.sessionStorage.setItem('id_ppg', id_ppg);
  return id_ppg;
}

export function fetchAreaPPG() {
  const url = new URL(window.location.href);
  const area_ppg = url.searchParams.get('area');
  return area_ppg;
}


export function fetchListPrograms() {
  const token = getTokenFromURL();
  var listPrograms = undefined;

  axios.get('/api/dados/ppg/geral/lista', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      listPrograms = response.data.programas;
      var select_list_programas = document.getElementById('list-programs');
      select_list_programas.innerHTML = '<option label="Selecione um programa..." selected />';
      for (var i = 0; i < listPrograms.length; i++) {
        select_list_programas.innerHTML += `<option label="${listPrograms[i].nome.toUpperCase()}" value="${listPrograms[i].id}">${listPrograms[i].area}</option>`
      }

    })
    .catch(error => {
      console.error('Error fetching list programs: ', error);
    });

}

function run_waitMe(element, text) {
  $(element).waitMe({
    //none, rotateplane, stretch, orbit, roundBounce, win8,
    //win8_linear, ios, facebook, rotation, timer, pulse,
    //progressBar, bouncePulse or img
    effect: 'bouncePulse',
    //place text under the effect (string).
    text: text,
    //background for container (string).
    bg: 'rgba(255,255,255,0.7)',
    //color for background animation and text (string).
    color: '#C0C0C0',
    //max size
    maxSize: '',
    //wait time im ms to close
    waitTime: -1,
    //url to image
    source: '',
    //or 'horizontal'
    textPos: 'vertical',
    //font size
    fontSize: '',
    // callback
    onClose: function () { }
  });
}

export function fetchInfoPPG() {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();
  var info_ppg;
  var siglas_ppg;
  var url_ppg;
  var email_ppg;

  const element = '#row-info';
  run_waitMe(element, 'Carregando informações do PPG');

  axios.get(`/api/dados/ppg/geral/info/${id_ppg}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      info_ppg = response.data.info;
      nota_ppg = response.data.nota;
      siglas_ppg = response.data.siglas;
      url_ppg = response.data.url;
      email_ppg = response.data.email;
      const nota = document.getElementById('nota');
      nota.innerHTML = '' + nota_ppg;
      const siglas = document.getElementById('nome-sigla');
      siglas.innerHTML = `${nome_ppg} (${siglas_ppg})`;
      //const nome = document.getElementById('nome-ppg');
      //nome.innerHTML = ''+nome_ppg;
      const info = document.getElementById('info');
      info.innerHTML = '' + info_ppg;
      const url = document.getElementById('url');
      url.innerHTML = `Endereço: <a href=${url_ppg} target='_blank'>${url_ppg}</a>`;
      const email = document.getElementById('email');
      email.innerHTML = 'E-mail: ' + email_ppg;
      //document.getElementById("loader-info").style.display = "none";
      //document.getElementById("info").style.display = "block";

      $(element).waitMe('hide');
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status == 404 || error.response.status == 403)
          document.location.href = 'login.html';
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      console.error('Error fetching info programs: ', error);
    });


}

export function fetchProfessorsByCategory(idCanvas) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  var listProfessors;

  const element = '#col-profcat';
  //const html_elem = document.getElementById('col-profcat');
  //html_elem.innerHTML = "";
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/docentes/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      listProfessors = response.data;
      renderChartProfessorsByCategory(idCanvas, listProfessors);
      $(element).waitMe('hide');
    })
    .catch(error => {
      console.error('Error fetching professors by category: ', error);
    });
}

// export function fetchPositionIndProdSlider() {
//   const token = getTokenFromURL();
//   const id_ppg = fetchIdPPG();

//   //$( "#profile-tab" ).on( "click", function() {
//   //  
//   //});

//   axios.get(`/api/dados/prp/geral/anos/${id_ppg}`, {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       var rangeYears = response.data.anos;
//       if (rangeYears[0] < year1)
//         rangeYears = Array.from({
//           length: (rangeYears[rangeYears.length - 1] - year1) + 1
//         }, (value, index) => year1 + index);
//       new rSlider({
//         target: '#slider-positionidprod',
//         values: rangeYears,
//         range: true,
//         tooltip: false,
//         set: [rangeYears[0], rangeYears[rangeYears.length - 1]],
//         onChange: (vals) => fetchPositionIndProd(vals)
//         //onChange: (vals) => teste(vals)
//       });
//     })
//     .catch(error => {
//       console.error('Error fetching professors by category: ', error);
//     });
// }

export function fetchPositionIndProd() {

  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  var dados;
  const area = fetchAreaPPG();

  const element = '#row-positionindprods';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/indicadores/position/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      $('#titulo-chartpositionindprod').text(`Posicionamento do PPG em relação a outros nota ${nota_ppg} da área ${area}`);
      $('#text-chartpositionindprod').text(`Comparação do indicador Média ponderada de artigos (IndArtigo) por DPs e por ano do PPG com os programas nota ${nota_ppg} no período de ${year1} - ${year2}`);
      dados = response.data;
      renderChartPositionIndProd(dados, id_ppg);
      //fetchDensityIndProds();
      $(element).waitMe('hide');
      fetchMapBrazil(dados.indprods, dados.maior_indprod, dados.menor_indprod);
    })
    .catch(error => {
      console.error('Error fetching position indprod: ', error);
    });
}

function normaliza_0_1(val, max, min) { 
  if(max - min === 0) return 1; // or 0, it's up to you
  return (val - min) / (max - min); 
}

export function fetchMapBrazil(circleCoordinates, maior, menor) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();


  // Largura e altura do SVG
  const width = 400;
  const height = 400;

  // Selecionar o elemento SVG
  const svg = d3.select("#mapa_brasil")
    .attr("width", width)
    .attr("height", height);

  // Configurar uma projeção para o mapa
  const projection = d3.geoMercator()
    .center([-55, -10])  // Coordenadas aproximadas do centro do Brasil
    .scale(500)           // Fator de escala para ajustar o tamanho do mapa
    .translate([width / 2, (height / 2) - 50]);

  // Criar um caminho de projeção
  const path = d3.geoPath().projection(projection);


  // Carregar os dados do GeoJSON
  d3.json("/assets/js/br.json").then(function (data) {
    const brazil = topojson.feature(data, data.objects.estados);

    // Renderizar o mapa do Brasil
    svg.selectAll("path")
      .data(brazil.features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", "#abc8e8")  // Cor de preenchimento do mapa
      .attr("stroke", "white"); // Cor da borda do mapa

    const zoom = d3.zoom()
      .scaleExtent([1, 8]) // Define the min and max zoom levels
      .on("zoom", zoomed);

    svg.call(zoom);


    // Create or select the tooltip element
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Renderizar os círculos e adicionar tooltips
    svg.selectAll("circle")
      .data(circleCoordinates)
      .enter().append("circle")
      .attr("cx", d => projection([d.longitude, d.latitude])[0])
      .attr("cy", d => projection([d.longitude, d.latitude])[1])
      .attr("r", d => normaliza_0_1(d.indprod,maior,menor) * 15)
      .attr("fill", function (d) {
        if (d.id === id_ppg) return "black";
        else if (d.status == "Pública Federal") return "green";
        else if (d.status == "Pública Estadual") return "blue";
        return "red";
      })
      .attr("stroke", "white")
      .attr("fill-opacity", .4)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", d => normaliza_0_1(d.indprod,maior,menor) * 20); // Increase circle size on mouseover
        tooltip
          .style("opacity", 1) // Show the tooltip
          .html(d.nome + "<br>" + d.sigla + " - " + d.status + "<br>( " + d.municipio + "/" + d.uf + " )<br>indProd: " + d.indprod.toFixed(3)) // Set tooltip text
          .style("left", (event.pageX - 80) + "px")
          .style("top", (event.pageY - 80) + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", d => normaliza_0_1(d.indprod,maior,menor) * 15); // Reset circle size on mouseout
        tooltip.style("opacity", 0); // Hide the tooltip
      });


    function zoomed(event) {

      const { transform } = event;
      try {
        svg.selectAll("path") // Select your map elements (e.g., paths)
          .attr("transform", transform); // Apply the zoom transformation

        svg.selectAll("circle")
          .attr("cx", d => transform.applyX(projection([d.longitude, d.latitude])[0]))
          .attr("cy", d => transform.applyY(projection([d.longitude, d.latitude])[1]))
          .attr("r", d => normaliza_0_1(d.indprod,maior,menor) * (15 * transform.k))
          .on("mouseover", function (event, d) {
            d3.select(this).attr("r", d => normaliza_0_1(d.indprod,maior,menor) * 20 * transform.k); // Increase circle size on mouseover
            tooltip
              .style("opacity", 1) // Show the tooltip
              .html(d.nome + "<br>" + d.sigla + " - " + d.status + "<br>( " + d.municipio + "/" + d.uf + " )<br>indProd: " + d.indprod.toFixed(3)) // Set tooltip text
              .style("left", (event.pageX - 80) + "px")
              .style("top", (event.pageY - 80) + "px");
          })
          .on("mouseout", function () {
            d3.select(this).attr("r", d => normaliza_0_1(d.indprod,maior,menor) * 15 * transform.k); // Reset circle size on mouseout
            tooltip.style("opacity", 0); // Hide the tooltip
          });
      }
      catch (e) { }
    }

    // const initialTransform = d3.zoomIdentity
    // .translate(initialX, initialY) // Initial panning position
    // .scale(initialScale); // Initial zoom scale

    // svg.call(zoom).call(zoom.transform, initialTransform);

  }).catch(error => {
    console.error('Error fetching brazil map: ', error);
  });
}


// export function fetchMapa_federal() {
//   const token = getTokenFromURL();
//   const id_ppg = fetchIdPPG();
//   const nome_ppg = fetchNomePPG();


//   // Largura e altura do SVG
//   const width = 800;
//   const height = 800;

//   // Selecionar o elemento SVG
//   const svg = d3.select("#map_federal")
//     .attr("width", width)
//     .attr("height", height);

//   // Configurar uma projeção para o mapa
//   const projection = d3.geoMercator()
//     .center([-55, -10])  // Coordenadas aproximadas do centro do Brasil
//     .scale(800)           // Fator de escala para ajustar o tamanho do mapa
//     .translate([width / 2, height / 2]);

//   // Criar um caminho de projeção
//   const path = d3.geoPath().projection(projection);


//   // Carregar os dados do GeoJSON
//   d3.json("/assets/js/br.json").then(function (data) {
//     const brazil = topojson.feature(data, data.objects.estados);

//     // Renderizar o mapa do Brasil
//     svg.selectAll("path")
//       .data(brazil.features)
//       .enter().append("path")
//       .attr("d", path)
//       .attr("fill", "green")  // Cor de preenchimento do mapa
//       .attr("stroke", "white"); // Cor da borda do mapa

//     // Coordenadas do círculo
//     const circleCoordinates = [{ status: "FEDERAL", nota: "3", lat: -1.72183, long: -48.8788 },
//     { status: "FEDERAL", nota: "3", lat: -20.4666, long: -55.7868 },
//     { status: "FEDERAL", nota: "3", lat: -7.19238, long: -48.2044 },
//     { status: "FEDERAL", nota: "4", lat: -7.19238, long: -48.2044 },
//     { status: "FEDERAL", nota: "4", lat: -28.9356, long: -49.4918 },
//     { status: "FEDERAL", nota: "4", lat: -22.3572, long: -47.3842 },
//     { status: "FEDERAL", nota: "3", lat: -31.3297, long: -54.0999 },
//     { status: "FEDERAL", nota: "3", lat: -12.1439, long: -44.9968 },
//     { status: "FEDERAL", nota: "5", lat: -1.4554, long: -48.4898 },
//     { status: "FEDERAL", nota: "7", lat: -1.4554, long: -48.4898 },
//     { status: "FEDERAL", nota: "3", lat: -1.4554, long: -48.4898 },
//     { status: "FEDERAL", nota: "4", lat: -1.4554, long: -48.4898 },
//     { status: "FEDERAL", nota: "5", lat: -1.4554, long: -48.4898 },
//     { status: "FEDERAL", nota: "5", lat: -6.74261, long: -35.5166 },
//     { status: "FEDERAL", nota: "7", lat: -6.74261, long: -35.5166 },
//     { status: "FEDERAL", nota: "3", lat: -6.74261, long: -35.5166 },
//     { status: "FEDERAL", nota: "4", lat: -6.74261, long: -35.5166 },
//     { status: "FEDERAL", nota: "5", lat: -6.74261, long: -35.5166 },
//     { status: "FEDERAL", nota: "5", lat: -9.57047, long: -36.4904 },
//     { status: "FEDERAL", nota: "7", lat: -9.57047, long: -36.4904 },
//     { status: "FEDERAL", nota: "3", lat: -9.57047, long: -36.4904 },
//     { status: "FEDERAL", nota: "4", lat: -9.57047, long: -36.4904 },
//     { status: "FEDERAL", nota: "5", lat: -9.57047, long: -36.4904 },
//     { status: "FEDERAL", nota: "4", lat: -19.9102, long: -43.9266 },
//     { status: "FEDERAL", nota: "5", lat: -19.9102, long: -43.9266 },
//     { status: "FEDERAL", nota: "4", lat: -19.9102, long: -43.9266 },
//     { status: "FEDERAL", nota: "3", lat: -19.9102, long: -43.9266 },
//     { status: "FEDERAL", nota: "4", lat: -19.9102, long: -43.9266 },
//     { status: "FEDERAL", nota: "4", lat: -29.1662, long: -51.5165 },
//     { status: "FEDERAL", nota: "3", lat: 2.82384, long: -60.6753 },
//     { status: "FEDERAL", nota: "A", lat: 2.82384, long: -60.6753 },
//     { status: "FEDERAL", nota: "4", lat: 2.82384, long: -60.6753 },
//     { status: "FEDERAL", nota: "3", lat: -7.26365, long: -36.2357 },
//     { status: "FEDERAL", nota: "A", lat: -7.26365, long: -36.2357 },
//     { status: "FEDERAL", nota: "4", lat: -7.26365, long: -36.2357 },
//     { status: "FEDERAL", nota: "3", lat: -1.06126, long: -46.7826 },
//     { status: "FEDERAL", nota: "4", lat: -15.7795, long: -47.9297 },
//     { status: "FEDERAL", nota: "4", lat: -15.7795, long: -47.9297 },
//     { status: "FEDERAL", nota: "4", lat: -15.7795, long: -47.9297 },
//     { status: "FEDERAL", nota: "3", lat: -15.7795, long: -47.9297 },
//     { status: "FEDERAL", nota: "2", lat: -15.7795, long: -47.9297 },
//     { status: "FEDERAL", nota: "5", lat: -15.7795, long: -47.9297 },
//     { status: "FEDERAL", nota: "5", lat: -15.7795, long: -47.9297 },
//     { status: "FEDERAL", nota: "5", lat: -15.7795, long: -47.9297 },
//     { status: "FEDERAL", nota: "4", lat: -15.7795, long: -47.9297 },
//     { status: "FEDERAL", nota: "5", lat: -9.95542, long: -36.7926 },
//     { status: "FEDERAL", nota: "5", lat: -20.4486, long: -54.6295 },
//     { status: "FEDERAL", nota: "3", lat: -24.0463, long: -52.378 },
//     { status: "FEDERAL", nota: "4", lat: -31.7565, long: -52.4889 },
//     { status: "FEDERAL", nota: "4", lat: -1.29797, long: -47.9167 },
//     { status: "FEDERAL", nota: "4", lat: -1.29797, long: -47.9167 },
//     { status: "FEDERAL", nota: "4", lat: -18.1656, long: -47.944 },
//     { status: "FEDERAL", nota: "4", lat: -18.1656, long: -47.944 },
//     { status: "FEDERAL", nota: "3", lat: -18.1656, long: -47.944 },
//     { status: "FEDERAL", nota: "4", lat: -28.1463, long: -54.7428 },
//     { status: "FEDERAL", nota: "4", lat: -19.0077, long: -57.651 },
//     { status: "FEDERAL", nota: "5", lat: -15.601, long: -56.0974 },
//     { status: "FEDERAL", nota: "4", lat: -25.4195, long: -49.2646 },
//     { status: "FEDERAL", nota: "4", lat: -25.4195, long: -49.2646 },
//     { status: "FEDERAL", nota: "5", lat: -25.4195, long: -49.2646 },
//     { status: "FEDERAL", nota: "3", lat: -25.4195, long: -49.2646 },
//     { status: "FEDERAL", nota: "3", lat: -18.2413, long: -43.6031 },
//     { status: "FEDERAL", nota: "4", lat: -18.2413, long: -43.6031 },
//     { status: "FEDERAL", nota: "4", lat: -18.2413, long: -43.6031 },
//     { status: "FEDERAL", nota: "3", lat: -22.2231, long: -54.812 },
//     { status: "FEDERAL", nota: "4", lat: -22.2231, long: -54.812 },
//     { status: "FEDERAL", nota: "4", lat: -22.2231, long: -54.812 },
//     { status: "FEDERAL", nota: "4", lat: -22.2231, long: -54.812 },
//     { status: "FEDERAL", nota: "4", lat: -27.6364, long: -52.2697 },
//     { status: "FEDERAL", nota: "5", lat: -27.5945, long: -48.5477 },
//     { status: "FEDERAL", nota: "2", lat: -27.5945, long: -48.5477 },
//     { status: "FEDERAL", nota: "7", lat: -27.5945, long: -48.5477 },
//     { status: "FEDERAL", nota: "A", lat: -3.71664, long: -38.5423 },
//     { status: "FEDERAL", nota: "3", lat: -3.71664, long: -38.5423 },
//     { status: "FEDERAL", nota: "3", lat: -3.71664, long: -38.5423 },
//     { status: "FEDERAL", nota: "4", lat: -3.71664, long: -38.5423 },
//     { status: "FEDERAL", nota: "3", lat: -3.71664, long: -38.5423 },
//     { status: "FEDERAL", nota: "3", lat: -3.71664, long: -38.5423 },
//     { status: "FEDERAL", nota: "4", lat: -25.5427, long: -54.5827 },
//     { status: "FEDERAL", nota: "4", lat: -25.5427, long: -54.5827 },
//     { status: "FEDERAL", nota: "4", lat: -16.6864, long: -49.2643 },
//     { status: "FEDERAL", nota: "3", lat: -16.6864, long: -49.2643 },
//     { status: "FEDERAL", nota: "4", lat: -16.6864, long: -49.2643 },
//     { status: "FEDERAL", nota: "4", lat: -16.6864, long: -49.2643 },
//     { status: "FEDERAL", nota: "A", lat: -16.6864, long: -49.2643 },
//     { status: "FEDERAL", nota: "2", lat: -16.6864, long: -49.2643 },
//     { status: "FEDERAL", nota: "3", lat: -18.8545, long: -41.9555 },
//     { status: "FEDERAL", nota: "4", lat: -5.51847, long: -47.4777 },
//     { status: "FEDERAL", nota: "3", lat: -7.33167, long: -35.3317 },
//     { status: "FEDERAL", nota: "3", lat: -10.6826, long: -37.4273 },
//     { status: "FEDERAL", nota: "A", lat: -14.7876, long: -39.2781 },
//     { status: "FEDERAL", nota: "4", lat: -22.4225, long: -45.4598 },
//     { status: "FEDERAL", nota: "3", lat: -17.8784, long: -51.7204 },
//     { status: "FEDERAL", nota: "4", lat: -17.8784, long: -51.7204 },
//     { status: "FEDERAL", nota: "6", lat: -7.11509, long: -34.8641 },
//     { status: "FEDERAL", nota: "2", lat: -7.11509, long: -34.8641 },
//     { status: "FEDERAL", nota: "4", lat: -7.11509, long: -34.8641 },
//     { status: "FEDERAL", nota: "3", lat: -9.41622, long: -40.5033 },
//     { status: "FEDERAL", nota: "4", lat: -9.41622, long: -40.5033 },
//     { status: "FEDERAL", nota: "5", lat: -21.7595, long: -43.3398 },
//     { status: "FEDERAL", nota: "4", lat: -25.4077, long: -52.4109 },
//     { status: "FEDERAL", nota: "3", lat: -21.248, long: -45.0009 },
//     { status: "FEDERAL", nota: "4", lat: -21.248, long: -45.0009 },
//     { status: "FEDERAL", nota: "3", lat: 0.034934, long: -51.0694 },
//     { status: "FEDERAL", nota: "2", lat: -9.66599, long: -35.735 },
//     { status: "FEDERAL", nota: "2", lat: -9.66599, long: -35.735 },
//     { status: "FEDERAL", nota: "1", lat: -3.11866, long: -60.0212 },
//     { status: "FEDERAL", nota: "4", lat: -3.11866, long: -60.0212 },
//     { status: "FEDERAL", nota: "3", lat: -5.38075, long: -49.1327 },
//     { status: "FEDERAL", nota: "A", lat: -5.38075, long: -49.1327 },
//     { status: "FEDERAL", nota: "4", lat: -5.38075, long: -49.1327 },
//     { status: "FEDERAL", nota: "4", lat: -25.2977, long: -54.0943 },
//     { status: "FEDERAL", nota: "3", lat: -18.7302, long: -47.4912 },
//     { status: "FEDERAL", nota: "3", lat: -16.7282, long: -43.8578 },
//     { status: "FEDERAL", nota: "4", lat: -5.18374, long: -37.3474 },
//     { status: "FEDERAL", nota: "4", lat: -5.79357, long: -35.1986 },
//     { status: "FEDERAL", nota: "4", lat: -5.79357, long: -35.1986 },
//     { status: "FEDERAL", nota: "3", lat: -5.79357, long: -35.1986 },
//     { status: "FEDERAL", nota: "4", lat: -22.8832, long: -43.1034 },
//     { status: "FEDERAL", nota: "5", lat: -22.8832, long: -43.1034 },
//     { status: "FEDERAL", nota: "5", lat: -22.8832, long: -43.1034 },
//     { status: "FEDERAL", nota: "4", lat: -22.8832, long: -43.1034 },
//     { status: "FEDERAL", nota: "2", lat: -22.8832, long: -43.1034 },
//     { status: "FEDERAL", nota: "4", lat: -22.8832, long: -43.1034 },
//     { status: "FEDERAL", nota: "5", lat: -22.8832, long: -43.1034 },
//     { status: "FEDERAL", nota: "3", lat: -22.7556, long: -43.4603 },
//     { status: "FEDERAL", nota: "3", lat: -22.7556, long: -43.4603 },
//     { status: "FEDERAL", nota: "2", lat: -20.5263, long: -43.6962 },
//     { status: "FEDERAL", nota: "2", lat: -6.6958, long: -36.9428 },
//     { status: "FEDERAL", nota: "2", lat: -9.15884, long: -37.3556 },
//     { status: "FEDERAL", nota: "A", lat: -20.3796, long: -43.512 },
//     { status: "FEDERAL", nota: "4", lat: -26.4839, long: -51.9888 },
//     { status: "FEDERAL", nota: "5", lat: -26.4839, long: -51.9888 },
//     { status: "FEDERAL", nota: "4", lat: -26.4839, long: -51.9888 },
//     { status: "FEDERAL", nota: "4", lat: -10.24, long: -48.3558 },
//     { status: "FEDERAL", nota: "5", lat: -10.24, long: -48.3558 },
//     { status: "FEDERAL", nota: "4", lat: -10.24, long: -48.3558 },
//     { status: "FEDERAL", nota: "4", lat: -27.9007, long: -53.3134 },
//     { status: "FEDERAL", nota: "5", lat: -31.7649, long: -52.3371 },
//     { status: "FEDERAL", nota: "3", lat: -9.38866, long: -40.5027 },
//     { status: "FEDERAL", nota: "4", lat: -9.38866, long: -40.5027 },
//     { status: "FEDERAL", nota: "7", lat: -22.52, long: -43.1926 },
//     { status: "FEDERAL", nota: "6", lat: -30.0318, long: -51.2065 },
//     { status: "FEDERAL", nota: "5", lat: -30.0318, long: -51.2065 },
//     { status: "FEDERAL", nota: "7", lat: -30.0318, long: -51.2065 },
//     { status: "FEDERAL", nota: "3", lat: -30.0318, long: -51.2065 },
//     { status: "FEDERAL", nota: "4", lat: -16.4435, long: -39.0643 },
//     { status: "FEDERAL", nota: "0", lat: -8.76077, long: -63.8999 },
//     { status: "FEDERAL", nota: "4", lat: -8.76077, long: -63.8999 },
//     { status: "FEDERAL", nota: "1", lat: -8.76077, long: -63.8999 },
//     { status: "FEDERAL", nota: "4", lat: -8.76077, long: -63.8999 },
//     { status: "FEDERAL", nota: "3", lat: -8.04666, long: -34.8771 },
//     { status: "FEDERAL", nota: "4", lat: -8.04666, long: -34.8771 },
//     { status: "FEDERAL", nota: "3", lat: -8.04666, long: -34.8771 },
//     { status: "FEDERAL", nota: "3", lat: -8.02529, long: -50.0317 },
//     { status: "FEDERAL", nota: "3", lat: -8.02529, long: -50.0317 },
//     { status: "FEDERAL", nota: "3", lat: -4.21587, long: -38.7277 },
//     { status: "FEDERAL", nota: "3", lat: -4.21587, long: -38.7277 },
//     { status: "FEDERAL", nota: "4", lat: -15.2483, long: -58.1259 },
//     { status: "FEDERAL", nota: "2", lat: -15.2483, long: -58.1259 },
//     { status: "FEDERAL", nota: "4", lat: -9.97499, long: -67.8243 },
//     { status: "FEDERAL", nota: "2", lat: -9.97499, long: -67.8243 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "6", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "6", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "5", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "5", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "3", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "5", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -22.9129, long: -43.2003 },
//     { status: "FEDERAL", nota: "4", lat: -32.0349, long: -52.1071 },
//     { status: "FEDERAL", nota: "3", lat: -11.7271, long: -61.7714 },
//     { status: "FEDERAL", nota: "A", lat: -16.4673, long: -54.6372 },
//     { status: "FEDERAL", nota: "5", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "4", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "3", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "4", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "4", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "3", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "4", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "5", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "4", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "4", lat: -12.9718, long: -38.5011 },
//     { status: "FEDERAL", nota: "5", lat: -29.6868, long: -53.8149 },
//     { status: "FEDERAL", nota: "4", lat: -29.6868, long: -53.8149 },
//     { status: "FEDERAL", nota: "3", lat: -29.6868, long: -53.8149 },
//     { status: "FEDERAL", nota: "3", lat: -29.6868, long: -53.8149 },
//     { status: "FEDERAL", nota: "5", lat: -29.6868, long: -53.8149 },
//     { status: "FEDERAL", nota: "5", lat: -5.83802, long: -35.6914 },
//     { status: "FEDERAL", nota: "4", lat: -5.83802, long: -35.6914 },
//     { status: "FEDERAL", nota: "3", lat: -5.83802, long: -35.6914 },
//     { status: "FEDERAL", nota: "3", lat: -5.83802, long: -35.6914 },
//     { status: "FEDERAL", nota: "5", lat: -5.83802, long: -35.6914 },
//     { status: "FEDERAL", nota: "3", lat: -2.43849, long: -54.6996 },
//     { status: "FEDERAL", nota: "3", lat: -2.43849, long: -54.6996 },
//     { status: "FEDERAL", nota: "4", lat: -23.6737, long: -46.5432 },
//     { status: "FEDERAL", nota: "3", lat: -23.6737, long: -46.5432 },
//     { status: "FEDERAL", nota: "4", lat: -23.6737, long: -46.5432 },
//     { status: "FEDERAL", nota: "5", lat: -23.6737, long: -46.5432 },
//     { status: "FEDERAL", nota: "6", lat: -23.6737, long: -46.5432 },
//     { status: "FEDERAL", nota: "4", lat: -7.22016, long: -36.6213 },
//     { status: "FEDERAL", nota: "3", lat: -7.22016, long: -36.6213 },
//     { status: "FEDERAL", nota: "4", lat: -7.22016, long: -36.6213 },
//     { status: "FEDERAL", nota: "5", lat: -7.22016, long: -36.6213 },
//     { status: "FEDERAL", nota: "6", lat: -7.22016, long: -36.6213 },
//     { status: "FEDERAL", nota: "A", lat: -29.8268, long: -50.5175 },
//     { status: "FEDERAL", nota: "5", lat: -23.9535, long: -46.335 },
//     { status: "FEDERAL", nota: "3", lat: -23.9535, long: -46.335 },
//     { status: "FEDERAL", nota: "5", lat: -23.6914, long: -46.5646 },
//     { status: "FEDERAL", nota: "4", lat: -22.0174, long: -47.886 },
//     { status: "FEDERAL", nota: "5", lat: -22.0174, long: -47.886 },
//     { status: "FEDERAL", nota: "4", lat: -27.0798, long: -53.0037 },
//     { status: "FEDERAL", nota: "5", lat: -27.0798, long: -53.0037 },
//     { status: "FEDERAL", nota: "4", lat: -11.0084, long: -37.2044 },
//     { status: "FEDERAL", nota: "2", lat: -11.0084, long: -37.2044 },
//     { status: "FEDERAL", nota: "4", lat: -11.0084, long: -37.2044 },
//     { status: "FEDERAL", nota: "3", lat: -21.1311, long: -44.2526 },
//     { status: "FEDERAL", nota: "6", lat: -21.1311, long: -44.2526 },
//     { status: "FEDERAL", nota: "5", lat: -23.1896, long: -45.8841 },
//     { status: "FEDERAL", nota: "3", lat: -2.53874, long: -44.2825 },
//     { status: "FEDERAL", nota: "3", lat: -2.53874, long: -44.2825 },
//     { status: "FEDERAL", nota: "4", lat: -2.53874, long: -44.2825 },
//     { status: "FEDERAL", nota: "4", lat: -18.7214, long: -39.8579 },
//     { status: "FEDERAL", nota: "4", lat: -23.5329, long: -46.6395 },
//     { status: "FEDERAL", nota: "2", lat: -23.5329, long: -46.6395 },
//     { status: "FEDERAL", nota: "3", lat: -22.7526, long: -43.7155 },
//     { status: "FEDERAL", nota: "4", lat: -22.7526, long: -43.7155 },
//     { status: "FEDERAL", nota: "3", lat: -22.7526, long: -43.7155 },
//     { status: "FEDERAL", nota: "4", lat: -11.8604, long: -55.5091 },
//     { status: "FEDERAL", nota: "3", lat: -23.4969, long: -47.4451 },
//     { status: "FEDERAL", nota: "A", lat: -17.5399, long: -39.74 },
//     { status: "FEDERAL", nota: "3", lat: -17.8595, long: -41.5087 },
//     { status: "FEDERAL", nota: "3", lat: -5.09194, long: -42.8034 },
//     { status: "FEDERAL", nota: "3", lat: -5.09194, long: -42.8034 },
//     { status: "FEDERAL", nota: "3", lat: -22.7421, long: -46.3728 },
//     { status: "FEDERAL", nota: "3", lat: -24.7246, long: -53.7412 },
//     { status: "FEDERAL", nota: "4", lat: -19.7472, long: -47.9381 },
//     { status: "FEDERAL", nota: "3", lat: -21.5556, long: -45.4364 },
//     { status: "FEDERAL", nota: "3", lat: -20.3155, long: -40.3128 },
//     { status: "FEDERAL", nota: "3", lat: -22.5202, long: -44.0996 }];

//     // Renderizar um círculo nas coordenadas especificadas
//     svg.selectAll("circle")
//       .data(circleCoordinates)
//       .enter().append("circle")
//       .attr("cx", d => projection([d.long, d.lat])[0])
//       .attr("cy", d => projection([d.long, d.lat])[1])
//       .attr("r", 5)  // Raio do círculo
//       .attr("fill", function (d) {
//         if (d.status == 'FEDERAL') return 'blue';
//         else if (d.status == 'ESTADUAL') return 'red';
//       })  // Cor de preenchimento do círculo
//       .attr("stroke", "white"); // Cor da borda do círculo
//   });
// }
export function fetchTCCsResearchLinesData() {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  axios.get(`/api/dados/ppg/bancas/tccs/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const data = response.data;
      const elem = document.getElementById('charttccsresearchlinesdata');
      elem.innerHTML = "";

      //console.log(data.nodes.length/100);

      //const links = data.links.map(d => ({ ...d }));
      //const nodes = data.nodes.map(d => ({ ...d }));


      var margin = { top: 10, right: 10, bottom: 10, left: 10 };
      var width = 800 - margin.left - margin.right;
      var height = 400 - margin.top - margin.bottom;


      //console.log(height);

      const svg = d3.select("#charttccsresearchlinesdata").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      const sankey = d3.sankey()
        .nodeId(d => d.name)
        .nodeAlign(d3.sankeyLeft)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);

      const { nodes, links } = sankey({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
      });

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const rect = svg.append("g")
        .attr("stroke", "#000")
        .selectAll()
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      rect.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("fill", (d) => {
          if (d.category === 'linha')
            return color(d.name);
          return color(d.category);
        })
        .attr("stroke", "#000");

      rect.append("title")
        .text(d => {

          return `${d.name}:\n${d.value}`
        });

      const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .enter()
        .append("g")
        .style("mix-blend-mode", "multiply");

      link.append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", (d) => {
          if (d.target.category === 'linha')
            return color(d.target.name);
          return color(d.target.category);
        })
        .attr("stroke-width", d => Math.max(1, d.width));

      link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

      svg.append("g")
        .selectAll()
        .data(nodes)
        .enter()
        .append("text")
        .attr("font-size", 10)
        .attr("x", d => {
          if (d.category === 'subtipo')
            return d.x0 - 8;
          return d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6;
        })
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => {
          if (d.category === 'subtipo')
            return "end";
          return d.x0 < width / 2 ? "start" : "end";
        })
        .text(d => {
          return d.name;
        });


    });
}

export function fetchResearchLinesData() {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  axios.get(`/api/dados/ppg/projetos/producaolinha/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const data = response.data;
      const elem = document.getElementById('chartresearchlinesdata');
      elem.innerHTML = "";

      //console.log(data.nodes.length/100);

      //const links = data.links.map(d => ({ ...d }));
      //const nodes = data.nodes.map(d => ({ ...d }));


      var margin = { top: 10, right: 10, bottom: 10, left: 10 };
      var width = 800 - margin.left - margin.right;
      var height = 400 - margin.top - margin.bottom;


      //console.log(height);

      const svg = d3.select("#chartresearchlinesdata").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      const sankey = d3.sankey()
        .nodeId(d => d.name)
        .nodeAlign(d3.sankeyLeft)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);

      const { nodes, links } = sankey({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
      });

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const rect = svg.append("g")
        .attr("stroke", "#000")
        .selectAll()
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      rect.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("fill", (d) => {
          if (d.category === 'linha')
            return color(d.name);
          return color(d.category);
        })
        .attr("stroke", "#000");

      rect.append("title")
        .text(d => {

          return `${d.name}:\n${d.value}`
        });

      const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .enter()
        .append("g")
        .style("mix-blend-mode", "multiply");

      link.append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", (d) => {
          if (d.target.category === 'linha')
            return color(d.target.name);
          return color(d.target.category);
        })
        .attr("stroke-width", d => Math.max(1, d.width));

      link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

      svg.append("g")
        .selectAll()
        .data(nodes)
        .enter()
        .append("text")
        .attr("font-size", 10)
        .attr("x", d => {
          if (d.category === 'subtipo')
            return d.x0 - 8;
          return d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6;
        })
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => {
          if (d.category === 'subtipo')
            return "end";
          return d.x0 < width / 2 ? "start" : "end";
        })
        .text(d => {
          return d.name;
        });


    });
}

export function fetchProjectsResearchLinesData() {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  axios.get(`/api/dados/ppg/projetos/projetolinha/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const data = response.data;
      const elem = document.getElementById('chartprojectsresearchlinesdata');
      elem.innerHTML = "";

      //console.log(data.nodes.length/100);

      //const links = data.links.map(d => ({ ...d }));
      //const nodes = data.nodes.map(d => ({ ...d }));


      var margin = { top: 10, right: 10, bottom: 10, left: 10 };
      var width = 800 - margin.left - margin.right;
      var height = 800 - margin.top - margin.bottom;


      //console.log(height);

      const svg = d3.select("#chartprojectsresearchlinesdata").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      const sankey = d3.sankey()
        .nodeId(d => d.name)
        .nodeAlign(d3.sankeyLeft)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);

      const { nodes, links } = sankey({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
      });

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const rect = svg.append("g")
        .attr("stroke", "#000")
        .selectAll()
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      rect.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("fill", (d) => {
          if (d.category === 'linha')
            return color(d.name);
          return color(d.category);
        })
        .attr("stroke", "#000");

      rect.append("title")
        .text(d => {
          if (d.value == 50)
            return `${d.name}:\n+ de ${d.value} trabalhos`;
          else if (d.value == 1)
            return `${d.name}`;
          return `${d.name}:\n${d.value}`
        });

      const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .enter()
        .append("g")
        .style("mix-blend-mode", "multiply");

      link.append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", (d) => {
          if (d.target.category === 'linha')
            return color(d.target.name);
          return color(d.target.category);
        })
        .attr("stroke-width", d => Math.max(1, d.width));

      link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

      svg.append("g")
        .selectAll()
        .data(nodes)
        .enter()
        .append("text")
        .attr("font-size", 10)
        .attr("x", d => {

          return d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6;
        })
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => {

          return d.x0 < width / 2 ? "start" : "end";
        })
        .text(d => {
          if (d.category === 'projeto')
            if (d.name.length > 40) {
              return d.name.substring(0, 40) + '...'; // Retorna os primeiros 20 caracteres
            } else {
              return d.name; // Se a string for menor ou igual a 20 caracteres, retorna a string original
            }
          return d.name;
        });


    });
}

export function fetchProjectsData() {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  axios.get(`/api/dados/ppg/projetos/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const data = response.data;
      const elem = document.getElementById('chartprojectsdata');
      elem.innerHTML = "";


      //const links = data.links.map(d => ({ ...d }));
      //const nodes = data.nodes.map(d => ({ ...d }));


      var margin = { top: 10, right: 10, bottom: 10, left: 10 };
      var width = 800 - margin.left - margin.right;
      var height = 0;

      var tamanho_card = (1800 * (data.nodes.length / 180));
      if (tamanho_card < 1800)
        height = 1800 - margin.top - margin.bottom;
      else height = tamanho_card - margin.top - margin.bottom;



      const svg = d3.select("#chartprojectsdata").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      const sankey = d3.sankey()
        .nodeId(d => d.name)
        .nodeAlign(d3.sankeyLeft)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);

      const { nodes, links } = sankey({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
      });

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const rect = svg.append("g")
        .attr("stroke", "#000")
        .selectAll()
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      rect.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("fill", (d) => color(d.category))
        .attr("stroke", "#000");

      rect.append("title")
        .text(d => {
          if (d.name.startsWith('projeto'))
            return `${d.name}: ${d.titulo}`;
          else if (d.name == 'graduação' || d.name == 'mestrado' || d.name == 'doutorado')
            return `Alunos de ${d.name} participantes:\n${d.value}`;
          else if (d.name == 'com produção' || d.name == 'sem produção')
            return `${d.name} associada:\n${d.value}`;
          return `${d.name}:\n${d.value}`
        });

      const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .enter()
        .append("g")
        .style("mix-blend-mode", "multiply");

      link.append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", (d) => color(d.target.category))
        .attr("stroke-width", d => Math.max(1, d.width));

      link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

      svg.append("g")
        .selectAll()
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => {
          if (d.name.startsWith('projeto')) return '';
          return d.name;
        });


    });
}

function fetchDensityIndProds() {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  axios.get(`/api/dados/prp/geral/indprod/densidade/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const data = response.data;

      //const elem = document.getElementById('chartdensityppgs');
      //elem.innerHTML = "";

      //var containerWidth = +d3.select('#chartdensityppgs').style('width').slice(0, -2)
      //var containerHeight= +d3.select('#chartdensityppgs').style('height').slice(0, -2)
      const margin = { top: 10, right: 40, bottom: 70, left: 40 },
        width = 300 - margin.left - margin.right,
        height = 590 - margin.bottom + 20;

      // append the svg object to the body of the page
      const svg = d3.select("#chartdensityppgs")
        .append("svg")
        .attr('viewBox', [0, 0, width, height + margin.top + margin.bottom])
        .attr('preserveAspectRatio', 'none')
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 'translate(50, 30)');//`translate(${margin.left},${margin.top})`);

      svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("fill", "#808080")
        .attr("font-size", 11)
        .text("indprod");

      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -40)
        .attr("x", -height / 2 + 40)
        .attr("dy", ".75em")
        .attr("fill", "#808080")
        .attr("font-size", 11)
        .attr("transform", "rotate(-90)")
        .text("nota");

      // Add X axis
      const x = d3.scaleLinear()
        .domain([0, 4])
        .range([margin.left, width - margin.right]);
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .attr("color", "#808080");

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([3, 7])
        .range([height - margin.bottom, margin.top]);
      svg.append("g")
        .call(d3.axisLeft(y))
        .attr("color", "#808080");

      // Prepare a color palette
      const color = d3.scaleLinear()
        .domain([0, 0.06]) // Points per square pixel.
        .range(["white", "#7393B3"]);

      // compute the density data
      const densityData = d3.contourDensity()
        .x(function (d) {
          return x(d.indprodall);
        })
        .y(function (d) { return y(d.nota); })
        .size([width, height])
        .bandwidth(20)
        (data);

      const densityData_ppgs = d3.contourDensity()
        .x(function (d) {
          if (d.id === id_ppg)
            return x(d.indprodall);
        })
        .y(function (d) {
          if (d.id === id_ppg)
            return y(d.nota);

        })
        .size([width, height])
        .bandwidth(0.2)
        (data);

      // svg.insert("g", "g")
      // .selectAll("text")
      // .data(densityData_ppgs)
      // .enter().append("text")
      // .attr("d", d3.geoPath())
      // .text("teste");

      svg.insert("g", "g")
        .selectAll("path")
        .data(densityData_ppgs)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", function (d) {
          return 'red';
        });

      // show the shape!
      svg.insert("g", "g")
        .selectAll("path")
        .data(densityData)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", function (d) {
          return color(d.value);
        });



      //     svg.append("text")
      // .attr("x", function(d) { return d.x })
      // .attr("y", function(d) { return d.y })
      // .attr("dy", ".35em")
      // .text(function(d) { return d; });

    }).catch(error => {
      console.error('Error fetching graph: ', error);
    });
}


export function fetchTimesConclusions(idCanvas) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  var timesConclusions;

  const element = '#row-tempodefesa';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/indicadores/tempo/conclusoes/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      timesConclusions = response.data;
      renderChartTimesConclusions(idCanvas, timesConclusions);
      $(element).waitMe('hide');
    })
    .catch(error => {
      console.error('Error fetching list students: ', error);
    });
}

export function fetchStudentsGraduated(idCanvas) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  var listStudents;

  const element = '#col-disctit';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/docentes/discentes/titulados/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      listStudents = response.data;
      renderChartStudentsGraduated(idCanvas, listStudents);
      $(element).waitMe('hide');
    })
    .catch(error => {
      console.error('Error fetching list students: ', error);
    });
}

// export function fetchParamentrosSimulacao() {
//   const token = getTokenFromURL();
//   const id_ppg = fetchIdPPG();
//   var ano_atual = new Date().getFullYear()

//   var localyear = year2;
//   if (year2 === ano_atual)
//     localyear = year2 - 1;

//   axios.get(`/api/dados/prp/geral/indprod/avg/${id_ppg}/${year1}/${localyear}`, {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const listAvgIndProds = response.data;
//       var ele_indprds = document.getElementById('indprods-simulacao');
//       var str_opcoes = '<p>Comparar com: </p>';

//       for (var i = parseInt(listAvgIndProds['conceito']); i <= parseInt(listAvgIndProds['maxima']); i++) {
//         if (i == parseInt(listAvgIndProds['conceito']))
//           str_opcoes += `<div class="form-check form-switch">
//                           <input class="form-check-input" name="chkindprods" type="checkbox" id="conceito_${i}" value="conceito_${i}" checked>
//                           <label class="form-check-label" for="media_indprod_${i - parseInt(listAvgIndProds['conceito'])}">Média nacional dos programas nota ${i}</label>
//                       </div>`;
//         else
//           str_opcoes += `<div class="form-check form-switch">
//                             <input class="form-check-input" name="chkindprods" type="checkbox" id="conceito_${i}" value="conceito_${i}">
//                             <label class="form-check-label" for="media_indprod_${i - parseInt(listAvgIndProds['conceito'])}">Média nacional dos programas nota ${i}</label>
//                         </div>`;
//       }

//       str_opcoes += `<div class="form-check form-switch">
//                         <input class="form-check-input" name="chkindprods" type="checkbox" id="país" value="país">
//                         <label class="form-check-label" for="media_indprod_5">Média dos programas do país</label>
//                     </div>
//                       <div class="form-check form-switch">
//                         <input class="form-check-input" name="chkindprods" type="checkbox" id="região" value="região">
//                         <label class="form-check-label" for="media_indprod_6">Média dos programas da região ${listAvgIndProds['nome_regiao']}</label>
//                       </div>
//                       <div class="form-check form-switch">
//                         <input class="form-check-input" name="chkindprods" type="checkbox" id="uf" value="uf">
//                         <label class="form-check-label" for="media_indprod_7">Média dos programas do estado ${listAvgIndProds['nome_uf']}</label>
//                       </div>`;

//       ele_indprds.innerHTML = str_opcoes;

//     })
//     .catch(error => {
//       throw error;
//     });
// }

export function fetch_bancas_externos_ppg() {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  //var ano_atual = 2023;//new Date().getFullYear()

  //var localyear = year2;
 // if (year2 === ano_atual)
  //  localyear = year2 - 1;

  
      axios.get(`/api/dados/ppg/bancas/bancas/externos/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const info_bancas = response.data;
        
        $('#quantidade_bancas').html(`Quantidade de bancas no período: <strong>${info_bancas.quantidade_bancas}</strong>`);
        $('#quantidade_internos').html(`Quantidade média de docentes internos por banca: <strong>${(info_bancas.quantidade_internos/info_bancas.quantidade_bancas).toFixed(2)}<s/trong>`);
        $('#quantidade_externos').html(`Quantidade média de participantes externos por banca: <strong>${(info_bancas.quantidade_externos/info_bancas.quantidade_bancas).toFixed(2)}</strong>`);

        $('#pertence_ppg_sim').html(`Sim: ${info_bancas.participa_ppg['Sim']}`);
        $('#pertence_ppg_nao').html(`Não: ${info_bancas.participa_ppg['Não']}`);
        $('#quantidade_permanentes').html(`Permanentes: ${info_bancas.tipo_participacao_ppg.Permanente}`);
        $('#quantidade_colaboradores').html(`Colaboradores: ${info_bancas.tipo_participacao_ppg.Colaborador}`);
        $('#quantidade_visitantes').html(`Visitantes: ${info_bancas.tipo_participacao_ppg.Visitante}`);
        $('#tabela_grau_academico').html('');
        var tableBody = $('#tabela_grau_academico');
        $.each(info_bancas.grau_academico, function (key, value) {
          var row = "<tr><td class='table-light'>" + key + ": " + value + "</td></tr>";
          tableBody.append(row);
        });
        
        $('#tabela_pais_origem').html('');
        tableBody = $('#tabela_pais_origem');
        $.each(info_bancas.pais_origem, function (key, value) {
          var row = "<tr><td class='table-light'>" + key + ": " + value + "</td></tr>";
          tableBody.append(row);
        });

        $('#tabela_pais_titulacao').html('');
        tableBody = $('#tabela_pais_titulacao');
        $.each(info_bancas.pais_titulacao, function (key, value) {
          var row = "<tr><td class='table-light'>" + key + ": " + value + "</td></tr>";
          tableBody.append(row);
        });

        $('#tabela_area_titulacao').html('');
        tableBody = $('#tabela_area_titulacao');
        $.each(info_bancas.area_titulacao, function (key, value) {
          var row = "<tr><td class='table-light'>" + key + ": " + value + "</td></tr>";
          tableBody.append(row);
        });

      })
      .catch(error => {
        console.error('Error fetching list qualis: ', error);
      });
  
}

export function fetch_qualis_ppg(idCanvasQualis) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-qualis';
  $(element).waitMe('show');
  run_waitMe(element, 'Carregando gráfico');

  //var ano_atual = 2023;//new Date().getFullYear()

  //var localyear = year2;
  //if (year2 === ano_atual)
  //  localyear = year2 - 1;

  
      axios.get(`/api/dados/ppg/indicadores/artigosqualis/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const listQualisProductions = response.data.produtos;
        renderChartQualis_(idCanvasQualis, listQualisProductions);
        $(element).waitMe('hide');
      })
      .catch(error => {
        console.error('Error fetching list qualis: ', error);
      });
  
}

export function fetch_simulacao_qualis_ppg(idCanvasQualis) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-simulacao-qualis';
  $(element).waitMe('show');
  run_waitMe(element, 'Carregando gráfico');

  // var ano_atual = 2023;//new Date().getFullYear()

  // var localyear = year2;
  // if (year2 === ano_atual)
  //   localyear = year2 - 1;

  var checkboxes = document.getElementsByName("chkdocentes");
  var selectedCboxes = Array.prototype.slice.call(checkboxes).filter(ch => ch.checked == false);

  var blacklist = selectedCboxes.map(ch => ch.value);

  if (blacklist.length === 0) {
      axios.get(`/api/dados/ppg/indicadores/artigosqualis/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const listQualisProductions = response.data.produtos;
        renderChartQualis_simulacao(idCanvasQualis, listQualisProductions);
        $(element).waitMe('hide');
      })
      .catch(error => {
        console.error('Error fetching list qualis: ', error);
      });
  }
  else {
      axios.post(`/api/dados/ppg/indicadores/artigosqualis/${id_ppg}/${year1}/${year2}`, {
        "lista_negra": blacklist
      }, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const listQualisProductions = response.data.produtos;
        renderChartQualis_simulacao(idCanvasQualis, listQualisProductions);
        $(element).waitMe('hide');
      })
      .catch(error => {
        console.error('Error fetching list qualis: ', error);
      });

  }
  
}

function insere_tabela(lista, anofinal) {
  const nome_ppg = fetchNomePPG();
  var tabela = document.getElementById('tabela-indprods');

  // const chaves = lista['rotulos'];
  // var anos = [...new Set(Object.keys(lista.indprods))].sort();

  // tabela.innerHTML = ''; 

  // var html = '';

  // anos.forEach(function(ano, i) {
  //   if(ano !== anofinal.toString()){
  //     html+=`
  //       <div class="container">
  //       <div class="row">
  //           <div class="col">
  //               <div class="card">
  //                   <div class="card-body">
  //                       <h4 class="card-title">${ano}</h4>
  //                       <div class="table-responsive text-start">
  //                           <table class="table table-sm">
  //                               <thead>
  //                                   <tr>
  //                                       <th>Programas</th>
  //                                       <th>IndProdArt</th>
  //                                       <th># Docentes</th>
  //                                   </tr>
  //                               </thead>
  //                               <tbody>`;


  //     html += `<tr>
  //           <td>${nome_ppg}</td>
  //           <td>${lista['indprods'][ano].toFixed(3)}</td>
  //           <td>${lista['permanentes'][ano]}</td>
  //         </tr>`;

  //     for(let i = 0; i < chaves.length; i++ ) { 
  //       lista[chaves[i]].forEach(function(item, k) {
  //         if(ano === item.ano.toString()){
  //           if(chaves[i] === 'região')
  //             html += `<tr>
  //                 <td>${lista['nome_regiao']}</td>
  //                 <td>${item.indprodall.toFixed(3)}</td>
  //                 <td>${item.permanentes.toFixed(3)}</td>
  //             </tr>`;
  //           else if(chaves[i] === 'país')
  //             html += `<tr>
  //                       <td>País</td>
  //                       <td>${item.indprodall.toFixed(3)}</td>
  //                       <td>${item.permanentes.toFixed(3)}</td>
  //                   </tr>`;
  //           else 
  //             html += `<tr>
  //                     <td>Nota ${chaves[i]}</td>
  //                     <td>${item.indprodall.toFixed(3)}</td>
  //                     <td>${item.permanentes.toFixed(3)}</td>
  //                 </tr>`;
  //         }
  //       });
          
  //     }
                                      
                                      
  //       html += `                 </tbody>
  //                             </table>
  //                         </div>
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //       </div>`;

  //   }
  // });

  // tabela.innerHTML += html;    

}

export function fetch_indprods_ppg(idCanvasIndprods) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-indprod';
  run_waitMe(element, 'Carregando gráfico');

  // var ano_atual = 2023;//new Date().getFullYear()

  // var localyear = year2;
  // if (year2 === ano_atual)
  //   localyear = year2 - 1;

  
      axios.get(`/api/dados/ppg/indicadores/indprodart/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const listAvgIndProds = response.data.indprod;
        const indicadores = response.data.indicadores;
        renderChartIndprods_(idCanvasIndprods, listAvgIndProds, indicadores);
        $(element).waitMe('hide');
        //insere_tabela(listAvgIndProds,ano_atual);
        $('#formula_indprod').html(`IndProdArt = (${listAvgIndProds.formula.A1}*A1 + ${listAvgIndProds.formula.A2}*A2 + ${listAvgIndProds.formula.A3}*A3
          + ${listAvgIndProds.formula.A4}*A4 + ${listAvgIndProds.formula.B1}*B1
          + ${listAvgIndProds.formula.B2}*B2 + ${listAvgIndProds.formula.B3}*B3 + ${listAvgIndProds.formula.B4}*B4)/DP`);
      })
      .catch(error => {
        console.error('Error fetching list indprods: ', error);
      });
  
}

export function fetch_simulacao_indprods_ppg(idCanvasIndprods) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-simulacao-indprod';
  $(element).waitMe('show');
  run_waitMe(element, 'Carregando gráfico');

  //var ano_atual = 2023;//new Date().getFullYear()

  //var localyear = year2;
  //if (year2 === ano_atual)
  //  localyear = year2 - 1;

  var checkboxes = document.getElementsByName("chkdocentes");
  var selectedCboxes = Array.prototype.slice.call(checkboxes).filter(ch => ch.checked == false);

  var blacklist = selectedCboxes.map(ch => ch.value);

  if (blacklist.length === 0) {
      axios.get(`/api/dados/ppg/indicadores/indprodart/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const listAvgIndProds = response.data.indprod;
        const indicadores = response.data.indicadores;
        renderChartIndprods_simulacao(idCanvasIndprods, listAvgIndProds, indicadores);
        $(element).waitMe('hide');
        //insere_tabela(listAvgIndProds,ano_atual);
        $('#formula_indprod_simulacao').html(`IndProdArt = (${listAvgIndProds.formula.A1}*A1 + ${listAvgIndProds.formula.A2}*A2 + ${listAvgIndProds.formula.A3}*A3
          + ${listAvgIndProds.formula.A4}*A4 + ${listAvgIndProds.formula.B1}*B1
          + ${listAvgIndProds.formula.B2}*B2 + ${listAvgIndProds.formula.B3}*B3 + ${listAvgIndProds.formula.B4}*B4)/DP`);
      })
      .catch(error => {
        console.error('Error fetching list indprods: ', error);
      });
  }
  else {
      axios.post(`/api/dados/ppg/indicadores/indprodart/${id_ppg}/${year1}/${year2}`, {
        "lista_negra": blacklist
      }, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const listAvgIndProds = response.data.indprod;
        const indicadores = response.data.indicadores;
        renderChartIndprods_simulacao(idCanvasIndprods, listAvgIndProds, indicadores);
        $(element).waitMe('hide');
        //insere_tabela(listAvgIndProds, ano_atual);
        $('#formula_indprod_simulacao').html(`IndProdArt = (${listAvgIndProds.formula.A1}*A1 + ${listAvgIndProds.formula.A2}*A2 + ${listAvgIndProds.formula.A3}*A3
          + ${listAvgIndProds.formula.A4}*A4 + ${listAvgIndProds.formula.B1}*B1
          + ${listAvgIndProds.formula.B2}*B2 + ${listAvgIndProds.formula.B3}*B3 + ${listAvgIndProds.formula.B4}*B4)/DP`);
      })
      .catch(error => {
        console.error('Error fetching list indprods: ', error);
      });
  }
  
}



// export function fetchListQualisProductions(idCanvasQualis, idCanvasIndprods, blacklist, curvas) {
//   const token = getTokenFromURL();
//   const id_ppg = fetchIdPPG();
//   const nome_ppg = fetchNomePPG();

//   const element = '#row-qualis';
//   run_waitMe(element, 'Carregando gráfico');

//   var ano_atual = new Date().getFullYear()

//   var localyear = year2;
//   if (year2 === ano_atual)
//     localyear = year2 - 1;

//   axios.get(`/api/dados/prp/geral/producoes/periodicos/qualis/${id_ppg}/${year1}/${localyear}`, {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const listQualisProductions = response.data.produtos;
//       const listPermanentes = response.data.permanentes;
//       axios.get(`/api/dados/prp/geral/indprod/avg/${id_ppg}/${year1}/${localyear}`, {
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       })
//         .then(response => {
//           const listAvgIndProds = response.data;

//           var checkboxes = document.getElementsByName("chkindprods");
//           if (curvas.length == 0)
//             checkboxes[0].checked = true;

//           checkboxes = Array.prototype.slice.call(checkboxes).filter(ch => ch.checked == true);
//           curvas = checkboxes.map(ch => ch.value);

//           //renderChartIndProds();
//           renderChartQualisProductions(idCanvasQualis, listQualisProductions, blacklist);
//           renderChartIndprodsProductions(idCanvasIndprods, listQualisProductions, listPermanentes, listAvgIndProds, blacklist, curvas);
//           $(element).waitMe('hide');

//         }).catch(error => {
//           console.error('Error fetching list indprods: ', error);
//         });

//     })
//     .catch(error => {
//       console.error('Error fetching list qualis: ', error);
//     });

// }

export function fetchPartDiss(idCanvas) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-partdiss';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/indicadores/partdis/avg/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const listAvgPartDiss = response.data;
      axios.get(`/api/dados/ppg/indicadores/partdis/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          const listPartDiss = response.data.partdis;
          const indicadores = response.data.indicadores;
          renderChartPartDiss(idCanvas, listPartDiss, listAvgPartDiss, indicadores, nota_ppg);
          $(element).waitMe('hide');
        })
        .catch(error => {
          throw error;
        });
    }).catch(error => {
      console.error('Error fetching list partdiss: ', error);
    });
}

export function fetchIndCoautorias(idCanvas) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-indcoautorias';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/indicadores/indcoautoria/avg/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const listAvgIndCoautorias = response.data;
      axios.get(`/api/dados/ppg/indicadores/indcoautoria/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          const listIndCoautorias = response.data.indcoaut;
          const indicadores = response.data.indicadores;
          renderChartIndCoautorias(idCanvas, listIndCoautorias, listAvgIndCoautorias, indicadores, nota_ppg);
          $(element).waitMe('hide');
        })
        .catch(error => {
          throw error;
        });
    }).catch(error => {
      console.error('Error fetching list indcoautoria: ', error);
    });
}

export function fetchIndOris(idCanvas) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-indori';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/indicadores/indori/avg/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const listAvgIndOris = response.data;
      axios.get(`/api/dados/ppg/indicadores/indori/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          const listIndOris = response.data.indori;
          const indicadores = response.data.indicadores;
          renderChartIndOris(idCanvas, listIndOris, listAvgIndOris, indicadores, nota_ppg);
          $(element).waitMe('hide');
        })
        .catch(error => {
          throw error;
        });
    }).catch(error => {
      console.error('Error fetching list indoris: ', error);
    });
}

export function fetchIndDistOris(idCanvas) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-inddistori';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/indicadores/inddistori/avg/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const listAvgIndDistOris = response.data;
      axios.get(`/api/dados/ppg/indicadores/inddistori/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          const listIndDistOris = response.data.inddistori;
          const indicadores = response.data.indicadores;
          renderChartIndDistOris(idCanvas, listIndDistOris, listAvgIndDistOris, indicadores, nota_ppg);
          $(element).waitMe('hide');
        })
        .catch(error => {
          throw error;
        });
    }).catch(error => {
      console.error('Error fetching list inddistoris: ', error);
    });
}

export function fetchIndAuts(idCanvas) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-indaut';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/indicadores/indaut/avg/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const listAvgIndAuts = response.data;
      axios.get(`/api/dados/ppg/indicadores/indaut/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          const listIndAuts = response.data.indaut;
          const indicadores = response.data.indicadores;
          renderChartIndAuts(idCanvas, listIndAuts, listAvgIndAuts, indicadores, nota_ppg);
          $(element).waitMe('hide');
        })
        .catch(error => {
          throw error;
        });
    }).catch(error => {
      console.error('Error fetching list indauts: ', error);
    });
}

export function fetchIndDiss(idCanvas) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  const element = '#col-inddis';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/indicadores/inddis/avg/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const listAvgIndDiss = response.data;
      axios.get(`/api/dados/ppg/indicadores/inddis/${id_ppg}/${year1}/${year2}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          const listIndDiss = response.data.inddis;
          const indicadores = response.data.indicadores;
          renderChartIndDiss(idCanvas, listIndDiss, listAvgIndDiss, indicadores, nota_ppg);
          $(element).waitMe('hide');
        })
        .catch(error => {
          throw error;
        });
    }).catch(error => {
      console.error('Error fetching list inddiss: ', error);
    });
}

//************************************************* TABELA DE PROFESSORES */
export function fetchProfessorProducts_2(num_prof, nome, id_ppg, year1, year2, text_qualis) {
  const token = getTokenFromURL();

  // axios.get(`/api/dados/prp/geral/producoes/${num_prof}/${id_ppg}/${year1}/${year2}`, {
  //   headers: {
  //     'accept': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   }
  // })
  //   .then(response => {
  //     const produtos = response.data;
  //     app.$options.methods.renderChartProfessorProductions(produtos);
  //   }).catch(error => {
  //     console.error('Error fetching range years: ', error);
  //   });

  // axios.get(`/api/dados/prp/geral/orientados/${num_prof}/${id_ppg}/${year1}/${year2}`, {
  //   headers: {
  //     'accept': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   }
  // })
  //   .then(response => {
  if (listProfs !== undefined) {
    const produtos = listProfs['produtos'];
    renderChartProfessorProductions(produtos[num_prof]);
    const dados = listProfs['orientados'][num_prof];

    var bt_verlattes = document.getElementById('bt_verlattes');
    $('#bt_verlattes').click(function () {
      var url = `http://lattes.cnpq.br/${num_prof}`;
      var width = 800;
      var height = 600;
      var left = (window.screen.width - width) / 2;
      var top = (window.screen.height - height) / 2;
      window.open(url, "Popup", "width=" + width + ", height=" + height + ", left=" + left + ", top=" + top);
    })

    var div_num_prof = document.getElementById('nome-prof');
    const names = nome.trim().split(' ');

    // Extract the first name
    const firstName = names[0];

    // Extract the last names and get the initials
    const lastNames = names.slice(1);
    const initials = lastNames.map(lastName => lastName.charAt(0).toUpperCase());

    // Combine the first name with the last names' initials
    div_num_prof.innerText = `Docente: ${firstName} ${initials.join('. ')}.`;

    /*********************************** 
     * O array 'dados' contém 4 dicionarios: 2 primeiros para doutorado (conclusoes dentro e fora do prazo) e 2 últimos para mestrado (conclusoes dentro e fora do prazo)
     * 
     * As barras de progresso dependem das variáveis:
     * ---------------------------------------------
     * d_dtitulados = DOUTORADO TITULADO DENTRO DO PRAZO
     * d_ftitulados = DOUTORADO TITULADO FORA DO PRAZO
     * d_atitulados = ABANDONOU DOUTORADO (DESLIGADO OU DESISTIU)
     * m_dtitulados = MESTRADO TITULADO DENTRO DO PRAZO
     * m_ftitulados = MESTRADO TITULADO FORA DO PRAZO
     * m_atitulados = ABANDONOU MESTRADO (DESLIGADO OU DESISTIU)
     * 
     */
    const d_dtitulados = dados[0].TITULADO + dados[0]['MUDANCA DE NÍVEL COM DEFESA'];
    const d_ftitulados = dados[1].TITULADO + dados[1]['MUDANCA DE NÍVEL COM DEFESA'];
    const d_atitulados = dados[0].DESLIGADO + dados[1].DESLIGADO + dados[0].ABANDONOU + dados[1].ABANDONOU;

    const m_dtitulados = dados[2].TITULADO + dados[2]['MUDANCA DE NÍVEL COM DEFESA'];
    const m_ftitulados = dados[3].TITULADO + dados[3]['MUDANCA DE NÍVEL COM DEFESA'];
    const m_atitulados = dados[2].DESLIGADO + dados[3].DESLIGADO + dados[2].ABANDONOU + dados[3].ABANDONOU;

    //<div id="pb-mestrado-dentro" class="progress-bar bg-primary" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;"><span class="visually-hidden">60%</span></div>
    var div_mest_dentro = document.getElementById('pb-mestrado-dentro');
    var span_mest_dentro = document.getElementById('span-mestrado-dentro');

    var div_mest_fora = document.getElementById('pb-mestrado-fora');
    var span_mest_fora = document.getElementById('span-mestrado-fora');

    var div_mest_desligado = document.getElementById('pb-mestrado-desligado');
    var span_mest_desligado = document.getElementById('span-mestrado-desligado');

    var total_mest = m_dtitulados + m_ftitulados + m_atitulados;
    var perc;
    //console.log(total_mest);
    if (total_mest > 0) {
      perc = ((m_dtitulados * 100) / total_mest);
      div_mest_dentro.setAttribute('aria-valuenow', perc);
      div_mest_dentro.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_mest_dentro.innerHTML = '' + (perc.toFixed(2)) + '%';

      perc = ((m_ftitulados * 100) / total_mest);
      div_mest_fora.setAttribute('aria-valuenow', perc);
      div_mest_fora.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_mest_fora.innerHTML = '' + (perc.toFixed(2)) + '%';

      perc = ((m_atitulados * 100) / total_mest);
      div_mest_desligado.setAttribute('aria-valuenow', perc);
      div_mest_desligado.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_mest_desligado.innerHTML = '' + (perc.toFixed(2)) + '%';
    }
    else {
      perc = 0.0;
      div_mest_dentro.setAttribute('aria-valuenow', perc);
      div_mest_dentro.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_mest_dentro.innerHTML = '' + (perc.toFixed(2)) + '%';

      div_mest_fora.setAttribute('aria-valuenow', perc);
      div_mest_fora.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_mest_fora.innerHTML = '' + (perc.toFixed(2)) + '%';

      div_mest_desligado.setAttribute('aria-valuenow', perc);
      div_mest_desligado.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_mest_desligado.innerHTML = '' + (perc.toFixed(2)) + '%';
    }
    var span = document.getElementById('qdade-orientados-mestrado');
    span.innerHTML = '' + total_mest;

    var div_dot_dentro = document.getElementById('pb-doutorado-dentro');
    var span_dot_dentro = document.getElementById('span-doutorado-dentro');

    var div_dot_fora = document.getElementById('pb-doutorado-fora');
    var span_dot_fora = document.getElementById('span-doutorado-fora');

    var div_dot_desligado = document.getElementById('pb-doutorado-desligado');
    var span_dot_desligado = document.getElementById('span-doutorado-desligado');

    var total_dot = d_dtitulados + d_ftitulados + d_atitulados;
    //console.log(total_mest);
    if (total_dot > 0) {
      perc = ((d_dtitulados * 100) / total_dot);
      div_dot_dentro.setAttribute('aria-valuenow', perc);
      div_dot_dentro.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_dot_dentro.innerHTML = '' + (perc.toFixed(2)) + '%';

      perc = ((d_ftitulados * 100) / total_dot);
      div_dot_fora.setAttribute('aria-valuenow', perc);
      div_dot_fora.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_dot_fora.innerHTML = '' + (perc.toFixed(2)) + '%';

      perc = ((d_atitulados * 100) / total_mest);
      div_dot_desligado.setAttribute('aria-valuenow', perc);
      div_dot_desligado.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_dot_desligado.innerHTML = '' + (perc.toFixed(2)) + '%';
    }
    else {
      perc = 0.0;
      div_dot_dentro.setAttribute('aria-valuenow', perc);
      div_dot_dentro.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_dot_dentro.innerHTML = '' + (perc.toFixed(2)) + '%';

      div_dot_fora.setAttribute('aria-valuenow', perc);
      div_dot_fora.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_dot_fora.innerHTML = '' + (perc.toFixed(2)) + '%';

      div_dot_desligado.setAttribute('aria-valuenow', perc);
      div_dot_desligado.style = 'width: ' + (perc.toFixed(2)) + '%';
      span_dot_desligado.innerHTML = '' + (perc.toFixed(2)) + '%';
    }
    span = document.getElementById('qdade-orientados-doutorado');
    span.innerHTML = '' + total_dot;

  }
  // }).catch(error => {
  //   console.error('Error fetching range years: ', error);
  // });
}

function getListProfessors() {
  const token = getTokenFromURL();

  const id_ppg = fetchIdPPG();
  //console.log(listProfs);

  const element = '#row-professores';
  run_waitMe(element, 'Carregando gráfico');

  axios.get(`/api/dados/ppg/docentes/lista/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      $('#text-professores').text(`Professores no período de ${year1} à ${year2}`)
      //$('#nome-prof').text("Informações do docente")

      var divinfoprof = document.getElementById('row-infoprof');
      divinfoprof.innerHTML = `<div class="card shadow mb-4"
                                  style="max-width: none;width: auto;height: auto;">
                                  <div class="card-body" style="height: auto;width: auto;">
                                      <h6 class="text-primary card-title fw-bold m-0"
                                          id="nome-prof" style="padding-bottom: 12px;">Informações
                                          do docente</h6>
                                      <h1 class="text-secondary card-subtitle fw-bold m-0"
                                          style="font-size: 12px;padding-bottom: 12px;">
                                          Orientações Concluídas (FONTE: Sucupira)</h1>
                                      <div class="row">
                                          <div class="col-xl-6 col-lg-6 mt-3">
                                              <div class="card"
                                                  style="height: 204.375px;width: auto;">
                                                  <div class="card-body"
                                                      style="height: 268.375px;">
                                                      <h4 class="small fw-bold"
                                                          style="font-size: 16px;color: var(--bs-primary-text-emphasis);padding-bottom: 6px;">
                                                          Mestrado<span class="float-end"
                                                              id="qdade-orientados-mestrado">--</span>
                                                      </h4>
                                                      <h4 class="small fw-bold"
                                                          style="font-size: 11px;">Dentro do
                                                          prazo<span class="float-end"
                                                              id="span-mestrado-dentro">0%</span>
                                                      </h4>
                                                      <div class="progress mb-4">
                                                          <div class="progress-bar bg-primary"
                                                              aria-valuenow="0" aria-valuemin="0"
                                                              aria-valuemax="100"
                                                              id="pb-mestrado-dentro"
                                                              style="width: 0%;"><span
                                                                  class="visually-hidden">0%</span>
                                                          </div>
                                                      </div>
                                                      <h4 class="small fw-bold"
                                                          style="font-size: 11px;margin-top: -10px;">
                                                          Fora do prazo<span class="float-end"
                                                              id="span-mestrado-fora">0%</span>
                                                      </h4>
                                                      <div class="progress mb-4">
                                                          <div class="progress-bar bg-danger"
                                                              aria-valuenow="0" aria-valuemin="0"
                                                              aria-valuemax="100"
                                                              id="pb-mestrado-fora"
                                                              style="width: 0%;"><span
                                                                  class="visually-hidden">0%</span>
                                                          </div>
                                                      </div>
                                                      <h4 class="small fw-bold"
                                                          style="font-size: 11px;margin-top: -10px;">
                                                          Desligados<span class="float-end"
                                                              id="span-mestrado-desligado">0%</span>
                                                      </h4>
                                                      <div class="progress mb-4">
                                                          <div class="progress-bar bg-warning"
                                                              aria-valuenow="0" aria-valuemin="0"
                                                              aria-valuemax="100"
                                                              id="pb-mestrado-desligado"
                                                              style="width: 0%;"><span
                                                                  class="visually-hidden">0%</span>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col-xl-6 col-lg-6 mt-3">
                                              <div class="card"
                                                  style="height: 204.375px;width: auto;">
                                                  <div class="card-body"
                                                      style="height: 268.375px;">
                                                      <h4 class="small fw-bold"
                                                          style="font-size: 16px;color: var(--bs-primary-text-emphasis);padding-bottom: 6px;">
                                                          Doutorado<span class="float-end"
                                                              id="qdade-orientados-doutorado">--</span>
                                                      </h4>
                                                      <h4 class="small fw-bold"
                                                          style="font-size: 11px;">Dentro do
                                                          prazo<span class="float-end"
                                                              id="span-doutorado-dentro">0%</span>
                                                      </h4>
                                                      <div class="progress mb-4">
                                                          <div class="progress-bar bg-primary"
                                                              aria-valuenow="0" aria-valuemin="0"
                                                              aria-valuemax="100"
                                                              id="pb-doutorado-dentro"
                                                              style="width: 0%;"><span
                                                                  class="visually-hidden">0%</span>
                                                          </div>
                                                      </div>
                                                      <h4 class="small fw-bold"
                                                          style="font-size: 11px;margin-top: -10px;">
                                                          Fora do prazo<span class="float-end"
                                                              id="span-doutorado-fora">0%</span>
                                                      </h4>
                                                      <div class="progress mb-4">
                                                          <div class="progress-bar bg-danger"
                                                              aria-valuenow="0" aria-valuemin="0"
                                                              aria-valuemax="100"
                                                              id="pb-doutorado-fora"
                                                              style="width: 0%;"><span
                                                                  class="visually-hidden">0%</span>
                                                          </div>
                                                      </div>
                                                      <h4 class="small fw-bold"
                                                          style="font-size: 11px;margin-top: -10px;">
                                                          Desligados<span class="float-end"
                                                              id="span-doutorado-desligado">0%</span>
                                                      </h4>
                                                      <div class="progress mb-4">
                                                          <div class="progress-bar bg-warning"
                                                              aria-valuenow="0" aria-valuemin="0"
                                                              aria-valuemax="100"
                                                              id="pb-doutorado-desligado"
                                                              style="width: 0%;"><span
                                                                  class="visually-hidden">0%</span>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div class="card shadow mb-4"
                                  style="width: auto;max-width: none;height: auto;margin: 0px;margin-bottom: 0px;margin-top: -14px;">
                                  <div class="card-body"
                                      style="height: auto;max-height: 217px;padding-top: 12px;width: auto;">
                                     
                                      <div class="row justify-content-between text-end" style="padding-left: 5px;padding-right: 5px;">
                                          <div class="justify-content-between"
                                                                                    id="text-qualis"><small
                                                                                        style="font-size: 12px;"></small>
                                                                                    <button class="btn btn-primary"
                                                                                        type="button" id="bt_verlattes">Currículo
                                                                                        Lattes</button>
                                                                                    <button class="btn btn-primary"
                                                                                    data-toggle="modal" data-target="#modal_resumo_lattes"
                                                                                        type="button" id="bt_verresumo" hidden>Resumo</button>
                                                                                </div>
                                                                                
                                                                                    
                                      </div>
                                      
                                  </div>
                              </div>
                              <div class="card shadow"
                                  style="width: auto;max-width: none;height: auto;margin-top: -14px;">
                                  <div class="card-body" style="height: 400px;max-height: 400px;">
                                      <h6 class="text-secondary card-subtitle fw-bold m-0"
                                          style="font-size: 12px;padding-bottom: 0px;">Produtos (FONTE: Lattes)
                                      </h6><canvas class="chart-area my-4"
                                          id="chartprofessorsproductions"></canvas>
                                  </div>
                              </div>`;

      fetchLinksGraph();
      listProfs = response.data;
      var div = document.getElementById('tbody-lista-profs');

      $("#formula_indprod_docente").html(`${listProfs.formula.A1}*A1 + ${listProfs.formula.A2}*A2 + ${listProfs.formula.A3}*A3 + ${listProfs.formula.A4}*A4 + ${listProfs.formula.B1}*B1 + ${listProfs.formula.B2}*B2 + ${listProfs.formula.B3}*B3 + ${listProfs.formula.B4}*B4 / período`);

      var corlattes = { '+12 meses': '#ff91a9', 'entre 8 e 12 meses': '#72bef1', 'entre 6 e 8 meses': '#ffdd88', 'entre 3 e 6 meses': '#5d75b0', 'menos de 2 meses': '#b794ff' }
      div.innerHTML = '';
      var select = document.getElementById('select-prof');
      select.innerHTML = '<option value="" disabled selected>Escolha um docente</option><option value="todos">* TODOS</option>';
      for (var i = 0; i < listProfs['professores'].length; i++) {
        //let indProdArt = 1 * listProfs['professores'][i].A1 + 0.875 * listProfs['professores'][i].A2 + 0.75 * listProfs['professores'][i].A3 + 0.625 * listProfs['professores'][i].A4 + 0.5 * listProfs['professores'][i].B1 + 0.375 * listProfs['professores'][i].B2 + 0.25 * listProfs['professores'][i].B3 + 0.125 * listProfs['professores'][i].B4;
        let indProdArt = listProfs['indprods'][listProfs['professores'][i].num_identificador];
        //let glosa = 0.25 * listProfs['professores'][i].B3 + 0.125 * listProfs['professores'][i].B4;
        //if (glosa > (0.2 * indProdArt))
        //  indProdArt = 1 * listProfs['professores'][i].A1 + 0.875 * listProfs['professores'][i].A2 + 0.75 * listProfs['professores'][i].A3 + 0.625 * listProfs['professores'][i].A4 + 0.5 * listProfs['professores'][i].B1 + 0.375 * listProfs['professores'][i].B2 + (0.2 * indProdArt);

        var text_qualis = `<bold>A1:</bold> ${listProfs['professores'][i].A1}, <bold>A2:</bold> ${listProfs['professores'][i].A2}, <bold>A3:</bold> ${listProfs['professores'][i].A3}, <bold>A4:</bold> ${listProfs['professores'][i].A4}, <bold>B1:</bold> ${listProfs['professores'][i].B1}, <bold>B2:</bold> ${listProfs['professores'][i].B2}, <bold>B3:</bold> ${listProfs['professores'][i].B3}, <bold>B4:</bold> ${listProfs['professores'][i].B4}, <bold>C:</bold> ${listProfs['professores'][i].C}`;

        let tooltip = text_qualis.replace(new RegExp('<bold>', "g"), "").replace(new RegExp('</bold>', "g"), "");
        let tooltip_lattes = listProfs['datalattes'][listProfs['professores'][i].num_identificador];

        let status = '';
        for (var si = 0; si < listProfs['status'][listProfs['professores'][i].num_identificador].length; si++) {
          status += `<span><strong>${listProfs['status'][listProfs['professores'][i].num_identificador][si][0]}</strong></span>`;
        }


        var avatar = '/assets/img/avatars/avatar1.jpeg'
        if (listProfs['avatares'] != 'null')
          avatar = listProfs['avatares'][listProfs['professores'][i].num_identificador]

        div.innerHTML += `<tr onclick="fetchProfessorProducts_2('${listProfs['professores'][i].num_identificador}','${listProfs['professores'][i].nome}','${id_ppg}',${year1},${year2},'${text_qualis}');"><td style="text-align: right;padding-right:   
                        12px;">${listProfs['professores'][i].nome} <img class="border rounded-circle img-profile" id="avatar-usuario" src="${avatar}" style="width:40px; height:40px;"/></td>
                        <td data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${tooltip}" style="text-align: center;">${indProdArt.toFixed(2)}</td>
                        <td data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${listProfs['status'][listProfs['professores'][i].num_identificador]}\nÚltima atualização do Lattes: ${tooltip_lattes}" style="text-align: right;">
                        ${status}
                        <i class="fas fa-exclamation-circle" style="color: ${corlattes[tooltip_lattes]};"></i></td></tr>`;

        select.innerHTML += ` <option value="${listProfs['professores'][i].id_sucupira}">${listProfs['professores'][i].nome}</option>`

      }

      var docentes_simulacao = document.getElementById("docentes-simulacao");
      var conteudo_simulacao_docentes = '';
      conteudo_simulacao_docentes = `<p>Docentes permanentes (desmarque para excluir da simulação): </p>`;
      conteudo_simulacao_docentes += `<div class="row"><div class="col">`
      for (var i = 0; i < Math.floor(listProfs['professores'].length / 2); i++) {
        if (listProfs['status'][listProfs['professores'][i].num_identificador].includes("PERMANENTE"))
          conteudo_simulacao_docentes += `<div class="form-check">
                                                <input class="form-check-input" type="checkbox" name="chkdocentes" value="${listProfs['professores'][i].id_sucupira}" id="check_docentes" checked>
                                                <label class="form-check-label" for="check_docentes" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${listProfs['professores'][i].id_sucupira}" style="text-align: right;">
                                                ${listProfs['professores'][i].nome} (indProdArt: <strong>${listProfs['indprods'][listProfs['professores'][i].num_identificador].toFixed(3)}</strong>)
                                                </label>
                                            </div>`
      }
      conteudo_simulacao_docentes += `</div><div class="col">`
      for (var i = Math.floor(listProfs['professores'].length / 2); i < listProfs['professores'].length; i++) {
        if (listProfs['status'][listProfs['professores'][i].num_identificador].includes("PERMANENTE"))
          conteudo_simulacao_docentes += `<div class="form-check">
                                                <input class="form-check-input" type="checkbox" name="chkdocentes" value="${listProfs['professores'][i].id_sucupira}" id="check_docentes" checked>
                                                <label class="form-check-label" for="check_docentes"  data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${listProfs['professores'][i].id_sucupira}" style="text-align: right;">
                                                ${listProfs['professores'][i].nome} (indProdArt: <strong>${listProfs['indprods'][listProfs['professores'][i].num_identificador].toFixed(3)}</strong>)
                                                </label>
                                            </div>`
      }
      conteudo_simulacao_docentes += `</div><p></p></div>`

      docentes_simulacao.innerHTML = conteudo_simulacao_docentes;


      $(element).waitMe('hide');

    }).catch(error => {
      console.error('Error fetching range years: ', error);
    });
}

// export function fetchYears() {
//   const token = getTokenFromURL();
//   const id_ppg = fetchIdPPG();
//   const nome_ppg = fetchNomePPG();

//   //const element = '#col-inddis';

//   axios.get(`/api/dados/prp/geral/anos/${id_ppg}`, {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       var rangeYears = response.data.anos;
//       if (rangeYears[0] < 2013)
//         rangeYears = Array.from({
//           length: (rangeYears[rangeYears.length - 1] - 2013) + 1
//         }, (value, index) => 2013 + index);

//       new rSlider({
//         target: '#slider',
//         values: rangeYears,
//         range: true,
//         tooltip: false,
//         set: [rangeYears[0], rangeYears[rangeYears.length - 1]],
//         onChange: (vals) => getListProfessors(vals)
//         //onChange: (vals) => teste(vals)
//       });

//     }).catch(error => {
//       console.error('Error fetching range years: ', error);
//     });
// }



export function fetchLinksGraph() {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  axios.get(`/api/dados/ppg/docentes/coautores/${id_ppg}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const data = response.data.links;
      const elem = document.getElementById('links-graph');
      elem.innerHTML = "";

      const width = 1000;
      const height = 1000;
      const innerRadius = Math.min(width, height) * 0.3;
      const outerRadius = innerRadius + 10;

      // Compute a dense matrix from the weighted links in data.
      const names = d3.sort(d3.union(data.map(d => d.source), data.map(d => d.target)));
      const index = new Map(names.map((name, i) => [name, i]));
      const matrix = Array.from(index, () => new Array(names.length).fill(0));
      for (const { source, target, value } of data) matrix[index.get(source)][index.get(target)] += value;

      const chord = d3.chordDirected()
        .padAngle(10 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);

      const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

      const ribbon = d3.ribbonArrow()
        .radius(innerRadius - 1)
        .padAngle(1 / innerRadius);

      const colors = d3.quantize(d3.interpolateRainbow, names.length);

      const svg = d3.select("#links-graph").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "width: 100%; height: 100%; max-height: 1000px; font: 9px sans-serif;");

      const chords = chord(matrix);

      const group = svg.append("g")
        .selectAll()
        .data(chords.groups)
        .join("g");

      group.append("path")
        .attr("fill", d => colors[d.index])
        .attr("d", arc);

      group.append("text")
        .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
        .attr("dy", "0.35em")
        .attr("transform", d => `
                        rotate(${(d.angle * 180 / Math.PI - 90)})
                        translate(${outerRadius + 5})
                        ${d.angle > Math.PI ? "rotate(180)" : ""}
                      `)
        .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
        .text(d => names[d.index]);

      group.append("title")
        .text(d => `${names[d.index]}
                ${d3.sum(chords, c => (c.source.index === d.index) * c.source.value) + d3.sum(chords, c => (c.target.index === d.index) * c.source.value)} artigos`);

      svg.append("g")
        .attr("fill-opacity", 0.75)
        .selectAll()
        .data(chords)
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("fill", d => colors[d.target.index])
        .attr("d", ribbon)
        .append("title")
        .text(d => `${names[d.source.index]} → ${names[d.target.index]} ${d.source.value}`);

    }).catch(error => {
      console.error('Error fetching graph: ', error);
    });
}

export function fetchGraph(op) {
  const token = getTokenFromURL();
  const id_ppg = fetchIdPPG();
  const nome_ppg = fetchNomePPG();

  //console.log(op.options[op.selectedIndex]);
  const ids = op.options[op.selectedIndex].value;
  const nome = op.options[op.selectedIndex].label;

  if (!ids) ids = 'todos';

  axios.get(`/api/dados/ppg/docentes/grafo/coautores/${id_ppg}/${ids}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const data = response.data;
      const elem = document.getElementById('graph');
      elem.innerHTML = "";

      const width = 1100;
      const height = 800;

      // Specify the color scale.
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      // The force simulation mutates links and nodes, so create a copy
      // so that re-evaluating this cell produces the same result.
      const links = data.links.map(d => ({ ...d }));
      const nodes = data.nodes.map(d => ({ ...d }));

      // Create a simulation with several forces.
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      // Create the SVG container.
      const svg = d3.select('#graph').append("svg")
        //.attr("width", width)
        //.attr("height", height)                      
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");
      // .call(d3.zoom().on("zoom", function () {
      //  svg.attr("transform", d3.zoomTransform(this))
      //}));

      // Add a line for each link, and a circle for each node.
      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => 1.5);

      const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", c => {
          if (c.group === "authors") return 8;
          if (c.group === "authors_solo") return 8;
          return 5;
        })
        .attr("fill", d => {
          if (d.group === "authors") {
            if (d.id.toUpperCase() === nome.toUpperCase())
              return d3.schemeCategory10[1]
            return d3.schemeCategory10[0];
          }

          if (d.group === "authors_solo")
            return d3.schemeCategory10[7];


          return d3.schemeCategory10[4];
        });

      node.append("title")
        .text(d => d.id);

      var text = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("class", "text")
        .attr("style", "font: 8px sans-serif;")
        .text(d => {
          if (d.group === 'authors' || d.group === "authors_solo")
            return d.id.trim().split(' ')[0];
          return '';
        });

      // Add a drag behavior.
      node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));



      // Set the position attributes of links and nodes each time the simulation ticks.
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        text
          .attr("x", d => d.x + 10)
          .attr("y", d => d.y);
      });


      // Reheat the simulation when drag starts, and fix the subject position.
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      // Update the subject (dragged node) position during drag.
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      // Restore the target alpha so the simulation cools after dragging ends.
      // Unfix the subject position now that it’s no longer being dragged.
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      // When this cell is re-run, stop the previous simulation. (This doesn’t
      // really matter since the target alpha is zero and the simulation will
      // stop naturally, but it’s a good practice.)
      //invalidation.then(() => simulation.stop());

      const leg_elem = document.getElementById('legend-graph');
      leg_elem.innerHTML = "";
      const legendContainer = d3.select("#legend-graph");

      const svgl = legendContainer.append("svg")
        .attr("width", 500) // Adjust the width as needed
        .attr("height", 100); // Adjust the height as needed

      const legendData = Object.entries({ 'Docentes com coaturorias': d3.schemeCategory10[0], 'Docente selecionado': d3.schemeCategory10[1], 'Docentes sem coautoria': d3.schemeCategory10[7], 'Artigos': d3.schemeCategory10[4] });

      const legend = svgl.selectAll(".legend")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          // const column = i % 2; // Calculate the column number (0 or 1)
          // const row = Math.floor(i / 2); // Calculate the row number
          // const x = column === 0 ? 0 : 120 + 220; // Adjust the x position based on the column
          // const y = row * 20; // Adjust the y position based on the row
          // return "translate(" + x + "," + y + ")";
          const num_columns = 1;
          const column = i % num_columns; // Calculate the column number (0 or 1)
          const row = Math.floor(i / num_columns); // Calculate the row number
          let x = 0;
          if (column === 0)
            x = 0;
          else if (column == 1)
            x = 120 + 220; // Adjust the x position based on the column
          else x = 220 + 440;
          const y = row * 20; // Adjust the y position based on the row
          return "translate(" + x + "," + y + ")";
        });
      legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) {
          return d[1];
        });
      legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) {
          return d[0];
        });
      // const Graph = ForceGraph()(elem)
      //     .graphData(grafo)
      //     .nodeId('id')
      //     .nodeLabel('id')
      //      .linkSource('source')
      //      .linkTarget('target');

      //              Graph.d3Force('center', null);
      //            Graph.onEngineStop(() => Graph.zoomToFit(400));
      //
    }).catch(error => {
      console.error('Error fetching graph: ', error);
    });
}



// export function fetchIndProds() {
//   const token = getTokenFromURL();
//   const id_ppg = fetchIdPPG();
//   var listAvgIndProds;
//   var listIndProds;

//   const element = '#row-qualis';
//   run_waitMe(element, 'Carregando gráfico');

//   axios.get(`/api/dados/prp/geral/indprod/avg/${id_ppg}/${year1}/${year2}`, {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       listAvgIndProds = response.data;
//       axios.get(`/api/dados/prp/geral/indprod/${id_ppg}/${year1}/${year2}`, {
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       })
//         .then(response => {
//           listIndProds = response.data;
//           renderChartIndProds(listIndProds, listAvgIndProds);
//           $(element).waitMe('hide');
//         })
//         .catch(error => {
//           throw error;
//         });
//     }).catch(error => {
//       console.error('Error fetching list indprods: ', error);
//     });
// }



// //########################################## grafico doughnut com produtos do docente 


// function fetchProfessorProducts(event) {
//           const token = getTokenFromURL();

//     axios.get(`/api/dados/prp/geral/producoes/${event.target.value}/${id_ppg}/${year1}/${year2}`, {
//             headers: {
//               'accept': 'application/json',
//               'Authorization': `Bearer ${token}`
//             }
//           })
//             .then(response => {
//                 const produtos = response.data; 
//                 renderChartProfessorProductions(produtos);
//             }).catch(error => {
//                       console.error('Error fetching range years: ', error);
//             });

//     axios.get(`/api/dados/prp/geral/orientados/${event.target.value}/${id_ppg}/${year1}/${year2}`, {
//             headers: {
//               'accept': 'application/json',
//               'Authorization': `Bearer ${token}`
//             }
//           })
//             .then(response => {
//                 const dados = response.data; 

//                 const d_dtitulados = dados[0].TITULADO+dados[0]['MUDANCA DE NÍVEL COM DEFESA'];
//                 const d_ftitulados = dados[1].TITULADO+dados[1]['MUDANCA DE NÍVEL COM DEFESA'];
//                 const d_atitulados = dados[0].DESLIGADO+dados[1].DESLIGADO+dados[0].ABANDONOU+dados[1].DESLIGADO;

//                 const m_dtitulados = dados[2].TITULADO+dados[2]['MUDANCA DE NÍVEL COM DEFESA'];
//                 const m_ftitulados = dados[3].TITULADO+dados[3]['MUDANCA DE NÍVEL COM DEFESA'];
//                 const m_atitulados = dados[2].DESLIGADO+dados[3].DESLIGADO+dados[2].ABANDONOU+dados[3].DESLIGADO;
//                 //<div id="pb-mestrado-dentro" class="progress-bar bg-primary" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;"><span class="visually-hidden">60%</span></div>
//                 var div_mest_dentro = document.getElementById('pb-mestrado-dentro');
//                 var span_mest_dentro = document.getElementById('span-mestrado-dentro');

//                 var div_mest_fora = document.getElementById('pb-mestrado-fora');
//                 var span_mest_fora = document.getElementById('span-mestrado-fora');

//                 var div_mest_desligado = document.getElementById('pb-mestrado-desligado');
//                 var span_mest_desligado= document.getElementById('span-mestrado-desligado');

//                 var total_mest = m_dtitulados+m_ftitulados+m_atitulados;
//                 //console.log(total_mest);
//                 if (total_mest > 0){
//                     perc = ((m_dtitulados*100)/total_mest);
//                     div_mest_dentro.setAttribute('aria-valuenow',perc);
//                     div_mest_dentro.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_mest_dentro.innerHTML = ''+(perc.toFixed(2))+'%';

//                     perc = ((m_ftitulados*100)/total_mest);
//                     div_mest_fora.setAttribute('aria-valuenow',perc);
//                     div_mest_fora.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_mest_fora.innerHTML = ''+(perc.toFixed(2))+'%';

//                     perc = ((m_atitulados*100)/total_mest);
//                     div_mest_desligado.setAttribute('aria-valuenow',perc);
//                     div_mest_desligado.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_mest_desligado.innerHTML = ''+(perc.toFixed(2))+'%';
//                 }
//                 else {
//                     perc = 0.0;
//                     div_mest_dentro.setAttribute('aria-valuenow',perc);
//                     div_mest_dentro.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_mest_dentro.innerHTML = ''+(perc.toFixed(2))+'%';

//                     div_mest_fora.setAttribute('aria-valuenow',perc);
//                     div_mest_fora.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_mest_fora.innerHTML = ''+(perc.toFixed(2))+'%';

//                     div_mest_desligado.setAttribute('aria-valuenow',perc);
//                     div_mest_desligado.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_mest_desligado.innerHTML = ''+(perc.toFixed(2))+'%';
//                 }
//                 var span = document.getElementById('qdade-orientados-mestrado');
//                 span.innerHTML = ''+total_mest;



//                 var div_dot_dentro = document.getElementById('pb-doutorado-dentro');
//                 var span_dot_dentro = document.getElementById('span-doutorado-dentro');

//                 var div_dot_fora = document.getElementById('pb-doutorado-fora');
//                 var span_dot_fora = document.getElementById('span-doutorado-fora');

//                 var div_dot_desligado = document.getElementById('pb-doutorado-desligado');
//                 var span_dot_desligado= document.getElementById('span-doutorado-desligado');

//                 var total_dot = d_dtitulados+d_ftitulados+d_atitulados;
//                 //console.log(total_mest);
//                 if (total_dot > 0){
//                     perc = ((d_dtitulados*100)/total_dot);
//                     div_dot_dentro.setAttribute('aria-valuenow',perc);
//                     div_dot_dentro.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_dot_dentro.innerHTML = ''+(perc.toFixed(2))+'%';

//                     perc = ((d_ftitulados*100)/total_dot);
//                     div_dot_fora.setAttribute('aria-valuenow',perc);
//                     div_dot_fora.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_dot_fora.innerHTML = ''+(perc.toFixed(2))+'%';

//                     perc = ((d_atitulados*100)/total_mest);
//                     div_dot_desligado.setAttribute('aria-valuenow',perc);
//                     div_dot_desligado.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_dot_desligado.innerHTML = ''+(perc.toFixed(2))+'%';
//                 }
//                 else {
//                     perc = 0.0;
//                     div_dot_dentro.setAttribute('aria-valuenow',perc);
//                     div_dot_dentro.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_dot_dentro.innerHTML = ''+(perc.toFixed(2))+'%';

//                     div_dot_fora.setAttribute('aria-valuenow',perc);
//                     div_dot_fora.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_dot_fora.innerHTML = ''+(perc.toFixed(2))+'%';

//                     div_dot_desligado.setAttribute('aria-valuenow',perc);
//                     div_dot_desligado.style = 'width: '+(perc.toFixed(2))+'%';
//                     span_dot_desligado.innerHTML = ''+(perc.toFixed(2))+'%';
//                 }
//                 span = document.getElementById('qdade-orientados-doutorado');
//                 span.innerHTML = ''+total_dot;
//             }).catch(error => {
//                       console.error('Error fetching range years: ', error);
//             });
//         }

//export function selectProduct(sel) {
//  const product_type = sel.options[sel.selectedIndex].value
//  index_fetchGraph(product_type)
//}
//const margin = ({ top: 20, right: 20, bottom: 20, left: 100 });

var index_graph_year1 = 2013;
var index_graph_year2 = 2023;//new Date().getFullYear();

export function index_sliderGraph() {
  var max = 2023;//new Date().getFullYear()
  var min = 2013
  var rangeYears = []

  for (var i = min; i <= max; i++) {
    rangeYears.push(i)
  }
  new rSlider({
    target: '#slider-graph-index',
    values: rangeYears,
    range: true,
    tooltip: false,
    set: [rangeYears[0], rangeYears[rangeYears.length - 1]],
    onChange: (vals) => {
      const anos = vals.split(',').map(Number);
      index_graph_year1 = anos[0];
      index_graph_year2 = anos[1];
    }
    //onChange: (vals) => teste(vals)
  });
}

function highlightConnectedNodesAndLinks(node, links, link, text) {
  //node.style('opacity', 0.3);
  const nodeId = node.data()[0].id;
  link.style('stroke', function (link_d) {
    return link_d.source.id === nodeId || link_d.target.id === nodeId ? 'black' : '#b8b8b8';
  }).style('stroke-width', function (link_d) {
    return link_d.source.id === nodeId || link_d.target.id === nodeId ? 3 : 1;
  });

  // text.style("opacity", function(label_d){ 
  //   return label_d.id === nodeId ? 1 : 0.3 
  // } );

  // Encontre os nós conectados a este nó
  const connectedNodes = new Set();
  connectedNodes.add(nodeId);
  links.forEach(link_d => {
    if (link_d.source.id === nodeId) {
      connectedNodes.add(link_d.target.id);
    } else if (link_d.target.id === nodeId) {
      connectedNodes.add(link_d.source.id);
    }
  });


  connectedNodes.forEach(id => {
    var e = document.getElementById(id);
    d3.select(e).style('opacity', 0.9);
  });

  node.style('opacity', 1.0);
  node.attr("stroke-width", 3);

}

export function index_fetchGraph(product_type, fonte) {
  const token = getTokenFromURL();
  const url = new URL(window.location.href);

  const programas = {
    "BIODIVERSIDADE E USO DOS RECURSOS NATURAIS": "#444444",
    "BIOTECNOLOGIA": "#F08080",
    "BOTÂNICA APLICADA": "#131211",
    "CIÊNCIAS DA SAÚDE": "#008000",
    "CUIDADO PRIMÁRIO EM SAÚDE": "#FF0000",
    "DESENVOLVIMENTO ECONÔMICO E ESTRATÉGIA EMPRESARIAL": "#A0A0A0",
    "DESENVOLVIMENTO SOCIAL": "#cbf808",
    "EDUCAÇÃO": "#800000",
    "FILOSOFIA": "#00FF00",
    "GEOGRAFIA": "#008080",
    //"HISTORIA": "#73c5e0",
    //"LETRAS": "#000080",
    "LETRAS-ESTUDOS LITERÁRIOS": "#0000FF",
    "MODELAGEM COMPUTACIONAL E SISTEMAS": "#0080FF",
    "PRODUÇÃO VEGETAL NO SEMIÁRIDO": "#FF00FF",
    "SOCIEDADE, AMBIENTE E TERRITÓRIO": "#34cb05",
    "ZOOTECNIA": "#f26a21"
  };



  if (product_type === undefined)
    product_type = "ARTIGO EM PERIÓDICO"

  axios.get(`/api/dados/ppg/geral/coautores/subtipo/${fonte}/${product_type}/${index_graph_year1}/${index_graph_year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {


      const data = response.data;
      const elem = document.getElementById('links-graph');
      elem.innerHTML = "";

      const width = 1100;
      const height = 880;

      // Specify the color scale.
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      // The force simulation mutates links and nodes, so create a copy
      // so that re-evaluating this cell produces the same result.
      const links = data.links.map(d => ({ ...d }));
      const nodes = data.nodes.map(d => ({ ...d }));

      // Create a simulation with several forces.
      // Duplicating to increase the scattering.
      d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-30))
        //.force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY());
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-60))
        //.force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      $('#links-graph').empty();
      $('#legend-graph').empty();

      // Create the SVG container.
      const svg = d3.select('#links-graph').append("svg")
        //.attr("width", width)
        //.attr("height", height)                     
        //.call(d3.zoom().on("zoom", function () {
        // svg.attr("transform", d3.zoomTransform(this));
        //}))
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

      //.attr("style", "max-width: 1500px; height: 100%; transform: translate(170px, -120px);");

      //svg.on('mousedown.zoom',null);



      // Add a line for each link, and a circle for each node.
      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

      const node = svg.append("g")
        .attr("stroke", "#3B3B3B")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", c => {
          let mult = 3;
          if (mult * Math.log(c.importancia) < 4) return 4;
          return mult * Math.log(c.importancia);
        })
        .attr("id", d => { return d.id })
        .attr("fill", d => {
          //if(d.id === 'RENE RODRIGUES VELOSO') return color(d.id);
          return programas[d.nome];
        });

      node.append("title")
        .text(d => `${d.id} (${d.nome})`);

      var text = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("class", "text")
        .attr("style", "font: 8px sans-serif;")
        .text(d => {
          return d.id.trim().split(' ')[0];
        });

      // svg.append("text")
      // .attr("x", (width/2)-100)
      // .attr("y", -(height/2)+10)
      // .attr("style", "font: 8px sans-serif;")
      // .text('Scroll do mouse: zoom +/-');

      // Add a drag behavior.
      node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

      // Add a drag behavior.
      node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

      node.on('click', function (d) {
        node.style('opacity', 0.2);
        // d3.select(this).style('opacity', 1);
        highlightConnectedNodesAndLinks(d3.select(this), links, link, text);

        text.style("font-size", function (label_d) {
          return label_d.id === d.srcElement.__data__.id ? 12 : 8
        });

        // text.style("opacity", function(label_d){ 
        //   return label_d.id === d.srcElement.__data__.id ? 1 : 0.1 
        // } );

        // link
        //   .style('stroke', function (link_d) { 
        //     return link_d.source.id ===  d.srcElement.__data__.id || link_d.target.id ===  d.srcElement.__data__.id ? '#69b3b2' : '#b8b8b8';
        //   })
        //   .style('stroke-width', function (link_d) { 
        //     return link_d.source.id ===  d.srcElement.__data__.id || link_d.target.id ===  d.srcElement.__data__.id ? 4 : 1;
        //   });
      })
        .on('mouseout', function (d) {
          text.style("font-size", 8);
          text.style('opacity', 1);
          node.style('opacity', 1);
          node.attr("stroke-width", 1.5);
          link
            .style("stroke", "#999")
            .style("stroke-width", d => Math.sqrt(d.value));
        });


      // Set the position attributes of links and nodes each time the simulation ticks.
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        text
          .attr("x", d => d.x + 10)
          .attr("y", d => d.y);
      });

      // Reheat the simulation when drag starts, and fix the subject position.
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      // Update the subject (dragged node) position during drag.
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      // Restore the target alpha so the simulation cools after dragging ends.
      // Unfix the subject position now that it’s no longer being dragged.
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      const legendContainer = d3.select("#legend-graph");

      const svgl = legendContainer.append("svg")
        .attr("width", 1000) // Adjust the width as needed
        .attr("height", 300); // Adjust the height as needed

      const legendData = Object.entries(programas);

      const legend = svgl.selectAll(".legend")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          const num_columns = 1;
          const column = i % num_columns; // Calculate the column number (0 or 1)
          const row = Math.floor(i / num_columns); // Calculate the row number
          let x = 0;
          if (column === 0)
            x = 0;
          else if (column == 1)
            x = 120 + 220; // Adjust the x position based on the column
          else x = 220 + 440;
          const y = row * 20; // Adjust the y position based on the row
          return "translate(" + x + "," + y + ")";
        });
      legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) {
          return d[1];
        });
      legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) {
          return d[0];
        });



    }).catch(error => {
      console.error('Error fetching graph: ', error);
    });
}


// export function index_fetchListProductions(idCanvas) {
//   const token = getTokenFromURL();

//   axios.get('/api/dados/prp/geral/producoes/todas/total', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const listProductions = response.data.producoes;
//       index_renderChartProductions(idCanvas, listProductions);
//     })
//     .catch(error => {
//       console.error('Error fetching list programs: ', error);
//     });
// }

// export function index_fetchListPeriodicProductions(idCanvas) {
//   const token = getTokenFromURL();

//   axios.get('/api/dados/prp/geral/producoes/periodicos/total', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const listPeriodicProductions = response.data.producoes;
//       index_renderChartPeriodicProductions(idCanvas, listPeriodicProductions);
//     })
//     .catch(error => {
//       console.error('Error fetching list periodics: ', error);
//     });
// }

// export function index_fetchListTechnicalProductions(idCanvas) {
//   const token = getTokenFromURL();

//   axios.get('/api/dados/prp/geral/producoes/tecnicas/total', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const listTechnicalProductions = response.data.producoes;
//       index_renderChartTechnicalProductions(idCanvas, listTechnicalProductions);
//     })
//     .catch(error => {
//       console.error('Error fetching list technical: ', error);
//     });
// }

// export function index_fetchListBiblioProductions(idCanvas) {
//   const token = getTokenFromURL();

//   axios.get('/api/dados/prp/geral/producoes/biblio/total', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const listBiblioProductions = response.data.producoes;
//       index_renderChartBiblioProductions(idCanvas, listBiblioProductions);
//     })
//     .catch(error => {
//       console.error('Error fetching list Biblio: ', error);
//     });
// }

// export function index_fetchListStudents(idCanvas) {
//   const token = getTokenFromURL();

//   axios.get('/api/dados/prp/geral/discentes/titulados/nivel', {
//     headers: {
//       'accept': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       const listStudents = response.data.discentes;
//       index_renderChartStudentsLevel(idCanvas, listStudents);
//     })
//     .catch(error => {
//       console.error('Error fetching list students: ', error);
//     });
// }

export function fetchLattesUpdate(idCanvas) {
  const token = getTokenFromURL();
  const id = fetchIdPPG();

  axios.get(`/api/dados/ppg/docentes/lattesatualizacao/${id}/${year1}/${year2}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const lattesdocs = response.data;
      renderChartLattesUpdate(idCanvas, lattesdocs);
    })
    .catch(error => {
      console.error('Error fetching lattes updating: ', error);
    });
}

// Fetchers logs
export function log_fetchLogAcessos(idCanvas) {
  const token = getTokenFromURL();
  
  const name = 'acessos';
  const type = window.sessionStorage.getItem('type');
  const delimiter1 = window.sessionStorage.getItem('year1');
  const delimiter2 = window.sessionStorage.getItem('year2');
  const id = window.sessionStorage.getItem('id_ppg');
  
  axios.get(`/api/dados/super_user/logs/${name}/${type}/${delimiter1}/${delimiter2}/${id}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const listLogAcessos = response.data;
      log_renderChartLogAcessos(idCanvas, listLogAcessos);
    })
    .catch(error => {
      console.error('Error fetching list log_acessos: ', error);
    });
}

export function log_fetchLogGrafos(idCanvas) {
  const token = getTokenFromURL();

  const name = 'grafos';
  const type = window.sessionStorage.getItem('type');
  const delimiter1 = window.sessionStorage.getItem('year1');
  const delimiter2 = window.sessionStorage.getItem('year2');
  const id = window.sessionStorage.getItem('id_ppg');

  axios.get(`/api/dados/super_user/logs/${name}/${type}/${delimiter1}/${delimiter2}/${id}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      const listLogGrafos = response.data;
      log_renderChartLogGrafos(idCanvas, listLogGrafos);
    })
    .catch(error => {
      console.error('Error fetching list log_grafos: ', error);
    });
}
