"use client";

import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ValidationAlert from "@/components/ValidationAlert/ValidationAlert";
import { useState, ChangeEvent, SubmitEvent } from "react";

console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function Upload() {
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null); // alert state to display the alert message and type

  const validTypes = [".wav", ".mp3"]; // valid file types
  const maxSize = 10 * 1024 * 1024; // 10 MB max file size

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // handle file change event
    const file = e.target.files?.[0];
    if (!file) {
      setAlert({ message: "No file selected", type: "error" });
      return;
    }

    if (!validTypes.includes(file.type)) {
      // check if file type is valid
      setAlert({
        message: "Only WAV and MP3 files are allowed",
        type: "error",
      });
      return;
    }

    if (file.size > maxSize) {
      // check if file size is less than 10 MB
      setAlert({ message: "File size must be less than 10 MB", type: "error" });
      return;
    } else {
      // if file is valid, set alert to success and submit the form using the onsubmit event
      setAlert({ message: "File uploaded successfully", type: "success" });
    }
  }
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submitted");
  }
  return (
    <SectionContainer>
      <SectionHeading>Drop your beat here</SectionHeading>
      <p>WAV or MP3 files only. Keep it under 10 MB. </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          accept=".wav, .mp3"
          className="text-bold bg-gray-200 rounded-md p-2"
          type="file"
          onChange={handleChange}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded-md"
          type="submit"
        >
          Submit Beat
        </button>
      </form>
    </SectionContainer>
  );
}
