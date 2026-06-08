import HeroSection from "@/components/home/HeroSection";
import FeaturedFilmsSection from "@/components/home/FeaturedFilmsSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";


export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedFilmsSection />
      <ExperienceSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}