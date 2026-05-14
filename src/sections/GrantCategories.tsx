import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Building2, GraduationCap, Home, HeartPulse, Cpu, Tractor, Users, FlaskConical, Palette, Heart } from 'lucide-react'

const categories = [
  { icon: <Building2 className="w-7 h-7" />, title: 'Business', description: 'Startups, expansion, and innovation funding', count: '45+', color: 'from-blue-500 to-blue-600' },
  { icon: <GraduationCap className="w-7 h-7" />, title: 'Education', description: 'Scholarships, research, and training', count: '35+', color: 'from-emerald-500 to-emerald-600' },
  { icon: <Home className="w-7 h-7" />, title: 'Housing', description: 'Home purchase, repair, and assistance', count: '25+', color: 'from-amber-500 to-amber-600' },
  { icon: <HeartPulse className="w-7 h-7" />, title: 'Healthcare', description: 'Medical research and health services', count: '20+', color: 'from-rose-500 to-rose-600' },
  { icon: <Cpu className="w-7 h-7" />, title: 'Technology', description: 'Innovation, AI, and digital transformation', count: '15+', color: 'from-violet-500 to-violet-600' },
  { icon: <Tractor className="w-7 h-7" />, title: 'Agriculture', description: 'Farming, sustainability, and rural dev', count: '12+', color: 'from-green-600 to-green-700' },
  { icon: <Users className="w-7 h-7" />, title: 'Community', description: 'Local development and social services', count: '30+', color: 'from-cyan-500 to-cyan-600' },
  { icon: <FlaskConical className="w-7 h-7" />, title: 'Research', description: 'Scientific and academic research grants', count: '18+', color: 'from-indigo-500 to-indigo-600' },
  { icon: <Palette className="w-7 h-7" />, title: 'Arts', description: 'Creative projects and cultural programs', count: '8+', color: 'from-pink-500 to-pink-600' },
  { icon: <Heart className="w-7 h-7" />, title: 'Nonprofit', description: 'Foundation and charitable organization', count: '22+', color: 'from-teal-500 to-teal-600' },
]

interface CategoryCardProps {
  category: typeof categories[0]
  index: number
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 80)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [index])

  return (
    <Link to={`/browse?category=${category.title.toLowerCase()}`}>
      <div
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group bg-white rounded-xl border border-gray-100 p-6 transition-all duration-300 cursor-pointer ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        } ${isHovered ? 'shadow-xl border-[#d4af37]/30 -translate-y-1' : 'shadow-sm'}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            {category.icon}
          </div>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            {category.count}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#1a2a5f] mb-1 group-hover:text-[#d4af37] transition-colors">
          {category.title}
        </h3>
        <p className="text-sm text-gray-500">{category.description}</p>
      </div>
    </Link>
  )
}

export default function GrantCategories() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#1a2a5f]/5 text-[#1a2a5f] text-sm font-semibold rounded-full mb-4">
            Explore Categories
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2a5f] mb-4">
            Grant Categories
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Browse grants organized by category. Whether you need funding for your business, education, housing, or community project, we have options for you.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
