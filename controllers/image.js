const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Clarifai constants 
const PAT = process.env.CLARIFAI_PAT || "f8fca67536e5494fac6d5f53829884ee";
const USER_ID = "clarifai";
const APP_ID = "main";
const MODEL_ID = "face-detection";
const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

// API CALL HANDLER 
const handleApiCall = async (req, res) => {
  const { input } = req.body; // frontend sends { input: "https://..." }

  if (!input) {
    return res.status(400).json("No image URL provided");
  }

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: input,
          },
        },
      },
    ],
  });

  try {
    const response = await fetch(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Key " + PAT,
        },
        body: raw,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Clarifai API error:", result);
      return res.status(400).json("Unable to work with Clarifai API");
    }

    res.json(result);
  } catch (error) {
    console.error("Error calling Clarifai:", error);
    res.status(400).json("Unable to work with API");
  }
};

//  DATABASE HANDLER 
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
