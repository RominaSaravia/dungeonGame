let mainChr = function (x, y) {
  this.x = x;
  this.y = y;
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
      scene[getScene.Keyxy[1]][getScene.Keyxy[0]] = 3;
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
    levelMap++;

    const requestMap = new XMLHttpRequest();

    requestMap.addEventListener("load", function () {
      if (this.status == 200) {
        //No hay más niveles, vuelve al nivel 1
        if (!this.responseText) {
          levelMap = 1;
          console.log("No hay mas niveles")

          const restartMap = new XMLHttpRequest();

          restartMap.addEventListener("load", function () {
            if (this.status == 200) {
              getScene = JSON.parse(this.responseText);

              scene = getScene.scene;

              this.x = getScene.PJxy[0];
              this.y = getScene.PJxy[1];
              this.key = false;
              //Adding Key
              scene[getScene.Keyxy[1]][getScene.Keyxy[0]] = 3;

            } else {
              console.log("ERROR en el pedido del mapa");
            }
          });

          restartMap.open("GET", "levelMap/" + levelMap);
          restartMap.send();

        } else {
          getScene = JSON.parse(this.responseText);

          scene = getScene.scene;

          this.x = getScene.PJxy[0];
          this.y = getScene.PJxy[1];
          this.key = false;
          //Adding Key
          scene[getScene.Keyxy[1]][getScene.Keyxy[0]] = 3;
        }


      } else {
        console.log("ERROR en el pedido del mapa");
      }
    });

    requestMap.open("GET", "levelMap/" + levelMap);
    requestMap.send();
  }


  //GAMEOVER
  this.dead = function () {
    this.x = getScene.PJxy[0];
    this.y = getScene.PJxy[1];
    this.key = false;  // El jugador ya no tiene la llave
    scene[getScene.Keyxy[1]][getScene.Keyxy[0]] = 3;  // La llave vuelve a su lugar de origen
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
      sfx_gotIt.play();
      this.key = true;
      scene[this.y][this.x] = 2;
    }

    //VICTORIA - se abre la puerta
    if (object == 1) {
      if (this.key == true) {
        sfx_gotIt.play();
        this.victory();
      } else {

      }
    }
  }
}