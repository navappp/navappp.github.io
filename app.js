if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(error => console.log('Service Worker Registration Failed:', error));
}

let previousPosition = null;

const canvas = document.getElementById('compass');
const ctx = canvas.getContext('2d');

navigator.geolocation.watchPosition((position) => {
    if (previousPosition) {
        const deltaLat = position.coords.latitude - previousPosition.coords.latitude;
        const deltaLon = position.coords.longitude - previousPosition.coords.longitude;

        let angle = 0;
        let direction = '';

        if (Math.abs(deltaLat) > Math.abs(deltaLon)) {
            direction = deltaLat > 0 ? 'North' : 'South';
            angle = deltaLat > 0 ? 0 : 180;
        } else {
            direction = deltaLon > 0 ? 'East' : 'West';
            angle = deltaLon > 0 ? 90 : 270;
        }

        document.getElementById('direction').innerText = 'Direction: ${direction}';
        drawCompass(angle);
    }

    previousPosition = position;
}, (error) => {
    console.error('Error getting location', error);
}, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
});

function drawCompass(angle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 140, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, -120);
    ctx.lineTo(-10, -100);
    ctx.lineTo(10, -100);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.restore();
}
