const switchToColor = (color, jsConfetti) => {
    try {

        // Skip avatar SVG modification as it's not an SVG
        // Just handle the confetti and highlighting

        if (color === "saffron") {
            if (jsConfetti) {
                setTimeout(() => {
                    jsConfetti.addConfetti({
                        emojis: ['🍂', '🍁', '🌻'],
                    });
                }, 300);
            } else {
                console.error("jsConfetti is not available");
            }

            document.querySelectorAll(".highlighted").forEach(highlighted => {
                highlighted.style.backgroundColor = "#FF993333"; // CC is 80% opacity in hex
            });
            // Change the page border color
            document.querySelectorAll(".page").forEach(page => {
                page.style.borderColor = "#FF9933";
            });
        } else if (color === "erin") {
            if (jsConfetti) {
                setTimeout(() => {
                    jsConfetti.addConfetti({
                        emojis: ['🐸'],
                    });
                }, 300);
            } else {
                console.error("jsConfetti is not available");
            }

            document.querySelectorAll(".highlighted").forEach(highlighted => {
                highlighted.style.backgroundColor = "#00FF4033";
            });
            // Change the page border color
            document.querySelectorAll(".page").forEach(page => {
                page.style.borderColor = "#00FF40";
            });
        }

    } catch (e) {
        console.error("Error in switchToColor:", e);
    }
};

const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js');
        } catch (err) {
            console.error('ServiceWorker registration failed:', err);
        }
    }
};

function playMasya() {
    console.log('playMasya function called directly');

    try {
        var audioPath = './assets/sounds/masya.mp3';
        var audio = new Audio(audioPath);

        // Add visual feedback
        var button = document.getElementById('masya-audio');
        if (button) button.classList.add('playing');

        // Play the audio
        audio.play();

        // Remove visual feedback when done
        audio.onended = function () {
            if (button) button.classList.remove('playing');
        };
    } catch (e) {
        console.error('Error playing audio:', e);
    }
}

// Global jsConfetti instance to be used across the site
let jsConfetti;

// Initialize JSConfetti as soon as possible
try {
    if (typeof JSConfetti === 'function') {
        jsConfetti = new JSConfetti();
        console.log("JSConfetti initialized early");
    }
} catch (e) {
    console.error("Early JSConfetti initialization error:", e);
}

// Attempt to initialize JSConfetti when window loads if it wasn't set up initially
window.addEventListener('load', () => {
    console.log("Window load event fired");
    if (!jsConfetti && typeof JSConfetti === 'function') {
        jsConfetti = new JSConfetti();
        console.log("JSConfetti initialized on window load");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired");
    
    // Try again to initialize JSConfetti if it hasn't been done already
    if (!jsConfetti) {
        try {
            if (typeof JSConfetti === 'function') {
                jsConfetti = new JSConfetti();
                console.log("JSConfetti initialized in DOMContentLoaded");
            } else {
                console.error("JSConfetti is not defined in DOMContentLoaded. Make sure the library is loaded correctly.");
            }
        } catch (e) {
            console.error("Error initializing JSConfetti in DOMContentLoaded:", e);
        }
    }
    
    // Add click event listeners with the jsConfetti instance
    const saffronButton = document.getElementById("saffron");
    const erinButton = document.getElementById("erin");
    
    if (saffronButton) {
        saffronButton.addEventListener("click", () => {
            console.log("Saffron button clicked");
            switchToColor("saffron", jsConfetti);
        });
    } else {
        console.error("Saffron button not found");
    }
    
    if (erinButton) {
        erinButton.addEventListener("click", () => {
            console.log("Erin button clicked");
            switchToColor("erin", jsConfetti);
        });
    } else {
        console.error("Erin button not found");
    }

    var audioButton = document.getElementById('masya-audio');
    if (audioButton) {
        audioButton.addEventListener('click', function () {
            console.log('Audio button clicked');
            playMasya();
        });
    }


    // Register the click handler for the THE OFFICE tag
    var officeTag = document.getElementById("office-tag");
    if (officeTag) {
        officeTag.addEventListener("click", function () {
            console.log("Office tag clicked (early script)");
            var popup = document.getElementById("office-popup");
            var overlay = document.getElementById("office-overlay");
            popup.style.display = "block";
            overlay.style.display = "block";
        });
    }

    // Register the close button handler
    var closeBtn = document.getElementById("office-popup-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            document.getElementById("office-popup").style.display = "none";
            document.getElementById("office-overlay").style.display = "none";
        });
    }

    // Register the overlay click handler
    var overlay = document.getElementById("office-overlay");
    if (overlay) {
        overlay.addEventListener("click", function () {
            document.getElementById("office-popup").style.display = "none";
            this.style.display = "none";
        });
    }
    
    registerServiceWorker();
});
