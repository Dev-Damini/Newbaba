import { useEffect, useRef, useState } from 'react'
import { DollarSign, FileCheck, Clock, Users } from 'lucide-react'

interface StatItemProps {
  icon: React.ReactNode
  value: string
  label: string
  delay: number
}

function StatItem({ icon, value, label, delay }: StatItemProps) {
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
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl lg:text-3xl font-bold text-[#1a2a5f]">{value}</p>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  )
}

export default function StatsBar() {
  return (
    <section className="relative -mt-4 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <StatItem
              icon={<DollarSign className="w-6 h-6 text-[#d4af37]" />}
              value="$257M+"
              label="Funding Facilitated"
              delay={0}
            />
            <StatItem
              icon={<FileCheck className="w-6 h-6 text-[#d4af37]" />}
              value="165+"
              label="Active Grants"
              delay={100}
            />
            <StatItem
              icon={<Users className="w-6 h-6 text-[#d4af37]" />}
              value="50,000+"
              label="Successful Applicants"
              delay={200}
            />
            <StatItem
              icon={<Clock className="w-6 h-6 text-[#d4af37]" />}
              value="2-4 Weeks"
              label="Avg. Processing Time"
              delay={300}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
