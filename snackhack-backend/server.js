const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcrypt");

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
  const { name, email, password } = req.body;

  // Generate salt and hash password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).json({ error: "Salt generation error" });

    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: "Password hashing error" });

      const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?, ?, ?)";
      db.query(sql, [name, email, hashedPassword], (err, data) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json({ message: "Signup successful" });
      });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM login WHERE `email` = ?";
  db.query(sql, [email], async (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (data.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    try {
      const match = await bcrypt.compare(password, data[0].password);
      if (match) {
        return res.status(200).json({ message: "Login successful" });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      console.error("Password comparison error:", error);
      return res.status(500).json({ message: "Authentication error" });
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

app.post("/favorites", (req, res) => {
  const { userId, recipeId, title, image } = req.body;

  if (!userId || !recipeId || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = "INSERT INTO favorites (`user_id`, `recipe_id`, `title`, `image`) VALUES (?)";
  const values = [userId, recipeId, title, image];

  db.query(sql, [values], (err) => {
    if (err) {
      console.error("Error saving favorite:", err);
      return res.status(500).json({ error: "Failed to save favorite recipe" });
    }
    res.status(200).json({ message: "Favorite saved successfully" });
  });
});

// Retrieve all favorites for a user
app.get("/favorites/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT * FROM favorites WHERE user_id = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error("Error fetching favorites:", err);
      return res.status(500).json({ error: "Failed to fetch favorites" });
    }
    res.status(200).json(data);
  });
});

// Remove a favorite recipe
app.delete("/favorites/:userId/:recipeId", (req, res) => {
  const { userId, recipeId } = req.params;

  const sql = "DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?";
  db.query(sql, [userId, recipeId], (err) => {
    if (err) {
      console.error("Error removing favorite:", err);
      return res.status(500).json({ error: "Failed to remove favorite recipe" });
    }
    res.status(200).json({ message: "Favorite removed successfully" });
  });
});

app.listen(8081, () => {
  console.log("Server listening on port 8081");
});
