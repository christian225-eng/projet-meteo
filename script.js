let url = "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&daily=weather_code,temperature_2m_min,apparent_temperature_max&hourly=temperature_2m,rain,weather_code,wind_speed_10m,apparent_temperature,precipitation,snowfall,snow_depth,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,soil_temperature_0cm,soil_moisture_0_to_1cm,wind_speed_80m,wind_speed_120m,wind_speed_180m,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,is_day&current=weather_code,is_day,rain,wind_direction_10m,wind_speed_10m,wind_gusts_10m,apparent_temperature,precipitation,temperature_2m,snowfall&timezone=auto";

let dateTime = document.querySelector(".current-date");
let weatherCondition = document.querySelector(".weather-condition");
let currentTemp = document.querySelector(".current-temp")
let windSpeed = document.querySelector(".wind-speed");
let compassArrow = document.querySelector(".compass-arrow");
let prevision = document.querySelector(".prevision-container");

//---------------------------------------------------------------------//
// CHARGEMENT DES DONNEES
fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        // Affichage de l'heure actuelle et des données horaires
        let currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Afficher l'heure actuelle

        // Affichage date actuelle au format jj/mm/aaaa
        let currentDate = new Date();
        let day = currentDate.getDate().toString().padStart(2, '0'); // Jour avec 2 chiffres
        let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Mois avec 2 chiffres
        let year = currentDate.getFullYear(); // Année complète

        // Format de la date
        let formattedDate = `${day}/${month}/${year}`;


        // Création du contenu HTML pour afficher l'heure actuelle
        let contentHTMLTime = `
            <div class="current-date">
                <p>${formattedDate}</p>
                <p>${currentTime}</p>
            </div>
        `;

        // Affichage dans le DOM
        dateTime.innerHTML = contentHTMLTime;

        weatherCondition.textContent = getWeatherDescription(data.current.weather_code);
        currentTemp.textContent = `${Math.round(data.current.temperature_2m)}°`;
        windSpeed.textContent = `${data.current.wind_speed_10m} km/h`;

        compassArrow.style.transform = `rotate(${data.current.wind_direction_10m}deg)`;

        changerBackground(data.current.weather_code, data.current.is_day);
        affichageJourNuit(data);
        afficherPrevisions(data.hourly)

    });

function changerBackground(weatherCode, isDay) {
    let body = document.body
    let backClass = "";
    if ([95, 96, 99].includes(weatherCode)) {
        backClass = "thunder-back";
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
        backClass = "rain-back"
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
        backClass = "snow-bg";
    } else if ([0, 1].includes(weatherCode)) {
        if (is_day) {
            backClass = "sunny-back"
        } else {
            backClass = "clear-night-back";
        }
    } else if ([2, 3].includes(weatherCode)) {
        backClass = isDay ? "cloudy-day-back" : "cloudy-night-back"
    } else {
        backClass = "default-bg";
    }

    body.classList.remove(
        "thunder-back", "rain-back", "snow-bg", "sunny-back", "clear-night-back", "cloudy-day-back", "cloudy-night-back",
        "default-back"
    )
    body.classList.add(backClass);
}
//affichage jour nuit

function affichageJourNuit(data) {
    let body = document.body;
    if (data.current.is_day === 1) {
        body.classList.add("day-theme");
        body.classList.remove("night-theme");
    } else {
        body.classList.add("night-theme");
        body.classList.remove("day-theme");
    }
}


// affichage prévisions

function afficherPrevisions(hourlyData) {
    if (!hourlyData?.time) return;

    let previsionHTML = '<div class="row">';
    let maxHours = 24;
    for (let i = 0; i < hourlyData.time.length && i < maxHours; i++) {
        let hours = new Date(hourlyData.time[i]).getHours().toString().padStart(2, '0');
        let temp = Math.round(hourlyData.temperature_2m[i]);

        previsionHTML += `
            <div class="prevision-hour col">
                <div class="hour">${hours}h</div>
                <div class="temp">${temp}°</div>

            </div>
        `;
    }

    prevision.innerHTML = previsionHTML + '</div>';
}
//codes météo

function getWeatherDescription(weather_code) {
    let weatherMap = {
        0: "Ensoleillé",
        1: "Clair",
        2: "partiellement nuageux",
        3: "nuageux",
        61: "pluie légère",
        85: "neige",
        95: "orage"
    }
    return weatherMap[weather_code]
}

