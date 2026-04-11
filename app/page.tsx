import Core from "@/components/sections/home/Core";
import Intro from "@/components/sections/home/Intro";
import Join from "@/components/sections/home/Join";
import Testimonials from "@/components/sections/home/Testimonials";
import StayInTheFight from "@/components/sections/home/GetNotified";
import Footer from "@/components/Footer/Footer";
import GetInTouch from "@/components/sections/home/GetInTouch";
import Questions from "@/components/sections/home/Questions";

export default function Home() {
  return (
    <main className="py-8 px-6">
      <Intro />
      <Core />
      <Join />
      <Testimonials />
      <Questions />
      <StayInTheFight />
      <GetInTouch />
    </main>
  );
}
