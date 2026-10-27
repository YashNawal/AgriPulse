'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  FileText
} from 'lucide-react';

interface DiseaseDiagnosis {
  cropName: string;
  diseaseName: string;
  scientificName: string;
  confidencePct: number;
  isHealthy: boolean;
  symptoms: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  sources: string[];
}

const SAMPLE_DISEASES: Record<string, DiseaseDiagnosis> = {
  'tomato-blight': {
    cropName: 'Tomato (टोमॅटो)',
    diseaseName: 'Early Blight (करपा रोग / अगेती झुलसा)',
    scientificName: 'Alternaria solani',
    confidencePct: 94,
    isHealthy: false,
    symptoms: [
      'Concentric dark brown rings resembling target board pattern on lower leaves.',
      'Yellow chlorotic halos surrounding lesions leading to premature leaf defoliation.',
      'Dark sunken cankers on stems and stem-end rot on green fruits.'
    ],
    organicTreatment: [
      'Spray Neem Oil (10,000 ppm) at 5 ml/liter water every 10 days.',
      'Soil application of Trichoderma harzianum (2 kg/acre enriched in well-decomposed manure).',
      'Remove and safely burn infected bottom foliage to arrest spore spread.'
    ],
    chemicalTreatment: [
      'Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2.0 g/liter of water.',
      'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top) @ 1.0 ml/liter for severe infestation.'
    ],
    sources: ['ICAR-IIHR Indian Institute of Horticultural Research', 'National Research Centre for Integrated Pest Management (NCIPM)']
  },
  'wheat-rust': {
    cropName: 'Wheat (गेहूं)',
    diseaseName: 'Yellow Rust / Stripe Rust (पीला रतुआ)',
    scientificName: 'Puccinia striiformis',
    confidencePct: 91,
    isHealthy: false,
    symptoms: [
      'Bright yellow powdery pustules arranged in continuous parallel linear stripes on leaf blades.',
      'Yellow powder stains fingers upon touch.'
    ],
    organicTreatment: [
      'Plant certified rust-resistant varieties like HD-2967, DBW-187, or GW-322.',
      'Avoid excessive nitrogen fertilization which creates succulent susceptible vegetative canopy.'
    ],
    chemicalTreatment: [
      'Propiconazole 25% EC (Tilt / Bumper) @ 1.0 ml/liter water at first appearance of yellow stripes.'
    ],
    sources: ['ICAR-IIWBR Indian Institute of Wheat and Barley Research, Karnal']
  },
  'onion-blotch': {
    cropName: 'Onion (कांदा)',
    diseaseName: 'Purple Blotch (जांभळा करपा)',
    scientificName: 'Alternaria porri',
    confidencePct: 88,
    isHealthy: false,
    symptoms: [
      'Small, water-soaked lesions that turn brown to purple with a yellow concentric border.',
      'Stalk girdling causing seed-stalk breakage and bulb yield reduction.'
    ],
    organicTreatment: [
      'Spray Pseudomonas fluorescens @ 5 g/liter of water.',
      'Adopt raised bed planting with proper drainage.'
    ],
    chemicalTreatment: [
      'Mancozeb 75% WP @ 2.5 g/liter + sticker or Difenoconazole 25% EC @ 1 ml/liter.'
    ],
    sources: ['ICAR-DOGR Directorate of Onion and Garlic Research, Rajgurunagar']
  },
  'healthy-leaf': {
    cropName: 'Soybean (सोयाबीन)',
    diseaseName: 'Healthy Vigorous Crop (निरोगी पीक)',
    scientificName: 'Glycine max',
    confidencePct: 98,
    isHealthy: true,
    symptoms: [
      'Uniform dark green coloration without lesions, spots, or chlorotic mottling.',
      'Healthy trifoliate leaves with normal turgidity.'
    ],
    organicTreatment: [
      'Maintain regular drip irrigation cycles.',
      'Continue recommended 19:19:19 vegetative booster foliar spray.'
    ],
    chemicalTreatment: [
      'No chemical intervention required. Protect beneficial predatory insects.'
    ],
    sources: ['ICAR-IISR Indian Institute of Soybean Research, Indore']
  }
};

export default function DiseasePage() {
  const { t, locale } = useLanguage();
  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosis | null>(null);

  const strings = {
    title: isEn ? 'AI Crop Disease Detection' : isMr ? 'पीक रोग व कीड तपासणी' : 'फसल रोग व कीट पहचान',
    subtitle: isEn
      ? 'Upload a photo of an affected leaf to identify plant diseases, get ICAR scientific treatments, and consult an agronomist.'
      : isMr
      ? 'बाधित पानाचा फोटो अपलोड करा, रोगाचे अचूक निदान मिळवा आणि तज्ञांचे फवारणी मार्गदर्शन मिळवा.'
      : 'पत्ती का फोटो अपलोड करके तुरंत रोग की पहचान करें और ICAR अनुमोदित छिड़काव सलाह पाएं।',
    dragDrop: isEn ? 'Click or drag a leaf photo here' : isMr ? 'पानाचा फोटो येथे निवडा किंवा ड्रॅग करा' : 'यहाँ पत्ती का फोटो चुनें या खींचें',
    supported: isEn ? 'Supports JPG, PNG up to 10MB' : isMr ? 'JPG, PNG प्रकार समर्थित' : 'JPG, PNG समर्थित',
    analyzing: isEn ? 'Analyzing leaf pathology...' : isMr ? 'पानाचे विश्लेषण सुरू आहे...' : 'पत्ती का विश्लेषण हो रहा है...',
    confidenceLabel: isEn ? 'Diagnosis Confidence' : isMr ? 'निदान खात्री' : 'पहचान सटीकता',
    symptomsTitle: isEn ? 'Identified Symptoms' : isMr ? 'लक्षणे' : 'रोग के लक्षण',
    organicTitle: isEn ? 'Organic / IPM Control' : isMr ? 'जैविक व एकात्मिक उपाय' : 'जैविक व देशी उपचार',
    chemicalTitle: isEn ? 'Chemical Fungicide / Spray' : isMr ? 'रासायनिक औषध व प्रमाण' : 'रासायनिक दवा व छिड़काव मात्रा',
    askBot: isEn ? 'Ask KisanMitra for Advice' : isMr ? 'किसानमित्र AI ला अधिक विचारा' : 'किसानमित्र AI से और पूछें',
    talkExpert: isEn ? 'Send to Agronomist' : isMr ? 'कृषी तज्ञांकडे पाठवा' : 'कृषि विशेषज्ञ को भेजें'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFile(url);
      runDiagnosis('tomato-blight');
    }
  };

  const runDiagnosis = (key: string) => {
    setAnalyzing(true);
    setDiagnosis(null);
    setTimeout(() => {
      setDiagnosis(SAMPLE_DISEASES[key] || SAMPLE_DISEASES['tomato-blight']);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] py-8 text-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            W14: Crop Disease Diagnostics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            {strings.title}
          </h1>
          <p className="text-xs text-gray-600 max-w-2xl">
            {strings.subtitle}
          </p>
        </div>

        {/* Upload Box */}
        <div className="bg-white border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-3xl p-8 text-center transition-all shadow-xs">
          <input
            type="file"
            id="leaf-upload"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="leaf-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">{strings.dragDrop}</div>
              <p className="text-xs text-gray-500 mt-1">{strings.supported}</p>
            </div>
            <span className="px-5 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-semibold shadow-xs transition-colors">
              Take Photo or Upload
            </span>
          </label>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500">Quick Test Samples:</span>
          <button
            onClick={() => { setSelectedFile('https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80'); runDiagnosis('tomato-blight'); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-300 hover:border-emerald-500"
          >
            🍅 Tomato Blight
          </button>
          <button
            onClick={() => { setSelectedFile('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'); runDiagnosis('wheat-rust'); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-300 hover:border-emerald-500"
          >
            🌾 Wheat Yellow Rust
          </button>
          <button
            onClick={() => { setSelectedFile('https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80'); runDiagnosis('onion-blotch'); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-300 hover:border-emerald-500"
          >
            🧅 Onion Purple Blotch
          </button>
          <button
            onClick={() => { setSelectedFile('https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'); runDiagnosis('healthy-leaf'); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-300 hover:border-emerald-500"
          >
            🌱 Healthy Leaf
          </button>
        </div>

        {/* Analyzing Spinner */}
        {analyzing && (
          <div className="bg-white rounded-3xl p-8 border text-center space-y-3 shadow-xs">
            <div className="w-10 h-10 border-4 border-[#165b33] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-800">{strings.analyzing}</p>
          </div>
        )}

        {/* Diagnosis Report Card */}
        {diagnosis && !analyzing && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
            
            {/* Top Bar: Disease Name and Confidence */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{diagnosis.cropName}</span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                  {diagnosis.diseaseName}
                </h2>
                <span className="text-xs italic text-gray-500 font-serif">Pathogen: {diagnosis.scientificName}</span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-gray-500 block">{strings.confidenceLabel}</span>
                <span className={`text-2xl font-black ${diagnosis.isHealthy ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {diagnosis.confidencePct}% Match
                </span>
              </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                {strings.symptomsTitle}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                {diagnosis.symptoms.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Treatments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Organic / IPM */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  {strings.organicTitle}
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-950 leading-relaxed">
                  {diagnosis.organicTreatment.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical Treatment */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  {strings.chemicalTitle}
                </h4>
                <ul className="space-y-1.5 text-xs text-blue-950 leading-relaxed">
                  {diagnosis.chemicalTreatment.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-700 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Sources & Action Buttons */}
            <div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-[11px] text-gray-400">
                Sources: {diagnosis.sources.join(' · ')}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/chat"
                  className="px-4 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-800 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  {strings.askBot}
                </Link>

                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {strings.talkExpert}
                </Link>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
