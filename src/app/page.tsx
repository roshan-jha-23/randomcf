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
  const [selectedEndDifficulty, setSelectedEndDifficulty] = useState<
    number | null
  >(null);
  const [randomProblems, setRandomProblems] = useState<Problem[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDifficulty || !selectedEndDifficulty) {
      alert("Please select both starting and ending difficulty levels.");
      return;
    }

    try {
      const response = await fetch(
        `https://acodedaily.com/api/v2/ladder?startRating=${selectedDifficulty}&endRating=${selectedEndDifficulty+100}`
      );
      const data = await response.json();

      if (data?.data?.length > 0) {
        const selectedProblems: Problem[] = [];
        const problemSet = new Set();

        while (
          selectedProblems.length < 5 &&
          problemSet.size < data.data.length
        ) {
          const randomIndex = Math.floor(Math.random() * data.data.length);
          const randomProblem = data.data[randomIndex];

          if (!problemSet.has(randomIndex)) {
            selectedProblems.push(randomProblem);
            problemSet.add(randomIndex);
          }
        }

        setRandomProblems(selectedProblems);
      } else {
        alert("No problems found for the selected difficulty range.");
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      alert("There was an error fetching the problems.");
    }
  };

  const handleDifficultyChange = (
    event: ChangeEvent<HTMLSelectElement>,
    isEndRange = false
  ) => {
    const value = parseInt(event.target.value, 10);
    isEndRange ? setSelectedEndDifficulty(value) : setSelectedDifficulty(value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-[#d1d1d1] p-6">
      <div className="bg-black border border-[#d1d1d1] shadow-lg rounded-lg p-8 text-center max-w-md w-full">
        <Image
          src="/images.png"
          width={120}
          height={120}
          className="mx-auto mb-6 border-4 border-[#d1d1d1]"
          alt="Logo"
          
        />
        <h1 className="text-3xl font-bold text-[#d1d1d1] mb-6">
          Random CF Question Selector
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full p-3 border border-[#d1d1d1] bg-black text-[#d1d1d1]"
            onChange={(event) => handleDifficultyChange(event, false)}
            defaultValue=""
          >
            <option value="" disabled>
              Starting Range
            </option>
            {[
              800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
              1900, 2000, 2100, 2200, 2300, 2400,
            ].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
          <select
            className="w-full p-3 border border-[#d1d1d1] bg-black text-[#d1d1d1]"
            onChange={(event) => handleDifficultyChange(event, true)}
            defaultValue=""
          >
            <option value="" disabled>
              Ending Range
            </option>
            {[
              800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
              1900, 2000, 2100, 2200, 2300, 2400,
            ].map((rating) => (
              <option value={rating} key={rating}>
                {rating}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full py-3 bg-[#d1d1d1] text-black border border-[#d1d1d1] rounded-lg font-semibold hover:bg-gray-800 hover:text-[#d1d1d1] transition duration-300"
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
              className="bg-black border border-[#d1d1d1] shadow-md rounded-lg p-6 flex flex-col justify-between transform hover:-translate-y-1 hover:shadow-xl transition duration-300"
            >
              <h2 className="text-xl font-semibold text-[#d1d1d1]">
                {problem.name}
              </h2>
              <p className="text-gray-400 mt-2">Rating: {problem.rating}</p>
              <a
                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d1d1d1] hover:underline mt-4"
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
