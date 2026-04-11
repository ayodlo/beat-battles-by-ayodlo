import SubmitIntro from "@/components/sections/submitbeat/SubmitIntro";

import ThisWeek from "@/components/sections/submitbeat/ThisWeek";
import Upload from "@/components/sections/submitbeat/Upload";
import ListenVote from "@/components/sections/submitbeat/ListenVote";
export default function Home() {
  return (
    <main className="py-8 px-6">
      <SubmitIntro />
      <ThisWeek />
      <Upload />
      <ListenVote />
    </main>
  );
}
