import { VIDEO_URLS } from "@/app/constants";

export default function HomeVideo() {
  const videoUrl = VIDEO_URLS.hero;
  return (
    <video className="w-full" autoPlay muted loop playsInline controls>
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
}
