import { weather } from "./envUnloader.jsx";

export function getDateAndTime() {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var date = new Date();

    var getMonth = months[date.getMonth()];
    var getDayNumber = date.getDate();
    var getDayName = days[date.getDay()];
    var getYearNumber = date.getFullYear();

    var getHour = date.getHours();
    var getMinute = date.getMinutes();
    var getSeconds = date.getSeconds();
    var am_or_pm = "AM";

    if (getHour >= 12) {
        if (getHour > 12) getHour -= 12;
        am_or_pm = "PM";
    }
    else if (getHour == 0) {
        getHour = 12;
        am_or_pm = "AM";
    }

    getHour = getHour < 10 ? "0" + getHour : getHour;
    getMinute = getMinute < 10 ? "0" + getMinute : getMinute;
    getSeconds = getSeconds < 10 ? "0" + getSeconds : getSeconds;
    var currentTime = getHour + ":" + getMinute + ":" + getSeconds + am_or_pm;

    return {
        month: getMonth,
        dayNumber: getDayNumber,
        dayName: getDayName,
        yearNumber: getYearNumber,
        time: currentTime
    };
}

export function weatherForecaster(position) {
    var weather_call = new XMLHttpRequest();
    weather_call.open("GET", `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${weather}`);
    weather_call.send();
    weather_call.onreadystatechange = function() {
        if (weather_call.readyState === 4 && weather_call.status === 200) {
            var weather_output = JSON.parse(weather_call.responseText);
            console.log(weather_output);

            var temperature_to_f = Math.round((weather_output.main.temp - 273.15) * (9/5) + 32);
            var sunset = weather_output.sys.sunset;
            var id = weather_output.weather[0].id;
            var date = new Date();
            var currently = Math.round(date.getTime() / 1000);
            var daylight = (currently < sunset) ? "day" : "night";
            document.getElementById("weather").innerHTML = `<i class="wi wi-owm-${daylight}-${id}"></i> | ${temperature_to_f}&deg;F`;
        }
    }
}