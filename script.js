const apiKey = "YOUR_API_KEY"; 
const searchButton = document.getElementById("searchBtn");
const input = document.querySelector("input[name='city']");
const tempDiv = document.querySelector(".mytempdiv");
const infoDiv = document.querySelector(".myinfodiv");
const forecastDiv = document.querySelector(".myforecastdiv");

searchButton.addEventListener("click", async () => {
    const city = input.value.trim();
    if (!city) return alert("Please enter a city name.");

    try {
        // Current weather
        const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!currentRes.ok) throw new Error("City not found");

        const currentData = await currentRes.json();
        const { name, main, weather } = currentData;

        tempDiv.innerHTML = `${Math.round(main.temp)}°C`;
        infoDiv.innerHTML = `
            <p><strong>City:</strong> ${name}</p>
            <p><strong>Weather:</strong> ${weather[0].description}</p>
            <p><strong>Humidity:</strong> ${main.humidity}%</p>
            <p><strong>Feels Like:</strong> ${Math.round(main.feels_like)}°C</p>
        `;

        // Forecast
        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const forecastData = await forecastRes.json();

        const dailyForecasts = forecastData.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        ).slice(0, 5);

        forecastDiv.innerHTML = "<ul class='forecast-list'>" +
            dailyForecasts.map(day => {
                const date = new Date(day.dt_txt).toLocaleDateString("en-IN", {
                    weekday: 'short', day: 'numeric', month: 'short'
                });
                const desc = day.weather[0].description;
                const temp = Math.round(day.main.temp);
                const icon = day.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                return `
                    <li>
                        <span><strong>${date}</strong></span>
                        <span><img src="${iconUrl}" alt="${desc}" title="${desc}"></span>
                        <span>${temp}°C</span>
                    </li>`;
            }).join("") +
            "</ul>";
    } catch (err) {
        tempDiv.innerText = "";
        infoDiv.innerText = "❌ Error fetching weather.";
        forecastDiv.innerText = "";
        console.error(err);
    }
});
