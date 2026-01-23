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


 async function getSongs (folder){
currFolder = folder;

    let a = await fetch (`/${folder}/songs.json`);
let songs = await a.json();
// let div = document.createElement("div");
// div.innerHTML = response;
// let as = div.getElementsByTagName("a");
//  songs = []
// for (let index = 0; index < as.length; index++) {
//     const element = as[index];
// if(element.href.endsWith(".mp3") || element.href.endsWith(".mp4")){
//         songs.push(element.href.split(`/${folder}/`)[1])
//     }
    
// }
//show all the songs in the playList
let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
songUL.innerHTML = "";
for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML +  `<li>
  <img class="invert" src="img/music.svg" alt="#">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Abdullah</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="img/pause.svg" alt="">
                        </div>

</li>`;
}
//Attach event listeners to each song
Array.from(document.querySelector(".songList").getElementsByTagName('li')).forEach( e => {
e.addEventListener("click", element => {
    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
       })
});
return songs;
}


//for play music
const playMusic = (track, pause = false) =>{

    currentSong.src = `/${currFolder}/` + track;
    
  if (!pause) {
    currentSong.play();
    play.src = "img/play.svg";
  } else {
    play.src = "img/pause.svg";
  }
      document.querySelector(".songinfo").innerHTML = "Playing: " + decodeURI(track);
      document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}










async function displayAlbums() {
    console.log("displaying albums");
    let a = await fetch(`/songs/songs.json`);
    let response = await a.json();
    // let div = document.createElement("div");
    // div.innerHTML = response;
    // let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";
    // let array = Array.from(anchors);
   
    //     for (let index = 0; index < array.length; index++) {
    //         const e = array[index];
            
        
    //     if (e.href.includes("/songs/")){
    //         let folder = e.href.split("/").slice(-1)[0];
    //         //meta data of the folder

    //         let a = await fetch(`/songs/${folder}/info.json`);
    //         let response = await a.json();
    //         cardContainer.innerHTML += `
    //         <div data-folder="${folder}" class="card">
    //             <div class="play">
    //                 <svg viewBox="0 0 24 24" aria-hidden="true">
    //                     <path d="M5 3l14 9-14 9V3z" fill="black" />
    //                 </svg>
    //             </div>
    //             <img src="/songs/${folder}/cover.jpg" alt="Cover">
    //             <h2>${response.title}</h2>
    //             <p>${response.description}</p>
    //         </div>`;
    //     }
    // }

    for (const folder of response) {
        try {
            // Har folder ke andar se info.json uthayein
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

    
      //load the playlist when card is clicked
      Array.from(document.getElementsByClassName("card")).forEach( e => {
        e.addEventListener("click" ,async item =>{
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
          // Play the first song of the new album immediately
          playMusic(songs[0]);
        })
      })

}





async function main() {
     await getSongs("songs/ncs");
     console.log(songs);
    //display all the albums

   await displayAlbums();
   


     //Attach an event listener to play buttons
     document.getElementById("play").addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play();
            play.src = "img/play.svg";
        } else {
            currentSong.pause();
            play.src = "img/pause.svg";
        }});
   

         //Listen for timeupdate event
         currentSong.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        })



        //Add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        console.log(e);
        let percent = e.offsetX / e.currentTarget.offsetWidth;
        currentSong.currentTime = percent * currentSong.duration;
    });

    //Event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = "0";
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        console.log("clicked")
        document.querySelector(".left").style.left = "-120%"});




        
        // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

//     // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100
    });


    
     //add an event listener to volume slider
     document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


}

main();