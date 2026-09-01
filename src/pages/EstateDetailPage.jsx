import React, { useState, useEffect } from 'react';
import { ESTATES_DATA } from '../data/estatesData';
import { ASSETS } from '../data/assetsManifest';
import { getCMSEstates } from '../utils/cmsLoader';
import { MapPin, CheckCircle2, Calendar, MessageSquare, ArrowLeft, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export default function EstateDetailPage({ estateId, estate: propEstate, onNavigateToInspection, setActivePage }) {
  // Always query dynamic CMS estates first by target ID so CMS updates reflect immediately
  const allEstates = getCMSEstates();
  const targetId = estateId || propEstate?.id;
  const cmsMatch = targetId ? allEstates.find(e => e.id === targetId) : null;
  const estate = cmsMatch || propEstate || allEstates[0];
  
  // Consolidate default image and gallery array without duplicates
  const galleryList = Array.from(new Set([estate?.image, ...(estate?.gallery || [])].filter(Boolean)));

  const [activePhoto, setActivePhoto] = useState(estate?.image || '');
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    if (estate) {
      setActivePhoto(estate.image);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [estate]);

  if (!estate) return null;

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Iloshe Properties, I am interested in ${estate.name} (${estate.location}). Please share complete pricing details and available inspection dates.`
    );
    window.open(`https://wa.me/${ASSETS.contact.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="py-16 bg-[#FAF9F5] text-[#121824]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        
        {/* Back Navigation Link */}
        <div>
          <button
            onClick={() => {
              setActivePage('estates');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-mono-data uppercase tracking-wider text-[#5E6A7B] hover:text-[#0B3B2B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#D96B27]" />
            <span>Back to Property Directory</span>
          </button>
        </div>

        {/* Page Title & Main Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#E5E2DC] pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono-data">
              <span className="bg-[#0B3B2B] text-white px-2.5 py-0.5 uppercase tracking-widest text-[10px] font-semibold">
                {estate.category} Estate
              </span>
              <span className="bg-[#D96B27] text-white px-2.5 py-0.5 uppercase tracking-widest text-[10px] font-semibold">
                {estate.status}
              </span>
              <span className="text-[#0B3B2B] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B3B2B]" /> {estate.verificationBadge || '100% Charted & Verified'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif-display font-medium text-[#121824] tracking-tight">
              {estate.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#5E6A7B] font-sans-body flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D96B27] shrink-0" /> {estate.location}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-white border border-[#E5E2DC] p-6 text-left lg:text-right min-w-[260px] shadow-sm">
            <span className="text-[10px] uppercase font-mono-data text-[#5E6A7B] block">Plot Selling Price</span>
            <span className="text-2xl sm:text-3xl font-serif-display font-semibold text-[#121824] block my-0.5">{estate.price}</span>
            <span className="text-xs font-mono-data text-[#D96B27] block">Terms: {estate.paymentPlan}</span>
          </div>
        </div>

        {/* High-Res Gallery Switcher Section */}
        <div className="space-y-4">
          <div className="relative h-[380px] sm:h-[480px] lg:h-[540px] overflow-hidden bg-[#111318] border border-[#E5E2DC] shadow-md">
            <img 
              src={activePhoto || estate.image} 
              alt={`${estate.name} property photo in ${estate.location}`} 
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute bottom-4 right-4 bg-[#111318]/90 text-white text-xs font-serif-display font-semibold px-4 py-2 border border-white/20">
              {estate.name} — {estate.location}
            </div>
          </div>

          {/* Photo Thumbnails */}
          {galleryList.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(img)}
                  aria-label={`View photo thumbnail ${idx + 1}`}
                  className={`w-28 h-20 shrink-0 overflow-hidden border-2 transition-all relative ${
                    activePhoto === img ? 'border-[#0B3B2B] opacity-100 scale-95 ring-2 ring-[#0B3B2B]/30' : 'border-[#E5E2DC] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Gallery snapshot ${idx + 1} for ${estate.name}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comprehensive Specifications Table & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          
          {/* Left Column: Full Specifications & Description */}
          <div className="lg:col-span-8 space-y-10 font-sans-body">
            
            {/* Key Specs Matrix */}
            <div className="bg-white border border-[#E5E2DC] p-8 space-y-4 shadow-sm">
              <h2 className="text-xs font-mono-data text-[#D96B27] uppercase tracking-widest font-semibold border-b border-[#E5E2DC] pb-3">
                Property Specifications & Legal Parameters
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs pt-2">
                <div>
                  <span className="text-[10px] text-[#5E6A7B] uppercase block font-mono-data">Legal Title</span>
                  <span className="font-serif-display font-medium text-[#121824] text-base block mt-0.5">{estate.title}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5E6A7B] uppercase block font-mono-data">Plot Size</span>
                  <span className="font-serif-display font-medium text-[#121824] text-base block mt-0.5">{estate.plotSize}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5E6A7B] uppercase block font-mono-data">Initial Deposit</span>
                  <span className="font-mono-data font-semibold text-[#D96B27] text-base block mt-0.5">{estate.initialDeposit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5E6A7B] uppercase block font-mono-data">Payment Terms</span>
                  <span className="font-medium text-[#121824] block mt-0.5">{estate.paymentPlan}</span>
                </div>
              </div>
            </div>

            {/* Official Payment Breakdown Matrix Table */}
            {estate.pricingGrid && estate.pricingGrid.length > 0 && (
              <div className="bg-white border border-[#E5E2DC] p-8 space-y-4 shadow-sm">
                <div className="border-b border-[#E5E2DC] pb-3">
                  <h2 className="text-xs font-mono-data text-[#0B3B2B] uppercase tracking-widest font-semibold">
                    Official Pricing & Installment Payment Schedule
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans-body border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-[#E5E2DC] text-[#5E6A7B] font-mono-data text-[11px]">
                        <th className="py-3 px-4 uppercase">Plot Size</th>
                        <th className="py-3 px-4 uppercase">1 - 3 Months (Outright)</th>
                        <th className="py-3 px-4 uppercase">6 Months Plan</th>
                        <th className="py-3 px-4 uppercase">12 Months Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E2DC]">
                      {estate.pricingGrid.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF9F5]/50 transition-colors">
                          <td className="py-3.5 px-4 font-serif-display font-medium text-[#121824] text-sm">{row.size}</td>
                          <td className="py-3.5 px-4 font-mono-data font-semibold text-[#0B3B2B]">{row.outright}</td>
                          <td className="py-3.5 px-4 font-mono-data text-[#121824]">{row.sixMonths}</td>
                          <td className="py-3.5 px-4 font-mono-data text-[#D96B27]">{row.twelveMonths}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Overview & Investment Potential */}
            {estate.overview && (
              <div className="space-y-4">
                <h2 className="text-xl font-serif-display font-medium text-[#121824]">
                  Property Overview & Investment Value
                </h2>
                <p className="text-xs sm:text-sm text-[#5E6A7B] leading-relaxed whitespace-pre-line">
                  {estate.overview}
                </p>
              </div>
            )}

            {/* Infrastructure & Amenities Checklist */}
            {estate.infrastructure && estate.infrastructure.length > 0 && (
              <div className="space-y-4 bg-white border border-[#E5E2DC] p-8 shadow-sm">
                <h2 className="text-xl font-serif-display font-medium text-[#121824]">
                  Estate Infrastructure & Physical Allocation Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#5E6A7B]">
                  {estate.infrastructure.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 py-1">
                      <CheckCircle2 className="w-4 h-4 text-[#0B3B2B] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estate Specific FAQs Section */}
            {estate.faqs && estate.faqs.length > 0 && (
              <div className="space-y-6 bg-white border border-[#E5E2DC] p-8 shadow-sm">
                <div className="border-b border-[#E5E2DC] pb-3 space-y-1">
                  <span className="text-[10px] font-mono-data uppercase tracking-widest text-[#D96B27] block font-semibold">
                    ESTATE SPECIFIC QUESTIONS
                  </span>
                  <h2 className="text-xl font-serif-display font-medium text-[#121824]">
                    {estate.name} Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {estate.faqs.map((faq, idx) => {
                    const isOpen = activeFaq === idx;
                    return (
                      <div key={idx} className="border-b border-[#E5E2DC]/70 pb-3">
                        <button
                          onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                          aria-expanded={isOpen}
                          className="w-full text-left py-2 flex justify-between items-center font-serif-display text-base text-[#121824] focus:outline-none"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-[#0B3B2B]" /> : <ChevronDown className="w-4 h-4 text-[#5E6A7B]" />}
                        </button>
                        {isOpen && (
                          <div className="pt-1.5 text-xs text-[#5E6A7B] leading-relaxed font-sans-body">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Action Box */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Action Box */}
            <div className="sticky top-24 bg-white border border-[#E5E2DC] p-8 space-y-6 shadow-md">
              <div className="space-y-2 border-b border-[#E5E2DC] pb-4">
                <span className="text-[10px] font-mono-data text-[#D96B27] uppercase tracking-widest block font-semibold">
                  RESERVE YOUR PLOT
                </span>
                <h2 className="text-2xl font-serif-display font-medium text-[#121824]">
                  Schedule Inspection
                </h2>
                <p className="text-xs text-[#5E6A7B] leading-relaxed">
                  Book a physical site visit to inspect plot beacons or request a live video walkthrough with our land coordinators.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onNavigateToInspection(estate.name)}
                  className="btn-primary w-full text-center py-3.5 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Inspection For This Estate
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="btn-secondary w-full text-center py-3.5 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" /> Inquire via WhatsApp
                </button>
              </div>

              <div className="p-4 bg-[#FAF9F5] border border-[#E5E2DC] text-[11px] font-mono-data text-[#5E6A7B] space-y-1">
                <span className="text-[#0B3B2B] font-semibold block">INSTANT ALLOCATION GUARANTEE:</span>
                <p className="leading-relaxed">All coordinates are charted and ready for immediate physical pegging upon contract execution.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
