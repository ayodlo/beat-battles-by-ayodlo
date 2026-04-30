"use client";

import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ValidationAlert from "@/components/ValidationAlert/ValidationAlert";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

type BattleStatus = "open" | "closed";

type Battle = {
  id: string;
  title: string;
  slug: string;
  status: BattleStatus;
  endsAt: string;
};

export default function Upload() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [battle, setBattle] = useState<Battle | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingBattle, setIsCheckingBattle] = useState(true);

  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const validTypes = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/wave"];
  const maxSize = 10 * 1024 * 1024;

  useEffect(() => {
    fetch("/api/battles/current")
      .then((res) => res.json())
      .then((data) => {
        setBattle(data.battle);

        if (!data.battle) {
          return null;
        }

        return fetch(`/api/submissions/me?battleId=${data.battle.id}`)
          .then((res) => res.json())
          .then((submissionData) => {
            setHasSubmitted(submissionData.hasSubmitted);
          });
      })
      .catch(() => {
        setAlert({
          message: "Could not check battle status",
          type: "error",
        });
      })
      .finally(() => {
        setIsCheckingBattle(false);
      });
  }, []);

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!battle) {
      setAlert({
        message: "No battle is currently open for submissions.",
        type: "error",
      });
      return;
    }

    if (battle.status !== "open") {
      setAlert({
        message: "Submissions are currently closed.",
        type: "error",
      });
      return;
    }

    if (hasSubmitted) {
      setAlert({
        message: "You have already submitted a beat for this week.",
        type: "error",
      });
      return;
    }

    if (!file) {
      setAlert({ message: "Please select a beat first", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setAlert({ message: "Preparing upload...", type: "success" });

    fetch("/api/submissions/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        battleId: battle.id,
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
            battleId: battle.id,
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

        setHasSubmitted(true);
        setFile(null);

        setAlert({
          message: "Beat submitted successfully",
          type: "success",
        });

        setTimeout(() => {
          router.refresh();
        }, 500);
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

      {isCheckingBattle ? (
        <p className="text-gray-500">Checking battle status...</p>
      ) : !battle ? (
        <p className="font-medium text-gray-500">
          No battle is currently open for submissions.
        </p>
      ) : battle.status === "closed" ? (
        <p className="font-medium text-gray-500">This battle is closed.</p>
      ) : hasSubmitted ? (
        <p className="font-medium text-green-500">
          You have already submitted a beat for this week.
        </p>
      ) : (
        <>
          <p>WAV or MP3 files only. Keep it under 10 MB.</p>

          {alert ? (
            <ValidationAlert message={alert.message} type={alert.type} />
          ) : null}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              accept=".wav,.mp3,audio/wav,audio/mpeg"
              className="rounded-md bg-gray-200 p-2 font-bold"
              type="file"
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <button
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Beat"}
            </button>
          </form>
        </>
      )}
    </SectionContainer>
  );
}
