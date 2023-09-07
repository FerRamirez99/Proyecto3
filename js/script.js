import { fetchApi } from "./fetch.js";

let temp = [];
let name = [];
let hum = [];

async function showData() {
    const clima = await fetchApi("https://api.gael.cloud/general/public/clima");

    temp = clima.map(clima => clima.Temp);
    name = clima.map(clima => clima.Estacion);
    hum = clima.map(clima => clima.Humedad);

    //Codigo para crear grafico
    const cdx = document.getElementById('myChart');
    new Chart(cdx, {
        type: 'line',
        data: {
            labels: name,
            datasets: [
                {
                    label: "Temperatura",
                    data: temp,
                    // borderWidth: 1,
                    // backgroundColor: "blue",
                    // borderColor: "blue"
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    type: 'line',
                    label: 'Humedad',
                    data: hum,
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
}
showData();

