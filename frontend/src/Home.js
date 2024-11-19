import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [query, setQuery] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [viewFavorites, setViewFavorites] = useState(false);

  // Ref to save scroll position
  const scrollPositionRef = useRef(0);

  // Load favorites and ingredients from localStorage on initial render
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const storedIngredients = JSON.parse(localStorage.getItem("ingredients")) || [];
    setFavorites(storedFavorites);
    setIngredients(storedIngredients);
  }, []);

  // Save favorites and ingredients to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
  }, [favorites, ingredients]);

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

    if (ingredients.length === 0) {
      setError("Please add at least one ingredient before searching.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/search", { query: ingredients });
      if (response.data.length > 0) {
        setRecipes(response.data);
      } else {
        setError("No recipes found. Try different ingredients.");
      }
    } catch (err) {
      setError("Failed to fetch recipes. Please try again.");
    }
  };

  const handleFavorite = (recipe) => {
    if (favorites.some((fav) => fav.id === recipe.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== recipe.id)); // Remove from favorites
    } else {
      setFavorites([...favorites, recipe]); // Add to favorites
    }
  };

  const toggleViewFavorites = () => {
    // Save current scroll position before switching views
    scrollPositionRef.current = window.scrollY;
    setViewFavorites(!viewFavorites);
    // Scroll back to the saved position when returning
    setTimeout(() => window.scrollTo(0, scrollPositionRef.current), 0);
  };

  return (
    <div style={{ backgroundColor: "#F0FFF0" }} className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-3 rounded d-flex flex-column w-75">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
          {viewFavorites ? (
            <button className="btn btn-link" onClick={toggleViewFavorites}>
              ← Back
            </button>
          ) : (
            <h1 className="text-start"></h1>
          )}
          <button className="btn btn-link" onClick={toggleViewFavorites}>
            {viewFavorites ? "Search" : "View Favorites"}
          </button>
        </div>

        {/* Main Content */}
        <div className="d-flex">
          {/* Left Side: Recipes */}
          <div className="recipe-list-container me-3">
            <h2 className="text-center">
              <strong>{viewFavorites ? "Favorites" : "Recipes"}</strong>
            </h2>
            {recipes.length === 0 && !viewFavorites && !error && <p>No recipes to display. Add ingredients and search!</p>}
            {viewFavorites && favorites.length === 0 && <p>No favorites yet. Start favoriting recipes!</p>}
            {error && <p className="text-danger mt-3">{error}</p>}
            <ul className="recipe-list">
              {(viewFavorites ? favorites : recipes).map((recipe) => (
                <li key={recipe.id} className="recipe-item">
                  <div className="recipe-card">
                    <a href={`/recipes/${recipe.id}`} className="recipe-link">
                      <img src={recipe.image} alt={recipe.title} className="recipe-image-small" />
                    </a>
                    <div className="recipe-info">
                      <a href={`/recipes/${recipe.id}`} className="recipe-link">
                        <h5>{recipe.title}</h5>
                      </a>
                      <button
                        className={`favorite-btn ${favorites.some((fav) => fav.id === recipe.id) ? "favorited" : ""}`}
                        onClick={() => handleFavorite(recipe)}
                      >
                        {favorites.some((fav) => fav.id === recipe.id) ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Search Form */}
          {!viewFavorites && (
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
                <button type="submit" className="btn btn-success mt-3 w-100">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
