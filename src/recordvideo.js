
export const startVideoRecording = () => {
  const constraints = { video: true, audio: true };

  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => chunks.push(event.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // Create a download link for testing
        const a = document.createElement("a");
        a.href = url;
        a.download = "sos-video.webm";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Stop the video stream
        stream.getTracks().forEach(track => track.stop());

        // Auto-send via WhatsApp
        sendWhatsApp(url);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 10000); // Stops recording after 10 seconds
    })
    .catch((error) => {
      console.error("Error accessing webcam:", error);
      alert("Webcam access denied or unavailable.");
    });
};
const sendWhatsApp = (videoURL) => {
  const message = `SOS Alert! Here is the recorded video: ${videoURL}`;
  const phone = "9538132358"; // Replace with trusted contact's number
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappLink, "_blank");
};

