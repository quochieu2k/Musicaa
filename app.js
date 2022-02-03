/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSICAA";

const image = $(".image-container img");
const title = $(".title");
const artist = $(".artist");
const audio = $("#audio");
const playBtn = $(".player-inner");
const player = $(".control-buttons");
const range = $("#range");
const nextBtn = $(".play-forward");
const prevBtn = $(".play-back");
const randomBtn = $(".play-shuffle");
const repeatBtn = $(".play-repeat");
const playList = $(".play-list .card-content");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Holo",
      singer: "Jay Park",
      path: "./music/holo.mp3",
      image: "./images/skin.png",
      time: "03:48",
    },
    {
      name: "Home",
      singer: "Adele",
      path: "./music/home.mp3",
      image: "./images/rooms.png",
      time: "03:49",
    },
    {
      name: "Spark",
      singer: "Justin",
      path: "./music/spark.mp3",
      image: "./images/lightup.png",
      time: "04:11",
    },
    {
      name: "Summer",
      singer: "Squid",
      path: "./music/summer.mp3",
      image: "./images/heat.png",
      time: "03:42",
    },
    {
      name: "Attention",
      singer: "Charlie Puth",
      path: "./music/attention.mp3",
      image: "./images/narrator.png",
      time: "03:31",
    },
    {
      name: "See You Again",
      singer: "Wiz Khalifa",
      path: "./music/seeyouagain.mp3",
      image: "./images/nameoflove.png",
      time: "03:49",
    },
    {
      name: "Shape Of You",
      singer: "Ed Sheeran",
      path: "./music/shapeofyou.mp3",
      image: "./images/drive.png",
      time: "03:53",
    },
    {
      name: "We Dont Talk Anymore",
      singer: "Charlie Puth",
      path: "./music/wdtam.mp3",
      image: "./images/wdtam.png",
      time: "03:37",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="recent-message d-flex align-items-center px-4 py-3 mb-3 card-hover ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
              <div class="avatar avatar-lg">
                <img
                  src="${song.image}"
                  style="width: 60px; height: 60px; font-size: 1.2rem; border-radius: 15px"/>
              </div>
              <div class="name ms-4" style="width: 220px">
                <h5 class="mb-1 text-black">${song.name}</h5>
                <h6 class="text-muted mb-0">${song.singer}</h6>
              </div>
              <div class="name" style="margin-left: auto">
                <p class="text-muted mb-0" style="font-size: 0.95rem">${song.time}</p>
              </div>
              <div class="name" style="margin-left: auto">
                <p class="text-muted mb-0">
                  <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
                </p>
              </div>
          </div>
        `;
    });
    playList.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;

    // Xử lý khi click Play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
    };

    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const rangePercent = Math.floor((audio.currentTime / audio.duration) * 100);
        range.value = rangePercent;
      }
    };

    // Xử lý khi tua bài hát
    range.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
    };

    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
    };

    // Xử lý bật / tắt random song
    randomBtn.onclick = function (e) {
      // Cách 1: F8
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", this.isRandom);

      // Cách 2: Evondev
      // if (_this.isRandom) {
      //   _this.isRandom = false;
      //   _this.setConfig("isRandom", _this.isRandom);
      //   randomBtn.style.color = "#999";
      // } else {
      //   _this.isRandom = true;
      //   _this.setConfig("isRandom", _this.isRandom);
      //   randomBtn.style.color = "#ffb86c";
      // }
    };

    // Xử lý lặp lại song
    repeatBtn.onclick = function (e) {
      // Cách 1: F8
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", this.isRepeat);

      // Cách 2: Evondev
      // if (_this.isRepeat) {
      //   _this.isRepeat = false;
      //   _this.setConfig("isRepeat", _this.isRepeat);
      //   repeatBtn.style.color = "#999";
      // } else {
      //   _this.isRepeat = true;
      //   _this.setConfig("isRepeat", _this.isRepeat);
      //   repeatBtn.style.color = "#ffb86c";
      // }
    };

    // Xử lý next song khi ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playList.onclick = function (e) {
      const songNode = e.target.closest(".card-hover:not(.active)");
      if (songNode || e.target.closest("ion-icon")) {
        // Xử lý click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }
        // Xử lý click vào option ion-icon
        if (e.target.closest("ion-icon")) {
        }
      }
    };
  },
  loadCurrentSong: function () {
    image.setAttribute("src", this.currentSong.image);
    title.textContent = this.currentSong.name;
    artist.textContent = this.currentSong.singer;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Gán cấu hình từ confi vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
