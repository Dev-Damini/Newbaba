import { useEffect, useRef, useState } from 'react'
import { Search, FileText, Send, CheckCircle } from 'lucide-react'

interface StepProps {
  number: string
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function Step({ number, icon, title, description, delay }: StepProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Step Number Badge */}
      <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center text-[#1a2a5f] font-bold text-sm mb-4 z-10">
        {number}
      </div>

      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-[#1a2a5f] to-[#2d4a8f] rounded-2xl flex items-center justify-center mb-4 shadow-navy">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-[#1a2a5f] mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{description}</p>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-semibold rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2a5f] mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Getting the funding you need is simple. Follow these four easy steps to discover and apply for grants.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line - Desktop Only */}
          <div className="hidden lg:block absolute top-[72px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#1a2a5f]/10 via-[#d4af37]/30 to-[#1a2a5f]/10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <Step
              number="1"
              icon={<Search className="w-7 h-7 text-[#d4af37]" />}
              title="Browse Grants"
              description="Explore our database of 1,000+ federal, state, private, and corporate grants filtered by category and eligibility."
              delay={0}
            />
            <Step
              number="2"
              icon={<FileText className="w-7 h-7 text-[#d4af37]" />}
              title="Check Eligibility"
              description="Review grant requirements, funding amounts, deadlines, and ensure you meet all eligibility criteria."
              delay={150}
            />
            <Step
              number="3"
              icon={<Send className="w-7 h-7 text-[#d4af37]" />}
              title="Submit Application"
              description="Complete our streamlined 2-page application with your personal, business, and financial information."
              delay={300}
            />
            <Step
              number="4"
              icon={<CheckCircle className="w-7 h-7 text-[#d4af37]" />}
              title="Get Funded"
              description="Receive approval within 2-4 weeks. Select grants offer instant funding for qualified applicants."
              delay={450}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
