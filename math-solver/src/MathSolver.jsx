import React, { useState } from "react";
import { evaluate, simplify, parse } from "mathjs";
import { motion } from "framer-motion";

export default function MathSolver() {
  const [input, setInput] = useState("");
  const [solution, setSolution] = useState(null);

  const solveMath = () => {
    try {
      const parsed = parse(input);
      let steps = [{ step: "Original Expression", expression: parsed.toString() }];
  
      let simplified = parsed;
      for (let i = 0; i < 5; i++) {
        let nextStep = simplify(simplified);
        if (nextStep.toString() === simplified.toString()) break;
        simplified = nextStep;
        steps.push({ step: `Step ${i + 1}`, expression: simplified.toString() });
      }
  
      const result = evaluate(input);
      steps.push({ step: "Final Result", expression: result });
  
      setSolution(steps);
    } catch (error) {
      setSolution([{ step: "Error", expression: "Invalid equation!" }]);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      <motion.h1 
        className="text-3xl font-bold mb-4 text-blue-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Math Problem Solver
      </motion.h1>
    <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter math problem..."
        className="border p-3 rounded-md w-80 text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

      <motion.button
        onClick={solveMath}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        whileHover={{ scale: 1.1 }}
      >
        Solve
      </motion.button>
      {solution && (
        <motion.div 
          className="mt-4 p-4 bg-white text-black shadow-md rounded-md w-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {solution.map((s, index) => (
            <motion.div 
              key={index} 
              className="mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <p className="font-bold text-blue-600">{s.step}:</p>
              <p className="text-gray-800">{s.expression}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
