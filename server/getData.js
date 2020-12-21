const fs = require("fs");
const path = require("path");

/**
 * Consulta todos los datos de los niveles
 * @param {function} cbMap fn({ levelMapList: Array<levelMap> })
 */
const getAll = (cbMap) => {
  fs.readFile(path.join(__dirname, "levelMap.json"), (err, data) => {
    if (err) {
      cbMap({});

    } else {
      cbMap(JSON.parse(data))
    }
  })
}

/**
 * Funcion que consulta datos, filtra por ID  y devuelve el objeto levelmap.
 * @param {int} id numero de identidad
 * @param {function} cbMap fn callback ( {
 * id: int,
 * PJxy:array,
 * Keyxy:array,
 * scene:array
 * })
 */
const getLevel = (id, cbMap) => {
  fs.readFile(path.join(__dirname, "levelMap.json"), (err, data) => {
    if (err) {

      cbMap({});

    } else {
      const mapList = JSON.parse(data);

      const foundMap = mapList.find(item => item.id == id);

      cbMap(foundMap);
    }
  })

}

module.exports = {
  getAll,
  getLevel,
};

