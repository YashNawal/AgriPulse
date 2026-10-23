-- ============================================================================
-- KisanMitra Initial Seed Data
-- Run this in Supabase SQL Editor AFTER running 001_initial_schema.sql
-- ============================================================================

-- 1. Insert Commodities with MSP (Minimum Support Price)
INSERT INTO public.commodity_master (id, name, category, local_names, msp) VALUES
(1, 'Wheat (गेहूं / गहू)', 'grain', '{"hi": "गेहूं", "mr": "गहू", "gu": "ઘઉં", "pa": "ਕਣਕ"}', 2275.00),
(2, 'Soybean (सोयाबीन)', 'grain', '{"hi": "सोयाबीन", "mr": "सोयाबीन", "gu": "સોયાબીન"}', 4892.00),
(3, 'Cotton (कपास / कापूस)', 'grain', '{"hi": "कपास", "mr": "कापूस", "gu": "કપાસ"}', 7121.00),
(4, 'Mustard (सरसों / मोहरी)', 'grain', '{"hi": "सरसों", "mr": "मोहरी", "gu": "રાઈ"}', 5650.00),
(5, 'Tomato (टमाटर / टोमॅटो)', 'vegetable', '{"hi": "टमाटर", "mr": "टोमॅटो", "gu": "ટામેટા"}', NULL),
(6, 'Onion (प्याज / कांदा)', 'vegetable', '{"hi": "प्याज", "mr": "कांदा", "gu": "ડુંગળી"}', NULL),
(7, 'Potato (आलू / बटाटा)', 'vegetable', '{"hi": "आलू", "mr": "बटाटा", "gu": "બટાકા"}', NULL),
(8, 'Turmeric (हल्दी / हळद)', 'spice', '{"hi": "हल्दी", "mr": "हळद", "gu": "હળદર"}', 8200.00),
(9, 'Ladyfinger / Okra (भेंडी / भिंडी)', 'vegetable', '{"hi": "भिंडी", "mr": "भेंडी"}', NULL),
(10, 'Ginger (आले / अदरक)', 'spice', '{"hi": "अदरक", "mr": "आले"}', NULL),
(11, 'Garlic (लसूण / लहसुन)', 'spice', '{"hi": "लहसुन", "mr": "लसूण"}', NULL),
(12, 'Pomegranate (डाळिंब / अनार)', 'fruit', '{"hi": "अनार", "mr": "डाळिंब"}', NULL),
(13, 'Banana (केळी / केला)', 'fruit', '{"hi": "केला", "mr": "केळी"}', NULL),
(14, 'Grapes (द्राक्षे / अंगूर)', 'fruit', '{"hi": "अंगूर", "mr": "द्राक्षे"}', NULL),
(15, 'Sugarcane (ऊस / गन्ना)', 'cash_crop', '{"hi": "गन्ना", "mr": "ऊस"}', 315.00),
(16, 'Green Chilli (हिरवी मिरची / हरी मिर्च)', 'vegetable', '{"hi": "हरी मिर्च", "mr": "हिरवी मिरची"}', NULL),
(17, 'Pigeon Pea / Tur (तूर / अरहर)', 'pulse', '{"hi": "अरहर", "mr": "तूर"}', 7550.00),
(18, 'Chickpea / Chana (हरभरा / चना)', 'pulse', '{"hi": "चना", "mr": "हरभरा"}', 5440.00),
(19, 'Green Gram / Moong (मूग / मूंग)', 'pulse', '{"hi": "मूंग", "mr": "मूग"}', 8558.00),
(20, 'Black Gram / Urad (उडीद / उड़द)', 'pulse', '{"hi": "उड़द", "mr": "उडीद"}', 6950.00),
(21, 'Groundnut (भुईमूग / मूंगफली)', 'oilseed', '{"hi": "मूंगफली", "mr": "भुईमूग"}', 6783.00),
(22, 'Rice / Paddy (भात / धान)', 'grain', '{"hi": "धान", "mr": "भात"}', 2300.00),
(23, 'Maize (मका / मक्का)', 'grain', '{"hi": "मक्का", "mr": "मका"}', 2090.00),
(24, 'Bajra (बाजरी / बाजरा)', 'grain', '{"hi": "बाजरा", "mr": "बाजरी"}', 2500.00),
(25, 'Jowar (ज्वारी / ज्वार)', 'grain', '{"hi": "ज्वार", "mr": "ज्वारी"}', 3180.00),
(26, 'Cabbage (कोबी / पत्तागोभी)', 'vegetable', '{"hi": "पत्तागोभी", "mr": "कोबी"}', NULL),
(27, 'Cauliflower (फ्लॉवर / फूलगोभी)', 'vegetable', '{"hi": "फूलगोभी", "mr": "फ्लॉवर"}', NULL),
(28, 'Capsicum (शिमला मिरची / शिमला मिर्च)', 'vegetable', '{"hi": "शिमला मिर्च", "mr": "शिमला मिरची"}', NULL),
(29, 'Green Peas (मटार / मटर)', 'vegetable', '{"hi": "मटर", "mr": "मटार"}', NULL),
(30, 'Mango (आंबा / आम)', 'fruit', '{"hi": "आम", "mr": "आंबा"}', NULL)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for commodity_master
SELECT setval('commodity_master_id_seq', (SELECT MAX(id) FROM public.commodity_master));

-- 2. Insert Mandis / Markets with Coordinates
INSERT INTO public.markets (id, name, state, district, latitude, longitude, mandi_fee_pct) VALUES
(1, 'Indore APMC Mandi (Chhavani)', 'Madhya Pradesh', 'Indore', 22.719600, 75.857700, 1.50),
(2, 'Ujjain Krishi Upaj Mandi', 'Madhya Pradesh', 'Ujjain', 23.176500, 75.788500, 1.50),
(3, 'Dewas Mandi', 'Madhya Pradesh', 'Dewas', 22.967600, 76.053400, 1.50),
(4, 'Lasalgaon Mandi Yard', 'Maharashtra', 'Nashik', 20.147200, 74.225500, 1.25),
(5, 'Nagpur APMC Cotton Yard', 'Maharashtra', 'Nagpur', 21.145800, 79.088200, 1.50),
(6, 'Rajkot Mandi Yard', 'Gujarat', 'Rajkot', 22.303900, 70.802200, 1.00),
(7, 'Khanna Grain Market', 'Punjab', 'Ludhiana', 30.707200, 76.216700, 2.00),
(8, 'Kolhapur APMC Market (Market Yard)', 'Maharashtra', 'Kolhapur', 16.705000, 74.243300, 1.00),
(9, 'Sangli APMC Market Yard', 'Maharashtra', 'Sangli', 16.852400, 74.581500, 1.00),
(10, 'Pune APMC (Gultekdi Yard)', 'Maharashtra', 'Pune', 18.496700, 73.864700, 1.25),
(11, 'Vashi APMC Wholesale Terminal', 'Maharashtra', 'Navi Mumbai', 19.076000, 72.998600, 1.00),
(12, 'Solapur APMC Yard', 'Maharashtra', 'Solapur', 17.659900, 75.906400, 1.50),
(13, 'Latur Krishi Mandi', 'Maharashtra', 'Latur', 18.408800, 76.560400, 1.50),
(14, 'Belagavi APMC Yard', 'Karnataka', 'Belagavi', 15.849700, 74.497700, 1.00),
(15, 'Azadpur Terminal Mandi', 'Delhi', 'North Delhi', 28.716100, 77.172400, 1.00)
ON CONFLICT (name, district, state) DO NOTHING;

-- 3. Insert Live Prices & Arrivals across Markets
INSERT INTO public.prices (commodity_id, state, district, market, min_price, max_price, modal_price, arrivals_tonnes, price_date) VALUES
(1, 'Madhya Pradesh', 'Indore', 'Indore APMC Mandi (Chhavani)', 2450.00, 2950.00, 2720.00, 450.00, CURRENT_DATE),
(1, 'Madhya Pradesh', 'Dewas', 'Dewas Mandi', 2400.00, 2820.00, 2640.00, 280.00, CURRENT_DATE),
(1, 'Madhya Pradesh', 'Ujjain', 'Ujjain Krishi Upaj Mandi', 2480.00, 2980.00, 2760.00, 520.00, CURRENT_DATE),
(2, 'Madhya Pradesh', 'Indore', 'Indore APMC Mandi (Chhavani)', 4350.00, 4780.00, 4620.00, 850.00, CURRENT_DATE),
(3, 'Maharashtra', 'Nagpur', 'Nagpur APMC Cotton Yard', 6800.00, 7650.00, 7350.00, 340.00, CURRENT_DATE),
(6, 'Maharashtra', 'Nashik', 'Lasalgaon Mandi Yard', 1650.00, 2550.00, 2150.00, 1250.00, CURRENT_DATE),
(9, 'Maharashtra', 'Kolhapur', 'Kolhapur APMC Market (Market Yard)', 3100.00, 5200.00, 4200.00, 45.00, CURRENT_DATE),
(9, 'Maharashtra', 'Sangli', 'Sangli APMC Market Yard', 3300.00, 5500.00, 4450.00, 60.00, CURRENT_DATE),
(9, 'Maharashtra', 'Pune', 'Pune APMC (Gultekdi Yard)', 3500.00, 5700.00, 4650.00, 110.00, CURRENT_DATE),
(9, 'Karnataka', 'Belagavi', 'Belagavi APMC Yard', 3000.00, 5100.00, 4150.00, 40.00, CURRENT_DATE),
(9, 'Maharashtra', 'Navi Mumbai', 'Vashi APMC Wholesale Terminal', 3600.00, 5800.00, 4800.00, 220.00, CURRENT_DATE);

-- 4. Insert Products (Seeds, Fertilizers, Pesticides)
INSERT INTO public.products (id, name, category, crop, brand, pack_size, price, stock, image_url, description) VALUES
(101, 'IFFCO Nano Urea Liquid', 'fertilizer', 'All Crops (Wheat, Paddy, Vegetables)', 'IFFCO', '500 ml Bottle (Equal to 1 Bag Urea)', 225.00, 240, 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80', 'Eco-friendly nanotechnology foliar nitrogen spray. Increases crop yield with 80% nitrogen efficiency without groundwater leaching.'),
(102, 'IFFCO Nano DAP Liquid', 'fertilizer', 'Wheat, Soybean, Mustard', 'IFFCO', '500 ml Bottle', 600.00, 180, 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80', 'Concentrated source of phosphorus and nitrogen for root establishment and healthy tillering at early stages.'),
(103, 'Mahyco Gold Hybrid Wheat Seed HD-2967', 'seed', 'Wheat (गेहूं)', 'Mahyco', '40 kg Bag', 1850.00, 95, 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', 'High yielding certified seed with rust resistance, bold grains, and suitable for timely sown irrigated conditions.'),
(104, 'Kaveri Cotton Seed Jaadu BG-II', 'seed', 'Cotton (कपास)', 'Kaveri Seeds', '450 g Packet', 864.00, 130, 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80', 'Top-rated bollgard II hybrid cotton. Big boll size, quick bursting, excellent sucking pest tolerance.'),
(105, 'Coromandel Gromor 10:26:26 Complex', 'fertilizer', 'Soybean, Potato, Sugarcane', 'Coromandel International', '50 kg Bag', 1470.00, 75, 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80', 'High potassium and phosphorus complex fertilizer for tuber development, grain filling and drought resistance.'),
(106, 'UPL Saaf Fungicide (Carbendazim + Mancozeb)', 'pesticide', 'Tomato, Potato, Chilli, Groundnut', 'UPL', '500 g Pack', 430.00, 110, 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80', 'Systemic and contact broad-spectrum fungicide for leaf spot, blast, blight and damping-off protection.'),
(107, 'Bayer Regent SC (Fipronil 5%)', 'pesticide', 'Rice, Sugarcane, Cotton', 'Bayer CropScience', '250 ml', 520.00, 65, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', 'Protects root zone against stem borer, leaf folder, and early shoot insects with plant growth enhancement effect.')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert ICAR-Approved Fertilizer Regimens
INSERT INTO public.fertilizer_plans (id, crop, growth_stage, fertilizer, quantity_per_acre, timing, notes, approved_by, disclaimer) VALUES
(201, 'Wheat (गेहूं)', 'Basal Dose (बुवाई के समय / Sowing Stage)', 'DAP (Diammonium Phosphate) + MOP', '50 kg DAP + 20 kg MOP per acre', 'Incorporate into soil at final ploughing just before seed drilling', 'Provides foundational phosphorus for root branching and early tillering.', 'Approved by ICAR-IIWBR & State Agriculture University Agronomists', 'Fertilizer advice must be based on Soil Health Card lab tests. Consult local KVK agronomist.'),
(202, 'Wheat (गेहूं)', '1st Irrigation / Tillering (20-25 Days)', 'Neem Coated Urea + Zinc Sulphate (21%)', '35 kg Urea + 5 kg Zinc per acre', 'Top dress immediately after first crown root irrigation (CRI stage)', 'Crucial for vigorous tiller production. Avoid water stagnation.', 'Approved by ICAR-IIWBR & State Agriculture University Agronomists', 'Fertilizer advice must be based on Soil Health Card lab tests. Consult local KVK agronomist.'),
(203, 'Wheat (गेहूं)', 'Booting / Spike Emergence (55-60 Days)', 'IFFCO Nano Urea Liquid + NPK 00:00:50', '250 ml Nano Urea + 1 kg NPK 00:00:50 in 150L water', 'Foliar spray during clear morning sunshine', 'Maximizes grain weight, prevents tip drying, and enhances protein content.', 'Approved by ICAR-IIWBR & State Agriculture University Agronomists', 'Fertilizer advice must be based on Soil Health Card lab tests. Consult local KVK agronomist.'),
(204, 'Cotton (कपास)', 'Basal Dose (बुवाई पूर्व)', 'NPK 10:26:26 + Magnesium Sulphate', '50 kg NPK + 10 kg MgSO4 per acre', 'Apply in furrows 5 cm below seed depth', 'Ensures balanced vegetative start and strong stem resistance.', 'Approved by ICAR-CICR Cotton Directorate', 'Do not exceed nitrogen doses in high rainfall black soils.'),
(205, 'Tomato (टमाटर)', 'Transplanting to 20 Days', 'NPK 19:19:19 (Water Soluble)', '3 kg per acre via drip fertigation twice a week', 'During evening drip cycle', 'Stimulates fast root revival and early flower clusters.', 'Approved by Indian Institute of Horticultural Research (IIHR)', 'Check soil pH; maintain between 6.0 and 7.0 for optimal micronutrient uptake.')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Machine Learning Price Forecasts
INSERT INTO public.price_forecasts (commodity, market, p10, p50, p90, horizon_days, shap_drivers, news_warning, disclaimer) VALUES
('Wheat (गेहूं)', 'Indore APMC Mandi', 2580.00, 2810.00, 3050.00, 14, 
 '["Strong festive flour demand (+₹65)", "Government buffer stock open tender delayed (+₹45)", "Lower arrivals reported across central MP mandis (+₹30)"]'::jsonb,
 'Procurement centers opening announcement expected next week. Short-term price spike likely.',
 'Forecast is decision support, not a guarantee.'),
('Soybean (सोयाबीन)', 'Indore APMC Mandi', 4400.00, 4680.00, 4920.00, 14, 
 '["International edible oil tariff increase (+₹95)", "High moisture in fresh arrivals (-₹40)", "Crushers active with steady spot margins (+₹35)"]'::jsonb,
 'Watch moisture levels; dry stock commands ₹120/q premium.',
 'Forecast is decision support, not a guarantee.');
