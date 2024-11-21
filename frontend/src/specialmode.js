import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import darkThemeImage from "./images/SMBG.webp";

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
      className="flex justify-center items-center h-screen bg-yellow-200"
      style={{
        backgroundImage: `url(${darkThemeImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative p-6 rounded-lg shadow-lg border-2 border-red-700 w-[40rem] h-[37rem] bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleClose}
            className="text-red-600 font-bold text-3xl top-0 left-0 absolute"
          >
            <svg
              class="w-[35px] h-[35px]"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
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

        <div className="bg-white p-4 mb-4 rounded-lg border-2">
          <h2 className="text-center font-bold text-lg">Question</h2>
          {questionImageUrl ? (
            <img src={questionImageUrl} alt="Question" className="mx-auto" />
          ) : (
            <p className="text-center">Loading question...</p>
          )}
        </div>

        <div className="flex items-center justify-center space-x-2">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
            Enter Your Answer
          </div>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-2"
            placeholder="Answer"
            disabled={gameOver}
          />
          <button
            onClick={submitAnswer}
            className="bg-yellow-400 px-4 py-2 rounded-lg font-bold"
            disabled={gameOver}
          >
            Enter
          </button>
        </div>

        {correct && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white w-80 h-64 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Game Over</h2>
              <img src="/sd.png" alt="Banana" className="w-20 h-20 mx-auto" />
              <p className="mb-4 mt-2">
                The correct answer was:{" "}
                <span className="text-yellow-400 font-semibold">
                  {solution}
                </span>
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRetry}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Retry
                </button>
                <button
                  onClick={handleClose}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white w-80 h-64 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Game Over</h2>
              <img src="/sd.png" alt="Banana" className="w-20 h-20 mx-auto" />
              <p className="mb-4 mt-2">
                The correct answer was:{" "}
                <span className="text-yellow-400 font-semibold">
                  {solution}
                </span>
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRetry}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Retry
                </button>
                <button
                  onClick={handleClose}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialMode;
