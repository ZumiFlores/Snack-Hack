import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

//recipe details from https://www.youtube.com/watch?v=DcEzcPmyFC4

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe details", error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <h2>Ingredients</h2>
      <ul>
        {recipe.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.original}</li>
        ))}
      </ul>
      <h2>Instructions</h2>
      <ol>
        {recipe.analyzedInstructions.length > 0
          ? recipe.analyzedInstructions[0].steps.map((step, index) => (
              <li key={index}>{step.step}</li>
            ))
          : "No instructions available."}
      </ol>
      <a href="/home">Back to Home</a>
    </div>
  );
}

export default RecipeDetails;
