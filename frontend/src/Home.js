import React, { useState } from "react";
import axios from "axios";
import "./Home.css"; // Add custom styles if needed

function Home() {
  const [query, setQuery] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const handleInput = (e) => {
    setQuery(e.target.value);
  };

  const handleAddIngredient = (e) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      if (!ingredients.includes(query.trim())) {
        setIngredients([...ingredients, query.trim()]);
        setQuery(""); // Clear input after adding
      }
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setRecipes([]);
    console.log("Ingredients to search:", ingredients);

    if (ingredients.length === 0) {
      setError("Please add at least one ingredient before searching.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/search", { query: ingredients });
      console.log("Search Response:", response.data);

      if (response.data.length > 0) {
        setRecipes(response.data);
      } else {
        setError("No recipes found. Try different ingredients.");
      }
    } catch (err) {
      console.error("Error fetching recipes:", err.response?.data || err.message);
      setError("Failed to fetch recipes. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#F0FFF0" }} className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-3 rounded d-flex w-75">
        {/* Left Side: Recipes */}
        <div className="recipe-list-container me-3">
          <h2 className="text-center"><strong>Recipes</strong></h2>
          {recipes.length === 0 && !error && <p>No recipes to display. Add ingredients and search!</p>}
          {error && <p className="text-danger mt-3">{error}</p>}
          <ul className="recipe-list">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="recipe-item">
                <a href={`/recipes/${recipe.id}`}>
                  <div className="recipe-card">
                    <img src={recipe.image} alt={recipe.title} className="recipe-image-small" />
                    <h5>{recipe.title}</h5>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Search Form */}
        <div className="search-container">
          <h1 className="text-center"><strong>Recipe Search</strong></h1>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={handleInput}
              onKeyDown={handleAddIngredient}
              placeholder="Add ingredients and press Enter"
              className="form-control"
            />
            <div className="ingredient-bubbles mt-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="ingredient-bubble"
                  onClick={() => handleRemoveIngredient(ingredient)}
                >
                  {ingredient} ✖
                </span>
              ))}
            </div>
            <button type="submit" className="btn btn-success mt-3 w-100">Search</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
