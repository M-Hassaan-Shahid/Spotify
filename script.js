let songIndex = 0;
let audioElement = new Audio("songs/1.mp3");
let masterPlay = document.getElementById("play");
let myProgressBar = document.getElementById("myProgressBar");
let gif = document.getElementById("gif");
let songItems = Array.from(document.getElementsByClassName("songItem"));
let masterSongName = document.getElementById("masterSong");

// New elements
let currentTimeElement = document.getElementById("currentTime");
let totalTimeElement = document.getElementById("totalTime");
let volumeSlider = document.getElementById("volumeSlider");
let volumeIcon = document.getElementById("volumeIcon");
let shuffleButton = document.getElementById("shuffle");
let repeatButton = document.getElementById("repeat");
let likeButton = document.getElementById("likeButton");

// Player state
let isShuffled = false;
let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
let originalPlaylist = [...Array.from({ length: 10 }, (_, i) => i)];
let shuffledPlaylist = [...originalPlaylist];
let currentPlaylist = originalPlaylist;
let likedSongs = new Set();

// Initialize volume
audioElement.volume = 0.5;
console.log('Initial audio volume:', audioElement.volume);
// Enhanced songs array with artist info
let songs = [
    { songName: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2", filePath: "songs/1.mp3", coverPath: "covers/1.jpeg", duration: 386 },
    { songName: "Ghagra", artist: "Rekha Bhardwaj", album: "Yeh Jawaani Hai Deewani", filePath: "songs/2.mp3", coverPath: "covers/2.jpg", duration: 300 },
    { songName: "Kal Ho Naa Ho", artist: "Sonu Nigam", album: "Kal Ho Naa Ho", filePath: "songs/3.mp3", coverPath: "covers/3.jpeg", duration: 335 },
    { songName: "Kabira", artist: "Tochi Raina", album: "Yeh Jawaani Hai Deewani", filePath: "songs/4.mp3", coverPath: "covers/4.jpeg", duration: 208 },
    { songName: "Galliyan", artist: "Ankit Tiwari", album: "Ek Villain", filePath: "songs/5.mp3", coverPath: "covers/5.jpg", duration: 307 },
    { songName: "Pehla Nasha", artist: "Udit Narayan", album: "Jo Jeeta Wohi Sikandar", filePath: "songs/6.mp3", coverPath: "covers/6.jpg", duration: 362 },
    { songName: "Tum Se Hi", artist: "Mohit Chauhan", album: "Jab We Met", filePath: "songs/7.mp3", coverPath: "covers/7.jpeg", duration: 331 },
    { songName: "Dil To Pagal Hai", artist: "Lata Mangeshkar", album: "Dil To Pagal Hai", filePath: "songs/8.mp3", coverPath: "covers/8.jpg", duration: 353 },
    { songName: "Zindagi Na Milegi Dobara", artist: "Farhan Akhtar", album: "ZNMD", filePath: "songs/9.mp3", coverPath: "covers/9.jpeg", duration: 251 },
    { songName: "Main Hoon Na", artist: "Sonu Nigam", album: "Main Hoon Na", filePath: "songs/10.mp3", coverPath: "covers/10.jpg", duration: 357 }
];
// Utility functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateAllTimeText() {
    songItems.forEach((element, i) => {
        if (element.getElementsByClassName("time")[0]) {
            element.getElementsByClassName("time")[0].innerText = formatTime(songs[i].duration);
        }
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function updateCurrentSong() {
    masterSongName.innerText = songs[songIndex].songName;
    document.getElementById("artistName").innerText = songs[songIndex].artist;
    totalTimeElement.innerText = formatTime(songs[songIndex].duration);

    // Update queue display
    updateQueueDisplay();

    // Update page title
    document.title = `${songs[songIndex].songName} - ${songs[songIndex].artist} | Spotify`;
}
songItems.forEach((element, i) => {
    updateAllTimeText();
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

let removeAllPlaying = () => {
    songItems.forEach((element) => {
        element.classList.remove("playing");
    });
};
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove("fa-play-circle");
        masterPlay.classList.add("fa-pause-circle");
        gif.style.opacity = 1;
        removeAllPlaying();
        songItems[songIndex].classList.add("playing");
        songItems[songIndex].getElementsByTagName("img")[0].classList.add("rotating");

        // Update the current song item play button
        const currentSongPlayButton = songItems[songIndex].querySelector('.songItemPlay');
        if (currentSongPlayButton) {
            currentSongPlayButton.classList.remove("fa-play-circle");
            currentSongPlayButton.classList.add("fa-pause-circle");
        }
    } else {
        audioElement.pause();
        masterPlay.classList.remove("fa-pause-circle");
        masterPlay.classList.add("fa-play-circle");
        gif.style.opacity = 0;
        removeAllPlaying();
        songItems[songIndex].getElementsByTagName("img")[0].classList.remove("rotating");

        // Update all song item play buttons to play state
        makeAllPlays();

        // Update liked songs display
        updateLikedSongsDisplay();
    }
})
document.getElementById("reloadButton").addEventListener("click", function () {
    location.reload(); // or location.reload(true) for force reload
});
audioElement.addEventListener('timeupdate', () => {
    // Update seek bar
    progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;

    // Update time display
    currentTimeElement.innerText = formatTime(audioElement.currentTime);

    // Update progress bar color
    const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
    myProgressBar.style.background = `linear-gradient(to right, var(--primary-green) 0%, var(--primary-green) ${progressPercent}%, var(--border-color) ${progressPercent}%, var(--border-color) 100%)`;
})

// Auto-play next song when current ends
audioElement.addEventListener('ended', () => {
    if (repeatMode === 2) {
        // Repeat current song
        audioElement.currentTime = 0;
        audioElement.play();
    } else {
        // Play next song
        playNext();
    }
    // Update liked songs display
    updateLikedSongsDisplay();
})
myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
})
let makeAllPlays = () => {
    Array.from(document.getElementsByClassName("songItemPlay")).forEach((element) => {
        element.classList.remove("fa-pause-circle");
        element.classList.add("fa-play-circle");
    })
}

// Song item play button event listeners
document.querySelectorAll(".songItemPlay").forEach((element) => {
    element.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the song item click
        const clickedIndex = parseInt(e.target.id);

        if (clickedIndex !== songIndex || audioElement.paused) {
            // Play new song or resume paused song
            playSong(clickedIndex);
            e.target.classList.remove("fa-play-circle");
            e.target.classList.add("fa-pause-circle");
        } else {
            // Pause current song
            audioElement.pause();
            e.target.classList.remove("fa-pause-circle");
            e.target.classList.add("fa-play-circle");
            masterPlay.classList.remove("fa-pause-circle");
            masterPlay.classList.add("fa-play-circle");
            gif.style.opacity = 0;
            removeAllPlaying();
            songItems[songIndex].getElementsByTagName("img")[0].classList.remove("rotating");
        }
    });
});

// Song item click-to-play functionality
document.querySelectorAll(".songItem").forEach((element) => {
    element.addEventListener('click', (e) => {
        // Don't trigger if clicking on play button or like button
        if (e.target.classList.contains('songItemPlay') || e.target.classList.contains('song-like-btn')) {
            return;
        }

        const clickedIndex = parseInt(element.dataset.index);
        playSong(clickedIndex);
    });
});

// Song like button event listeners
document.querySelectorAll(".song-like-btn").forEach((element) => {
    element.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the song item click
        const clickedIndex = parseInt(e.target.dataset.index);

        if (likedSongs.has(clickedIndex)) {
            likedSongs.delete(clickedIndex);
            e.target.classList.remove("fa-solid", "liked");
            e.target.classList.add("fa-regular");
            e.target.title = "Like";
            showNotification('Removed from liked songs');
        } else {
            likedSongs.add(clickedIndex);
            e.target.classList.remove("fa-regular");
            e.target.classList.add("fa-solid", "liked");
            e.target.title = "Unlike";
            showNotification('Added to liked songs');
        }

        updateLikedSongsDisplay();
        updateLikeButton(); // Update the main like button if current song
    });
});
function playNext() {
    const currentPlaylistIndex = currentPlaylist.indexOf(songIndex);
    let nextIndex;

    if (repeatMode === 1 && currentPlaylistIndex === currentPlaylist.length - 1) {
        // Repeat all - go to first song
        nextIndex = currentPlaylist[0];
    } else if (currentPlaylistIndex < currentPlaylist.length - 1) {
        nextIndex = currentPlaylist[currentPlaylistIndex + 1];
    } else {
        nextIndex = currentPlaylist[0];
    }

    playSong(nextIndex);
}

function playPrevious() {
    const currentPlaylistIndex = currentPlaylist.indexOf(songIndex);
    let prevIndex;

    if (currentPlaylistIndex > 0) {
        prevIndex = currentPlaylist[currentPlaylistIndex - 1];
    } else {
        prevIndex = currentPlaylist[currentPlaylist.length - 1];
    }

    playSong(prevIndex);
}

function playSong(index) {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    updateCurrentSong();
    audioElement.currentTime = 0;

    audioElement.play().then(() => {
        // Update play button icon
        masterPlay.classList.remove("fa-play-circle");
        masterPlay.classList.add("fa-pause-circle");
        gif.style.opacity = 1;

        // Update song list - reset all to play icons first
        makeAllPlays();
        removeAllPlaying();

        // Set current song to playing state
        songItems[songIndex].classList.add("playing");

        // Update the specific song item play button to pause icon
        const currentSongPlayButton = songItems[songIndex].querySelector('.songItemPlay');
        if (currentSongPlayButton) {
            currentSongPlayButton.classList.remove("fa-play-circle");
            currentSongPlayButton.classList.add("fa-pause-circle");
        }

        // Update rotating images
        songItems.forEach((item) => {
            item.getElementsByTagName("img")[0].classList.remove("rotating");
        });
        songItems[songIndex].getElementsByTagName("img")[0].classList.add("rotating");

        // Update like button
        updateLikeButton();

        // Update all like buttons
        updateAllLikeButtons();

        // Update liked songs display if visible
        updateLikedSongsDisplay();
    }).catch(error => {
        console.log("Playback failed:", error);
        showNotification("Playback failed. Please try again.");
    });
}

document.getElementById("next").addEventListener('click', playNext);
document.getElementById("previous").addEventListener('click', playPrevious);

// Volume Control
if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        audioElement.volume = volume;
        updateVolumeIcon();
        updateVolumeSliderBackground();

        // Show volume notification
        if (volume === 0) {
            showNotification('Muted');
        } else {
            showNotification(`Volume: ${Math.round(volume * 100)}%`);
        }
    });

    // Also listen for change event
    volumeSlider.addEventListener('change', (e) => {
        const volume = e.target.value / 100;
        audioElement.volume = volume;
        updateVolumeIcon();
        updateVolumeSliderBackground();
    });
}

function updateVolumeIcon() {
    if (!volumeIcon) return;
    const volume = audioElement.volume;
    if (volume === 0) {
        volumeIcon.className = "fa-solid fa-volume-xmark";
    } else if (volume < 0.5) {
        volumeIcon.className = "fa-solid fa-volume-low";
    } else {
        volumeIcon.className = "fa-solid fa-volume-high";
    }
}

function updateVolumeSliderBackground() {
    if (!volumeSlider) return;
    const value = volumeSlider.value;
    volumeSlider.style.background = `linear-gradient(to right, var(--primary-green) 0%, var(--primary-green) ${value}%, var(--border-color) ${value}%, var(--border-color) 100%)`;
}

if (volumeIcon) {
    volumeIcon.addEventListener('click', () => {
        if (audioElement.volume > 0) {
            // Store current volume before muting
            volumeIcon.dataset.previousVolume = audioElement.volume;
            audioElement.volume = 0;
            if (volumeSlider) volumeSlider.value = 0;
            showNotification('Muted');
        } else {
            // Restore previous volume or default to 0.5
            const previousVolume = volumeIcon.dataset.previousVolume || 0.5;
            audioElement.volume = previousVolume;
            if (volumeSlider) volumeSlider.value = previousVolume * 100;
            showNotification(`Volume: ${Math.round(previousVolume * 100)}%`);
        }
        updateVolumeIcon();
        updateVolumeSliderBackground();
    });
}

// Shuffle Control
shuffleButton.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleButton.classList.toggle('active', isShuffled);

    if (isShuffled) {
        shuffledPlaylist = shuffleArray(originalPlaylist);
        currentPlaylist = shuffledPlaylist;
    } else {
        currentPlaylist = originalPlaylist;
    }

    showNotification(isShuffled ? 'Shuffle on' : 'Shuffle off');
});

// Repeat Control
if (repeatButton) {
    repeatButton.addEventListener('click', () => {
        repeatMode = (repeatMode + 1) % 3;

        // Remove all classes first
        repeatButton.classList.remove('active');
        repeatButton.className = repeatButton.className.replace(/fa-repeat(-1)?/g, '');

        switch (repeatMode) {
            case 0:
                repeatButton.className = "fa-solid fa-repeat";
                showNotification('Repeat off');
                break;
            case 1:
                repeatButton.classList.add('active');
                repeatButton.className = "fa-solid fa-repeat active";
                showNotification('Repeat all');
                break;
            case 2:
                repeatButton.classList.add('active');
                repeatButton.className = "fa-solid fa-repeat-1 active";
                showNotification('Repeat one');
                break;
        }
    });
}

// Like Button
if (likeButton) {
    likeButton.addEventListener('click', () => {
        if (likedSongs.has(songIndex)) {
            likedSongs.delete(songIndex);
            likeButton.className = "fa-regular fa-heart";
            showNotification('Removed from liked songs');
        } else {
            likedSongs.add(songIndex);
            likeButton.className = "fa-solid fa-heart liked";
            showNotification('Added to liked songs');
        }
        updateLikedSongsDisplay();
    });
}

// Fullscreen Control
const fullscreenButton = document.getElementById("fullscreen");
if (fullscreenButton) {
    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
}

// Modal Controls
const queueModal = document.getElementById("queueModal");
const queueButton = document.getElementById("queueButton");
const closeQueueButton = document.getElementById("closeQueue");

if (queueButton) {
    queueButton.addEventListener('click', () => {
        queueModal.style.display = "block";
        updateQueueDisplay();
    });
}

if (closeQueueButton) {
    closeQueueButton.addEventListener('click', () => {
        queueModal.style.display = "none";
    });
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === queueModal) {
        queueModal.style.display = "none";
    }
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    switch (e.code) {
        case 'Space':
            e.preventDefault();
            masterPlay.click();
            break;
        case 'ArrowRight':
            e.preventDefault();
            document.getElementById("next").click();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            document.getElementById("previous").click();
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (volumeSlider) {
                volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
                audioElement.volume = volumeSlider.value / 100;
                updateVolumeIcon();
                updateVolumeSliderBackground();
            }
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (volumeSlider) {
                volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
                audioElement.volume = volumeSlider.value / 100;
                updateVolumeIcon();
                updateVolumeSliderBackground();
            }
            break;
        case 'KeyS':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                shuffleButton.click();
            }
            break;
        case 'KeyR':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                repeatButton.click();
            }
            break;
        case 'KeyL':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                likeButton.click();
            }
            break;
    }
});

// Queue Management
function updateQueueDisplay() {
    const queueList = document.getElementById("queueList");
    const currentQueueItem = document.getElementById("currentQueueItem");

    // Update current song
    currentQueueItem.querySelector('img').src = songs[songIndex].coverPath;
    currentQueueItem.querySelector('.queue-song-name').innerText = songs[songIndex].songName;
    currentQueueItem.querySelector('.queue-artist').innerText = songs[songIndex].artist;

    // Clear and populate queue
    queueList.innerHTML = '';

    const currentPlaylistIndex = currentPlaylist.indexOf(songIndex);
    const upcomingSongs = currentPlaylist.slice(currentPlaylistIndex + 1);

    if (upcomingSongs.length === 0 && repeatMode === 1) {
        // If repeat all is on and we're at the end, show all songs
        upcomingSongs.push(...currentPlaylist);
    }

    upcomingSongs.forEach((index) => {
        const queueItem = document.createElement('div');
        queueItem.className = 'queue-item';
        queueItem.innerHTML = `
            <img src="${songs[index].coverPath}" alt="${songs[index].songName}" />
            <div class="queue-song-info">
                <span class="queue-song-name">${songs[index].songName}</span>
                <span class="queue-artist">${songs[index].artist}</span>
            </div>
        `;

        queueItem.addEventListener('click', () => {
            playSong(index);
            queueModal.style.display = "none";
        });

        queueList.appendChild(queueItem);
    });

    if (upcomingSongs.length === 0) {
        queueList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No upcoming songs</p>';
    }
}

// Notification System
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-light);
        color: var(--text-primary);
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        font-size: 0.9rem;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(notificationStyles);

// Liked Songs Management
function updateLikedSongsDisplay() {
    const likedSongsList = document.getElementById("likedSongsList");
    const likedModalList = document.getElementById("likedModalList");

    if (likedSongs.size === 0) {
        const emptyMessage = '<p class="empty-state">No liked songs yet. Start liking songs to see them here!</p>';
        if (likedSongsList) likedSongsList.innerHTML = emptyMessage;
        if (likedModalList) likedModalList.innerHTML = emptyMessage;
        return;
    }

    let likedHTML = '';
    likedSongs.forEach(songIdx => {
        const song = songs[songIdx];
        const isCurrentlyPlaying = songIdx === songIndex && !audioElement.paused;
        const playIcon = isCurrentlyPlaying ? 'fa-pause-circle' : 'fa-play-circle';

        likedHTML += `
            <div class="liked-song-item" data-index="${songIdx}">
                <img src="${song.coverPath}" alt="${song.songName}" />
                <div class="liked-song-info">
                    <div class="liked-song-name">${song.songName}</div>
                    <div class="liked-song-artist">${song.artist}</div>
                </div>
                <div class="liked-song-actions">
                    <i class="fa-solid fa-heart-crack liked-unlike-btn" data-index="${songIdx}" title="Remove from liked"></i>
                    <span class="liked-song-time">${formatTime(song.duration)}</span>
                    <i class="fas ${playIcon} liked-play-btn" data-index="${songIdx}" title="Play"></i>
                </div>
            </div>
        `;
    });

    if (likedSongsList) likedSongsList.innerHTML = likedHTML;
    if (likedModalList) likedModalList.innerHTML = likedHTML;

    // Add event listeners to the new play buttons
    addLikedSongEventListeners();
}

function removeLikedSong(index) {
    likedSongs.delete(index);

    // Update the main song list like button
    const mainLikeButton = document.querySelector(`.song-like-btn[data-index="${index}"]`);
    if (mainLikeButton) {
        mainLikeButton.classList.remove("fa-solid", "liked");
        mainLikeButton.classList.add("fa-regular");
        mainLikeButton.title = "Like";
    }

    updateLikedSongsDisplay();
    updateLikeButton(); // Update the main player like button if current song
    showNotification('Removed from liked songs');
}

function addLikedSongEventListeners() {
    // Add click listeners to liked song play buttons
    document.querySelectorAll('.liked-play-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedIndex = parseInt(e.target.dataset.index);

            if (clickedIndex !== songIndex || audioElement.paused) {
                // Play new song or resume paused song
                playSong(clickedIndex);
            } else {
                // Pause current song
                audioElement.pause();
                masterPlay.classList.remove("fa-pause-circle");
                masterPlay.classList.add("fa-play-circle");
                gif.style.opacity = 0;
                removeAllPlaying();
                songItems[songIndex].getElementsByTagName("img")[0].classList.remove("rotating");
                makeAllPlays();
                updateLikedSongsDisplay();
            }
        });
    });

    // Add click listeners to unlike buttons
    document.querySelectorAll('.liked-unlike-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedIndex = parseInt(e.target.dataset.index);
            removeLikedSong(clickedIndex);
        });
    });

    // Add click listeners to liked song items (for full row click)
    document.querySelectorAll('.liked-song-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking on buttons
            if (e.target.classList.contains('liked-play-btn') ||
                e.target.classList.contains('liked-unlike-btn') ||
                e.target.classList.contains('fa-heart-crack')) {
                return;
            }

            const clickedIndex = parseInt(item.dataset.index);
            playSong(clickedIndex);
        });
    });
}

// Tab Management
const trendingTab = document.getElementById("trendingTab");
const likedTab = document.getElementById("likedTab");
const trendingContent = document.getElementById("trendingContent");
const likedContent = document.getElementById("likedContent");

if (trendingTab && likedTab) {
    trendingTab.addEventListener('click', () => {
        trendingTab.classList.add('active');
        likedTab.classList.remove('active');
        trendingContent.style.display = 'block';
        likedContent.style.display = 'none';
    });

    likedTab.addEventListener('click', () => {
        likedTab.classList.add('active');
        trendingTab.classList.remove('active');
        likedContent.style.display = 'block';
        trendingContent.style.display = 'none';
        updateLikedSongsDisplay();
    });
}

// Liked Modal Controls
const likedModal = document.getElementById("likedModal");
const likedButton = document.getElementById("likedButton");
const closeLikedButton = document.getElementById("closeLiked");

if (likedButton) {
    likedButton.addEventListener('click', () => {
        likedModal.style.display = "block";
        updateLikedSongsDisplay();
    });
}

if (closeLikedButton) {
    closeLikedButton.addEventListener('click', () => {
        likedModal.style.display = "none";
    });
}

// Close liked modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === likedModal) {
        likedModal.style.display = "none";
    }
});

// Initialize
updateCurrentSong();
updateVolumeIcon();
updateVolumeSliderBackground();
updateAllLikeButtons();

// Ensure audio element is ready
audioElement.addEventListener('loadedmetadata', () => {
    console.log('Audio metadata loaded');
});

audioElement.addEventListener('canplay', () => {
    console.log('Audio can start playing');
});

// Add volume change event listener to audio element
audioElement.addEventListener('volumechange', () => {
    console.log('Audio volume changed to:', audioElement.volume);
    updateVolumeIcon();
    if (volumeSlider) {
        volumeSlider.value = audioElement.volume * 100;
        updateVolumeSliderBackground();
    }
});

// Update like button state
function updateLikeButton() {
    if (!likeButton) return;
    if (likedSongs.has(songIndex)) {
        likeButton.className = "fa-solid fa-heart liked";
    } else {
        likeButton.className = "fa-regular fa-heart";
    }
}

// Update all song like buttons state
function updateAllLikeButtons() {
    document.querySelectorAll('.song-like-btn').forEach((button) => {
        const buttonIndex = parseInt(button.dataset.index);
        if (likedSongs.has(buttonIndex)) {
            button.classList.remove("fa-regular");
            button.classList.add("fa-solid", "liked");
            button.title = "Unlike";
        } else {
            button.classList.remove("fa-solid", "liked");
            button.classList.add("fa-regular");
            button.title = "Like";
        }
    });
}