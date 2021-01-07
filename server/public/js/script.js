let getScene, canvas, ctx;
const FPS = 50;

let PJ; //Jugador
let enemies = [];

const widthTile = 32;
const heightTile = 32;

//TILES DEL MAPA
let levelMap = 1;
let tileMap;
let showLight = [];
let scene;

//------------------SONIDO-----------------------
let musicPlaying = false;
let sfx_gotIt, sfx_movement;
let music01;

const switchMusic = document.getElementById("music-switch");


window.addEventListener("load", function () {
  sfx_gotIt = new Howl({
    src: ["fx/gui-click-sfx.wav"],
    loop: false,
  });

  sfx_movement = new Howl({
    src: ["fx/sound-of-the-walk.wav"],
    loop: false,
  });


  music01 = new Howl({
    src: ["music/pixel-cyber-forest-melody.wav"],
    loop: true,
  });

})


function musicPlays() {

  if (musicPlaying == false) {
    musicPlaying = true;
    switchMusic.style.opacity = 1;
    music01.play();
  } else {
    musicPlaying = false;
    switchMusic.style.opacity = 0.5;
    music01.stop();
  }

}

// -----------------LOCAL STORAGE----------------
function save(valor) {
  localStorage.setItem("nombre_jugador", valor);
}

function restore() {
  return (localStorage.getItem("nombre_jugador"));
}

function erase() {
  localStorage.removeItem("nombre_jugador");

}
// ----------------------------------------------


function inicializador() {
  // Cuando se carga la pagina inicia el juego  
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");


  //Consulta el LevelMap
  const requestMap = new XMLHttpRequest();

  requestMap.addEventListener("load", function () {
    if (this.status == 200) {

      getScene = JSON.parse(this.responseText);
      scene = getScene.scene;
      NPCList = getScene.NPC;
      StaticObjList = getScene.staticObj;

      // Se crea el jugador
      PJ = new mainChr(getScene.PJxy[0], getScene.PJxy[1]);

      scene[getScene.Keyxy[1]][getScene.Keyxy[0]] = 3;


      //Se crean los enemigos
      for (let i in NPCList) {
        if(NPCList[i].type === "fantasma") {
          enemies.push(new enemy01(NPCList[i]));
        }
       
      }


      for (let i in StaticObjList) {
        if (StaticObjList[i].type === "torchLight") {
          showLight.push(new light(StaticObjList[i]));

        }
        
      }


    } else {
      console.log("ERROR");
    }

  });


  requestMap.open("GET", "levelMap/" + levelMap);
  requestMap.send();

  tileMap = new Image();
  tileMap.src = 'img/TileSet.png'


  //Lectura del teclado
  document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp") {
      PJ.movUp();
      sfx_movement.play();
    }
    if (e.key == "ArrowDown") {
      PJ.movDown();
      sfx_movement.play();
    }
    if (e.key == "ArrowLeft") {
      PJ.movLeft();
      sfx_movement.play();
    }
    if (e.key == "ArrowRight") {
      PJ.movRight();
      sfx_movement.play();
    }

    if (e.key == "g") {
      saveGame();

    }

    if (e.key == "c") {
      loadGame();
    }

    if (e.key == "b") {
    }

  });


  setInterval(function () {
    main();

  }, 1000 / FPS)

}


// Recorre el array scene y dibuja el mapa del juego
function drawScene() {
  for (let y = 0; y < scene.length; y++) {
    for (let x = 0; x < scene[0].length; x++) {

      let tile = scene[y][x];
      ctx.drawImage(tileMap, tile * 32, 0, 32, 32, x * widthTile, y * heightTile, widthTile, heightTile);

    }

  }
}

//-------------GAMEDATA SAVE & LOAD-------------

function saveGame() {
  console.log("Guardado");
  let savedCoord = [];
  let saveHaveKey = false;

  let enemy0Coord = [];
  let enemy1Coord = [];
  let enemy2Coord = [];


  savedCoord = PJ.coordenates();
  saveHaveKey = PJ.haveKey();

  console.log(PJ.haveKey());

  console.log(saveHaveKey);

  enemy0Coord = enemies[0].coordenates();
  enemy1Coord = enemies[1].coordenates();
  enemy2Coord = enemies[2].coordenates();


  localStorage.setItem("haveKey", saveHaveKey);
  localStorage.setItem("PJx", savedCoord[0]);
  localStorage.setItem("PJy", savedCoord[1]);

  localStorage.setItem("E0x", enemy0Coord[0]);
  localStorage.setItem("E0y", enemy0Coord[1]);

  localStorage.setItem("E1x", enemy1Coord[0]);
  localStorage.setItem("E1y", enemy1Coord[1]);

  localStorage.setItem("E2x", enemy2Coord[0]);
  localStorage.setItem("E2y", enemy2Coord[1]);

  console.log("PARTIDA GUARDADA");

}

function loadGame() {
  console.log("Cargando");
  let PJx, PJy, E0x, E0y, E1x, E1y, E2x, E2y, haveKey;

  haveKey = localStorage.getItem("haveKey")

  if (haveKey == "false") {
    haveKey = false;
  } else {
    haveKey = true;
  }
  console.log(haveKey);
  PJx = localStorage.getItem("PJx");
  PJy = localStorage.getItem("PJy");

  E0x = localStorage.getItem("E0x");
  E0y = localStorage.getItem("E0y");

  E1x = localStorage.getItem("E1x");
  E1y = localStorage.getItem("E1y");

  E2x = localStorage.getItem("E2x");
  E2y = localStorage.getItem("E2y");

  PJ.setCoordenates(PJx, PJy, haveKey);
  enemies[0].setCoordenates(E0x, E0y);
  enemies[1].setCoordenates(E1x, E1y);
  enemies[2].setCoordenates(E2x, E2y);

}

//----------------------------------------------

function eraseCanvas() {
  canvas.width = (widthTile * 25);
  canvas.height = (widthTile * 15);
}


function main() {
  //Dibuja el mapa
  eraseCanvas();
  drawScene();
  for (let i = 0; i < showLight.length; i++) {
    showLight[i].draw();
  }
  //Dibuja al player
  PJ.drawPJ();
  //Dibuja los enemigos
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].movement();
    enemies[i].drawNPC();
  }

}