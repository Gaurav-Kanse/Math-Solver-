import React, { useState } from "react";
import axios from "axios";

export default function MathSolver() {
  const [input, setInput] = useState("");
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);

  const solveMath = async () => {
    if (!input.includes("=")) {
      setSolution([{ step: "Error", expression: "Invalid equation! Make sure to include '=' in your equation." }]);
      return;
    }
  
    try {
      const apiKey = "AIzaSyAogr3pbVFneitVQxgpDlTtJr8-Vf1auuYq"; // Replace with your actual API key
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Solve for x in the equation: ${input}. Show all steps.`,
          max_tokens: 100,
          temperature: 0.2
        }),
      });
  
      const data = await response.json();
  
      if (data && data.candidates && data.candidates.length > 0) {
        const solutionText = data.candidates[0].output;
        setSolution([{ step: "Solution", expression: solutionText }]);
      } else {
        setSolution([{ step: "Error", expression: "Could not solve the equation. Try again!" }]);
      }
    } catch (error) {
      console.error("Error solving math problem:", error);
      setSolution([{ step: "Error", expression: "Something went wrong. Please try again!" }]);
    }
  };  

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-2">Math Solver 🔢</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a math problem..."
        className="w-full p-2 border rounded-md"
      />
      <button
        onClick={solveMath}
        className="mt-3 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Solving..." : "Solve"}
      </button>
      {solution && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <strong>Solution:</strong>
          <p className="mt-1">{solution}</p>
        </div>
      )}
    </div>
  );
}
