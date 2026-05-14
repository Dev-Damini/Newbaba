import Navigation from '@/components/Navigation'
import Hero from '@/sections/Hero'
import StatsBar from '@/sections/StatsBar'
import HowItWorks from '@/sections/HowItWorks'
import GrantCategories from '@/sections/GrantCategories'
import Testimonials from '@/sections/Testimonials'
import CTASection from '@/sections/CTASection'
import Footer from '@/sections/Footer'


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <GrantCategories />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  )
}
