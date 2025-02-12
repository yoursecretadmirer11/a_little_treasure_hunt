"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const gameData = {
  clues: [
    `Parlez-vous français? Or… maybe not? Five years should have been enough to learn it, but hey, we all have our blind spots. Though, if you’ve been paying attention, the teacher’s been talking to the walls this whole time—and who knows? They might just talk back.`,
    "Some say the Great Wall of China is the greatest wall in the world. But I’d argue—nope, not even close! The real greatest wall is right here, adorned with the faces of literary legends like Ivan Vazov, Nikola Vaptsarov, and Peyo Yavorov. (Move over, China, we’ve got poets!) And if you look around, you might mistake this room for the Opera—thanks to all those student theatrical plays. Who needs Broadway when you’ve got… well, this?",
    "Integrals? Matrices? Vectors? Probabilities? What the frick is even happening here? 😂 I mean, at least math has the decency to be orange—because nothing says ‘fun’ like a color that screams, ‘Hey, I’m complicated but kinda cute!’ And let’s not forget the ultimate perk of math: if you survive this chaos, you might just become ridiculously rich.💸✨ Who knew numbers could be your ticket to a private island?",
    "Okay, okay, I might have fibbed a little about everything being on paper. But can you blame me? I’m just a little silly like that. 😋 Back on track now! The last code is hiding in a place where no one dares to tread—some say it’s haunted by a bunch of scary teachers. (Legends speak of their terrifying red pens, endless yapping sessions and worst of all - projects!) But hey, at least they’ve got… uhh… super boring computers? Silver lining: you can totally sneak in a browser game or two. And who knows? Maybe this time, Drive D (or whatever it’s called) will come to your rescue. Good luck, brave adventurer! 🕵️‍♀️✨",
  ],
  codes: [
    process.env.NEXT_PUBLIC_CODE_1 || "",
    process.env.NEXT_PUBLIC_CODE_2 || "",
    process.env.NEXT_PUBLIC_CODE_3 || "",
    process.env.NEXT_PUBLIC_CODE_4 || "",
  ],
};

const FoundCodes = ({
  currentLevel,
  codes,
}: {
  currentLevel: number;
  codes: string[];
}) => {
  if (currentLevel === 0) return null;

  return (
    <div className="mt-6 p-4 bg-pink-50/50 rounded-lg">
      <h3 className="text-sm font-medium text-pink-600 mb-2">Found Codes:</h3>
      <div className="space-y-1">
        {codes.slice(0, currentLevel).map((code, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs text-gray-600">#{index + 1}:</span>
            <code className="text-xs font-mono bg-white px-2 py-1 rounded border border-pink-200 text-black font-semibold">
              {code}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [inputCode, setInputCode] = useState("");
  const [message, setMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAborted, setIsAborted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stageTransition, setStageTransition] = useState("");
  const [showAbortWarning, setShowAbortWarning] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const savedState = localStorage.getItem("valentineHuntState");
    if (savedState) {
      const { level, started, completed, permanentlyAborted } =
        JSON.parse(savedState);
      if (permanentlyAborted) {
        setIsAborted(true);
        return;
      }
      setCurrentLevel(level);
      setHasStarted(started);
      setIsComplete(completed);
    }
  }, []);

  // Save progress whenever important state changes
  useEffect(() => {
    localStorage.setItem(
      "valentineHuntState",
      JSON.stringify({
        level: currentLevel,
        started: hasStarted,
        completed: isComplete,
        permanentlyAborted: isAborted,
      })
    );
  }, [currentLevel, hasStarted, isComplete, isAborted]);

  const handleStart = () => {
    setStageTransition("leaving");
    setTimeout(() => {
      setHasStarted(true);
      setStageTransition("entering");
    }, 500);
    setTimeout(() => {
      setStageTransition("");
    }, 1000);
  };

  const handleAbort = () => {
    setStageTransition("leaving");
    setTimeout(() => {
      setIsAborted(true);
      setStageTransition("entering");
    }, 500);
    setTimeout(() => {
      setStageTransition("");
    }, 1000);
  };

  const handleAbortAttempt = () => {
    setShowAbortWarning(true);
  };

  const confirmAbort = () => {
    setShowAbortWarning(false);
    handleAbort();
  };

  const cancelAbort = () => {
    setShowAbortWarning(false);
  };

  const resetProgress = () => {
    localStorage.removeItem("valentineHuntState");
    setCurrentLevel(0);
    setHasStarted(false);
    setIsComplete(false);
    setMessage("");
  };

  const checkCode = () => {
    const submittedCode = inputCode.trim();
    const correctCode = gameData.codes[currentLevel];

    if (submittedCode === correctCode) {
      if (currentLevel === gameData.codes.length - 1) {
        setStageTransition("leaving");
        setTimeout(() => {
          setIsComplete(true);
          setStageTransition("entering");
        }, 500);
        setTimeout(() => {
          setStageTransition("");
        }, 1000);
      } else {
        setMessage("Correct! Here's your next clue! 💕");
        setIsTransitioning(true);

        // Delay the clue change to allow for transition
        setTimeout(() => {
          setCurrentLevel((prev) => prev + 1);
          setIsTransitioning(false);
          setMessage(""); // Clear the success message after transition
        }, 1000);
      }
    } else {
      setMessage("That's not quite right. Try again! 💝");
    }
    setInputCode("");
  };

  const getTransitionClasses = () => {
    if (stageTransition === "leaving") {
      return "opacity-0 transform translate-y-10";
    }
    if (stageTransition === "entering") {
      return "animate-scale-in";
    }
    return "transition-all-slow";
  };

  // Clear message when changing levels
  useEffect(() => {
    setMessage("");
  }, [currentLevel]);

  if (isAborted) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-2 sm:p-4">
        <div
          className={`max-w-md w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 mx-2 ${getTransitionClasses()}`}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4">
            No worries! 😊
          </h2>
          <p className="text-gray-700 mb-4">
            No judgement, we've been there! Maybe next time?
            <br />
            <span className="text-sm italic mt-2 block">
              *awkwardly moonwalks away*
            </span>
          </p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-2 sm:p-4">
        {showAbortWarning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 m-4 max-w-sm w-full space-y-4 animate-scale-in">
              <h3 className="text-xl font-bold text-pink-600">
                ⚠️ Wait a second!
              </h3>
              <p className="text-gray-700">
                Are you sure you want to give up? Like, 100% sure-sure? Because
                this is it—no take-backs, no do-overs, no ‘oops, I changed my
                mind!’ Once you click that button, it’s game over. 🚫🔄 But hey,
                no pressure! (Okay, maybe a little pressure.) So… what’ll it be?
                Brave adventurer or… well, not? Choose wisely! ✨
                <br />
                <span className="text-sm italic mt-2 block">
                  (Like, for real. You won't be able to try again!)
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmAbort}
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Yes, I'm Sure
                </button>
                <button
                  onClick={cancelAbort}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  No, Keep Playing
                </button>
              </div>
            </div>
          </div>
        )}
        <div
          className={`max-w-md w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 mx-2 ${getTransitionClasses()}`}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-pink-600 mb-4 sm:mb-6">
            Valentine's Treasure Hunt 💝
          </h1>
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Welcome to this special Valentine's adventure! Here's what you
              need to know:
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
              <li>
                All clues are written on paper and hidden around the school
              </li>
              <li>Each clue will lead you to the next location</li>
              <li>
                Enter the code found at each location to unlock the next clue
              </li>
              <li>
                Hint: Even though the website saves the current game state
                locally, it is a good idea to take pictures of the codes you've
                found!
              </li>
            </ul>
            <p className="text-xs sm:text-sm text-gray-600 italic">
              Take your time and enjoy the journey! 🌹
            </p>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={handleStart}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              {currentLevel > 0 ? "Continue Adventure" : "Start the Adventure"}
            </button>
            {currentLevel > 0 && (
              <button
                onClick={resetProgress}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Start Over
              </button>
            )}
            <button
              onClick={handleAbortAttempt}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Maybe Another Time
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-2 sm:p-4">
        <div
          className={`max-w-md w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 mx-2 ${getTransitionClasses()}`}
        >
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-pink-600">
              Congratulations! 🎉
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              You've completed the Valentine's treasure hunt!
              <br />
              Your love has guided you through each clue,
              <br />
              Now here's my heart, forever true! ❤️
            </p>

            <FoundCodes
              currentLevel={gameData.codes.length}
              codes={gameData.codes}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-2 sm:p-4">
      {showAbortWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 m-4 max-w-sm w-full space-y-4 animate-scale-in">
            <h3 className="text-xl font-bold text-pink-600">
              ⚠️ Wait a second!
            </h3>
            <p className="text-gray-700">
              Are you sure you want to give up? Like, 100% sure-sure? Because
              this is it—no take-backs, no do-overs, no ‘oops, I changed my
              mind!’ Once you click that button, it’s game over. 🚫🔄 But hey,
              no pressure! (Okay, maybe a little pressure.) So… what’ll it be?
              Brave adventurer or… well, not? Choose wisely! ✨
              <br />
              <span className="text-sm italic mt-2 block">
                (Like, for real. You won't be able to try again!)
              </span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmAbort}
                className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Yes, I'm Sure
              </button>
              <button
                onClick={cancelAbort}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                No, Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`max-w-md w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 mx-2 ${getTransitionClasses()}`}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-pink-600 mb-4 sm:mb-8">
          Valentine's Treasure Hunt 💝
        </h1>

        {!isComplete ? (
          <>
            <div
              className={`bg-pink-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 transition-opacity duration-500 ease-in-out ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <p className="text-sm sm:text-base text-gray-800 whitespace-pre-line text-center">
                {gameData.clues[currentLevel]}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter the code..."
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 text-black placeholder-gray-500 font-medium"
                disabled={isTransitioning}
              />

              <button
                onClick={checkCode}
                disabled={isTransitioning}
                className={`w-full bg-pink-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-pink-700 transition-all duration-300 text-sm sm:text-base ${
                  isTransitioning ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Submit Code
              </button>

              {message && (
                <p className="text-center text-pink-600 font-medium text-sm sm:text-base animate-fade-in">
                  {message}
                </p>
              )}
            </div>

            <FoundCodes currentLevel={currentLevel} codes={gameData.codes} />

            <button
              onClick={handleAbortAttempt}
              className="w-full mt-4 text-xs sm:text-sm text-gray-500 hover:text-gray-700"
            >
              Need to stop? (No judgement, we've been there!)
            </button>
          </>
        ) : (
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-pink-600">
              Congratulations! 🎉
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Congratulations, treasure hunter! 🎉 You’ve cracked the codes,
              solved the puzzles, and made it to the end! Your prize? Well…
              absolutely nothing. For now. 😉 But if you’re curious about who
              your secret admirer is (and let’s be real, who wouldn’t be?),
              you’ve got all the pieces you need to figure it out. So put on
              your detective hat, grab a magnifying glass, and get to searching!
              The mystery is yours to solve. 🕵️‍♀️✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
