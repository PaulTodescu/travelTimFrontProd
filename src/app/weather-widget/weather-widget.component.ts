import {Component, OnInit} from '@angular/core';
import {faCloud, faCloudRain, faSnowflake, faSun} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition, IconProp} from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss']
})
export class WeatherWidgetComponent implements OnInit {

  weatherData: any;

  faSun = faSun
  faCloud = faCloud;
  faCloudRain = faCloudRain;
  faSnowflake = faSnowflake;

  constructor() { }

  public getWeatherData(): void {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=timisoara&appid=7b22486acfce2e562a0f25b3f7fd3d26')
      .then(response => response.json())
      .then(data => {
        this.setWeatherData(data);
      });
  }

  public setWeatherData(data: any): void {
    this.weatherData = data;
    this.weatherData.temp_celcius = (this.weatherData.main.temp - 273.15).toFixed(0);
    this.weatherData.temp_feels_like = (this.weatherData.main.feels_like - 273.15).toFixed(0);
    this.weatherData.wind.speed = (this.weatherData.wind.speed * 3.6).toFixed(0);
    this.weatherData.condition = this.weatherData.weather[0].main;
  }

  ngOnInit(): void {
    this.getWeatherData();
  }

}
