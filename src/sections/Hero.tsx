import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, Users, Clock } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#1a2a5f]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-3xl" />
      </div>

      {/* Floating shapes */}
      <div className="absolute top-32 right-[15%] w-16 h-16 border border-[#d4af37]/20 rounded-lg rotate-12 animate-pulse hidden lg:block" />
      <div className="absolute bottom-40 right-[10%] w-12 h-12 bg-[#1a2a5f]/5 rounded-full hidden lg:block" />
      <div className="absolute top-40 left-[8%] w-8 h-8 border-2 border-[#d4af37]/30 rounded-full hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2a5f]/5 border border-[#1a2a5f]/10 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#1a2a5f]">370+ Grants Available Now</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-[#1a2a5f]">Access Grant</span>{' '}
              <span className="text-gradient">Opportunities</span>{' '}
              <span className="text-[#d4af37]">Instantly</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              A smarter way to discover and apply for funding. Connect with federal, state, private, and corporate grants all in one secure platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/browse">
                <Button
                  size="lg"
                  className="bg-[#1a2a5f] hover:bg-[#243875] text-[#d4af37] font-semibold px-8 py-6 text-base shadow-navy transition-all duration-300 hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#1a2a5f]/30 text-[#1a2a5f] hover:bg-[#1a2a5f]/5 font-semibold px-8 py-6 text-base transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                <span className="font-semibold text-[#1a2a5f]">$257M+</span> Total Funding
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-[#d4af37]" />
                <span className="font-semibold text-[#1a2a5f]">50,000+</span> Applicants
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span className="font-semibold text-[#1a2a5f]">2-4 Weeks</span> Processing
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="Platinum Grant Access"
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <p className="font-bold text-[#1a2a5f]">Platinum Grant Access</p>
                      <p className="text-xs text-gray-500">Federal & Private Portal</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Active
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-500">Available Grants</p>
                      <p className="text-2xl font-bold text-[#1a2a5f]">165+</p>
                    </div>
                    <div className="w-12 h-12 bg-[#d4af37]/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#d4af37]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-500">Total Funding Pool</p>
                      <p className="text-2xl font-bold text-[#1a2a5f]">$257M</p>
                    </div>
                    <div className="w-12 h-12 bg-[#1a2a5f]/5 rounded-xl flex items-center justify-center">
                      <span className="text-[#d4af37] font-bold text-lg">$</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-[#1a2a5f] to-[#2d4a8f] rounded-xl">
                    <p className="text-sm text-[#d4af37] font-semibold mb-1">Featured Grant</p>
                    <p className="text-white text-sm">SBIR Phase II Grant - National Science Foundation</p>
                    <p className="text-[#d4af37] font-bold mt-2">$1,050,000</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100 z-20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-gray-700">Instant Funding Available</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#d4af37]/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">New Applicant</p>
                    <p className="text-sm font-bold text-[#1a2a5f]">Just Applied!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
