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

//Variables card
let index = 31;
let temp = [];
let name = [];
let hum = [];
let est = [];
let icon = [];

async function cardData() {
    const clima = await fetchApi("https://api.gael.cloud/general/public/clima");

    //Pasar datos a los arrays de las cards
    temp = clima.map(clima => clima.Temp);
    name = clima.map(clima => clima.Estacion);
    hum = clima.map(clima => clima.Humedad);
    est = clima.map(clima => clima.Estado);
    icon = clima.map(clima => clima.Icono);
    console.log(temp);

    //Escribir datos en el card
    document.getElementById('cardTitle').innerHTML = name[index];
    document.getElementById('cardTemp').innerHTML = `${temp[index]} °C`;
    document.getElementById('cardHum').innerHTML = `<i class="fa-solid fa-droplet"></i> ${hum[index]}%`;
    document.getElementById('cardEst').innerHTML =  est[index];
    document.getElementById('cardIcon').src = `./assets/img/weather-icons/${icon[index]}`;
}
cardData();

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

let elem = document.getElementById('changePlace');
elem.addEventListener("change", () => {
    let valor = elem.value;
    index = valor;
    const showButton = document.getElementById("btn-Select");
    showButton.addEventListener("click", cardData);
    console.log(index);
})

showData();