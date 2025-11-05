mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: listing.geometry.coordinates, // dynamically set from show.ejs
  zoom: 9
});

new mapboxgl.Marker({color : 'Red'})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`${listing.location}<p>Exact Location Provided After Booking </p>`))
  .addTo(map);
