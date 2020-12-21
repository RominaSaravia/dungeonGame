const express = require("express");
const maps = require("../getData");

const levelMapRouter = express.Router();

// endpoint GET Lista de mapas
levelMapRouter.get("/", (req,res) => {

  maps.getAll( levelMap => {
    
    res.json(levelMap)
  });

})

// Endpoint GET con datos del mapa
levelMapRouter.get("/:id", (req,res) => {

  maps.getLevel(req.params.id, levelMap => {

    res.json(levelMap);
  })
})

module.exports = levelMapRouter;