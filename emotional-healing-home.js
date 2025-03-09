let selectedEmoji = '📝';

function openEmotionDialog() {
    document.getElementById('emotionDialog').classList.remove('hidden');
}

function closeEmotionDialog() {
    document.getElementById('emotionDialog').classList.add('hidden');
}

function selectEmoji(emoji) {
    selectedEmoji = emoji;
    document.querySelectorAll('.emoji-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function saveEmotion() {
    const mood = document.getElementById('moodInput').value.trim();
    if (!mood) {
        document.getElementById('moodInput').classList.add('error');
        return;
    }
    document.getElementById('todayEmoji').textContent = selectedEmoji;
    document.getElementById('todayMood').textContent = mood;
    closeEmotionDialog();
    document.getElementById('moodInput').value = '';
    document.getElementById('moodInput').classList.remove('error');
}

function openMoreEmojis() {
    document.getElementById('moreEmojisContainer').classList.toggle('hidden');
}

const mockData = {
    user: {
        name: 'Emma',
        avatar: 'emma.jpg'
    },
    emotions: [
        { date: 'March 9', emoji: '📝', mood: 'Add Today\'s Mood' },
        { date: 'March 8', emoji: '😊', mood: 'Peaceful' },
        { date: 'March 7', emoji: '😔', mood: 'Reflective' }
    ]
};

// Function to update emotion card dates
function updateEmotionDates() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    // Format: "March 9"
    const formatDate = (date) => `${monthNames[date.getMonth()]} ${date.getDate()}`;
    
    document.getElementById('todayDate').textContent = formatDate(today);
    document.getElementById('yesterdayDate').textContent = formatDate(yesterday);
    document.getElementById('twoDaysAgoDate').textContent = formatDate(twoDaysAgo);
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Make sure dialog is hidden on page load
    document.getElementById('emotionDialog').classList.add('hidden');
    
    updateEmotionDates();
    
    document.getElementById('moodInput').addEventListener('input', function () {
        this.classList.remove('error');
    });
    
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function () {
            const buttonText = this.querySelector('span')?.textContent?.trim();
            if (buttonText && !this.classList.contains('emoji-button') && 
                !this.classList.contains('more-button') && 
                !this.classList.contains('cancel-button') && 
                !this.classList.contains('save-button')) {
                const dialog = document.createElement('div');
                dialog.className = 'generic-dialog';
                dialog.innerHTML = `
                    <div class="dialog-content">
                        <h3>Starting ${buttonText}</h3>
                        <p>Please wait while we prepare your experience...</p>
                        <button class="close-button">Close</button>
                    </div>
                `;
                document.body.appendChild(dialog);
                dialog.querySelector('button').onclick = () => dialog.remove();
            }
        });
    });
}); 