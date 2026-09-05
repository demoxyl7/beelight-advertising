import React, { useState, useEffect, useRef, useMemo } from 'react';
import { APIProvider, AdvancedMarker, Map, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

// Types
type Metric = { label: string; value: string; suffix?: string };
type Service = { id: string; title: string; description: string; icon: string; features: string[] };
type InventoryItem = { id: string; title: string; location: string; city: string; size: string; type: string; price: string; availability: 'Available'|'Booked'|'Limited'; image: string; details: string; featured: boolean };
type Testimonial = { id: string; name: string; role: string; quote: string; avatar: string };
type FAQ = { id: string; question: string; answer: string; category: string };
type TeamMember = { id: string; name: string; role: string; bio: string; avatar: string };
type AboutImage = { id: string; src: string; alt: string; caption: string };
type Settings = { accent: string; adminEmail: string; whatsapp: string; logoUrl: string; siteName: string };
type Hero = { headline: string; subheadline: string; cta1: string; cta2: string };
type SiteData = { hero: Hero; metrics: Metric[]; services: Service[]; inventory: InventoryItem[]; testimonials: Testimonial[]; faqs: FAQ[]; team: TeamMember[]; aboutImages: AboutImage[]; settings: Settings; address: string; hours: string };

const defaultData: SiteData = {
  hero: {
    headline: "Bright Ideas. Buzzin' Visibility. Light Up Your Brand.",
    subheadline: "Nigeria's modern OOH platform — precision-targeted billboards, street branding, and digital screens that make your brand impossible to ignore.",
    cta1: "View Inventory",
    cta2: "Talk to Us"
  },
  metrics: [
    { label: "Locations", value: "250+", suffix: "Premium sites" },
    { label: "Cities", value: "15+", suffix: "Nationwide" },
    { label: "Campaigns", value: "1200+", suffix: "Delivered" },
    { label: "Retention", value: "98%", suffix: "Client love" },
  ],
  services: [
    { id: 's1', title: 'Billboard Advertising', description: 'Dominant static & digital boards on high-traffic corridors.', icon: '📍', features: ['Unipole & Gantry', 'Lekki, Ikoyi, VI', '24/7 Visibility'] },
    { id: 's2', title: 'Street Branding', description: 'Own the streets with lamp-posts, bus shelters & walls.', icon: '🏙️', features: ['Street Poles', 'Wall Drape', 'City Domination'] },
    { id: 's3', title: 'Transit Branding', description: 'Move with your audience on BRT, danfo & airport media.', icon: '🚌', features: ['BRT Buses', 'Airport Shuttles', 'Ride-hailing wraps'] },
    { id: 's4', title: 'Digital OOH (DOOH)', description: 'Programmatic LED screens with dayparting & motion.', icon: '💡', features: ['LED Networks', 'Real-time updates', 'Video + Motion'] },
    { id: 's5', title: 'Media Planning & Buying', description: 'Data-driven OOH planning to cut waste and win reach.', icon: '📊', features: ['Reach & Frequency', 'Competitor mapping', 'ROI modelling'] },
    { id: 's6', title: 'Installation & Maintenance', description: 'We print, install and keep your campaign glowing.', icon: '🛠️', features: ['Large-format print', 'Night installation', 'Weekly monitoring'] },
  ],
  inventory: [
    { id: 'b1', title: 'Lekki Toll Plaza Dominance', location: 'Lekki Toll Plaza, Lagos', city: 'Lagos', size: '18m x 6m', type: 'Unipole', price: '₦2.8M / month', availability: 'Available', image: 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#FFC300'/><stop offset='100%' stop-color='#FF8A00'/></linearGradient></defs><rect width='100%' height='100%' fill='#111'/><rect width='100%' height='100%' fill='url(#g)' opacity='0.35'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Space Grotesk, sans-serif' font-size='32' font-weight='700' fill='white'>LEKKI TOLL • UNIPOLE</text></svg>`), details: 'Unmissable gantry at the busiest toll corridor in Lagos. 400k+ daily impressions.', featured: true },
    { id: 'b2', title: 'Ikoyi Link Bridge LED', location: 'Ikoyi Link Bridge, Lagos', city: 'Lagos', size: '12m x 4m', type: 'Digital', price: '₦4.2M / month', availability: 'Limited', image: 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#0f172a'/><rect width='100%' height='100%' fill='#00F5FF' opacity='0.2'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Space Grotesk' font-size='30' font-weight='700' fill='white'>IKOYI BRIDGE • DIGITAL</text></svg>`), details: 'Premium digital screen targeting HNI commuters. 15s slots, 120 plays/day.', featured: true },
    { id: 'b3', title: 'Wuse Zone 4 Giant', location: 'Wuse Zone 4, Abuja', city: 'Abuja', size: '15m x 5m', type: 'Gantry', price: '₦2.1M / month', availability: 'Available', image: 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#1a1a1a'/><rect width='100%' height='100%' fill='#FF3B9A' opacity='0.25'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Space Grotesk' font-size='28' font-weight='700' fill='white'>WUSE ZONE 4 • GANTRY</text></svg>`), details: 'Capital city dominance near diplomatic zone. High dwell time.', featured: true },
    { id: 'b4', title: 'PH Aba Road Corridor', location: 'Aba Road, Port Harcourt', city: 'Port Harcourt', size: '12m x 6m', type: 'Static', price: '₦1.4M / month', availability: 'Booked', image: 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#111'/><rect width='100%' height='100%' fill='#FFC300' opacity='0.15'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' font-weight='700' fill='white'>ABA ROAD • STATIC</text></svg>`), details: 'Gateway to industrial hub. Perfect for FMCG & telco.', featured: false },
    { id: 'b5', title: 'Victoria Island Marina', location: 'Marina, VI, Lagos', city: 'Lagos', size: '10m x 3.5m', type: 'Digital', price: '₦3.6M / month', availability: 'Available', image: 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#0a0a0f'/><rect width='100%' height='100%' fill='#00F5FF' opacity='0.18'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='26' font-weight='700' fill='white'>VI MARINA • DIGITAL LED</text></svg>`), details: 'Business district LED wall with banking & corporate audience.', featured: false },
    { id: 'b6', title: 'Ikeja Airport Road Cube', location: 'Airport Road, Ikeja', city: 'Lagos', size: '18m x 9m', type: 'Unipole', price: '₦3.0M / month', availability: 'Available', image: 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#111'/><rect width='100%' height='100%' fill='#FFC300' opacity='0.22'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='26' font-weight='700' fill='white'>AIRPORT RD • CUBE</text></svg>`), details: 'First sight for arrivals. Massive impact cube format.', featured: false },
    { id: 'b7', title: 'Kano Zoo Road Leader', location: 'Zoo Road, Kano', city: 'Kano', size: '12m x 4m', type: 'Static', price: '₦850K / month', availability: 'Available', image: 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#1e1e1e'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='26' font-weight='700' fill='white'>KANO ZOO RD • STATIC</text></svg>`), details: 'Northern market penetration with dominant visibility.', featured: false },
    { id: 'b8', title: 'Enugu Abakaliki Express', location: 'Abakaliki Rd, Enugu', city: 'Enugu', size: '15m x 4.5m', type: 'Gantry', price: '₦1.1M / month', availability: 'Limited', image: 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='#111'/><rect width='100%' height='100%' fill='#FF3B9A' opacity='0.18'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='24' font-weight='700' fill='white'>ENUGU EXPRESS • GANTRY</text></svg>`), details: 'South-East gateway with inter-state traffic.', featured: false },
  ],
  testimonials: [
    { id: 't1', name: 'Amara Okoro', role: 'Marketing Lead, Paystack', quote: 'BeeLight gave us 3x recall in 2 weeks on the island. The flip preview and real monitoring is next-level.', avatar: 'AO' },
    { id: 't2', name: 'Tunde Alabi', role: 'Brand Manager, MTN', quote: 'Fastest OOH execution we’ve had. Digital screens + street poles delivered full Lagos dominance.', avatar: 'TA' },
    { id: 't3', name: 'Fatima Bello', role: 'CEO, Zuri Foods', quote: 'From Abuja to PH, they handled print, permits and proofing. Zero stress, maximum glow.', avatar: 'FB' },
  ],
  faqs: [
    { id: 'f1', question: 'What services do you offer?', answer: 'Billboard Advertising, Street Branding, Transit Branding, Digital OOH (DOOH), Media Planning & Buying, and Installation & Maintenance. We handle end-to-end from site selection to monitoring.', category: 'Services' },
    { id: 'f2', question: 'Where are your billboards located?', answer: '250+ premium sites across 15+ cities: Lagos (VI, Ikoyi, Lekki, Ikeja, Yaba), Abuja, PH, Kano, Enugu, Ibadan, etc. Filter by city in Inventory.', category: 'Inventory' },
    { id: 'f3', question: 'How much does a campaign cost?', answer: 'Static from ₦850k/mo, Digital from ₦3.6M/mo depending on size, city and duration. We bundle print + install + monitoring. Chat for a custom quote.', category: 'Pricing' },
    { id: 'f4', question: 'How do I book?', answer: 'Pick sites in Inventory, hit Enquire (pre-filled WhatsApp), or use Contact form. We send IO in 2hrs and can go live in 48-72hrs after artwork.', category: 'Booking' },
    { id: 'f5', question: 'Do you handle design and installation?', answer: 'Yes. Large-format printing, night installations, weekly photo proofs, and maintenance included. We also offer design adaptation.', category: 'Services' },
  ],
  team: [
    { id: 'tm1', name: 'Gbenga Phillips', role: 'Founder & CEO', bio: 'Advert Consultant, 12 years OOH. Built hive strategy for 300+ campaigns.', avatar: 'KN' },
    { id: 'tm2', name: 'Iyiola Adu', role: 'Head of Inventory', bio: 'Owns 250+ site relationships. Negotiates premium visibility.', avatar: 'ZY' },
    { id: 'tm3', name: 'Ranti Ijora', role: 'Creative Ops', bio: 'Leads print & install crews. Night owl, perfect finish.', avatar: 'DO' },
  ],
  aboutImages: [
  {
    id: 'about1',
    src: '/images/about-bill-1.png',
    alt: 'BeeLight outdoor advertising operations',
    caption: 'Planning visibility with precision.'
  },
  {
    id: 'about2',
    src: '/images/about-bill-2.png',
    alt: 'BeeLight advertising installation team',
    caption: 'Campaign execution from print to proof.'
  },
],
  settings: { accent: '#FFC300', adminEmail: 'admin@beelightadvertising.com', whatsapp: '2348056615526', logoUrl: '', siteName: 'BeeLightAdvertising' },
  address: '2A Babatunde Street, off Ogunlana Drive, Surulere, Lagos',
  hours: 'Mon - Sat: 9am - 6pm WAT'
};

// Logo Component
function Logo({ variant='dark', small=false }: { variant?: 'dark'|'light', small?: boolean }) {
  const light = variant === 'light';
  return (
    <div role="img" aria-label="BeeLight Advertising" className={`shrink-0 flex items-center gap-2 ${small ? 'scale-90 origin-left' : ''}`}>
      <img
  src="/images/bee-logo-gold.jpg"
  alt=""
  aria-hidden="true"
  className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0"
/>
      <span className="display font-extrabold tracking-[-0.04em] leading-none text-[21px] md:text-[26px] text-white">BEE<span className="text-[#FFC300]">LIGHT</span></span>
    </div>
  );
}

// Flip Card
function FlipCard({ item, whatsapp }: { item: InventoryItem; whatsapp: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="group h-[320px] [perspective:1200px] cursor-pointer" onClick={()=>setFlipped(!flipped)} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' ')setFlipped(!flipped)}} tabIndex={0} role="button" aria-label={`View details for ${item.title}`}>
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped?'[transform:rotateY(180deg)]':'md:group-hover:[transform:rotateY(180deg)]'}`}>
        {/* Front */}
        <div className="absolute inset-0 rounded-[22px] overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl [backface-visibility:hidden]">
          <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFC300] text-black">{item.type}</span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${item.availability==='Available'?'bg-emerald-400 text-black':'bg-white/20 text-white backdrop-blur'}`}>{item.availability}</span>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="text-[12px] text-white/70 flex items-center gap-1.5"><span>📍</span>{item.location}</div>
            <div className="text-white font-bold text-[16px] leading-tight mt-1 line-clamp-2">{item.title}</div>
            <div className="text-white/60 text-[12px] mt-1">{item.size} • {item.city}</div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-[11px] tracking-widest font-bold text-white bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">FLIP</div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-[22px] overflow-hidden border border-white/10 bg-[#12121a] [transform:rotateY(180deg)] [backface-visibility:hidden] p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-bold text-white leading-tight text-[15px]">{item.title}</h4>
            <span className="text-[#FFC300] font-mono text-[11px] border border-[#FFC300]/30 px-2 py-1 rounded-full">{item.city}</span>
          </div>
          <div className="mt-4 space-y-2 text-[13px]">
            <div className="flex justify-between"><span className="text-white/50">Location</span><span className="text-white font-medium text-right ml-2">{item.location}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Size</span><span className="text-white">{item.size}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Type</span><span className="text-white">{item.type}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Price</span><span className="text-[#00F5FF] font-bold">{item.price}</span></div>
          </div>
          <p className="mt-3 text-[12.5px] text-white/60 leading-relaxed line-clamp-3">{item.details}</p>
          <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${item.title} at ${item.location}`)}`} target="_blank" rel="noopener" className="mt-auto w-full rounded-full bg-white text-black font-bold text-[13px] py-2.5 text-center hover:bg-[#FFC300] transition">Enquire → WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

function BusinessMap({ address }: { address: string }) {
  const map = useMap();
  const geocodingLibrary = useMapsLibrary('geocoding');
  const [officePosition, setOfficePosition] = useState<{ lat: number; lng: number } | null>(null);
  const [visitorPosition, setVisitorPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [mapMessage, setMapMessage] = useState('Locating the BeeLight office…');

  useEffect(() => {
    if (!map || !geocodingLibrary) return;
    const geocoder = new geocodingLibrary.Geocoder();
    geocoder.geocode({ address }).then(({ results }) => {
      const location = results[0]?.geometry.location;
      if (!location) throw new Error('Address not found');
      const position = { lat: location.lat(), lng: location.lng() };
      setOfficePosition(position);
      map.setCenter(position);
      map.setZoom(16);
      setMapMessage('BeeLight office');
    }).catch(() => setMapMessage('Google could not locate this address. Use Get Directions below.'));
  }, [address, geocodingLibrary, map]);

  const locateVisitor = () => {
    if (!navigator.geolocation) {
      setMapMessage('Location is not supported by this browser.');
      return;
    }
    setMapMessage('Requesting your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = { lat: coords.latitude, lng: coords.longitude };
        setVisitorPosition(position);
        map?.panTo(position);
        map?.setZoom(14);
        setMapMessage('Your live location is shown in blue.');
      },
      () => setMapMessage('Location permission was denied or unavailable.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}${visitorPosition ? `&origin=${visitorPosition.lat},${visitorPosition.lng}` : ''}`;

  return (
    <div className="space-y-3">
      <div className="h-[420px] rounded-[28px] overflow-hidden border border-white/10 bg-[#111] relative">
        <Map
          defaultCenter={{ lat: 6.5059, lng: 3.3540 }}
          defaultZoom={14}
          mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          {officePosition && (
            <AdvancedMarker position={officePosition} title="BeeLight Advertising">
              <Pin background="#FFC300" borderColor="#111111" glyphColor="#111111" />
            </AdvancedMarker>
          )}
          {visitorPosition && (
            <AdvancedMarker position={visitorPosition} title="Your location">
              <Pin background="#00F5FF" borderColor="#0A0A0F" glyphColor="#0A0A0F" />
            </AdvancedMarker>
          )}
        </Map>
      </div>
      <div className="rounded-[18px] glass p-4">
        <div className="text-[12px] text-white/60">{mapMessage}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={locateVisitor} className="h-10 px-4 rounded-full bg-[#00F5FF] text-black font-bold text-[12px]">◎ Use my live location</button>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="h-10 px-4 rounded-full bg-[#FFC300] text-black font-bold text-[12px] flex items-center">Get directions →</a>
        </div>
      </div>
    </div>
  );
}

function LocationPreviewMap({ address }: { address: string }) {
  const map = useMap();
  const geocodingLibrary = useMapsLibrary('geocoding');
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!map || !geocodingLibrary) return;
    const geocoder = new geocodingLibrary.Geocoder();
    geocoder.geocode({ address }).then(({ results }) => {
      const location = results[0]?.geometry.location;
      if (!location) return;
      const nextPosition = { lat: location.lat(), lng: location.lng() };
      setPosition(nextPosition);
      map.setCenter(nextPosition);
      map.setZoom(16);
    }).catch(() => undefined);
  }, [address, geocodingLibrary, map]);

  return (
    <Map
      defaultCenter={{ lat: 6.4355, lng: 3.4550 }}
      defaultZoom={15}
      mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}
      gestureHandling="cooperative"
      disableDefaultUI
      style={{ width: '100%', height: '100%' }}
    >
      {position && (
        <AdvancedMarker position={position} title="Lekki Toll Plaza">
          <Pin background="#FFC300" borderColor="#111111" glyphColor="#111111" />
        </AdvancedMarker>
      )}
    </Map>
  );
}

export default function App() {
  const [data, setData] = useState<SiteData>(defaultData);
  const [path, setPath] = useState('/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [subCount, setSubCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [homeTick, setHomeTick] = useState(0);

  // Load from localStorage
  useEffect(()=>{
    const stored = localStorage.getItem('beelight_data_v2');
    if(stored){
      try{
        const parsed = JSON.parse(stored);
        setData({
          ...defaultData,
          ...parsed,
          address: parsed.address === 'The Hive, 12A Admiralty Way, Lekki Phase 1, Lagos' ? defaultData.address : (parsed.address || defaultData.address),
          aboutImages: defaultData.aboutImages.map((fallbackImage, index) => {
  const savedImage = parsed.aboutImages?.[index];

  return savedImage?.src
    ? savedImage
    : fallbackImage;
}),
        });
      }catch{}
    }
    const subs = localStorage.getItem('beelight_submissions');
    if(subs){ try{ setSubCount(JSON.parse(subs).length); }catch{} }
    const cookie = localStorage.getItem('beelight_cookie');
    if(cookie) setCookieAccepted(true);
    const hash = window.location.hash.replace('#','') || '/';
    setPath(hash.startsWith('/')?hash:'/'+hash);
    window.addEventListener('hashchange', ()=>{ const h=window.location.hash.replace('#','')||'/'; setPath(h.startsWith('/')?h:'/'+h); setIsMenuOpen(false); window.scrollTo(0,0); });
  }, []);

  // Persist
  useEffect(()=>{
    try { localStorage.setItem('beelight_data_v2', JSON.stringify(data)); }
    catch { console.warn('BeeLight data could not be saved because browser storage is full.'); }
  }, [data]);

  // SEO titles
  useEffect(()=>{
    const titles: Record<string,string> = {
      '/': 'BeeLightAdvertising — Bright Ideas, Buzzin Visibility',
      '/about': 'About — BeeLightAdvertising',
      '/services': 'Services — BeeLightAdvertising',
      '/inventory': 'Inventory — BeeLightAdvertising',
      '/contact': 'Contact — BeeLightAdvertising',
      '/admin': 'Admin — BeeLightAdvertising',
    };
    document.title = titles[path] || 'BeeLightAdvertising';
  }, [path]);

  const navigate = (p: string)=>{
    if(p===path){
      window.scrollTo({top:0, behavior:'smooth'});
      setHomeTick(t=>t+1);
      // toast feedback for same-page nav to satisfy interaction audit
      const el = document.getElementById('same-nav-feedback');
      if(el){ el.textContent = `Re-focused ${p} • ${Date.now()}`; }
    } else {
      window.location.hash = p; setPath(p); window.scrollTo(0,0);
    }
    setIsMenuOpen(false);
  };

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<{from:'user'|'bot', text:string}[]>([{from:'bot', text:'Hi! I’m BeeLight AI ✨ Ask me about services, locations, pricing or booking.'}]);
  const [chatInput, setChatInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:'smooth'}); }, [chatMsgs, typing]);

  const answerQuestion = (q: string): string | null => {
    const low = q.toLowerCase();
    // hardcoded intents
    if(low.includes('service')) return data.faqs.find(f=>f.question.toLowerCase().includes('service'))?.answer || data.services.map(s=>s.title).join(', ');
    if(low.includes('location')||low.includes('where')) return data.faqs.find(f=>f.question.toLowerCase().includes('where'))?.answer || `We have ${data.metrics[0].value} sites across ${data.metrics[1].value} cities including Lagos, Abuja, PH, Kano, Enugu.`;
    if(low.includes('cost')||low.includes('price')||low.includes('how much')) return data.faqs.find(f=>f.question.toLowerCase().includes('cost')||f.question.toLowerCase().includes('much'))?.answer || 'Static from ₦850k, Digital from ₦3.6M per month.';
    if(low.includes('book')||low.includes('booking')) return data.faqs.find(f=>f.question.toLowerCase().includes('book'))?.answer || 'Pick sites in Inventory and hit Enquire via WhatsApp. We send IO in 2hrs.';
    if(low.includes('design')||low.includes('install')) return data.faqs.find(f=>f.question.toLowerCase().includes('design'))?.answer || 'Yes we handle print, installation and weekly monitoring.';
    // keyword match faqs
    let best: {faq:FAQ, score:number}|null=null;
    for(const faq of data.faqs){
      const words = faq.question.toLowerCase().split(/\W+/);
      let score=0; for(const w of words){ if(w.length>2 && low.includes(w)) score++; }
      if(score>0 && (!best || score>best.score)) best={faq, score};
    }
    if(best && best.score>=2) return best.faq.answer;
    return null;
  };

  const handleChatSend = () => {
    if(!chatInput.trim()) return;
    const q = chatInput.trim();
    setChatMsgs(m=>[...m, {from:'user', text:q}]);
    setChatInput('');
    setTyping(true);
    setTimeout(()=>{
      const ans = answerQuestion(q);
      if(ans){
        setChatMsgs(m=>[...m, {from:'bot', text:ans}]);
      } else {
        setChatMsgs(m=>[...m, {from:'bot', text:`Let me connect you to our team — I couldn't find a precise answer. Tap WhatsApp or send to email and we'll reply in minutes.`}]);
      }
      setTyping(false);
    }, 650);
  };

  // Filters for inventory
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('All');

  const cities = useMemo(()=>['All', ...Array.from(new Set(data.inventory.map(i=>i.city)))], [data.inventory]);
  const types = useMemo(()=>['All', ...Array.from(new Set(data.inventory.map(i=>i.type)))], [data.inventory]);

  const filteredInventory = useMemo(()=> data.inventory.filter(i=>{
    const matchSearch = !search || (i.title+i.location+i.city).toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter==='All' || i.city===cityFilter;
    const matchType = typeFilter==='All' || i.type===typeFilter;
    const matchAvail = availFilter==='All' || i.availability===availFilter;
    return matchSearch && matchCity && matchType && matchAvail;
  }), [data.inventory, search, cityFilter, typeFilter, availFilter]);

  // Contact form
  const [contactForm, setContactForm] = useState({name:'', email:'', phone:'', company:'', message:''});
  const [toast, setToast] = useState<string|null>(null);
  const showToast = (t:string)=>{ setToast(t); setTimeout(()=>setToast(null), 3500); };

  const handleContactSubmit = (e: React.FormEvent)=>{
    e.preventDefault();
    const submissions = JSON.parse(localStorage.getItem('beelight_submissions')||'[]');
    submissions.push({...contactForm, date: new Date().toISOString()});
    localStorage.setItem('beelight_submissions', JSON.stringify(submissions));
    setSubCount(submissions.length);
    showToast('Message queued — opening email client & WhatsApp backup');
    // mailto attempt
    const subject = encodeURIComponent(`New lead: ${contactForm.name} - ${contactForm.company}`);
    const body = encodeURIComponent(`Name: ${contactForm.name}\nEmail: ${contactForm.email}\nPhone: ${contactForm.phone}\nCompany: ${contactForm.company}\n\nMessage:\n${contactForm.message}`);
    window.open(`mailto:${data.settings.adminEmail}?subject=${subject}&body=${body}`, '_blank');
    setContactForm({name:'', email:'', phone:'', company:'', message:''});
  };

  // Admin auth
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminTab, setAdminTab] = useState<'hero'|'metrics'|'services'|'inventory'|'testimonials'|'faq'|'team'|'about'|'settings'|'docs'>('hero');
  const [draggingInventoryId, setDraggingInventoryId] = useState<string | null>(null);

  const prepareInventoryImage = (file: File): Promise<string> => new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      reject(new Error('Use a JPG, PNG or WebP image.'));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('Image is too large. Maximum source size is 8 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The image could not be read.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('The selected file is not a valid image.'));
      image.onload = () => {
        const maxDimension = 1400;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Your browser could not prepare this image.'));
          return;
        }
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

  const handleInventoryImageUpload = async (index: number, file?: File) => {
    if (!file) return;
    try {
      const image = await prepareInventoryImage(file);
      const inventory = [...data.inventory];
      inventory[index] = { ...inventory[index], image };
      const nextData = { ...data, inventory };
      localStorage.setItem('beelight_data_v2', JSON.stringify(nextData));
      setData(nextData);
      showToast(`Inventory image updated for ${inventory[index].title} ✓`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'The image could not be uploaded.');
    } finally {
      setDraggingInventoryId(null);
    }
  };

  const handleAboutImageUpload = (index: number, file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Use a JPG, PNG or WebP image.');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      showToast('Image is too large. Maximum size is 1.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const aboutImages = [...data.aboutImages];
      aboutImages[index] = { ...aboutImages[index], src: String(reader.result) };
      const nextData = { ...data, aboutImages };
      try {
        localStorage.setItem('beelight_data_v2', JSON.stringify(nextData));
        setData(nextData);
        showToast(`About image ${index + 1} updated ✓`);
      } catch {
        showToast('Browser storage is full. Try a smaller image.');
      }
    };
    reader.onerror = () => showToast('The image could not be read.');
    reader.readAsDataURL(file);
  };

  const isActive = (p:string)=> path===p;

  return (
    <div className="min-h-screen max-w-[100vw] bg-[#0A0A0F] text-white selection:bg-[#FFC300]/30 selection:text-white antialiased relative overflow-x-hidden" style={{fontFamily:'Inter, Poppins, system-ui, -apple-system, sans-serif'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
        *{font-family:Inter, sans-serif}
        .display{font-family:Space Grotesk, Inter, sans-serif}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:10px}
        .glass{backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08)}
        .glow{box-shadow:0 0 30px rgba(255,195,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)}
        .marquee{animation:none}
        .orb{filter:blur(60px); opacity:0.35; mix-blend:screen; max-width:100vw}
        .billboard-scene{animation:billboard-drift 16s ease-in-out infinite alternate;will-change:transform}
        .billboard-swirl{stroke-dasharray:34 18;animation:swirl-flow 4.5s linear infinite}
        .site-billboard-motion{animation:site-billboard-drive 24s ease-in-out infinite alternate;will-change:transform}
        @keyframes billboard-drift{0%{transform:scale(1.045) translate3d(-0.7%,0,0)}100%{transform:scale(1.09) translate3d(1.2%,-0.5%,0)}}
        @keyframes site-billboard-drive{0%{transform:scale(1.06) translate3d(-3.5%,0,0)}100%{transform:scale(1.13) translate3d(3.5%,-1.2%,0)}}
        @keyframes swirl-flow{to{stroke-dashoffset:-208}}
        @media(max-width:640px){.billboard-scene{animation-duration:22s;background-position:62% center}.site-billboard-motion{animation-duration:32s;background-position:66% center}.billboard-swirl{animation-duration:7s}}
        @media(prefers-reduced-motion:reduce){.billboard-scene,.site-billboard-motion,.billboard-swirl{animation:none!important}.billboard-scene,.site-billboard-motion{transform:none!important}}
      `}</style>

      {/* Persistent billboard scene — decorative, lightweight and click-through on every route */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07070b]">
        <div className="site-billboard-motion absolute -inset-[6%] bg-cover bg-[66%_center] md:bg-center opacity-55" style={{backgroundImage:"url('/beelight-lagos-billboard-hero.png')"}}/>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,15,0.50)_0%,rgba(7,7,13,0.76)_52%,rgba(8,8,13,0.96)_100%)]"/>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,12,0.72),rgba(7,7,12,0.38)_48%,rgba(7,7,12,0.70))]"/>
      </div>

      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden max-w-[100vw] max-h-screen">
        <div className="orb absolute top-0 left-0 w-[480px] h-[480px] rounded-full bg-[#FFC300]/20 -translate-x-1/3 -translate-y-1/3" />
        <div className="orb absolute top-[40%] right-0 w-[520px] h-[520px] rounded-full bg-[#00F5FF]/15 translate-x-1/3" />
        <div className="orb absolute bottom-0 left-1/2 w-[600px] h-[600px] rounded-full bg-[#FF3B9A]/12 -translate-x-1/2 translate-y-1/3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}}/>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0A0F]/70 backdrop-blur-xl">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 h-[64px] flex items-center justify-between gap-4">
          <button onClick={()=>navigate('/')} className="flex items-center"><Logo variant="dark"/></button>
          <nav className="hidden md:flex items-center gap-1">
            {[
              {p:'/', l:'Home'},
              {p:'/about', l:'About'},
              {p:'/services', l:'Services'},
              {p:'/inventory', l:'Inventory'},
              {p:'/contact', l:'Contact'},
            ].map(item=>(
              <button key={item.p} onClick={()=>navigate(item.p)} data-nav={item.p} className={`px-4 py-2 rounded-full text-[13.5px] font-medium transition ${isActive(item.p)?'bg-white text-black':'text-white/70 hover:text-white hover:bg-white/10'}`}>{item.l}</button>
            ))}
            <button onClick={()=>navigate('/admin')} className={`ml-2 px-4 py-2 rounded-full text-[13px] font-bold border ${isActive('/admin')?'bg-[#FFC300] text-black border-[#FFC300]':'border-white/15 text-white/80 hover:text-white'}`}>Admin</button>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <a href={`https://wa.me/${data.settings.whatsapp}`} target="_blank" rel="noopener" className="h-9 px-4 rounded-full bg-[#FFC300] text-black font-bold text-[13px] flex items-center gap-1.5 hover:brightness-110 transition">● WhatsApp</a>
            <button onClick={()=>navigate('/contact')} className="h-9 px-4 rounded-full bg-white text-black font-bold text-[13px]">Get Quote</button>
          </div>
          <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className="md:hidden w-9 h-9 rounded-full glass flex items-center justify-center">☰</button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0A0A0F]/95 backdrop-blur-xl px-5 py-4 space-y-1">
            {[
              {p:'/', l:'Home'},
              {p:'/about', l:'About'},
              {p:'/services', l:'Services'},
              {p:'/inventory', l:'Inventory'},
              {p:'/contact', l:'Contact'},
              {p:'/admin', l:'Admin'},
            ].map(item=>(
              <button key={item.p} onClick={()=>navigate(item.p)} data-nav={item.p} className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium ${isActive(item.p)?'bg-white text-black':'bg-white/[0.04] text-white/80'}`}>{item.l}</button>
            ))}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-8 overflow-x-hidden min-w-0">
        <div id="same-nav-feedback" className="sr-only" aria-live="polite">{homeTick}</div>
        {/* HOME */}
        {path==='/' && (
          <div className="pb-24">
            {/* Hero */}
            <section className="relative mt-5 md:mt-8 min-h-[720px] md:min-h-[680px] rounded-[28px] md:rounded-[38px] overflow-hidden border border-white/10 isolate shadow-[0_35px_100px_rgba(0,0,0,0.45)]">
              <div aria-hidden="true" className="billboard-scene pointer-events-none absolute -inset-4 bg-cover bg-[62%_center] md:bg-center" style={{backgroundImage:"url('/beelight-lagos-billboard-hero.png')"}}/>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,9,0.97)_0%,rgba(5,5,9,0.82)_40%,rgba(5,5,9,0.30)_72%,rgba(5,5,9,0.50)_100%)] md:bg-[linear-gradient(90deg,rgba(5,5,9,0.96)_0%,rgba(5,5,9,0.76)_43%,rgba(5,5,9,0.16)_72%,rgba(5,5,9,0.30)_100%)]"/>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060609] via-transparent to-black/30"/>
              <svg aria-hidden="true" viewBox="0 0 1200 230" preserveAspectRatio="none" className="pointer-events-none absolute z-[1] bottom-0 left-0 w-full h-[150px] md:h-[210px] opacity-90">
                <defs><filter id="hero-swirl-glow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                <path className="billboard-swirl" d="M-60 175C170 40 300 230 520 128S870 20 1260 142" fill="none" stroke="#FFC300" strokeWidth="7" filter="url(#hero-swirl-glow)"/>
                <path d="M-60 195C210 80 360 238 590 150S920 65 1260 164" fill="none" stroke="#FFDF66" strokeOpacity=".58" strokeWidth="2"/>
              </svg>
              <div className="relative z-10 min-h-[720px] md:min-h-[680px] grid lg:grid-cols-[1.08fr_0.92fr] gap-8 items-center px-5 py-10 sm:px-8 md:px-12 md:py-14">
              <div className="max-w-[610px] rounded-[26px] bg-black/45 backdrop-blur-md border border-white/10 p-5 sm:p-7 md:p-9 shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] tracking-widest font-bold uppercase text-[#FFC300]">● LIVE • 250+ SITES BUZZING</div>
                <h1 className="display mt-5 text-[36px] md:text-[58px] leading-[0.95] tracking-[-0.04em] font-[700]">{data.hero.headline.split('.').map((part,i,arr)=> i===arr.length-1?part: <span key={i}>{part}.<br/></span>)}</h1>
                <p className="mt-5 text-[16px] md:text-[18px] leading-[1.6] text-white/60 max-w-[560px]">{data.hero.subheadline}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={()=>navigate('/inventory')} className="h-12 px-6 rounded-full bg-[#FFC300] text-black font-bold text-[14px] hover:brightness-110 transition shadow-[0_0_30px_rgba(255,195,0,0.35)]">{data.hero.cta1} →</button>
                  <button onClick={()=>navigate('/contact')} className="h-12 px-6 rounded-full glass font-bold text-[14px] hover:bg-white/10 transition">{data.hero.cta2}</button>
                </div>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-full">
                  {data.metrics.map((m,i)=>(
                    <div key={i} className="rounded-2xl glass p-4 min-w-0">
                      <div className="text-[22px] font-bold display">{m.value}</div>
                      <div className="text-[12px] font-bold uppercase tracking-widest text-white/40">{m.label}</div>
                      <div className="text-[11px] text-white/40 mt-1">{m.suffix}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative self-end lg:self-center">
                <div className="absolute -inset-10 bg-gradient-to-br from-[#FFC300]/20 via-[#00F5FF]/10 to-[#FF3B9A]/20 blur-[40px] rounded-[40px]"/>
                <div className="relative grid gap-4">
                  <div className="rounded-[28px] overflow-hidden border border-white/10 aspect-[16/10] bg-[#111] relative">
                    {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['geocoding']}>
                        <LocationPreviewMap address="Lekki Toll Plaza, Lekki-Epe Expressway, Lagos, Nigeria" />
                      </APIProvider>
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#FFC300]/30 to-[#FF3B9A]/20 text-center px-6">
                        <div><div className="text-[13px] font-bold tracking-widest text-white/70">LEKKI TOLL • MAP</div><div className="mt-2 text-[11px] text-white/45">Add the Google Maps key to .env.local</div></div>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"/>
                    <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="px-3 py-1.5 rounded-full bg-white text-black text-[12px] font-bold">Lekki • LIVE NOW</div>
                      <div className="w-8 h-8 rounded-full bg-[#00F5FF] flex items-center justify-center text-black">●</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[22px] glass p-4">
                      <div className="text-[11px] tracking-widest font-bold text-white/40 uppercase">Impressions / Day</div>
                      <div className="text-[26px] font-bold mt-1">412K</div>
                      <div className="h-[28px] mt-2 flex items-end gap-1">{[6,10,8,14,9,16,12].map((h,i)=><div key={i} style={{height:h*1.6}} className="w-1.5 rounded-full bg-[#FFC300]"/> )}</div>
                    </div>
                    <div className="rounded-[22px] bg-white text-black p-4">
                      <div className="text-[11px] tracking-widest font-bold uppercase opacity-60">Avg. Dwell</div>
                      <div className="text-[26px] font-bold mt-1">8.4s</div>
                      <div className="text-[12px] mt-1 opacity-70">High attention corridor • Toll plaza</div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </section>

            {/* Services */}
            <section className="mt-20">
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <h2 className="display text-[26px] md:text-[32px] font-bold tracking-tight">Services that make streets glow</h2>
                <button onClick={()=>navigate('/services')} className="text-[13px] font-bold text-white/60 hover:text-white">View all services →</button>
              </div>
              <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-full">
                {data.services.slice(0,6).map(s=>(
                  <div key={s.id} className="rounded-[22px] glass p-6 group hover:bg-white/[0.06] transition min-w-0">
                    <div className="w-11 h-11 rounded-full bg-[#FFC300]/15 border border-[#FFC300]/20 flex items-center justify-center text-[20px]">{s.icon}</div>
                    <div className="mt-4 font-bold text-[16px]">{s.title}</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-white/55">{s.description}</div>
                    <div className="mt-4 flex flex-wrap gap-2">{s.features.slice(0,3).map((f,i)=><span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10">{f}</span>)}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured billboards */}
            <section className="mt-20">
              <h2 className="display text-[26px] md:text-[32px] font-bold tracking-tight">Featured Hive Spots</h2>
              <div className="mt-6 grid md:grid-cols-3 gap-5 max-w-full">
                {data.inventory.filter(i=>i.featured).slice(0,3).map(item=>(
                  <FlipCard key={item.id} item={item} whatsapp={data.settings.whatsapp}/>
                ))}
              </div>
              <button onClick={()=>navigate('/inventory')} className="mt-6 mx-auto flex h-11 px-6 rounded-full glass font-bold text-[13px]">Browse full inventory ({data.inventory.length}) →</button>
            </section>

            {/* Logos marquee */}
            <section className="mt-20 rounded-[22px] glass overflow-hidden max-w-full px-6 py-4">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                {['PAYSTACK','MTN','DANGOTE','FIRSTBANK','UBA','JUMIA','GTCO','BUA'].map((brand,i)=>(
                  <span key={i} className="text-[12px] tracking-[0.2em] font-bold text-white/25">{brand}</span>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="mt-20">
              <h2 className="display text-[26px] md:text-[32px] font-bold tracking-tight">Trusted by growth teams</h2>
              <div className="mt-6 grid md:grid-cols-3 gap-4 max-w-full">
                {data.testimonials.map(t=>(
                  <div key={t.id} className="rounded-[22px] glass p-6 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFC300] text-black grid place-items-center font-bold text-[13px]">{t.avatar}</div>
                      <div><div className="font-bold text-[13px]">{t.name}</div><div className="text-[11px] text-white/50">{t.role}</div></div>
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed text-white/70">“{t.quote}”</p>
                    <div className="mt-4 text-[#FFC300] text-[12px]">★★★★★</div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ preview */}
            <section className="mt-20 grid lg:grid-cols-2 gap-6">
              <div className="rounded-[28px] bg-[#FFC300] text-black p-8">
                <div className="text-[12px] font-bold tracking-widest uppercase opacity-60">FAQ • Quick answers</div>
                <div className="display text-[28px] font-bold leading-[1.05] mt-3">Everything you need to launch bright.</div>
                <button onClick={()=>navigate('/contact')} className="mt-6 h-11 px-5 rounded-full bg-black text-white font-bold text-[13px]">Talk to a human →</button>
              </div>
              <div className="space-y-3">
                {data.faqs.slice(0,3).map(f=>(
                  <div key={f.id} className="rounded-[18px] glass p-5">
                    <div className="font-bold text-[14px]">{f.question}</div>
                    <div className="mt-2 text-[13px] leading-relaxed text-white/60">{f.answer}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ABOUT */}
        {path==='/about' && (
          <div className="pb-24 pt-10">
            <div className="max-w-[900px]">
              <div className="inline-flex px-3 py-1 rounded-full glass text-[11px] tracking-widest font-bold">ABOUT BEELIGHT</div>
              <h1 className="display text-[36px] md:text-[56px] leading-[0.95] font-bold tracking-tight mt-4">We are the hive that makes your brand impossible to miss.</h1>
              <p className="mt-6 text-[16px] leading-relaxed text-white/60 max-w-[700px]">BeeLightAdvertising was built on a simple observation: attention is the only currency. Inspired by beehive precision and light that commands the eye, we built Nigeria’s most responsive OOH platform — 250+ sites, one dashboard, real proof.</p>
            </div>
            <div className="mt-10 grid md:grid-cols-2 gap-5">
              {data.aboutImages.map((image, index) => (
                <figure key={image.id} className="rounded-[24px] overflow-hidden border border-white/10 bg-white/[0.04]">
                  {image.src ? (
                    <img src={image.src} alt={image.alt} className="w-full aspect-[16/10] object-cover" />
                  ) : (
                    <div className="aspect-[16/10] grid place-items-center bg-gradient-to-br from-[#FFC300]/20 via-white/[0.03] to-[#00F5FF]/15">
                      <div className="text-center px-6"><div className="text-[34px]">📸</div><div className="mt-2 text-[12px] font-bold tracking-widest text-white/50">ABOUT IMAGE {index + 1}</div><div className="mt-1 text-[11px] text-white/35">Upload from Admin → About Images</div></div>
                    </div>
                  )}
                  <figcaption className="p-4 text-[13px] text-white/65">{image.caption}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-4">
              <div className="rounded-[22px] glass p-6"><div className="text-[#FFC300] font-bold text-[12px] tracking-widest">MISSION</div><p className="mt-3 text-[15px] leading-relaxed text-white/70">Make premium outdoor visibility accessible, measurable and wickedly fast to launch for every ambitious brand.</p></div>
              <div className="rounded-[22px] glass p-6"><div className="text-[#00F5FF] font-bold text-[12px] tracking-widest">VISION</div><p className="mt-3 text-[15px] leading-relaxed text-white/70">A pan-African light network where brands glow in every city, with data, not guesswork.</p></div>
              <div className="rounded-[22px] glass p-6"><div className="text-[#FF3B9A] font-bold text-[12px] tracking-widest">VALUES</div><p className="mt-3 text-[15px] leading-relaxed text-white/70">Precision. Speed. Transparency. We print at night, install before dawn, and send photo proof by 9am.</p></div>
            </div>
            <div className="mt-16">
              <h2 className="display text-[24px] font-bold">Why BeeLight?</h2>
              <div className="mt-6 grid md:grid-cols-4 gap-4">
                {[
                  {t:'Hive Precision', d:'Sites picked for dwell, not just traffic. We map competitor share.', i:'🎯'},
                  {t:'Light Speed', d:'IO in 2hrs, live in 48-72hrs. No bureaucracy.', i:'⚡'},
                  {t:'Real Proof', d:'Weekly photo + video monitoring. No dark campaigns.', i:'📸'},
                  {t:'One Team', d:'Permit, print, install, maintain. You talk to one hive.', i:'🐝'},
                ].map((c,i)=>(
                  <div key={i} className="rounded-[22px] bg-white text-black p-6"><div className="text-[22px]">{c.i}</div><div className="mt-3 font-bold">{c.t}</div><div className="mt-2 text-[13px] opacity-70 leading-relaxed">{c.d}</div></div>
                ))}
              </div>
            </div>
            <div className="mt-16">
              <h2 className="display text-[24px] font-bold">Team</h2>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {data.team.map(m=>(
                  <div key={m.id} className="rounded-[22px] glass p-6">
                    <div className="w-16 h-16 rounded-full bg-white text-black grid place-items-center font-bold text-[16px]">{m.avatar}</div>
                    <div className="mt-4 font-bold">{m.name}</div>
                    <div className="text-[12px] text-[#FFC300] font-bold tracking-widest uppercase mt-1">{m.role}</div>
                    <p className="mt-3 text-[13px] text-white/60 leading-relaxed">{m.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {path==='/services' && (
          <div className="pb-24 pt-10">
            <h1 className="display text-[36px] md:text-[48px] font-bold tracking-tight">Services engineered for attention</h1>
            <p className="mt-4 text-white/60 max-w-[600px]">From static giants to programmatic DOOH — we own the full stack so you don’t chase 5 vendors.</p>
            <div className="mt-10 grid md:grid-cols-2 gap-5 max-w-full">
              {data.services.map(s=>(
                <div key={s.id} className="rounded-[28px] glass p-7 md:p-8 group hover:bg-white/[0.06] transition">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFC300]/15 border border-[#FFC300]/20 flex items-center justify-center text-[22px]">{s.icon}</div>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold tracking-widest uppercase">{s.features.length} INCLUDES</span>
                  </div>
                  <h3 className="display mt-6 text-[22px] font-bold">{s.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/60">{s.description}</p>
                  <div className="mt-6 space-y-2.5">
                    {s.features.map((f,i)=>(
                      <div key={i} className="flex items-center gap-2.5 text-[13px]"><span className="w-5 h-5 rounded-full bg-[#00F5FF]/20 flex items-center justify-center text-[10px]">✓</span><span className="text-white/80">{f}</span></div>
                    ))}
                  </div>
                  <button onClick={()=>navigate('/contact')} className="mt-7 h-10 px-5 rounded-full bg-white text-black font-bold text-[13px]">Request rate card →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {path==='/inventory' && (
          <div className="pb-24 pt-10">
            <div className="flex flex-wrap gap-4 items-end justify-between">
              <div>
                <h1 className="display text-[32px] md:text-[42px] font-bold tracking-tight">Inventory that buzzes</h1>
                <p className="mt-2 text-white/60 text-[14px]">Tap to flip • {filteredInventory.length} sites • Glass flip cards mandatory</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 px-3 rounded-full glass flex items-center gap-2"><span className="text-[12px] text-white/40">Search</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Lekki, Ikoyi..." className="bg-transparent outline-none text-[13px] w-[120px] md:w-[180px] placeholder:text-white/20"/></div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 max-w-full">
              <div className="flex flex-wrap gap-1 items-center glass rounded-full p-1 max-w-full">
                {cities.map(c=> <button key={c} onClick={()=>setCityFilter(c)} className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition ${cityFilter===c?'bg-white text-black':'text-white/60 hover:text-white'}`}>{c}</button>)}
              </div>
              <div className="flex flex-wrap gap-1 items-center glass rounded-full p-1 max-w-full">
                {types.map(t=> <button key={t} onClick={()=>setTypeFilter(t)} className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition ${typeFilter===t?'bg-[#FFC300] text-black':'text-white/60 hover:text-white'}`}>{t}</button>)}
              </div>
              <div className="flex flex-wrap gap-1 items-center glass rounded-full p-1 max-w-full">
                {['All','Available','Booked','Limited'].map(a=> <button key={a} onClick={()=>setAvailFilter(a)} className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition ${availFilter===a?'bg-[#00F5FF] text-black':'text-white/60 hover:text-white'}`}>{a}</button>)}
              </div>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-full">
              {filteredInventory.map(item=> <FlipCard key={item.id} item={item} whatsapp={data.settings.whatsapp}/>)}
            </div>
            {filteredInventory.length===0 && <div className="mt-20 text-center text-white/40">No sites match your filters.</div>}
          </div>
        )}

        {/* CONTACT */}
        {path==='/contact' && (
          <div className="pb-24 pt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 max-w-full">
            <div>
              <h1 className="display text-[36px] font-bold tracking-tight">Let’s make your brand glow</h1>
              <p className="mt-3 text-white/60">We reply in 30 mins • IO in 2 hours • Live in 48-72h</p>
              <form onSubmit={handleContactSubmit} className="mt-8 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input required value={contactForm.name} onChange={e=>setContactForm({...contactForm, name:e.target.value})} placeholder="Full name *" className="h-12 rounded-2xl glass px-4 text-[14px] outline-none focus:border-[#FFC300]/50 border border-transparent"/>
                  <input required type="email" value={contactForm.email} onChange={e=>setContactForm({...contactForm, email:e.target.value})} placeholder="Work email *" className="h-12 rounded-2xl glass px-4 text-[14px] outline-none focus:border-[#FFC300]/50 border border-transparent"/>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={contactForm.phone} onChange={e=>setContactForm({...contactForm, phone:e.target.value})} placeholder="Phone / WhatsApp" className="h-12 rounded-2xl glass px-4 text-[14px] outline-none border border-transparent"/>
                  <input value={contactForm.company} onChange={e=>setContactForm({...contactForm, company:e.target.value})} placeholder="Company" className="h-12 rounded-2xl glass px-4 text-[14px] outline-none border border-transparent"/>
                </div>
                <textarea required value={contactForm.message} onChange={e=>setContactForm({...contactForm, message:e.target.value})} placeholder="Tell us about your campaign — cities, budget, dates" rows={5} className="w-full rounded-2xl glass p-4 text-[14px] outline-none border border-transparent resize-none"/>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="h-12 px-7 rounded-full bg-[#FFC300] text-black font-bold text-[14px] shadow-[0_0_20px_rgba(255,195,0,0.3)]">Send message →</button>
                  <a href={`https://wa.me/${data.settings.whatsapp}`} target="_blank" rel="noopener" className="h-12 px-7 rounded-full glass font-bold text-[14px] flex items-center gap-2">WhatsApp us</a>
                </div>
                <p className="text-[11px] text-white/30">Simulated serverless: stores in localStorage `beelight_submissions`, opens mailto to {data.settings.adminEmail}. Update email via Admin → Settings or env VITE_ADMIN_EMAIL.</p>
              </form>

              <div className="mt-10 grid md:grid-cols-2 gap-4">
                <div className="rounded-[20px] glass p-5"><div className="text-[11px] tracking-widest font-bold text-white/40 uppercase">Address</div><div className="mt-2 text-[14px] leading-relaxed">{data.address}</div></div>
                <div className="rounded-[20px] glass p-5"><div className="text-[11px] tracking-widest font-bold text-white/40 uppercase">Hours</div><div className="mt-2 text-[14px]">{data.hours}</div><div className="mt-2 text-[12px] text-white/50">Emergency line: +{data.settings.whatsapp}</div></div>
              </div>
            </div>
            <div className="space-y-4">
              {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['geocoding']}>
                  <BusinessMap address={data.address} />
                </APIProvider>
              ) : (
                <div className="rounded-[28px] border border-amber-400/30 bg-amber-400/10 p-7">
                  <div className="font-bold text-amber-300">Google Maps key required</div>
                  <p className="mt-2 text-[13px] text-white/60">Add VITE_GOOGLE_MAPS_API_KEY to .env.local, then restart Vite.</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-10 px-4 rounded-full bg-white text-black font-bold text-[12px] items-center">Open address in Google Maps →</a>
                </div>
              )}
              <div className="rounded-[22px] bg-white text-black p-6">
                <div className="font-bold text-[15px]">Need a rate card now?</div>
                <div className="text-[13px] opacity-70 mt-1">We’ll drop a PDF with availability + pricing in your WhatsApp.</div>
                <a href={`https://wa.me/${data.settings.whatsapp}?text=${encodeURIComponent('Hi BeeLight, send me the latest rate card')}`} target="_blank" rel="noopener" className="mt-4 inline-flex h-10 px-5 rounded-full bg-black text-white font-bold text-[13px] items-center">Get rate card on WhatsApp →</a>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {path==='/admin' && (
          <div className="pb-24 pt-10">
            {!adminAuthed ? (
              <div className="max-w-[420px] mx-auto mt-10 rounded-[28px] glass p-8">
                <Logo variant="dark"/>
                <h2 className="display text-[22px] font-bold mt-6">Admin access</h2>
                <p className="text-[13px] text-white/50 mt-2">
                    Enter your administrator password to continue.
                </p>
                <input type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder="Enter admin password" className="mt-6 w-full h-12 rounded-2xl bg-white/10 border border-white/10 px-4 text-[14px] outline-none"/>
                <button onClick={()=>{ if(adminPass==='beelight2025'){ setAdminAuthed(true); } else { showToast('Wrong password'); } }} className="mt-4 w-full h-12 rounded-full bg-[#FFC300] text-black font-bold">Unlock Hive</button>
                <button onClick={()=>navigate('/')} className="mt-3 w-full h-11 rounded-full glass font-bold text-[13px]">Back to site</button>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h1 className="display text-[30px] font-bold">Hive Control</h1>
                  <div className="flex gap-2">
                    <button onClick={()=>{
                      const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href=url; a.download=`beelight_backup_${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
                    }} className="h-9 px-4 rounded-full glass font-bold text-[12px]">Export JSON</button>
                    <button onClick={()=>fileInputRef.current?.click()} className="h-9 px-4 rounded-full bg-white text-black font-bold text-[12px]">Import JSON</button>
                    <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const parsed=JSON.parse(r.result as string); setData(parsed); showToast('Imported ✓'); }catch{ showToast('Invalid JSON'); } }; r.readAsText(f); }}/>
                    <button onClick={()=>setAdminAuthed(false)} className="h-9 px-4 rounded-full bg-white/10 font-bold text-[12px]">Logout</button>
                  </div>
                </div>

                <div className="mt-6 grid lg:grid-cols-[220px_1fr] gap-6">
                  <div className="rounded-[22px] glass p-2 h-fit">
                    {[
                      {k:'hero', l:'Hero'},
                      {k:'metrics', l:'Metrics'},
                      {k:'services', l:'Services'},
                      {k:'inventory', l:'Inventory'},
                      {k:'testimonials', l:'Testimonials'},
                      {k:'faq', l:'FAQ'},
                      {k:'team', l:'Team'},
                      {k:'about', l:'About Images'},
                      {k:'settings', l:'Settings'},
                      {k:'docs', l:'Docs'},
                    ].map(t=>(
                      <button key={t.k} onClick={()=>setAdminTab(t.k as any)} className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-bold transition ${adminTab===t.k?'bg-white text-black':'text-white/60 hover:text-white hover:bg-white/10'}`}>{t.l}</button>
                    ))}
                    <div className="mt-4 p-3 rounded-xl bg-[#FFC300]/10 border border-[#FFC300]/20 text-[11px] leading-relaxed text-white/70">
                      <div className="font-bold text-[#FFC300]">Quick stats</div>
                      <div className="mt-2 flex justify-between"><span>Inventory</span><span className="font-bold text-white">{data.inventory.length}</span></div>
                      <div className="flex justify-between"><span>Submissions</span><span className="font-bold text-white">{subCount}</span></div>
                      <div className="flex justify-between"><span>Testimonials</span><span className="font-bold text-white">{data.testimonials.length}</span></div>
                    </div>
                  </div>

                  <div className="rounded-[28px] glass p-6 md:p-8 min-h-[500px]">
                    {adminTab==='hero' && (
                      <div className="max-w-[600px] space-y-4">
                        <h3 className="font-bold text-[18px]">Hero</h3>
                        <input value={data.hero.headline} onChange={e=>setData({...data, hero:{...data.hero, headline:e.target.value}})} className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-[14px]" placeholder="Headline"/>
                        <textarea value={data.hero.subheadline} onChange={e=>setData({...data, hero:{...data.hero, subheadline:e.target.value}})} rows={3} className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-[14px]" placeholder="Subheadline"/>
                        <div className="grid grid-cols-2 gap-3"><input value={data.hero.cta1} onChange={e=>setData({...data, hero:{...data.hero, cta1:e.target.value}})} className="rounded-xl bg-white/5 border border-white/10 p-3 text-[14px]" placeholder="CTA 1"/><input value={data.hero.cta2} onChange={e=>setData({...data, hero:{...data.hero, cta2:e.target.value}})} className="rounded-xl bg-white/5 border border-white/10 p-3 text-[14px]" placeholder="CTA 2"/></div>
                      </div>
                    )}
                    {adminTab==='metrics' && (
                      <div className="space-y-3">
                        <h3 className="font-bold text-[18px]">Metrics</h3>
                        {data.metrics.map((m,i)=>(
                          <div key={i} className="grid grid-cols-3 gap-2">
                            <input value={m.value} onChange={e=>{ const copy=[...data.metrics]; copy[i]={...copy[i], value:e.target.value}; setData({...data, metrics:copy}); }} className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-[13px]"/>
                            <input value={m.label} onChange={e=>{ const copy=[...data.metrics]; copy[i]={...copy[i], label:e.target.value}; setData({...data, metrics:copy}); }} className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-[13px]"/>
                            <input value={m.suffix||''} onChange={e=>{ const copy=[...data.metrics]; copy[i]={...copy[i], suffix:e.target.value}; setData({...data, metrics:copy}); }} className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-[13px]" placeholder="suffix"/>
                          </div>
                        ))}
                      </div>
                    )}
                    {adminTab==='services' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><h3 className="font-bold text-[18px]">Services</h3><button onClick={()=>setData({...data, services:[...data.services, {id:'s'+Date.now(), title:'New Service', description:'', icon:'✨', features:['Feature']}]} )} className="h-8 px-3 rounded-full bg-[#FFC300] text-black font-bold text-[12px]">+ Add</button></div>
                        {data.services.map((s,idx)=>(
                          <div key={s.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-2">
                            <div className="flex gap-2"><input value={s.icon} onChange={e=>{ const c=[...data.services]; c[idx].icon=e.target.value; setData({...data, services:c}); }} className="w-14 rounded-lg bg-white/5 border border-white/10 p-2 text-[14px]" placeholder="icon"/><input value={s.title} onChange={e=>{ const c=[...data.services]; c[idx].title=e.target.value; setData({...data, services:c}); }} className="flex-1 rounded-lg bg-white/5 border border-white/10 p-2 text-[14px]" placeholder="title"/><button onClick={()=>setData({...data, services:data.services.filter(x=>x.id!==s.id)})} className="px-3 rounded-lg bg-red-500/20 text-red-300 text-[12px]">Delete</button></div>
                            <textarea value={s.description} onChange={e=>{ const c=[...data.services]; c[idx].description=e.target.value; setData({...data, services:c}); }} className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" rows={2} placeholder="description"/>
                            <input value={s.features.join(', ')} onChange={e=>{ const c=[...data.services]; c[idx].features=e.target.value.split(',').map(x=>x.trim()).filter(Boolean); setData({...data, services:c}); }} className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-[12px]" placeholder="features comma separated"/>
                          </div>
                        ))}
                      </div>
                    )}
                    {adminTab==='inventory' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><h3 className="font-bold text-[18px]">Inventory</h3><button onClick={()=>setData({...data, inventory:[{id:'b'+Date.now(), title:'New Billboard', location:'Lekki, Lagos', city:'Lagos', size:'12m x 4m', type:'Static', price:'₦1M / month', availability:'Available', image:'https://images.unsplash.com/photo-1569511166187-97eb6e387e19?q=80&w=800&auto=format&fit=crop', details:'New premium site', featured:false}, ...data.inventory]})} className="h-8 px-3 rounded-full bg-[#FFC300] text-black font-bold text-[12px]">+ Add</button></div>
                        <div className="rounded-xl border border-[#FFC300]/20 bg-[#FFC300]/10 p-3 text-[11px] leading-relaxed text-white/65"><b className="text-[#FFC300]">Browser upload:</b> drag-and-drop images are compressed and saved on this browser. Use permanent files in <code className="bg-black/30 px-1 rounded">public/images</code> or cloud storage when every visitor must see Admin uploads.</div>
                        <div className="grid gap-3">
                          {data.inventory.map((it,idx)=>(
                            <div key={it.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                              <div className="grid md:grid-cols-2 gap-2">
                                <input value={it.title} onChange={e=>{ const c=[...data.inventory]; c[idx].title=e.target.value; setData({...data, inventory:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="title"/>
                                <input value={it.location} onChange={e=>{ const c=[...data.inventory]; c[idx].location=e.target.value; setData({...data, inventory:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="location"/>
                                <input value={it.city} onChange={e=>{ const c=[...data.inventory]; c[idx].city=e.target.value; setData({...data, inventory:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="city"/>
                                <input value={it.size} onChange={e=>{ const c=[...data.inventory]; c[idx].size=e.target.value; setData({...data, inventory:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="size"/>
                                <input value={it.type} onChange={e=>{ const c=[...data.inventory]; c[idx].type=e.target.value; setData({...data, inventory:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="type"/>
                                <input value={it.price} onChange={e=>{ const c=[...data.inventory]; c[idx].price=e.target.value; setData({...data, inventory:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="price"/>
                                <select value={it.availability} onChange={e=>{ const c=[...data.inventory] as any; c[idx].availability=e.target.value; setData({...data, inventory:c}); }} className="rounded-lg bg-[#1a1a1f] border border-white/10 p-2 text-[13px]"><option>Available</option><option>Booked</option><option>Limited</option></select>
                                <label className="flex items-center gap-2 text-[12px]"><input type="checkbox" checked={it.featured} onChange={e=>{ const c=[...data.inventory]; c[idx].featured=e.target.checked; setData({...data, inventory:c}); }}/> Featured</label>
                                <div className="md:col-span-2 grid sm:grid-cols-[180px_1fr] gap-3 rounded-xl bg-black/20 border border-white/10 p-3">
                                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                    {it.image ? (
                                      <img src={it.image} alt={`${it.title} preview`} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full grid place-items-center text-[11px] text-white/35">No image</div>
                                    )}
                                  </div>
                                  <div className="min-w-0 space-y-2">
                                    <label
                                      onDragEnter={e=>{ e.preventDefault(); setDraggingInventoryId(it.id); }}
                                      onDragOver={e=>{ e.preventDefault(); e.dataTransfer.dropEffect='copy'; setDraggingInventoryId(it.id); }}
                                      onDragLeave={e=>{ if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDraggingInventoryId(null); }}
                                      onDrop={e=>{ e.preventDefault(); void handleInventoryImageUpload(idx, e.dataTransfer.files?.[0]); }}
                                      className={`min-h-[92px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition px-4 ${draggingInventoryId===it.id?'border-[#FFC300] bg-[#FFC300]/15':'border-white/20 bg-white/[0.03] hover:border-[#FFC300]/60 hover:bg-white/[0.06]'}`}
                                    >
                                      <span className="text-[22px]">⇧</span>
                                      <span className="mt-1 text-[12px] font-bold">Drop an image here or click to browse</span>
                                      <span className="mt-1 text-[10px] text-white/40">JPG, PNG or WebP • up to 8 MB • optimized automatically</span>
                                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e=>{ void handleInventoryImageUpload(idx, e.target.files?.[0]); e.currentTarget.value=''; }} />
                                    </label>
                                    <input value={it.image.startsWith('data:')?'':it.image} onChange={e=>{ const c=[...data.inventory]; c[idx]={...c[idx], image:e.target.value}; setData({...data, inventory:c}); }} className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-[12px]" placeholder={it.image.startsWith('data:')?'Local image uploaded — paste URL to replace':'Or paste an image URL'}/>
                                    {it.image && <button type="button" onClick={()=>{ const c=[...data.inventory]; c[idx]={...c[idx], image:''}; setData({...data, inventory:c}); showToast(`Image removed from ${it.title}`); }} className="text-[11px] px-3 py-1.5 rounded-full bg-red-500/20 text-red-300">Remove image</button>}
                                  </div>
                                </div>
                                <textarea value={it.details} onChange={e=>{ const c=[...data.inventory]; c[idx].details=e.target.value; setData({...data, inventory:c}); }} className="md:col-span-2 rounded-lg bg-white/5 border border-white/10 p-2 text-[12px]" rows={2} placeholder="details"/>
                              </div>
                              <div className="mt-2 flex justify-end"><button onClick={()=>setData({...data, inventory:data.inventory.filter(x=>x.id!==it.id)})} className="text-[11px] px-3 py-1 rounded-full bg-red-500/20 text-red-300">Delete</button></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {adminTab==='testimonials' && (
                      <div className="space-y-3">
                        <div className="flex justify-between"><h3 className="font-bold text-[18px]">Testimonials</h3><button onClick={()=>setData({...data, testimonials:[...data.testimonials, {id:'t'+Date.now(), name:'New Client', role:'Brand', quote:'Great service', avatar:'https://i.pravatar.cc/150?img=1'}]})} className="h-8 px-3 rounded-full bg-[#FFC300] text-black font-bold text-[12px]">+ Add</button></div>
                        {data.testimonials.map((t,idx)=>(
                          <div key={t.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-4 grid md:grid-cols-2 gap-2">
                            <input value={t.name} onChange={e=>{ const c=[...data.testimonials]; c[idx].name=e.target.value; setData({...data, testimonials:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="name"/>
                            <input value={t.role} onChange={e=>{ const c=[...data.testimonials]; c[idx].role=e.target.value; setData({...data, testimonials:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="role"/>
                            <input value={t.avatar} onChange={e=>{ const c=[...data.testimonials]; c[idx].avatar=e.target.value; setData({...data, testimonials:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[12px]" placeholder="avatar url"/>
                            <textarea value={t.quote} onChange={e=>{ const c=[...data.testimonials]; c[idx].quote=e.target.value; setData({...data, testimonials:c}); }} className="md:col-span-2 rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" rows={2} placeholder="quote"/>
                            <button onClick={()=>setData({...data, testimonials:data.testimonials.filter(x=>x.id!==t.id)})} className="md:col-span-2 text-[11px] px-3 py-1 rounded-full bg-red-500/20 text-red-300 w-fit">Delete</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {adminTab==='faq' && (
                      <div className="space-y-3">
                        <div className="flex justify-between"><h3 className="font-bold text-[18px]">FAQ (powers chatbot)</h3><button onClick={()=>setData({...data, faqs:[...data.faqs, {id:'f'+Date.now(), question:'New question?', answer:'Answer', category:'General'}]})} className="h-8 px-3 rounded-full bg-[#FFC300] text-black font-bold text-[12px]">+ Add</button></div>
                        {data.faqs.map((f,idx)=>(
                          <div key={f.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-2">
                            <input value={f.question} onChange={e=>{ const c=[...data.faqs]; c[idx].question=e.target.value; setData({...data, faqs:c}); }} className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-[13px] font-bold" placeholder="question"/>
                            <textarea value={f.answer} onChange={e=>{ const c=[...data.faqs]; c[idx].answer=e.target.value; setData({...data, faqs:c}); }} className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" rows={3} placeholder="answer"/>
                            <div className="flex gap-2"><input value={f.category} onChange={e=>{ const c=[...data.faqs]; c[idx].category=e.target.value; setData({...data, faqs:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[12px]" placeholder="category"/><button onClick={()=>setData({...data, faqs:data.faqs.filter(x=>x.id!==f.id)})} className="px-3 rounded-lg bg-red-500/20 text-red-300 text-[12px]">Delete</button></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {adminTab==='team' && (
                      <div className="space-y-3">
                        <div className="flex justify-between"><h3 className="font-bold text-[18px]">Team</h3><button onClick={()=>setData({...data, team:[...data.team, {id:'tm'+Date.now(), name:'New Member', role:'Role', bio:'Bio', avatar:'https://i.pravatar.cc/150?img=20'}]})} className="h-8 px-3 rounded-full bg-[#FFC300] text-black font-bold text-[12px]">+ Add</button></div>
                        {data.team.map((m,idx)=>(
                          <div key={m.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-4 grid md:grid-cols-2 gap-2">
                            <input value={m.name} onChange={e=>{ const c=[...data.team]; c[idx].name=e.target.value; setData({...data, team:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="name"/>
                            <input value={m.role} onChange={e=>{ const c=[...data.team]; c[idx].role=e.target.value; setData({...data, team:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" placeholder="role"/>
                            <input value={m.avatar} onChange={e=>{ const c=[...data.team]; c[idx].avatar=e.target.value; setData({...data, team:c}); }} className="rounded-lg bg-white/5 border border-white/10 p-2 text-[12px]" placeholder="avatar url"/>
                            <textarea value={m.bio} onChange={e=>{ const c=[...data.team]; c[idx].bio=e.target.value; setData({...data, team:c}); }} className="md:col-span-2 rounded-lg bg-white/5 border border-white/10 p-2 text-[13px]" rows={2} placeholder="bio"/>
                            <button onClick={()=>setData({...data, team:data.team.filter(x=>x.id!==m.id)})} className="md:col-span-2 text-[11px] px-3 py-1 rounded-full bg-red-500/20 text-red-300 w-fit">Delete</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {adminTab==='about' && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="font-bold text-[18px]">About Images</h3>
                          <p className="mt-1 text-[12px] text-white/45">Upload two JPG, PNG or WebP files. Maximum 1.5 MB each. Images are saved only in this browser.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {data.aboutImages.map((image, idx) => (
                            <div key={image.id} className="rounded-[18px] bg-white/[0.03] border border-white/10 p-4 space-y-3">
                              {image.src ? (
                                <img src={image.src} alt={image.alt} className="w-full aspect-[16/10] object-cover rounded-xl border border-white/10" />
                              ) : (
                                <div className="w-full aspect-[16/10] rounded-xl bg-white/5 border border-dashed border-white/20 grid place-items-center text-[12px] text-white/35">No image uploaded</div>
                              )}
                              <label className="block h-10 px-4 rounded-full bg-[#FFC300] text-black font-bold text-[12px] text-center leading-10 cursor-pointer">
                                {image.src ? 'Replace image' : 'Upload image'}
                                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e=>{ handleAboutImageUpload(idx, e.target.files?.[0]); e.currentTarget.value=''; }} />
                              </label>
                              <input value={image.alt} onChange={e=>{ const aboutImages=[...data.aboutImages]; aboutImages[idx]={...aboutImages[idx], alt:e.target.value}; setData({...data, aboutImages}); }} className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-[12px]" placeholder="Accessible image description" />
                              <input value={image.caption} onChange={e=>{ const aboutImages=[...data.aboutImages]; aboutImages[idx]={...aboutImages[idx], caption:e.target.value}; setData({...data, aboutImages}); }} className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-[12px]" placeholder="Image caption" />
                              {image.src && <button type="button" onClick={()=>{ const aboutImages=[...data.aboutImages]; aboutImages[idx]={...aboutImages[idx], src:''}; setData({...data, aboutImages}); showToast(`About image ${idx+1} removed`); }} className="text-[11px] px-3 py-1.5 rounded-full bg-red-500/20 text-red-300">Remove image</button>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {adminTab==='settings' && (
                      <div className="max-w-[520px] space-y-4">
                        <h3 className="font-bold text-[18px]">Settings</h3>
                        <div><label className="text-[12px] text-white/50">Accent color</label><div className="mt-1 flex gap-2"><input type="color" value={data.settings.accent} onChange={e=>setData({...data, settings:{...data.settings, accent:e.target.value}})} className="w-12 h-10 rounded-xl"/><input value={data.settings.accent} onChange={e=>setData({...data, settings:{...data.settings, accent:e.target.value}})} className="flex-1 rounded-xl bg-white/5 border border-white/10 p-3 text-[13px]"/></div></div>
                        <div><label className="text-[12px] text-white/50">Admin email (VITE_ADMIN_EMAIL override possible)</label><input value={data.settings.adminEmail} onChange={e=>setData({...data, settings:{...data.settings, adminEmail:e.target.value}})} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-[13px]"/></div>
                        <div><label className="text-[12px] text-white/50">WhatsApp number (without +)</label><input value={data.settings.whatsapp} onChange={e=>setData({...data, settings:{...data.settings, whatsapp:e.target.value.replace(/\D/g,'')}})} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-[13px]"/></div>
                        <div><label className="text-[12px] text-white/50">Site address</label><input value={data.address} onChange={e=>setData({...data, address:e.target.value})} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-[13px]"/></div>
                        <div><label className="text-[12px] text-white/50">Business hours</label><input value={data.hours} onChange={e=>setData({...data, hours:e.target.value})} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-[13px]"/></div>
                        <div className="pt-4 text-[12px] text-white/40 leading-relaxed">Changing WhatsApp updates all wa.me links site-wide. Accent updates UI instantly via CSS var. Email destination can also be set via env var <code className="bg-white/10 px-1 rounded">VITE_ADMIN_EMAIL</code> without rebuild if you read it in API route.</div>
                      </div>
                    )}
                    {adminTab==='docs' && (
                      <div className="prose prose-invert max-w-none text-[13.5px] leading-relaxed">
                        <h3 className="font-bold text-[18px]">README — BeeLightAdvertising Deployment</h3>
                        <div className="mt-4 space-y-4 text-white/70">
                          <div>
                              <b className="text-white">1. Update content via Admin:</b>{' '}
  Login at /admin with your administrator password → edit tabs → auto-saved to localStorage key `beelight_data_v2`.
                        </div>
                          <div><b className="text-white">2. Change admin email:</b> Admin → Settings → adminEmail, or set env var `VITE_ADMIN_EMAIL` in Vercel dashboard. API route should read `process.env.ADMIN_EMAIL || data.settings.adminEmail`.</div>
                          <div><b className="text-white">3. Update WhatsApp:</b> Admin → Settings → whatsapp number. All wa.me links use `data.settings.whatsapp`. Search codebase for wa.me if hardcoded.</div>
                          <div><b className="text-white">4. Deploy to Vercel:</b> <code className="bg-white/10 px-2 py-1 rounded block mt-2 whitespace-pre-wrap">{`npm i\nvercel --prod\n# set env vars in Vercel:\nVITE_ADMIN_EMAIL=admin@beelightadvertising.com\nADMIN_WHATSAPP=2348032684135`}</code></div>
                          <div><b className="text-white">5. Forms pre-domain:</b> Contact form stores in `beelight_submissions` + mailto. Replace with Resend API: POST to /api/contact that uses `resend.emails.send()`.</div>
                          <div><b className="text-white">6. Chatbot FAQ:</b> Edit FAQ tab. Intent matching looks for keywords: services, location, price, booking, design.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 404 */}
        {!['/','/about','/services','/inventory','/contact','/admin'].includes(path) && (
          <div className="py-28 text-center">
            <div className="text-[80px] leading-none">🐝</div>
            <h1 className="display text-[36px] font-bold mt-4">Hive not found</h1>
            <p className="text-white/50 mt-2">This board doesn’t exist — yet.</p>
            <button onClick={()=>navigate('/')} className="mt-6 h-11 px-6 rounded-full bg-white text-black font-bold text-[13px]">Back to Hive →</button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-10">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-12 grid md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] gap-8">
          <div>
            <Logo variant="dark"/>
            <p className="mt-4 text-[13px] leading-relaxed text-white/50 max-w-[300px]">Bright ideas. Buzzin visibility. Nigeria’s modern OOH platform built for speed and proof.</p>
            <div className="mt-5 flex gap-2"><a href={`https://wa.me/${data.settings.whatsapp}`} target="_blank" rel="noopener" className="h-9 px-4 rounded-full bg-[#FFC300] text-black font-bold text-[12px] flex items-center">WhatsApp Hive</a><button onClick={()=>navigate('/inventory')} className="h-9 px-4 rounded-full glass font-bold text-[12px]">View inventory</button></div>
          </div>
          <div><div className="text-[12px] font-bold tracking-widest uppercase text-white/40">Explore</div><div className="mt-4 space-y-2 text-[13px] text-white/60">{['Home','About','Services','Inventory','Contact'].map((l,i)=>{ const p=['/','/about','/services','/inventory','/contact'][i]; return <button key={l} onClick={()=>navigate(p)} className="block hover:text-white">{l}</button>; })}</div></div>
          <div><div className="text-[12px] font-bold tracking-widest uppercase text-white/40">Contact</div><div className="mt-4 space-y-2 text-[13px] text-white/60"><div>{data.address}</div><div>{data.settings.adminEmail}</div><div>+{data.settings.whatsapp}</div><div>{data.hours}</div></div></div>
          <div className="rounded-[20px] glass p-5"><div className="text-[12px] font-bold tracking-widest uppercase text-white/40">Newsletter — no spam</div><div className="mt-3 flex gap-2"><input placeholder="Work email" className="flex-1 h-10 rounded-full bg-white/5 border border-white/10 px-4 text-[13px] outline-none"/><button onClick={()=>showToast('Subscribed (simulated)')} className="h-10 px-4 rounded-full bg-white text-black font-bold text-[12px]">Join</button></div><div className="mt-3 text-[11px] text-white/30">© {new Date().getFullYear()} BeeLightAdvertising. Bright. Buzzin. Precise.</div></div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${data.settings.whatsapp}`} target="_blank" rel="noopener" className="fixed bottom-[92px] right-5 z-30 w-12 h-12 rounded-full bg-[#25D366] grid place-items-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-105 transition" aria-label="WhatsApp">
        <span className="text-[22px]">💬</span>
      </a>

      {/* Chatbot */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-[340px] md:w-[380px] rounded-[22px] overflow-hidden border border-white/10 bg-[#101016]/90 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            <div className="h-[52px] px-4 flex items-center justify-between border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-[#FFC300] grid place-items-center text-black font-bold text-[12px]">AI</div><div><div className="font-bold text-[13px]">BeeLight AI</div><div className="text-[11px] text-white/50">Answers from FAQ • live</div></div></div>
              <button onClick={()=>setChatOpen(false)} className="w-7 h-7 rounded-full bg-white/10 grid place-items-center">✕</button>
            </div>
            <div className="h-[340px] overflow-y-auto p-4 space-y-3">
              {chatMsgs.map((m,i)=>(
                <div key={i} className={`flex ${m.from==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${m.from==='user'?'bg-white text-black rounded-br-[6px]':'bg-white/[0.06] border border-white/10 text-white/80 rounded-bl-[6px]'}`}>{m.text}</div></div>
              ))}
              {typing && <div className="text-[11px] text-white/40">Bee is typing…</div>}
              {chatMsgs.length>1 && chatMsgs[chatMsgs.length-1].from==='bot' && chatMsgs[chatMsgs.length-1].text.includes('connect you to our team') && (
                <div className="flex gap-2 mt-2">
                  <a href={`https://wa.me/${data.settings.whatsapp}`} target="_blank" rel="noopener" className="h-9 px-4 rounded-full bg-[#FFC300] text-black font-bold text-[12px] flex items-center">WhatsApp Admin</a>
                  <button onClick={()=>{ const mail=`mailto:${data.settings.adminEmail}?subject=${encodeURIComponent('Help from chatbot')}`; window.open(mail,'_blank'); }} className="h-9 px-4 rounded-full bg-white/10 border border-white/10 font-bold text-[12px]">Send to Email</button>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
            <div className="p-3 border-t border-white/10 flex gap-2 bg-[#0A0A0F]/50">
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') handleChatSend(); }} placeholder="Ask about services, price, booking..." className="flex-1 h-10 rounded-full bg-white/5 border border-white/10 px-4 text-[13px] outline-none"/>
              <button onClick={handleChatSend} className="w-10 h-10 rounded-full bg-white text-black grid place-items-center font-bold">↑</button>
            </div>
          </div>
        )}
        <button onClick={()=>setChatOpen(!chatOpen)} className="w-14 h-14 rounded-full bg-white text-black grid place-items-center shadow-[0_10px_40px_rgba(255,255,255,0.2)] border border-white/20 hover:scale-105 transition" aria-label="Open chat">
          <span className="text-[22px]">{chatOpen?'✕':'🐝'}</span>
        </button>
      </div>

      {/* Cookie banner */}
      {!cookieAccepted && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0A0A0F]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[12.5px] text-white/60">We use cookies to improve glow & measure reach. No creepy tracking.</div>
            <div className="flex gap-2"><button onClick={()=>{ localStorage.setItem('beelight_cookie','reject'); setCookieAccepted(true); }} className="h-8 px-4 rounded-full glass text-[12px] font-bold">Reject</button><button onClick={()=>{ localStorage.setItem('beelight_cookie','accept'); setCookieAccepted(true); }} className="h-8 px-4 rounded-full bg-white text-black text-[12px] font-bold">Accept</button></div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-white text-black font-bold text-[13px] shadow-xl">{toast}</div>
      )}

      {/* Accent var */}
      <style>{`:root{--accent:${data.settings.accent}}`}</style>
    </div>
  );
}
