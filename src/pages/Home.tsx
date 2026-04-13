import Hero from "../components/Hero";
import FreeTraining from "../components/FreeTraining";
import Products from "../components/Products";
import SniperIntro from "../components/SniperIntro";
import Services from "../components/Services";
import BookTeaser from "../components/BookTeaser";
import Offers from "../components/Offers";
import Testimonials from "../components/Testimonials";
import { motion } from "motion/react";

export default function Home() {
  return (
    <main>
      <Hero />
      
      {/* Lead Magnet: Free Video Training */}
      <FreeTraining />
      
      {/* Products: Psychology, Cameleon, Algo, Thalamus */}
      <Products />
      
      {/* Sniper Presentation */}
      <SniperIntro />

      {/* Services: Coaching & Conferences */}
      <Services />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Offers Section */}
      <Offers />

      {/* Book Teaser */}
      <BookTeaser />
    </main>
  );
}
