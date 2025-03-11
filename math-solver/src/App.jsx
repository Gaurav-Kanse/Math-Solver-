import React, { useState } from "react";
import { evaluate, parse } from "mathjs";
import { motion } from "framer-motion";

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {page === "landing" ? <LandingPage setPage={setPage} /> : <MathSolver />}
    </div>
  );
}

function LandingPage({ setPage }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-screen flex flex-col items-center justify-center text-center"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1608792992053-f397e328a56d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-5xl font-bold text-blue-400 relative z-10"
      >
        Welcome to Math Solver
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-lg text-gray-300 mt-4 relative z-10"
      >
        Solve math problems step by step with ease.
      </motion.p>
      <motion.button
        onClick={() => setPage("solver")}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 relative z-10"
        whileHover={{ scale: 1.1 }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}

function MathSolver() {
  const [input, setInput] = useState("");
  const [solution, setSolution] = useState(null);
  const [history, setHistory] = useState([]);

  const solveMath = () => {
    try {
      const parsed = parse(input);
      let steps = [{ step: "Original Expression", expression: parsed.toString() }];

      let tokens = input.match(/\d+|[-+*/()]/g);
      if (!tokens) throw new Error("Invalid input");

      let currentExpression = "";
      let runningTotal = 0;
      let operator = null;
      
      for (let token of tokens) {
        if (!isNaN(token)) {
          if (operator === null) {
            runningTotal = parseFloat(token);
          } else {
            if (operator === "+") runningTotal += parseFloat(token);
            else if (operator === "-") runningTotal -= parseFloat(token);
            else if (operator === "*") runningTotal *= parseFloat(token);
            else if (operator === "/") runningTotal /= parseFloat(token);
          }
          currentExpression += ` ${token}`;
        } else {
          operator = token;
          currentExpression += ` ${operator}`;
        }
        steps.push({ step: `Step ${steps.length}`, expression: currentExpression.trim() });
      }
      
      steps.push({ step: "Final Result", expression: runningTotal.toString() });
      setSolution(steps);
      setHistory([...history, { question: input, answer: steps }]);
    } catch (error) {
      setSolution([{ step: "Error", expression: "Invalid equation!" }]);
    }
  };

  const resetSolver = () => {
    setInput("");
    setSolution(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center justify-center p-6 min-h-screen w-full text-white overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1608792992053-f397e328a56d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-blue-400 relative z-10">Math Problem Solver</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter math problem..."
        className="border p-3 rounded-md w-80 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
      />
      <motion.button
        onClick={solveMath}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 relative z-10"
        whileHover={{ scale: 1.1 }}
      >
        Solve
      </motion.button>
      <motion.button
        onClick={resetSolver}
        className="mt-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 relative z-10"
        whileHover={{ scale: 1.1 }}
      >
        Reset
      </motion.button>
      {solution && (
        <motion.div className="mt-4 p-4 bg-white text-black shadow-md rounded-md w-80 relative z-10">
          {solution.map((s, index) => (
            <div key={index} className="mb-2">
              <p className="font-bold text-blue-600">{s.step}:</p>
              <p className="text-gray-800">{s.expression}</p>
            </div>
          ))}
        </motion.div>
      )}
      {history.length > 0 && (
        <div className="mt-6 w-80 bg-gray-800 p-4 rounded-md relative z-10">
          <h2 className="text-lg font-bold text-blue-400">Previous Solutions</h2>
          {history.map((h, index) => (
            <p key={index} className="text-gray-300 mt-2">{h.question}</p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
