// Real User Geolocation & OpenStreetMap Reverse-Geocoding Engine

export interface UserLocationDetails {
  latitude: number;
  longitude: number;
  village: string;
  taluka?: string;
  district: string;
  state: string;
  country: string;
  displayName: string;
  source: 'gps' | 'ip' | 'default' | 'search';
}

export interface TalukaRecord {
  name: string;
  nameMr: string;
  nameHi?: string;
  district: string;
  districtMr: string;
  state: string;
  latitude: number;
  longitude: number;
  type: 'taluka' | 'city' | 'major_town';
}

// Comprehensive offline index of Indian Talukas and Agricultural Cities
export const INDIAN_TALUKAS: TalukaRecord[] = [
  // Kolhapur District (All Talukas & Major Towns)
  { name: 'Karvir', nameMr: 'करवीर (कोल्हापूर)', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433, type: 'taluka' },
  { name: 'Kolhapur City', nameMr: 'कोल्हापूर शहर', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433, type: 'city' },
  { name: 'Hatkanangale', nameMr: 'हातकणंगले', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7450, longitude: 74.4450, type: 'taluka' },
  { name: 'Shirol', nameMr: 'शिरोळ', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7150, longitude: 74.5950, type: 'taluka' },
  { name: 'Jaisingpur', nameMr: 'जयसिंगपूर', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7820, longitude: 74.5580, type: 'major_town' },
  { name: 'Ichalkaranji', nameMr: 'इचलकरंजी', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.6950, longitude: 74.4600, type: 'city' },
  { name: 'Kagal', nameMr: 'कागल', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.5780, longitude: 74.3180, type: 'taluka' },
  { name: 'Gadhinglaj', nameMr: 'गडहिंग्लज', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.2250, longitude: 74.3550, type: 'taluka' },
  { name: 'Panhala', nameMr: 'पन्हाळा', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.8120, longitude: 74.1100, type: 'taluka' },
  { name: 'Radhanagari', nameMr: 'राधानगरी', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.4170, longitude: 73.9980, type: 'taluka' },
  { name: 'Shahuwadi', nameMr: 'शाहूवाडी', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.9050, longitude: 73.9450, type: 'taluka' },
  { name: 'Bhudargad', nameMr: 'भुदरगड (गारगोटी)', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.3150, longitude: 74.1550, type: 'taluka' },
  { name: 'Ajara', nameMr: 'आजरा', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.1150, longitude: 74.2100, type: 'taluka' },
  { name: 'Chandgad', nameMr: 'चंदगड', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 15.9350, longitude: 74.3980, type: 'taluka' },
  { name: 'Gaganbawda', nameMr: 'गगनबावडा', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.5400, longitude: 73.8300, type: 'taluka' },
  { name: 'Peth Vadgaon', nameMr: 'पेठ वडगाव', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.8200, longitude: 74.3000, type: 'major_town' },

  // Sangli District (All Talukas & Major Towns)
  { name: 'Miraj', nameMr: 'मिरज', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 16.8250, longitude: 74.6450, type: 'taluka' },
  { name: 'Sangli City', nameMr: 'सांगली शहर', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 16.8524, longitude: 74.5815, type: 'city' },
  { name: 'Walwa', nameMr: 'वाळवा (इस्लामपूर)', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.0500, longitude: 74.2650, type: 'taluka' },
  { name: 'Islampur', nameMr: 'इस्लामपूर', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.0500, longitude: 74.2650, type: 'major_town' },
  { name: 'Tasgaon', nameMr: 'तासगाव', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.0350, longitude: 74.6000, type: 'taluka' },
  { name: 'Palus', nameMr: 'पलूस', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.1000, longitude: 74.4500, type: 'taluka' },
  { name: 'Khanapur', nameMr: 'खानापूर (विटा)', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.2750, longitude: 74.5350, type: 'taluka' },
  { name: 'Vita', nameMr: 'विटा', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.2750, longitude: 74.5350, type: 'major_town' },
  { name: 'Atpadi', nameMr: 'आटपाडी', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.4200, longitude: 74.9500, type: 'taluka' },
  { name: 'Jat', nameMr: 'जत', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.0450, longitude: 75.1650, type: 'taluka' },
  { name: 'Kadegaon', nameMr: 'कडेगाव', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.2950, longitude: 74.3350, type: 'taluka' },
  { name: 'Kavathe Mahankal', nameMr: 'कवठे महांकाळ', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 16.9950, longitude: 74.8850, type: 'taluka' },
  { name: 'Shirala', nameMr: 'शिराळा', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 16.9850, longitude: 74.1350, type: 'taluka' },

  // Satara District
  { name: 'Karad', nameMr: 'कराड', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.2850, longitude: 74.1850, type: 'taluka' },
  { name: 'Satara City', nameMr: 'सातारा शहर', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.6850, longitude: 73.9950, type: 'city' },
  { name: 'Phaltan', nameMr: 'फलटण', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.9850, longitude: 74.4350, type: 'taluka' },
  { name: 'Wai', nameMr: 'वाई', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.9450, longitude: 73.8950, type: 'taluka' },
  { name: 'Koregaon', nameMr: 'कोरेगाव', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.6950, longitude: 74.1750, type: 'taluka' },
  { name: 'Khatav', nameMr: 'खटाव (वडूज)', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.6050, longitude: 74.4550, type: 'taluka' },
  { name: 'Man', nameMr: 'माण (दहीवडी)', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.6850, longitude: 74.7850, type: 'taluka' },
  { name: 'Patan', nameMr: 'पाटण', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.3750, longitude: 73.9050, type: 'taluka' },
  { name: 'Mahabaleshwar', nameMr: 'महाबळेश्वर', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.9250, longitude: 73.6600, type: 'taluka' },
  { name: 'Khandala', nameMr: 'खंडाळा', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 18.0450, longitude: 74.0250, type: 'taluka' },

  // Pune District
  { name: 'Baramati', nameMr: 'बारामती', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.1550, longitude: 74.5800, type: 'taluka' },
  { name: 'Indapur', nameMr: 'इंदापूर', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.1150, longitude: 75.0250, type: 'taluka' },
  { name: 'Daund', nameMr: 'दौंड', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.4650, longitude: 74.5850, type: 'taluka' },
  { name: 'Junnar', nameMr: 'जुन्नर (नारायणगाव)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 19.2050, longitude: 73.8750, type: 'taluka' },
  { name: 'Shirur', nameMr: 'शिरूर', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.8250, longitude: 74.3750, type: 'taluka' },
  { name: 'Khed', nameMr: 'खेड (चाकण/राजगुरुनगर)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.8550, longitude: 73.9050, type: 'taluka' },
  { name: 'Ambegaon', nameMr: 'आंबेगाव (मंचर)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 19.0150, longitude: 73.8350, type: 'taluka' },
  { name: 'Purandar', nameMr: 'पुरंदर (सासवड)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.3450, longitude: 74.0300, type: 'taluka' },
  { name: 'Haveli', nameMr: 'हवेली (पुणे ग्रामीण)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, type: 'taluka' },
  { name: 'Pune City', nameMr: 'पुणे शहर (गुलटेकडी)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.4967, longitude: 73.8643, type: 'city' },

  // Solapur District
  { name: 'Pandharpur', nameMr: 'पंढरपूर', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.6750, longitude: 75.3250, type: 'taluka' },
  { name: 'Solapur City', nameMr: 'सोलापूर शहर', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.6599, longitude: 75.9064, type: 'city' },
  { name: 'Barshi', nameMr: 'बार्शी', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 18.2350, longitude: 75.6950, type: 'taluka' },
  { name: 'Malshiras', nameMr: 'माळशिरस (अकलूज)', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.8950, longitude: 75.0250, type: 'taluka' },
  { name: 'Mohol', nameMr: 'मोहोळ', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.8150, longitude: 75.6450, type: 'taluka' },
  { name: 'Sangola', nameMr: 'सांगोला', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.4350, longitude: 75.1950, type: 'taluka' },
  { name: 'Karmala', nameMr: 'करमाळा', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 18.4150, longitude: 75.1950, type: 'taluka' },
  { name: 'Madha', nameMr: 'माढा (कुर्डूवाडी)', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 18.0350, longitude: 75.5250, type: 'taluka' },
  { name: 'Mangalwedha', nameMr: 'मंगळवेढा', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.5150, longitude: 75.4450, type: 'taluka' },
  { name: 'Akkalkot', nameMr: 'अक्कलकोट', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.5250, longitude: 76.2050, type: 'taluka' },

  // Nashik District
  { name: 'Lasalgaon', nameMr: 'लासलगाव (कांदा बाजार)', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.1472, longitude: 74.2255, type: 'major_town' },
  { name: 'Niphad', nameMr: 'निफाड', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.0850, longitude: 74.1100, type: 'taluka' },
  { name: 'Pimpalgaon Baswant', nameMr: 'पिंपळगाव बसवंत', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.1706, longitude: 73.9856, type: 'major_town' },
  { name: 'Dindori', nameMr: 'दिंडोरी', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.1950, longitude: 73.8350, type: 'taluka' },
  { name: 'Nashik City', nameMr: 'नाशिक शहर', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 19.9975, longitude: 73.7898, type: 'city' },
  { name: 'Sinnar', nameMr: 'सिन्नर', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 19.8450, longitude: 73.9950, type: 'taluka' },
  { name: 'Yeola', nameMr: 'येवला', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.0350, longitude: 74.4850, type: 'taluka' },
  { name: 'Malegaon', nameMr: 'मालेगाव', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.5550, longitude: 74.5250, type: 'taluka' },
  { name: 'Chandwad', nameMr: 'चांदवड', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.3250, longitude: 74.2450, type: 'taluka' },
  { name: 'Kalwan', nameMr: 'कळवण', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.4950, longitude: 73.9950, type: 'taluka' },
  { name: 'Satana', nameMr: 'सटाणा (बागलाण)', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.5950, longitude: 74.2050, type: 'taluka' },

  // Ahmednagar District
  { name: 'Ahmednagar City', nameMr: 'अहमदनगर शहर', district: 'Ahmednagar', districtMr: 'अहमदनगर', state: 'Maharashtra', latitude: 19.0948, longitude: 74.7480, type: 'city' },
  { name: 'Rahuri', nameMr: 'राहुरी (कृषी विद्यापीठ)', district: 'Ahmednagar', districtMr: 'अहमदनगर', state: 'Maharashtra', latitude: 19.3950, longitude: 74.6550, type: 'taluka' },
  { name: 'Shrirampur', nameMr: 'श्रीरामपूर', district: 'Ahmednagar', districtMr: 'अहमदनगर', state: 'Maharashtra', latitude: 19.6150, longitude: 74.6550, type: 'taluka' },
  { name: 'Sangamner', nameMr: 'संगमनेर', district: 'Ahmednagar', districtMr: 'अहमदनगर', state: 'Maharashtra', latitude: 19.5750, longitude: 74.2150, type: 'taluka' },
  { name: 'Kopargaon', nameMr: 'कोपरगाव', district: 'Ahmednagar', districtMr: 'अहमदनगर', state: 'Maharashtra', latitude: 19.8850, longitude: 74.4850, type: 'taluka' },
  { name: 'Newasa', nameMr: 'नेवासा', district: 'Ahmednagar', districtMr: 'अहमदनगर', state: 'Maharashtra', latitude: 19.5550, longitude: 74.9250, type: 'taluka' },
  { name: 'Shevgaon', nameMr: 'शेवगाव', district: 'Ahmednagar', districtMr: 'अहमदनगर', state: 'Maharashtra', latitude: 19.3450, longitude: 75.2150, type: 'taluka' },
  { name: 'Parner', nameMr: 'पारनेर', district: 'Ahmednagar', districtMr: 'अहमदनगर', state: 'Maharashtra', latitude: 19.0050, longitude: 74.4450, type: 'taluka' },

  // Latur & Marathwada
  { name: 'Latur City', nameMr: 'लातूर शहर', district: 'Latur', districtMr: 'लातूर', state: 'Maharashtra', latitude: 18.4088, longitude: 76.5604, type: 'city' },
  { name: 'Ausa', nameMr: 'औसा', district: 'Latur', districtMr: 'लातूर', state: 'Maharashtra', latitude: 18.2550, longitude: 76.5050, type: 'taluka' },
  { name: 'Nilanga', nameMr: 'निलंगा', district: 'Latur', districtMr: 'लातूर', state: 'Maharashtra', latitude: 18.1250, longitude: 76.7550, type: 'taluka' },
  { name: 'Udgir', nameMr: 'उदगीर', district: 'Latur', districtMr: 'लातूर', state: 'Maharashtra', latitude: 18.3950, longitude: 77.1150, type: 'taluka' },
  { name: 'Chhatrapati Sambhajinagar', nameMr: 'छत्रपती संभाजीनगर', district: 'Chhatrapati Sambhajinagar', districtMr: 'छत्रपती संभाजीनगर', state: 'Maharashtra', latitude: 19.8762, longitude: 75.3433, type: 'city' },
  { name: 'Jalna', nameMr: 'जालना (बियाणे शहर)', district: 'Jalna', districtMr: 'जालना', state: 'Maharashtra', latitude: 19.8410, longitude: 75.8864, type: 'city' },
  { name: 'Beed', nameMr: 'बीड', district: 'Beed', districtMr: 'बीड', state: 'Maharashtra', latitude: 18.9891, longitude: 75.7601, type: 'city' },
  { name: 'Nanded', nameMr: 'नांदेड', district: 'Nanded', districtMr: 'नांदेड', state: 'Maharashtra', latitude: 19.1383, longitude: 77.3210, type: 'city' },
  { name: 'Parbhani', nameMr: 'परभणी', district: 'Parbhani', districtMr: 'परभणी', state: 'Maharashtra', latitude: 19.2608, longitude: 76.7749, type: 'city' },

  // Khandesh & Vidarbha
  { name: 'Jalgaon City', nameMr: 'जळगाव (केळी हब)', district: 'Jalgaon', districtMr: 'जळगाव', state: 'Maharashtra', latitude: 21.0077, longitude: 75.5626, type: 'city' },
  { name: 'Bhusawal', nameMr: 'भुसावळ', district: 'Jalgaon', districtMr: 'जळगाव', state: 'Maharashtra', latitude: 21.0450, longitude: 75.7850, type: 'taluka' },
  { name: 'Dhule', nameMr: 'धुळे', district: 'Dhule', districtMr: 'धुळे', state: 'Maharashtra', latitude: 20.9042, longitude: 74.7749, type: 'city' },
  { name: 'Nagpur City', nameMr: 'नागपूर (संत्रा/कापूस हब)', district: 'Nagpur', districtMr: 'नागपूर', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, type: 'city' },
  { name: 'Amravati', nameMr: 'अमरावती', district: 'Amravati', districtMr: 'अमरावती', state: 'Maharashtra', latitude: 20.9320, longitude: 77.7523, type: 'city' },
  { name: 'Akola', nameMr: 'अकोला (कापूस बाजार)', district: 'Akola', districtMr: 'अकोला', state: 'Maharashtra', latitude: 20.7002, longitude: 77.0082, type: 'city' },
  { name: 'Yavatmal', nameMr: 'यवतमाळ', district: 'Yavatmal', districtMr: 'यवतमाळ', state: 'Maharashtra', latitude: 20.3888, longitude: 78.1204, type: 'city' },

  // Karnataka Border Agri Belts
  { name: 'Nipani', nameMr: 'निपाणी (तंबाखू व भाजीपाला)', district: 'Belagavi', districtMr: 'बेळगाव', state: 'Karnataka', latitude: 16.4020, longitude: 74.3820, type: 'major_town' },
  { name: 'Belagavi', nameMr: 'बेळगाव शहर', district: 'Belagavi', districtMr: 'बेळगाव', state: 'Karnataka', latitude: 15.8497, longitude: 74.4977, type: 'city' },
  { name: 'Chikkodi', nameMr: 'चिक्कोडी', district: 'Belagavi', districtMr: 'बेळगाव', state: 'Karnataka', latitude: 16.4300, longitude: 74.5950, type: 'taluka' },
  { name: 'Hukkeri', nameMr: 'हुक्केरी (संकेश्वर)', district: 'Belagavi', districtMr: 'बेळगाव', state: 'Karnataka', latitude: 16.2250, longitude: 74.6000, type: 'taluka' },
  { name: 'Gokak', nameMr: 'गोकाक', district: 'Belagavi', districtMr: 'बेळगाव', state: 'Karnataka', latitude: 16.1680, longitude: 74.8250, type: 'taluka' },
  { name: 'Athani', nameMr: 'अथणी', district: 'Belagavi', districtMr: 'बेळगाव', state: 'Karnataka', latitude: 16.7350, longitude: 75.0550, type: 'taluka' },
  { name: 'Vijayapura', nameMr: 'विजापूर (द्राक्षे व डाळिंब)', district: 'Vijayapura', districtMr: 'विजापूर', state: 'Karnataka', latitude: 16.8302, longitude: 75.7100, type: 'city' },

  // Other Major National Agri Centers
  { name: 'Indore', nameMr: 'इंदूर', district: 'Indore', districtMr: 'इंदूर', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, type: 'city' },
  { name: 'Ujjain', nameMr: 'उज्जैन', district: 'Ujjain', districtMr: 'उज्जैन', state: 'Madhya Pradesh', latitude: 23.1765, longitude: 75.7885, type: 'city' },
  { name: 'Mandsaur', nameMr: 'मंदसौर (लसूण हब)', district: 'Mandsaur', districtMr: 'मंदसौर', state: 'Madhya Pradesh', latitude: 24.0722, longitude: 75.0682, type: 'city' },
  { name: 'Rajkot', nameMr: 'राजकोट', district: 'Rajkot', districtMr: 'राजकोट', state: 'Gujarat', latitude: 22.3039, longitude: 70.8022, type: 'city' },
  { name: 'Surat', nameMr: 'सुरत', district: 'Surat', districtMr: 'सुरत', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, type: 'city' },
  { name: 'Unjha', nameMr: 'उंझा (जिरे व मसाला हब)', district: 'Mehsana', districtMr: 'महेसाणा', state: 'Gujarat', latitude: 23.8042, longitude: 72.3925, type: 'city' },
  { name: 'Vashi', nameMr: 'वाशी नवी मुंबई (मुख्य बाजारपेठ)', district: 'Navi Mumbai', districtMr: 'नवी मुंबई', state: 'Maharashtra', latitude: 19.0760, longitude: 72.9977, type: 'city' },
  { name: 'Azadpur', nameMr: 'आझादपूर (दिल्ली मंडी)', district: 'North Delhi', districtMr: 'दिल्ली', state: 'Delhi', latitude: 28.7161, longitude: 77.1724, type: 'city' },
];

/**
 * Instant Offline Search + Nominatim Fallback for City, Taluka or Village
 */
export async function searchIndianCityOrTaluka(query: string): Promise<UserLocationDetails[]> {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  // 1. Instant match in pre-indexed talukas and cities
  const localMatches: UserLocationDetails[] = INDIAN_TALUKAS
    .filter((t) => {
      const matchName = t.name.toLowerCase().includes(q) || t.nameMr.includes(q);
      const matchDist = t.district.toLowerCase().includes(q) || t.districtMr.includes(q);
      const matchState = t.state.toLowerCase().includes(q);
      return matchName || matchDist || matchState;
    })
    .sort((a, b) => {
      // Prioritize exact or prefix matches
      const aStarts = a.name.toLowerCase().startsWith(q) || a.nameMr.startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q) || b.nameMr.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    })
    .slice(0, 60)
    .map((t) => ({
      latitude: t.latitude,
      longitude: t.longitude,
      village: t.name,
      taluka: t.name,
      district: t.district,
      state: t.state,
      country: 'India',
      displayName: `${t.name} (${t.district}, ${t.state})`,
      source: 'search' as const,
    }));

  if (localMatches.length >= 8) {
    return localMatches;
  }

  // 2. OpenStreetMap Nominatim Live Geocoding Fallback for any Indian village/town
  if (q.length >= 3) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=5`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'KisanMitra-AgriTalukaSearch/1.0',
        },
      });

      if (res.ok) {
        const osmData = await res.json();
        const osmResults: UserLocationDetails[] = osmData.map((item: any) => {
          const addr = item.address || {};
          const town = addr.village || addr.town || addr.suburb || addr.city || addr.county || item.name || query;
          const dist = addr.state_district || addr.district || addr.county || addr.city || 'District';
          const state = addr.state || 'Maharashtra';
          return {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            village: town,
            taluka: town,
            district: dist,
            state: state,
            country: 'India',
            displayName: item.display_name.split(',').slice(0, 3).join(', '),
            source: 'search' as const,
          };
        });

        // Merge without duplicate coordinates
        const seen = new Set(localMatches.map(m => `${m.latitude.toFixed(2)},${m.longitude.toFixed(2)}`));
        for (const r of osmResults) {
          const key = `${r.latitude.toFixed(2)},${r.longitude.toFixed(2)}`;
          if (!seen.has(key)) {
            seen.add(key);
            localMatches.push(r);
          }
        }
      }
    } catch (err) {
      console.warn('Nominatim search fallback error:', err);
    }
  }

  return localMatches;
}

/**
 * Returns all pre-indexed talukas and agricultural cities across India
 */
export function getAllIndexedTalukas(): UserLocationDetails[] {
  return INDIAN_TALUKAS.map((t) => ({
    latitude: t.latitude,
    longitude: t.longitude,
    village: t.name,
    taluka: t.name,
    district: t.district,
    state: t.state,
    country: 'India',
    displayName: `${t.name} (${t.district}, ${t.state})`,
    source: 'search' as const,
  }));
}

// Default fallback to Maharashtra agricultural hub (Kolhapur)
export const DEFAULT_FARMER_LOCATION: UserLocationDetails = {
  latitude: 16.7050,
  longitude: 74.2433,
  village: 'Kolhapur',
  taluka: 'Karvir',
  district: 'Kolhapur',
  state: 'Maharashtra',
  country: 'India',
  displayName: 'Kolhapur (Karvir), Maharashtra',
  source: 'default',
};

export const KOLHAPUR_LOCATION: UserLocationDetails = {
  latitude: 16.7050,
  longitude: 74.2433,
  village: 'Kolhapur',
  taluka: 'Karvir',
  district: 'Kolhapur',
  state: 'Maharashtra',
  country: 'India',
  displayName: 'Kolhapur (Karvir), Maharashtra',
  source: 'default',
};

export const POPULAR_AGRI_REGIONS: UserLocationDetails[] = [
  KOLHAPUR_LOCATION,
  {
    latitude: 16.7450,
    longitude: 74.4450,
    village: 'Hatkanangale',
    taluka: 'Hatkanangale',
    district: 'Kolhapur',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Hatkanangale, Kolhapur',
    source: 'default',
  },
  {
    latitude: 16.7150,
    longitude: 74.5950,
    village: 'Shirol',
    taluka: 'Shirol',
    district: 'Kolhapur',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Shirol, Kolhapur',
    source: 'default',
  },
  {
    latitude: 16.5780,
    longitude: 74.3180,
    village: 'Kagal',
    taluka: 'Kagal',
    district: 'Kolhapur',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Kagal, Kolhapur',
    source: 'default',
  },
  {
    latitude: 16.8250,
    longitude: 74.6450,
    village: 'Miraj',
    taluka: 'Miraj',
    district: 'Sangli',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Miraj, Sangli',
    source: 'default',
  },
  {
    latitude: 17.2850,
    longitude: 74.1850,
    village: 'Karad',
    taluka: 'Karad',
    district: 'Satara',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Karad, Satara',
    source: 'default',
  },
  {
    latitude: 18.1550,
    longitude: 74.5800,
    village: 'Baramati',
    taluka: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Baramati, Pune',
    source: 'default',
  },
  {
    latitude: 20.1472,
    longitude: 74.2255,
    village: 'Lasalgaon',
    taluka: 'Niphad',
    district: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Lasalgaon (Niphad), Nashik',
    source: 'default',
  },
  {
    latitude: 18.4967,
    longitude: 73.8643,
    village: 'Pune',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Pune, Maharashtra',
    source: 'default',
  },
  {
    latitude: 17.6599,
    longitude: 75.9064,
    village: 'Solapur',
    taluka: 'Solapur North',
    district: 'Solapur',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Solapur, Maharashtra',
    source: 'default',
  },
  {
    latitude: 18.4088,
    longitude: 76.5604,
    village: 'Latur',
    taluka: 'Latur',
    district: 'Latur',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Latur, Maharashtra',
    source: 'default',
  },
  {
    latitude: 22.7196,
    longitude: 75.8577,
    village: 'Indore',
    taluka: 'Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    displayName: 'Indore, Madhya Pradesh',
    source: 'default',
  },
];

/**
 * Reverse geocode latitude and longitude using OpenStreetMap Nominatim API
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<UserLocationDetails> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'KisanMitra-AgriApp/1.0',
      },
    });

    if (!res.ok) throw new Error('Nominatim request failed');
    const data = await res.json();
    const addr = data.address || {};

    const village =
      addr.village ||
      addr.town ||
      addr.suburb ||
      addr.city ||
      addr.county ||
      'Local Village';
    const district =
      addr.state_district ||
      addr.district ||
      addr.county ||
      addr.city ||
      'Nashik';
    const state = addr.state || 'Maharashtra';
    const country = addr.country || 'India';

    return {
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lon.toFixed(6)),
      village,
      district,
      state,
      country,
      displayName: `${village}, ${district}, ${state}`,
      source: 'gps',
    };
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return {
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lon.toFixed(6)),
      village: 'Your Village',
      district: 'Your District',
      state: 'Maharashtra',
      country: 'India',
      displayName: `GPS (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
      source: 'gps',
    };
  }
}

/**
 * Fallback to IP-based Geolocation when browser GPS permission is denied or unavailable
 */
export async function fetchIPLocation(): Promise<UserLocationDetails> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('ipapi request failed');
    const data = await res.json();

    if (data && data.latitude && data.longitude) {
      return {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        village: data.city || 'Local Area',
        district: data.region || 'Nashik',
        state: data.region || 'Maharashtra',
        country: data.country_name || 'India',
        displayName: `${data.city || 'Local'}, ${data.region || ''}, ${data.country_name || 'India'}`,
        source: 'ip',
      };
    }
    throw new Error('Invalid IP location payload');
  } catch (err) {
    console.warn('IP location fetch failed, using default:', err);
    return DEFAULT_FARMER_LOCATION;
  }
}

/**
 * Main Function: Obtains user's real GPS position from browser,
 * reverse-geocodes with Nominatim, and falls back gracefully to IP location.
 */
export async function detectRealUserLocation(): Promise<UserLocationDetails> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(DEFAULT_FARMER_LOCATION);
      return;
    }

    if (!navigator.geolocation) {
      console.warn('Browser geolocation not supported, falling back to IP');
      fetchIPLocation().then(resolve);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const details = await reverseGeocodeCoords(latitude, longitude);
        // Persist to localStorage for fast reload
        try {
          localStorage.setItem('kisanmitra_farmer_location', JSON.stringify(details));
        } catch (_) {}
        resolve(details);
      },
      async (error) => {
        console.warn('Geolocation denied or error:', error.message);
        // Fall back to IP-based detection
        const ipLocation = await fetchIPLocation();
        try {
          localStorage.setItem('kisanmitra_farmer_location', JSON.stringify(ipLocation));
        } catch (_) {}
        resolve(ipLocation);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Reads cached user location from localStorage if available
 */
export function getSavedFarmerLocation(): UserLocationDetails {
  if (typeof window === 'undefined') return DEFAULT_FARMER_LOCATION;
  try {
    const raw = localStorage.getItem('kisanmitra_farmer_location');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return DEFAULT_FARMER_LOCATION;
}

/**
 * Persists user location to localStorage
 */
export function saveFarmerLocation(details: UserLocationDetails): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('kisanmitra_farmer_location', JSON.stringify(details));
  } catch (_) {}
}
