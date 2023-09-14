//Importacion
import { fetchApi } from "./fetch.js";

//Variables cards
let temp = [];
let name = [];
let hum = [];
let est = [];
let icon = [];

//Variables graficos
let fechas = [];
let promTemp = [];
let maxTemp = [];
let minTemp = [];
let senTemp = [];

async function showData() {
    const clima = await fetchApi("https://api.gael.cloud/general/public/clima");
    const climaGrafico = await fetchApi("https://archive-api.open-meteo.com/v1/archive?latitude=-33.4569&longitude=-70.6483&start_date=2023-08-07&end_date=2023-09-07&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_mean&timezone=auto");

    //Pasar datos a los arrays de las cards
    temp = clima.map(clima => clima.Temp);
    name = clima.map(clima => clima.Estacion);
    hum = clima.map(clima => clima.Humedad);
    est = clima.map(clima => clima.Estado);
    icon = clima.map(clima => clima.Icono);

    //Escribir datos en el card
    document.getElementById('cardTitle').innerHTML = name[31];
    document.getElementById('cardTemp').innerHTML = `${temp[31]} °C`;
    document.getElementById('cardHum').innerHTML = `<i class="fa-solid fa-droplet"></i> ${hum[31]}%`;
    document.getElementById('cardEst').innerHTML =  est[31];
    // const cardIcon = document.getElementById('cardIcon').src = icon[31];
    // console.log(cardIcon);

    //Pasar datos a los arrays del grafico
    fechas = climaGrafico.daily.time;
    maxTemp = climaGrafico.daily.temperature_2m_max;
    minTemp = climaGrafico.daily.temperature_2m_min;
    promTemp = climaGrafico.daily.temperature_2m_mean;
    senTemp = climaGrafico.daily.apparent_temperature_mean;

    //Codigo para crear grafico 1
    const cdx = document.getElementById('myChart');
    new Chart(cdx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [
                {
                    label: "Temperatura Promedio",
                    data: promTemp,
                    borderColor: 'rgb(237, 158, 124)',
                    tension: 0.1
                },
                {
                    type: 'bar',
                    label: 'Sensación Termica',
                    data: senTemp,
                    borderColor: 'rgb(172, 185, 195)'
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    });

    //Codigo para crear grafico 2
    const cdx1 = document.getElementById('myChart1');
    new Chart(cdx1, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [
                {
                    label: 'Temperatura Maxima',
                    data: maxTemp,
                    borderColor: 'rgb(237, 158, 124)',
                    fill: false,
                    tension: 0.1
                },
                {
                    type: 'line',
                    label: 'Temperatura Minima',
                    data: minTemp,
                    borderColor: 'rgb(172, 185, 195)'
                }
            ]
        }
    })
}

showData();

// function dropdownSelect(){
//     let d = document.getElementById('changePlace');
//     let display = d.options[d.selectedIndex].text;
//     document.getElementById('msg').innerHTML = display;
// }
// dropdownSelect();