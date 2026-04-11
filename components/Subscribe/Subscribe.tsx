"use client";

import { SubmitEvent, useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(email);
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input
          className="border border-gray-300 rounded-md p-2"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2 rounded-md">
          Subscribe
        </button>
      </form>
    </>
  );
}
