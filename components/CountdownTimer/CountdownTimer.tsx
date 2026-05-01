"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownTimerProps = {
  targetDate: string | Date;
  label?: string;
};

function getTimeLeft(targetDate: Date) {
  const difference = targetDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
}

export default function CountdownTimer({
  targetDate,
  label = "Submissions close in",
}: CountdownTimerProps) {
  const endDate = useMemo(() => new Date(targetDate), [targetDate]);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(endDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [endDate]);

  return (
    <div className="rounded-2xl border border-neutral-300 p-5">
      <p className="text-sm text-neutral-500">{label}</p>

      {timeLeft.isExpired ? (
        <p className="mt-2 text-2xl font-bold">Time expired</p>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold">{timeLeft.days}</p>
            <p className="text-xs text-neutral-500">Days</p>
          </div>

          <div>
            <p className="text-2xl font-bold">{timeLeft.hours}</p>
            <p className="text-xs text-neutral-500">Hours</p>
          </div>

          <div>
            <p className="text-2xl font-bold">{timeLeft.minutes}</p>
            <p className="text-xs text-neutral-500">Min</p>
          </div>

          <div>
            <p className="text-2xl font-bold">{timeLeft.seconds}</p>
            <p className="text-xs text-neutral-500">Sec</p>
          </div>
        </div>
      )}
    </div>
  );
}
