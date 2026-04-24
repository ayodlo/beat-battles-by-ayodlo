"use client";

import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ValidationAlert from "@/components/ValidationAlert/ValidationAlert";
import { useState, ChangeEvent, SubmitEvent } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validTypes = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/wave"];
  const maxSize = 10 * 1024 * 1024;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      setAlert({ message: "No file selected", type: "error" });
      return;
    }

    if (!validTypes.includes(selectedFile.type)) {
      setFile(null);
      setAlert({
        message: "Only WAV and MP3 files are allowed",
        type: "error",
      });
      return;
    }

    if (selectedFile.size > maxSize) {
      setFile(null);
      setAlert({
        message: "File size must be less than 10 MB",
        type: "error",
      });
      return;
    }

    setFile(selectedFile);
    setAlert({
      message: "File selected successfully",
      type: "success",
    });
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setAlert({ message: "Please select a beat first", type: "error" });
      return;
    }

    const battleId = "weekly-battle-001";

    setIsSubmitting(true);
    setAlert({ message: "Preparing upload...", type: "success" });

    fetch("/api/submissions/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        battleId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          throw new Error(data.error || "Could not create upload");
        }

        setAlert({ message: "Uploading beat...", type: "success" });

        return fetch(data.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        }).then((uploadRes) => {
          if (!uploadRes.ok) {
            throw new Error("Upload to S3 failed");
          }

          return {
            fileKey: data.fileKey,
            fileUrl: data.fileUrl,
          };
        });
      })
      .then(({ fileKey, fileUrl }) => {
        setAlert({ message: "Saving submission...", type: "success" });

        return fetch("/api/submissions/finalize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            battleId,
            fileKey,
            fileUrl,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          }),
        });
      })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          throw new Error(data.error || "Could not save submission");
        }

        setAlert({
          message: "Beat submitted successfully",
          type: "success",
        });
      })
      .catch((error: Error) => {
        setAlert({
          message: error.message,
          type: "error",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <SectionContainer>
      <SectionHeading>Drop your beat here</SectionHeading>
      <p>WAV or MP3 files only. Keep it under 10 MB.</p>

      {alert ? (
        <ValidationAlert message={alert.message} type={alert.type} />
      ) : null}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          accept=".wav,.mp3,audio/wav,audio/mpeg"
          className="text-bold bg-gray-200 rounded-md p-2"
          type="file"
          onChange={handleChange}
        />

        <button
          className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Beat"}
        </button>
      </form>
    </SectionContainer>
  );
}
