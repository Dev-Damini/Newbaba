import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a5f] to-[#243875]" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#d4af37] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#d4af37] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span className="text-sm font-medium text-[#d4af37]">Start Your Journey Today</span>
        </div>

        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to Secure Your{' '}
          <span className="text-[#d4af37]">Grant Funding?</span>
        </h2>

        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join over 50,000 successful applicants who have secured funding through our platform. Browse 165+ active grants with a total funding pool of over $257 million.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/browse">
            <Button
              size="lg"
              className="bg-[#d4af37] hover:bg-[#c9a227] text-[#1a2a5f] font-bold px-8 py-6 text-base transition-all duration-300 hover:scale-105 shadow-gold"
            >
              Browse Grants
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-base transition-all duration-300"
            >
              Contact Support
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            SSL Secure
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            256-bit Encryption
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Trusted by 50,000+
          </span>
        </div>
      </div>
    </section>
  )
}
