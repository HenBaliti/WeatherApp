import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {

const [weatherData,setWeatherData] = useState(null);
const [historyWeatherData,setHistoryWeatherData] = useState(null);
const [errorMsg,setErrorMsg] = useState("");
const [city,setCity] = useState("");

const checkClick = async () =>{
  try {

    // first call - "location" + "more"
    let response = await axios.get(`http://localhost:5000`, {
      params: {
        city: city
      }
    });
    const data = response.data;
    setWeatherData(data);

    // second call - history data
    try {
      let result = await axios.get(`http://localhost:5000/getHistoryWeather`, {
        params: {
          city: city
        }
      });
      const data = result.data;
      setHistoryWeatherData(data);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg('Oh uh, something went wrong.\n Try enter city name again.');
    }

  } catch (error) {
    setErrorMsg('Oh uh, something went wrong.\n Try enter city name again.');
  }
}

const handleChangeInput = (event) =>{
  const result = event.target.value.replace(/[^a-z ]/gi, '');
  setCity(result);
}


  return (

    <div className='background-container'>

      <div className='container'>

        
          <div className='left-container'>
          <div className='img-div'>
            
            <img className='fintek-logo'/>

          </div>

            <div className='div-title'>
              <p className='content-title'>Use our weather app</p>
              <p className='content-title'>to see the weather</p>
              <p className='content-title'>around the world</p>
            </div>

          <h1 className='city-name-input-text'>City Name</h1>
          

          <div class='inputWithButton'>
            <input type="text" placeholder='Enter City...' onChange={handleChangeInput} value={city} />
            <button className='button-text' onClick={checkClick}>Check</button>
          </div>

          <div>
            <b className='error-message'>{errorMsg}</b>
          </div>

          </div> 

          {weatherData !== null ? 
          
          <div className='right-container'>
          <div className='weather-box'>

            <div className='box-place'>
              <h1 className='city-name-box'>{weatherData.location.name}</h1>
              <h1 className='country-name-box'>{weatherData.location.country}</h1>
              <h1 className='date-box'>{weatherData.location.localtime}</h1>
            </div>

            <div className='box-degrees'>
              <h1 className='weather-number-box'>{Math.round(weatherData.current.temp_c)}<span>&#176;</span></h1>
              <h1 className='feeling-box'>{weatherData.current.condition.text}</h1>
            </div>

            <div className='box-more'>
              <div className='column-order'>
                <h1 className='more-lighter-text'>precipitation</h1>
                <h1 className='more-bolder-text'>{weatherData.current.precip_mm} mm</h1>                  
              </div>
              <div className='column-order'>
                <h1 className='more-lighter-text'>humidity</h1>
                <h1 className='more-bolder-text'>{weatherData.current.humidity}%</h1>
              </div>
              <div className='column-order'>
                <h1 className='more-lighter-text'>wind</h1>
                <h1 className='more-bolder-text'>{weatherData.current.wind_kph} km/h</h1>  
              </div>
            </div>

            <div className='box-weekly'>

            {
              historyWeatherData != null ? 
              historyWeatherData.map((item)=>{
                return (
                      <div className='column-order'>
                        <h1 className='weekly-lighter-text'>{item.time}</h1>
                        <h1 className='weekly-bolder-text'>{item.temp_c}<span>&#176;</span></h1>  
                      </div>

                      );               
              }) : null
            }

            </div>



          </div>
          </div> : null
          } 

      </div>

    </div>
  );
}

export default App;
