// controllers/image.js
import fetch from "node-fetch"; // if you're using ES modules
// OR if using CommonJS syntax, use:
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const PAT = process.env.CLARIFAI_PAT; // Personal Access Token from Clarifai
const USER_ID = process.env.CLARIFAI_USER_ID; 
const APP_ID = process.env.CLARIFAI_APP_ID; 
const MODEL_ID = "face-detection";

// Handle the call to Clarifai API
const handleApiCall = async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json("No image URL provided");
  }

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID
    },
    inputs: [{ data: { image: { url: input } } }]
  });

  try {
    const response = await fetch(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Key " + PAT,
        },
        body: raw,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Clarifai error:", text);
      return res.status(400).json("Clarifai request failed");
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json("Unable to work with API");
  }
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

export { handleImage, handleApiCall };



/* const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'b8d3001245ac41158ae89f99d4c524f5'
 });

 const handleApiCall = (req, res) => {
 app.models
  .predict('face-detection', req.body.input)
  .then(data => {
    res.json(data);
  })
  .catch(err => res.status(400).json('unable to work with API'))
 }

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
  }

  module.exports = {
    handleImage,
    handleApiCall
  } */
