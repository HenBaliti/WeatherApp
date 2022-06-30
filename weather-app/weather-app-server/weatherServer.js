const express = require("express");
const request = require("request");
const cors = require('cors');
require('dotenv').config();


const app = express();
// ADD CORS
app.use(cors());


//////////////////////////
////////GET REQUESTS//////
//////////////////////////

//Get current weather for specific city name
app.get('/', (req, res) => {
	let city = req.query.city;
	request(
		`https://api.weatherapi.com/v1/current.json?q=${city}&key=${process.env.SECRECT_KEY_WEATHER_API}`,
		function(error, response, body) {
			let data = JSON.parse(body);
			if (response.statusCode === 200) {
				res.send(data);
			}
            else{
				res.status(400).send('Oh uh, something went wrong');
            }
		}
	);
});

//Get history weather for specific city name
app.get('/getHistoryWeather', (req, res) => {
	let city = req.query.city;
	var today = new Date();
    var todayDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	request(
		`https://api.weatherapi.com/v1/history.json?q=${city}&dt=${todayDate}&key=${process.env.SECRECT_KEY_WEATHER_API}`,
		function(error, response, body) {
			let data = JSON.parse(body);
			if (response.statusCode === 200) {
				res.send(get5TodayDate(data.forecast.forecastday[0].hour,today.getHours()));
			}
            else{
				res.status(400).send('Oh uh, something went wrong');
            }
		}
	);
});


//////////////////////////
//////Helper Function/////
//////////////////////////
const get5TodayDate = (arrHour,currentTime)=>{
    var dt = new Date();
    console.log(dt.getHours())
    dt.setHours( dt.getHours() - 1 );
    console.log(dt.getHours())
    
    const newObject5 = 
    [
        {
            time: (dt.setHours(dt.getHours() - 3)) === 24 ? '00:00' : (dt.getHours() - 3)+':00',
            temp_c: arrHour[(dt.getHours() - 3) === 24 ? 0 : (dt.getHours() - 3)]?.temp_c
        },        
        {
            time: dt.setHours((dt.getHours() - 2)) === 24 ? '00:00' : (dt.getHours() - 2)+':00',
            temp_c: arrHour[(dt.getHours() - 2) === 24 ? 0 : (dt.getHours() - 2)]?.temp_c
        },        
        {
            time: dt.setHours((dt.getHours() - 1)) === 24 ? '00:00' : (dt.getHours() - 1)+':00',
            temp_c: arrHour[(dt.getHours() - 1) === 24 ? 0 : (dt.getHours() - 1)]?.temp_c
        },
        {
            time: (dt.getHours()) === 24 ? '00:00' : (dt.getHours())+':00',
            temp_c: arrHour[(dt.getHours()) === 24 ? 0 : (dt.getHours())]?.temp_c
        },
        {
            time: dt.setHours((dt.getHours() + 1)) === 24 ? '00:00' : (dt.getHours() + 1)+':00',
            temp_c: arrHour[(dt.getHours() + 1) === 24 ? 0 : (dt.getHours() + 1)]?.temp_c
        }];
        return newObject5;
}

app.listen(5000, () => console.log("Server is listening to port 5000"));
