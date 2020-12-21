const PORT = 3333;
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const levelmapRouter = require("./routers/levelmapRouter");

const app = express();

//Middleware recursos estaticos
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json())

//Landing
app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//Routers
app.use("/levelMap", levelmapRouter);


app.listen(process.env.PORT || PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
})