"use client";
import { useState, ChangeEvent, FormEvent} from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react"; //lucid is an icon library from where we are importing these 3 icons.


interface WeatherData {
    temperature : number;
    description : string;
    location : string;
    unit : string;
}

export default function Weather_app() {
    const [location, setlocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedLocation  = location.trim(); //trim is a built in func of javascript which removes the unnessary spaces spaces of the string entered.
        if(trimmedLocation === ""){
            setError("Please Enter a Valid Location");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try{
            const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if(!response.ok){
                throw new Error("city not found.");
            }
            //our response will be converted into json formate and then stored in the data variable
            const data = await response.json();
            //making an obj 
            const weatherData : WeatherData = {
                temperature : data.current.temp_c,
                description : data.current.condition.text,
                location : data.location.name,
                unit: "C",
            };
            setWeather(weatherData);
        }catch(error) {
            setError("City not found, Please try again.");
            setWeather(null); //by making this null, the previous data will be removed/not considerd and then youl write new info. 
        }finally{
            setIsLoading(false);
        }
    };
    function getTemperatureMessage(temperature : number , unit : string) : string {
        if(unit === "C") {
            if(temperature < 0){
                return `Its freezing at ${temperature}°C! Bundle Up!`;
            }
            else if(temperature < 10){
                return `Its quite cold at ${temperature}°C! Wear Warm clothes!`;
            }
            else if(temperature < 20){
                return `The temperature is ${temperature}°C. Comfortable for a light jacket!`;
            }
            else if(temperature < 30){
                return `Its a pleasant ${temperature}°C. Enjoy the nice weather!`;
            }
            else {
                return `Its hot at ${temperature}°C. Stay hydrated!`;
            }
        }
        else{
            //Placeholder for other temp units e.g(Farenhite)
            return `${temperature}° ${unit}`;
        } 
    }
    function getWeatherMessage (description: string) : string {
        switch (description.toLocaleLowerCase())
        {
            case "Sunny": 
                return "Its a beautiful sunny day!";
            case "partly cloudy": 
                return "Expect some clouds and sunshine";
            case "cloudy": 
                return "Its cloudy today";
            case "overcast": 
                return "The sky is overcast";
            case "rain": 
                return "Dont expect your umbrella! Its raining.";
            case "thunderstorms": 
                return "thunderstorms are expected today";
            case "mist": 
                return "Its misty outside";
            case "fog": 
                return "Be careful! its fog outside.";
            default:
                return description; //default to returning the description as it is. 
        }
    }
    function getLocationMessage (location : string) : string {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return `${location} ${isNight ? "At Night" : "During the day"}`;
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md mx-auto text-center">
                <CardHeader>
                    <CardTitle>Welcome to Weather App.</CardTitle>
                    <CardDescription>Search the current weather according to your city!</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Enter a city name"
                        value={location}
                        onChange={(e) => setlocation(e.target.value)} 
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Search"} 
                        </Button>
                </form>
                {error && <div className="mt-4 text-red-500">{error}</div>}
                {weather && (
                    <div className="mt-4 grid gap-2">
                        <div className="flex items-center gap-2">
                            <ThermometerIcon className="w-6-h-6" />
                            {getTemperatureMessage(weather.temperature, weather.unit)}
                        </div>
                        <div className="flex items-center gap-2">
                            <CloudIcon className="w-6-h-6" />
                            {getWeatherMessage(weather.description)}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="w-6-h-6" />
                            {getLocationMessage(weather.location)}
                        </div>
                    </div>
                    )}
                    </CardContent>
            </Card>
        </div>
    )}

