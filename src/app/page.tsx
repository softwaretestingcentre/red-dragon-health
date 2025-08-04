"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-100 p-6">
      <div className="flex flex-col items-center gap-6 max-w-lg w-full">
        <Image src="/red-dragon-icon.png" alt="Red Dragon Health" width={80} height={80} className="mb-2 rounded-full shadow-lg" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center drop-shadow">Red Dragon Health</h1>
        <p className="text-lg text-gray-700 text-center mb-4">Track your health, diet, and exercise.</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-6">
          <Link href="/health" className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl shadow text-center text-lg transition">Health</Link>
          <Link href="/diet" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl shadow text-center text-lg transition">Diet</Link>
          <Link href="/exercise" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl shadow text-center text-lg transition">Exercise</Link>
        </div>
      </div>
      <footer className="mt-16 text-gray-500 text-sm text-center">
        &copy; {new Date().getFullYear()} Red Dragon Health
      </footer>
    </div>
  );
}
