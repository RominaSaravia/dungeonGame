const PORT = 3333;
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const maps = require("./getData")

const app = express();
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, "public")));


//Endpoint mainPage
app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});


// endpoint GET Lista de mapas
app.get("/levelMap", (req,res) => {

  maps.getAll( levelMap => {
    
    res.json(levelMap)
  });

})

// Endpoint GET con datos del mapa
app.get("/levelMap/:id", (req,res) => {

  maps.getLevel(req.params.id, levelMap => {

    res.json(levelMap);
  })
})


app.listen(process.env.PORT || PORT, () => {
  console.log("Servidor iniciado en http://localhost:3333");
})