var express = require('express')
  , bodyParser = require('body-parser');

const app = express()
var request = require('request');

app.use(bodyParser.json());

var qs =  "http://api.weatherstack.com/current?access_key=b72fac9c9c4107c0d00830879de12b86&query=";
var qsbkup = "http://api.openweathermap.org/data/2.5/weather?q=";
var qsbkup2 = ",AU&APPID=d77980b9eeccba2e2046ef03492a149d&units=metric";


app.get('/', function (req, res) {
  res.send('Hello World')
})
 

app.get('/v1/weather', function (req, res) {
    var city = req.query.city

    if(city!= "melbourne")
        res.send("Invalid city");   
    
    qs += city;
    qsbk = qsbkup + city + qsbkup2 ;
    
    request(qs, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var jo = JSON.parse(response.body) 
            // console.log(jo);
            // console.log(jo.current.wind_speed);
            // console.log(jo.current.temperature);

            res.json({
                "wind_speed": jo.current.wind_speed,
                "temperature_degree": jo.current.temperature
            });
        }
        else if(response.statusCode == 408 || response.statusCode == 503 ){
            qsbk = qsbkup + city + qsbkup2 ;
            //console.log(qsbk);

            request(qsbk, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var jo = JSON.parse(response.body) 
                    res.json({
                        "wind_speed": jo.wind.speed,
                        "temperature_degree": jo.main.temp//(parseFloat(jo.main.temp) - 273.15 ).toString()
                    });

                }
            });
        } 
        else {
            console.log("Error "+response.statusCode)
            res.send(response.body);
        }
        });


  })
 
  
app.listen(process.env.PORT || 3000)

var server_port =  process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});