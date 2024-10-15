// Get elements
const nameInput = document.getElementById('nameInput');
const badgeName = document.getElementById('badgeName');
const imageInput = document.getElementById('imageInput');
const profileImage = document.getElementById('profileImage');
const adjustImageBtn = document.getElementById('adjustImageBtn');
const imageModal = document.getElementById('imageModal');
const cropperImage = document.getElementById('cropperImage');
const cropButton = document.getElementById('cropButton');
const closeModal = document.querySelector('.close');
const downloadBadgeBtn = document.getElementById('downloadBadgeBtn');
const linkedinShareBtn = document.getElementById('linkedinShareBtn');
const instagramShareBtn = document.getElementById('instagramShareBtn');
const whatsappShareBtn = document.getElementById('whatsappShareBtn');
const badgePreview = document.querySelector('.badge-preview');
let cropper;

badgePreview.addEventListener('mousemove', function (e) {
    const rect = badgePreview.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X position within the element
    const centerX = rect.width / 2;

    const rotateY = (x - centerX) / 20;  // Rotate on the Y-axis based on X position

    // Calculate the shadow based on mouse position
    const shadowX = (centerX - x) / 10; // Shadow offset for X
    const shadowBlur = 20; // Shadow blur value
    const shadowSpread = 5; // Shadow spread value
    const shadowColor = `rgba(0, 0, 0, 0.3)`; // Black shadow with opacity

    // Apply the horizontal rotation and shadow effect
    badgePreview.style.transform = `rotateY(${rotateY}deg)`;
    badgePreview.style.boxShadow = `${shadowX}px 8px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`;
});

badgePreview.addEventListener('mouseleave', function () {
    // Reset the transform and shadow when the mouse leaves
    badgePreview.style.transform = `rotateY(0deg)`;
    badgePreview.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.1)`; // Reset to default shadow
});

// Update name in the badge
nameInput.addEventListener('input', function () {
    badgeName.textContent = nameInput.value || 'Your Name';
});
// Handle image upload and initialize cropper
imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profileImage.src = e.target.result;
            cropperImage.src = e.target.result;
            imageModal.style.display = 'block';
            initializeCropper(); // Initialize cropper when image is uploaded
        }
        reader.readAsDataURL(file);
    }
});

// Initialize cropper
function initializeCropper() {
    if (cropper) {
        cropper.destroy(); // Destroy existing cropper instance if any
    }
    cropper = new Cropper(cropperImage, {
        aspectRatio: 1,
        viewMode: 1,
        background: false
    });
}

// Close modal
closeModal.addEventListener('click', function () {
    imageModal.style.display = 'none';
    if (cropper) {
        cropper.destroy();
    }
});

// Crop and save image
cropButton.addEventListener('click', function () {
    const croppedCanvas = cropper.getCroppedCanvas();
    const croppedImageDataUrl = croppedCanvas.toDataURL('image/png');
    profileImage.src = croppedImageDataUrl;
    imageModal.style.display = 'none';
    if (cropper) {
        cropper.destroy();
    }
});

// Reopen cropper when clicking the "Adjust Image" button
adjustImageBtn.addEventListener('click', function () {
    if (profileImage.src) {
        cropperImage.src = profileImage.src; // Load current image into the cropper
        imageModal.style.display = 'block';  // Show modal
        initializeCropper();  // Initialize cropper again for re-cropping
    } else {
        alert("Please upload an image first.");
    }
});

// Function to download badge as an image
function downloadBadge() {
    const badge = document.querySelector('.badge-preview');

    // Ensure the canvas properly captures the badge element
    html2canvas(badge, { backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'badge.png'; // File name for the download
        link.href = canvas.toDataURL('image/png'); // Convert canvas to image
        link.click(); // Simulate click to trigger download
    });
}

// Add event listener for download button
downloadBadgeBtn.addEventListener('click', function () {
    if (profileImage.src && nameInput.value) {
        downloadBadge();
    } else {
        alert('Please upload an image and enter your name before downloading the badge.');
    }
});
// LinkedIn share button
linkedinShareBtn.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior

    // Pre-filled message text
    const postText = encodeURIComponent("I am happy to share that I’ve earned a digital badge from the International Hackathon Community!");

    // Get the badge image URL (this should be a publicly accessible URL)
    const badgeImageUrl = encodeURIComponent("http://127.0.0.1:5500/index.html"); // Change this to your actual badge image URL

    // Build LinkedIn share URL
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&shareUrl=${badgeImageUrl}&text=${postText}`;

    // Open LinkedIn share page
    window.open(linkedInUrl, '_blank');
});

// WhatsApp share button
whatsappShareBtn.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior

    // Get the badge image URL
    const badgeImageUrl = profileImage.src; // Use the profile image source

    // Construct the WhatsApp share link
    const message = "I am happy to share that I’ve earned a digital badge! Here's my badge: " + badgeImageUrl;
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    // Prompt user to download the image and then share manually
    alert("Please download the badge image first, then open WhatsApp and share the image along with your message.");

    // Open the WhatsApp share link in a new tab
    window.open(whatsappLink, '_blank');
});

