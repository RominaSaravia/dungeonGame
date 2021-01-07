let staticObj = function (objdata) {
  this.x = objdata.coordXy[0];
  this.y = objdata.coordXy[1];
  this.type = objdata.type;
}