// Comprehensive Master Database of All Crops, Vegetables, Grains, Pulses, Spices, Fruits & Cash Crops Grown Across India
// Includes real APMC baseline prices, seasonal arrivals, MSP, expected yields, and quality grade standards.

export type CropCategory =
  | 'vegetables'
  | 'grains'
  | 'pulses'
  | 'oilseeds'
  | 'spices'
  | 'fruits'
  | 'cash_crops';

export interface CropMasterRecord {
  key: string;                       // Standard key e.g. 'Ladyfinger', 'Onion'
  nameEn: string;
  nameMr: string;
  nameHi: string;
  category: CropCategory;
  categoryLabelEn: string;
  categoryLabelMr: string;
  categoryLabelHi: string;
  benchmarkModalQuintal: number;    // Modal rate in ₹/q
  benchmarkMinQuintal: number;
  benchmarkMaxQuintal: number;
  benchmarkYesterdayMaxQuintal: number;
  benchmarkArrivalsTonnes: number;
  expectedYieldQuintalPerAcre: number;
  msp?: number;                      // Minimum Support Price if covered by Govt of India
  aliases: string[];                 // Search synonyms (English, Hindi, Marathi, Romanized)
  qualityParams: {
    goodGradeA: {
      en: string;
      mr: string;
      hi: string;
    };
    averageGradeB: {
      en: string;
      mr: string;
      hi: string;
    };
    lowGradeC: {
      en: string;
      mr: string;
      hi: string;
    };
  };
}

export const ALL_INDIAN_CROPS: CropMasterRecord[] = [
  // =========================================================================
  // 1. VEGETABLES (भाज्या / सब्जियां)
  // =========================================================================
  {
    key: 'Ladyfinger',
    nameEn: 'Ladyfinger (Okra)',
    nameMr: 'भेंडी (Bhendi)',
    nameHi: 'भिंडी (Bhindi)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 4200,
    benchmarkMinQuintal: 3000,
    benchmarkMaxQuintal: 5200,
    benchmarkYesterdayMaxQuintal: 5400,
    benchmarkArrivalsTonnes: 45,
    expectedYieldQuintalPerAcre: 55,
    aliases: ['ladyfinger', 'okra', 'bhindi', 'bhendi', 'भेंडी', 'भिंडी', 'bendakaya', 'vendakkai'],
    qualityParams: {
      goodGradeA: {
        en: 'Tender, crisp, uniform vibrant dark green, 6-9 cm, snapping tip, zero pest spots.',
        mr: 'कोवळी, ताजी, लुसलुशीत, एकसारखी गडद हिरवी (६-९ सेमी), शेंडा सहज तुटणारा, डाग नसलेला.',
        hi: 'ताजी, कोमल, हरी-भरी, एकसमान 6-9 सेमी, बिना किसी कीट या दाग के प्रीमियम भिंडी।'
      },
      averageGradeB: {
        en: 'Standard market harvest lot, mixed sizes, moderate curve, standard tenderness.',
        mr: 'नियमित बाजारातील लॉट, मध्यम आकार, सर्वसामान्य कोवळीक, बाजारात सर्वाधिक विकला जाणारा.',
        hi: 'सामान्य मंडी लॉट, मिला-जुला आकार, सामान्य कोमलता, थोक नीलामी हेतु उपयुक्त।'
      },
      lowGradeC: {
        en: 'Delayed harvest, fibrous/tough tip, oversized (>12 cm) or small, minor skin marks.',
        mr: 'उशिरा तोडलेली, जाड, निब्बर, १२ सेमीपेक्षा मोठी, डागी किंवा शेंडा कडक झालेली.',
        hi: 'देरी से तोड़ी गई, मोटी, रेशेदार, कड़ी या छोटी-बड़ी असमान भिंडी।'
      }
    }
  },
  {
    key: 'Onion',
    nameEn: 'Onion',
    nameMr: 'कांदा (Kanda)',
    nameHi: 'प्याज (Pyaz)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 2350,
    benchmarkMinQuintal: 1800,
    benchmarkMaxQuintal: 2650,
    benchmarkYesterdayMaxQuintal: 2750,
    benchmarkArrivalsTonnes: 950,
    expectedYieldQuintalPerAcre: 25,
    aliases: ['onion', 'kanda', 'pyaz', 'कांदा', 'प्याज', 'dungri', 'vengayam'],
    qualityParams: {
      goodGradeA: {
        en: 'Garva / Export quality 55mm+, tight shiny pink-red scales, zero double bulbs, dry neck.',
        mr: 'गर्वा / एक्सपोर्ट क्वालिटी ५५ मिमी+, घट्ट लाल पापुद्रा, डेंगळे नसलेला, वाळलेली मान.',
        hi: 'निर्यात गुणवत्ता 55 मिमी+, चमकदार गुलाबी-लाल छिलका, सुखी गर्दन, बिना फूट वाला।'
      },
      averageGradeB: {
        en: 'Medium size 40-50mm, firm outer skin, slight size variation, ideal for wholesale.',
        mr: 'मध्यम आकार ४०-५० मिमी, चांगला वाळलेला, घरगुती व स्थानिक बाजारास योग्य.',
        hi: 'मध्यम आकार 40-50 मिमी, ठोस छिलका, सामान्य थोक बिक्री हेतु उपयुक्त।'
      },
      lowGradeC: {
        en: 'Golta/Golti (<35mm), thick neck, peeled scales, or light sprouting.',
        mr: 'गोलटा / गोलटी (३५ मिमी पेक्षा लहान), जाड मान असलेला, पापुद्रा उडालेला.',
        hi: 'गोल्टा/गोलटी (35 मिमी से छोटा), मोटी गर्दन, छिलका उतरा हुआ या दागदार।'
      }
    }
  },
  {
    key: 'Tomato',
    nameEn: 'Tomato',
    nameMr: 'टोमॅटो (Tomato)',
    nameHi: 'टमाटर (Tamatar)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 1950,
    benchmarkMinQuintal: 1400,
    benchmarkMaxQuintal: 2400,
    benchmarkYesterdayMaxQuintal: 2500,
    benchmarkArrivalsTonnes: 320,
    expectedYieldQuintalPerAcre: 160,
    aliases: ['tomato', 'tamatar', 'टोमॅटो', 'टमाटर', 'thakkali'],
    qualityParams: {
      goodGradeA: {
        en: 'Firm round hybrid (Abhinav/Sahu), uniform bright red/orange, no cracks or blight.',
        mr: 'घट्ट गर असलेला गोल हायब्रिड (अभिनव/साहू), एकसारखा लाल, तडे व डाग नसलेला.',
        hi: 'ठोस गोल हाइब्रिड टमाटर, चमकदार लाल रंग, बिना दाग-धब्बे या दरार के।'
      },
      averageGradeB: {
        en: 'Semi-ripe, medium firmness, minor skin scuffs, regular crate trade lot.',
        mr: 'मध्यम घट्ट, थोडा हिरवट-लाल, क्रेटमधील नियमित बाजाराचा माल.',
        hi: 'मध्यम ठोस, थोड़ा हरा-लाल, सामान्य कैरेट नीलामी माल।'
      },
      lowGradeC: {
        en: 'Soft / over-ripe, misshapen, minor cracking, suitable for local sauce/processing.',
        mr: 'जास्त पिकलेला, मऊ, डागी किंवा चिरलेला स्थानिक वापरासाठी.',
        hi: 'अधिक पका हुआ, मुलायम, कटे-फटे या असम आकार के टमाटर।'
      }
    }
  },
  {
    key: 'Potato',
    nameEn: 'Potato',
    nameMr: 'बटाटा (Batata)',
    nameHi: 'आलू (Aloo)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 1650,
    benchmarkMinQuintal: 1250,
    benchmarkMaxQuintal: 1950,
    benchmarkYesterdayMaxQuintal: 2020,
    benchmarkArrivalsTonnes: 540,
    expectedYieldQuintalPerAcre: 120,
    aliases: ['potato', 'batata', 'aloo', 'alu', 'बटाटा', 'आलू', 'urulaikizhangu'],
    qualityParams: {
      goodGradeA: {
        en: 'Large Jyoti/Pukhraj (50mm+), smooth yellow/white skin, zero greening, firm.',
        mr: 'मोठा ज्योती/पुखराज (५० मिमी+), गुळगुळीत साल, हिरवेपणा नसलेला, घट्ट कडक बटाटा.',
        hi: 'बड़ा ज्योति/पुखराज 50 मिमी+, चिकना छिलका, बिना हरेपन वाला ठोस आलू।'
      },
      averageGradeB: {
        en: 'Medium table size, minimal mud, standard cold storage or fresh lot.',
        mr: 'मध्यम आकार, टेबल बटाटा, कमी माती, नेहमीच्या घरगुती वापरासाठी.',
        hi: 'मध्यम आकार, कम मिट्टी वाला, सामान्य घरेलू व थोक बिक्री।'
      },
      lowGradeC: {
        en: 'Small baby potato, light green tint, bruised or cut during harvesting.',
        mr: 'लहान आकाराचा (छर्री), हिरवट किंवा काढणीवेळी कापला गेलेला.',
        hi: 'छोटा (छर्री आलू), हरापन लिए हुए या कट-छट वाला।'
      }
    }
  },
  {
    key: 'GreenChilli',
    nameEn: 'Green Chilli',
    nameMr: 'हिरवी मिरची (Mirchi)',
    nameHi: 'हरी मिर्च (Hari Mirch)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 4600,
    benchmarkMinQuintal: 3400,
    benchmarkMaxQuintal: 5800,
    benchmarkYesterdayMaxQuintal: 6000,
    benchmarkArrivalsTonnes: 85,
    expectedYieldQuintalPerAcre: 45,
    aliases: ['green chilli', 'chilli', 'mirchi', 'hari mirch', 'मिरची', 'मिर्च', 'pachai milagai'],
    qualityParams: {
      goodGradeA: {
        en: 'Glossy dark green (G-4 / Jwala), unbroken stalks, firm, 8-12 cm, sharp pungency.',
        mr: 'चमकदार गडद हिरवी (ज्वाला / जी-४), देठ असलेली, टवटवीत, ८-१२ सेमी, तीव्र तिखट.',
        hi: 'चमकदार गहरी हरी, डंडी सहित, 8-12 सेमी लंबी, तेज तीखी और ताजी हरी मिर्च।'
      },
      averageGradeB: {
        en: 'Medium light green, mixed length, standard market lot.',
        mr: 'मध्यम फिकट हिरवी, मध्यम लांबी, नियमित बाजार समितीचा लॉट.',
        hi: 'मध्यम हरी, सामान्य तीखापन, थोक मंडी का नियमित माल।'
      },
      lowGradeC: {
        en: 'Turning reddish/yellow, stalk-less, wrinkled skin or soft.',
        mr: 'लालसर पडलेली, देठ तुटलेली, सुरकुतलेली किंवा मऊ झालेली.',
        hi: 'लाल/पीली पड़ती हुई, बिना डंडी, मुरझाई हुई मिर्च।'
      }
    }
  },
  {
    key: 'Ginger',
    nameEn: 'Ginger (Fresh)',
    nameMr: 'आले / अद्रक (Ale)',
    nameHi: 'अदरक (Adrak)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 7400,
    benchmarkMinQuintal: 5800,
    benchmarkMaxQuintal: 8900,
    benchmarkYesterdayMaxQuintal: 9200,
    benchmarkArrivalsTonnes: 60,
    expectedYieldQuintalPerAcre: 60,
    aliases: ['ginger', 'adrak', 'ale', 'आले', 'अदरक', 'inji'],
    qualityParams: {
      goodGradeA: {
        en: 'Bold fat rhizomes (Mahim/Varada), well-cleaned, golden-yellow skin, fiber-free.',
        mr: 'जाड गड्ड्यांचे महिम आले, स्वच्छ धुतलेले, सोनेरी साल, तंतू नसलेले.',
        hi: 'मोटी गांठदार अदरक, साफ-सुथरी, सुनहरी छिलके वाली, रसदार।'
      },
      averageGradeB: {
        en: 'Medium rhizomes, slight soil cling, standard kitchen grade.',
        mr: 'मध्यम आकाराचे गड्डे, हलकी माती, बाजारातील सरासरी माल.',
        hi: 'मध्यम गांठें, हल्की मिट्टी, सामान्य बाजार लॉट।'
      },
      lowGradeC: {
        en: 'Thin finger roots, bruised or shriveled, high fiber.',
        mr: 'बारीक काड्या, वाळलेले किंवा चोथा जास्त असलेले आले.',
        hi: 'पतली उंगलियां, मुरझाई हुई या अधिक रेशेदार अदरक।'
      }
    }
  },
  {
    key: 'Garlic',
    nameEn: 'Garlic',
    nameMr: 'लसूण (Lasun)',
    nameHi: 'लहसुन (Lahsun)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 11200,
    benchmarkMinQuintal: 8500,
    benchmarkMaxQuintal: 14500,
    benchmarkYesterdayMaxQuintal: 15200,
    benchmarkArrivalsTonnes: 120,
    expectedYieldQuintalPerAcre: 40,
    aliases: ['garlic', 'lasun', 'lahsun', 'लसूण', 'लहसुन', 'poondu'],
    qualityParams: {
      goodGradeA: {
        en: 'Big bold bulbs (Ooty/G-2), 40mm+, pure white tight cover, dry roots, pungent cloves.',
        mr: 'मोठा जाड लसूण (४० मिमी+), पांढराशुभ्र घट्ट पापुद्रा, भरदार पाकळ्या, कडक सुकलेला.',
        hi: 'बड़ा 40 मिमी+ बल्ब, दूधिया सफेद छिलका, ठोस कलियां, पूरी तरह सूखा।'
      },
      averageGradeB: {
        en: 'Medium 25-35mm, 8-12 cloves per bulb, firm white.',
        mr: 'मध्यम आकार २५-३५ मिमी, चांगल्या भरलेल्या पाकळ्या, घरगुती वापरास उत्तम.',
        hi: 'मध्यम आकार 25-35 मिमी, मजबूत कलियां, सामान्य थोक व्यापार।'
      },
      lowGradeC: {
        en: 'Small/desi, loose cloves, separated skins or damp.',
        mr: 'बारीक गावरान, पाकळ्या सुटलेल्या किंवा ओलसर असलेला माल.',
        hi: 'छोटा देशी लहसुन, खुली कलियां, छिलका उतरा हुआ।'
      }
    }
  },
  {
    key: 'Brinjal',
    nameEn: 'Brinjal (Eggplant)',
    nameMr: 'वांगी (Vangi)',
    nameHi: 'बैंगन (Baingan)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 2800,
    benchmarkMinQuintal: 1900,
    benchmarkMaxQuintal: 3600,
    benchmarkYesterdayMaxQuintal: 3800,
    benchmarkArrivalsTonnes: 75,
    expectedYieldQuintalPerAcre: 90,
    aliases: ['brinjal', 'eggplant', 'aubergine', 'baingan', 'vangi', 'वांगी', 'बैंगन', 'kathirikai'],
    qualityParams: {
      goodGradeA: {
        en: 'Spiny striped (Manjari/Varikatri) or deep purple glossy, fresh green calyx, seedless.',
        mr: 'काटेरी काटेदार (मांजरी गोटी), चकचकीत जांभळा/हिरवा, ताठा देठ, बिया नसलेले.',
        hi: 'चमकदार कांटेदार या गहरा बैंगनी, ताजी हरी डंडी, बिना बीजों का गूदेदार बैंगन।'
      },
      averageGradeB: {
        en: 'Medium size, glossy skin, standard open auction lot.',
        mr: 'मध्यम आकार, चांगला रंग, नियमित बाजारातील लॉट.',
        hi: 'मध्यम आकार, सामान्य चमक, रोजमर्रा की बिक्री।'
      },
      lowGradeC: {
        en: 'Over-mature with hard black seeds, dull skin, or fruit borer marks.',
        mr: 'जुनट झालेले, कडक बिया असलेले, सुरकुतलेले किंवा अळी लागलेले.',
        hi: 'पका हुआ, कड़े बीजों वाला, मुरझाया हुआ या कीड़े के दाग वाला।'
      }
    }
  },
  {
    key: 'Cabbage',
    nameEn: 'Cabbage',
    nameMr: 'कोबी (Kobi)',
    nameHi: 'पत्तागोभी (Patta Gobhi)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 1450,
    benchmarkMinQuintal: 950,
    benchmarkMaxQuintal: 1950,
    benchmarkYesterdayMaxQuintal: 2100,
    benchmarkArrivalsTonnes: 160,
    expectedYieldQuintalPerAcre: 140,
    aliases: ['cabbage', 'kobi', 'patta gobhi', 'कोबी', 'पत्तागोभी', 'muttaikose'],
    qualityParams: {
      goodGradeA: {
        en: 'Tight dense heads 1.0-1.5 kg, clean outer leaves, zero black rot or insect cuts.',
        mr: 'घट्ट भरलेला गड्डा १ ते १.५ किलो, ताजी हिरवी पाने, कीड व डाग नसलेला.',
        hi: 'ठोस कसा हुआ 1-1.5 किग्रा का बंधा, ताजे साफ पत्ते, बिना कीड़े वाला।'
      },
      averageGradeB: {
        en: 'Medium firmness, 0.8-1.2 kg, standard commercial market crate.',
        mr: 'मध्यम घट्ट गड्डा, नियमित आकाराचा बाजार लॉट.',
        hi: 'मध्यम कसाव, सामान्य आकार, थोक मंडी हेतु मानक।'
      },
      lowGradeC: {
        en: 'Loose fluffy heads, burst top, or yellowed outer leaves.',
        mr: 'सैल पोकळ गड्डा, फुटलेला किंवा पिवळी पडलेली पाने.',
        hi: 'ढीला पत्तागोभी, फटा हुआ या पीली पत्तियों वाला।'
      }
    }
  },
  {
    key: 'Cauliflower',
    nameEn: 'Cauliflower',
    nameMr: 'फ्लॉवर (Flower)',
    nameHi: 'फूलगोभी (Phool Gobhi)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 1850,
    benchmarkMinQuintal: 1200,
    benchmarkMaxQuintal: 2500,
    benchmarkYesterdayMaxQuintal: 2650,
    benchmarkArrivalsTonnes: 140,
    expectedYieldQuintalPerAcre: 110,
    aliases: ['cauliflower', 'flower', 'phool gobhi', 'phulgobhi', 'फ्लॉवर', 'फूलगोभी', 'kalingar'],
    qualityParams: {
      goodGradeA: {
        en: 'Snow-white compact curd, dense granules, surrounded by fresh turgid jacket leaves.',
        mr: 'बर्फासारखा पांढराशुभ्र घट्ट गड्डा, घट्ट दाणे, ताजी हिरवी पाने असलेला.',
        hi: 'बर्फ जैसा सफेद गठा हुआ फूल, कसा हुआ, ताजी हरी पत्तियों से घिरा हुआ।'
      },
      averageGradeB: {
        en: 'Off-white/creamy curd, medium firmness, standard trade lot.',
        mr: 'हलका पिवळसर/पांढरा, मध्यम घट्ट, बाजारातील नेहमीचा माल.',
        hi: 'हल्का क्रीम रंग, मध्यम कसाव, सामान्य बिक्री।'
      },
      lowGradeC: {
        en: 'Ricey / loose curd with protruding green bracts, brown spots.',
        mr: 'मोकळा झालेला गड्डा, दाणे सुटलेले, तपकिरी डाग पडलेला.',
        hi: 'बिखरा हुआ फूल, पीले/भूरे दाग, खुले हुए दाने।'
      }
    }
  },
  {
    key: 'Capsicum',
    nameEn: 'Capsicum (Shimla Mirch)',
    nameMr: 'शिमला मिरची (Dhobli Mirchi)',
    nameHi: 'शिमला मिर्च (Shimla Mirch)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 3800,
    benchmarkMinQuintal: 2600,
    benchmarkMaxQuintal: 5100,
    benchmarkYesterdayMaxQuintal: 5350,
    benchmarkArrivalsTonnes: 65,
    expectedYieldQuintalPerAcre: 80,
    aliases: ['capsicum', 'bell pepper', 'shimla mirch', 'dhobli mirchi', 'शिमला मिरची', 'शिमला मिर्च', 'ढोबळी मिरची'],
    qualityParams: {
      goodGradeA: {
        en: '4-lobed blocky shape, deep green waxy shine, thick fleshy walls, firm.',
        mr: 'चार कपांचे (४ लोब) चौकोनी, गडद हिरवे, जाड चकचकीत साल, टणक फळ.',
        hi: 'चौकोर 4-लोब आकार, गहरा हरा मोम जैसा चमकदार, मोटा गूदेदार छिलका।'
      },
      averageGradeB: {
        en: '3-lobed or slightly tapered, medium thickness, good green color.',
        mr: 'मध्यम आकार, ३ लोब, चांगली हिरवी शिमला मिरची.',
        hi: 'मध्यम आकार, 3-लोब, सामान्य बाजार गुणवत्ता।'
      },
      lowGradeC: {
        en: 'Sun-scalded, thin walls, deformed shape, or soft skin.',
        mr: 'ऊन लागून डाग पडलेली, बारीक साल, मऊ पडलेली शिमला.',
        hi: 'धूप से झुलसी, पतली दीवार, टेढ़ा आकार या मुरझाई हुई।'
      }
    }
  },
  {
    key: 'GreenPeas',
    nameEn: 'Green Peas (Matar)',
    nameMr: 'मटार (Matar)',
    nameHi: 'हरी मटर (Hari Matar)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 4800,
    benchmarkMinQuintal: 3500,
    benchmarkMaxQuintal: 6200,
    benchmarkYesterdayMaxQuintal: 6500,
    benchmarkArrivalsTonnes: 110,
    expectedYieldQuintalPerAcre: 35,
    aliases: ['green peas', 'matar', 'mutter', 'मटार', 'मटर', 'பட்டாணி'],
    qualityParams: {
      goodGradeA: {
        en: 'Well-filled pods (8-10 sweet tender bold seeds), vibrant green, crisp pod snap.',
        mr: 'भरलेली शेंग (८-१० गोड कोवळे दाणे), टवटवीत हिरवीगार, सहज फुटणारी.',
        hi: 'पूरी भरी हुई फलियां (8-10 मीठे मोटे दाने), गहरी हरी, ताजी कुरकुरी।'
      },
      averageGradeB: {
        en: '6-8 seeds per pod, medium fill, good sweetness.',
        mr: '६-८ दाण्यांची मध्यम शेंग, चांगला गोडवा, नेहमीचा माल.',
        hi: '6-8 दाने प्रति फली, मध्यम भराव, सामान्य थोक बिक्री।'
      },
      lowGradeC: {
        en: 'Flat unfilled pods (Popti), yellowing skin, starchy hard seeds.',
        mr: 'पोचट शेंगा (पोपटी), दाणे न भरलेली किंवा जून दाणे झालेली.',
        hi: 'चपटी कम दानों वाली फली, पीलापन लिए हुए या कड़े दाने।'
      }
    }
  },
  {
    key: 'BitterGourd',
    nameEn: 'Bitter Gourd (Karela)',
    nameMr: 'कारले (Karle)',
    nameHi: 'करेला (Karela)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 3200,
    benchmarkMinQuintal: 2200,
    benchmarkMaxQuintal: 4100,
    benchmarkYesterdayMaxQuintal: 4300,
    benchmarkArrivalsTonnes: 35,
    expectedYieldQuintalPerAcre: 65,
    aliases: ['bitter gourd', 'karela', 'karle', 'कारले', 'करेला', 'pavakkai'],
    qualityParams: {
      goodGradeA: {
        en: 'Dark green sharp continuous ridges, 15-20 cm, firm, no yellowing at tips.',
        mr: 'गडद हिरवे, टोकदार दातेरी साल, १५-२० सेमी, कडक, शेंड्याला पिवळेपणा नसलेले.',
        hi: 'गहरे हरे उभरे हुए कांटे, 15-20 सेमी लंबा, ठोस, बिना पीलेपन के।'
      },
      averageGradeB: {
        en: 'Medium light green, 10-15 cm, standard retail trade.',
        mr: 'मध्यम हिरवे कारले, १०-१५ सेमी, सर्वसामान्य बाजार दर्जा.',
        hi: 'मध्यम हरी, 10-15 सेमी, सामान्य खुदरा व थोक माल।'
      },
      lowGradeC: {
        en: 'Orange/yellow ripe tip with red seeds inside, curved or soft.',
        mr: 'पिकलेले पिवळे/केशरी पडलेले, आत लाल बिया असलेले कारले.',
        hi: 'पीला या नारंगी पका हुआ, अंदर लाल बीजों वाला, मुलायम।'
      }
    }
  },
  {
    key: 'BottleGourd',
    nameEn: 'Bottle Gourd (Lauki)',
    nameMr: 'दुधी भोपळा (Dudhi Bhopla)',
    nameHi: 'लौकी (Lauki / Ghiya)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 1600,
    benchmarkMinQuintal: 1100,
    benchmarkMaxQuintal: 2200,
    benchmarkYesterdayMaxQuintal: 2350,
    benchmarkArrivalsTonnes: 50,
    expectedYieldQuintalPerAcre: 150,
    aliases: ['bottle gourd', 'lauki', 'ghiya', 'dudhi', 'दुधी', 'लौकी', 'doodhi'],
    qualityParams: {
      goodGradeA: {
        en: 'Cylindrical uniform, tender pale green, smooth skin with soft hairs, fingernail pierces easily.',
        mr: 'सरळ दंडगोलाकार, कोवळा फिकट हिरवा, नखांनी सहज टोचता येणारी मऊ साल.',
        hi: 'एकसमान बेलनाकार, कोमल हल्की हरी, चिकनी पतली त्वचा, बिना कड़े बीजों की।'
      },
      averageGradeB: {
        en: 'Medium thick, 1.5-2.5 kg, standard commercial kitchen grade.',
        mr: 'मध्यम जाड दुधी, १.५-२.५ किलो, नियमित बाजाराचा माल.',
        hi: 'मध्यम मोटाई, 1.5-2.5 किग्रा, सामान्य मंडी लॉट।'
      },
      lowGradeC: {
        en: 'Bulbous end, hard woody skin, mature fibrous seeds inside.',
        mr: 'खालून फुगलेला, कडक निब्बर साल, आत जून बिया असलेला भोपळा.',
        hi: 'नीचे से फूला हुआ, कड़ी लकड़ी जैसी त्वचा, अंदर कड़े पके बीज।'
      }
    }
  },
  {
    key: 'CorianderLeaves',
    nameEn: 'Coriander Leaves (Cilantro)',
    nameMr: 'कोथिंबीर (Kothmir)',
    nameHi: 'हरा धनिया (Hara Dhaniya)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 3800,
    benchmarkMinQuintal: 2200,
    benchmarkMaxQuintal: 6500,
    benchmarkYesterdayMaxQuintal: 7000,
    benchmarkArrivalsTonnes: 40,
    expectedYieldQuintalPerAcre: 30,
    aliases: ['coriander', 'kothmir', 'kothimbir', 'dhaniya', 'hara dhaniya', 'कोथिंबीर', 'धनिया', 'kothamalli'],
    qualityParams: {
      goodGradeA: {
        en: 'Lush dark green bushy foliage, intense aroma, zero flowering stalks, roots intact & clean.',
        mr: 'गडद हिरवीगार टवटवीत पाने, उत्कृष्ट सुगंध, फुले नसलेली, स्वच्छ मुळे असलेली जुडी.',
        hi: 'हरी-भरी खुशबूदार पत्तियां, बिना फूल की डंडी वाली, ताजी बंधी हुई गड्डी।'
      },
      averageGradeB: {
        en: 'Medium green, light flowering initiation, standard bunch lot.',
        mr: 'मध्यम हिरवी, हलकी फुले येऊ लागलेली, बाजारातील नियमित जुडी.',
        hi: 'मध्यम हरी, हल्के फूल निकलते हुए, सामान्य मंडी गड्डी।'
      },
      lowGradeC: {
        en: 'Yellowing leaves, high moisture decay (gala), woody flowering stems.',
        mr: 'पिवळी पडलेली, पाणी लागून सडलेली (गाळ झालेली) किंवा लाकडी झालेली.',
        hi: 'पीली पत्तियां, पानी से सड़ी हुई या कड़े डंठल वाली।'
      }
    }
  },
  {
    key: 'FenugreekLeaves',
    nameEn: 'Fenugreek Leaves (Methi)',
    nameMr: 'मेथी भाजी (Methi)',
    nameHi: 'मेथी (Methi Saag)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 3400,
    benchmarkMinQuintal: 2000,
    benchmarkMaxQuintal: 5200,
    benchmarkYesterdayMaxQuintal: 5500,
    benchmarkArrivalsTonnes: 45,
    expectedYieldQuintalPerAcre: 35,
    aliases: ['fenugreek', 'methi', 'methi bhaji', 'मेथी', 'vendhayam'],
    qualityParams: {
      goodGradeA: {
        en: 'Tender broad green leaves (Kasuri/Pusa), 10-15 cm height, juicy stems, freshly harvested.',
        mr: 'कोवळी रुंद हिरवी पाने (कसुरी मेथी), १०-१५ सेमी उंची, रसरशीत देठ, ताजी जुडी.',
        hi: 'कोमल चौड़ी हरी पत्तियां, 10-15 सेमी ऊंचाई, रसीले डंठल, ताजी गड्डी।'
      },
      averageGradeB: {
        en: 'Medium leaf size, 15-20 cm, standard wholesale lot.',
        mr: 'मध्यम पानांची मेथी, १५-२० सेमी, नेहमीची बाजार जुडी.',
        hi: 'मध्यम पत्तियां, 15-20 सेमी, सामान्य थोक गड्डी।'
      },
      lowGradeC: {
        en: 'Fibrous hard stems, yellowing lower leaves, root rot symptoms.',
        mr: 'जाड लाकडी देठ, पिवळी पाने किंवा मुळांना सड लागलेली.',
        hi: 'कड़े डंठल, पीली पत्तियां या सड़ी हुई जड़ें।'
      }
    }
  },
  {
    key: 'Spinach',
    nameEn: 'Spinach (Palak)',
    nameMr: 'पालक (Palak)',
    nameHi: 'पालक (Palak)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 2100,
    benchmarkMinQuintal: 1400,
    benchmarkMaxQuintal: 3100,
    benchmarkYesterdayMaxQuintal: 3300,
    benchmarkArrivalsTonnes: 50,
    expectedYieldQuintalPerAcre: 50,
    aliases: ['spinach', 'palak', 'पालक', 'pasalai'],
    qualityParams: {
      goodGradeA: {
        en: 'Broad succulent dark green leaves, crisp thick veins, zero holes or yellow edges.',
        mr: 'रुंद रसरशीत गडद हिरवी पाने, टवटवीत देठ, कीड व पिवळेपणा नसलेला पालक.',
        hi: 'चौड़े रसीले गहरे हरे पत्ते, कुरकुरी नसें, बिना किसी छेद या पीलेपन के।'
      },
      averageGradeB: {
        en: 'Medium leaves, standard bundle size, good freshness.',
        mr: 'मध्यम आकाराची पाने, नियमित जुडीचा माल.',
        hi: 'मध्यम पत्ते, सामान्य ताजगी, थोक मंडी लॉट।'
      },
      lowGradeC: {
        en: 'Insect-eaten holes, yellow wilted edges, over-watered slimy leaves.',
        mr: 'अळीने खाल्लेली पाने, पिवळा पडलेला, पाणी जास्त होऊन कुजलेला.',
        hi: 'कीड़ों के खाए पत्ते, मुरझाया हुआ या चिपचिपा सड़ा हुआ।'
      }
    }
  },
  {
    key: 'ClusterBeans',
    nameEn: 'Cluster Beans (Gawar)',
    nameMr: 'गवार (Gawar)',
    nameHi: 'ग्वार फली (Gwar Phali)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 4500,
    benchmarkMinQuintal: 3100,
    benchmarkMaxQuintal: 6000,
    benchmarkYesterdayMaxQuintal: 6300,
    benchmarkArrivalsTonnes: 30,
    expectedYieldQuintalPerAcre: 35,
    aliases: ['cluster beans', 'gawar', 'gwar', 'gwar phali', 'गवार', 'ग्वार', 'kothavarangai'],
    qualityParams: {
      goodGradeA: {
        en: 'Desi tender slender pods, 6-8 cm, fiber-free snappy tip, vibrant green.',
        mr: 'गावरान कोवळी बारीक शेंग, ६-८ सेमी, शेंडा सहज मोडणारा, तंतू नसलेली.',
        hi: 'देसी कोमल पतली फली, 6-8 सेमी, बिना रेशे की कुरकुरी हरी ग्वार फली।'
      },
      averageGradeB: {
        en: 'Medium hybrid pods, standard tenderness, standard wholesale lot.',
        mr: 'मध्यम हायब्रिड गवार, मध्यम कोवळीक, नियमित बाजार लॉट.',
        hi: 'मध्यम हाइब्रिड फली, सामान्य कोमलता, थोक नीलामी।'
      },
      lowGradeC: {
        en: 'Thick tough pods with hard seeds, heavy side fibers.',
        mr: 'जाड निब्बर शेंगा, कडक बिया भरलेली, धागे सुटलेली गवार.',
        hi: 'मोटी कड़ी फली, कड़े बीजों वाली, अत्यधिक रेशेदार।'
      }
    }
  },
  {
    key: 'Cucumber',
    nameEn: 'Cucumber (Kakdi)',
    nameMr: 'काकडी (Kakdi)',
    nameHi: 'खीरा (Kheera)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 1900,
    benchmarkMinQuintal: 1300,
    benchmarkMaxQuintal: 2700,
    benchmarkYesterdayMaxQuintal: 2850,
    benchmarkArrivalsTonnes: 90,
    expectedYieldQuintalPerAcre: 100,
    aliases: ['cucumber', 'kheera', 'kakdi', 'काकडी', 'खीरा', 'vellarikkai'],
    qualityParams: {
      goodGradeA: {
        en: 'Straight cylindrical dark green (Gypsy/Malini), crisp, 18-22 cm, zero bitterness.',
        mr: 'सरळ दंडगोलाकार गडद हिरवी काकडी, कडक कुरकुरीत, कडू नसलेली, १८-२२ सेमी.',
        hi: 'सीधा बेलनाकार गहरा हरा खीरा, कुरकुरा, 18-22 सेमी, बिना कड़वेपन का।'
      },
      averageGradeB: {
        en: 'Light green or slight curve, medium crispness.',
        mr: 'फिकट हिरवी किंवा किंचित वाकडी काकडी, चांगला गोडवा.',
        hi: 'हल्का हरा, थोड़ा मुड़ा हुआ, सामान्य सलाद खीरा।'
      },
      lowGradeC: {
        en: 'Bulbous end with mature seeds, yellow skin patches, bitter.',
        mr: 'खालून फुगीर, पिवळे डाग पडलेली, बिया जून झालेली काकडी.',
        hi: 'मोटा फूला हुआ, पीले धब्बे वाला, कड़े बीजों वाला कड़वा खीरा।'
      }
    }
  },
  {
    key: 'Drumstick',
    nameEn: 'Drumstick (Moringa)',
    nameMr: 'शेवगा (Shevga)',
    nameHi: 'सहजन / मुनगा (Sahjan)',
    category: 'vegetables',
    categoryLabelEn: 'Vegetables',
    categoryLabelMr: 'भाज्या',
    categoryLabelHi: 'सब्जियां',
    benchmarkModalQuintal: 4800,
    benchmarkMinQuintal: 3200,
    benchmarkMaxQuintal: 6800,
    benchmarkYesterdayMaxQuintal: 7200,
    benchmarkArrivalsTonnes: 30,
    expectedYieldQuintalPerAcre: 60,
    aliases: ['drumstick', 'moringa', 'shevga', 'sahjan', 'munaga', 'शेवगा', 'सहजन', 'murungakkai'],
    qualityParams: {
      goodGradeA: {
        en: 'Ooty-1 / PKM-1 long slender straight pods (45-60 cm), rich green, tender pulp, no fiber.',
        mr: 'ओडीसी/पीकेएम-१ लांब सरळ शेंगा (४५-६० सेमी), गडद हिरव्या, भरपूर गर, तंतू नसलेला.',
        hi: 'लंबी सीधी हरी फलियां 45-60 सेमी, गूदेदार, कोमल, बिना कड़े रेशों की सहजन।'
      },
      averageGradeB: {
        en: '35-45 cm, medium thickness, good pulp content.',
        mr: '३५-४५ सेमी लांबी, मध्यम जाडी, बाजारातील नेहमीचा शेवगा.',
        hi: '35-45 सेमी, मध्यम मोटाई, सामान्य थोक बिक्री।'
      },
      lowGradeC: {
        en: 'Over-mature woody pods, bursting sides, hard dry seeds.',
        mr: 'जाड लाकडी झालेली शेंग, फुटलेली, कडक सुकलेल्या बिया असलेली.',
        hi: 'कड़ी लकड़ी जैसी फली, फटी हुई, कड़े सूखे बीजों वाली।'
      }
    }
  },

  // =========================================================================
  // 2. CEREALS & GRAINS (धान्य / अनाज)
  // =========================================================================
  {
    key: 'Wheat',
    nameEn: 'Wheat',
    nameMr: 'गहू (Gahu)',
    nameHi: 'गेहूं (Gehun)',
    category: 'grains',
    categoryLabelEn: 'Cereals & Grains',
    categoryLabelMr: 'धान्य',
    categoryLabelHi: 'अनाज',
    benchmarkModalQuintal: 2680,
    benchmarkMinQuintal: 2350,
    benchmarkMaxQuintal: 2950,
    benchmarkYesterdayMaxQuintal: 3050,
    benchmarkArrivalsTonnes: 850,
    expectedYieldQuintalPerAcre: 20,
    msp: 2275,
    aliases: ['wheat', 'gehun', 'gahu', 'गहू', 'गेहूं', 'godhumai'],
    qualityParams: {
      goodGradeA: {
        en: 'Sharbati / Lokwan bold golden lustrous grains, moisture <11%, zero weevils, high hectolitre weight.',
        mr: 'शरबती / लोकवन चमकदार टपोरे दाणे, ओलावा ११% पेक्षा कमी, कीड नसलेला, वजनदार गहू.',
        hi: 'शरबती/लोकवान चमकदार सुनहरे मोटे दाने, नमी 11% से कम, घुन रहित प्रीमियम गेहूं।'
      },
      averageGradeB: {
        en: 'Standard mill-grade (HD-2967/GW-496), clean, 12% moisture.',
        mr: 'मिलिंग ग्रेड (एचडी-२९६७), स्वच्छ, १२% ओलावा, नेहमीचा खात्रीशीर गहू.',
        hi: 'मिलिंग ग्रेड, साफ-सुथरा, सामान्य घरेलू व आटा मिल उपयोग।'
      },
      lowGradeC: {
        en: 'Broken grains, shrivelled, high moisture (>14%) or slight insect damage.',
        mr: 'बारीक चाळलेला, तुटलेला, जास्त ओलावा असलेला किंवा कीड लागलेला.',
        hi: 'टूटे-फूटे दाने, सिकुड़े हुए, अधिक नमी या कीट प्रभावित गेहूं।'
      }
    }
  },
  {
    key: 'Rice',
    nameEn: 'Paddy / Rice',
    nameMr: 'भात / तांदूळ (Bhat / Tandul)',
    nameHi: 'धान / चावल (Dhan / Chawal)',
    category: 'grains',
    categoryLabelEn: 'Cereals & Grains',
    categoryLabelMr: 'धान्य',
    categoryLabelHi: 'अनाज',
    benchmarkModalQuintal: 2450,
    benchmarkMinQuintal: 2183,
    benchmarkMaxQuintal: 3200,
    benchmarkYesterdayMaxQuintal: 3300,
    benchmarkArrivalsTonnes: 920,
    expectedYieldQuintalPerAcre: 28,
    msp: 2183,
    aliases: ['rice', 'paddy', 'dhan', 'chawal', 'bhat', 'tandul', 'भात', 'तांदूळ', 'धान', 'चावल', 'arisi'],
    qualityParams: {
      goodGradeA: {
        en: 'Slender aromatic Basmati/Indrayani/Kolam, fully mature golden husk, moisture <14%.',
        mr: 'इंद्रायणी / कोलम / बासमती सुवासिक बारीक दाणे, सोनेरी टरफल, १४% पेक्षा कमी ओलावा.',
        hi: 'बासमती/इंद्रायणी/कोलम सुगंधित लंबे दाने, सुनहरा छिलका, पूरी तरह सूखा धान।'
      },
      averageGradeB: {
        en: 'Common Grade A paddy (IR-64/PR-126), uniform milling recovery, standard MSP quality.',
        mr: 'सर्वसामान्य ग्रेड-ए भात (आयआर-६४), प्रमाणित हमीभाव दर्जा.',
        hi: 'सामान्य ग्रेड-ए धान, मिलिंग हेतु मानक उपज, सरकारी खरीद मानक।'
      },
      lowGradeC: {
        en: 'Chaffy unfilled grains, discolored black tip, moisture >17%.',
        mr: 'पोचट भात, काळे डाग असलेला, जास्त ओलावा असलेला माल.',
        hi: 'फोकल दाने, काला धब्बा, अत्यधिक नमी या भीगा हुआ धान।'
      }
    }
  },
  {
    key: 'Maize',
    nameEn: 'Maize (Corn)',
    nameMr: 'मका (Maka)',
    nameHi: 'मक्का (Makka)',
    category: 'grains',
    categoryLabelEn: 'Cereals & Grains',
    categoryLabelMr: 'धान्य',
    categoryLabelHi: 'अनाज',
    benchmarkModalQuintal: 2280,
    benchmarkMinQuintal: 1950,
    benchmarkMaxQuintal: 2480,
    benchmarkYesterdayMaxQuintal: 2550,
    benchmarkArrivalsTonnes: 680,
    expectedYieldQuintalPerAcre: 30,
    msp: 2090,
    aliases: ['maize', 'corn', 'maka', 'makka', 'मका', 'मक्का', 'makai', 'cholam'],
    qualityParams: {
      goodGradeA: {
        en: 'Yellow bold dent corn, moisture <12%, zero fungal mold or aflatoxin, high starch.',
        mr: 'पिवळाधमक टपोरा दाणा, ओलावा १२% पेक्षा कमी, बुरशी नसलेला, स्टार्चयुक्त.',
        hi: 'पीला चमकदार मोटा मक्का, नमी 12% से कम, फफूंद रहित, स्टार्च फैक्ट्रियों हेतु उत्तम।'
      },
      averageGradeB: {
        en: 'Standard poultry feed grade, 13-14% moisture, clean grain.',
        mr: 'पोल्ट्री फीड ग्रेड, १३-१४% ओलावा, स्वच्छ दाणे.',
        hi: 'पोल्ट्री फीड ग्रेड, 13-14% नमी, साफ मक्का दाने।'
      },
      lowGradeC: {
        en: 'Blackened germ, webbed by insects, high moisture (>16%).',
        mr: 'काळा पडलेला डोळा, कीड लागलेला, जास्त ओलावा असलेला.',
        hi: 'काला पड़ा हुआ, जाले लगा हुआ या अधिक नमी वाला मक्का।'
      }
    }
  },
  {
    key: 'Bajra',
    nameEn: 'Bajra (Pearl Millet)',
    nameMr: 'बाजरी (Bajri)',
    nameHi: 'बाजरा (Bajra)',
    category: 'grains',
    categoryLabelEn: 'Cereals & Grains',
    categoryLabelMr: 'धान्य',
    categoryLabelHi: 'अनाज',
    benchmarkModalQuintal: 2550,
    benchmarkMinQuintal: 2150,
    benchmarkMaxQuintal: 2850,
    benchmarkYesterdayMaxQuintal: 2950,
    benchmarkArrivalsTonnes: 210,
    expectedYieldQuintalPerAcre: 15,
    msp: 2500,
    aliases: ['bajra', 'bajri', 'pearl millet', 'बाजरी', 'बाजरा', 'kambu'],
    qualityParams: {
      goodGradeA: {
        en: 'Uniform grey-green bold grains (ICTP-8203/Pioneer), zero ergot fungal sclerotia, dry.',
        mr: 'हिरवट राखाडी टपोरे दाणे, अर्गट बुरशी नसलेली, कोरडी स्वच्छ बाजरी.',
        hi: 'मोटे धूसर-हरे दाने, अरगट रोग मुक्त, साफ सूखी पौष्टिक बाजरा।'
      },
      averageGradeB: {
        en: 'Standard domestic flour grade, minimal dust, 12% moisture.',
        mr: 'घरगुती पिठासाठी योग्य, स्वच्छ चाळलेली बाजरी.',
        hi: 'सामान्य आटा ग्रेड, कम धूल, मानक नमी।'
      },
      lowGradeC: {
        en: 'Shrivelled small grains, damp, presence of black ergot fungi.',
        mr: 'बारीक सुरकुतलेले दाणे, ओलसर किंवा काळे खडे असलेली.',
        hi: 'सिकुड़े दाने, नमी युक्त या फफूंद प्रभावित बाजरा।'
      }
    }
  },
  {
    key: 'Jowar',
    nameEn: 'Jowar (Sorghum)',
    nameMr: 'ज्वारी (Jwari / Shalu)',
    nameHi: 'ज्वार (Jowar)',
    category: 'grains',
    categoryLabelEn: 'Cereals & Grains',
    categoryLabelMr: 'धान्य',
    categoryLabelHi: 'अनाज',
    benchmarkModalQuintal: 3450,
    benchmarkMinQuintal: 2800,
    benchmarkMaxQuintal: 4200,
    benchmarkYesterdayMaxQuintal: 4400,
    benchmarkArrivalsTonnes: 180,
    expectedYieldQuintalPerAcre: 16,
    msp: 3180,
    aliases: ['jowar', 'jwari', 'sorghum', 'shalu', 'maldandi', 'ज्वारी', 'ज्वार', 'cholam'],
    qualityParams: {
      goodGradeA: {
        en: 'Maldandi (M 35-1) pearly white bold lustrous grain, sweet taste, moisture <10%.',
        mr: 'मालदांडी (एम ३५-१) मोत्यासारखी पांढरीशुभ्र टपोरी ज्वारी, गोड चव, कडक वाळलेली.',
        hi: 'मालदांडी मोती जैसी सफेद चमकदार ज्वार, मीठा स्वाद, नमी रहित प्रीमियम दाने।'
      },
      averageGradeB: {
        en: 'Hybrid white/cream grains, clean, regular roti grade.',
        mr: 'हायब्रिड पांढरी ज्वारी, नियमित भाकरीसाठी उत्तम.',
        hi: 'हाइब्रिड सफेद ज्वार, साफ-सुथरी, सामान्य घरेलू उपयोग।'
      },
      lowGradeC: {
        en: 'Rain-damaged black spots (Kajali), weathered or mouldy.',
        mr: 'पावसाने काळी पडलेली (काजळी आलेली), डागी ज्वारी.',
        hi: 'बारिश से काली पड़ी हुई, दागी या बदरंग ज्वार।'
      }
    }
  },

  // =========================================================================
  // 3. PULSES & LEGUMES (कडधान्य / दालें)
  // =========================================================================
  {
    key: 'Soybean',
    nameEn: 'Soybean',
    nameMr: 'सोयाबीन (Soybean)',
    nameHi: 'सोयाबीन (Soybean)',
    category: 'pulses',
    categoryLabelEn: 'Pulses & Oilseeds',
    categoryLabelMr: 'कडधान्य / गळीत',
    categoryLabelHi: 'दालें व तिलहन',
    benchmarkModalQuintal: 4680,
    benchmarkMinQuintal: 4200,
    benchmarkMaxQuintal: 4950,
    benchmarkYesterdayMaxQuintal: 5050,
    benchmarkArrivalsTonnes: 1100,
    expectedYieldQuintalPerAcre: 12,
    msp: 4892,
    aliases: ['soybean', 'soya bean', 'soya', 'सोयाबीन'],
    qualityParams: {
      goodGradeA: {
        en: 'Yellow bold round seed (JS-335/JS-9560), moisture 9-10%, oil content >19%, zero green or split seed.',
        mr: 'पिवळे टपोरे गोल दाणे (जेएस-३३५), ९-१०% ओलावा, १९% पेक्षा जास्त तेल, फुटलेला नसलेला.',
        hi: 'पीले गोल चमकदार दाने, नमी 9-10%, तेल की उच्च मात्रा, बिना दागी या टूटे दाने।'
      },
      averageGradeB: {
        en: '11-12% moisture, minor dirt admixture (<2%), standard plant delivery lot.',
        mr: '११-१२% ओलावा, २% पेक्षा कमी कचरा, ऑइल मिल खरेदीसाठी नियमित माल.',
        hi: '11-12% नमी, 2% कचरा, तेल मिलों हेतु मानक गुणवत्ता।'
      },
      lowGradeC: {
        en: 'Green immature seeds, high moisture (>14%), mud-coated or rotten.',
        mr: 'हिरवे कोवळे दाणे, माती लागलेले, १४% पेक्षा जास्त ओलावा असलेला सोयाबीन.',
        hi: 'हरे अपरिपक्व दाने, अधिक नमी, मिट्टी लगा हुआ या भीगा हुआ।'
      }
    }
  },
  {
    key: 'Chickpea',
    nameEn: 'Gram / Chickpea (Chana)',
    nameMr: 'हरभरा / चणा (Harbhara)',
    nameHi: 'चना (Chana)',
    category: 'pulses',
    categoryLabelEn: 'Pulses',
    categoryLabelMr: 'कडधान्य',
    categoryLabelHi: 'दालें',
    benchmarkModalQuintal: 5650,
    benchmarkMinQuintal: 4950,
    benchmarkMaxQuintal: 6200,
    benchmarkYesterdayMaxQuintal: 6350,
    benchmarkArrivalsTonnes: 480,
    expectedYieldQuintalPerAcre: 12,
    msp: 5440,
    aliases: ['chana', 'chickpea', 'gram', 'harbhara', 'हरभरा', 'चना', 'konda kadalai'],
    qualityParams: {
      goodGradeA: {
        en: 'Bold Vishal/Vijay or Dollar/Kabuli chana, uniform golden-brown, zero bruchid holes.',
        mr: 'टपोरा विशाल/विजय किंवा डॉलर काबुली चणा, एकसारखा रंग, कीड व छिद्रे नसलेला.',
        hi: 'मोटा विशाल/विजय या काबुली चना, चमकदार रंग, बिना किसी सुराख या घुन के।'
      },
      averageGradeB: {
        en: 'Standard Desi Chana, clean, moisture <11%, standard dal mill grade.',
        mr: 'नेहमीचा गावरान हरभरा, स्वच्छ, डाळ मिलसाठी खात्रीशीर दर्जा.',
        hi: 'मानक देसी चना, साफ-सुथरा, दाल मिलों हेतु उपयुक्त।'
      },
      lowGradeC: {
        en: 'Weevil-bored hollow grains, green wrinkled seeds, high dust.',
        mr: 'किडीने पोखरेलेला, बारीक सुरकुतलेला किंवा कचरा जास्त असलेला.',
        hi: 'घुन लगा हुआ खोखला चना, सिकुड़े हुए हरे दाने, अधिक कचरा।'
      }
    }
  },
  {
    key: 'Tur',
    nameEn: 'Pigeon Pea (Tur / Arhar)',
    nameMr: 'तूर (Tur)',
    nameHi: 'अरहर / तूर (Arhar / Tur)',
    category: 'pulses',
    categoryLabelEn: 'Pulses',
    categoryLabelMr: 'कडधान्य',
    categoryLabelHi: 'दालें',
    benchmarkModalQuintal: 9200,
    benchmarkMinQuintal: 7600,
    benchmarkMaxQuintal: 10400,
    benchmarkYesterdayMaxQuintal: 10600,
    benchmarkArrivalsTonnes: 340,
    expectedYieldQuintalPerAcre: 10,
    msp: 7000,
    aliases: ['tur', 'arhar', 'pigeon pea', 'red gram', 'तूर', 'अरहर', 'thuvaram paruppu'],
    qualityParams: {
      goodGradeA: {
        en: 'Bold red/white Marathwada/Gulbarga Tur (BSMR-736), uniform plump seed, moisture <10%.',
        mr: 'मराठवाडा/गुलबर्गा पांढरी/लाल टपोरी तूर, भरदार दाणे, १०% पेक्षा कमी ओलावा, उत्तम डाळ उतारा.',
        hi: 'मोटी लाल/सफेद अरहर (गुलबर्गा क्वालिटी), ठोस चमकदार दाने, उत्तम दाल उत्पादन।'
      },
      averageGradeB: {
        en: 'Standard Desi Tur, clean, minimal split grains, 11% moisture.',
        mr: 'नियमित गावरान तूर, स्वच्छ, डाळ मिल खरेदीसाठी योग्य.',
        hi: 'सामान्य देसी अरहर, साफ, मानक नमी।'
      },
      lowGradeC: {
        en: 'Bruchid insect holes, pod borer damaged, discolored or shrivelled.',
        mr: 'अळीने खाल्लेली, छिद्र पडलेली, रंग उडालेली किंवा सुरकुतलेली तूर.',
        hi: 'घुन लगा हुआ, कीड़ों का खाया हुआ या बदरंग दाने।'
      }
    }
  },
  {
    key: 'Moong',
    nameEn: 'Green Gram (Moong)',
    nameMr: 'मूग (Moong)',
    nameHi: 'मूंग (Moong)',
    category: 'pulses',
    categoryLabelEn: 'Pulses',
    categoryLabelMr: 'कडधान्य',
    categoryLabelHi: 'दालें',
    benchmarkModalQuintal: 8100,
    benchmarkMinQuintal: 6900,
    benchmarkMaxQuintal: 8900,
    benchmarkYesterdayMaxQuintal: 9100,
    benchmarkArrivalsTonnes: 140,
    expectedYieldQuintalPerAcre: 8,
    msp: 8558,
    aliases: ['moong', 'mung', 'green gram', 'मूग', 'मूंग', 'pasi paruppu'],
    qualityParams: {
      goodGradeA: {
        en: 'Bold shiny dark green grains, uniform size, high germination & protein, zero weevils.',
        mr: 'चमकदार गडद हिरवे टपोरे दाणे, एकसारखा आकार, कीड नसलेला स्वच्छ मूग.',
        hi: 'चमकदार गहरे हरे मोटे दाने, एकसमान, घुन रहित प्रीमियम मूंग।'
      },
      averageGradeB: {
        en: 'Standard green gram, slight size variation, ideal for dal milling.',
        mr: 'मध्यम हिरवा मूग, नेहमीचा बाजार समिती लॉट.',
        hi: 'सामान्य हरा मूंग, दाल मिल हेतु मानक।'
      },
      lowGradeC: {
        en: 'Dull brown/yellowish seeds, rain damaged or weevil attacked.',
        mr: 'पावसाने काळा किंवा पिवळा पडलेला, सुरकुतलेला मूग.',
        hi: 'बारिश से बदरंग, सिकुड़ा हुआ या कीड़ा लगा हुआ मूंग।'
      }
    }
  },
  {
    key: 'Urad',
    nameEn: 'Black Gram (Urad)',
    nameMr: 'उडीद (Udid)',
    nameHi: 'उड़द (Urad)',
    category: 'pulses',
    categoryLabelEn: 'Pulses',
    categoryLabelMr: 'कडधान्य',
    categoryLabelHi: 'दालें',
    benchmarkModalQuintal: 7800,
    benchmarkMinQuintal: 6400,
    benchmarkMaxQuintal: 8600,
    benchmarkYesterdayMaxQuintal: 8850,
    benchmarkArrivalsTonnes: 110,
    expectedYieldQuintalPerAcre: 8,
    msp: 6950,
    aliases: ['urad', 'udid', 'black gram', 'उडीद', 'उड़द', 'ulutham paruppu'],
    qualityParams: {
      goodGradeA: {
        en: 'Jet black bold shiny grain (TAU-1), bright white germ interior, moisture <10%.',
        mr: 'काळाभोर टपोरा चमकदार उडीद (टीएयू-१), आतून पांढराशुभ्र, स्वच्छ कोरडा.',
        hi: 'जेट ब्लैक चमकदार मोटा उड़द, अंदर से सफेद, नमी रहित प्रीमियम दाने।'
      },
      averageGradeB: {
        en: 'Standard commercial black gram, clean, minimal broken seeds.',
        mr: 'नियमित बाजारातील उडीद, डाळ मिल व पापड उद्योगासाठी योग्य.',
        hi: 'सामान्य उड़द, साफ-सुथरा, पापड़ व दाल उद्योग हेतु उपयुक्त।'
      },
      lowGradeC: {
        en: 'Reddish/brown discolored, mud-coated or hollow grains.',
        mr: 'लालसर पडलेला, माती लागलेला किंवा किडीने पोखरेलेला उडीद.',
        hi: 'लाल/भूरा बदरंग, मिट्टी लगा हुआ या खोखला उड़द।'
      }
    }
  },

  // =========================================================================
  // 4. COMMERCIAL & CASH CROPS (नगदी व औद्योगिक पिके)
  // =========================================================================
  {
    key: 'Cotton',
    nameEn: 'Cotton (Kapas)',
    nameMr: 'कापूस (Kapus)',
    nameHi: 'कपास (Kapas)',
    category: 'cash_crops',
    categoryLabelEn: 'Commercial & Fibres',
    categoryLabelMr: 'नगदी व फायबर पिके',
    categoryLabelHi: 'व्यावसायिक व रेशेदार',
    benchmarkModalQuintal: 7420,
    benchmarkMinQuintal: 6700,
    benchmarkMaxQuintal: 7950,
    benchmarkYesterdayMaxQuintal: 8100,
    benchmarkArrivalsTonnes: 780,
    expectedYieldQuintalPerAcre: 10,
    msp: 7121,
    aliases: ['cotton', 'kapas', 'kapus', 'कापूस', 'कपास', 'paruthi'],
    qualityParams: {
      goodGradeA: {
        en: 'Long staple (29-31mm, Shankar-6/Bunny), bright snow-white, moisture <8%, zero yellow staining/leaf trash.',
        mr: 'लांब धागा (२९-३१ मिमी), पांढराशुभ्र, ओलावा ८% पेक्षा कमी, कवडी व काडीकचरा नसलेला.',
        hi: 'लंबा रेशा (29-31 मिमी शंकर-6), दूधिया सफेद, नमी 8% से कम, पत्ती व कचरा रहित कपास।'
      },
      averageGradeB: {
        en: 'Medium staple 27-28mm, clean white, moisture 8-10%, ginning standard.',
        mr: 'मध्यम धागा २७-२८ मिमी, स्वच्छ पांढरा, जिनिंगसाठी प्रमाणित माल.',
        hi: 'मध्यम रेशा 27-28 मिमी, साफ सफेद, जिनिंग मिलों हेतु मानक।'
      },
      lowGradeC: {
        en: 'Yellow stained (Kavdi), high trash (>5%), moisture >12% or rain wet.',
        mr: 'पिवळा पडलेला (कवडी), कचरा जास्त असलेला, पावसाने भिजलेला कापूस.',
        hi: 'पीला दागदार (कवड़ी), कचरा युक्त या बारिश से भीगा हुआ कपास।'
      }
    }
  },
  {
    key: 'Sugarcane',
    nameEn: 'Sugarcane',
    nameMr: 'ऊस (Oos)',
    nameHi: 'गन्ना (Ganna)',
    category: 'cash_crops',
    categoryLabelEn: 'Cash Crops',
    categoryLabelMr: 'नगदी पिके',
    categoryLabelHi: 'नकदी फसलें',
    benchmarkModalQuintal: 3450,
    benchmarkMinQuintal: 3150,
    benchmarkMaxQuintal: 3750,
    benchmarkYesterdayMaxQuintal: 3800,
    benchmarkArrivalsTonnes: 3200,
    expectedYieldQuintalPerAcre: 450,
    msp: 3400,
    aliases: ['sugarcane', 'cane', 'oos', 'ganna', 'ऊस', 'गन्ना', 'karumbu'],
    qualityParams: {
      goodGradeA: {
        en: 'Co-86032 / Co-0238 thick juicy solid canes, sugar recovery >12.5%, freshly cut within 24 hours.',
        mr: 'को-८६०३२ / को-०२३८ जाड भरीव रसरशीत कांड्या, साखर उतारा १२.५%+, २४ तासांत तोडलेला ऊस.',
        hi: 'को-86032/को-0238 मोटा रसीला ठोस गन्ना, 12.5%+ चीनी परता, ताजा कटा हुआ।'
      },
      averageGradeB: {
        en: 'Commercial sugar factory delivery, 11-12% recovery, clean stripped.',
        mr: 'कारखान्यासाठी योग्य, स्वच्छ पाचट काढलेला, ११-१२% साखर उतारा.',
        hi: 'चीनी मिल आपूर्ति मानक, साफ छिला हुआ, 11-12% रिकवरी।'
      },
      lowGradeC: {
        en: 'Pithy hollow dry canes, delayed crushing (>72h), high mud/trash.',
        mr: 'पोकळ पडलेला, उशिरा गाळपास गेलेला, वाळलेला किंवा पाचटयुक्त ऊस.',
        hi: 'खोखला सूखा गन्ना, कटाई के 72 घंटे बाद बासी हुआ, अधिक कचरा।'
      }
    }
  },

  // =========================================================================
  // 5. OILSEEDS (गळीत धान्य / तिलहन)
  // =========================================================================
  {
    key: 'Groundnut',
    nameEn: 'Groundnut (Peanut)',
    nameMr: 'भुईमूग / शेंगदाणा (Bhuimug)',
    nameHi: 'मूंगफली (Moongphali)',
    category: 'oilseeds',
    categoryLabelEn: 'Oilseeds',
    categoryLabelMr: 'गळीत धान्य',
    categoryLabelHi: 'तिलहन',
    benchmarkModalQuintal: 6850,
    benchmarkMinQuintal: 5900,
    benchmarkMaxQuintal: 7600,
    benchmarkYesterdayMaxQuintal: 7800,
    benchmarkArrivalsTonnes: 260,
    expectedYieldQuintalPerAcre: 18,
    msp: 6377,
    aliases: ['groundnut', 'peanut', 'bhuimug', 'shengdana', 'moongphali', 'भुईमूग', 'शेंगदाणा', 'मूंगफली', 'verkadalai'],
    qualityParams: {
      goodGradeA: {
        en: 'Bold 2-kernel pods (TAG-24/Western), clean white shell, shelling recovery >72%, oil >48%.',
        mr: 'टपोरी दोन दाण्यांची शेंग (टीएजी-२४), पांढरे स्वच्छ टरफल, दाणा उतारा ७२%+, ४८% तेल.',
        hi: 'मोटी 2-दानों वाली फली, साफ सफेद छिलका, 72%+ दाना रिकवरी, उच्च तेल मात्रा।'
      },
      averageGradeB: {
        en: 'Standard commercial pods, moisture <9%, good seed fill.',
        mr: 'नियमित बाजारातील भुईमूग, कोरडी भरलेली शेंग.',
        hi: 'सामान्य व्यापार ग्रेड, 9% से कम नमी, अच्छा दाना भराव।'
      },
      lowGradeC: {
        en: 'Pop/unfilled shells, blackened mouldy pods, high sand/soil admixture.',
        mr: 'पोचट शेंगा (पॉप), काळी पडलेली किंवा माती जास्त असलेली.',
        hi: 'खोखली फली, काली फफूंद लगी या अत्यधिक मिट्टी वाली मूंगफली।'
      }
    }
  },
  {
    key: 'Mustard',
    nameEn: 'Mustard (Sarson)',
    nameMr: 'मोहरी (Mohari)',
    nameHi: 'सरसों / राई (Sarson / Rai)',
    category: 'oilseeds',
    categoryLabelEn: 'Oilseeds',
    categoryLabelMr: 'गळीत धान्य',
    categoryLabelHi: 'तिलहन',
    benchmarkModalQuintal: 5750,
    benchmarkMinQuintal: 5350,
    benchmarkMaxQuintal: 6150,
    benchmarkYesterdayMaxQuintal: 6250,
    benchmarkArrivalsTonnes: 510,
    expectedYieldQuintalPerAcre: 9,
    msp: 5650,
    aliases: ['mustard', 'sarson', 'rai', 'mohari', 'मोहरी', 'सरसों', 'राई', 'kadugu'],
    qualityParams: {
      goodGradeA: {
        en: 'Bold yellow/black grain, oil content >42%, moisture <8%, pure seed.',
        mr: 'टपोरी भरदार मोहरी, ४२% पेक्षा जास्त तेल, ८% पेक्षा कमी ओलावा, स्वच्छ.',
        hi: 'मोटे चमकदार दाने, तेल 42% से अधिक, नमी 8% से कम, कचरा रहित सरसों।'
      },
      averageGradeB: {
        en: 'Standard 40% oil, 8-9% moisture, commercial oil expeller grade.',
        mr: '४०% तेल उतारा, तेल गिरणीसाठी खात्रीशीर माल.',
        hi: '40% तेल रिकवरी, तेल मिलों हेतु मानक गुणवत्ता।'
      },
      lowGradeC: {
        en: 'High moisture (>11%), shrivelled seeds, presence of Argemone weeds.',
        mr: 'ओलावा जास्त असलेला, बारीक दाणे किंवा तण बिया मिसळलेली.',
        hi: 'अधिक नमी, सिकुड़े दाने या सत्यानाशी (आर्जीमोन) बीज मिला हुआ।'
      }
    }
  },

  // =========================================================================
  // 6. SPICES & CONDIMENTS (मसाले / मसाले)
  // =========================================================================
  {
    key: 'Turmeric',
    nameEn: 'Turmeric',
    nameMr: 'हळद (Halad)',
    nameHi: 'हल्दी (Haldi)',
    category: 'spices',
    categoryLabelEn: 'Spices',
    categoryLabelMr: 'मसाले पिके',
    categoryLabelHi: 'मसाले',
    benchmarkModalQuintal: 9150,
    benchmarkMinQuintal: 7900,
    benchmarkMaxQuintal: 10200,
    benchmarkYesterdayMaxQuintal: 10500,
    benchmarkArrivalsTonnes: 380,
    expectedYieldQuintalPerAcre: 25,
    msp: 8200,
    aliases: ['turmeric', 'halad', 'haldi', 'हळद', 'हल्दी', 'manjal'],
    qualityParams: {
      goodGradeA: {
        en: 'Salem / Nizamabad double-polished finger (Gatta/Finger), deep orange interior, curcumin >3.5%.',
        mr: 'राजापुरी / सेलम डबल पॉलिश हळकुंड, आतून गडद भगवा-पिवळा, कर्क्युमिन ३.५%+, टणक खणखणीत.',
        hi: 'सलेम/निजामाबाद डबल पॉलिश फिंगर, गहरा नारंगी गूदा, करक्यूमिन 3.5% से अधिक।'
      },
      averageGradeB: {
        en: 'Single polished bulb/finger, good yellow color, standard masala grade.',
        mr: 'सिंगल पॉलिश हळद, चांगला पिवळा रंग, मसाला उत्पादकांसाठी उत्तम.',
        hi: 'सिंगल पॉलिश, अच्छा पीला रंग, मसाला पिसाई हेतु मानक।'
      },
      lowGradeC: {
        en: 'Unpolished rough fingers, insect damage, fungal rot, or high moisture.',
        mr: 'कच्ची बिनपॉलिश हळद, किडलेली किंवा पोकळ झालेली हळकुंड.',
        hi: 'बिना पॉलिश, कीड़ा लगा हुआ, फफूंद युक्त या खोखली गांठें।'
      }
    }
  },
  {
    key: 'RedChilliDry',
    nameEn: 'Dry Red Chilli',
    nameMr: 'सुकी लाल मिरची (Suki Mirchi)',
    nameHi: 'सूखी लाल मिर्च (Lal Mirch)',
    category: 'spices',
    categoryLabelEn: 'Spices',
    categoryLabelMr: 'मसाले',
    categoryLabelHi: 'मसाले',
    benchmarkModalQuintal: 18500,
    benchmarkMinQuintal: 14000,
    benchmarkMaxQuintal: 23500,
    benchmarkYesterdayMaxQuintal: 24200,
    benchmarkArrivalsTonnes: 210,
    expectedYieldQuintalPerAcre: 15,
    aliases: ['red chilli', 'dry chilli', 'lal mirch', 'suki mirchi', 'byadgi', 'teja', 'सुकी मिरची', 'लाल मिर्च'],
    qualityParams: {
      goodGradeA: {
        en: 'Byadgi / Teja deep ruby-red wrinkled pod, stalk attached, high ASTA color value >120, moisture <10%.',
        mr: 'ब्याडगी / तेजा गडद लाल सुरकुतलेली, देठ असलेली, उच्च रंग मूल्य (अस्टा १२०+), तिखट.',
        hi: 'ब्याडगी/तेजा गहरा लाल रंग, चमकदार छिलका, डंडी सहित, उच्चतम रंग व तीखापन।'
      },
      averageGradeB: {
        en: 'Guntur medium red, uniform drying, standard masala blending grade.',
        mr: 'गुंटूर मध्यम लाल, चांगली वाळलेली, मसाला बनवण्यासाठी योग्य.',
        hi: 'गुंटूर लाल मिर्च, अच्छी सूखी हुई, मसाला मिलों हेतु मानक।'
      },
      lowGradeC: {
        en: 'Whitish discolored pods (Tala), broken stalks, damp or moldy.',
        mr: 'पांढरी पडलेली (ताळा), बुरशी लागलेली किंवा ओलसर मिरची.',
        hi: 'सफेद धब्बे वाली, टूटी हुई डंडी, फफूंद लगी या सीली हुई मिर्च।'
      }
    }
  },

  // =========================================================================
  // 7. FRUITS (फळे / फल)
  // =========================================================================
  {
    key: 'Pomegranate',
    nameEn: 'Pomegranate (Anar)',
    nameMr: 'डाळिंब (Dalimb)',
    nameHi: 'अनार (Anar)',
    category: 'fruits',
    categoryLabelEn: 'Fruits',
    categoryLabelMr: 'फळे',
    categoryLabelHi: 'फल',
    benchmarkModalQuintal: 8500,
    benchmarkMinQuintal: 5500,
    benchmarkMaxQuintal: 13500,
    benchmarkYesterdayMaxQuintal: 14200,
    benchmarkArrivalsTonnes: 75,
    expectedYieldQuintalPerAcre: 60,
    aliases: ['pomegranate', 'dalimb', 'anar', 'डाळिंब', 'अनार', 'madhulai'],
    qualityParams: {
      goodGradeA: {
        en: 'Bhagwa export grade 300g+, deep saffron-red glossy skin, ruby-red soft sweet arils, zero oil spot (Telya).',
        mr: 'भगवा एक्सपोर्ट ग्रेड ३०० ग्रॅम+, चमकदार लाल साल, रबी-लाल मऊ गोड दाणे, तेल्या डाग नसलेले.',
        hi: 'भगवा एक्सपोर्ट 300 ग्राम+, चमकदार लाल छिलका, गहरे लाल मीठे रसीले दाने, तेलिया रोग रहित।'
      },
      averageGradeB: {
        en: '200-280g, good red flush, sweet arils, ideal for domestic wholesale.',
        mr: '२००-२८० ग्रॅम, चांगला लाल रंग, गोड दाणे, स्थानिक बाजारासाठी उत्तम.',
        hi: '200-280 ग्राम, अच्छा लाल रंग, मीठा स्वाद, घरेलू मंडी व्यापार।'
      },
      lowGradeC: {
        en: '<180g, sun-burnt rind, pinprick thrips marks, pale seeds.',
        mr: 'लहान आकार, ऊन लागलेली साल, डाग पडलेले किंवा फिकट दाणे.',
        hi: 'छोटा आकार (<180 ग्राम), धूप से जला छिलका या धब्बेदार दाने।'
      }
    }
  },
  {
    key: 'Banana',
    nameEn: 'Banana',
    nameMr: 'केळी (Keli)',
    nameHi: 'केला (Kela)',
    category: 'fruits',
    categoryLabelEn: 'Fruits',
    categoryLabelMr: 'फळे',
    categoryLabelHi: 'फल',
    benchmarkModalQuintal: 1850,
    benchmarkMinQuintal: 1200,
    benchmarkMaxQuintal: 2500,
    benchmarkYesterdayMaxQuintal: 2650,
    benchmarkArrivalsTonnes: 450,
    expectedYieldQuintalPerAcre: 300,
    aliases: ['banana', 'keli', 'kela', 'केळी', 'केला', 'vazhaipazham'],
    qualityParams: {
      goodGradeA: {
        en: 'Grand Naine (G-9) export bunch 25kg+, uniform clean green fingers, 7-8 inch length, zero scuffs.',
        mr: 'ग्रँड नैन (जी-९) २५ किलो+ घड, स्वच्छ हिरवीगार एकसारखी बोटे, ७-८ इंच लांब, चट्टे नसलेली.',
        hi: 'ग्रैंड नैन (जी-9) 25 किग्रा+ घार, 7-8 इंच लंबी बेदाग हरी उंगलियां, निर्यात गुणवत्ता।'
      },
      averageGradeB: {
        en: '18-22 kg bunch, healthy fruit size, good ripening grade.',
        mr: '१८-२२ किलोचा घड, नियमित आकाराची चांगली केळी.',
        hi: '18-22 किग्रा घार, अच्छा फल आकार, सामान्य थोक व्यापार।'
      },
      lowGradeC: {
        en: '<15 kg bunch, thrips spotting, crooked or bruised fingers.',
        mr: 'लहान घड, डाग पडलेली, वाकडी किंवा खरचटलेली केळी.',
        hi: 'छोटा घार (<15 किग्रा), धब्बेदार या खरोंच लगे हुए केले।'
      }
    }
  },
  {
    key: 'Grapes',
    nameEn: 'Grapes (Table / Wine)',
    nameMr: 'द्राक्षे (Draksha)',
    nameHi: 'अंगूर (Angoor)',
    category: 'fruits',
    categoryLabelEn: 'Fruits',
    categoryLabelMr: 'फळे',
    categoryLabelHi: 'फल',
    benchmarkModalQuintal: 5800,
    benchmarkMinQuintal: 3800,
    benchmarkMaxQuintal: 9200,
    benchmarkYesterdayMaxQuintal: 9600,
    benchmarkArrivalsTonnes: 180,
    expectedYieldQuintalPerAcre: 90,
    aliases: ['grapes', 'draksha', 'angoor', 'द्राक्षे', 'अंगूर', 'thiratchai'],
    qualityParams: {
      goodGradeA: {
        en: 'Thompson / Manik Chaman bold elongated berries (18mm+), amber-green translucent, brix >18, zero cracking.',
        mr: 'थॉमसन / माणिक चमन टपोरे मणी (१८ मिमी+), सोनेरी हिरवा रंग, १८ ब्रिक्सपेक्षा जास्त साखर, न तडकलेले.',
        hi: 'थॉमसन/माणिक चमन 18 मिमी+ लंबे दाने, सुनहरे-हरे चमकदार, 18+ ब्रिक्स मिठास, बिना फटे।'
      },
      averageGradeB: {
        en: '15-17mm berries, uniform bunches, good domestic table quality.',
        mr: '१५-१७ मिमी मणी, व्यवस्थित घड, स्थानिक बाजारासाठी उत्तम.',
        hi: '15-17 मिमी दाने, साफ गुच्छे, घरेलू बाजार हेतु मानक।'
      },
      lowGradeC: {
        en: 'Loose fallen berries (Gardi), water-berry softness, powdery mildew trace.',
        mr: 'घडातून गळलेले मणी (गळ), मऊ पडलेले किंवा बुरशी डाग असलेले.',
        hi: 'झड़े हुए ढीले दाने, मुलायम पानी भरे या फफूंद प्रभावित अंगूर।'
      }
    }
  },
  {
    key: 'Papaya',
    nameEn: 'Papaya',
    nameMr: 'पपई (Papai)',
    nameHi: 'पपीता (Papita)',
    category: 'fruits',
    categoryLabelEn: 'Fruits',
    categoryLabelMr: 'फळे',
    categoryLabelHi: 'फल',
    benchmarkModalQuintal: 1750,
    benchmarkMinQuintal: 1100,
    benchmarkMaxQuintal: 2400,
    benchmarkYesterdayMaxQuintal: 2550,
    benchmarkArrivalsTonnes: 120,
    expectedYieldQuintalPerAcre: 350,
    aliases: ['papaya', 'papai', 'papita', 'पपई', 'पपीता', 'pappali'],
    qualityParams: {
      goodGradeA: {
        en: 'Taiwan Red Lady 786, firm 1.5-2.0 kg, smooth yellow-green turn, thick deep red-orange flesh.',
        mr: 'तैवान रेड लेडी ७८६, घट्ट १.५-२ किलो, फिकट पिवळा टर्न, गडद लाल गर, गोड.',
        hi: 'ताइवान रेड लेडी 786, 1.5-2 किग्रा ठोस, पीला-हरा टर्न, गहरा लाल-नारंगी मीठा गूदा।'
      },
      averageGradeB: {
        en: '1.2-1.8 kg, good sweetness, standard transport grade.',
        mr: '१.२-१.८ किलो, चांगला गोडवा, वाहतुकीस योग्य घट्ट पपई.',
        hi: '1.2-1.8 किग्रा, अच्छी मिठास, लंबी दूरी के परिवहन हेतु उपयुक्त।'
      },
      lowGradeC: {
        en: 'Misshapen, anthracnose fruit rot spots, over-soft.',
        mr: 'वाकडा आकार, काळे ठिपके (अँथ्रॅकनोज) किंवा जास्त पिकलेली मऊ पपई.',
        hi: 'असम आकार, काले धब्बे या अधिक पकी हुई मुलायम पपीता।'
      }
    }
  },
  {
    key: 'Mango',
    nameEn: 'Mango (Hapus / Kesar)',
    nameMr: 'आंबा (Hapus / Kesar)',
    nameHi: 'आम (Aam / Kesar)',
    category: 'fruits',
    categoryLabelEn: 'Fruits',
    categoryLabelMr: 'फळे',
    categoryLabelHi: 'फल',
    benchmarkModalQuintal: 8200,
    benchmarkMinQuintal: 4500,
    benchmarkMaxQuintal: 15500,
    benchmarkYesterdayMaxQuintal: 16200,
    benchmarkArrivalsTonnes: 210,
    expectedYieldQuintalPerAcre: 50,
    aliases: ['mango', 'aam', 'amba', 'hapus', 'alphonso', 'kesar', 'आंबा', 'आम', 'मांगा'],
    qualityParams: {
      goodGradeA: {
        en: 'GI Alphonso / Gir Kesar 250g+, uniform naturally ripened golden glow, intoxicating aroma, fiberless pulp.',
        mr: 'हापूस / केशर २५० ग्रॅम+, नैसर्गिक पिकलेला सोनेरी रंग, मनमोहक सुगंध, मऊ गर.',
        hi: 'अल्फांसो/गीर केसर 250 ग्राम+, प्राकृतिक रूप से पका सुनहरा आम, सुगंधित, रेशारहित।'
      },
      averageGradeB: {
        en: '200-240g, clean skin, good sweetness, commercial box grade.',
        mr: '२००-२४० ग्रॅम, स्वच्छ साल, पेटीतील उत्तम आंबा.',
        hi: '200-240 ग्राम, साफ छिलका, अच्छी मिठास, बॉक्स पैकिंग।'
      },
      lowGradeC: {
        en: '<180g, spongy tissue damage, fruit fly pinprick or sap-burned skin.',
        mr: 'बारीक आंबा, आतून पोचा पडलेला किंवा चीक लागून काळा पडलेला.',
        hi: 'छोटा आकार (<180 ग्राम), अंदर से स्पंजी खराबी या दागी छिलका।'
      }
    }
  }
];

// Quick lookup map by normalized key
export const CROP_BY_KEY: Record<string, CropMasterRecord> = {};
for (const crop of ALL_INDIAN_CROPS) {
  CROP_BY_KEY[crop.key] = crop;
}

// Normalized resolver handling multi-lingual and alias search
export function resolveCropMaster(inputName: string): CropMasterRecord {
  const clean = (inputName || '').toLowerCase().trim();

  // 1. Direct key match
  for (const crop of ALL_INDIAN_CROPS) {
    if (crop.key.toLowerCase() === clean) return crop;
  }

  // 2. Alias matching
  for (const crop of ALL_INDIAN_CROPS) {
    for (const alias of crop.aliases) {
      if (clean.includes(alias) || alias.includes(clean)) {
        return crop;
      }
    }
  }

  // 3. Substring match on localized names
  for (const crop of ALL_INDIAN_CROPS) {
    if (
      crop.nameEn.toLowerCase().includes(clean) ||
      crop.nameMr.includes(clean) ||
      crop.nameHi.includes(clean)
    ) {
      return crop;
    }
  }

  // Default fallback to Ladyfinger or Onion
  return CROP_BY_KEY['Ladyfinger'] || ALL_INDIAN_CROPS[0];
}

// Group crops by category for dropdowns & filters
export const CROP_CATEGORIES: { id: CropCategory; labelEn: string; labelMr: string; labelHi: string }[] = [
  { id: 'vegetables', labelEn: '🥦 Vegetables', labelMr: '🥦 भाज्या', labelHi: '🥦 सब्जियां' },
  { id: 'grains', labelEn: '🌾 Grains & Cereals', labelMr: '🌾 धान्य', labelHi: '🌾 अनाज' },
  { id: 'pulses', labelEn: '🫘 Pulses & Dals', labelMr: '🫘 कडधान्य', labelHi: '🫘 दालें' },
  { id: 'cash_crops', labelEn: '🚜 Commercial & Fibres', labelMr: '🚜 नगदी व कापूस', labelHi: '🚜 नकदी व कपास' },
  { id: 'oilseeds', labelEn: '🌻 Oilseeds', labelMr: '🌻 गळीत धान्य', labelHi: '🌻 तिलहन' },
  { id: 'spices', labelEn: '🌶️ Spices & Condiments', labelMr: '🌶️ मसाले', labelHi: '🌶️ मसाले' },
  { id: 'fruits', labelEn: '🍎 Fruits & Orchards', labelMr: '🍎 फळे', labelHi: '🍎 फल' },
];
