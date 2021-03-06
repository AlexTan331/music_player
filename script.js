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
const volume = document.getElementById("volume");
const volumeContainer = document.getElementById("volume-container");
const volumeBar = document.getElementById("volume-bar");
const draggablePointVolume = document.getElementById("draggable-point-volume");

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

//store previous volume and set it as current volume after changed from muted 
let prevVolume = 100; 
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
}

function changeVolumeStyle(prevIcon, curIcon, onOrOff, widthPercent, leftPercent) {
  volume.classList.replace(`fa-volume-${prevIcon}`, `fa-volume-${curIcon}`);
  volume.setAttribute("title", `Volume: ${onOrOff}`);
  volumeBar.style.width = widthPercent;
  draggablePointVolume.style.left = leftPercent;
}

function muteMusic() {
  music.muted = true;
  changeVolumeStyle("up", "mute", "off", "0%", "0%");
}

function unmuteMusic() {
  music.muted = false;
  changeVolumeStyle("mute", "up", "on", `${prevVolume}%`, `${prevVolume - 10}%`);
}

function controlVolume(e) {
  const width = this.clientWidth;
  const positionX = e.offsetX;
  music.volume = parseFloat(positionX) / parseFloat(width);
  const volumePercent = (positionX / width) * 100;
  volumeBar.style.width = `${volumePercent}%`;
  draggablePointVolume.style.left = `${volumePercent - 10}%`;
  prevVolume = volumePercent;
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


loadSong(songs[currentSongidx]);

playBtn.addEventListener("click", () => {
  isPlaying ? pauseMusic() : playMusic();
});
prevBtn.addEventListener("click", previous);
nxtBtn.addEventListener("click", next);
music.addEventListener("ended", next);
music.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", controlProgressBar);
volume.addEventListener("click",() => {music.muted ? unmuteMusic(): muteMusic() } );
volumeContainer.addEventListener("click", controlVolume);

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

// handle volume control using JQuery
$("#draggable-point-volume").draggable({
  axis: "x",
  containment: "#volume-container",
});

$("#draggable-point-volume").draggable({
  drag: function () {
    var xPos =
      (100 * parseFloat($(this).css("left"))) /
        parseFloat($(this).parent().css("width")) +
      "%";
    $("#volume-bar").css({
      width: xPos,
    });

    if (parseFloat(xPos) / 100 < 0) toggleMuteMusic();
    else music.volume = parseFloat(xPos) / 100;
  },
});
