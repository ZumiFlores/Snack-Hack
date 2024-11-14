const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");

//recipe search from https://www.youtube.com/watch?v=DcEzcPmyFC4

const key_api = "0ef537389adb46d7b43f43d08927f5ce";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup",
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Signup successful" });
  });
});

app.post("/login", (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      if (data.length > 0) {
        return res.status(200).json({ message: "Login successful" });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    });
  });


  app.post("/search", async (req, res) => {
    try {
      const { query } = req.body;
      console.log("Received Search Query:", query); // Log incoming query

      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${key_api}`;
      console.log("API URL:", apiUrl); // Log API URL

      const response = await axios.get(apiUrl);
      console.log("Spoonacular API Response:", response.data);

      if (response.data.results.length === 0) {
        return res.status(404).json({ error: "No recipes found" });
      }

      res.status(200).json(response.data.results);
    } catch (error) {
      console.error("Error in /search route:", error.response?.data || error.message); //Debug
      res.status(500).json({ error: "Failed to fetch recipes from Spoonacular API" });
    }
  });


app.get("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${key_api}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
});

app.listen(8081, () => {
  console.log("Server listening on port 8081");
});
