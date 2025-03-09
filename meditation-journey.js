// Global variables
let breathingStatus = 'inhale';
let sessionStarted = false;
let sessionTimer = null;
let sessionDuration = 0;
let isPaused = false;
let sessionRating = 0;

// Get parameters from URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        primaryMood: params.get('primaryMood'),
        secondaryMoods: params.get('secondaryMoods') ? params.get('secondaryMoods').split(',') : [],
        scene: params.get('scene'),
        sceneImageUrl: params.get('sceneImageUrl'),
        thoughts: params.get('thoughts')
    };
}

// Initialize the meditation journey
function initMeditationJourney() {
    const params = getUrlParams();
    
    // Set scene image if provided
    if (params.sceneImageUrl) {
        document.getElementById('sceneImage').src = params.sceneImageUrl;
    }
    
    // Start session automatically
    startSession();
}

// Start the meditation session
function startSession() {
    if (sessionStarted) return;
    
    sessionStarted = true;
    sessionDuration = 0;
    
    // Start breathing animation
    updateBreathingStatus();
    
    // Start session timer
    sessionTimer = setInterval(() => {
        if (!isPaused) {
            sessionDuration++;
            document.getElementById('sessionDuration').textContent = formatTime(sessionDuration);
            
            // Update progress circle
            const progressCircle = document.getElementById('progressCircle');
            if (progressCircle) {
                const progress = (sessionDuration / 60) * 10; // 10% progress per minute
                progressCircle.style.strokeDashoffset = 339.292 * (progress / 100);
            }
        }
    }, 1000);
}

// Toggle play/pause
function togglePlayPause() {
    isPaused = !isPaused;
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (isPaused) {
        playPauseBtn.innerHTML = '<i class="ri-play-fill text-2xl"></i>';
    } else {
        playPauseBtn.innerHTML = '<i class="ri-pause-fill text-2xl"></i>';
        updateBreathingStatus();
    }
}

// Update breathing status
function updateBreathingStatus() {
    if (!sessionStarted || isPaused) return;
    
    if (breathingStatus === 'inhale') {
        breathingStatus = 'hold';
        document.getElementById('breathingText').textContent = 'Hold';
        setTimeout(updateBreathingStatus, 4000);
    } else if (breathingStatus === 'hold') {
        breathingStatus = 'exhale';
        document.getElementById('breathingText').textContent = 'Exhale';
        setTimeout(updateBreathingStatus, 4000);
    } else {
        breathingStatus = 'inhale';
        document.getElementById('breathingText').textContent = 'Inhale';
        setTimeout(updateBreathingStatus, 4000);
    }
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Show end session dialog
function showEndDialog() {
    document.getElementById('endSessionDialog').classList.remove('hidden');
}

// Close end session dialog
function closeEndDialog() {
    document.getElementById('endSessionDialog').classList.add('hidden');
}

// End meditation session
function endSession() {
    clearInterval(sessionTimer);
    document.getElementById('endSessionDialog').classList.add('hidden');
    document.getElementById('completionDialog').classList.remove('hidden');
}

// Rate session
function rateSession(rating) {
    sessionRating = rating;
    
    // Highlight selected stars
    const stars = document.querySelectorAll('#completionDialog .flex.gap-2 button');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('text-yellow-400');
        } else {
            star.classList.remove('text-yellow-400');
        }
    });
}

// Save insights and return to home
function saveInsights() {
    const reflection = document.getElementById('reflectionText').value;
    
    // Here you would typically save the insights to a database or local storage
    console.log('Session rating:', sessionRating);
    console.log('Reflection:', reflection);
    
    // Redirect to home page
    window.location.href = 'Emotional Healing Home.html';
}

// Start painting activity after meditation
function startPainting() {
    // Get the session data to pass to the painting page
    const reflection = document.getElementById('reflectionText').value;
    
    // Build URL with parameters
    const params = new URLSearchParams();
    params.append('rating', sessionRating);
    params.append('reflection', reflection);
    
    // Redirect to painting page
    window.location.href = 'Post-Meditation Painting Page.html?' + params.toString();
}

// Restart session
function restartSession() {
    clearInterval(sessionTimer);
    sessionStarted = false;
    sessionDuration = 0;
    isPaused = false;
    breathingStatus = 'inhale';
    
    document.getElementById('breathingText').textContent = 'Inhale';
    document.getElementById('playPauseBtn').innerHTML = '<i class="ri-pause-fill text-2xl"></i>';
    
    // Reset progress circle
    const progressCircle = document.getElementById('progressCircle');
    if (progressCircle) {
        progressCircle.style.strokeDashoffset = 0;
    }
    
    // Start session again
    startSession();
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initMeditationJourney();
}); 