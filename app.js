require("dotenv").config();
const express = require("express");
const https = require("https");

const app = express();
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
    
})

app.post("/", (req, res) => {

    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;
    
    https.get(url, (response) => {
        console.log(response.statusCode);

        response.on("data", (data) => {

            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDes = weatherData.weather[0].description;
            const iconUrl = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
            
            res.write('<head><meta charset="utf-8"></head>');
            res.write("<h3>The weather is currently " + weatherDes + ".</h3>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
            res.write("<img src=" + iconUrl + ">")
            res.send();
        })
    })
})



app.listen(3000, () => {
    console.log("Running on port 3000");
})