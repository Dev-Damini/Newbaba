import { Link } from 'react-router'
import { Mail, Phone, MapPin, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0f1a3a] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Platinum Grant Access"
                className="w-14 h-14 object-contain rounded-lg"
              />
              <div>
                <p className="font-bold text-white">Platinum Grant Access</p>
                <p className="text-xs text-[#d4af37]">Federal & Private Grants Portal</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
              A secure platform connecting individuals and businesses with federal, state, private, and corporate grant opportunities across the United States.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:support@platinumgrantaccess.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4af37] transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@platinumgrantaccess.com
              </a>
              <a
                href="sms:+17473190141"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4af37] transition-colors"
              >
                <Phone className="w-4 h-4" />
                +1 (747) 319-0141
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                United States of America
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/browse" className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">
                  Browse Grants
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">
                  Eligibility Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors">
                  Program Guidelines
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; 2026 Platinum Grant Access. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-3.5 h-3.5" />
                <span>Secured with 256-bit encryption</span>
              </div>
              <Link
                to="/admin"
                className="text-xs text-gray-600 hover:text-[#d4af37] transition-colors flex items-center gap-1"
              >
                Staff Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
