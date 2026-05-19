import { VIDEO_URLS } from "@/app/constants";

export default function HomeVideo() {
  const videoUrl = VIDEO_URLS.hero;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-3xl border border-neutral-300 dark:border-white/10">
          <video
            className="aspect-video w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
