let songIndex = 0;
let audioElement = new Audio("songs/1.mp3");
let masterPlay = document.getElementById("play");
let myProgressBar = document.getElementById("myProgressBar");
let gif = document.getElementById("gif");
let songItems = Array.from(document.getElementsByClassName("songItem"));
let masterSongName = document.getElementById("masterSong");
// Corrected songs array
let songs = [
    { songName: "Tum Hi Ho - Aashiqui 2", filePath: "songs/1.mp3", coverPath: "covers/1.jpeg", duration: 386 }, // 6:26
    { songName: "Ghagra", filePath: "songs/4.mp3", coverPath: "covers/2.jpg", duration: 300 },
    { songName: "Kal Ho Naa Ho ", filePath: "songs/3.mp3", coverPath: "covers/3.jpeg", duration: 335 }, // 5:35
    { songName: "Kabira", filePath: "songs/4.mp3", coverPath: "covers/4.jpeg", duration: 208 }, // 3:28
    { songName: "Galliyan - Ek Villain", filePath: "songs/5.mp3", coverPath: "covers/5.jpg", duration: 307 }, // 5:07
    { songName: "Pehla Nasha ", filePath: "songs/6.mp3", coverPath: "covers/6.jpg", duration: 362 }, // 6:02
    { songName: "Tum Se Hi - Jab We Met", filePath: "songs/7.mp3", coverPath: "covers/7.jpeg", duration: 331 }, // 5:31
    { songName: "Dil To Pagal Hai", filePath: "songs/8.mp3", coverPath: "covers/8.jpg", duration: 353 }, // 5:53
    { songName: "Zindagi Na Milegi Dobara ", filePath: "songs/9.mp3", coverPath: "covers/9.jpeg", duration: 251 }, // 4:11
    { songName: "Main Hoon Na", filePath: "songs/10.mp3", coverPath: "covers/10.jpg", duration: 357 } // 5:57
];
function updateAllTimeText() {
    songItems.forEach((element, i) => {
        if (element.getElementsByClassName("time")[0]) {
            element.getElementsByClassName("time")[0].innerText = new Date(songs[i].duration * 1000).toISOString().substr(14, 5);
        }
    });
}
songItems.forEach((element, i) => {
    updateAllTimeText()
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
