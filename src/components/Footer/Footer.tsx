import React from 'react';
import { Phone } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import { scrollWithOffset } from '@/scrollHelpers/ScrollOffset';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2f2a28] text-white  pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Company Info */}
        <div className="space-y-4">
          <h2 className="text-[#d5a86b] text-2xl font-[satisfy]">
            DHMS International
          </h2>
          <p className="text-sm text-[#e0d6c8] leading-relaxed">
            Celebrating African beauty with hair, skin, and self-care essentials rooted in heritage.
          </p>
          <div className="flex items-center gap-2 text-[#f3cb50] text-sm mt-3">
            <Phone className="w-4 h-4" />
            <span>+1-234-567-8901</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[#d5a86b] text-sm uppercase font-bold tracking-wide mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-[#e0d6c8]">
            <li>
              <HashLink to="/home#top" scroll={scrollWithOffset} className="hover:text-[#f3cb50] transition">
                Home
              </HashLink>
            </li>
            <li>
              <HashLink to="/shop#top" className="hover:text-[#f3cb50] transition">
                Shop
              </HashLink>
            </li>
            <li>
              <HashLink to="/#testimonials" scroll={scrollWithOffset} className="hover:text-[#f3cb50] transition">
                Testimonials
              </HashLink>
            </li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="text-[#d5a86b] text-sm uppercase font-bold tracking-wide mb-4">Subscribe to Our Glowlist</h3>
          <p className="text-sm text-[#e0d6c8] mb-3">Get updates on exclusive drops and in-store events.</p>
          <form className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-md bg-white text-black w-full sm:w-auto flex-1"
            />
            <button
              type="submit"
              className="bg-[#d5a86b] text-black px-4 py-2 rounded-md hover:brightness-110 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-12 border-t border-[#a19990]/30 pt-6 text-center text-sm text-[#a19990]">
        &copy; {new Date().getFullYear()} DHMS International. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
