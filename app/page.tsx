import Navbar from "@/components/Home/NavBar/Nav";
import Hero from "@/components/Home/Hero";
import Feature from "@/components/Home/FeatureHighlights/Feature";
import SupportGuide from "@/components/Home/SupportGuide";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">

      <div className="pt-24">
        <Hero />
        <Feature />
        <SupportGuide />
      </div>
    </main>
  );
}
