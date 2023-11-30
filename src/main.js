function moveMarker(marker, newLatLng, duration = 5000) {
    const from = marker.getLatLng();
    const to = new L.LatLng(newLatLng[0], newLatLng[1]);
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        const t = elapsed / duration;
        if (t < 1) {
            const lat = from.lat + (to.lat - from.lat) * t;
            const lng = from.lng + (to.lng - from.lng) * t;
            marker.setLatLng([lat, lng]);
            requestAnimationFrame(animate);
        } else {
            marker.setLatLng(to);
        }
    }

    requestAnimationFrame(animate);
}

function renderMainView() {
    const evtSource = new EventSource("http://localhost:1337/v1/bikes/feed", {
        withCredentials: true,
    });

    let container = document.getElementById("container");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    container.innerHTML = `<div id="map" class="map"></div>`;

    const map = L.map('map').setView([59.35, 15.83054925199988], 9);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let markers = {};

    evtSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        let marker;

        if (data.id in markers) {
            marker = markers[data.id];
            moveMarker(marker, data.geoJSON.geometry.coordinates);
        } else {
            marker = L.marker(data.geoJSON.geometry.coordinates);
            markers[data.id] = marker;
            marker.addTo(map);
        }
    }
    evtSource.onerror = function(event) {
        console.error("EventSource failed:", event);
    };
    
    const btn = document.createElement('button');
    btn.className = 'start-button';
    btn.innerText = "Starta simulering";
    btn.onclick = () => {
        const result = fetch("http://localhost:1337/v1/bikes/simulate");
    }
    container.appendChild(btn)
}

renderMainView();
