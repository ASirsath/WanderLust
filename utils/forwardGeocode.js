// utils/forwardGeocode.js
const axios = require("axios");
require("dotenv").config();

const forwardGeocode = async (location) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "WanderStayApp/1.0"
      }
    });

    if (response.data.length === 0) {
      return { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai
    }

    const { lat, lon } = response.data[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
  } catch (error) {
    console.error("Error in forwardGeocode:", error.message);
    return { lat: 19.0760, lng: 72.8777 }; // fallback
  }
};

module.exports = forwardGeocode;
