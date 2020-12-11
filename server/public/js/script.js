let getScene;
let canvas;
let ctx;
let FPS = 50;

let PJ; //Jugador
let enemies = [];

let widthTile = 32;
let heightTile = 32;

//MAPA-TILES
let dirt = "#754e1a";
let water = "#347aeb";
let plant = "#19942a";
let wall = "#808080";

let colorMainChr = "#044f14";

// OBJETOS USABLES
let door = "#994C00";
let keyDoor = "#FFFF00";

//TILES DEL MAPA
let levelMap = 1;
let tileMap;
let showLight = [];
let scene;


//------------------SONIDO-----------------------

let audioCtx;
let sfx01, sfx02, sfx03, sfx04;
let music01;
window.addEventListener("load", function () {
  console.log("windowOnLoad")
  audioCtx = new AudioContext();

  sfx01 = new Howl({
    src: ["fx/nuncaconoci.wav"],
    loop: false,
  });

  sfx02 = new Howl({
    src: ["fx/gui-click-sfx.wav"],
    loop: false,
  });

  sfx03 = new Howl({
    src: ["fx/gritty-snare-1.wav"],
    loop: false,
  });

  sfx04 = new Howl({
    src: ["fx/you-hore.ogg"],
    loop: false,
  });

  music01 = new Howl({
    src: ["music/09.ogg"],
    loop: true,
  });

  audioCtx.resume().then(() => {
    console.log('Playback resumed successfully');
  });

})

//-----------------------------------------------


// -----------------LOCAL STORAGE----------------
function save(valor) {
  console.log("Dato guardado");
  localStorage.setItem("nombre_jugador", valor);
}

function restore() {
  console.log(localStorage.getItem("nombre_jugador"));
  return (localStorage.getItem("nombre_jugador"));
}

function erase() {
  localStorage.removeItem("nombre_jugador");

}
// ----------------------------------------------

//OBJETO ENEMIGO
var enemy01 = function (x, y) {
  this.x = x;
  this.y = y;

  this.direction = Math.floor(Math.random() * 4);

  this.delay = 50;
  this.frames = 0;

  
  this.coordenates = function () {
    let coord = [];
    coord.push(this.x);
    coord.push(this.y);

    return (coord);
  }

  this.setCoordenates = function (x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }

  this.drawNPC = function () {

    ctx.drawImage(tileMap, 0, 32, 32, 32, this.x * widthTile, this.y * heightTile, widthTile, heightTile);
  }

  this.checkCollision = function (x, y) {
    let collision = false;

    if (scene[y][x] == 0) {
      collision = true;
    }
    return (collision);
  }

  //MOVIMIENTO
  this.movement = function () {

    PJ.collisionEnemy(this.x, this.y);

    if (this.frames < this.delay) {
      this.frames++;


    } else {
      this.frames = 0;

      //Hacia ARRIBA
      if (this.direction == 0) {
        if (this.checkCollision(this.x, this.y - 1) == false) {
          this.y--;
        } else {
          this.direction = Math.floor(Math.random() * 4);
        }
      }
      //Hacia ABAJO
      if (this.direction == 1) {
        if (this.checkCollision(this.x, this.y + 1) == false) {
          this.y++;
        } else {
          this.direction = Math.floor(Math.random() * 4);
        }
      }
      //Hacia IZQUIERDA
      if (this.direction == 2) {
        if (this.checkCollision(this.x - 1, this.y) == false) {
          this.x--;
        } else {
          this.direction = Math.floor(Math.random() * 4);
        }
      }
      //Hacia DERECHA
      if (this.direction == 3) {
        if (this.checkCollision(this.x + 1, this.y) == false) {
          this.x++;
        } else {
          this.direction = Math.floor(Math.random() * 4);
        }
      }
    }
  }
}


// OBJETO JUGADOR
let mainChr = function (x, y) {
  this.x = x;
  this.y = y;
  this.color = "#044f14";
  this.key = false;

  this.drawPJ = function () {

    ctx.drawImage(tileMap, 32, 32, 32, 32, this.x * widthTile, this.y * heightTile, widthTile, heightTile);
  }

  this.haveKey = function () {
    let haveKey = this.key;
    return (haveKey);
  }

  this.coordenates = function () {
    let coord = [];

    coord.push(this.x);
    coord.push(this.y);

    return (coord);
  }

  this.setCoordenates = function (x, y, haveKey) {
    this.x = parseInt(x);
    this.y = parseInt(y);

    this.key = haveKey;
    if (this.key == false) {
      console.log(haveKey)
      scene[1][10] = 3;
    }
  }

  //Colision enemigo
  this.collisionEnemy = function (x, y) {
    if (this.x == x && this.y == y) {
      this.dead();
    }

  }

  //Control de margenes
  this.margin = function (x, y) {
    let collision = false;
    if (scene[y][x] == 0) {
      collision = true;

    }
    return (collision);
  }

  // WIN GAME
  this.victory = function () {
    console.log("Has ganado");
    this.x = 2;
    this.y = 3;
    this.key = false;
    scene[1][10] = 3;
    levelMap++;

    const requestMap = new XMLHttpRequest();

    requestMap.addEventListener("load", function () {
      if (this.status == 200) {

        getScene = JSON.parse(this.responseText);
        scene = getScene.scene;

      } else {
        console.log("ERROR");
      }
    });

    requestMap.open("GET", "levelMap/" + levelMap);
    requestMap.send();

  }

  //GAMEOVER
  this.dead = function () {
    console.log("Has MUERTO");
    this.x = 2;
    this.y = 3;
    this.key = false;  // El jugador ya no tiene la llave
    scene[1][10] = 3;  // La llave vuelve a su lugar de origen
  }


  //Movimiento
  this.movUp = function () {
    if (this.margin(this.x, this.y - 1) == false) {
      this.y--;
      this.useOfObj();
    }
  };
  this.movDown = function () {
    if (this.margin(this.x, this.y + 1) == false) {
      this.y++;
      this.useOfObj();
    }
  };
  this.movLeft = function () {
    if (this.margin(this.x - 1, this.y) == false) {
      this.x--;
    }
    this.useOfObj();

  };
  this.movRight = function () {
    if (this.margin(this.x + 1, this.y) == false) {
      this.x++;
      this.useOfObj();
    }
  };


  //Uso de objetos
  this.useOfObj = function () {
    let object = scene[this.y][this.x];
    //Obtiene llave
    if (object == 3) {
      this.key = true;
      scene[this.y][this.x] = 2;
      console.log("Has obtenido la llave");
    }

    //VICTORIA - se abre la puerta
    if (object == 1) {
      if (this.key == true) {
        this.victory();
      } else {
        console.log("Te falta la llave, no puedes pasar");

      }
    }
  }
}

function inicializador () {
  // Cuando se carga la pagina inicia el juego  
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
  
    const requestMap = new XMLHttpRequest();
  
    requestMap.addEventListener("load", function () {
      if (this.status == 200) {
  
        getScene = JSON.parse(this.responseText);
        scene = getScene.scene;
  
        // Se crea el jugador
        PJ = new mainChr(getScene.PJx , getScene.PJy);
  
      } else {
        console.log("ERROR");
  
  
      }
    });
  
  
    requestMap.open("GET", "levelMap/" + levelMap);
    requestMap.send();
  
  
    tileMap = new Image();
    tileMap.src = 'img/TileSet.png'
  
  
  
    //Se crean los enemigos
    enemies.push(new enemy01(6, 1));
    enemies.push(new enemy01(10, 3));
    enemies.push(new enemy01(17, 5));
  
    //Crea objetos en el mapa
    showLight.push(new light(11, 3));
    showLight.push(new light(13, 3));
  
  
    //Lectura del teclado
    document.addEventListener("keydown", function (e) {
      if (e.key == "ArrowUp") {
        PJ.movUp();
        sfx02.play();
      }
      if (e.key == "ArrowDown") {
        PJ.movDown();
        sfx02.play();
      }
      if (e.key == "ArrowLeft") {
        PJ.movLeft();
        sfx02.play();
      }
      if (e.key == "ArrowRight") {
        PJ.movRight();
        sfx02.play();
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
  for (y = 0; y < scene.length; y++) {
    for (x = 0; x < scene[0].length; x++) {

      let tile = scene[y][x];
      ctx.drawImage(tileMap, tile * 32, 0, 32, 32, x * widthTile, y * heightTile, widthTile, heightTile);

    }

  }
}

let light = function (x, y) {
  this.x = x;
  this.y = y;

  this.frames = 0; //0-3
  this.contador = 0;
  this.delay = 8;

  

  this.changeFrame = function () {
    if (this.frames < 3) {
      this.frames++;
    } else {
      this.frames = 0;
    }
  }

  this.draw = function () {
    if (this.contador < this.delay) {
      this.contador++;

    } else {
      this.contador = 0;
      this.changeFrame();

    }
    ctx.drawImage(tileMap, this.frames * 32, 64, 32, 32, x * widthTile, y * heightTile, widthTile, heightTile);

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
  canvas.width = (32 * 25);
  canvas.height = (32 * 15);
}


function main() {
  //Dibuja el mapa
  eraseCanvas();
  drawScene();
  for (i = 0; i < showLight.length; i++) {
    showLight[i].draw();
  }
  //Dibuja al player
  PJ.drawPJ();
  //Dibuja los enemigos
  for (i = 0; i < enemies.length; i++) {
    enemies[i].movement();
    enemies[i].drawNPC();
  }

}