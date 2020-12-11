const fs = require("fs");
const path = require("path");

const getAll = (cbMap) => {
  fs.readFile(path.join(__dirname, "levelMap.json"), (err,data) => {
    if (err) {
      cbMap({});

    }else {
      cbMap(JSON.parse(data))
    }
  })
}

const getLevel = (id, cbMap) => {
  fs.readFile(path.join(__dirname, "levelMap.json"), (err,data) => {
    if (err) {
      cbMap({});

    }else {
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

