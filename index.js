const mongoose = require('mongoose');
const fs = require("fs");

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://127.0.0.1/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })
  .then(async () => {
    const myRecipe = await Recipe.create({
      "title": "Corn Flakes and Milk",
      "level": "Easy Peasy",
      "ingredients": [
        "1 cup Corn Flakes",
        "1/2 cup 2% milk",
      ],
      "cuisine": "American",
      "dishType": "breakfast",
      "image": "",
      "duration": 1,
      "creator": "Chef Aipamferchillais"
    })
    console.log("\n", myRecipe.title, "\n")

    const batchInsert = await Recipe.insertMany(data)
    batchInsert.forEach(recipe => console.log(recipe.title))

    const rigatoni = await Recipe.findOneAndUpdate(
      {title: "Rigatoni alla Genovese"},
      {duration: 100},
      {new: true}
    )
    console.log("\n", `${rigatoni.title} recipe is now ${rigatoni.duration}mn long, as it should be.`, "\n")
    
    const missionReport = await Recipe.deleteOne({title: "Carrot Cake"})
    if (missionReport.deletedCount === 1) {
      console.log("Carrot Cake is down! Over.", "\n")
    }
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  })
  .finally(() => {
    console.log("closing connection")
    mongoose.connection.close()
  });
