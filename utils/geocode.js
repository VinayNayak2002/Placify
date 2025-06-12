const fetch = require("node-fetch");

module.exports.getCoordinates = async (location) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        type: "Point",
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)],
      };
    }
    return null;
  } catch (error) {
    console.error("Error in geocoding:", error);
    return null;
  }
};