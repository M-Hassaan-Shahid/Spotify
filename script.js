let songIndex = 0;
let audioElement = new Audio("songs/1.mp3");
let masterPlay = document.getElementById("play");
let myProgressBar = document.getElementById("myProgressBar");
let gif = document.getElementById("gif");
let songItems = Array.from(document.getElementsByClassName("songItem"));
let songs = [
    {
        songName: "Warriyo - Mortals (feat. Laura Brehm)", filePath: "songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/1.jpg",
        songName: "DEAF KEV - Invincible", filePath: "songs/3.mp3", coverPath: "covers/1.jpg",
        songName: "Different Heaven & EH!DE - My Heart", filePath: "songs/4.mp3", coverPath: "covers/1.jpg",
        songName: "Janji-Heroes-Tonight-feat-Johning", filePath: "songs/5.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You", filePath: "songs/6.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You", filePath: "songs/7.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You", filePath: "songs/8.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You", filePath: "songs/9.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You", filePath: "songs/10.mp3", coverPath: "covers/1.jpg",
    }]
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath
})
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove("fa-play-circle");
        masterPlay.classList.add("fa-pause-circle");
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.remove("fa-pause-circle");
        masterPlay.classList.add("fa-play-circle");
        gif.style.opacity = 0;
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
