import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  ShieldCheck,
  Building2,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  User,
  MapPin,
  Car,
  Home,
  Tractor,
  HeartPulse,
  FileText,
  Search,
  Briefcase,
  Wrench,
  Settings,
  Plus,
  Pencil,
  Trash2,
  X,
  History,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  PieChart,
  Copy,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { supabase } from './supabase';
import { api } from './services/api';

const IconMap: Record<string, any> = {
  Car, Home, Briefcase, Building2, Wrench, Tractor, HeartPulse
};

// --- Types ---
type View = 'seguradoras' | 'kpis' | 'perfil' | 'admin';

// --- Components ---

const Navbar = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md w-full px-6 md:px-12 py-4 border-b border-slate-200 shadow-sm">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex flex-col leading-none cursor-pointer" onClick={() => setView('kpis')}>
        <span className="text-xl font-black text-[#006b33] tracking-tighter font-headline">Sicredi Seguros</span>
        <p className="text-[8px] uppercase tracking-widest text-slate-500 font-bold opacity-60">Consulta estratégica</p>
      </div>

      <nav className="hidden lg:flex items-center gap-8">
        <button
          onClick={() => setView('perfil')}
          className={`font-headline text-sm font-bold tracking-tight transition-colors flex items-center gap-2 ${currentView === 'perfil' ? 'text-[#006b33] border-b-2 border-[#006b33] pb-1' : 'text-slate-600 hover:text-[#006b33]'}`}
        >
          <Building2 size={18} /> Cooperativas
        </button>
        <button
          onClick={() => setView('seguradoras')}
          className={`font-headline text-sm font-bold tracking-tight transition-colors flex items-center gap-2 ${currentView === 'seguradoras' ? 'text-[#006b33] border-b-2 border-[#006b33] pb-1' : 'text-slate-600 hover:text-[#006b33]'}`}
        >
          <ShieldCheck size={18} /> Seguradoras
        </button>
        <button
          onClick={() => setView('kpis')}
          className={`font-headline text-sm font-bold tracking-tight transition-colors flex items-center gap-2 ${currentView === 'kpis' ? 'text-[#006b33] border-b-2 border-[#006b33] pb-1' : 'text-slate-600 hover:text-[#006b33]'}`}
        >
          <BarChart3 size={18} /> KPIs
        </button>
      </nav>

      <button
        onClick={() => setView('admin')}
        className={`font-headline text-[10px] font-black tracking-widest transition-all flex items-center gap-2 px-3 py-2 rounded-xl border ${currentView === 'admin' ? 'bg-[#006b33] text-white border-[#006b33]' : 'text-slate-500 border-slate-200 hover:border-[#006b33] hover:text-[#006b33]'}`}
      >
        <Settings size={14} /> ADMIN
      </button>
    </div>
  </header>
);

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy}
      className={`p-1 rounded-md transition-all shrink-0 ${copied ? 'bg-[#006b33] text-white shadow-lg' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-600'}`}
      title="Copiar dado"
    >
      {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
    </button>
  );
};
const InsuranceModal = ({ insurance, onClose }: { insurance: any, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-20 p-2 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 transition-all text-slate-500 shadow-sm"
      >
        <X size={20} />
      </button>

      {/* Sidebar / Branding */}
      <div className={`hidden md:flex md:w-1/3 flex-col items-center justify-center p-12 bg-slate-50 border-r border-slate-100`}>
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center overflow-hidden mb-6 p-4">
          {insurance.logo_url ? (
            <img src={insurance.logo_url} alt={insurance.name} className="w-full h-full object-contain" />
          ) : (
            <ShieldCheck size={48} className="text-slate-200" />
          )}
        </div>
        <h2 className="text-2xl font-black text-slate-900 text-center font-headline mb-2">{insurance.name}</h2>
        <span className={`px-4 py-1.5 rounded-full ${insurance.color_class || insurance.colorClass} text-[10px] font-black uppercase tracking-widest`}>
          {insurance.category}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
        <div className="md:hidden flex flex-col items-start mb-8 gap-4 pt-4">
            <h2 className="text-3xl font-black text-slate-900 font-headline">{insurance.name}</h2>
            <span className={`px-4 py-1.5 rounded-full ${insurance.colorClass} text-[10px] font-black uppercase tracking-widest`}>
                {insurance.category}
            </span>
        </div>

        <div className="space-y-10">
          {/* Section: Canais de Atendimento */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                  <AlertCircle size={18} className="text-[#006b33]" />
                  Aviso de Sinistro
               </h3>
               <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {insurance.details?.sinistro?.map((s: string, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-3 group/item">
                       <p className="text-sm font-bold text-slate-600 leading-relaxed">• {s}</p>
                       <CopyButton text={s.split(':').pop()?.trim() || s} />
                    </div>
                  )) || <p className="text-xs text-slate-400 italic">Nenhum contato registrado.</p>}
               </div>
            </div>
            <div className="space-y-4">
               <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                  <History size={18} className="text-[#006b33]" />
                  Assistência 24h
               </h3>
               <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {insurance.details?.assistencia?.map((s: string, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-3 group/item">
                       <p className="text-sm font-bold text-slate-600 leading-relaxed">• {s}</p>
                       <CopyButton text={s.split(':').pop()?.trim() || s} />
                    </div>
                  )) || <p className="text-xs text-slate-400 italic">Nenhum contato registrado.</p>}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                  <Search size={18} className="text-[#006b33]" />
                  Acesso & Portais
               </h3>
               <div className="bg-[#006b33]/5 p-5 rounded-2xl border border-[#006b33]/10">
                  <p className="text-sm font-black text-[#006b33] leading-relaxed italic">{insurance.details?.acesso || 'Consulte o SIS para mais informações.'}</p>
                  {insurance.details?.login && (
                    <div className="mt-4 pt-4 border-t border-[#006b33]/10 space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-[#006b33]/60 uppercase tracking-wide">Dados de Autenticação</p>
                            <CopyButton text={insurance.details.login} />
                        </div>
                        <p className="text-sm font-mono font-bold text-slate-700">{insurance.details.login}</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                  <Phone size={18} className="text-[#006b33]" />
                  Outros Contatos
               </h3>
               <div className="space-y-4">
                  {insurance.details.whatsapp && (
                    <a href={`https://wa.me/55${insurance.details.whatsapp.replace(/\D/g, '')}`} target="_blank" className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 hover:shadow-lg hover:shadow-emerald-100 transition-all group">
                        <div className="flex items-center gap-3">
                           <MessageCircle size={20} className="text-emerald-600" />
                           <span className="text-sm font-black text-emerald-700">WhatsApp Oficial</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-emerald-600">{insurance.details.whatsapp}</span>
                           <CopyButton text={insurance.details.whatsapp} />
                        </div>
                    </a>
                  )}
                  {insurance.email && (
                    <div className="flex items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <Mail size={18} className="text-[#006b33] shrink-0" />
                            <div className="min-w-0 overflow-hidden">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Principal</p>
                                 <p className="text-sm font-bold text-slate-700 break-all">{insurance.email}</p>
                            </div>
                        </div>
                        <CopyButton text={insurance.email} />
                    </div>
                  )}
               </div>
            </div>
          </div>

          {(insurance.details.outros || insurance.details.horario) && (
             <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100/50">
                <div className="flex flex-wrap gap-6 text-sm font-bold text-amber-900">
                    {insurance.details.horario && (
                        <div className="flex gap-2">
                            <History size={18} className="text-amber-600" />
                            <span>{insurance.details.horario}</span>
                        </div>
                    )}
                    {insurance.details.outros?.map((o: string, i: number) => (
                        <div key={i} className="flex gap-2 items-center bg-white/50 px-3 py-1.5 rounded-lg border border-amber-200/50">
                            <Wrench size={16} className="text-amber-600" />
                            <span className="flex-1">{o}</span>
                            <CopyButton text={o.split(':').pop()?.trim() || o} />
                        </div>
                    ))}
                </div>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  </div>
);

const InsuranceCard: React.FC<{ insurance: any, onOpen: (ins: any) => void }> = ({ insurance, onOpen }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group bg-white p-8 rounded-3xl hover:shadow-2xl hover:shadow-[#006b33]/10 transition-all duration-500 border border-slate-100 hover:border-[#006b33]/20 flex flex-col justify-between h-full relative"
  >
    <div>
      <div className="flex justify-between items-start mb-8">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-all p-3">
          {insurance.logo_url ? (
            <img src={insurance.logo_url} alt={insurance.name} className="w-full h-full object-contain" />
          ) : (
            <ShieldCheck size={24} className="text-slate-200" />
          )}
        </div>
        <span className={`px-4 py-1.5 ${insurance.color_class || insurance.colorClass} text-[10px] font-black rounded-full uppercase tracking-widest`}>
          {insurance.category}
        </span>
      </div>
      <h3 className="font-headline text-2xl font-black text-slate-900 mb-6 group-hover:text-[#006b33] transition-colors">{insurance.name}</h3>
      <div className="space-y-5">
        <div className="flex items-center gap-4 text-slate-600 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 transition-all group-hover:bg-white group-hover:border-[#006b33]/10">
          <Phone size={20} className="text-[#006b33]" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Sinistro Principal</p>
            <span className="text-base font-black text-slate-900 tracking-tight">{insurance.phone}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4">
      <button 
        onClick={() => onOpen(insurance)}
        className="w-full py-4 bg-[#006b33] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#008742] transition-all shadow-lg shadow-[#006b33]/20 hover:-translate-y-1 active:scale-95"
      >
        Informações Completas
        <ArrowRight size={16} />
      </button>
      
      {insurance.details?.whatsapp && (
        <a 
          href={`https://wa.me/55${insurance.details.whatsapp.replace(/\D/g, '')}`} 
          target="_blank"
          className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-50 py-2 rounded-xl transition-all"
        >
          <MessageCircle size={16} fill="currentColor" />
          Falar no WhatsApp
        </a>
      )}
    </div>
  </motion.div>
);

const InsuranceGrid = () => {
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null);
  const [insurers, setInsurers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInsurers = async () => {
    setLoading(true);
    try {
      const data = await api.getInsurers();
      if (data) setInsurers(data);
    } catch (err) {
      console.error('Erro ao buscar seguradoras:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInsurers();
  }, []);

  if (loading) return (
    <div className="flex py-24 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#006b33]"></div>
    </div>
  );

  return (
    <section className="px-6 md:px-12 py-12 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
           <div>
              <h2 className="text-4xl font-black text-slate-900 font-headline tracking-tight mb-2">Canais de Atendimento</h2>
              <p className="text-slate-500 font-bold tracking-tight">Consulte aqui os telefones e contatos oficiais de todas as seguradoras parceiras.</p>
           </div>
           <ShieldCheck className="text-[#006b33]/20 hidden sm:block" size={64} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insurers.map((ins, idx) => (
            <InsuranceCard key={ins.id || idx} insurance={ins} onOpen={setSelectedInsurance} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedInsurance && (
          <InsuranceModal 
            insurance={selectedInsurance} 
            onClose={() => setSelectedInsurance(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const Bar3D = ({ value, max, label, color = "#006b33" }: any) => {
  const heightPercent = max === 0 ? 0 : (value / max) * 60; // Cap at 60% height to leave room for label
  return (
    <div className="flex flex-col items-center group relative h-full justify-end px-1 sm:px-2 pt-12 pb-4 shrink-0 mt-8">
      <div className="relative w-6 sm:w-8 transition-all duration-1000" style={{ height: `${Math.max(heightPercent, 5)}%`, minHeight: '15px' }}>
        {/* External Top Label */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[11px] font-bold text-slate-600 whitespace-nowrap z-10">{value}</div>
        {/* Top face */}
        <div className="absolute top-0 left-0 w-full h-3 sm:h-4 -translate-y-full origin-bottom" style={{ backgroundColor: color, filter: 'brightness(1.2)', transform: 'skewX(-45deg)' }}></div>
        {/* Right face */}
        <div className="absolute top-0 right-0 h-full w-3 sm:w-4 translate-x-full origin-left" style={{ backgroundColor: color, filter: 'brightness(0.8)', transform: 'skewY(-45deg)' }}></div>
        {/* Front face */}
        <div className="w-full h-full" style={{ backgroundColor: color }}></div>
      </div>
      <span className="text-[9px] mt-4 font-bold text-slate-500 whitespace-nowrap text-center max-w-[48px] overflow-hidden truncate">{label}</span>
      <div className="absolute bottom-full mb-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
        {value} un.
      </div>
    </div>
  );
};

const Speedometer = ({ value }: { value: number }) => {
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex justify-center items-end" style={{ height: '140px', width: '100%' }}>
      <svg className="w-56 h-28" viewBox="0 0 200 100">
        <path d={`M 20 90 A ${radius} ${radius} 0 0 1 180 90`} fill="none" stroke="#e2e8f0" strokeWidth="16" />
        <path d={`M 20 90 A ${radius} ${radius} 0 0 1 180 90`}
          fill="none"
          stroke="url(#speed-gradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <defs>
          <linearGradient id="speed-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#006b33" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute bottom-0 text-center w-full">
        <span className="text-4xl font-black font-headline text-[#006b33]">{value.toFixed(1)}%</span>
      </div>
    </div>
  );
};


const LineChart = ({ data, labels, color = "#006b33" }: { data: (number | null)[], labels: string[], color?: string }) => {
  const validData = data.filter((v): v is number => v !== null);
  const maxVal = Math.max(...validData, 5);
  const height = 150;
  const width = 600;
  const paddingX = 20;
  const paddingY = 20;
  
  const points = data.map((val, i) => {
    if (val === null) return null;
    const x = paddingX + (i / (Math.max(labels.length - 1, 1))) * (width - paddingX * 2);
    const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
    return { x, y, val };
  }).filter(Boolean) as {x: number, y: number, val: number}[];

  const getCubicPath = (pts: any[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
       const xc = (pts[i].x + pts[i + 1].x) / 2;
       d += ` C ${xc},${pts[i].y} ${xc},${pts[i+1].y} ${pts[i+1].x},${pts[i+1].y}`;
    }
    return d;
  };

  const pathData = getCubicPath(points);

  return (
    <div className="w-full overflow-x-auto overflow-y-visible" style={{ minHeight: '160px' }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-w-[500px] overflow-visible">
        {/* Grid */}
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#e2e8f0" strokeWidth="1" />
        
        {/* Area */}
        {points.length > 0 && <path d={`${pathData} L ${points[points.length-1].x},${height-paddingY} L ${points[0].x},${height-paddingY} Z`} fill="url(#lineGrad)" opacity="0.4" />}
        
        {/* Line */}
        {points.length > 0 && <path fill="none" stroke={color} strokeWidth="2" d={pathData} strokeLinecap="round" strokeLinejoin="round" />}
        
        {points.map((pt, i) => (
          <g key={i} className="group cursor-pointer">
            <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke={color} strokeWidth="1.5" className="transition-all duration-300 group-hover:r-[6px]" />
            <text x={pt.x} y={pt.y - 12} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold" opacity="0" className="group-hover:opacity-100 transition-opacity pointer-events-none">{pt.val}</text>
          </g>
        ))}

        {/* X Axis Labels */}
        {labels.map((lbl, i) => {
           const x = paddingX + (i / (Math.max(labels.length - 1, 1))) * (width - paddingX * 2);
           return <text key={i} x={x} y={height - 5} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="bold">{lbl}</text>
        })}

        <defs>
           <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
             <stop offset="0%" stopColor={color} stopOpacity="1"/>
             <stop offset="100%" stopColor={color} stopOpacity="0"/>
           </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const KPIDashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterResp, setFilterResp] = useState('Central');
  const [filterProd, setFilterProd] = useState('Todos');
  const [analysisBase, setAnalysisBase] = useState('Cooperativas'); // 'Produtos' ou 'Cooperativas'
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [activeCategory, setActiveCategory] = useState<'sinistro' | 'renovacao'>('sinistro');

  useEffect(() => {
    const fetchKPIs = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        if (data) {
          setData(data);
        }
      } catch (err) {
        console.error('Erro ao buscar KPIs:', err);
      }
      setLoading(false);
    };
    fetchKPIs();
  }, []);

  const filteredData = data.filter(d => {
    const matchResp = filterResp === 'Todos' || d.responsible === filterResp;
    const matchProd = filterProd === 'Todos' || d.name === filterProd;
    const matchCat = d.type === activeCategory;
    return matchResp && matchProd && matchCat;
  });

  // Calculate Adherence dynamically based on "Analysis Base"
  let adherenceVal = 0;
  let totalAtendido = 0;
  let labelAtendido = '';

  if (analysisBase === 'Produtos') {
    // Total possible is 490 (or 70 if a specific product is filtered)
    const spaceData = data.filter(d => 
       (filterProd === 'Todos' || d.name === filterProd) && 
       d.type === activeCategory
    );
    const totalPossibleSpace = spaceData.length === 0 ? 1 : spaceData.length;
    totalAtendido = filteredData.length;
    adherenceVal = (totalAtendido / totalPossibleSpace) * 100;
    labelAtendido = 'produtos ativos';
  } else {
    // Total possible is 70 cooperatives
    const categoryData = data.filter(d => d.type === activeCategory);
    const allUniqueCoopsCount = new Set(categoryData.map(d => d.cooperative_id)).size || 70;
    const filteredUniqueCoopsCount = new Set(filteredData.map(d => d.cooperative_id)).size;
    totalAtendido = filteredUniqueCoopsCount;
    adherenceVal = (totalAtendido / allUniqueCoopsCount) * 100;
    labelAtendido = 'cooperativas com produtos';
  }

  // 3D Chart Data Generation
  const chartDataObj: Record<string, number> = {};
  if (filterProd === 'Todos') {
    filteredData.forEach(d => {
      const shortName = d.name.replace('Seguro ', '');
      chartDataObj[shortName] = (chartDataObj[shortName] || 0) + 1;
    });
  } else {
    filteredData.forEach(d => {
      const year = new Date(d.start_date || d.created_at).getFullYear();
      chartDataObj[year] = (chartDataObj[year] || 0) + 1;
    });
  }

  const chartDataRaw = Object.keys(chartDataObj).map(k => ({ label: k, val: chartDataObj[k] }));
  const maxChartVal = Math.max(...chartDataRaw.map(c => c.val), 1);
  const chartData = chartDataRaw.sort((a, b) => b.val - a.val);

  const availableYears = Array.from(new Set(data.map(d => {
     if(d.start_date) return new Date(d.start_date).getFullYear().toString();
     if(d.created_at) return new Date(d.created_at).getFullYear().toString();
     return '2024';
  }))).sort((a,b) => (b as string).localeCompare(a as string));

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Line Chart Data Generation
  const monthsData = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const selectedYearNum = parseInt(selectedYear);

  const lineChartData = monthsData.map((_, index) => {
    if (selectedYearNum === currentYear && index > currentMonth) {
       return null;
    }

    const upToMonthData = filteredData.filter(d => {
       const dt = new Date(d.start_date || d.created_at);
       const y = dt.getFullYear();
       const m = dt.getMonth();
       return y < selectedYearNum || (y === selectedYearNum && m <= index);
    });

    if (analysisBase === 'Cooperativas') {
        const uniqueCoops = new Set(upToMonthData.map(d => d.cooperative_id));
        return uniqueCoops.size;
    } else {
        return upToMonthData.length;
    }
  });

  const chartColor = filterResp === 'Central' ? '#22c55e' : filterResp === 'Agência' ? '#3b82f6' : filterResp === 'Conecta' ? '#f97316' : '#006b33';

  // Rankings
  const rankingObj: Record<string, { name: string, code: string, state: string, total: number }> = {};
  
  // Prepare dictionary with ALL cooperatives first
  data.forEach(d => {
    if (!d.cooperative) return;
    const { code, name, location } = d.cooperative;
    if (!rankingObj[code]) {
      rankingObj[code] = { code, name, state: location?.slice(-2) || 'BR', total: 0 };
    }
  });

  // Calculate totals inside filtered scope
  filteredData.forEach(d => {
    if (!d.cooperative) return;
    rankingObj[d.cooperative.code].total += 1;
  });

  const allRankings = Object.values(rankingObj);
  const topRankingList = [...allRankings].sort((a, b) => b.total - a.total).slice(0, 5);
  const bottomRankingList = [...allRankings].sort((a, b) => a.total - b.total).slice(0, 5);

  if (loading) {
    return (
      <div className="flex py-24 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#006b33]"></div>
      </div>
    );
  }

  return (
    <section className="px-4 md:px-12 py-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black text-slate-900 font-headline tracking-tighter">Performance de Aderência</h1>
              <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner border border-slate-200/50">
                <button 
                  onClick={() => setActiveCategory('sinistro')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeCategory === 'sinistro' ? 'bg-[#006b33] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <ShieldCheck size={16} /> SINISTROS
                </button>
                <button 
                  onClick={() => setActiveCategory('renovacao')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeCategory === 'renovacao' ? 'bg-[#006b33] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <History size={16} /> RENOVAÇÕES
                </button>
              </div>
            </div>
            <p className="text-slate-500 font-body">Visão interativa de produtos ativos por canal de atendimento.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Responsável</label>
              <select
                value={filterResp}
                onChange={(e) => setFilterResp(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-[#006b33] focus:ring-2 focus:ring-[#006b33]/10 shadow-sm"
              >
                <option value="Todos">Todos</option>
                <option value="Central">Central</option>
                <option value="Agência">Agência</option>
                <option value="Conecta">Conecta</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Produto</label>
              <select
                value={filterProd}
                onChange={(e) => setFilterProd(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-[#006b33] focus:ring-2 focus:ring-[#006b33]/10 shadow-sm"
              >
                <option value="Todos">Todos os Produtos</option>
                <option value="Seguro Automóvel">Seguro Automóvel</option>
                <option value="Seguro Residencial">Seguro Residencial</option>
                <option value="Seguro Empresarial">Seguro Empresarial</option>
                <option value="Seguro Vida">Seguro Vida</option>
                <option value="Seguro Rural">Seguro Rural</option>
                <option value="Seguro Condominio">Seguro Condominio</option>
                <option value="Seguro Maq/Equip">Seguro Maq/Equip</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full md:w-auto">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Base de Análise</label>
              <select
                value={analysisBase}
                onChange={(e) => setAnalysisBase(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-[#006b33] focus:ring-2 focus:ring-[#006b33]/10 shadow-sm"
              >
                <option value="Produtos">Produtos</option>
                <option value="Cooperativas">Cooperativas</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

          {/* Card Speedometer */}
          <div className="md:col-span-3 bg-white px-2 py-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between items-center relative overflow-hidden group">
            <span className="text-[10px] font-bold text-[#006b33] flex items-center gap-1 mb-2 uppercase tracking-widest z-10 w-full justify-center">
              Aderência
            </span>
            <div className="flex-1 flex items-center justify-center w-full">
              <Speedometer value={adherenceVal} />
            </div>
            <div className="mt-2 text-center z-10 px-4">
              <p className="text-[10px] text-slate-400">Capacidade de <strong>{analysisBase}</strong> atingida no cenário filtrado.</p>
            </div>
          </div>

          {/* Card Total Atendido */}
          <div className="md:col-span-3 bg-[#006b33] p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden text-white group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>
            <div className="z-10">
              <div className="flex items-center gap-3 mb-2 opacity-90 text-[11px] font-bold uppercase tracking-widest">
                <CheckCircle2 size={16} /> Total Atendido
              </div>
              <div className="text-5xl font-black font-headline tracking-tighter leading-none mb-2">
                {totalAtendido}
              </div>
              <p className="text-sm opacity-80 font-medium">{labelAtendido}</p>
            </div>
          </div>

          {/* 3D Chart Section */}
          <div className="md:col-span-6 bg-white pt-6 pb-2 px-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-0">
              <h3 className="text-sm font-bold font-headline uppercase tracking-widest text-slate-800 ml-2">
                Volume {filterProd === 'Todos' ? 'Por Produto' : 'Por Ano de Início'}
              </h3>
            </div>
            <div className="flex-1 flex flex-row items-end gap-1 sm:gap-2 w-full justify-around mt-4 overflow-x-auto overflow-y-hidden pb-2" style={{ minHeight: '160px' }}>
              {chartData.length > 0 ? chartData.map((item, idx) => (
                <Bar3D key={idx} value={item.val} max={maxChartVal} label={item.label} color={filterResp === 'Central' ? '#22c55e' : filterResp === 'Agência' ? '#3b82f6' : filterResp === 'Conecta' ? '#f97316' : '#006b33'} />
              )) : (
                <div className="w-full text-center text-slate-400 font-medium pb-8 self-center">Nenhum dado para este filtro.</div>
              )}
            </div>
          </div>

          {/* Line Chart Section */}
          <div className="md:col-span-12 bg-white pt-6 pb-4 px-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col mt-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold font-headline uppercase tracking-widest text-slate-800">
                Evolução da Aderência Acumulada
              </h3>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#006b33] cursor-pointer"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <LineChart data={lineChartData} labels={monthsData} color={chartColor} />
          </div>

          {/* Top 5 Table */}
          <div className="md:col-span-6 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div className="px-6 py-4 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="text-xs font-bold font-headline uppercase tracking-widest flex items-center gap-2"><TrendingUp size={14} className="text-emerald-400" /> Top 5 Destaques</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <tbody className="divide-y divide-slate-100">
                  {topRankingList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-md flex items-center justify-center font-black text-xs">
                            {row.code}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 line-clamp-1">{row.name}</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Regional {row.state}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-base font-black text-slate-900">{row.total} <span className="text-[10px] font-normal text-slate-500">prod.</span></div>
                      </td>
                    </tr>
                  ))}
                  {topRankingList.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-6 text-center text-slate-500 font-medium text-sm">Sem resultados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom 5 Table */}
          <div className="md:col-span-6 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div className="px-6 py-4 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="text-xs font-bold font-headline uppercase tracking-widest flex items-center gap-2 text-slate-300"><TrendingUp size={14} className="text-red-400 rotate-180" /> Menor Aderência</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <tbody className="divide-y divide-slate-100">
                  {bottomRankingList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-50 text-red-700 rounded-md flex items-center justify-center font-black text-xs">
                            {row.code}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 line-clamp-1">{row.name}</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Regional {row.state}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-base font-black text-red-600">{row.total} <span className="text-[10px] font-normal text-slate-500">prod.</span></div>
                      </td>
                    </tr>
                  ))}
                  {bottomRankingList.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-6 text-center text-slate-500 font-medium text-sm">Sem resultados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const getBadgeClass = (resp: string) => {
  if (resp === 'Agência') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (resp === 'Central') return 'bg-green-100 text-green-700 border-green-200';
  if (resp === 'Conecta') return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const CooperativeProfile = () => {
  const [cooperative, setCooperative] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [activeService, setActiveService] = useState<'sinistro' | 'renovacao'>('sinistro');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('0101');
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setErrorMsg('');
        
        try {
          // Sanitização básica do input de busca
          const sanitizedQuery = searchQuery.replace(/[^a-zA-Z0-9 ]/g, '');
          const coopData = await api.searchCooperative(sanitizedQuery);

          if (coopData) {
            setCooperative(coopData);
            // Nota: Para manter simplicidade, a busca de produtos filtrados
            // será movida para o backend no futuro se necessário.
            // Por enquanto, usamos a API de produtos gerais filtrada localmente para maior performance.
            const allProducts = await api.getProducts();
            const filteredProducts = allProducts.filter((p: any) => p.cooperative_id === coopData.id);
            setProducts(filteredProducts);
          } else {
            setCooperative(null);
            setErrorMsg('Nenhuma cooperativa encontrada com esse termo.');
          }
        } catch (err: any) {
          setErrorMsg(err.message || 'Erro na busca');
        }
        setLoading(false);
      };

    fetchData();
  }, [searchQuery, activeService]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const currentServiceProducts = products.filter(p => p.type === activeService);
  const distribution = currentServiceProducts.reduce((acc: any, curr: any) => {
    const key = curr.responsible?.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || '';
    if (key === 'AGENCIA') acc['AGÊNCIA'] = (acc['AGÊNCIA'] || 0) + 1;
    else if (key === 'CENTRAL') acc['CENTRAL'] = (acc['CENTRAL'] || 0) + 1;
    else if (key === 'CONECTA') acc['CONECTA'] = (acc['CONECTA'] || 0) + 1;
    return acc;
  }, { 'AGÊNCIA': 0, 'CENTRAL': 0, 'CONECTA': 0 });

  const total = currentServiceProducts.length;
  const stats = [
    { label: 'AGÊNCIA', count: distribution['AGÊNCIA'], color: '#0ea5e9', bg: 'bg-blue-500' },
    { label: 'CENTRAL', count: distribution['CENTRAL'], color: '#006b33', bg: 'bg-[#006b33]' },
    { label: 'CONECTA', count: distribution['CONECTA'], color: '#f59e0b', bg: 'bg-orange-500' }
  ];

  const getArcPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const x1 = 50 + outerRadius * Math.cos(startAngle);
    const y1 = 50 + outerRadius * Math.sin(startAngle);
    const x2 = 50 + outerRadius * Math.cos(endAngle);
    const y2 = 50 + outerRadius * Math.sin(endAngle);
    const x3 = 50 + innerRadius * Math.cos(endAngle);
    const y3 = 50 + innerRadius * Math.sin(endAngle);
    const x4 = 50 + innerRadius * Math.cos(startAngle);
    const y4 = 50 + innerRadius * Math.sin(startAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  let cumulativeAngle = 0;

  return (
    <section className="px-4 md:px-12 py-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
            <div className="w-full max-w-2xl relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#006b33] transition-colors" size={22} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: 0101, 101 ou Pioneira..."
                className="w-full pl-14 pr-16 py-3 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-[#006b33] focus:ring-4 focus:ring-[#006b33]/10 transition-all text-base font-medium placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSearch()}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#006b33] text-white p-2 rounded-full hover:bg-[#008742] transition-all shadow-md hover:shadow-lg">
                <Search size={18} />
              </button>
            </div>
        </div>

        {loading && !cooperative ? (
          <div className="flex py-24 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#006b33]"></div>
          </div>
        ) : errorMsg ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            <AlertCircle className="mb-4 mx-auto text-slate-400" size={48} />
            <p className="text-lg">{errorMsg}</p>
          </div>
        ) : cooperative && (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
              <div className="bg-[#006b33] text-white px-5 py-3 rounded-2xl text-2xl font-black font-headline shadow-lg shadow-[#006b33]/20">
                {cooperative.code}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-headline tracking-tight leading-tight">
                {cooperative.name}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col gap-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                      <Building2 size={120} className="text-[#006b33]" />
                   </div>
                   <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-slate-900 font-headline tracking-tight">Informações de Contato</h2>
                      <FileText className="text-[#006b33]/40" size={20} />
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gerente Geral</p>
                          <p className="font-bold text-slate-700">{cooperative.manager || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <Phone size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telefone</p>
                          <p className="font-bold text-slate-700">{cooperative.phone || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <Mail size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-mail</p>
                          <p className="font-bold text-slate-700">{cooperative.email || '-'}</p>
                        </div>
                      </div>
                   </div>
                   <div className="mt-4 pt-8 border-t border-slate-100">
                      <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#006b33]">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Localização</p>
                          <p className="text-xs font-black text-slate-800">{cooperative.location || '-'}</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-xl font-black text-slate-900 font-headline tracking-tight">Participação</h2>
                     <PieChart className="text-[#006b33]/40" size={20} />
                  </div>

                  <div className="flex-1 flex flex-row items-center justify-between gap-6 w-full px-2">
                    <div className="relative w-48 h-48 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.1)]">
                        <defs>
                          <linearGradient id="grad-agencia" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0ea5e9" />
                          </linearGradient>
                          <linearGradient id="grad-central" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#008742" />
                            <stop offset="100%" stopColor="#006b33" />
                          </linearGradient>
                          <linearGradient id="grad-conecta" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f59e0b" />
                          </linearGradient>
                        </defs>
                        
                        {total > 0 ? stats.map((s, i) => {
                          const percentage = (s.count / total);
                          if (percentage === 0) return null;
                          
                          const gap = 0.04; 
                          const startAngle = cumulativeAngle + gap;
                          const endAngle = cumulativeAngle + (percentage * 2 * Math.PI) - gap;
                          cumulativeAngle += (percentage * 2 * Math.PI);
                          
                          const gradId = `grad-${s.label.toLowerCase() === 'agência' ? 'agencia' : s.label.toLowerCase()}`;
                          const d = getArcPath(startAngle, endAngle, 44, 30);
                          
                          return (
                            <g key={i} className="transition-all duration-700 hover:scale-105 origin-center cursor-pointer">
                              <path d={d} fill="black" opacity="0.15" transform="translate(1.5, 3)" />
                              <path d={d} fill={`url(#${gradId})`} className="transition-all" />
                            </g>
                          );
                        }) : (
                          <circle cx="50" cy="50" r="37" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                        )}
                      </svg>
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-white rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-slate-900 leading-none">{total}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Produtos</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                      {stats.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100/50">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-2 h-2 shrink-0 rounded-full ${s.bg}`} />
                            <span className="text-[10px] font-black text-slate-700 tracking-tight truncate">{s.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-black text-slate-900">{s.count}</span>
                            <span className="text-[9px] font-bold text-slate-400">({total > 0 ? Math.round((s.count/total)*100) : 0}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden h-full flex flex-col">
                   <div className="bg-[#006b33] px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-white">
                        <ShieldCheck className="opacity-60" size={20} />
                        <h2 className="text-lg font-black font-headline tracking-tight">Produtos e Responsáveis</h2>
                      </div>
                      <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1">
                        <button 
                          onClick={() => setActiveService('sinistro')}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeService === 'sinistro' ? 'bg-white text-[#006b33] shadow-sm' : 'text-white/60 hover:text-white'}`}
                        >
                          Sinistros
                        </button>
                        <button 
                          onClick={() => setActiveService('renovacao')}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeService === 'renovacao' ? 'bg-white text-[#006b33] shadow-sm' : 'text-white/60 hover:text-white'}`}
                        >
                          Renovação
                        </button>
                      </div>
                   </div>
                   
                   <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                            <th className="px-8 py-4">Produto</th>
                            <th className="px-8 py-4 text-center">Responsável</th>
                            <th className="px-8 py-4 text-center">Data de Início</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {(() => {
                            const filteredProds = products.filter(p => p.type === activeService);
                            if (!filteredProds.length) {
                              return <tr><td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-medium">Esta cooperativa não possui aderência a este serviço no momento.</td></tr>;
                            }
                            return filteredProds.map((prod) => (
                              <tr key={prod.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                  <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-emerald-50 text-[#006b33] rounded-xl group-hover:scale-110 transition-transform">
                                      {(() => {
                                        const Icon = IconMap[prod.icon] || ShieldCheck;
                                        return <Icon size={18} />;
                                      })()}
                                    </div>
                                    <span className="font-bold text-slate-700">{prod.name}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getBadgeClass(prod.responsible)} transition-all group-hover:px-6`}>
                                    {prod.responsible}
                                  </span>
                                </td>
                                <td className="px-8 py-5 text-center text-sm font-bold text-slate-500 font-mono">
                                  {prod.start_date ? new Date(prod.start_date + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                   </div>
                   {currentServiceProducts.length > 0 && (
                    <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 italic">Mostrando {currentServiceProducts.length} produtos registrados para esta unidade nesta categoria.</p>
                    </div>
                   )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// --- Admin Restricted ---
const AdminRestrito = () => {
   const [session, setSession] = useState<any>(null);
   const [email, setEmail] = useState('');
   const [pass, setPass] = useState('');
   const [activeTab, setActiveTab] = useState<'coops' | 'prods' | 'insurers'>('coops');
   const [insurers, setInsurers] = useState<any[]>([]);
   const [isModalInsurerOpen, setIsModalInsurerOpen] = useState(false);
   const [editingInsurer, setEditingInsurer] = useState<any>(null);
   const [uploading, setUploading] = useState(false);

   // Coops State
   const [coops, setCoops] = useState<any[]>([]);
   const [loading, setLoading] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingCoop, setEditingCoop] = useState<any>(null);
   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

   // Products State
   const [products, setProducts] = useState<any[]>([]);
   const [activeServiceAdmin, setActiveServiceAdmin] = useState<'sinistro' | 'renovacao'>('sinistro');
   const [searchTermProds, setSearchTermProds] = useState('');
   const [isModalProdOpen, setIsModalProdOpen] = useState(false);
   const [editingProd, setEditingProd] = useState<any>(null);
   const [deleteConfirmProdId, setDeleteConfirmProdId] = useState<string | null>(null);
   const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'cooperative', direction: 'asc' | 'desc' } | null>(null);

   useEffect(() => {
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
     });

     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       setSession(session);
     });

     return () => subscription.unsubscribe();
   }, []);

   useEffect(() => {
     if (session) {
       loadCoops();
       loadProducts();
       loadInsurers();
     }
   }, [session, activeServiceAdmin]);

   const loadCoops = async () => {
      setLoading(true);
      try {
        const data = await api.getCooperatives();
        if (data) setCoops(data);
      } catch (err) {
        console.error('Erro ao carregar cooperativas:', err);
      }
      setLoading(false);
    };

    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        if (data) setProducts(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      }
      setLoading(false);
    };

    const loadInsurers = async () => {
      try {
        const data = await api.getInsurers();
        if (data) setInsurers(data);
      } catch (err) {
        console.error('Erro ao carregar seguradoras:', err);
      }
    };

    const filteredCoops = coops.filter(c => 
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProducts = products.filter(p => 
        (p.name.toLowerCase().includes(searchTermProds.toLowerCase()) || 
        p.cooperative?.name.toLowerCase().includes(searchTermProds.toLowerCase()) ||
        p.cooperative?.code.toLowerCase().includes(searchTermProds.toLowerCase())) &&
        p.type === activeServiceAdmin
      ).sort((a, b) => {
       if (!sortConfig) return 0;
       
       let valA = '';
       let valB = '';

       if (sortConfig.key === 'name') {
         valA = a.name.toLowerCase();
         valB = b.name.toLowerCase();
       } else if (sortConfig.key === 'cooperative') {
         valA = a.cooperative?.name.toLowerCase() || '';
         valB = b.cooperative?.name.toLowerCase() || '';
       }

       if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
       if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
       return 0;
     });

     const handleSort = (key: 'name' | 'cooperative') => {
       let direction: 'asc' | 'desc' = 'asc';
       if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
         direction = 'desc';
       }
       setSortConfig({ key, direction });
     };

   const handleSaveCoop = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const coopData: any = {
        code: (formData.get('code') as string).replace(/[^0-9]/g, ''),
        name: formData.get('name') as string,
        manager_name: formData.get('manager_name') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        location: formData.get('location') as string,
      };

      if (editingCoop) coopData.id = editingCoop.id;

      try {
        await api.saveCooperative(coopData);
        setIsModalOpen(false); 
        setEditingCoop(null); 
        loadCoops();
      } catch (err: any) {
        alert('Erro ao salvar: ' + err.message);
      }
      setLoading(false);
    };

   const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     setLoading(true);
     const formData = new FormData(e.currentTarget);
     
     const prodData: any = {
       name: formData.get('name') as string,
       area: formData.get('name') as string,
       cooperative_id: formData.get('cooperative_id') as string,
       responsible: formData.get('responsible') as string,
       icon: formData.get('icon') as string,
       start_date: formData.get('start_date') as string || null,
       type: activeServiceAdmin,
     };

     if (editingProd) prodData.id = editingProd.id;

     try {
       await api.saveProduct(prodData);
       setIsModalProdOpen(false); 
       setEditingProd(null); 
       loadProducts();
     } catch (err: any) {
       alert('Erro ao salvar produto: ' + err.message);
     }
     setLoading(false);
   };

   const handleDeleteCoop = async (id: string) => {
      if (deleteConfirmId !== id) { setDeleteConfirmId(id); setTimeout(() => setDeleteConfirmId(null), 3000); return; }
      
      try {
        await api.deleteCooperative(id);
        loadCoops();
      } catch (err: any) {
        alert('Erro ao excluir: ' + err.message);
      }
      setDeleteConfirmId(null);
    };

   const handleDeleteProduct = async (id: string) => {
       if (deleteConfirmProdId !== id) { setDeleteConfirmProdId(id); setTimeout(() => setDeleteConfirmProdId(null), 3000); return; }
       try {
         const prod = products.find(p => p.id === id);
         await api.deleteProduct(id, prod?.type);
         loadProducts();
       } catch (err: any) {
         alert('Erro ao excluir: ' + err.message);
       }
       setDeleteConfirmProdId(null);
     };

    const handleSaveInsurer = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      const fd = new FormData(e.currentTarget);
      
      const payload: any = {
        name: fd.get('name') as string,
        category: fd.get('category') as string,
        color_class: fd.get('color_class') as string,
        phone: fd.get('phone') as string,
        email: fd.get('email') as string,
        logo_url: editingInsurer?.logo_url || '',
        details: editingInsurer?.details || { sinistro: [], assistencia: [], acesso: '', whatsapp: '', outros: [] }
      };

      if (editingInsurer?.id) payload.id = editingInsurer.id;

      try {
        await api.saveInsurer(payload);
        setIsModalInsurerOpen(false);
        loadInsurers();
      } catch (err: any) {
        alert('Erro ao salvar: ' + err.message);
      }
      setLoading(false);
    };

    const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('insurer-logos')
        .upload(filePath, file);

      if (uploadError) {
        alert('Erro no upload: ' + uploadError.message);
      } else {
        const { data } = supabase.storage.from('insurer-logos').getPublicUrl(filePath);
        if (editingInsurer) {
          setEditingInsurer({ ...editingInsurer, logo_url: data.publicUrl });
        } else {
          setEditingInsurer({ name: '', logo_url: data.publicUrl, details: { sinistro: [], assistencia: [], acesso: '', whatsapp: '', outros: [] } });
        }
      }
      setUploading(false);
    };

    const handleDeleteInsurer = async (id: string) => {
      if (!confirm('Tem certeza que deseja excluir esta seguradora?')) return;
      try {
        await api.deleteInsurer(id);
        loadInsurers();
      } catch (err: any) {
        alert('Erro ao excluir: ' + err.message);
      }
    };

    const getIconByName = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('auto')) return 'Car';
      if (n.includes('residen')) return 'Home';
      if (n.includes('empresa') || n.includes('condo')) return 'Briefcase';
      if (n.includes('rural') || n.includes('maq')) return 'Tractor';
      if (n.includes('vida')) return 'HeartPulse';
      return 'ShieldCheck';
    };

    const handleLogin = async (e: React.FormEvent) => {
       e.preventDefault();
       setLoading(true);
       try {
         const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
         });
         
         if (error) throw error;
         
         // Após login, verificamos se o usuário tem a role admin no servidor
         const { data: { session } } = await supabase.auth.getSession();
         if (session) {
           const profile = await api.getProfile();
           if (profile?.role !== 'admin') {
              await supabase.auth.signOut();
              alert('Acesso negado: Você não tem permissões administrativas.');
           }
         }
       } catch (err: any) {
          alert('Erro na autenticação: ' + err.message);
       }
       setLoading(false);
    };

    if (!session) {
       return (
          <div className="flex justify-center items-center py-32 px-4 shadow-inner">
             <div className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-100 max-w-sm w-full font-body">
                <div className="text-center mb-8">
                   <div className="w-16 h-16 bg-[#006b33]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Settings size={28} className="text-[#006b33]" />
                   </div>
                   <h2 className="text-2xl font-black font-headline text-slate-900 tracking-tight">Acesso Admin</h2>
                   <p className="text-sm text-slate-500 mt-1">Área restrita administrativa oficial.</p>
                </div>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">E-mail</label>
                      <input required type="email" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006b33] w-full text-sm font-bold text-slate-700" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Senha</label>
                      <input required type="password" placeholder="Digite sua senha" value={pass} onChange={(e) => setPass(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006b33] w-full text-sm font-bold text-slate-700" />
                   </div>
                   <button type="submit" disabled={loading} className="bg-[#006b33] hover:bg-[#008742] transition-colors text-white font-bold px-4 py-3 rounded-xl shadow-md mt-2 cursor-pointer disabled:opacity-50">
                      {loading ? 'Autenticando...' : 'Autenticar Entrada'}
                   </button>
                   <p className="text-[9px] text-center text-slate-400 mt-2 px-4 italic leading-relaxed">Este acesso utiliza autenticação oficial do Supabase. Apenas usuários cadastrados podem realizar alterações.</p>
                </form>
             </div>
          </div>
       );
    }

   return (
      <section className="px-4 md:px-12 py-12">
         <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 font-headline tracking-tight">Retaguarda de Dados</h1>
                <p className="text-slate-500 font-body">Gerenciamento oficial de base de dados.</p>
              </div>
              <button onClick={() => supabase.auth.signOut()} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">Encerrar Sessão</button>
            </div>
            
            <div className="flex items-center gap-4 border-b border-slate-200 mb-8 pt-4">
               <button onClick={() => setActiveTab('coops')} className={`pb-4 font-bold text-sm uppercase tracking-widest ${activeTab === 'coops' ? 'border-b-2 border-[#006b33] text-[#006b33]' : 'text-slate-400 hover:text-slate-600'}`}>Cooperativas</button>
               <button onClick={() => setActiveTab('prods')} className={`pb-4 font-bold text-sm uppercase tracking-widest ${activeTab === 'prods' ? 'border-b-2 border-[#006b33] text-[#006b33]' : 'text-slate-400 hover:text-slate-600'}`}>Produtos & Vínculos</button>
               <button onClick={() => setActiveTab('insurers')} className={`pb-4 font-bold text-sm uppercase tracking-widest ${activeTab === 'insurers' ? 'border-b-2 border-[#006b33] text-[#006b33]' : 'text-slate-400 hover:text-slate-600'}`}>Seguradoras</button>
            </div>

            {activeTab === 'coops' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Buscar por código ou nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006b33] text-sm" />
                  </div>
                  <button onClick={() => { setEditingCoop(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-[#006b33] hover:bg-[#008742] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
                    <Plus size={18} /> Nova Cooperativa
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Cód.</th>
                        <th className="px-6 py-4">Nome</th>
                        <th className="px-6 py-4">Gerente</th>
                        <th className="px-6 py-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCoops.map((coop) => (
                        <tr key={coop.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-black text-[#006b33]">{coop.code}</td>
                          <td className="px-6 py-4 font-bold text-slate-700">{coop.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{coop.manager_name}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button onClick={() => { setEditingCoop(coop); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                              <button onClick={() => handleDeleteCoop(coop.id)} className={`p-2 transition-all rounded-lg ${deleteConfirmId === coop.id ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-red-600'}`}><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'prods' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                   <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                     <div className="relative flex-1 max-w-sm">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input type="text" placeholder="Buscar produto ou cooperativa..." value={searchTermProds} onChange={(e) => setSearchTermProds(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#006b33] text-sm" />
                     </div>
                     <div className="bg-slate-200/50 p-1 rounded-xl flex items-center gap-1 self-stretch md:self-auto">
                        <button 
                          onClick={() => setActiveServiceAdmin('sinistro')}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeServiceAdmin === 'sinistro' ? 'bg-[#006b33] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          <ShieldCheck size={14} /> Sinistros
                        </button>
                        <button 
                          onClick={() => setActiveServiceAdmin('renovacao')}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeServiceAdmin === 'renovacao' ? 'bg-[#006b33] text-white shadow-sm' : 'text-white/60 text-slate-500 hover:text-slate-700'}`}
                        >
                          <History size={14} /> Renovação
                        </button>
                      </div>
                   </div>
                   <button onClick={() => { setEditingProd(null); setIsModalProdOpen(true); }} className="flex items-center gap-2 bg-[#006b33] hover:bg-[#008742] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
                     <Plus size={18} /> Vincular {activeServiceAdmin === 'sinistro' ? 'Sinistro' : 'Renovação'}
                   </button>
                 </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                        <th 
                          className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-2">
                             Produto
                             {sortConfig?.key === 'name' ? (
                               sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-[#006b33]" /> : <ChevronDown size={12} className="text-[#006b33]" />
                             ) : <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100" />}
                          </div>
                        </th>
                        <th className="px-6 py-4">Responsável</th>
                        <th 
                          className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                          onClick={() => handleSort('cooperative')}
                        >
                          <div className="flex items-center gap-2">
                             Cooperativa
                             {sortConfig?.key === 'cooperative' ? (
                               sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-[#006b33]" /> : <ChevronDown size={12} className="text-[#006b33]" />
                             ) : <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100" />}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-emerald-50 rounded flex items-center justify-center text-emerald-700">
                                  {(() => { const Icon = IconMap[prod.icon] || ShieldCheck; return <Icon size={14} />; })()}
                                </div>
                                <span className="font-bold text-slate-700">{prod.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase ${getBadgeClass(prod.responsible)}`}>{prod.responsible}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                              <span className="text-[#006b33] font-bold">({prod.cooperative?.code})</span> {prod.cooperative?.name}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-3">
                                <button onClick={() => { setEditingProd(prod); setIsModalProdOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                                <button onClick={() => handleDeleteProduct(prod.id)} className={`p-2 transition-all rounded-lg ${deleteConfirmProdId === prod.id ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-red-600'}`}><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <p className="text-slate-400 text-sm font-medium">Não encontramos produtos para esta busca.</p>
                            <button 
                              onClick={() => setIsModalProdOpen(true)}
                              className="text-[#006b33] text-xs font-bold mt-2 hover:underline"
                            >
                              Clique aqui para vincular o primeiro produto
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Lista de Seguradoras</h3>
                  </div>
                   <button onClick={() => { setEditingInsurer(null); setIsModalInsurerOpen(true); }} className="flex items-center gap-2 bg-[#006b33] hover:bg-[#008742] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
                     <Plus size={18} /> Nova Seguradora
                   </button>
                 </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-6 py-4">Logo</th>
                        <th className="px-6 py-4">Nome</th>
                        <th className="px-6 py-4">Categoria</th>
                        <th className="px-6 py-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {insurers.map((ins) => (
                        <tr key={ins.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
                              {ins.logo_url ? <img src={ins.logo_url} className="w-full h-full object-contain" /> : <ShieldCheck className="text-slate-200" size={20} />}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">{ins.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full ${ins.color_class} text-[9px] font-black uppercase tracking-widest`}>{ins.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button onClick={() => { setEditingInsurer(ins); setIsModalInsurerOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                              <button onClick={() => handleDeleteInsurer(ins.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
         </div>

         {/* Modal Cooperativas */}
         <AnimatePresence>
           {isModalOpen && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden font-body">
                 <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900 font-headline uppercase tracking-tight">{editingCoop ? 'Editar Cooperativa' : 'Nova Cooperativa'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                 </div>
                 <form onSubmit={handleSaveCoop} className="p-8 space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cód.</label>
                        <input required name="code" defaultValue={editingCoop?.code} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm font-bold" />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome</label>
                        <input name="name" defaultValue={editingCoop?.name} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gerente</label>
                        <input name="manager_name" defaultValue={editingCoop?.manager_name} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Telefone</label>
                        <input name="phone" defaultValue={editingCoop?.phone} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">E-mail</label>
                      <input type="text" name="email" defaultValue={editingCoop?.email} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Localização</label>
                      <input name="location" defaultValue={editingCoop?.location} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 bg-[#006b33] text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all hover:bg-[#008742] uppercase tracking-widest text-xs">Salvar Cooperativa</button>
                 </form>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         {/* Modal Produtos */}
         <AnimatePresence>
           {isModalProdOpen && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalProdOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden font-body">
                 <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900 font-headline uppercase tracking-tight">{editingProd ? 'Editar Vínculo' : 'Novo Vínculo de Produto'}</h2>
                    <button onClick={() => setIsModalProdOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                 </div>
                 <form onSubmit={handleSaveProduct} className="p-8 space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cooperativa Beneficiária</label>
                      <select required name="cooperative_id" defaultValue={editingProd?.cooperative_id} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm font-bold bg-white">
                        <option value="">Selecione uma cooperativa...</option>
                        {coops.map(c => (
                          <option key={c.id} value={c.id}>({c.code}) {c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome do Produto</label>
                        <select 
                          required 
                          name="name" 
                          defaultValue={editingProd?.name} 
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm font-bold bg-white"
                          onChange={(e) => {
                             const iconField = (e.target.form as any).icon;
                             if(iconField) iconField.value = getIconByName(e.target.value);
                          }}
                        >
                          <option value="">Selecione...</option>
                          <option value="Seguro Automóvel">Seguro Automóvel</option>
                          <option value="Seguro Residencial">Seguro Residencial</option>
                          <option value="Seguro Empresarial">Seguro Empresarial</option>
                          <option value="Seguro Vida">Seguro Vida</option>
                          <option value="Seguro Rural">Seguro Rural</option>
                          <option value="Seguro Condominio">Seguro Condominio</option>
                          <option value="Seguro Maq/Equip">Seguro Maq/Equip</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ícone</label>
                        <select required name="icon" defaultValue={editingProd?.icon || 'ShieldCheck'} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm font-bold bg-white">
                          <option value="Car">Carro / Automóvel</option>
                          <option value="Home">Residencial / Casa</option>
                          <option value="Briefcase">Empresa / Negócios</option>
                          <option value="Building2">Prédio / Condomínio</option>
                          <option value="Wrench">Ferramentas / Manutenção</option>
                          <option value="Tractor">Rural / Agrícola</option>
                          <option value="HeartPulse">Vida / Saúde</option>
                          <option value="ShieldCheck">Geral / Segurança</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Responsável</label>
                        <select required name="responsible" defaultValue={editingProd?.responsible || 'Central'} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm font-bold bg-white">
                          <option value="Central">Central</option>
                          <option value="Agência">Agência</option>
                          <option value="Conecta">Conecta</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Data de Início</label>
                        <input type="date" name="start_date" defaultValue={editingProd?.start_date} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm font-bold" />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all hover:bg-black uppercase tracking-widest text-xs">Vincular Produto</button>
                 </form>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

          {/* Modal Seguradoras */}
          <AnimatePresence>
            {isModalInsurerOpen && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalInsurerOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden font-body flex flex-col">
                  <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                     <h2 className="text-xl font-black text-slate-900 font-headline uppercase tracking-tight">{editingInsurer?.id ? 'Editar Seguradora' : 'Nova Seguradora'}</h2>
                     <button onClick={() => setIsModalInsurerOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleSaveInsurer} className="p-8 space-y-6 overflow-y-auto flex-1">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div className="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                              {editingInsurer?.logo_url ? (
                                 <img src={editingInsurer.logo_url} className="w-full h-full object-contain p-2" />
                              ) : (
                                 <Upload className="text-slate-300" size={24} />
                              )}
                              {uploading && (
                                 <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-[#006b33] border-t-transparent animate-spin rounded-full" />
                                 </div>
                              )}
                              <input type="file" onChange={handleUploadLogo} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Clique para enviar logotipo</p>
                        </div>
                        <div className="space-y-4">
                           <div>
                             <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome da Seguradora</label>
                             <input required name="name" defaultValue={editingInsurer?.name} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm font-bold" />
                           </div>
                           <div>
                             <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Categoria de Venda</label>
                             <input required name="category" placeholder="Ex: Automóvel & Geral" defaultValue={editingInsurer?.category} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm" />
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cores do Tema (Classes Tailwind)</label>
                          <input name="color_class" placeholder="bg-red-50 text-red-600" defaultValue={editingInsurer?.color_class} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WhatsApp de Contato</label>
                          <input name="whatsapp" value={editingInsurer?.details?.whatsapp || ''} onChange={e => setEditingInsurer({...editingInsurer, details: {...editingInsurer.details, whatsapp: e.target.value}})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm" />
                        </div>
                     </div>

                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Números de Sinistro</label>
                        <ListManager 
                           list={editingInsurer?.details?.sinistro || []} 
                           onChange={(newList) => setEditingInsurer({...editingInsurer, details: {...editingInsurer.details, sinistro: newList}})} 
                        />
                     </div>

                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Assistência 24h</label>
                        <ListManager 
                           list={editingInsurer?.details?.assistencia || []} 
                           onChange={(newList) => setEditingInsurer({...editingInsurer, details: {...editingInsurer.details, assistencia: newList}})} 
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Caminho de Acesso (SIS)</label>
                           <textarea name="acesso" value={editingInsurer?.details?.acesso || ''} onChange={e => setEditingInsurer({...editingInsurer, details: {...editingInsurer.details, acesso: e.target.value}})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm h-20" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Observações / Logins</label>
                           <textarea name="outros" value={editingInsurer?.details?.outros?.join('\n') || ''} onChange={e => setEditingInsurer({...editingInsurer, details: {...editingInsurer.details, outros: e.target.value.split('\n')}})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-sm h-20" />
                        </div>
                     </div>

                     <button type="submit" disabled={loading} className="w-full py-4 bg-[#006b33] text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all hover:bg-[#008742] uppercase tracking-widest text-xs">Salvar Alterações</button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

      </section>
   )
}

const ListManager = ({ list, onChange }: { list: string[], onChange: (list: string[]) => void }) => {
   const [newItem, setNewItem] = useState('');

   const addItem = () => {
      if (!newItem.trim()) return;
      onChange([...list, newItem.trim()]);
      setNewItem('');
   };

   const removeItem = (index: number) => {
      onChange(list.filter((_, i) => i !== index));
   };

   return (
      <div className="space-y-2">
         <div className="flex flex-wrap gap-2">
            {list.map((item, idx) => (
               <div key={idx} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700">
                  {item}
                  <button type="button" onClick={() => removeItem(idx)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
               </div>
            ))}
         </div>
         <div className="flex gap-2">
            <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem())} placeholder="Novo número ou contato..." className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-[#006b33] text-xs" />
            <button type="button" onClick={addItem} className="p-2 bg-slate-100 hover:bg-[#006b33] hover:text-white rounded-xl transition-colors"><Plus size={16} /></button>
         </div>
      </div>
   );
};

export default function App() {
  const [view, setView] = useState<View>('kpis');

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-body">
      <Navbar currentView={view} setView={setView} />

      <main className="flex-1 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'seguradoras' && <InsuranceGrid />}
            {view === 'kpis' && <KPIDashboard />}
            {view === 'perfil' && <CooperativeProfile />}
            {view === 'admin' && <AdminRestrito />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom NavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-6 py-3 flex justify-between items-center z-50 border-t border-slate-100">
        <button
          onClick={() => setView('kpis')}
          className={`flex flex-col items-center gap-1 ${view === 'kpis' ? 'text-[#006b33]' : 'text-slate-400'}`}
        >
          <BarChart3 size={24} />
          <span className="text-[10px] font-bold">KPIs</span>
        </button>
        <button
          onClick={() => setView('perfil')}
          className={`flex flex-col items-center gap-1 ${view === 'perfil' ? 'text-[#006b33]' : 'text-slate-400'}`}
        >
          <Building2 size={24} />
          <span className="text-[10px] font-bold">Coops</span>
        </button>
        <button
          onClick={() => setView('seguradoras')}
          className={`flex flex-col items-center gap-1 ${view === 'seguradoras' ? 'text-[#006b33]' : 'text-slate-400'}`}
        >
          <ShieldCheck size={24} />
          <span className="text-[10px] font-bold">Seguros</span>
        </button>
        <button
          onClick={() => setView('admin')}
          className={`flex flex-col items-center gap-1 ${view === 'admin' ? 'text-[#006b33]' : 'text-slate-400'}`}
        >
          <Settings size={24} />
          <span className="text-[10px] font-bold">Admin</span>
        </button>
      </nav>


    </div>
  );
}
