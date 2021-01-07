let light = function (objdata) {
  staticObj.call(this, objdata)

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
    ctx.drawImage(tileMap, this.frames * 32, 64, 32, 32, this.x * widthTile, this.y * heightTile, widthTile, heightTile);

  }
}

light.prototype = Object.create(staticObj.prototype);

light.prototype.constructor = light;