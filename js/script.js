//Importacion
import { fetchApi } from "./fetch.js";

//Variables grafico
let chartInstance = null;
const color1 = '#ED9E7C';
const color2 = '#ACB9C3';
const color3 = '#667B87'

let fechas = [];
let promTemp = [];
let senTemp = [];
let maxTemp = [];
let minTemp = [];

async function showData() {
    //Fecha actual
    const currentDate = new Date();
    const nintyDaysAgo = new Date(currentDate);
    //Fecha de hace 60 dias/2 meses
    nintyDaysAgo.setDate(nintyDaysAgo.getDate() - 90);
    //Formatea fecha de "Sun Sep 17 2023 15:42:29 GMT-0300 (Chile Summer Time)" a "2023-07-19"
    const formattedDate = nintyDaysAgo.toISOString().split('T')[0];
    //Guarda elemento datepicker 1 en variable
    const startDateInput = document.getElementById("dateStart");
    //Pasa el valor al elemento
    startDateInput.value = formattedDate;

    //Pasar fecha actual a parte card
    document.getElementById('today').innerHTML = currentDate.toISOString().split('T')[0];

    //Capturar valores del datepicker
    let startDate = new Date(document.getElementById("dateStart").value);
    let endDate = new Date(document.getElementById("dateEnd").value);
    //Formatear valores
    let formattedStart = startDate.toISOString().split('T')[0];
    let formattedEnd = endDate.toISOString().split('T')[0];
    
    //Llama al fetch para recoger datos
    // const clima = await fetchApi("https://api.gael.cloud/general/public/clima");
    const climaGrafico = await fetchApi(`https://archive-api.open-meteo.com/v1/archive?latitude=-33.4569&longitude=-70.6483&start_date=${formattedStart}&end_date=${formattedEnd}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_mean&timezone=auto`);

    //Pasar datos a los arrays del grafico
    fechas = climaGrafico.daily.time;
    promTemp = climaGrafico.daily.temperature_2m_mean;
    senTemp = climaGrafico.daily.apparent_temperature_mean;
    maxTemp = climaGrafico.daily.temperature_2m_max;
    minTemp = climaGrafico.daily.temperature_2m_min;

    //Codigo para crear grafico
    if (chartInstance) {
        chartInstance.data.labels = fechas;
        chartInstance.data.datasets[0].data = promTemp;
        chartInstance.data.datasets[0].backgroundColor = color2;
        chartInstance.data.datasets[0].borderColor = color1;
        chartInstance.update(); // Actualizar el gráfico con los nuevos datos
    } else {
        const cdx = document.getElementById('myChart');
        chartInstance = new Chart(cdx, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [
                    {
                        label: "Temperatura Promedio",
                        data: promTemp,
                        borderColor: color1,
                        backgroundColor:color1,
                        tension: 0.1
                    },
                    
                    {
                        type: 'line',
                        data: maxTemp,
                        label: "T° Max",
                        borderColor: color3,
                        backgroundColor: color3,
                        tension: 0.1,
                        hidden: true
                    },
                    {
                        type: 'line',
                        data: minTemp,
                        label: "T° Min",
                        borderColor: color3,
                        backgroundColor: color3,
                        tension: 0.1,
                        hidden: true
                    },
                    {
                        type: 'bar',
                        data: senTemp,
                        label: "Sensación Térmica",
                        borderColor: color2,
                        backgroundColor: color2,
                        tension: 0.1
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: "Temperaturas históricas en Santiago",
                        padding: {
                            top: 20,
                            bottom: 10,
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || "";
                                if (label) {
                                    label += ": ";
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y + "°C";
                                }
                                return label;
                            },
                        },
                    },
                },
            },
        });
    }
}

window.addEventListener("load", () => {
    const generateButton = document.getElementById("btn-datePicker");
    generateButton.addEventListener("click", showData);
});

showData();