// Add this at the very top of your file for immediate execution
(function() {
    // Hide the upload dialog immediately
    const uploadDialog = document.getElementById('uploadDialog');
    if (uploadDialog) {
        uploadDialog.classList.add('hidden');
        uploadDialog.style.display = 'none';
    }
})();

// Global variables
let selectedPrimaryMood = null;
let selectedSecondaryMoods = []; // Changed to array for multiple selections
let selectedScene = null;
let breathingStatus = 'inhale';
let sessionStarted = false;
let sessionTimer = null;
let sessionDuration = 0;
let isPaused = false;

// Function to handle mood selection
function selectMood(mood, isPrimary = false) {
    if (isPrimary) {
        // Primary mood selection (single selection)
        selectedPrimaryMood = mood;
        document.querySelectorAll('.primary-mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        document.getElementById('secondaryEmotions').classList.remove('hidden');
        document.getElementById('sceneSection').classList.remove('hidden');
    } else {
        // Secondary mood selection (multiple selection)
        const button = event.currentTarget;
        
        // Toggle selection
        if (button.classList.contains('selected')) {
            // If already selected, deselect it
            button.classList.remove('selected');
            selectedSecondaryMoods = selectedSecondaryMoods.filter(m => m !== mood);
        } else {
            // If not selected, select it
            button.classList.add('selected');
            selectedSecondaryMoods.push(mood);
        }
    }
}

// Function to handle scene selection
function selectScene(scene) {
    selectedScene = scene;
    document.querySelectorAll('.scene-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

// Function to handle scene scroll
document.addEventListener('DOMContentLoaded', function() {
    const sceneScroll = document.getElementById('sceneScroll');
    const scrollBar = document.getElementById('sceneScrollBar');
    
    if (sceneScroll && scrollBar) {
        scrollBar.addEventListener('input', function() {
            const scrollPercentage = this.value;
            const maxScroll = sceneScroll.scrollWidth - sceneScroll.clientWidth;
            sceneScroll.scrollLeft = (maxScroll * scrollPercentage) / 100;
        });
        
        sceneScroll.addEventListener('scroll', function() {
            const maxScroll = this.scrollWidth - this.clientWidth;
            const scrollPercentage = (this.scrollLeft / maxScroll) * 100;
            scrollBar.value = scrollPercentage;
        });
    }
});

// Voice input functionality
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        showToast('Voice recognition not supported in your browser');
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = function() {
        showToast('Listening...');
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('userThoughts').value += transcript;
    };
    
    recognition.onerror = function(event) {
        showToast('Error occurred in recognition: ' + event.error);
    };
    
    recognition.onend = function() {
        showToast('Voice input ended');
    };
    
    recognition.start();
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Start the meditation journey
function startMeditationJourney() {
    if (!selectedPrimaryMood || !selectedScene) {
        showToast('Please select both primary mood and scene first');
        return;
    }
    
    const thoughts = document.getElementById('userThoughts').value;
    if (!thoughts.trim()) {
        showToast('Please share your thoughts');
        return;
    }
    
    // Get the selected scene image URL
    let sceneImageUrl = '';
    const selectedSceneElement = document.querySelector('.scene-btn.selected img');
    if (selectedSceneElement) {
        sceneImageUrl = selectedSceneElement.src;
    }
    
    // Build URL with parameters
    const params = new URLSearchParams();
    params.append('primaryMood', selectedPrimaryMood);
    if (selectedSecondaryMoods.length > 0) {
        params.append('secondaryMoods', selectedSecondaryMoods.join(','));
    }
    params.append('scene', selectedScene);
    params.append('sceneImageUrl', sceneImageUrl);
    params.append('thoughts', thoughts);
    
    // Redirect to meditation journey page
    window.location.href = 'meditation-journey.html?' + params.toString();
}

function closeMeditationJourney() {
    document.querySelector('.fixed.inset-0.bg-white.z-50').remove();
}

function skipSection() {
    showToast('Skipping to next section...');
    setTimeout(goToPainting, 1000);
}

function goToPainting() {
    window.location.href = 'Post-Meditation Painting Page.html';
}

// Functions for the breathing exercise
function startSession() {
    if (sessionStarted) return;
    
    sessionStarted = true;
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('controlButtons').classList.remove('hidden');
    
    updateBreathingStatus();
    
    sessionTimer = setInterval(() => {
        if (!isPaused) {
            sessionDuration++;
            document.getElementById('sessionTime').textContent = formatTime(sessionDuration);
        }
    }, 1000);
}

function pauseSession() {
    isPaused = true;
    document.getElementById('pauseButton').classList.add('hidden');
    document.getElementById('resumeButton').classList.remove('hidden');
}

function resumeSession() {
    isPaused = false;
    document.getElementById('resumeButton').classList.add('hidden');
    document.getElementById('pauseButton').classList.remove('hidden');
}

function endSession() {
    document.getElementById('endSessionDialog').classList.remove('hidden');
}

function confirmEndSession() {
    clearInterval(sessionTimer);
    sessionStarted = false;
    document.getElementById('endSessionDialog').classList.add('hidden');
    document.getElementById('completionDialog').classList.remove('hidden');
}

function cancelEndSession() {
    document.getElementById('endSessionDialog').classList.add('hidden');
}

function closeCompletionDialog() {
    document.getElementById('completionDialog').classList.add('hidden');
    resetSession();
}

function resetSession() {
    clearInterval(sessionTimer);
    sessionStarted = false;
    sessionDuration = 0;
    isPaused = false;
    breathingStatus = 'inhale';
    
    document.getElementById('sessionTime').textContent = '00:00';
    document.getElementById('breathingText').textContent = 'Inhale';
    document.getElementById('startButton').classList.remove('hidden');
    document.getElementById('controlButtons').classList.add('hidden');
    document.getElementById('pauseButton').classList.remove('hidden');
    document.getElementById('resumeButton').classList.add('hidden');
}

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

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function restartSession() {
    resetSession();
    startSession();
}

// Scene upload functionality
function showUploadDialog() {
    document.getElementById('uploadDialog').classList.remove('hidden');
    document.getElementById('uploadDialog').style.display = 'flex';
}

function closeUploadDialog() {
    document.getElementById('uploadDialog').classList.add('hidden');
    document.getElementById('uploadDialog').style.display = 'none';
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover rounded-xl">`;
        }
        reader.readAsDataURL(file);
    }
}

function addCustomScene() {
    const sceneName = document.getElementById('customSceneName').value.trim();
    const imageInput = document.getElementById('customSceneImage');
    
    if (!sceneName) {
        showToast('Please enter a scene name');
        return;
    }
    
    if (!imageInput.files || imageInput.files.length === 0) {
        showToast('Please select an image');
        return;
    }
    
    const file = imageInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const sceneScroll = document.getElementById('sceneScroll');
        
        const customSceneId = 'custom-' + Date.now();
        
        const newScene = document.createElement('button');
        newScene.className = 'scene-btn relative w-[160px] h-32 rounded-xl overflow-hidden flex-shrink-0';
        newScene.setAttribute('onclick', `selectScene('${customSceneId}')`);
        newScene.innerHTML = `
            <img src="${e.target.result}" class="absolute inset-0 w-full h-full object-cover" />
            <span class="absolute bottom-2 left-2 text-white text-shadow">${sceneName}</span>
        `;
        
        sceneScroll.appendChild(newScene);
        
        closeUploadDialog();
        
        document.getElementById('customSceneName').value = '';
        document.getElementById('imagePreview').innerHTML = `
            <div class="text-center text-gray-500">
                <i class="ri-image-add-line text-2xl mb-2"></i>
                <div class="text-sm">Click to upload image</div>
            </div>
        `;
        imageInput.value = '';
        
        showToast('Custom scene added successfully');
    };
    
    reader.readAsDataURL(file);
}

// Event listeners to be added after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // These event listeners are for elements that might not exist when the script loads
    const sceneFileInput = document.getElementById('sceneFile');
    if (sceneFileInput) {
        sceneFileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                document.getElementById('fileLabel').textContent = this.files[0].name;
            }
        });
    }
    
    // Make sure upload dialog is hidden
    const uploadDialog = document.getElementById('uploadDialog');
    if (uploadDialog) {
        uploadDialog.classList.add('hidden');
    }
}); 