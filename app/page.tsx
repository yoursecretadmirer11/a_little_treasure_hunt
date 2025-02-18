"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [stageTransition, setStageTransition] = useState("");

  useEffect(() => {
    setStageTransition("entering");
    setTimeout(() => {
      setStageTransition("");
    }, 1000);
  }, []);

  const getTransitionClasses = () => {
    if (stageTransition === "leaving") {
      return "opacity-0 transform translate-y-10";
    }
    if (stageTransition === "entering") {
      return "animate-scale-in";
    }
    return "transition-all-slow";
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className={`max-w-md w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 mx-2 ${getTransitionClasses()}`}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-pink-600 mb-6 sm:mb-8">
          Time&apos;s Up! 💝
        </h1>

        <div className="space-y-6 text-center">
          <div className="bg-pink-50 p-4 sm:p-6 rounded-lg">
            <p className="text-sm sm:text-base text-gray-800 whitespace-pre-line leading-relaxed">
              Bravo, detective! 🕵️‍♀️🎉 You found the codes—and outsmarted my
              sneakiest clues. But alas, the clock&apos;s run out (insert tiny
              tear here… or maybe it&apos;s just confetti? 🎊😉).
            </p>
          </div>

          <div className="bg-pink-50/50 p-4 sm:p-6 rounded-lg border border-pink-100">
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed">
              If you still want to chase the &apos;who&apos; behind it all? Go
              forth! Though the &apos;official&apos; prize has retired to a life
              of beachside naps 🏖️🍹, I&apos;ll never stop a curious mind. And
              hey… maybe the biggest mystery isn&apos;t the codes, but the
              person who made them? (🔍👀… just saying.)
            </p>
          </div>

          <div className="bg-pink-50/30 p-4 sm:p-6 rounded-lg">
            <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line leading-relaxed italic">
              Thanks for playing along with my little game. Even if time&apos;s
              up, I&apos;ll cling to the hope that I made you laugh… or at least
              smirk. Until next adventure—keep being the kind of person who
              turns riddles into magic…
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
