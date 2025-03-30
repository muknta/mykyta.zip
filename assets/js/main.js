// Function to track language selection
function trackLanguageSelection(language) {
    gtag('event', 'language_selection', {
        'language': language
    });
}

// Function to track color switch
function trackSwitchColor(color) {
    gtag('event', 'switch_color', {
        'color': color
    });
}

const switchToColor = (color, jsConfetti) => {
    try {
        trackSwitchColor(color);

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

    // Get the current URL path
    const path = window.location.pathname;
    // Determine language based on URL
    const language = path.includes('/uk-ua') ? 'uk-UA' : 'en-US';
    trackLanguageSelection(language);
    
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

    // Calculate period durations
    const periodElements = document.querySelectorAll('.period');
    
    periodElements.forEach(function(element) {
        const dateText = element.previousElementSibling.innerText;
        const isUkrainian = dateText.match(/[а-яА-ЯіІїЇєЄ]/) !== null;
        const dates = parseDateRange(dateText);
        
        if (dates) {
            const duration = calculateDuration(dates.startDate, dates.endDate);
            element.textContent = formatDuration(duration, isUkrainian);
        }
    });
    
    function parseDateRange(dateText) {
        // Extract dates from format like:
        // "February 2024 – present" or 
        // "February 2021 – August 2021" or
        // "July 2022 – 2024" (just year for end date)
        const dateRegex = /([A-Za-zа-яА-ЯіІїЇєЄ]+)\s+(\d{4})\s+[–-]\s+(?:([A-Za-zа-яА-ЯіІїЇєЄ]+)\s+(\d{4})|(\d{4})|present|дотепер)/;
        const matches = dateText.match(dateRegex);
        
        if (!matches) return null;
        
        const startMonth = getMonthNumber(matches[1]);
        const startYear = parseInt(matches[2]);
        
        let endMonth, endYear;
        
        if (matches[3] && matches[4]) {
            // Full end date is specified (Month Year)
            endMonth = getMonthNumber(matches[3]);
            endYear = parseInt(matches[4]);
        } else if (matches[5]) {
            // Only year is specified for end date
            endMonth = 11; // December
            endYear = parseInt(matches[5]);
        } else {
            // "present" is used - use current date
            const now = new Date();
            endMonth = now.getMonth();
            endYear = now.getFullYear();
        }
        
        return {
            startDate: new Date(startYear, startMonth, 1),
            endDate: new Date(endYear, endMonth, 1)
        };
    }
    
    function getMonthNumber(monthName) {
        const months = {
            'january': 0,
            'february': 1,
            'march': 2,
            'april': 3,
            'may': 4,
            'june': 5,
            'july': 6,
            'august': 7,
            'september': 8,
            'october': 9,
            'november': 10,
            'december': 11,
            'січень': 0,
            'лютий': 1,
            'березень': 2,
            'квітень': 3,
            'травень': 4,
            'червень': 5,
            'липень': 6,
            'серпень': 7,
            'вересень': 8,
            'жовтень': 9,
            'листопад': 10,
            'грудень': 11,
        };
        
        return months[monthName.toLowerCase()];
    }
    
    function calculateDuration(startDate, endDate) {
        const yearDiff = endDate.getFullYear() - startDate.getFullYear();
        const monthDiff = endDate.getMonth() - startDate.getMonth();
        
        const totalMonths = yearDiff * 12 + monthDiff + 1;
        
        return {
            years: Math.floor(totalMonths / 12),
            months: totalMonths % 12
        };
    }
    
    function formatDuration(duration, isUkrainian) {
        if (duration.years === 0) {
            return isUkrainian ? `${duration.months} ${duration.months === 1 ? 'місяць' : duration.months === 2 || duration.months === 3 || duration.months === 4 ? 'місяці' : 'місяців'}` : `${duration.months} month${duration.months !== 1 ? 's' : ''}`;
        } else if (duration.months === 0) {
            return isUkrainian ? `${duration.years} ${duration.years === 1 ? 'рік' : duration.years === 2 || duration.years === 3 || duration.years === 4 ? 'роки' : 'років'}` : `${duration.years} year${duration.years !== 1 ? 's' : ''}`;
        } else {
            return isUkrainian ? `${duration.years} ${duration.years === 1 ? 'рік' : duration.years === 2 || duration.years === 3 || duration.years === 4 ? 'роки' : 'років'} ${duration.months} ${duration.months === 1 ? 'місяць' : duration.months === 2 || duration.months === 3 || duration.months === 4 ? 'місяці' : 'місяців'}` : `${duration.years} year${duration.years !== 1 ? 's' : ''} ${duration.months} month${duration.months !== 1 ? 's' : ''}`;
        }
    }
});
