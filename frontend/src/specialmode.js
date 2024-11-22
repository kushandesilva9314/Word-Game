import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import darkThemeImage from "./images/SMBG.webp";
import { FaTrophy, FaRegSadTear } from "react-icons/fa";

const SpecialMode = () => {
  const navigate = useNavigate();
  const [questionImageUrl, setQuestionImageUrl] = useState(null);
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [correct, setCorrect] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        "https://marcconrad.com/uob/banana/api.php"
      );
      setQuestionImageUrl(response.data.question);
      setSolution(response.data.solution);
      setCorrect(null);
      setUserAnswer("");
      setGameOver(false);
    } catch (error) {
      console.error("Failed to fetch question:", error);
    }
  };

  const handleRetry = () => {
    fetchQuestion();
  };

  const handleClose = () => {
    navigate("/home");
  };

  const submitAnswer = () => {
    if (parseInt(userAnswer) === solution) {
      setCorrect(true);
    } else {
      setCorrect(false);
      setGameOver(true);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: `url(${darkThemeImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg border border-gray-700 w-[40rem]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Special Mode</h1>
          <button
            onClick={handleClose}
            className="text-red-500 hover:text-red-600"
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 48 48"
            >
              <path
                fill="#F44336"
                d="M21.5 4.5H26.501V43.5H21.5z"
                transform="rotate(45.001 24 24)"
              ></path>
              <path
                fill="#F44336"
                d="M21.5 4.5H26.5V43.501H21.5z"
                transform="rotate(135.008 24 24)"
              ></path>
            </svg>
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-700 mb-6">
          <h2 className="text-center text-lg font-semibold mb-4">Solve the problem</h2>
          {questionImageUrl ? (
            <img
              src={questionImageUrl}
              alt="Question"
              className="mx-auto rounded-lg"
            />
          ) : (
            <p className="text-center">Loading question...</p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
            placeholder="Enter your answer"
            disabled={gameOver}
          />
          <button
            onClick={submitAnswer}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold"
            disabled={gameOver}
          >
            Submit
          </button>
        </div>

        {/* Win Modal */}
        {correct && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold text-yellow-500 mb-4">
                Congratulations! You Won!
              </h2>
              <FaTrophy className="text-yellow-400 mx-auto text-6xl mb-4" />
              <button
                onClick={handleRetry}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mx-2"
              >
                Play Again
              </button>
              <button
                onClick={handleClose}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 mx-2"
              >
                Exit
              </button>
            </div>
          </div>
        )}

        {/* Lose Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Game Over
              </h2>
              <FaRegSadTear className="text-red-500 mx-auto text-6xl mb-4" />
              <p className="text-white mb-4">
                The correct answer was:{" "}
                <span className="text-yellow-400 font-semibold">
                  {solution}
                </span>
              </p>
              <button
                onClick={handleRetry}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mx-2"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 mx-2"
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialMode;
