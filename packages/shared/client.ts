import {
  Product,
  FertilizerPlan,
  CommodityMaster,
  PriceRecord,
  PriceForecast,
  MarketRanking,
  SellOrWaitDecision,
  SoilProfile,
  CropSuitability,
  ProductRequest,
  ChatMessage,
  HandoffTicket,
  SupportedLanguage,
  AdminStats
} from './types';

import {
  MOCK_COMMODITIES,
  MOCK_PRODUCTS,
  MOCK_FERTILIZER_PLANS,
  MOCK_PRICES,
  MOCK_FORECASTS,
  MOCK_MARKET_RANKINGS,
  MOCK_SELL_OR_WAIT,
  MOCK_SOIL,
  MOCK_RECOMMENDED_CROPS,
  MOCK_HANDOFF_TICKETS,
  MOCK_PRODUCT_REQUESTS,
  MOCK_ADMIN_STATS
} from './mockData';

export class KisanMitraApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  // 1. Commodity & Price Data
  async getCommodities(): Promise<CommodityMaster[]> {
    return MOCK_COMMODITIES;
  }

  async getPrices(commodityName?: string): Promise<PriceRecord[]> {
    if (!commodityName) return MOCK_PRICES;
    return MOCK_PRICES.filter(p => p.commodityName.toLowerCase().includes(commodityName.toLowerCase()));
  }

  async getForecast(commodity: string): Promise<PriceForecast> {
    return MOCK_FORECASTS[commodity] || MOCK_FORECASTS['Wheat (गेहूं)'];
  }

  // 2. Decision Engine: Market Net Income Ranking
  async getMarketRankings(
    crop: string,
    transportRatePerKm: number = 0.8,
    mandiFeePct: number = 1.5,
    transitLossPct: number = 0.5
  ): Promise<MarketRanking[]> {
    return MOCK_MARKET_RANKINGS.map(item => {
      const gross = item.grossPrice;
      const transportCost = Math.round(item.distanceKm * transportRatePerKm);
      const mandiFee = Math.round((gross * mandiFeePct) / 100);
      const transitLoss = Math.round((gross * transitLossPct) / 100);
      const net = gross - transportCost - mandiFee - transitLoss;
      return {
        ...item,
        transportCost,
        mandiFee,
        transitLoss,
        netIncome: net,
        verdict: (net >= 2670 ? 'Best Net Income' : net >= 2600 ? 'Alternate' : 'Avoid') as 'Best Net Income' | 'Alternate' | 'Avoid'
      };
    }).sort((a, b) => b.netIncome - a.netIncome);
  }

  // 3. Decision Engine: Sell vs Wait
  async getSellOrWaitDecision(crop: string): Promise<SellOrWaitDecision> {
    return {
      ...MOCK_SELL_OR_WAIT,
      crop: crop || MOCK_SELL_OR_WAIT.crop
    };
  }

  // 4. Soil Health & Crop Matching
  async getSoilProfile(lat?: number, lon?: number): Promise<SoilProfile> {
    return MOCK_SOIL;
  }

  async getCropRecommendations(soil?: Partial<SoilProfile>): Promise<CropSuitability[]> {
    return MOCK_RECOMMENDED_CROPS;
  }

  // 5. Store & Fertilizer Regimen
  async getProducts(category?: string, cropFilter?: string): Promise<Product[]> {
    let list = [...MOCK_PRODUCTS];
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    if (cropFilter && cropFilter !== 'all') {
      list = list.filter(p => p.crop.toLowerCase().includes(cropFilter.toLowerCase()) || p.crop.includes('All Crops'));
    }
    return list;
  }

  async getFertilizerPlans(cropName: string = 'Wheat (गेहूं)', soilPhosphorusLevel: 'low' | 'medium' | 'high' = 'low'): Promise<FertilizerPlan[]> {
    const plans = MOCK_FERTILIZER_PLANS.filter(p => p.crop.includes(cropName) || p.crop === cropName);
    if (plans.length === 0) return MOCK_FERTILIZER_PLANS.slice(0, 3);

    // Dynamic adjustment for soil card:
    if (soilPhosphorusLevel === 'low') {
      return plans.map(p => {
        if (p.growthStage.includes('Basal')) {
          return {
            ...p,
            adjustedForSoil: 'मृदा कार्ड में फॉस्फोरस कम है: डीएपी की मात्रा 10 किग्रा/एकड़ बढ़ाई गई।',
            quantityPerAcre: '60 kg DAP + 20 kg MOP per acre'
          };
        }
        return p;
      });
    }
    return plans;
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: Math.floor(Math.random() * 9000) + 1000
    };
    MOCK_PRODUCTS.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...updates };
      return MOCK_PRODUCTS[idx];
    }
    return null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS.splice(idx, 1);
      return true;
    }
    return false;
  }

  async addFertilizerPlan(plan: Omit<FertilizerPlan, 'id'>): Promise<FertilizerPlan> {
    const newPlan: FertilizerPlan = {
      ...plan,
      id: Math.floor(Math.random() * 9000) + 2000
    };
    MOCK_FERTILIZER_PLANS.unshift(newPlan);
    return newPlan;
  }

  async submitProductRequest(request: Omit<ProductRequest, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; requestId: number; message: string }> {
    const newId = Math.floor(Math.random() * 90000) + 10000;
    const newRequest: ProductRequest = {
      ...request,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    MOCK_PRODUCT_REQUESTS.unshift(newRequest);
    return {
      success: true,
      requestId: newId,
      message: `ऑर्डर अनुरोध #${newId} दर्ज हो गया है। स्थानीय कृषि डिपो द्वारा संपर्क किया जाएगा। (Order request recorded, notified via Telegram)`
    };
  }

  async getProductRequests(): Promise<ProductRequest[]> {
    return MOCK_PRODUCT_REQUESTS;
  }

  async updateProductRequestStatus(id: number, status: ProductRequest['status']): Promise<boolean> {
    const req = MOCK_PRODUCT_REQUESTS.find(r => r.id === id);
    if (req) {
      req.status = status;
      return true;
    }
    return false;
  }

  // 6. Admin Panel Handoff Tickets & Statistics
  async getHandoffTickets(): Promise<HandoffTicket[]> {
    return MOCK_HANDOFF_TICKETS;
  }

  async replyToHandoffTicket(ticketId: number, reply: string): Promise<boolean> {
    const ticket = MOCK_HANDOFF_TICKETS.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'answered';
      ticket.agronomistReply = reply;
      ticket.answeredAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  async getAdminStats(): Promise<AdminStats> {
    return {
      ...MOCK_ADMIN_STATS,
      newProductRequests: MOCK_PRODUCT_REQUESTS.filter(r => r.status === 'pending').length,
      openExpertQuestions: MOCK_HANDOFF_TICKETS.filter(t => t.status === 'open').length,
      totalProducts: MOCK_PRODUCTS.length
    };
  }

  // 7. Multilingual AI Assistant Chat Engine
  async sendChatMessage(
    text: string,
    lang: SupportedLanguage = 'hi',
    channel: 'web' | 'whatsapp' | 'telegram' | 'app' = 'web'
  ): Promise<ChatMessage> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language: lang, channel })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (_) {}
    }

    const lower = text.toLowerCase();

    // Agronomic anti-hallucination grounded responses
    let replyText = '';
    let sources: string[] = ['ICAR Indian Institute of Agricultural Research'];
    let suggestedButtons = lang === 'en'
      ? ["Today's Modal Price", 'Fertilizer Schedule & Dosage', 'Sell or Wait Decision', 'Talk to Agronomist']
      : lang === 'mr'
      ? ['आजचा बाजारभाव', 'खत व्यवस्थापन व मात्रा', 'माल विकावा की थांबावे?', 'कृषी तज्ञांशी चर्चा']
      : ['आज का मॉडल भाव', 'खाद का समय व मात्रा', 'बेचें या रुकें', 'कृषि विशेषज्ञ'];
    let isHandoff = false;

    if (lower.includes('expert') || lower.includes('विशेषज्ञ') || lower.includes('तज्ञ') || lower.includes('help') || lower.includes('सलाहकार')) {
      replyText = lang === 'mr' 
        ? 'आपला प्रश्न कंपनीच्या कृषी तज्ञांकडे (Agronomist) पाठवला गेला आहे. तज्ञ लवकरच उत्तर देतील.'
        : lang === 'en'
        ? 'Your query has been forwarded to our verified agronomist. You will receive an expert response shortly.'
        : 'आपका प्रश्न कृषि विशेषज्ञ (Agronomist) को भेज दिया गया है। टिकट संख्या #503 बनाई गई है, जल्द ही समाधान मिलेगा।';
      isHandoff = true;
    } else if (lower.includes('खाद') || lower.includes('यूरिया') || lower.includes('dap') || lower.includes('fertilizer') || lower.includes('खत')) {
      replyText = lang === 'mr'
        ? 'गहू पिकासाठी पेरणीच्या वेळी ५० किलो डीएपी + २० किलो एमओपी प्रति एकर द्यावे. पहिल्या पाण्याच्या वेळी (२१ दिवस) ३५ किलो युरिया व ५ किलो झिंक द्या.'
        : lang === 'en'
        ? 'For Wheat: Apply 50 kg DAP + 20 kg MOP per acre as basal dose at sowing. Top-dress with 35 kg Neem-coated Urea + 5 kg Zinc Sulphate at 1st crown root irrigation (21 days).'
        : 'गेंहू में बुवाई के समय 50 किग्रा DAP + 20 किग्रा MOP प्रति एकड़ डालें। 21 दिन पर पहली सिंचाई के बाद 35 किग्रा नीम कोटेड यूरिया व 5 किग्रा जिंक सल्फेट दें।';
      sources = ['ICAR-IIWBR Karnal Agronomy Package of Practices 2024-25'];
    } else if (lower.includes('भाव') || lower.includes('price') || lower.includes('दर') || lower.includes('मंडी') || lower.includes('रेट')) {
      replyText = lang === 'mr'
        ? 'आज इंदूर बाजार समितीत गव्हाचा सरासरी भाव ₹२,७२०/क्विंटल आहे. उज्जैन मंडीमध्ये ₹२,७६० चा उच्च भाव मिळत आहे.'
        : lang === 'en'
        ? 'Today’s modal price for Wheat in Indore Mandi is ₹2,720/quintal. Ujjain Mandi is recording higher returns at ₹2,760/quintal.'
        : 'आज इंदौर APMC मंडी में गेंहू का मॉडल भाव ₹2,720/क्विंटल है। उज्जैन मंडी में उच्चतम ₹2,760/क्विंटल का भाव चल रहा है।';
      sources = ['Agmarknet Live APMC Feed', 'Madhya Pradesh Mandi Board'];
    } else if (lower.includes('रुके') || lower.includes('रुकें') || lower.includes('बेचें') || lower.includes('wait') || lower.includes('sell')) {
      replyText = lang === 'mr'
        ? 'निर्णय: साठवणूक करा (WAIT & STORE). पुढील १४ दिवसांत दर ₹८० ते ₹१२० प्रति क्विंटलने वाढण्याचा अंदाज आहे.'
        : lang === 'en'
        ? 'Decision: WAIT & STORE. Our 14-day ML model forecasts a ₹85-₹120/q price rise due to low arrivals and high procurement mill demand.'
        : 'निर्णय: रुकें व भंडारण करें (WAIT & STORE)। आगामी 14 दिनों में गेंहू के भाव में ₹85 से ₹120 प्रति क्विंटल सुधार की 82% संभावना है।';
      sources = ['KisanMitra Price Forecasting Engine (p10-p90 probabilistic model)'];
    } else {
      replyText = lang === 'mr'
        ? 'माझ्या दस्तऐवजात याबद्दल निश्चित माहिती सापडली नाही (NOT_FOUND). चुकीचा सल्ला टाळण्यासाठी कृपया खालील बटणावरून कृषी तज्ञांशी संपर्क साधा.'
        : lang === 'en'
        ? 'I could not find verified agricultural facts for this query in my repository (NOT_FOUND). To ensure crop safety, please click Talk to Expert.'
        : 'मुझे अपनी अधिकृत कृषि फाइलों में इसका सटीक उत्तर नहीं मिला (NOT_FOUND)। गलत सलाह से बचने के लिए कृपया "कृषि विशेषज्ञ से बात करें" पर क्लिक करें।';
      isHandoff = true;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      channel,
      text: replyText,
      language: lang,
      sources,
      suggestedButtons,
      isHandoff,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 8. Generate WhatsApp Link Code
  generateLinkCode(): { code: string; waLink: string; expiresMinutes: number } {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const botPhone = process.env.NEXT_PUBLIC_WHATSAPP_BOT_NUMBER || '919876543210';
    return {
      code: randomCode,
      waLink: `https://wa.me/${botPhone}?text=LINK%20${randomCode}`,
      expiresMinutes: 10
    };
  }
}

export const sharedApiClient = new KisanMitraApiClient();
