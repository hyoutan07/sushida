import Link from "next/link";
import React from "react";

const Opening = () => {
  return (
    <div className="bg-pink-200 min-h-screen flex flex-col items-center justify-center p-4 border-4 border-pink-500">
      <div className="bg-pink-400 text-white text-8xl font-bold px-10 py-6 rounded-lg shadow-lg border-4 border-pink-600">
        西打
      </div>
      <div className="mt-12 flex flex-col space-y-6">
        <button className="bg-pink-500 text-white text-2xl font-bold px-8 py-4 rounded-lg shadow-md hover:bg-pink-600">
          <Link href="/difficultyLevel">
            スタート
          </Link>
        </button>
        <button className="bg-pink-100 text-pink-800 text-2xl font-bold px-8 py-4 rounded-lg shadow-md hover:bg-pink-200">
          遊び方
        </button>
      </div>
    </div>
  );
};

export default Opening;
