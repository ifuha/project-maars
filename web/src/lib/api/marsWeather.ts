import { api } from "../utils/fecth-api";
import { MarsWeather } from "./type";

export const getMarsWeathers = () => api<MarsWeather[]>("/api/marsweather");
