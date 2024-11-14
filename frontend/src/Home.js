import React, { useState } from "react";
import axios from "axios";

//recipe search from https://www.youtube.com/watch?v=DcEzcPmyFC4

function Home() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setRecipes([]);
    console.log("Search Query:", query);

    if (!query) {
      setError("Search query cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/search", { query });
      console.log("Search Response:", response.data);

      if (response.data.length > 0) {
        setRecipes(response.data);
      } else {
        setError("No recipes found. Try a different search term.");
      }
    } catch (err) {
      console.error("Error fetching recipes:", err.response?.data || err.message);
      setError("Failed to fetch recipes. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#F0FFF0" }} className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-3 rounded w-50">
        <h1 className="text-center"><strong>Recipe Search</strong></h1>
        <form onSubmit={handleSearch}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for recipes" className="form-control"
          />
          <button type="submit" className="btn btn-success mt-2">Search</button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>} {/* Display errors */}
        <ul className="mt-4">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <a href={`/recipes/${recipe.id}`}>
                <div className="recipe-card">
                  <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                  <h2>{recipe.title}</h2>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
