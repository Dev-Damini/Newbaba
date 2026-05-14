import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { trpc } from '@/providers/trpc'
import Navigation from '@/components/Navigation'
import Footer from '@/sections/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Building2, GraduationCap, Home, HeartPulse, Cpu, Tractor, Users, FlaskConical, Palette, Heart, ArrowRight, DollarSign, Clock, CheckCircle2 } from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  business: <Building2 className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  housing: <Home className="w-4 h-4" />,
  healthcare: <HeartPulse className="w-4 h-4" />,
  technology: <Cpu className="w-4 h-4" />,
  agriculture: <Tractor className="w-4 h-4" />,
  community: <Users className="w-4 h-4" />,
  research: <FlaskConical className="w-4 h-4" />,
  arts: <Palette className="w-4 h-4" />,
  nonprofit: <Heart className="w-4 h-4" />,
  personal: <Users className="w-4 h-4" />,
  emergency: <HeartPulse className="w-4 h-4" />,
}

const categoryColors: Record<string, string> = {
  business: 'bg-blue-50 text-blue-700 border-blue-200',
  education: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  housing: 'bg-amber-50 text-amber-700 border-amber-200',
  healthcare: 'bg-rose-50 text-rose-700 border-rose-200',
  technology: 'bg-violet-50 text-violet-700 border-violet-200',
  agriculture: 'bg-green-50 text-green-700 border-green-200',
  community: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  research: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  arts: 'bg-pink-50 text-pink-700 border-pink-200',
  nonprofit: 'bg-teal-50 text-teal-700 border-teal-200',
  personal: 'bg-gray-50 text-gray-700 border-gray-200',
  emergency: 'bg-red-50 text-red-700 border-red-200',
}

const fundingTypeColors: Record<string, string> = {
  federal: 'bg-[#1a2a5f] text-[#d4af37]',
  state: 'bg-blue-600 text-white',
  private: 'bg-emerald-600 text-white',
  corporate: 'bg-violet-600 text-white',
}

export default function BrowseGrants() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || ''

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedFundingType, setSelectedFundingType] = useState('')

  const { data: grants, isLoading } = trpc.grant.list.useQuery({
    category: selectedCategory || undefined,
    fundingType: selectedFundingType || undefined,
    search: search || undefined,
  })

  const { data: stats } = trpc.grant.getStats.useQuery()

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'housing', label: 'Housing' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'technology', label: 'Technology' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'community', label: 'Community' },
    { value: 'research', label: 'Research' },
    { value: 'arts', label: 'Arts' },
    { value: 'nonprofit', label: 'Nonprofit' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'personal', label: 'Personal' },
  ]

  const fundingTypes = [
    { value: '', label: 'All Types' },
    { value: 'federal', label: 'Federal' },
    { value: 'state', label: 'State' },
    { value: 'private', label: 'Private' },
    { value: 'corporate', label: 'Corporate' },
  ]

  const formatAmount = (amount: string) => {
    const num = Number(amount)
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
    return `$${num}`
  }

  const activeGrants = grants?.filter((g) => g.isActive === 'active') || []

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navigation />

      {/* Hero Header */}
      <div className="pt-20 pb-8 bg-gradient-to-br from-[#1a2a5f] to-[#243875]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Browse Available Grants
              </h1>
              <p className="text-gray-300">
                Discover 165+ active grants with a total funding pool of ${stats ? (stats.totalFunding / 1000000).toFixed(0) : '257'}M+
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center px-4 py-2 bg-white/10 rounded-lg">
                <p className="font-bold text-[#d4af37] text-xl">{stats?.activeGrants || 165}+</p>
                <p className="text-gray-300">Active Grants</p>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-lg">
                <p className="font-bold text-[#d4af37] text-xl">${stats ? (stats.totalFunding / 1000000).toFixed(0) : '257'}M+</p>
                <p className="text-gray-300">Total Funding</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 lg:top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search grants by name, description, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-gray-200 focus:border-[#d4af37] focus:ring-[#d4af37]/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-[#1a2a5f] text-[#d4af37]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Funding Type Filter */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
            {fundingTypes.map((ft) => (
              <button
                key={ft.value}
                onClick={() => setSelectedFundingType(ft.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedFundingType === ft.value
                    ? 'bg-[#d4af37] text-[#1a2a5f]'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {ft.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grants Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#1a2a5f] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeGrants.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No grants found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find more grants.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing <span className="font-semibold text-[#1a2a5f]">{activeGrants.length}</span> active grants
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGrants.map((grant) => (
                <div
                  key={grant.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant="outline"
                        className={`${categoryColors[grant.category] || 'bg-gray-50 text-gray-700'} text-xs font-medium flex items-center gap-1`}
                      >
                        {categoryIcons[grant.category]}
                        {grant.category.charAt(0).toUpperCase() + grant.category.slice(1)}
                      </Badge>
                      <Badge className={`${fundingTypeColors[grant.fundingType] || 'bg-gray-500'} text-xs`}>
                        {grant.fundingType.charAt(0).toUpperCase() + grant.fundingType.slice(1)}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-[#1a2a5f] mb-2 line-clamp-2 text-lg">
                      {grant.title}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                      {grant.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-[#d4af37]" />
                        <span className="font-bold text-[#1a2a5f]">{formatAmount(grant.fundingAmount)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">{grant.processingTime}</span>
                      </div>
                    </div>

                    {grant.isInstantFunding === 'yes' && (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg mb-3">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="font-semibold">Instant Funding Available</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <Link to={`/apply/${grant.id}`}>
                      <Button
                        className="w-full bg-[#1a2a5f] hover:bg-[#243875] text-[#d4af37] font-semibold transition-all hover:shadow-navy"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
