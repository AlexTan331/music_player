const image = document.querySelector("img");
const songName = document.getElementById("song-name");
const artist = document.getElementById("artist");
const audio = document.querySelector("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const draggablePoint = document.getElementById("draggable-point");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const prevBtn = document.getElementById("prev");
const nxtBtn = document.getElementById("next");
const playBtn = document.getElementById("play");

let isPrevPlaying;

const div = document.querySelector("div");
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

let isPlaying = false;
let currentSongidx = 0;

function playAudio() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  audio.play();
}

function pauseAudio() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  audio.pause();
}

function loadSong(song) {
  artist.textContent = song.artist;
  songName.textContent = song.displayName;
  audio.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
}

function next() {
  currentSongidx = (currentSongidx + 1) % songs.length;
  loadSong(songs[currentSongidx]);
  playAudio();
}

function previous() {
  currentSongidx =
    currentSongidx <= 0
      ? (currentSongidx = songs.length - 1)
      : (currentSongidx - 1) % songs.length;
  loadSong(songs[currentSongidx]);
  playAudio();
}

function randomPlay() {
  //play songs randomly
  //to be implemented...
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
  const { duration } = audio;
  audio.currentTime = (positionX / width) * duration;

  console.log("controlProgressBar: ", width, " ", positionX);
}


loadSong(songs[currentSongidx]);

playBtn.addEventListener("click", () => {
  isPlaying ? pauseAudio() : playAudio();
});
prevBtn.addEventListener("click", previous);
nxtBtn.addEventListener("click", next);
audio.addEventListener("ended", next);
audio.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", controlProgressBar);


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
    pauseAudio();
  },
  // play or pause audio, and update current audio time 
  stop: function () {
    if (isPrevPlaying) playAudio();
    else pauseAudio();

    var xPos =
      (100 * (parseFloat($(this).css("left")) + 10)) /
        parseFloat($(this).parent().css("width")) +
      "%";
    const { duration } = audio;
    audio.currentTime = (Math.floor(parseFloat(xPos)) / 100) * duration;
  },
});
