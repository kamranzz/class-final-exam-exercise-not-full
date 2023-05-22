const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const crypto = require("crypto");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
dotenv.config();
app.use(bodyParser.json());

//Artist Schema
const ArtistSchema = new mongoose.Schema({
  name: String,
  age: Number,
  imageURL: String,
});
const ArtistModel = new mongoose.model("Artists", ArtistSchema);


app.get("/api", (req, res) => {
  res.send("welcome to out API!");
});

//ARTISTS CRUD
//GET ALL ARTISTS - MONGO DB
app.get("/api/artists", async (req, res) => {
  const { name } = req.query;
  const artists = await ArtistModel.find();
  if (!name) {
    res.status(200).send(artists);
  } else {
    const searchedArtists = artists.filter((x) =>
      x.name.toLowerCase().trim().includes(name.toLowerCase().trim())
    );
    res.status(200).send(searchedArtists);
  }
});
//GET ARTIST BY ID - MONGO DB
app.get("/api/artists/:id", async(req, res) => {
  const { id } = req.params;
  const artist = await ArtistModel.findById(id)
  res.status(200).send(artist);
});
//DELETE ARTIST - MONGO DB
app.delete("/api/artists/:id",async(req, res) => {
  const id = req.params.id;
  //delete
  const deleteArtist = await ArtistModel.findByIdAndDelete(id);
  res.status(203).send({
    message: `${deleteArtist.name} deleted successfully!`,
  });
});
//POST ARTIST - MONGO DB
app.post("/api/artists", async (req, res) => {
  const { name, age, imageURL } = req.body;
  const newArtist = new ArtistModel({
    name: name,
    age: age,
    imageURL: imageURL,
  });
  await newArtist.save();
  res.status(201).send({
    message: `${newArtist.name} posted successfully`,
    payload: newArtist,
  });
});
//EDIT ARTIST - MONGO DB
app.put("/api/artists/:id", async(req, res) => {
  const id = req.params.id;
  const { name, age, imageURL } = req.body;
  const updatingArtist = {name:name,age:age,imageURL:imageURL};
  await ArtistModel.findByIdAndUpdate(id,updatingArtist);
  res.status(200).send(`${updatingArtist.name} updated successfully!`);
});

PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App running on PORT: ${PORT}`);
});

DB_PASSWORD = process.env.DB_PASSWORD;
DB_CONNECTION = process.env.DB_CONNECTION;

mongoose.connect(DB_CONNECTION.replace("<password>", DB_PASSWORD)).then(() => {
  console.log("Mongo DB connected!!!");
});