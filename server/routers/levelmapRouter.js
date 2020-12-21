const express = require("express");
const maps = require("../getData");

const levelMapRouter = express.Router();

// GET devuelve toda la lista de mapas
levelMapRouter.get("/", (req,res) => {

  maps.getAll( levelMap => {
    
    res.json(levelMap)
  });

})

// GET consulta el objeto levelMap por ID
levelMapRouter.get("/:id", (req,res) => {

  maps.getLevel(req.params.id, levelMap => {

    res.json(levelMap);
  })
})

module.exports = levelMapRouter;