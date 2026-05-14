import { useEffect, useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    name: 'Marcus Reynolds',
    role: 'Small Business Owner',
    location: 'Austin, TX',
    avatar: 'MR',
    avatarBg: 'from-blue-500 to-blue-600',
    rating: 5,
    quote: 'I was struggling to find funding for my tech startup until I discovered Platinum Grant Access. Within 3 weeks of submitting my application, I received approval for a $275,000 SBIR grant. The platform made everything so straightforward and the support team was incredibly helpful throughout the process.',
    grant: 'SBIR Phase I Grant',
    amount: '$275,000',
  },
  {
    name: 'Keisha Williams',
    role: 'Community Center Director',
    location: 'Atlanta, GA',
    avatar: 'KW',
    avatarBg: 'from-emerald-500 to-emerald-600',
    rating: 5,
    quote: 'Our community center needed funding to expand our after-school programs. Through Platinum Grant Access, we secured a $1.5M grant that has transformed our ability to serve underprivileged youth. The application process was clear, and we could track our status every step of the way.',
    grant: 'Community Development Block Grant',
    amount: '$1,500,000',
  },
  {
    name: 'Tamara Johnson',
    role: 'Organic Farm Owner',
    location: 'Montgomery, AL',
    avatar: 'TJ',
    avatarBg: 'from-amber-500 to-amber-600',
    rating: 5,
    quote: 'As a minority woman farmer, finding grants seemed impossible. Platinum Grant Access changed everything. I found multiple agriculture grants I qualified for and received $400,000 in combined funding. My farm has doubled in size and I have hired 12 new employees from the community.',
    grant: 'USDA Sustainable Agriculture Grant',
    amount: '$400,000',
  },
  {
    name: 'David Chen',
    role: 'Research Scientist',
    location: 'Boston, MA',
    avatar: 'DC',
    avatarBg: 'from-violet-500 to-violet-600',
    rating: 5,
    quote: 'The NIH Research Grant I secured through this platform has been instrumental in advancing my work in cancer immunotherapy. The $500,000 funding allowed me to hire two postdocs and purchase critical equipment. The application guidance was exceptional.',
    grant: 'NIH Research Project Grant',
    amount: '$500,000',
  },
  {
    name: 'Angela Brooks',
    role: 'Nonprofit Founder',
    location: 'Chicago, IL',
    avatar: 'AB',
    avatarBg: 'from-rose-500 to-rose-600',
    rating: 5,
    quote: 'Running a nonprofit focused on housing insecurity, I needed reliable funding sources. Platinum Grant Access connected us with HUD grants we never knew existed. We secured $2M in funding that has helped us provide housing assistance to over 500 families.',
    grant: 'HUD Community Development Grant',
    amount: '$2,000,000',
  },
  {
    name: 'James Whitfield',
    role: 'Tech Entrepreneur',
    location: 'San Francisco, CA',
    avatar: 'JW',
    avatarBg: 'from-cyan-500 to-cyan-600',
    rating: 5,
    quote: 'After being rejected by multiple VC firms, I turned to grant funding. Platinum Grant Access helped me secure a $750,000 DOE grant for my clean energy startup. Six months later, we are revenue-positive and have created 25 green jobs in our community.',
    grant: 'DOE Clean Energy Grant',
    amount: '$750,000',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  const visibleTestimonials = []
  for (let i = 0; i < 3; i++) {
    visibleTestimonials.push(testimonials[(currentIndex + i) % testimonials.length])
  }

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#d4af37]/10 text-[#d4af37] text-sm font-semibold rounded-full mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2a5f] mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Real stories from real people who have successfully secured funding through our platform.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            <div className="grid md:grid-cols-3 gap-6">
              {visibleTestimonials.map((testimonial, index) => (
                <div
                  key={`${currentIndex}-${index}`}
                  className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Quote Icon */}
                  <div className="w-10 h-10 bg-[#d4af37]/10 rounded-xl flex items-center justify-center mb-4">
                    <Quote className="w-5 h-5 text-[#d4af37]" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>

                  {/* Grant Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1a2a5f]/5 rounded-lg mb-6">
                    <span className="text-xs font-semibold text-[#1a2a5f]">{testimonial.grant}</span>
                    <span className="text-xs font-bold text-[#d4af37]">{testimonial.amount}</span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.avatarBg} flex items-center justify-center text-white font-bold text-sm`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a2a5f] text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role} &middot; {testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="w-10 h-10 rounded-full border-gray-200 hover:border-[#d4af37] hover:text-[#d4af37]"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="w-10 h-10 rounded-full border-gray-200 hover:border-[#d4af37] hover:text-[#d4af37]"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
