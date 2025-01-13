const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const resultDiv = document.getElementById('result');

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            scan();
        };
    })
    .catch(err => {
        console.error("Error accessing camera:", err);
        alert("Error accessing camera. Please check your browser settings and ensure you have a camera.");
    });

function scan() {
    if (video.videoWidth === 0) {
        requestAnimationFrame(scan);
        return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
        resultDiv.textContent = "result: " + code.data;
        resultDiv.style.display = "block";
        
        context.strokeStyle = 'red';
        context.lineWidth = 4;
        
        // Draw rectangle around detected QR code
        context.beginPath();
        context.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
        context.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
        context.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
        context.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
        context.closePath();
        context.stroke();
        
        return;
    } else {
        resultDiv.style.display = "none";
    }
    requestAnimationFrame(scan);
}
