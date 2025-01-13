        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        const resultDiv = document.getElementById('result');
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                    canvas.width = video.videoWidth; // Crucial: Set canvas dimensions AFTER video is loaded
                    canvas.height = video.videoHeight;
                    scan();
                };
            })
            .catch(err => {
                console.error("Error accessing camera:", err);
                alert("Error accessing camera. Please check your browser settings and ensure you have a camera.");
            });

        function scan() {
            if (video.videoWidth === 0) { // Check if video is playing
                requestAnimationFrame(scan);
                return;
            }
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                resultDiv.textContent = "TT number1: " + code.data;
                resultDiv.style.display = "block"; // Show the result
                // Optionally stop scanning after finding a code:
                context.strokeStyle = 'red';
                context.lineWidth = 30;
                context.strokeRect(code.location.data[0], code.location.data[1], code.location.data[2], code.location.data[3]);
                return;
            } else {
                resultDiv.style.display = "none"; // Hide if no code
            }
            requestAnimationFrame(scan);
        }
