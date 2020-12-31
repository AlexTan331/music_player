const image = document.querySelector("img");
const songName = document.getElementById("song-name");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const draggablePoint = document.getElementById("draggable-point");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const prevBtn = document.getElementById("prev");
const nxtBtn = document.getElementById("next");
const playBtn = document.getElementById("play");

// Music
const songs = [
  {
    name: "jacinto-1",
    displayName: "Electric Chill Machine",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-2",
    displayName: "Seven Nation Army (Remix)",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-3",
    displayName: "Goodnight, Disco Queen",
    artist: "Jacinto Design",
  },
  {
    name: "metric-1",
    displayName: "Front Row (Remix)",
    artist: "Metric/Jacinto Design",
  },
  {
    name: "Summer-Mood",
    displayName: "Summber Mood",
    artist: "Alexiaction",
  },
  {
    name: "Toss-the-Salt",
    displayName: "Toss the Salt (Instrumental)",
    artist: "Sionya",
  },
  {
    name: "Young",
    displayName: "Yong",
    artist: "Chris Coral",
  },
  {
    name: "Live-Long",
    displayName: "Live Long",
    artist: "Falcon Dives",
  },
];

let isRandom = false;
let isPlaying = false;
let isPrevPlaying;

let currentSongidx;
// get currentSongIdx from cache
if (localStorage.getItem("currentSongIndex") !== null) {
  currentSongidx = localStorage.getItem("currentSongIndex");
} else {
  currentSongidx = 0;
  localStorage.setItem("currentSongIndex", currentSongidx);
}

function playMusic() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
}

function pauseMusic() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
}

function loadSong(song) {
  artist.textContent = song.artist;
  songName.textContent = song.displayName;
  music.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
}

function next() {
  if (isRandom) {
    randomPlay();
  } else {
    currentSongidx = (currentSongidx + 1) % songs.length;
    localStorage.setItem("currentSongIndex", currentSongidx);
    loadSong(songs[currentSongidx]);
    playMusic();
  }
}

function previous() {
  if (isRandom) {
    randomPlay();
  } else {
    currentSongidx =
      currentSongidx <= 0
        ? (currentSongidx = songs.length - 1)
        : (currentSongidx - 1) % songs.length;
    localStorage.setItem("currentSongIndex", currentSongidx);
    loadSong(songs[currentSongidx]);
    playMusic();
  }
}

function randomPlay() {
  currentSongidx = Math.floor(Math.random() * songs.length);
  localStorage.setItem("currentSongIndex", currentSongidx);
  loadSong(songs[currentSongidx]);
  playMusic();
  console.log("random playing");
}

function controlVolume() {
  //adjust volume
  //to be implemented...
}

function updateProgressBar(e) {
  const { duration, currentTime } = e.srcElement;
  // update progress bar width
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  draggablePoint.style.left = `${progressPercent - 1}%`;

  // refactor time format for duration
  const durationMinutes = Math.floor(duration / 60);
  let durationSeconds = Math.floor(duration % 60);
  if (durationSeconds < 10) {
    durationSeconds = `0${durationSeconds}`;
  }
  // Delay switching duration Element to avoid NaN
  if (durationSeconds) {
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
  }

  // refactor time format for current time
  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
  }
  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}

function controlProgressBar(e) {
  const width = this.clientWidth;
  const positionX = e.offsetX;
  const { duration } = music;
  music.currentTime = (positionX / width) * duration;
}

function calculateXPosition() {
  return (
    (100 * (parseFloat($(this).css("left")) + 10)) /
      parseFloat($(this).parent().css("width")) +
    "%"
  );
}

loadSong(songs[currentSongidx]);

playBtn.addEventListener("click", () => {
  isPlaying ? pauseMusic() : playMusic();
});
prevBtn.addEventListener("click", previous);
nxtBtn.addEventListener("click", next);
music.addEventListener("ended", next);
music.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", controlProgressBar);

// handle random play using JQuery
$("#random").click(function () {
  if (!isRandom) {
    $("#random").css("color", " #d16d6d");
    isRandom = true;
  } else {
    $("#random").css("color", " rgb(129, 129, 129)");
    isRandom = false;
  }
});

// handle draggable point in progress bar using JQuery
$("#draggable-point").draggable({
  axis: "x",
  containment: "#progress-container",
});

$("#draggable-point").draggable({
  // update progress bar
  drag: function () {
    var xPos =
      (100 * (parseFloat($(this).css("left")) + 10)) /
        parseFloat($(this).parent().css("width")) +
      "%";
    $("#progress").css({
      width: xPos,
    });
  },

  start: function () {
    isPrevPlaying = isPlaying;
    pauseMusic();
  },

  stop: function () {
    if (isPrevPlaying) playMusic();
    else pauseMusic();

    //current x position of draggable point
    var xPos =
      (100 * (parseFloat($(this).css("left")) + 10)) /
        parseFloat($(this).parent().css("width")) +
      "%";

    //update current music time
    music.currentTime = (Math.floor(parseFloat(xPos)) / 100) * music.duration;
  },
});
