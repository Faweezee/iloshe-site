import React from 'react';
import { ASSETS } from '../../data/assetsManifest';
import BrandLogo from '../common/BrandLogo';

export default function Footer({ setActivePage, onNavigateToInspection }) {
  const handleNav = (id) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mapUrl = ASSETS.contact.mapUrl;

  return (
    <footer className="bg-[#0B3B2B] text-[#FAF9F5] pt-20 pb-12 border-t border-[#1E4D3E]">
      
      {/* Top Quiet CTA Strip */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16 border-b border-[#1E4D3E] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <span className="text-xs font-mono-data uppercase tracking-widest text-[#D96B27] block mb-1 font-semibold">
            Property Advisory
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
            Ready to secure your property investment?
          </h3>
        </div>
        <button
          onClick={() => onNavigateToInspection()}
          className="btn-orange whitespace-nowrap"
        >
          Book Site Inspection
        </button>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-xs font-sans-body">
        
        {/* Col 1: Brand Profile */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/10 rounded border border-white/20">
              <BrandLogo className="h-8 w-auto" />
            </div>
            <div>
              <span className="block font-serif-display text-lg text-white font-medium">
                ILOSHE PROPERTIES
              </span>
              <span className="block text-[8px] tracking-widest text-[#D2E3DB] uppercase font-sans-body">
                & Investment Ltd
              </span>
            </div>
          </div>

          <p className="text-[#D2E3DB] leading-relaxed max-w-xs pt-1">
            Iloshe Properties & Investment Limited helps buyers and institutional investors acquire verified land opportunities across Nigeria with complete legal transparency.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-mono-data tracking-widest text-[#D96B27] block font-semibold">
            Navigation
          </span>
          <ul className="space-y-2.5 text-[#D2E3DB]">
            {['home', 'about', 'estates', 'services', 'guide', 'contact'].map((id) => (
              <li key={id}>
                <button 
                  onClick={() => handleNav(id)}
                  className="hover:text-[#D96B27] transition-colors capitalize"
                >
                  {id === 'guide' ? 'Investment Guide & Blog' : id === 'about' ? 'About Us' : id === 'estates' ? 'Our Estates' : id}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Services */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-mono-data tracking-widest text-[#D96B27] block font-semibold">
            Advisory Services
          </span>
          <ul className="space-y-2.5 text-[#D2E3DB]">
            <li>Verified Land Sales</li>
            <li>Investment Advisory</li>
            <li>Documentation Support</li>
            <li>Site Inspection Coordination</li>
            <li>Physical Plot Pegging</li>
          </ul>
        </div>

        {/* Col 4: Contact Headquarters — All Items Clickable with Direct Redirects */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-mono-data tracking-widest text-[#D96B27] block font-semibold">
            Headquarters
          </span>
          <div className="space-y-2.5 text-[#D2E3DB]">
            {/* Clickable Address -> Google Maps Redirect */}
            <a 
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block leading-relaxed hover:text-[#D96B27] transition-colors group"
            >
              <span className="underline decoration-[#D96B27]/40 underline-offset-4 group-hover:decoration-[#D96B27]">
                {ASSETS.contact.address}
              </span>
              <span className="block text-[10px] text-[#D96B27] font-mono-data mt-0.5">📍 View on Google Maps ↗</span>
            </a>

            {/* Clickable Telephone Numbers */}
            <div className="space-y-1 pt-1 font-mono-data">
              {ASSETS.contact.phones.map((phone, idx) => (
                <a 
                  key={idx}
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="block hover:text-[#D96B27] transition-colors"
                >
                  📞 {phone}
                </a>
              ))}
            </div>

            {/* Clickable Email Address */}
            <div className="pt-1 font-mono-data">
              <a 
                href={`mailto:${ASSETS.contact.email}`}
                className="block hover:text-[#D96B27] transition-colors"
              >
                ✉️ {ASSETS.contact.email}
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Developer Legal Disclaimer Guardrail Note */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 border-t border-[#1E4D3E]/60 text-[10px] text-[#D2E3DB]/50 font-sans-body leading-relaxed">
        <p>
          Disclaimer: Property details, pricing, layout coordinates, and document availability displayed on this platform are for informational purposes and subject to contract and official verification at the time of inquiry.
        </p>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 border-t border-[#1E4D3E] text-[11px] text-[#D2E3DB]/70 font-sans-body flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} ILOSHE PROPERTIES AND INVESTMENT LIMITED. All Rights Reserved.</p>
        <div className="flex space-x-6 text-[#D2E3DB]">
          <span className="hover:text-white cursor-pointer" onClick={() => handleNav('guide')}>Terms</span>
          <span className="hover:text-white cursor-pointer" onClick={() => handleNav('guide')}>Privacy</span>
          <a href="/admin/index.html" className="hover:text-[#D96B27] transition-colors font-mono-data">Client CMS Login</a>
        </div>
      </div>
    </footer>
  );
}
