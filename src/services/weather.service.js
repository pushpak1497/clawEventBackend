import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "./env" });

const getweather = async (location) => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json`,
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: location,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error.message);
  }
};
export default getweather;
