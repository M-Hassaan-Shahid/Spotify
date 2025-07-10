let songindex = 0;
let audioElement = new Audio("songs/1.mp3");
let masterPlay = document.getElementById("MPlay");
let myProgressBar = document.getElementById("myProgressBar");
let gif = document.getElementById("gif");

let songs = [
    {
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
        songName: "Let Me Love You",filePath:"songs/1.mp3", coverPath: "covers/1.jpg",
    }]


masterPlay.addEventListener("click", () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove("fa-play");
        masterPlay.classList.add("fa-pause");
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.remove("fa-pause");
        masterPlay.classList.add("fa-play");
        gif.style.opacity = 0;
    }
}
// myProgressBar.addEventListener('timeupdate', () => {});