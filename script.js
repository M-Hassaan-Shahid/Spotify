let songIndex = 0;
let audioElement = new Audio("songs/1.mp3");
let masterPlay = document.getElementById("play");
let myProgressBar = document.getElementById("myProgressBar");
let gif = document.getElementById("gif");
let songItems = Array.from(document.getElementsByClassName("songItem"));
let masterSongName = document.getElementById("masterSong");
// Corrected songs array
let songs = [
    { songName: "Warriyo - Mortals (feat. Laura Brehm)", filePath: "songs/1.mp3", coverPath: "covers/1.jpg" },
    { songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg" },
    { songName: "DEAF KEV - Invincible", filePath: "songs/3.mp3", coverPath: "covers/3.jpg" },
    { songName: "Different Heaven & EH!DE - My Heart", filePath: "songs/4.mp3", coverPath: "covers/4.jpg" },
    { songName: "Janji - Heroes Tonight (feat. Johnning)", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
    { songName: "Let Me Love You - Justin Bieber", filePath: "songs/6.mp3", coverPath: "covers/6.jpg" },
    { songName: "Let Me Love You - Justin Bieber", filePath: "songs/7.mp3", coverPath: "covers/7.jpg" },
    { songName: "Let Me Love You - Justin Bieber", filePath: "songs/8.mp3", coverPath: "covers/8.jpg" },
    { songName: "Let Me Love You - Justin Bieber", filePath: "songs/9.mp3", coverPath: "covers/9.jpg" },
    { songName: "Let Me Love You - Justin Bieber", filePath: "songs/10.mp3", coverPath: "covers/10.jpg" },
];
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
})

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
        document.getElementById(`songPlay${songIndex}`).classList.remove("fa-play-circle");
        document.getElementById(`songPlay${songIndex}`).classList.add("fa-pause-circle");
        removeAllPlaying();
        songItems[songIndex].classList.add("playing");
    } else {
        audioElement.pause();
        masterPlay.classList.remove("fa-pause-circle");
        masterPlay.classList.add("fa-play-circle");
        gif.style.opacity = 0;
        document.getElementById(`songPlay${songIndex}`).classList.remove("fa-pause-circle");
        document.getElementById(`songPlay${songIndex}`).classList.add("fa-play-circle");
        removeAllPlaying();
    }
})
audioElement.addEventListener('timeupdate', () => {
    // Update seek bar
    progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
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

document.querySelectorAll(".songItemPlay").forEach((element) => {
    element.addEventListener('click', (e) => {
        const clickedIndex = parseInt(e.target.id.replace("songPlay", ""));

        if (clickedIndex !== songIndex || audioElement.paused) {
            // Play new song or resume paused song
            makeAllPlays();
            removeAllPlaying();
            songIndex = clickedIndex;
            audioElement.src = songs[songIndex].filePath;
            masterSongName.innerText = songs[songIndex].songName;
            audioElement.currentTime = 0;
            audioElement.play();
            e.target.classList.remove("fa-play-circle");
            e.target.classList.add("fa-pause-circle");
            masterPlay.classList.remove("fa-play-circle");
            masterPlay.classList.add("fa-pause-circle");
            gif.style.opacity = 1;
            songItems[songIndex].classList.add("playing");
        } else {
            // Pause current song
            audioElement.pause();
            e.target.classList.remove("fa-pause-circle");
            e.target.classList.add("fa-play-circle");
            masterPlay.classList.remove("fa-pause-circle");
            masterPlay.classList.add("fa-play-circle");
            gif.style.opacity = 0;
            removeAllPlaying();
        }
    });
});
document.getElementById("next").addEventListener('click', () => {
    songIndex = (songIndex >= 9) ? 0 : songIndex + 1;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove("fa-play-circle");
    masterPlay.classList.add("fa-pause-circle");
    gif.style.opacity = 1;
    makeAllPlays();
    document.getElementById(`songPlay${songIndex}`).classList.remove("fa-play-circle");
    document.getElementById(`songPlay${songIndex}`).classList.add("fa-pause-circle");
    removeAllPlaying();
    songItems[songIndex].classList.add("playing");
})
document.getElementById("previous").addEventListener('click', () => {
    songIndex = (songIndex <= 0) ? 9 : songIndex - 1;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove("fa-play-circle");
    masterPlay.classList.add("fa-pause-circle");
    gif.style.opacity = 1;
    makeAllPlays();
    document.getElementById(`songPlay${songIndex}`).classList.remove("fa-play-circle");
    document.getElementById(`songPlay${songIndex}`).classList.add("fa-pause-circle");
    removeAllPlaying();
    songItems[songIndex].classList.add("playing");
})
