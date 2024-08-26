"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

interface Problem {
  contestId: number;
  index: string;
  name: string;
  rating: number;
}

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null
  );
  const [randomProblems, setRandomProblems] = useState<Problem[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDifficulty) {
      alert("Please select a difficulty level.");
      return;
    }

    try {
      const response = await fetch(
        `https://acodedaily.com/api/v2/ladder?startRating=${selectedDifficulty}&endRating=${
          selectedDifficulty + 100
        }`
      );
      const data = await response.json();
      console.log("Fetched Data:", data);

      if (data?.data?.length > 0) {
        const selectedProblems: Problem[] = [];
        for (let i = 0; i < 5; i++) {
          const randomProblem =
            data.data[Math.floor(Math.random() * data.data.length)];
          selectedProblems.push(randomProblem);
        }
        setRandomProblems(selectedProblems);
      } else {
        alert("No problems found for the selected difficulty.");
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      alert("There was an error fetching the problems.");
    }
  };

  const handleDifficultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(parseInt(event.target.value, 10));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
        <Image
          src="/images.png"
          width={120}
          height={120}
          className="mx-auto mb-6 rounded-full border-4 border-gray-200"
          alt="Logo"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Random CF Question Selector
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700"
            onChange={handleDifficultyChange}
            defaultValue=""
          >
            <option value="" disabled>
              Select Difficulty
            </option>
            {[800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600].map(
              (rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              )
            )}
          </select>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>

      {randomProblems.length > 0 && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full px-4">
          {randomProblems.map((problem, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between transform hover:-translate-y-1 hover:shadow-xl transition duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {problem.name}
              </h2>
              <p className="text-gray-600 mt-2">Rating: {problem.rating}</p>
              <a
                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline mt-4"
              >
                Go to Problem
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
