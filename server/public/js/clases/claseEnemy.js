let enemy01 = function (objdata) {
  NPC.call(this, objdata)

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

enemy01.prototype = Object.create(NPC.prototype);

enemy01.prototype.constructor = enemy01;