console.log("javascript");

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/songs.json`);
    songs = await a.json();
    
    // Show all the songs in the playList
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    
    for (const song of songs) {
        // Display ke liye naam saaf karein (mp3 hata kar)
        let displayName = song.replaceAll("%20", " ");
        
        songUL.innerHTML = songUL.innerHTML + `<li>
            <img class="invert" src="img/music.svg" alt="#">
            <div class="info">
                <div>${displayName}</div>
                <div>Abdullah</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/pause.svg" alt="">
            </div>
        </li>`;
    }

    // Attach event listeners to each song
    Array.from(document.querySelector(".songList").getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", element => {
            // Click karne par song name uthayen
            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songName);
        })
    });
    
    return songs;
}

const playMusic = (track, pause = false) => {
    // Audio element ke liye src set karein
    currentSong.src = `/${currFolder}/` + track;
    
    if (!pause) {
        currentSong.play();
        play.src = "img/play.svg"; // Icon logic might be inverted based on your css, check this
    }
    
    // Song info update karein (track name se .mp3 hata kar dikhayen)
    document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(".mp3", "").replace(".mp4", "");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    console.log("displaying albums");
    let a = await fetch(`/songs/songs.json`);
    let response = await a.json();
    let cardContainer = document.querySelector(".cardContainer"); // Ensure lowercase 'c' matches HTML
    cardContainer.innerHTML = "";
    
    for (const folder of response) {
        try {
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 3l14 9-14 9V3z" fill="black" />
                    </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="Cover">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`;
        } catch (error) {
            console.error(`Error loading album: ${folder}`, error);
        }
    }

    // Load the playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })
    })
}

async function main() {
    // Default album load karein (Ensure ye folder exist karta ho)
    await getSongs("songs/ncs");
    
    // Sirf playMusic ko call karke pehla gaana load karein (Auto play avoid karne ke liye true pass karein)
    playMusic(songs[0], true);

    // Display all the albums
    await displayAlbums();

    // Play/Pause button listener
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg"; // Pause icon show karein
        } else {
            currentSong.pause();
            play.src = "img/play.svg"; // Play icon show karein
        }
    });

    // Timeupdate listener
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Seekbar listener
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = e.offsetX / e.currentTarget.offsetWidth;
        currentSong.currentTime = percent * currentSong.duration;
    });

    // Hamburger listener
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Close button listener
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // --- UPDATED PREVIOUS BUTTON ---
    previous.addEventListener("click", () => {
        currentSong.pause();
        console.log("Previous clicked");
        
        // URL se filename nikalna (Decode karna zaroori hai)
        let currentSongName = currentSong.src.split("/").slice(-1)[0]; 
        let index = songs.indexOf(decodeURI(currentSongName)); // decodeURI add kiya
        
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    // --- UPDATED NEXT BUTTON ---
    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("Next clicked");

        // URL se filename nikalna (Decode karna zaroori hai)
        let currentSongName = currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(decodeURI(currentSongName)); // decodeURI add kiya

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    })

    // Volume control
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100
    });

    // Mute button logic
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
}

main();