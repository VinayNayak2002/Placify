const mapContainer = document.getElementById("map");

if (mapContainer) {
    const geometry = mapContainer.dataset.geometry;
    const location = mapContainer.dataset.location;

    if (geometry && location && window.L) {
        const parsedGeometry = JSON.parse(geometry);

        const map = L.map("map").setView(
            [parsedGeometry.coordinates[1], parsedGeometry.coordinates[0]],
            13
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(map);

        L.marker([parsedGeometry.coordinates[1], parsedGeometry.coordinates[0]])
            .addTo(map)
            .bindPopup(location)
            .openPopup();
    }
}