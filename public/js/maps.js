document.addEventListener("DOMContentLoaded", () => {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=DcEQCkxfu1PEoOQboINd',
    center: coordinates, // [lng, lat]
    zoom: 12
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  new maplibregl.Marker({ color: '#e63946' })
    .setLngLat(coordinates)
    .setPopup(
      new maplibregl.Popup({ offset: 25 }).setHTML(
        `<h4>Welcome to ${location1}</h4><p>This is a marker.</p>`
      )
    )
    .addTo(map);
});
