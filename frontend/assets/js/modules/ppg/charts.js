Chart.register(ChartDataLabels);

var carttempodefesa;
export function renderChartTimesConclusions(idCanvas, timesConclusions) {
    //separate the levels into groupedData
    const groupedData = {};
    let keys = new Set();
    timesConclusions.forEach(item => {
        let nivel = item.nivel;
        if (nivel === 'Mestrado Profissional')
            nivel = 'Mestrado';
        const key = `${nivel}-${item.situacao}`;
        keys.add(key);
        if (!groupedData[key]) {
            groupedData[key] = [];
        }
        groupedData[key].push(item.meses);
    });


    // Counting the occurrences for each group
    const mestradoData = groupedData['Mestrado-TITULADO'] || [];
    const doutoradoData = groupedData['Doutorado-TITULADO'] || [];
    const mestradoCount = countOccurrences(mestradoData);
    const doutoradoCount = countOccurrences(doutoradoData);


    // Find the unique keys from both mestradoCount and doutoradoCount arrays
    const mestradoKeys = Object.keys(mestradoCount);
    const doutoradoKeys = Object.keys(doutoradoCount);

    // Create a new array containing all unique keys from both arrays
    const combinedKeys = [...new Set([...mestradoKeys, ...doutoradoKeys])];

    // Iterate over combinedKeys and align the keys in both mestradoCount and doutoradoCount arrays
    combinedKeys.forEach((key) => {
        if (!mestradoCount.hasOwnProperty(key)) {
            // If key exists in doutoradoCount but not in mestradoCount, add it with a value of zero
            mestradoCount[key] = 0;
        }

        if (!doutoradoCount.hasOwnProperty(key)) {
            // If key exists in mestradoCount but not in doutoradoCount, add it with a value of zero
            doutoradoCount[key] = 0;
        }
    });

    //create the dataset based on existence of each level    
    var dataset = []
    if (keys.has('Mestrado-TITULADO'))
        dataset.push({
            label: 'Mestrado',
            data: Object.values(mestradoCount),
            backgroundColor: colors.blue.half, // Customize the color for mestrado
        });
    if (keys.has('Doutorado-TITULADO'))
        dataset.push({
            label: 'Doutorado',
            data: Object.values(doutoradoCount),
            backgroundColor: colors.orange.half, // Customize the color for doutorado

        });


    // Creating the chart
    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext('2d');
    //const ctx = document.getElementById('carttempodefesa').getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (carttempodefesa) {
        carttempodefesa.destroy();
    }
    carttempodefesa = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: combinedKeys,
            datasets: dataset,
        },
        options: {
            //responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    display: false
                },
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: 'black',
                    //backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    //borderColor: 'rgba(75, 192, 192, 1)',
                    //borderWidth: 1,
                    //borderRadius: 5,
                    font: {
                        size: 10
                    },
                    formatter: (value) => {
                        if (value === 0) return '';
                        return value;
                    },

                },

            },
        },
    });
}

var chartstudentsgraduated;
export function renderChartStudentsGraduated(idCanvas, listStudents) {
    const labels = listStudents.map(disc => disc.ano);
    const groupedData = {};
    const anosTemp = new Set();
    const keys = new Set();
    listStudents.forEach(disc => {
        let nivel = disc.nivel;
        if (nivel === 'Mestrado Profissional')
            nivel = 'Mestrado';
        const key = nivel;
        keys.add(key);
        if (!groupedData[key]) {
            groupedData[key] = {};
        }

        groupedData[key][disc.ano] = disc.count;
        anosTemp.add(disc.ano);
    });

    const anos = Array.from(anosTemp).sort()

    for (var i = 0; i < anos.length; i++) {

        if (groupedData['Mestrado'] && !groupedData['Mestrado'][anos[i]]) groupedData['Mestrado'][anos[i]] = 0;
        if (groupedData['Doutorado'] && !groupedData['Doutorado'][anos[i]]) groupedData['Doutorado'][anos[i]] = 0;
    }

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartstudentsgraduated').getContext("2d");
    var gradient = ctx.createLinearGradient(0, 25, 0, 300);
    gradient.addColorStop(0, colors.blue.half);
    gradient.addColorStop(0.35, colors.blue.quarter);
    gradient.addColorStop(1, colors.blue.zero);

    var gradient2 = ctx.createLinearGradient(0, 25, 0, 300);
    gradient2.addColorStop(0, colors.orange.half);
    gradient2.addColorStop(0.35, colors.orange.quarter);
    gradient2.addColorStop(1, colors.orange.zero);

    var dataset = []
    if (keys.has('Mestrado'))
        dataset.push({
            label: 'Mestrado',
            data: Object.values(groupedData["Mestrado"]),
            backgroundColor: gradient,
            pointBackgroundColor: colors.blue.default,
            borderColor: colors.blue.default,
            lineTension: 0.2,
            borderWidth: 2,
            pointRadius: 3,
            fill: 'start',
        });
    if (keys.has('Doutorado'))
        dataset.push({
            label: 'Doutorado',
            data: Object.values(groupedData["Doutorado"]),
            backgroundColor: gradient2,
            pointBackgroundColor: colors.orange.default,
            borderColor: colors.orange.default,
            lineTension: 0.2,
            borderWidth: 2,
            pointRadius: 3,
            fill: 'start',

        });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartstudentsgraduated) {
        chartstudentsgraduated.destroy();
    }
    chartstudentsgraduated = new Chart(ctx, {
        type: 'line',
        data: {
            labels: anos,
            datasets: dataset
        },


        options: {
            maintainAspectRatio: false,

            scales: {
                y: {
                    stacked: false,
                }
            },
            plugins: {
                datalabels: {
                    display: false,
                },
            }
        },


    });
}

var chartprofessorsbycategory;
export function renderChartProfessorsByCategory(idCanvas, listProfessors) {
    const labels = listProfessors.map(profs => profs.ano);
    //const counts = listProfessors.map(profs => profs.quantidade);
    //const category = listProfessors.map(profs => profs.ano);

    const groupedData = {};
    const anosTemp = new Set();
    const keys = new Set();
    listProfessors.forEach(prof => {
        const key = prof.categoria;
        keys.add(key);
        if (!groupedData[key]) {
            groupedData[key] = {};
        }

        groupedData[key][prof.ano] = prof.count;
        anosTemp.add(prof.ano);
    });


    const anos = Array.from(anosTemp).sort();

    for (var i = 0; i < anos.length; i++) {

        if (groupedData['VISITANTE'] && !groupedData['VISITANTE'][anos[i]]) groupedData['VISITANTE'][anos[i]] = 0;
        if (groupedData['COLABORADOR'] && !groupedData['COLABORADOR'][anos[i]]) groupedData['COLABORADOR'][anos[i]] = 0;
        if (!groupedData['PERMANENTE'][anos[i]]) groupedData['PERMANENTE'][anos[i]] = 0;
    }

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartprofessorsbycategory').getContext("2d");
    var gradient = ctx.createLinearGradient(0, 25, 0, 300);
    gradient.addColorStop(0, colors.indigo.half);
    gradient.addColorStop(0.35, colors.indigo.quarter);
    gradient.addColorStop(1, colors.indigo.zero);

    var gradient2 = ctx.createLinearGradient(0, 25, 0, 300);
    gradient2.addColorStop(0, colors.blue.half);
    gradient2.addColorStop(0.35, colors.blue.quarter);
    gradient2.addColorStop(1, colors.blue.zero);

    var gradient3 = ctx.createLinearGradient(0, 25, 0, 300);
    gradient3.addColorStop(0, colors.orange.half);
    gradient3.addColorStop(0.35, colors.orange.quarter);
    gradient3.addColorStop(1, colors.orange.zero);


    var dataset = []
    if (keys.has('VISITANTE'))
        dataset.push({
            label: 'Visitante',
            data: Object.values(groupedData["VISITANTE"]),
            backgroundColor: gradient3,
            pointBackgroundColor: colors.orange.default,
            borderColor: colors.orange.default,
            lineTension: 0.2,
            borderWidth: 2,
            pointRadius: 3,
            fill: 'start',
        });
    if (keys.has('COLABORADOR'))
        dataset.push({
            label: 'Colaborador',
            data: Object.values(groupedData["COLABORADOR"]),
            backgroundColor: gradient2,
            pointBackgroundColor: colors.blue.default,
            borderColor: colors.blue.default,
            lineTension: 0.2,
            borderWidth: 2,
            pointRadius: 3,
            fill: 'start',

        });
    if (keys.has('PERMANENTE'))
        dataset.push({
            label: 'Permanente',
            data: Object.values(groupedData["PERMANENTE"]),
            backgroundColor: gradient,
            pointBackgroundColor: colors.indigo.default,
            borderColor: colors.indigo.default,
            lineTension: 0.2,
            borderWidth: 2,
            pointRadius: 3,
            fill: 'start',
        });






    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartprofessorsbycategory) {
        chartprofessorsbycategory.destroy();
    }
    chartprofessorsbycategory = new Chart(ctx, {
        type: 'line',
        data: {
            labels: anos,
            datasets: dataset
        },


        options: {
            maintainAspectRatio: false,

            scales: {
                y: {
                    stacked: false,
                }
            },
            plugins: {
                datalabels: {
                    display: false,
                },
            }
        },


    });
}

var chartqualisproductions;
export function renderChartQualis_(idCanvas, listQualisProductions) {
 
    
    // Filtrar os dados com base na black_list
    //listQualisProductions = listQualisProductions.filter(data => !black_list.includes(data.id_pessoa));

    // Recalcular os anos, se necessário
    var anosSet = new Set(Object.keys(listQualisProductions)); //listQualisProductions.map(data => data.ano));
    var anos = [...anosSet].sort();

    // Recalcular as pontuações por ano
    // var pontuacoesPorAno = anos.map(ano => {
    //     return listQualis = {
    //         ano: ano,
    //         A1: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A1, 0),
    //         A2: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A2, 0),
    //         A3: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A3, 0),
    //         A4: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A4, 0),
    //         B1: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B1, 0),
    //         B2: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B2, 0),
    //         B3: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B3, 0),
    //         B4: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B4, 0),
    //         C: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.C, 0),
    //     };
    // });


    // for (var dicionario of pontuacoesPorAno) {
    //     let indProdArt = 1 * dicionario.A1 + 0.875 * dicionario.A2 + 0.75 * dicionario.A3 + 0.625 * dicionario.A4 + 0.5 * dicionario.B1 + 0.375 * dicionario.B2 + 0.25 * dicionario.B3 + 0.125 * dicionario.B4;
    //     let glosa = 0.25 * dicionario.B3 + 0.125 * dicionario.B4;
    //     if (glosa > (0.2 * indProdArt))
    //       indProdArt = 1 * dicionario.A1 + 0.875 * dicionario.A2 + 0.75 * dicionario.A3 + 0.625 * dicionario.A4 + 0.5 * dicionario.B1 + 0.375 * dicionario.B2 + (0.2 * indProdArt);
    //     listIndProds.push({'indprod': indProdArt, 'ano': a})
    // }

    var a1 = [];
    var a2 = [];
    var a3 = [];
    var a4 = [];
    var b1 = [];
    var b2 = [];
    var b3 = [];
    var b4 = [];
    var c = [];

    for (var ano of anos) {
        a1.push(listQualisProductions[ano].A1);
        a2.push(listQualisProductions[ano].A2);
        a3.push(listQualisProductions[ano].A3);
        a4.push(listQualisProductions[ano].A4);
        b1.push(listQualisProductions[ano].B1);
        b2.push(listQualisProductions[ano].B2);
        b3.push(listQualisProductions[ano].B3);
        b4.push(listQualisProductions[ano].B4);
        c.push(listQualisProductions[ano].C);
    }

    //localização da legenda da coluna Lattes
    var max_qualis = listQualisProductions[anos[anos.length-1]].A1+listQualisProductions[anos[anos.length-1]].A2+
                 listQualisProductions[anos[anos.length-1]].A3+listQualisProductions[anos[anos.length-1]].A4+
                 listQualisProductions[anos[anos.length-1]].B1+listQualisProductions[anos[anos.length-1]].B2+
                 listQualisProductions[anos[anos.length-1]].B3+listQualisProductions[anos[anos.length-1]].B4+
                 listQualisProductions[anos[anos.length-1]].C + 5;

    // for (var dicionario of pontuacoesPorAno) {
    //     a1.push(dicionario.A1);
    //     a2.push(dicionario.A2);
    //     a3.push(dicionario.A3);
    //     a4.push(dicionario.A4);
    //     b1.push(dicionario.B1);
    //     b2.push(dicionario.B2);
    //     b3.push(dicionario.B3);
    //     b4.push(dicionario.B4);
    //     c.push(dicionario.C);
    // }

    

    var datasets_qualis = [];

    const colors = ["#002d83", "#175399", "#638fbc", "#b5cfe6", "#49207c", "#654791", "#9d88b1", "#d7c9e2", "#cb3dab"];
    const colors_rgba = ["rgba(0,45,131,0.7)", "rgba(23,83,153,0.7)", "rgba(99,143,188,0.7)", "rgba(181,207,230,0.7)", "rgba(73,32,124,0.7)", "rgba(101,71,145,0.7)", "rgba(157,136,177,0.7)", "rgba(215,201,226,0.7)", "rgba(203,61,171,0.7)"];


    datasets_qualis.push({
        label: 'A1',
        data: a1,
        backgroundColor: colors_rgba[0],
        yAxisID: 'y',
    });

    datasets_qualis.push({
        label: 'A2',
        data: a2,
        backgroundColor: colors_rgba[1],
        yAxisID: 'y',
    });

    datasets_qualis.push(
        {
            label: 'A3',
            data: a3,
            backgroundColor: colors_rgba[2],
            yAxisID: 'y',
        });
    datasets_qualis.push({
        label: 'A4',
        data: a4,
        backgroundColor: colors_rgba[3],
        yAxisID: 'y',
    });
    datasets_qualis.push({
        label: 'B1',
        data: b1,
        backgroundColor: colors_rgba[4],
        yAxisID: 'y',
    });
    datasets_qualis.push({
        label: 'B2',
        data: b2,
        backgroundColor: colors_rgba[5]
    });
    datasets_qualis.push({
        label: 'B3',
        data: b3,
        backgroundColor: colors_rgba[6],
        yAxisID: 'y',
    });
    datasets_qualis.push({
        label: 'B4',
        data: b4,
        backgroundColor: colors_rgba[7],
        yAxisID: 'y',
    });
    datasets_qualis.push({
        label: 'C',
        data: c,
        backgroundColor: colors_rgba[8],
        yAxisID: 'y',
    });




    a1.push(null);
    a2.push(null);
    a3.push(null);
    a4.push(null);
    b1.push(null);
    b2.push(null);
    b3.push(null);
    b4.push(null);
    c.push(null);
    anos.push(null);
   

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartqualisproductions');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartqualisproductions) {
        chartqualisproductions.destroy();
    }
    chartqualisproductions = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: anos,
            datasets: datasets_qualis
        },
        layout: {
            padding: {
                left: 5 // Increase the left margin by 5 pixels
            }
        },
        options: {
            spanGaps: true,
            stacked: false,
            plugins: {
                legend: {
                    display: true,
                    //ltl: true,
                    reverse: true
                },
                datalabels: {
                    display: false
                },

                

                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: {
                        Lattes: {
                            type: 'box',
                            xMin: anos.length - 2.5,
                            xMax: anos.length - 1.5,
                            yMin: 0,
                            borderWidth: 0,
                            //yMax: 70,
                            backgroundColor: 'rgba(100, 99, 255, 0.2)'
                        },
                        label1: {
                            type: 'label',
                            yScaleID: 'y',
                            yValue: max_qualis+0.5,
                            xValue: anos.length - 2,
                            color: 'rgba(100, 99, 255, 0.8)',
                            //backgroundColor: 'rgba(245,245,245)',
                            content: ['Lattes (atual)'],
                            font: {
                                size: 12
                            }
                        }
                    }
                },


            },
            scales: {
                x: {
                    stacked: true,

                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Quantidade',
                    },
                    position: 'left'
                }

            },
            maintainAspectRatio: false,
        },
    });
}

var chartsimulacaoqualisproductions;
export function renderChartQualis_simulacao(idCanvas, listQualisProductions) {
 
    
    // Filtrar os dados com base na black_list
    //listQualisProductions = listQualisProductions.filter(data => !black_list.includes(data.id_pessoa));

    // Recalcular os anos, se necessário
    var anosSet = new Set(Object.keys(listQualisProductions)); //listQualisProductions.map(data => data.ano));
    var anos = [...anosSet].sort();

    // Recalcular as pontuações por ano
    // var pontuacoesPorAno = anos.map(ano => {
    //     return listQualis = {
    //         ano: ano,
    //         A1: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A1, 0),
    //         A2: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A2, 0),
    //         A3: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A3, 0),
    //         A4: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A4, 0),
    //         B1: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B1, 0),
    //         B2: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B2, 0),
    //         B3: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B3, 0),
    //         B4: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B4, 0),
    //         C: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.C, 0),
    //     };
    // });


    // for (var dicionario of pontuacoesPorAno) {
    //     let indProdArt = 1 * dicionario.A1 + 0.875 * dicionario.A2 + 0.75 * dicionario.A3 + 0.625 * dicionario.A4 + 0.5 * dicionario.B1 + 0.375 * dicionario.B2 + 0.25 * dicionario.B3 + 0.125 * dicionario.B4;
    //     let glosa = 0.25 * dicionario.B3 + 0.125 * dicionario.B4;
    //     if (glosa > (0.2 * indProdArt))
    //       indProdArt = 1 * dicionario.A1 + 0.875 * dicionario.A2 + 0.75 * dicionario.A3 + 0.625 * dicionario.A4 + 0.5 * dicionario.B1 + 0.375 * dicionario.B2 + (0.2 * indProdArt);
    //     listIndProds.push({'indprod': indProdArt, 'ano': a})
    // }

    var a1 = [];
    var a2 = [];
    var a3 = [];
    var a4 = [];
    var b1 = [];
    var b2 = [];
    var b3 = [];
    var b4 = [];
    var c = [];

    for (var ano of anos) {
        a1.push(listQualisProductions[ano].A1);
        a2.push(listQualisProductions[ano].A2);
        a3.push(listQualisProductions[ano].A3);
        a4.push(listQualisProductions[ano].A4);
        b1.push(listQualisProductions[ano].B1);
        b2.push(listQualisProductions[ano].B2);
        b3.push(listQualisProductions[ano].B3);
        b4.push(listQualisProductions[ano].B4);
        c.push(listQualisProductions[ano].C);
    }

    //localização da legenda da coluna Lattes
    var max_qualis = listQualisProductions[anos[anos.length-1]].A1+listQualisProductions[anos[anos.length-1]].A2+
                 listQualisProductions[anos[anos.length-1]].A3+listQualisProductions[anos[anos.length-1]].A4+
                 listQualisProductions[anos[anos.length-1]].B1+listQualisProductions[anos[anos.length-1]].B2+
                 listQualisProductions[anos[anos.length-1]].B3+listQualisProductions[anos[anos.length-1]].B4+
                 listQualisProductions[anos[anos.length-1]].C + 5;

    // for (var dicionario of pontuacoesPorAno) {
    //     a1.push(dicionario.A1);
    //     a2.push(dicionario.A2);
    //     a3.push(dicionario.A3);
    //     a4.push(dicionario.A4);
    //     b1.push(dicionario.B1);
    //     b2.push(dicionario.B2);
    //     b3.push(dicionario.B3);
    //     b4.push(dicionario.B4);
    //     c.push(dicionario.C);
    // }

    

    var datasets_qualis = [];

    const colors = ["#002d83", "#175399", "#638fbc", "#b5cfe6", "#49207c", "#654791", "#9d88b1", "#d7c9e2", "#cb3dab"];
    const colors_rgba = ["rgba(0,45,131,0.7)", "rgba(23,83,153,0.7)", "rgba(99,143,188,0.7)", "rgba(181,207,230,0.7)", "rgba(73,32,124,0.7)", "rgba(101,71,145,0.7)", "rgba(157,136,177,0.7)", "rgba(215,201,226,0.7)", "rgba(203,61,171,0.7)"];


    datasets_qualis.push({
        label: 'A1',
        data: a1,
        backgroundColor: colors_rgba[0],
        yAxisID: 'y',
    });

    datasets_qualis.push({
        label: 'A2',
        data: a2,
        backgroundColor: colors_rgba[1],
        yAxisID: 'y',
    });

    datasets_qualis.push(
        {
            label: 'A3',
            data: a3,
            backgroundColor: colors_rgba[2],
            yAxisID: 'y',
        });
    datasets_qualis.push({
        label: 'A4',
        data: a4,
        backgroundColor: colors_rgba[3],
        yAxisID: 'y',
    });
    datasets_qualis.push({
        label: 'B1',
        data: b1,
        backgroundColor: colors_rgba[4],
        yAxisID: 'y',
    });
    datasets_qualis.push({
        label: 'B2',
        data: b2,
        backgroundColor: colors_rgba[5]
    });
    datasets_qualis.push({
        label: 'B3',
        data: b3,
        backgroundColor: colors_rgba[6],
        yAxisID: 'y',
    });
    datasets_qualis.push({
        label: 'B4',
        data: b4,
        backgroundColor: colors_rgba[7],
        yAxisID: 'y',
    });
    datasets_qualis.push({
        label: 'C',
        data: c,
        backgroundColor: colors_rgba[8],
        yAxisID: 'y',
    });




    a1.push(null);
    a2.push(null);
    a3.push(null);
    a4.push(null);
    b1.push(null);
    b2.push(null);
    b3.push(null);
    b4.push(null);
    c.push(null);
    anos.push(null);
   

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartqualisproductions');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartsimulacaoqualisproductions) {
        chartsimulacaoqualisproductions.destroy();
    }
    chartsimulacaoqualisproductions = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: anos,
            datasets: datasets_qualis
        },
        layout: {
            padding: {
                left: 5 // Increase the left margin by 5 pixels
            }
        },
        options: {
            spanGaps: true,
            stacked: false,
            plugins: {
                legend: {
                    display: true,
                    //ltl: true,
                    reverse: true
                },
                datalabels: {
                    display: false
                },

                

                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: {
                        Lattes: {
                            type: 'box',
                            xMin: anos.length - 2.5,
                            xMax: anos.length - 1.5,
                            yMin: 0,
                            borderWidth: 0,
                            //yMax: 70,
                            backgroundColor: 'rgba(100, 99, 255, 0.2)'
                        },
                        label1: {
                            type: 'label',
                            yScaleID: 'y',
                            yValue: max_qualis+0.5,
                            xValue: anos.length - 2,
                            color: 'rgba(100, 99, 255, 0.8)',
                            //backgroundColor: 'rgba(245,245,245)',
                            content: ['Lattes (atual)'],
                            font: {
                                size: 12
                            }
                        }
                    }
                },


            },
            scales: {
                x: {
                    stacked: true,

                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Quantidade',
                    },
                    position: 'left'
                }

            },
            maintainAspectRatio: false,
        },
    });
}



// var chartqualisproductions;
// export function renderChartQualisProductions(idCanvas, listQualisProductions, black_list) {
 
    
//     // Filtrar os dados com base na black_list
//     listQualisProductions = listQualisProductions.filter(data => !black_list.includes(data.id_pessoa));

//     // Recalcular os anos, se necessário
//     var anosSet = new Set(listQualisProductions.map(data => data.ano));
//     var anos = [...anosSet].sort();

//     var max_qualis = 0;

//     // Recalcular as pontuações por ano
//     var pontuacoesPorAno = anos.map(ano => {
//         let listQualis = {
//             ano: ano,
//             A1: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A1, 0),
//             A2: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A2, 0),
//             A3: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A3, 0),
//             A4: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A4, 0),
//             B1: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B1, 0),
//             B2: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B2, 0),
//             B3: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B3, 0),
//             B4: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B4, 0),
//             C: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.C, 0),
//         };
//         if(max_qualis < (listQualis.A1+listQualis.A2+listQualis.A3+listQualis.A4+listQualis.B1+listQualis.B2+listQualis.B3+listQualis.B4+listQualis.C))
//             max_qualis = (listQualis.A1+listQualis.A2+listQualis.A3+listQualis.A4+listQualis.B1+listQualis.B2+listQualis.B3+listQualis.B4+listQualis.C);
//         return listQualis;
//     });

//     // for (var dicionario of pontuacoesPorAno) {
//     //     let indProdArt = 1 * dicionario.A1 + 0.875 * dicionario.A2 + 0.75 * dicionario.A3 + 0.625 * dicionario.A4 + 0.5 * dicionario.B1 + 0.375 * dicionario.B2 + 0.25 * dicionario.B3 + 0.125 * dicionario.B4;
//     //     let glosa = 0.25 * dicionario.B3 + 0.125 * dicionario.B4;
//     //     if (glosa > (0.2 * indProdArt))
//     //       indProdArt = 1 * dicionario.A1 + 0.875 * dicionario.A2 + 0.75 * dicionario.A3 + 0.625 * dicionario.A4 + 0.5 * dicionario.B1 + 0.375 * dicionario.B2 + (0.2 * indProdArt);
//     //     listIndProds.push({'indprod': indProdArt, 'ano': a})
//     // }

//     var a1 = [];
//     var a2 = [];
//     var a3 = [];
//     var a4 = [];
//     var b1 = [];
//     var b2 = [];
//     var b3 = [];
//     var b4 = [];
//     var c = [];

//     for (var dicionario of pontuacoesPorAno) {
//         a1.push(dicionario.A1);
//         a2.push(dicionario.A2);
//         a3.push(dicionario.A3);
//         a4.push(dicionario.A4);
//         b1.push(dicionario.B1);
//         b2.push(dicionario.B2);
//         b3.push(dicionario.B3);
//         b4.push(dicionario.B4);
//         c.push(dicionario.C);
//     }

    

//     var datasets_qualis = [];

//     const colors = ["#002d83", "#175399", "#638fbc", "#b5cfe6", "#49207c", "#654791", "#9d88b1", "#d7c9e2", "#cb3dab"];
//     const colors_rgba = ["rgba(0,45,131,0.7)", "rgba(23,83,153,0.7)", "rgba(99,143,188,0.7)", "rgba(181,207,230,0.7)", "rgba(73,32,124,0.7)", "rgba(101,71,145,0.7)", "rgba(157,136,177,0.7)", "rgba(215,201,226,0.7)", "rgba(203,61,171,0.7)"];


//     datasets_qualis.push({
//         label: 'A1',
//         data: a1,
//         backgroundColor: colors_rgba[0],
//         yAxisID: 'y',
//     });

//     datasets_qualis.push({
//         label: 'A2',
//         data: a2,
//         backgroundColor: colors_rgba[1],
//         yAxisID: 'y',
//     });

//     datasets_qualis.push(
//         {
//             label: 'A3',
//             data: a3,
//             backgroundColor: colors_rgba[2],
//             yAxisID: 'y',
//         });
//     datasets_qualis.push({
//         label: 'A4',
//         data: a4,
//         backgroundColor: colors_rgba[3],
//         yAxisID: 'y',
//     });
//     datasets_qualis.push({
//         label: 'B1',
//         data: b1,
//         backgroundColor: colors_rgba[4],
//         yAxisID: 'y',
//     });
//     datasets_qualis.push({
//         label: 'B2',
//         data: b2,
//         backgroundColor: colors_rgba[5]
//     });
//     datasets_qualis.push({
//         label: 'B3',
//         data: b3,
//         backgroundColor: colors_rgba[6],
//         yAxisID: 'y',
//     });
//     datasets_qualis.push({
//         label: 'B4',
//         data: b4,
//         backgroundColor: colors_rgba[7],
//         yAxisID: 'y',
//     });
//     datasets_qualis.push({
//         label: 'C',
//         data: c,
//         backgroundColor: colors_rgba[8],
//         yAxisID: 'y',
//     });




//     a1.push(null);
//     a2.push(null);
//     a3.push(null);
//     a4.push(null);
//     b1.push(null);
//     b2.push(null);
//     b3.push(null);
//     b4.push(null);
//     c.push(null);
//     anos.push(null);
   

//     const canvas = document.getElementById(idCanvas);
//     const ctx = canvas.getContext("2d");
//     //const ctx = document.getElementById('chartqualisproductions');

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (chartqualisproductions) {
//         chartqualisproductions.destroy();
//     }
//     chartqualisproductions = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: anos,
//             datasets: datasets_qualis
//         },
//         layout: {
//             padding: {
//                 left: 5 // Increase the left margin by 5 pixels
//             }
//         },
//         options: {
//             spanGaps: true,
//             stacked: false,
//             plugins: {
//                 legend: {
//                     display: true,
//                     //ltl: true,
//                     reverse: true
//                 },
//                 datalabels: {
//                     display: false
//                 },

//                 annotation: {
//                     drawTime: 'beforeDatasetsDraw',
//                     annotations: {
//                         Lattes: {
//                             type: 'box',
//                             xMin: anos.length - 2.5,
//                             xMax: anos.length - 1.5,
//                             yMin: 0,
//                             borderWidth: 0,
//                             //yMax: 70,
//                             backgroundColor: 'rgba(100, 99, 255, 0.2)'
//                         },
//                         label1: {
//                             type: 'label',
//                             yScaleID: 'y',
//                             yValue: max_qualis+0.5,
//                             xValue: anos.length - 2,
//                             color: 'rgba(100, 99, 255, 0.8)',
//                             //backgroundColor: 'rgba(245,245,245)',
//                             content: ['Lattes (atual)'],
//                             font: {
//                                 size: 12
//                             }
//                         }
//                     }
//                 },


//             },
//             scales: {
//                 x: {
//                     stacked: true,

//                 },
//                 y: {
//                     stacked: true,
//                     title: {
//                         display: true,
//                         text: 'Quantidade',
//                     },
//                     position: 'left'
//                 }

//             },
//             maintainAspectRatio: false,
//         },
//     });
// }

var chartindprodsproductions;
export function renderChartIndprods_(idCanvas, listAvgIndProds, indicadores) {
    
    // Recalcular os anos, se necessário
    var anosSet = new Set(Object.keys(listAvgIndProds.indprods));//map(data => data.ano));
    var anos = [...anosSet].sort();


    var counts = Object.keys(listAvgIndProds.indprods).map(function(key){
        if (listAvgIndProds.indprods[key] === 0.0) return null
        return listAvgIndProds.indprods[key];
    });

    var datasets_indprod = [
        {
            type: 'line',
            label: 'IndProd',
            data: counts,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            yAxisID: 'y',
        }];

    var colors_indprods = ['rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(153, 102, 255)'];
    var point_styles = ['cross', 'rect', 'triangle','dash', 'star']
    
    var labelsAvg = [];
    var avgCounts = [];
    var conceito = '3';

    var max_indprod = 0;
    var max_indprod_temp = 0;

    max_indprod_temp = Math.max(...counts);
    if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

    let cor_estilo = 0;

    for(var i = parseInt(listAvgIndProds['conceito']); i<=parseInt(listAvgIndProds['maxima']); i++){
    //for (var i = 0; i < curvas.length; i++) {
        if (listAvgIndProds[i.toString()]) {
            conceito = i.toString();

            labelsAvg = listAvgIndProds[conceito].map(ind => ind.ano);
            avgCounts = listAvgIndProds[conceito].map(ind => ind.indprodall);

            max_indprod_temp = Math.max(...avgCounts);
            if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

            datasets_indprod.push({
                type: 'line',
                label: `PPGs nota ${conceito}`,
                data: avgCounts,
                //lineTension: 0.4,
                backgroundColor: colors_indprods[cor_estilo],
                borderColor: colors_indprods[cor_estilo],//'rgb(220, 20, 60)',
                borderWidth: 1,
                pointStyle: point_styles[cor_estilo],
                yAxisID: 'y'
            });
            cor_estilo++;
        }
    }
    // if (listAvgIndProds['país']) {
    //     labelsAvg = listAvgIndProds['pais'].map(ind => ind.ano);
    //     avgCounts = listAvgIndProds['pais'].map(ind => ind.indprodall);

    //     max_indprod_temp = Math.max(...avgCounts);
    //     if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

    //     datasets_indprod.push({
    //         type: 'line',
    //         label: `Avg IndProd (PPGs do país)`,
    //         data: avgCounts,
    //         //lineTension: 0.4,
    //         borderColor: 'rgb(220, 20, 60)',
    //         //backgroundColor: 'rgb(220, 20, 60)',
    //         borderWidth: 1,
    //         pointRadius: 1,
    //         borderDash: [5,5],
    //         yAxisID: 'y'
    //     });
    // }
    // else if (listAvgIndProds['região']) {
    //     labelsAvg = listAvgIndProds['regiao'].map(ind => ind.ano);
    //     avgCounts = listAvgIndProds['regiao'].map(ind => ind.indprodall);

    //     max_indprod_temp = Math.max(...avgCounts);
    //     if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

    //     datasets_indprod.push({
    //         type: 'line',
    //         label: `Avg IndProd (PPGs da região ${listAvgIndProds['nome_regiao']})`,
    //         data: avgCounts,
    //         //lineTension: 0.4,
    //         borderColor: 'darkgreen',
    //         borderWidth: 1,
    //         pointRadius: 1,
    //         borderDash: [5,5],
    //         yAxisID: 'y'
    //     });
    // }
    // else if (listAvgIndProds['uf']) {
    //     labelsAvg = listAvgIndProds['uf'].map(ind => ind.ano);
    //     avgCounts = listAvgIndProds['uf'].map(ind => ind.indprodall);

    //     max_indprod_temp = Math.max(...avgCounts);
    //     if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

    //     datasets_indprod.push({
    //         type: 'line',
    //         label: `Avg IndProd (PPGs do estado ${listAvgIndProds['nome_uf']})`,
    //         data: avgCounts,
    //         //lineTension: 0.4,
    //         borderColor: 'rgb(120, 20, 220)',
    //         //backgroundColor: 'rgb(120, 20, 220)',
    //         borderWidth: 1,
    //         pointRadius: 1,
    //         borderDash: [5,5],
    //         yAxisID: 'y'
    //     });
    // }


    var annotation_values = {
        line_fraco: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.fraco,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_fraco: {
            type: 'label',
            xValue: anos.length,
            yValue: indicadores.fraco + 0.06,
            color: 'grey',
            yScaleID: 'y',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Fraco'],
            font: {
                size: 10
            }
        },
        line_regular: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.regular,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_regular: {
            type: 'label',
            xValue: anos.length,
            yValue: indicadores.regular + 0.06,
            color: 'grey',
            yScaleID: 'y',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Reg.'],
            font: {
                size: 10
            }
        },
        line_bom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.bom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_bom: {
            type: 'label',
            xValue: anos.length,
            yValue: indicadores.bom + 0.06,
            color: 'grey',
            yScaleID: 'y',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Bom'],
            font: {
                size: 10
            }
        },
        line_muitobom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.mbom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_muitobom: {
            type: 'label',
            xValue: anos.length,
            yValue: indicadores.mbom + 0.06,
            yScaleID: 'y',
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['M.Bom'],
            font: {
                size: 10
            }
        },
        Lattes: {
            type: 'box',
            xMin: anos.length - 1.5,
            xMax: anos.length - 0.5,
            yMin: 0,
            borderWidth: 0,
            //yMax: 70,
            backgroundColor: 'rgba(100, 99, 255, 0.2)'
        },
        label1: {
            type: 'label',
            yScaleID: 'y',
            yValue: max_indprod + 0.25,
            xValue: anos.length - 1,
            color: 'rgba(100, 99, 255, 0.8)',
            //backgroundColor: 'rgba(245,245,245)',
            content: ['Lattes (atual)'],
            font: {
                size: 12
            }
        }
    };


    if(indicadores.mbom === 0)
        annotation_values = {};

    //const max_indprod = Math.max(...counts, ...avgCounts);

    anos.push(null);
    counts.push(null);
    labelsAvg.push(null);
    avgCounts.push(null);


    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartindprodsproductions');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartindprodsproductions) {
        chartindprodsproductions.destroy();
    }
    chartindprodsproductions = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: anos,
            datasets: datasets_indprod
        },
        layout: {
            padding: {
                left: 5 // Increase the left margin by 5 pixels
            }
        },
        options: {
            spanGaps: true,
            stacked: false,
            plugins: {
                legend: {
                    display: true,
                    //ltl: true,
                    reverse: true
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = '';

                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(3);
                            }
                            return ' indProd: ' + label;
                        }
                    }
                },

                datalabels: {
                    display: 
                    
                    function (context) {
                        if (context.dataset.label.includes('IndProd'))
                            return true; // Mostra rótulos apenas para o conjunto de dados 'IndProd'
                        return false;
                    },
                     align: 'end', // Alinha o rótulo no final da barra/linha
                     anchor: 'end', // Ancora o rótulo no final da barra/linha
                    formatter: function (value) {
                        return value.toFixed(2); // Formata o valor do rótulo (número de casas decimais)
                    },
                    // color: function (context) {
                    //     if (context.dataset.label.includes('pais'))
                    //         return 'rgb(220, 20, 60)';
                    //     if (context.dataset.label.includes('estado'))
                    //         return 'rgb(120, 20, 220)';
                    //     if (context.dataset.label.includes('região'))
                    //         return 'darkgreen';
                    //     if (context.dataset.label.includes('nota'))
                    //         return colors_indprods[parseInt(context.dataset.label[context.dataset.label.indexOf("nota")+5])-parseInt(listAvgIndProds['conceito'])];
                    //     if (context.dataset.label.includes('IndProd'))
                    //         return 'black'; // Cor do rótulo
                    // },

                },

                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: annotation_values
                },


            },
            scales: {
                x: {
                    stacked: true,

                },
                y: {
                    max: max_indprod+0.5,
                    stacked: false,
                    title: {
                        display: true,
                        text: 'IndProd',
                    },
                    position: 'left'
                },
                // y1: {
                //     //type: 'linear',
                //     //stacked: true,
                //     title: {
                //         display: true,
                //         text: 'IndProd',
                //     },
                //     position: 'right', // Position the second y-axis on the right side
                //     //grid: {
                //     //  drawOnChartArea: false, // Hide the grid lines for the second y-axis
                //     //},
                // },

            },
            maintainAspectRatio: false,
        },
    });
}


var chartsimulacaoindprodsproductions;
export function renderChartIndprods_simulacao(idCanvas, listAvgIndProds, indicadores) {
    
    // Recalcular os anos, se necessário
    var anosSet = new Set(Object.keys(listAvgIndProds.indprods));//map(data => data.ano));
    var anos = [...anosSet].sort();


    var counts = Object.keys(listAvgIndProds.indprods).map(function(key){
        if (listAvgIndProds.indprods[key] === 0.0) return null
        return listAvgIndProds.indprods[key];
    });

    var datasets_indprod = [
        {
            type: 'line',
            label: 'IndProd',
            data: counts,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            yAxisID: 'y',
        }];

    var colors_indprods = ['rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(153, 102, 255)'];
    var point_styles = ['cross', 'rect', 'triangle','dash', 'star']
    
    var labelsAvg = [];
    var avgCounts = [];
    var conceito = '3';

    var max_indprod = 0;
    var max_indprod_temp = 0;

    max_indprod_temp = Math.max(...counts);
    if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

    let cor_estilo = 0;

    for(var i = parseInt(listAvgIndProds['conceito']); i<=parseInt(listAvgIndProds['maxima']); i++){
    //for (var i = 0; i < curvas.length; i++) {
        if (listAvgIndProds[i.toString()]) {
            conceito = i.toString();

            labelsAvg = listAvgIndProds[conceito].map(ind => ind.ano);
            avgCounts = listAvgIndProds[conceito].map(ind => ind.indprodall);

            max_indprod_temp = Math.max(...avgCounts);
            if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

            datasets_indprod.push({
                type: 'line',
                label: `PPGs nota ${conceito}`,
                data: avgCounts,
                //lineTension: 0.4,
                backgroundColor: colors_indprods[cor_estilo],
                borderColor: colors_indprods[cor_estilo],//'rgb(220, 20, 60)',
                borderWidth: 1,
                pointStyle: point_styles[cor_estilo],
                yAxisID: 'y'
            });
            cor_estilo++;
        }
    }
    // if (listAvgIndProds['país']) {
    //     labelsAvg = listAvgIndProds['pais'].map(ind => ind.ano);
    //     avgCounts = listAvgIndProds['pais'].map(ind => ind.indprodall);

    //     max_indprod_temp = Math.max(...avgCounts);
    //     if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

    //     datasets_indprod.push({
    //         type: 'line',
    //         label: `Avg IndProd (PPGs do país)`,
    //         data: avgCounts,
    //         //lineTension: 0.4,
    //         borderColor: 'rgb(220, 20, 60)',
    //         //backgroundColor: 'rgb(220, 20, 60)',
    //         borderWidth: 1,
    //         pointRadius: 1,
    //         borderDash: [5,5],
    //         yAxisID: 'y'
    //     });
    // }
    // else if (listAvgIndProds['região']) {
    //     labelsAvg = listAvgIndProds['regiao'].map(ind => ind.ano);
    //     avgCounts = listAvgIndProds['regiao'].map(ind => ind.indprodall);

    //     max_indprod_temp = Math.max(...avgCounts);
    //     if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

    //     datasets_indprod.push({
    //         type: 'line',
    //         label: `Avg IndProd (PPGs da região ${listAvgIndProds['nome_regiao']})`,
    //         data: avgCounts,
    //         //lineTension: 0.4,
    //         borderColor: 'darkgreen',
    //         borderWidth: 1,
    //         pointRadius: 1,
    //         borderDash: [5,5],
    //         yAxisID: 'y'
    //     });
    // }
    // else if (listAvgIndProds['uf']) {
    //     labelsAvg = listAvgIndProds['uf'].map(ind => ind.ano);
    //     avgCounts = listAvgIndProds['uf'].map(ind => ind.indprodall);

    //     max_indprod_temp = Math.max(...avgCounts);
    //     if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

    //     datasets_indprod.push({
    //         type: 'line',
    //         label: `Avg IndProd (PPGs do estado ${listAvgIndProds['nome_uf']})`,
    //         data: avgCounts,
    //         //lineTension: 0.4,
    //         borderColor: 'rgb(120, 20, 220)',
    //         //backgroundColor: 'rgb(120, 20, 220)',
    //         borderWidth: 1,
    //         pointRadius: 1,
    //         borderDash: [5,5],
    //         yAxisID: 'y'
    //     });
    // }

    var annotation_values = {
        line_fraco: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.fraco,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_fraco: {
            type: 'label',
            xValue: anos.length,
            yValue: indicadores.fraco + 0.06,
            color: 'grey',
            yScaleID: 'y',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Fraco'],
            font: {
                size: 10
            }
        },
        line_regular: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.regular,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_regular: {
            type: 'label',
            xValue: anos.length,
            yValue: indicadores.regular + 0.06,
            color: 'grey',
            yScaleID: 'y',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Reg.'],
            font: {
                size: 10
            }
        },
        line_bom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.bom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_bom: {
            type: 'label',
            xValue: anos.length,
            yValue: indicadores.bom + 0.06,
            color: 'grey',
            yScaleID: 'y',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Bom'],
            font: {
                size: 10
            }
        },
        line_muitobom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.mbom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_muitobom: {
            type: 'label',
            xValue: anos.length,
            yValue: indicadores.mbom + 0.06,
            yScaleID: 'y',
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['M.Bom'],
            font: {
                size: 10
            }
        },
        Lattes: {
            type: 'box',
            xMin: anos.length - 1.5,
            xMax: anos.length - 0.5,
            yMin: 0,
            borderWidth: 0,
            //yMax: 70,
            backgroundColor: 'rgba(100, 99, 255, 0.2)'
        },
        label1: {
            type: 'label',
            yScaleID: 'y',
            yValue: max_indprod + 0.25,
            xValue: anos.length - 1,
            color: 'rgba(100, 99, 255, 0.8)',
            //backgroundColor: 'rgba(245,245,245)',
            content: ['Lattes (atual)'],
            font: {
                size: 12
            }
        }
    };


    if(indicadores.mbom === 0)
        annotation_values = {};
    

    //const max_indprod = Math.max(...counts, ...avgCounts);

    anos.push(null);
    counts.push(null);
    labelsAvg.push(null);
    avgCounts.push(null);


    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartindprodsproductions');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartsimulacaoindprodsproductions) {
        chartsimulacaoindprodsproductions.destroy();
    }
    chartsimulacaoindprodsproductions = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: anos,
            datasets: datasets_indprod
        },
        layout: {
            padding: {
                left: 5 // Increase the left margin by 5 pixels
            }
        },
        options: {
            spanGaps: true,
            stacked: false,
            plugins: {
                legend: {
                    display: true,
                    //ltl: true,
                    reverse: true
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = '';

                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(3);
                            }
                            return ' indProd: ' + label;
                        }
                    }
                },

                datalabels: {
                    display: 
                    
                    function (context) {
                        if (context.dataset.label.includes('IndProd'))
                            return true; // Mostra rótulos apenas para o conjunto de dados 'IndProd'
                        return false;
                    },
                     align: 'end', // Alinha o rótulo no final da barra/linha
                     anchor: 'end', // Ancora o rótulo no final da barra/linha
                    formatter: function (value) {
                        return value.toFixed(2); // Formata o valor do rótulo (número de casas decimais)
                    },
                    // color: function (context) {
                    //     if (context.dataset.label.includes('pais'))
                    //         return 'rgb(220, 20, 60)';
                    //     if (context.dataset.label.includes('estado'))
                    //         return 'rgb(120, 20, 220)';
                    //     if (context.dataset.label.includes('região'))
                    //         return 'darkgreen';
                    //     if (context.dataset.label.includes('nota'))
                    //         return colors_indprods[parseInt(context.dataset.label[context.dataset.label.indexOf("nota")+5])-parseInt(listAvgIndProds['conceito'])];
                    //     if (context.dataset.label.includes('IndProd'))
                    //         return 'black'; // Cor do rótulo
                    // },

                },

                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: annotation_values
                },


            },
            scales: {
                x: {
                    stacked: true,

                },
                y: {
                    max: max_indprod+0.5,
                    stacked: false,
                    title: {
                        display: true,
                        text: 'IndProd',
                    },
                    position: 'left'
                },
                // y1: {
                //     //type: 'linear',
                //     //stacked: true,
                //     title: {
                //         display: true,
                //         text: 'IndProd',
                //     },
                //     position: 'right', // Position the second y-axis on the right side
                //     //grid: {
                //     //  drawOnChartArea: false, // Hide the grid lines for the second y-axis
                //     //},
                // },

            },
            maintainAspectRatio: false,
        },
    });
}


// var chartindprodsproductions;
// export function renderChartIndprodsProductions(idCanvas, listQualisProductions, listPermanentesTotal, listAvgIndProds, black_list, curvas) {
    
//     var listaPermanentes = listQualisProductions.map(data => data.id_pessoa);
//     listaPermanentes = [...new Set(listaPermanentes.filter(data => ![""].includes(data)))];

//     // Filtrar os dados com base na black_list
//     listQualisProductions = listQualisProductions.filter(data => !black_list.includes(data.id_pessoa));

//     // Recalcular os anos, se necessário
//     var anosSet = new Set(listQualisProductions.map(data => data.ano));
//     var anos = [...anosSet].sort();

//     var listIndProds = []
//     // Recalcular as pontuações por ano
//     var pontuacoesPorAno = anos.map(ano => {
//         let listQualis = {
//             ano: ano,
//             A1: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A1, 0),
//             A2: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A2, 0),
//             A3: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A3, 0),
//             A4: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.A4, 0),
//             B1: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B1, 0),
//             B2: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B2, 0),
//             B3: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B3, 0),
//             B4: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.B4, 0),
//             C: listQualisProductions.filter(data => data.ano === ano).reduce((acc, data) => acc + data.C, 0),
//         };

//         let indProdArt = 1 * listQualis.A1 + 0.875 * listQualis.A2 + 0.75 * listQualis.A3 + 0.625 * listQualis.A4 + 0.5 * listQualis.B1 + 0.375 * listQualis.B2 + 0.25 * listQualis.B3 + 0.125 * listQualis.B4;
//         let glosa = 0.25 * listQualis.B3 + 0.125 * listQualis.B4;
//         if (glosa > (0.2 * indProdArt))
//             indProdArt = 1 * listQualis.A1 + 0.875 * listQualis.A2 + 0.75 * listQualis.A3 + 0.625 * listQualis.A4 + 0.5 * listQualis.B1 + 0.375 * listQualis.B2 + (0.2 * indProdArt);
//         listIndProds.push({ 'indprod': indProdArt / listPermanentesTotal[ano].length, 'ano': listQualis.ano });

//         return listQualis;

//     });

   

//     var labels = listIndProds.map(ind => ind.ano);
//     var counts = listIndProds.map(ind => {
//         if (ind.indprod === 0.0) return null
//         return ind.indprod;
//     });

//     var datasets_indprod = [
//         {
//             type: 'line',
//             label: 'IndProd',
//             data: counts,
//             backgroundColor: 'rgb(54, 162, 235)',
//             borderColor: 'rgb(54, 162, 235)',
//             yAxisID: 'y',
//         }];

//     var colors_indprods = ['rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(153, 102, 255)'];
//     var point_styles = ['cross', 'rect', 'triangle','dash', 'star']
    
//     var labelsAvg = [];
//     var avgCounts = [];
//     var conceito = '3';

//     var max_indprod = 0;
//     var max_indprod_temp = 0;

//     max_indprod_temp = Math.max(...counts);
//     if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

//     //for(var i = parseInt(listAvgIndProds['conceito']); i<=parseInt(listAvgIndProds['maxima']); i++){
//     for (var i = 0; i < curvas.length; i++) {
//         if (curvas[i].includes('conceito')) {
//             conceito = curvas[i].substring(9)

//             labelsAvg = listAvgIndProds[conceito].map(ind => ind.ano);
//             avgCounts = listAvgIndProds[conceito].map(ind => ind.indprodall);

//             max_indprod_temp = Math.max(...avgCounts);
//             if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

//             datasets_indprod.push({
//                 type: 'line',
//                 label: `Avg IndProd (PPGs nota ${conceito})`,
//                 data: avgCounts,
//                 //lineTension: 0.4,
//                 backgroundColor: colors_indprods[i],
//                 borderColor: colors_indprods[i],//'rgb(220, 20, 60)',
//                 borderWidth: 1,
//                 pointStyle: point_styles[i],
//                 yAxisID: 'y'
//             });
//         }
//         else if (curvas[i].includes('país')) {
//             labelsAvg = listAvgIndProds['pais'].map(ind => ind.ano);
//             avgCounts = listAvgIndProds['pais'].map(ind => ind.indprodall);

//             max_indprod_temp = Math.max(...avgCounts);
//             if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

//             datasets_indprod.push({
//                 type: 'line',
//                 label: `Avg IndProd (PPGs do país)`,
//                 data: avgCounts,
//                 //lineTension: 0.4,
//                 borderColor: 'rgb(220, 20, 60)',
//                 //backgroundColor: 'rgb(220, 20, 60)',
//                 borderWidth: 1,
//                 pointRadius: 1,
//                 borderDash: [5,5],
//                 yAxisID: 'y'
//             });
//         }
//         else if (curvas[i].includes('região')) {
//             labelsAvg = listAvgIndProds['regiao'].map(ind => ind.ano);
//             avgCounts = listAvgIndProds['regiao'].map(ind => ind.indprodall);

//             max_indprod_temp = Math.max(...avgCounts);
//             if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

//             datasets_indprod.push({
//                 type: 'line',
//                 label: `Avg IndProd (PPGs da região ${listAvgIndProds['nome_regiao']})`,
//                 data: avgCounts,
//                 //lineTension: 0.4,
//                 borderColor: 'darkgreen',
//                 borderWidth: 1,
//                 pointRadius: 1,
//                 borderDash: [5,5],
//                 yAxisID: 'y'
//             });
//         }
//         else if (curvas[i].includes('uf')) {
//             labelsAvg = listAvgIndProds['uf'].map(ind => ind.ano);
//             avgCounts = listAvgIndProds['uf'].map(ind => ind.indprodall);

//             max_indprod_temp = Math.max(...avgCounts);
//             if(max_indprod_temp > max_indprod) max_indprod = max_indprod_temp;

//             datasets_indprod.push({
//                 type: 'line',
//                 label: `Avg IndProd (PPGs do estado ${listAvgIndProds['nome_uf']})`,
//                 data: avgCounts,
//                 //lineTension: 0.4,
//                 borderColor: 'rgb(120, 20, 220)',
//                 //backgroundColor: 'rgb(120, 20, 220)',
//                 borderWidth: 1,
//                 pointRadius: 1,
//                 borderDash: [5,5],
//                 yAxisID: 'y'
//             });
//         }
//     }

    

//     //const max_indprod = Math.max(...counts, ...avgCounts);

//     anos.push(null);
//     labels.push(null);
//     counts.push(null);
//     labelsAvg.push(null);
//     avgCounts.push(null);


//     const canvas = document.getElementById(idCanvas);
//     const ctx = canvas.getContext("2d");
//     //const ctx = document.getElementById('chartindprodsproductions');

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (chartindprodsproductions) {
//         chartindprodsproductions.destroy();
//     }
//     chartindprodsproductions = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: anos,
//             datasets: datasets_indprod
//         },
//         layout: {
//             padding: {
//                 left: 5 // Increase the left margin by 5 pixels
//             }
//         },
//         options: {
//             spanGaps: true,
//             stacked: false,
//             plugins: {
//                 legend: {
//                     display: true,
//                     //ltl: true,
//                     reverse: true
//                 },

//                 datalabels: {
//                     display: function (context) {
//                         if (context.dataset.label.includes('IndProd'))
//                             return true; // Mostra rótulos apenas para o conjunto de dados 'IndProd'
//                         return false;
//                     },
//                     align: 'end', // Alinha o rótulo no final da barra/linha
//                     anchor: 'end', // Ancora o rótulo no final da barra/linha
//                     formatter: function (value) {
//                         return value.toFixed(2); // Formata o valor do rótulo (número de casas decimais)
//                     },
//                     color: function (context) {
//                         if (context.dataset.label.includes('pais'))
//                             return 'rgb(220, 20, 60)';
//                         if (context.dataset.label.includes('estado'))
//                             return 'rgb(120, 20, 220)';
//                         if (context.dataset.label.includes('região'))
//                             return 'darkgreen';
//                         if (context.dataset.label.includes('nota'))
//                             return colors_indprods[parseInt(context.dataset.label[context.dataset.label.indexOf("nota")+5])-parseInt(listAvgIndProds['conceito'])];
//                         if (context.dataset.label.includes('IndProd'))
//                             return 'black'; // Cor do rótulo
//                     },

//                 },

//                 annotation: {
//                     drawTime: 'beforeDatasetsDraw',
//                     annotations: {
//                         line_fraco: {
//                             type: 'line',
//                             scaleID: 'y',
//                             value: 0.5,
//                             borderColor: 'grey',
//                             borderWidth: 2,
//                             borderDash: [1, 2]
//                         },
//                         label_fraco: {
//                             type: 'label',
//                             xValue: anos.length - 1,
//                             yValue: 0.56,
//                             color: 'grey',
//                             yScaleID: 'y',
//                             //backgroundColor: 'rgba(245,245,245)',
//                             //borderColor: 'black',
//                             //borderWidth: 1,
//                             //borderRadius: 2,
//                             content: ['Fraco'],
//                             font: {
//                                 size: 10
//                             }
//                         },
//                         line_regular: {
//                             type: 'line',
//                             scaleID: 'y',
//                             value: 1.0,
//                             borderColor: 'grey',
//                             borderWidth: 2,
//                             borderDash: [1, 2]
//                         },
//                         label_regular: {
//                             type: 'label',
//                             xValue: anos.length - 1,
//                             yValue: 1.06,
//                             color: 'grey',
//                             yScaleID: 'y',
//                             //backgroundColor: 'rgba(245,245,245)',
//                             //borderColor: 'black',
//                             //borderWidth: 1,
//                             //borderRadius: 2,
//                             content: ['Reg.'],
//                             font: {
//                                 size: 10
//                             }
//                         },
//                         line_bom: {
//                             type: 'line',
//                             scaleID: 'y',
//                             value: 1.6,
//                             borderColor: 'grey',
//                             borderWidth: 2,
//                             borderDash: [1, 2]
//                         },
//                         label_bom: {
//                             type: 'label',
//                             xValue: anos.length - 1,
//                             yValue: 1.66,
//                             color: 'grey',
//                             yScaleID: 'y',
//                             //backgroundColor: 'rgba(245,245,245)',
//                             //borderColor: 'black',
//                             //borderWidth: 1,
//                             //borderRadius: 2,
//                             content: ['Bom'],
//                             font: {
//                                 size: 10
//                             }
//                         },
//                         line_muitobom: {
//                             type: 'line',
//                             scaleID: 'y',
//                             value: 2.3,
//                             borderColor: 'grey',
//                             borderWidth: 2,
//                             borderDash: [1, 2]
//                         },
//                         label_muitobom: {
//                             type: 'label',
//                             xValue: anos.length - 1,
//                             yValue: 2.36,
//                             yScaleID: 'y',
//                             color: 'grey',
//                             //backgroundColor: 'rgba(245,245,245)',
//                             //borderColor: 'black',
//                             //borderWidth: 1,
//                             //borderRadius: 2,
//                             content: ['M.Bom'],
//                             font: {
//                                 size: 10
//                             }
//                         },
//                         Lattes: {
//                             type: 'box',
//                             xMin: anos.length - 2.5,
//                             xMax: anos.length - 1.5,
//                             yMin: 0,
//                             borderWidth: 0,
//                             //yMax: 70,
//                             backgroundColor: 'rgba(100, 99, 255, 0.2)'
//                         },
//                         label1: {
//                             type: 'label',
//                             yScaleID: 'y',
//                             yValue: max_indprod + 0.25,
//                             xValue: anos.length - 2,
//                             color: 'rgba(100, 99, 255, 0.8)',
//                             //backgroundColor: 'rgba(245,245,245)',
//                             content: ['Lattes (atual)'],
//                             font: {
//                                 size: 12
//                             }
//                         }
//                     }
//                 },


//             },
//             scales: {
//                 x: {
//                     stacked: true,

//                 },
//                 y: {
//                     max: max_indprod+0.5,
//                     stacked: false,
//                     title: {
//                         display: true,
//                         text: 'IndProd',
//                     },
//                     position: 'left'
//                 },
//                 // y1: {
//                 //     //type: 'linear',
//                 //     //stacked: true,
//                 //     title: {
//                 //         display: true,
//                 //         text: 'IndProd',
//                 //     },
//                 //     position: 'right', // Position the second y-axis on the right side
//                 //     //grid: {
//                 //     //  drawOnChartArea: false, // Hide the grid lines for the second y-axis
//                 //     //},
//                 // },

//             },
//             maintainAspectRatio: false,
//         },
//     });
// }

var chartpartdis;
export function renderChartPartDiss(idCanvas, listPartDiss, listAvgPartDiss, indicadores, nota_ppg) {
    const labels = listPartDiss.map(ind => ind.ano);
    const counts = listPartDiss.map(ind => ind.partdis);

    const labelsAvg = listAvgPartDiss.map(ind => ind.ano);
    const avgCounts = listAvgPartDiss.map(ind => {
        if (ind.partdisall === 0.0) return null;
        return ind.partdisall;
    });

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartpartdis').getContext("2d");

    var annotation_values = {
        line_fraco: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.fraco,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_fraco: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.fraco + 0.008,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Fraco'],
            font: {
                size: 10
            }
        },
        line_regular: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.regular,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_regular: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.regular + 0.02,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Reg.'],
            font: {
                size: 10
            }
        },
        line_bom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.bom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_bom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.bom + 0.02,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Bom'],
            font: {
                size: 10
            }
        },
        line_muitobom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.mbom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_muitobom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.mbom + 0.02,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['M.Bom'],
            font: {
                size: 10
            }
        }
    };

    if(indicadores.mbom === 0)
        annotation_values = {};


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartpartdis) {
        chartpartdis.destroy();
    }
    chartpartdis = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [

                {
                    type: 'line',
                    label: `Avg PartDis (PPGs nota ${nota_ppg})`,
                    data: avgCounts,
                    //lineTension: 0.4,
                    borderColor: colors.orange.default,
                    backgroundColor: colors.orange.default,
                },
                {
                    label: 'PartDis',
                    data: counts,
                    backgroundColor: colors.blue.half,
                    borderColor: colors.blue.half,
                    borderWidth: 1,
                }

            ],
        },
        options: {
            spanGaps: true,
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: annotation_values
                },
                datalabels: {
                    display: false,
                    //   anchor: 'center',
                    //   align: 'center',
                    //   color: '#fff',
                    //   font: {
                    //     weight: 'bold',
                    //   },
                },
            },

        },

    });
}

var chartindcoautoria;
export function renderChartIndCoautorias(idCanvas, listIndCoautorias, listAvgIndCoautorias, indicadores, nota_ppg) {
    const labels = listIndCoautorias.map(ind => ind.ano);
    const counts = listIndCoautorias.map(ind => ind.indcoautoria);

    const labelsAvg = listAvgIndCoautorias.map(ind => ind.ano);
    const avgCounts = listAvgIndCoautorias.map(ind => ind.indcoautoriaall);

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartindcoautoria').getContext("2d");

    var annotation_values = {
        line_fraco: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.fraco,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_fraco: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.fraco + 0.003,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Fraco'],
            font: {
                size: 10
            }
        },
        line_regular: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.regular,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_regular: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.regular + 0.003,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Reg.'],
            font: {
                size: 10
            }
        },
        line_bom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.bom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_bom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.bom + 0.03,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Bom'],
            font: {
                size: 10
            }
        },
        line_muitobom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.mbom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_muitobom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.mbom + 0.03,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['M.Bom'],
            font: {
                size: 10
            }
        }
    };


    if(indicadores.mbom === 0)
        annotation_values = {};


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartindcoautoria) {
        chartindcoautoria.destroy();
    }
    chartindcoautoria = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [

                {
                    type: 'line',
                    label: `Avg IndCoautoria (PPGs nota ${nota_ppg})`,
                    data: avgCounts,
                    //lineTension: 0.4,
                    borderColor: colors.orange.default,
                    backgroundColor: colors.orange.default,
                },
                {
                    label: 'IndCoautoria',
                    data: counts,
                    backgroundColor: colors.blue.half,
                    borderColor: colors.blue.half,
                    borderWidth: 1,
                }

            ],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: annotation_values
                },
                datalabels: {
                    display: false,
                    //   anchor: 'center',
                    //   align: 'center',
                    //   color: '#fff',
                    //   font: {
                    //     weight: 'bold',
                    //   },
                },
            },

        },

    });
}

var chartindori;
export function renderChartIndOris(idCanvas, listIndOris, listAvgIndOris, indicadores, nota_ppg) {
    const labels = listIndOris.map(ind => ind.ano);
    const counts = listIndOris.map(ind => ind.indori);

    const labelsAvg = listAvgIndOris.map(ind => ind.ano);
    const avgCounts = listAvgIndOris.map(ind => ind.indoriall);

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartindori').getContext("2d");

    var annotation_values = {
        line_fraco: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.fraco,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_fraco: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.fraco + 0.04,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Fraco'],
            font: {
                size: 10
            }
        },
        line_regular: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.regular,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_regular: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.regular + 0.04,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Reg.'],
            font: {
                size: 10
            }
        },
        line_bom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.bom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_bom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.bom + 0.04,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Bom'],
            font: {
                size: 10
            }
        },
        line_muitobom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.mbom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_muitobom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.mbom + 0.04,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['M.Bom'],
            font: {
                size: 10
            }
        }
    };

    if(indicadores.mbom === 0)
        annotation_values = {};


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartindori) {
        chartindori.destroy();
    }
    chartindori = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [

                {
                    type: 'line',
                    label: `Avg IndOri (PPGs nota ${nota_ppg})`,
                    data: avgCounts,
                    //lineTension: 0.4,
                    borderColor: colors.orange.default,
                    backgroundColor: colors.orange.default,
                },
                {
                    label: 'IndOri',
                    data: counts,
                    backgroundColor: colors.blue.half,
                    borderColor: colors.blue.half,
                    borderWidth: 1,
                }

            ],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: annotation_values
                },
                datalabels: {
                    display: false,
                    //   anchor: 'center',
                    //   align: 'center',
                    //   color: '#fff',
                    //   font: {
                    //     weight: 'bold',
                    //   },
                },
            },

        },

    });
}

var chartinddistori;
export function renderChartIndDistOris(idCanvas, listIndDistOris, listAvgIndDistOris, indicadores, nota_ppg) {
    const labels = listIndDistOris.map(ind => ind.ano);
    const counts = listIndDistOris.map(ind => ind.inddistori);

    const labelsAvg = listAvgIndDistOris.map(ind => ind.ano);
    const avgCounts = listAvgIndDistOris.map(ind => ind.inddistoriall);

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartinddistori').getContext("2d");

    var annotation_values =  {
        line_fraco: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.fraco,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_fraco: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.fraco + 0.02,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Fraco'],
            font: {
                size: 10
            }
        },
        line_regular: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.regular,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_regular: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.regular + 0.02,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Reg.'],
            font: {
                size: 10
            }
        },
        line_bom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.bom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_bom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.bom + 0.02,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Bom'],
            font: {
                size: 10
            }
        },
        line_muitobom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.mbom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_muitobom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.mbom + 0.02,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['M.Bom'],
            font: {
                size: 10
            }
        }
    };

    if(indicadores.mbom === 0)
        annotation_values = {};


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartinddistori) {
        chartinddistori.destroy();
    }
    chartinddistori = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [

                {
                    type: 'line',
                    label: `Avg IndDistOri (PPGs nota ${nota_ppg})`,
                    data: avgCounts,
                    //lineTension: 0.4,
                    borderColor: colors.orange.default,
                    backgroundColor: colors.orange.default,
                },
                {
                    label: 'IndDistOri',
                    data: counts,
                    backgroundColor: colors.blue.half,
                    borderColor: colors.blue.half,
                    borderWidth: 1,
                }

            ],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: annotation_values
                },
                datalabels: {
                    display: false,
                    //   anchor: 'center',
                    //   align: 'center',
                    //   color: '#fff',
                    //   font: {
                    //     weight: 'bold',
                    //   },
                },
            },

        },

    });
}

var chartindaut;
export function renderChartIndAuts(idCanvas, listIndAuts, listAvgIndAuts, indicadores, nota_ppg) {
    const labels = listIndAuts.map(ind => ind.ano);
    const counts = listIndAuts.map(ind => ind.indaut);

    const labelsAvg = listAvgIndAuts.map(ind => ind.ano);
    const avgCounts = listAvgIndAuts.map(ind => ind.indautall);

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartindaut').getContext("2d");

    var annotation_values = {
        line_fraco: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.fraco,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_fraco: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.fraco + 0.013,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Fraco'],
            font: {
                size: 10
            }
        },
        line_regular: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.regular,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_regular: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.regular + 0.014,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Reg.'],
            font: {
                size: 10
            }
        },
        line_bom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.bom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_bom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.bom + 0.12,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Bom'],
            font: {
                size: 10
            }
        },
        line_muitobom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.mbom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_muitobom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.mbom + 0.12,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['M.Bom'],
            font: {
                size: 10
            }
        }
    };

    if(indicadores.mbom === 0)
        annotation_values = {};


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartindaut) {
        chartindaut.destroy();
    }
    chartindaut = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [

                {
                    type: 'line',
                    label: `Avg IndAut (PPGs nota ${nota_ppg})`,
                    data: avgCounts,
                    //lineTension: 0.4,
                    borderColor: colors.orange.default,
                    backgroundColor: colors.orange.default,
                },
                {
                    label: 'IndAut',
                    data: counts,
                    backgroundColor: colors.blue.half,
                    borderColor: colors.blue.half,
                    borderWidth: 1,
                }

            ],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: annotation_values
                },
                datalabels: {
                    display: false,
                    //   anchor: 'center',
                    //   align: 'center',
                    //   color: '#fff',
                    //   font: {
                    //     weight: 'bold',
                    //   },
                },
            },

        },

    });
}

var chartinddis;
export function renderChartIndDiss(idCanvas, listIndDiss, listAvgIndDiss, indicadores, nota_ppg) {
    const labels = listIndDiss.map(ind => ind.ano);
    const counts = listIndDiss.map(ind => ind.inddis);

    const labelsAvg = listAvgIndDiss.map(ind => ind.ano);
    const avgCounts = listAvgIndDiss.map(ind => {
        if (ind.inddisall === 0.0) return null;
        return ind.inddisall;
    });

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartinddis').getContext("2d");

    var annotation_values = {
        line_fraco: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.fraco,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_fraco: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.fraco + 0.014,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Fraco'],
            font: {
                size: 10
            }
        },
        line_regular: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.regular,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_regular: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.regular + 0.012,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Reg.'],
            font: {
                size: 10
            }
        },
        line_bom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.bom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_bom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.bom + 0.014,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['Bom'],
            font: {
                size: 10
            }
        },
        line_muitobom: {
            type: 'line',
            scaleID: 'y',
            value: indicadores.mbom,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [1, 2]
        },
        label_muitobom: {
            type: 'label',
            xValue: 0,
            yValue: indicadores.mbom + 0.14,
            color: 'grey',
            //backgroundColor: 'rgba(245,245,245)',
            //borderColor: 'black',
            //borderWidth: 1,
            //borderRadius: 2,
            content: ['M.Bom'],
            font: {
                size: 10
            }
        }
    };

    if(indicadores.mbom === 0)
        annotation_values = {};


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartinddis) {
        chartinddis.destroy();
    }
    chartinddis = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [

                {
                    type: 'line',
                    label: `Avg IndDis (PPGs nota ${nota_ppg})`,
                    data: avgCounts,
                    //lineTension: 0.4,
                    borderColor: colors.orange.default,
                    backgroundColor: colors.orange.default,
                },
                {
                    label: 'IndDis',
                    data: counts,
                    backgroundColor: colors.blue.half,
                    borderColor: colors.blue.half,
                    borderWidth: 1,
                }

            ],
        },
        options: {
            spanGaps: true,
            maintainAspectRatio: false,
            plugins: {
                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: annotation_values
                },
                datalabels: {
                    display: false,
                    //   anchor: 'center',
                    //   align: 'center',
                    //   color: '#fff',
                    //   font: {
                    //     weight: 'bold',
                    //   },
                },
            },

        },

    });
}

var chartprofessorsproductions;
export function renderChartProfessorProductions(produtos) {
    var labels = produtos.map(prods => prods.subtipo);
    var counts = produtos.map(prods => prods.qdade);

    const canvas = document.getElementById('chartprofessorsproductions');
    const ctx = canvas.getContext("2d");


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartprofessorsproductions) {
        chartprofessorsproductions.destroy();
    }
    chartprofessorsproductions = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Produtos',
                data: counts,
                hoverOffset: 20
                //backgroundColor: ['rgb(173 225 232)', 'rgb(33 170 184)'],
                //borderColor: 'rgba(75, 192, 192, 1)',
                //borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 9
                        }
                    }
                },
                //title: {
                //   display: true,
                //   text: 'Produtos'
                //}
            },
            //animation: {
            // onComplete: function(animation) {
            //   //document.getElementById('saveGraph').setAttribute('onclick', //"saveChart('charttotalproductions.png');");
            // }
            // },
            maintainAspectRatio: false,
        },

    });

}

var chartpositionindprods;
export function renderChartPositionIndProd(dados, id_ppg) {
    const labels = dados.indprods.map(indprod => indprod.nome + ` (${indprod.sigla})\n( ${indprod.municipio}/${indprod.uf} )`);
    const values = dados.indprods.map(indprod => indprod.indprod);

    const dataset = {
        data: values.map((value, index) => ({ x: index, y: value })),
        pointRadius: values.map((value, index) => {
            if (dados.indprods[index].id === id_ppg) {
                return 11; // Adjust the opacity here

            }
            return 8;
        }),
        backgroundColor: values.map((value, index) => {
            if (dados.indprods[index].id === id_ppg) {
                return 'black'; // Adjust the opacity here

            }
            return dados.indprods[index].status === 'Pública Estadual' ? 'rgba(0, 0, 255, 0.8)' : dados.indprods[index].status === 'Pública Federal' ? "rgba(0, 128, 0, 0.8)" : "rgba(255, 0, 0, 0.8)";
        }),
        pointHoverRadius: values.map((value, index) => {
            if (dados.indprods[index].id === id_ppg) {
                return 18; // Adjust the opacity here

            }
            return 14;
        }),
        showLine: false,
        tension: 0.4,
        fill: false
    };
    var annotations_array = {};
    for (let i = 0; i < values.length; i++) {
        const annotationKey = 'vline' + i;
        if (dados.indprods[i].id === id_ppg) {
            annotations_array[annotationKey] = {
                type: 'line',
                id: annotationKey,
                mode: 'vertical',
                xScaleID: 'x',
                yScaleID: 'y',
                xMax: i,
                xMin: i,
                yMax: values[i],
                yMin: 0,
                borderColor: 'black',
                borderWidth: 1
            };
        }
        else {
            annotations_array[annotationKey] = {
                type: 'line',
                id: annotationKey,
                mode: 'vertical',
                xScaleID: 'x',
                yScaleID: 'y',
                xMax: i,
                xMin: i,
                yMax: values[i],
                yMin: 0,
                borderColor: dados.indprods[i].status === 'Pública Estadual' ? 'rgba(0, 0, 255, 0.8)' : dados.indprods[i].status === 'Pública Federal' ? "rgba(0, 128, 0, 0.8)" : "rgba(255, 0, 0, 0.8)",
                borderWidth: 1
            };
        }
    }

    annotations_array['media'] = {
        type: 'line',
        scaleID: 'y',
        value: dados.media,
        borderColor: "#679289",
        borderWidth: 2,
        borderDash: [1, 2]
    };

    annotations_array['label_media'] = {
        type: 'label',
        xValue: values.length - (values.length / 5),
        yValue: dados.media - 0.10,
        color: "#679289",
        //backgroundColor: 'rgba(245,245,245)',
        //borderColor: 'black',
        //borderWidth: 1,
        //borderRadius: 2,
        content: [`Média notas ${dados.indprods[0].nota} = ${dados.media.toFixed(3)}`],
        font: {
            size: 14
        }
    };

    if (dados.media_maior.length > 0) {
        let ncount = 0;
        while (ncount < dados.media_maior.length) {
            //console.log(dados.media_maior[ncount]);
            if (dados.media_maior[ncount] !== null) {
                annotations_array['media_maior' + ncount] = {
                    type: 'line',
                    scaleID: 'y',
                    value: dados.media_maior[ncount],
                    borderColor: "#FF9289",
                    borderWidth: 2,
                    borderDash: [1, 2]
                };

                annotations_array['label_media_maior' + ncount] = {
                    type: 'label',
                    xValue: values.length - (values.length / 3),
                    yValue: dados.media_maior[ncount] + 0.10,
                    color: "#FF9289",
                    //backgroundColor: 'rgba(245,245,245)',
                    //borderColor: 'black',
                    //borderWidth: 1,
                    //borderRadius: 2,
                    content: [`Média notas ${parseInt(dados.indprods[0].nota) + (ncount + 1)} = ${dados.media_maior[ncount].toFixed(3)}`],
                    font: {
                        size: 14
                    }
                };
            }
            ncount++;
        }

    }

    const canvas = document.getElementById('chartpositionindprods');
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (chartpositionindprods) {
        //chartpositionindprods.data.labels = labels;
        //chartpositionindprods.data.datasets = [dataset];
        chartpositionindprods.destroy();
    }

    chartpositionindprods = new Chart(ctx, {

        type: 'scatter',
        data: {
            labels: labels,
            datasets: [dataset]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: false, // Hide x-axis labels
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations:
                        annotations_array

                },
                datalabels: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';

                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(3);
                            }
                            return ' indProdArt: ' + label;
                        }
                    }
                }
            },
        }
    });

}

var charttotalproductions;
export function index_renderChartProductions(idCanvas, listProductions) {
    const labels = listProductions.map(product => {
        if (product.subtipo.length > 31)
            return product.subtipo.substring(0, 30);
        else return product.subtipo;
    });
    const counts = listProductions.map(product => product.quantidade);
    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('charttotalproductions');
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if (charttotalproductions) {
        charttotalproductions.destroy();
    }
    charttotalproductions = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(label => {
                label = label.replace('DESENVOLVIMENTO', 'DEV.');
                label = label.replace('APRESENTAÇÃO', 'APRES.');
                label = label.replace('ORGANIZAÇÃO', 'ORGAN.');
                return label;
            }
            ),
            datasets: [{
                label: 'Produções dos Programas',
                data: counts,
                backgroundColor: colors.blue.half,
                borderColor: colors.blue.half,
                borderWidth: 1
            }]
        },
        layout: {
            padding: {
                left: 5 // Increase the left margin by 5 pixels
            }
        },
        options: {
            scales: {
                x: {
                    display: true,
                    ticks: {
                        maxRotation: 45,
                        minRotation: 90,
                        font: {
                            size: 10 // Decrease the font size of x-axis labels to 10 pixels
                        }
                    }
                },
                y: {
                    display: false, // Set display to false to hide y-axis labels
                }
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: 'black',
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    //borderWidth: 1,
                    //borderRadius: 5,
                    font: {
                        size: 8
                    },
                    formatter: (value) => {
                        return value;
                    },

                },

            },
            /*animation: {
                onComplete: function (animation) {
                    document.getElementById('saveGraph').setAttribute('onclick', "saveChart('charttotalproductions.png');");
                }
            },*/
            maintainAspectRatio: false,
        },

    });
}

var charttotalsperiodicproductions;
export function index_renderChartPeriodicProductions(idCanvas, listPeriodicProductions) {
    const labels = listPeriodicProductions.map(product => product.ano);
    const counts = listPeriodicProductions.map(product => product.quantidade);

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('charttotalsperiodicproductions').getContext("2d");
    var gradient = ctx.createLinearGradient(0, 25, 0, 300);
    gradient.addColorStop(0, colors.blue.half);
    gradient.addColorStop(0.35, colors.blue.quarter);
    gradient.addColorStop(1, colors.blue.zero);

    if (charttotalsperiodicproductions) {
        charttotalsperiodicproductions.destroy();
    }
    charttotalsperiodicproductions = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(lab => lab + ''),
            datasets: [{
                label: 'Artigos Produzidos',
                fill: 'start',
                backgroundColor: gradient,
                pointBackgroundColor: colors.blue.default,
                borderColor: colors.blue.default,
                lineTension: 0.2,
                borderWidth: 2,
                pointRadius: 3,
                data: counts
            }]
        },

        options: {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: 'black',
                    backgroundColor: colors.blue.quarter,
                    borderColor: colors.blue.quarter,
                    //borderWidth: 1,
                    //borderRadius: 5,
                    font: {
                        size: 10
                    },
                    formatter: (value) => {
                        return value;
                    },
                }
            },
            //animation: {
            // onComplete: function(animation) {
            //   //document.getElementById('saveGraph').setAttribute('onclick', //"saveChart('charttotalproductions.png');");
            // }
            // },
            maintainAspectRatio: false,
        },

    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var charttotalstechnicalproductions;
export function index_renderChartTechnicalProductions(idCanvas, listTechnicalProductions) {
    const subtipos = [...new Set(listTechnicalProductions.map(item => item.subtipo))];
    const datasets = subtipos.map(subtipo => ({
        label: subtipo,
        data: listTechnicalProductions.filter(item => item.subtipo === subtipo).map(item => ({ x: item.ano, y: item.quantidade })),
        backgroundColor: getRandomColor(),
    }));

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('charttotalstechnicalproductions').getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (charttotalstechnicalproductions) {
        charttotalstechnicalproductions.destroy();
    }
    charttotalstechnicalproductions = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: datasets,
        },

        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        callback: value => value.toFixed(0),
                    },
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Quantidade (Log)',
                    },
                    min: 1,
                },
            },
            plugins: {
                datalabels: {
                    display: false,
                    anchor: 'end',
                    align: 'top',
                    color: 'black',
                    font: {
                        size: 10
                    },

                }
            },
            maintainAspectRatio: false,
        },

    });
}

// Função para gerar cores gradientes
function generateGradientColors(count) {
    const gradientColors = [];
    const hueStep = 360 / count;

    for (let i = 0; i < count; i++) {
        const hue = i * hueStep;
        gradientColors.push(`hsla(${hue}, 100%, 50%, 0.8)`);
    }

    return gradientColors;
}

// Função para gerar gradiente linear
function generateLinearGradient(backgroundColor) {
    const ctx = document.createElement('canvas').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400); // Ajuste as coordenadas conforme necessário
    gradient.addColorStop(0, backgroundColor.half);
    gradient.addColorStop(0.35, backgroundColor.quarter)
    gradient.addColorStop(1, backgroundColor.zero); // Cor transparente no final

    return gradient;
}

var charttotalsbiblioproductions;
export function index_renderChartBiblioProductions(idCanvas, listBiblioProductions) {
    const subtipos = [...new Set(listBiblioProductions.map(item => item.subtipo))];
    //const gradientColors = generateGradientColors(subtipos.length); // Função para gerar cores gradientes
    const gradientColors = [colors.blue, colors.green, colors.orange, colors.indigo, colors.crimson];

    const datasets = subtipos.map((subtipo, i) => ({
        label: subtipo,
        data: listBiblioProductions.filter(item => item.subtipo === subtipo).map(item => ({ x: item.ano, y: item.quantidade })),
        backgroundColor: generateLinearGradient(gradientColors[i]), // Função para gerar gradiente linear
        pointBackgroundColor: gradientColors[i].default,
        borderColor: gradientColors[i].default,
        fill: 'start',
        lineTension: 0.2,
        borderWidth: 2,
        pointRadius: 3
    }));

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('charttotalsbiblioproductions').getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (charttotalsbiblioproductions) {
        charttotalsbiblioproductions.destroy();
    }
    charttotalsbiblioproductions = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets,
        },

        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        callback: value => value.toFixed(0),
                    },
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Quantidade (Log)',
                    },
                    min: 1,
                },
            },
            plugins: {
                datalabels: {
                    display: false,
                    anchor: 'end',
                    align: 'top',
                    color: 'black',
                    font: {
                        size: 10
                    },

                }
            },
            maintainAspectRatio: false,
        },

    });
}

var charttotalstudentslevel;
export function index_renderChartStudentsLevel(idCanvas, listStudents) {
    const labels = listStudents.map(student => student.nivelcurso);
    const counts = listStudents.map(student => student.qdade);
    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('charttotalstudentslevel');

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if (charttotalstudentslevel) {
        charttotalstudentslevel.destroy();
    }
    charttotalstudentslevel = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Discentes por Nível',
                data: counts,
                backgroundColor: [colors.orange.half, colors.blue.half],
                //borderColor: 'rgba(75, 192, 192, 1)',
                //borderWidth: 1
            }]
        },
        options: {
            //animation: {
            // onComplete: function(animation) {
            //   //document.getElementById('saveGraph').setAttribute('onclick', //"saveChart('charttotalproductions.png');");
            // }
            // },
            maintainAspectRatio: false,
        },

    });
}

var chartlattesupdate;
export function renderChartLattesUpdate(idCanvas, lattesdocs) {
    const labels = lattesdocs.map(dicionario => dicionario.legenda);
    const data = lattesdocs.map(dicionario => dicionario.quantidade);

    /*const labels = Object.keys(lattesdocs);
    const data = Object.values(lattesdocs);*/

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('chartlattesupdate');


    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if (chartlattesupdate) {
        chartlattesupdate.destroy();
    }
    chartlattesupdate = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            },
            maintainAspectRatio: true
        }
    });
}

var chartlogacessos;
export function log_renderChartLogAcessos(idCanvas, listLogAcessos) {
    const labels = listLogAcessos.map(log => log.momento);
    const counts = listLogAcessos.map(log => log.acessos);
    
    const type = sessionStorage.getItem('type');
    const year1 = sessionStorage.getItem('year1');
    const year2 = sessionStorage.getItem('year2');

    if((type=='month' && year1!=year2) || (type=='year' && year1==year2)){
        for(var i=0; i<labels.length; i++){
            switch (labels[i]){
                case 1:
                    labels[i] = 'Janeiro';
                    break;
                case 2:
                    labels[i] = 'Fevereiro';
                    break;
                case 3:
                    labels[i] = 'Março';
                    break;
                case 4:
                    labels[i] = 'Abril';
                    break;
                case 5:
                    labels[i] = 'Maio';
                    break;
                case 6:
                    labels[i] = 'Junho';
                    break;
                case 7:
                    labels[i] = 'Julho';
                    break;
                case 8:
                    labels[i] = 'Agosto';
                    break;
                case 9:
                    labels[i] = 'Setembro';
                    break;
                case 10:
                    labels[i] = 'Outubro';
                    break;
                case 11:
                    labels[i] = 'Novembro';
                    break;
                case 12:
                    labels[i] = 'Dezembro';
                    break;
            }
        }
    }
    else if(type=='day' && year1==year2){
        for(var i=0; i<labels.length; i++){
            labels[i] += 'h';
        }
    }

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('charttotalsperiodicproductions').getContext("2d");
    var gradient = ctx.createLinearGradient(0, 25, 0, 300);
    gradient.addColorStop(0, colors.green.half);
    gradient.addColorStop(0.35, colors.green.quarter);
    gradient.addColorStop(1, colors.green.zero);

    if (chartlogacessos) {
        chartlogacessos.destroy();
    }

    chartlogacessos = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(lab => lab + ''),
            datasets: [{
                label: 'Acessos',
                fill: 'start',
                backgroundColor: gradient,
                pointBackgroundColor: colors.green.default,
                borderColor: colors.green.default,
                lineTension: 0.2,
                borderWidth: 2,
                pointRadius: 3,
                data: counts
            }]
        },

        options: {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: 'black',
                    backgroundColor: colors.blue.quarter,
                    borderColor: colors.blue.quarter,
                    //borderWidth: 1,
                    //borderRadius: 5,
                    font: {
                        size: 10
                    },
                    formatter: (value) => {
                        return value;
                    },
                }
            },
            //animation: {
            // onComplete: function(animation) {
            //   //document.getElementById('saveGraph').setAttribute('onclick', //"saveChart('charttotalproductions.png');");
            // }
            // },
            maintainAspectRatio: false,
        },

    });
}

var chartloggrafos;
export function log_renderChartLogGrafos(idCanvas, listLogGrafos) {
    const labels = listLogGrafos.map(log => log.momento);
    const counts = listLogGrafos.map(log => log.acessos);

    const type = sessionStorage.getItem('type');
    const year1 = sessionStorage.getItem('year1');
    const year2 = sessionStorage.getItem('year2');

    if((type == 'month' && year1!=year2) || (type == 'year' && year1==year2)){
        for(var i=0; i<labels.length; i++){
            switch (labels[i]){
                case 1:
                    labels[i] = 'Janeiro';
                    break;
                case 2:
                    labels[i] = 'Fevereiro';
                    break;
                case 3:
                    labels[i] = 'Março';
                    break;
                case 4:
                    labels[i] = 'Abril';
                    break;
                case 5:
                    labels[i] = 'Maio';
                    break;
                case 6:
                    labels[i] = 'Junho';
                    break;
                case 7:
                    labels[i] = 'Julho';
                    break;
                case 8:
                    labels[i] = 'Agosto';
                    break;
                case 9:
                    labels[i] = 'Setembro';
                    break;
                case 10:
                    labels[i] = 'Outubro';
                    break;
                case 11:
                    labels[i] = 'Novembro';
                    break;
                case 12:
                    labels[i] = 'Dezembro';
                    break;
            }
        }
    }
    else if(type=='day' && year1==year2){
        for(var i=0; i<labels.length; i++){
            labels[i] += 'h';
        }
    }

    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext("2d");
    //const ctx = document.getElementById('charttotalsperiodicproductions').getContext("2d");
    var gradient = ctx.createLinearGradient(0, 25, 0, 300);
    gradient.addColorStop(0, colors.crimson.half);
    gradient.addColorStop(0.35, colors.crimson.quarter);
    gradient.addColorStop(1, colors.crimson.zero);

    if (chartloggrafos) {
        chartloggrafos.destroy();
    }

    chartloggrafos = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(lab => lab + ''),
            datasets: [{
                label: 'Acessos',
                fill: 'start',
                backgroundColor: gradient,
                pointBackgroundColor: colors.crimson.default,
                borderColor: colors.crimson.default,
                lineTension: 0.2,
                borderWidth: 2,
                pointRadius: 3,
                data: counts
            }]
        },

        options: {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: 'black',
                    backgroundColor: colors.blue.quarter,
                    borderColor: colors.blue.quarter,
                    //borderWidth: 1,
                    //borderRadius: 5,
                    font: {
                        size: 10
                    },
                    formatter: (value) => {
                        return value;
                    },
                }
            },
            //animation: {
            // onComplete: function(animation) {
            //   //document.getElementById('saveGraph').setAttribute('onclick', //"saveChart('charttotalproductions.png');");
            // }
            // },
            maintainAspectRatio: false,
        },

    });
}
