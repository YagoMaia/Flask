/*
    Esse arquivo é provisório para análise, pode ou não ser aplicado ao sistema.
*/

export function GenerateChartsInd(ctx, labels, counts, avgCounts, IndName,  nota_ppg){
    switch(IndName){
        case 'PartDis':
            var lines_values = {
                'line_fraco':0.025,
                'line_regular':0.05,
                'line_bom':0.2,
                'line_muitobom':0.35
            }
            var labels_values = {
                'label_fraco':0.03,
                'label_regular':0.07,
                'label_bom':0.22,
                'label_muitobom':0.37
            }
            break;
        case 'IndCoautoria':
            var lines_values = {
                'line_fraco':0.01,
                'line_regular':0.02,
                'line_bom':0.14,
                'line_muitobom':0.28
            }
            var labels_values ={
                'label_fraco':0.013,
                'label_regular':0.023,
                'label_bom':0.17,
                'label_muitobom':0.31
            }
            break;
        case 'IndOri':
            var lines_values = {
                'line_fraco':0.15,
                'line_regular':0.3,
                'line_bom':0.8,
                'line_muitobom':1.2
            }
            var labels_values ={
                'label_fraco':0.19,
                'label_regular':0.034,
                'label_bom':0.84,
                'label_muitobom':1.24
            }
            break;
        case 'IndDistOri':
            var lines_values = {
                'line_fraco':0.1,
                'line_regular':0.2,
                'line_bom':0.5,
                'line_muitobom':0.6
            }
            var labels_values ={
                'label_fraco':0.12,
                'label_regular':0.22,
                'label_bom':0.52,
                'label_muitobom':0.62
            }
            break;
        case 'IndAut':
            var lines_values = {
                'line_fraco':0.025,
                'line_regular':0.05,
                'line_bom':0.2,
                'line_muitobom':0.35
            }
            var labels_values ={
                'label_fraco':0.037,
                'label_regular':0.064,
                'label_bom':0.212,
                'label_muitobom':0.362
            }
            break;
        case 'IndAut':
            var lines_values = {
                'line_fraco':0.034,
                'line_regular':0.07,
                'line_bom':0.25,
                'line_muitobom':0.5
            }
            var labels_values ={
                'label_fraco':0.048,
                'label_regular':0.086,
                'label_bom':0.264,
                'label_muitobom':0.514
            }
            break;
        }
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
    
                {
                    type: 'line',
                    label: `Avg ${IndName} (PPGs nota ${nota_ppg})`,
                    data: avgCounts,
                    borderColor: colors.orange.default,
                    backgroundColor: colors.orange.default,
                },
                {
                    label: `${IndName}`,
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
                    annotations: {
                        line_fraco: {
                            type: 'line',
                            scaleID: 'y',
                            value: lines_values['line_fraco'],
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderDash: [1, 2]
                        },
                        label_fraco: {
                            type: 'label',
                            xValue: 0,
                            yValue: labels_values['label_fraco'],
                            color: 'grey',
                            content: ['Fraco'],
                            font: {
                                size: 10
                            }
                        },
                        line_regular: {
                            type: 'line',
                            scaleID: 'y',
                            value: lines_values['line_regular'],
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderDash: [1, 2]
                        },
                        label_regular: {
                            type: 'label',
                            xValue: 0,
                            yValue: labels_values['label_regular'],
                            color: 'grey',
                            content: ['Reg.'],
                            font: {
                                size: 10
                            }
                        },
                        line_bom: {
                            type: 'line',
                            scaleID: 'y',
                            value: lines_values['line_bom'],
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderDash: [1, 2]
                        },
                        label_bom: {
                            type: 'label',
                            xValue: 0,
                            yValue: labels_values['label_bom'],
                            color: 'grey',
                            content: ['Bom'],
                            font: {
                                size: 10
                            }
                        },
                        line_muitobom: {
                            type: 'line',
                            scaleID: 'y',
                            value: lines_values['line_muitobom'],
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderDash: [1, 2]
                        },
                        label_muitobom: {
                            type: 'label',
                            xValue: 0,
                            yValue: labels_values['label_muitobom'],
                            color: 'grey',
                            content: ['M.Bom'],
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                datalabels: {
                    display: false,
                },
            },
        },
    });
}

export function ChartTempoDefesa(ctx, labels, dataset,){
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: dataset,
        },
        options: {
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

export function ChartStudentsGraduated(ctx, labels, dataset){
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
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

export function ChartQualisProductions(ctx, nota_ppg, listQualisProductions, listIndProds, listAvgIndProds){
    const colors = ["#002d83", "#175399", "#638fbc", "#b5cfe6", "#49207c", "#654791", "#9d88b1", "#d7c9e2", "#cb3dab"];

    var anos = listQualisProductions.map(data => data.ano);
    var a1 = listQualisProductions.map(data => data.A1);
    var a2 = listQualisProductions.map(data => data.A2);
    var a3 = listQualisProductions.map(data => data.A3);
    var a4 = listQualisProductions.map(data => data.A4);
    var b1 = listQualisProductions.map(data => data.B1);
    var b2 = listQualisProductions.map(data => data.B2);
    var b3 = listQualisProductions.map(data => data.B3);
    var b4 = listQualisProductions.map(data => data.B4);
    var c = listQualisProductions.map(data => data.C);
    var counts = listIndProds.map(ind => {
        if (ind.indprod === 0.0) return null
        return ind.indprod;
    });

    var avgCounts = listAvgIndProds.map(ind => ind.indprodall);

    const max_indprod = Math.max(...counts, ...avgCounts);
    
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
    counts.push(null);
    avgCounts.push(null);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: anos,
            datasets: [
                {
                    type: 'line',
                    label: 'IndProd',
                    data: counts,
                    backgroundColor: 'rgba(255, 167, 46, 1)',
                    borderColor: 'rgba(255, 167, 46, 1)',
                    yAxisID: 'y1',
                },
                {
                    type: 'line',
                    label: `Avg IndProd (PPGs nota ${nota_ppg})`,
                    data: avgCounts,
                    borderColor: 'red',
                    backgroundColor: 'white',
                    borderDash: [5, 5],
                    yAxisID: 'y1'
                },
                {
                    label: 'A1',
                    data: a1,
                    backgroundColor: colors[0],
                    yAxisID: 'y',
                },
                {
                    label: 'A2',
                    data: a2,
                    backgroundColor: colors[1],
                    yAxisID: 'y',
                },
                {
                    label: 'A3',
                    data: a3,
                    backgroundColor: colors[2],
                    yAxisID: 'y',
                },
                {
                    label: 'A4',
                    data: a4,
                    backgroundColor: colors[3],
                    yAxisID: 'y',
                },
                {
                    label: 'B1',
                    data: b1,
                    backgroundColor: colors[4],
                    yAxisID: 'y',
                },
                {
                    label: 'B2',
                    data: b2,
                    backgroundColor: colors[5]
                },
                {
                    label: 'B3',
                    data: b3,
                    backgroundColor: colors[6],
                    yAxisID: 'y',
                },
                {
                    label: 'B4',
                    data: b4,
                    backgroundColor: colors[7],
                    yAxisID: 'y',
                },
                {
                    label: 'C',
                    data: c,
                    backgroundColor: colors[8],
                    yAxisID: 'y',
                },



            ]
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
                    reverse: true
                },

                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    annotations: {
                        line_fraco: {
                            type: 'line',
                            scaleID: 'y1',
                            value: 0.25,
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderDash: [1, 2]
                        },
                        label_fraco: {
                            type: 'label',
                            xValue: anos.length - 1,
                            yValue: 0.31,
                            color: 'grey',
                            yScaleID: 'y1',
                            content: ['Fraco'],
                            font: {
                                size: 10
                            }
                        },
                        line_regular: {
                            type: 'line',
                            scaleID: 'y1',
                            value: 0.5,
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderDash: [1, 2]
                        },
                        label_regular: {
                            type: 'label',
                            xValue: anos.length - 1,
                            yValue: 0.56,
                            color: 'grey',
                            yScaleID: 'y1',
                            content: ['Reg.'],
                            font: {
                                size: 10
                            }
                        },
                        line_bom: {
                            type: 'line',
                            scaleID: 'y1',
                            value: 1.0,
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderDash: [1, 2]
                        },
                        label_bom: {
                            type: 'label',
                            xValue: anos.length - 1,
                            yValue: 1.06,
                            color: 'grey',
                            yScaleID: 'y1',
                            content: ['Bom'],
                            font: {
                                size: 10
                            }
                        },
                        line_muitobom: {
                            type: 'line',
                            scaleID: 'y1',
                            value: 1.8,
                            borderColor: 'grey',
                            borderWidth: 2,
                            borderDash: [1, 2]
                        },
                        label_muitobom: {
                            type: 'label',
                            xValue: anos.length - 1,
                            yValue: 1.86,
                            yScaleID: 'y1',
                            color: 'grey',
                            content: ['M.Bom'],
                            font: {
                                size: 10
                            }
                        },
                        Lattes: {
                            type: 'box',
                            xMin: anos.length - 2.5,
                            xMax: anos.length - 1.5,
                            yMin: 0,
                            borderWidth: 0,
                            backgroundColor: 'rgba(100, 99, 255, 0.2)'
                        },
                        label1: {
                            type: 'label',
                            yScaleID: 'y1',
                            yValue: max_indprod - 0.1,
                            xValue: anos.length - 2,
                            color: 'rgba(100, 99, 255, 0.8)',
                            content: ['Lattes (atual)'],
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                datalabels: {
                    display: false,
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
                },
                y1: {
                    title: {
                        display: true,
                        text: 'IndProd',
                    },
                    position: 'right', // Position the second y-axis on the right side
                },

            },
            maintainAspectRatio: false,
        },
    });
}

export function ChartpProfessorsProductions(ctx, labels, counts){
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Produtos',
                data: counts,
                hoverOffset: 20
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
            },
            maintainAspectRatio: false,
        },

    });
}

export function ChartPositionIndprods(ctx, labels, dataset, annotations_array){
    return new Chart(ctx, {
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

export function ChartTotalProductions(ctx, labels, counts){
    return new Chart(ctx, {
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
                    font: {
                        size: 8
                    },
                    formatter: (value) => {
                        return value;
                    },

                },

            },
            animation: {
                onComplete: function (animation) {
                    document.getElementById('saveGraph').setAttribute('onclick', "saveChart('charttotalproductions.png');");
                }
            },
            maintainAspectRatio: false,
        },

    });
}

export function ChartTotalsPeriodicProductions(ctx, labels, counts, gradient){
    return new Chart(ctx, {
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
                    font: {
                        size: 10
                    },
                    formatter: (value) => {
                        return value;
                    },
                }
            },
            maintainAspectRatio: false,
        },

    });
}

export function ChartProductionsType(ctx, datasets, type){
    return new Chart(ctx, {
        type: type,
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

export function ChartTotalStudentsLevel(ctx, labels, counts, colors){
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Discentes por Nível',
                data: counts,
                backgroundColor: [colors.orange.half, colors.blue.half],
            }]
        },
        options: {
            maintainAspectRatio: false,
        },

    });
}

export function ChartLattesUpdate(ctx, labels, data){
    return new Chart(ctx, {
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