-- ============================================================================
-- KisanMitra: Full Database Schema & RLS Policies (PostgreSQL / Supabase)
-- Based on the KisanMitra Specification (Free Plan Architecture)
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- 1. PROFILES (Farmers / Users)
create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    full_name text not null,
    phone text,
    language text default 'hi' check (language in ('en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'bn', 'pa')),
    state text,
    district text,
    village text,
    latitude numeric(9, 6),
    longitude numeric(9, 6),
    land_size_acres numeric(6, 2) default 2.0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. SAVED CROPS (User's tracked crops & cultivation inputs)
create table if not exists public.saved_crops (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete cascade,
    crop_name text not null,
    area_acres numeric(6, 2) default 1.0,
    cost_of_cultivation numeric(10, 2) default 15000.0,
    expected_yield_quintal numeric(8, 2) default 18.0,
    created_at timestamptz default now()
);

-- 3. COMMODITY MASTER (Grains, Spices, Fruits, Vegetables & MSP)
create table if not exists public.commodity_master (
    id bigserial primary key,
    name text unique not null,
    category text not null check (category in ('grain', 'spice', 'fruit', 'vegetable')),
    local_names jsonb default '{}'::jsonb,
    msp numeric(10, 2) -- Minimum Support Price in INR/quintal
);

-- 4. MARKETS (Mandis across India)
create table if not exists public.markets (
    id bigserial primary key,
    name text not null,
    state text not null,
    district text not null,
    latitude numeric(9, 6) not null,
    longitude numeric(9, 6) not null,
    mandi_fee_pct numeric(4, 2) default 1.50,
    unique(name, district, state)
);

-- 5. PRICES (Daily Mandi Prices & Arrivals)
create table if not exists public.prices (
    id bigserial primary key,
    commodity_id bigint references public.commodity_master(id),
    state text not null,
    district text not null,
    market text not null,
    min_price numeric(10, 2) not null,
    max_price numeric(10, 2) not null,
    modal_price numeric(10, 2) not null,
    arrivals_tonnes numeric(10, 2) default 0.0,
    price_date date not null default current_date,
    created_at timestamptz default now()
);
create index if not exists idx_prices_crop_date on public.prices(commodity_id, price_date);
create index if not exists idx_prices_market on public.prices(market);

-- 6. PRICE FORECASTS (p10, p50, p90 with SHAP Drivers & Warnings)
create table if not exists public.price_forecasts (
    id bigserial primary key,
    commodity text not null,
    market text not null,
    p10 numeric(10, 2) not null,
    p50 numeric(10, 2) not null,
    p90 numeric(10, 2) not null,
    horizon_days integer not null check (horizon_days in (7, 14, 30)),
    shap_drivers jsonb default '[]'::jsonb,
    news_warning text,
    forecast_date date default current_date,
    disclaimer text default 'Forecast is decision support, not a guarantee.'
);

-- 7. PRODUCTS (Seeds, Fertilizers, Pesticides Store)
create table if not exists public.products (
    id bigserial primary key,
    name text not null,
    category text not null check (category in ('seed', 'fertilizer', 'pesticide')),
    crop text not null,
    brand text not null,
    pack_size text not null,
    price numeric(10, 2) not null,
    stock integer default 100,
    image_url text,
    description text,
    is_available boolean default true,
    created_at timestamptz default now()
);

-- 8. FERTILIZER PLANS (Expert-approved Khaat Schedules)
create table if not exists public.fertilizer_plans (
    id bigserial primary key,
    crop text not null,
    growth_stage text not null,
    fertilizer text not null,
    quantity_per_acre text not null,
    timing text not null,
    notes text,
    approved_by text default 'ICAR & State Agri University Verified',
    disclaimer text default 'Doses must follow local agronomic advice. Adjust as per Soil Health Card.',
    created_at timestamptz default now()
);

-- 9. PRODUCT REQUESTS (Enquiry / Order Flow without payment gateway)
create table if not exists public.product_requests (
    id bigserial primary key,
    user_id uuid references auth.users(id),
    product_id bigint references public.products(id),
    quantity integer default 1,
    farmer_name text not null,
    farmer_phone text not null,
    village text not null,
    district text not null,
    status text default 'pending' check (status in ('pending', 'confirmed', 'dispatched', 'completed', 'cancelled')),
    notes text,
    created_at timestamptz default now()
);

-- 10. SOIL ESTIMATES & USER SOIL HEALTH CARD INPUTS
create table if not exists public.soil_cache (
    id bigserial primary key,
    latitude numeric(9, 6) not null,
    longitude numeric(9, 6) not null,
    soil_class text not null,
    ph numeric(4, 2) not null,
    texture text not null,
    organic_carbon numeric(4, 2) not null,
    created_at timestamptz default now()
);

create table if not exists public.user_soil_inputs (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete cascade unique,
    n numeric(6, 2), -- Nitrogen (kg/ha)
    p numeric(6, 2), -- Phosphorus (kg/ha)
    k numeric(6, 2), -- Potassium (kg/ha)
    ph numeric(4, 2),
    organic_carbon numeric(4, 2),
    notes text,
    updated_at timestamptz default now()
);

-- 11. MULTI-CHANNEL IDENTITIES (WhatsApp, Telegram, Web, App)
create table if not exists public.channel_identities (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete set null,
    channel text not null check (channel in ('whatsapp', 'telegram', 'web', 'app')),
    external_id text not null, -- WhatsApp phone number or Telegram ID
    language text default 'hi',
    consent_at timestamptz,
    last_user_message_at timestamptz,
    created_at timestamptz default now(),
    unique (channel, external_id)
);

-- 12. ACCOUNT LINK CODES (10-minute one-time codes for wa.me/?text=LINK <code>)
create table if not exists public.link_codes (
    code text primary key,
    user_id uuid references auth.users(id) on delete cascade,
    expires_at timestamptz not null
);

-- 13. PROCESSED MESSAGES (Idempotency against webhook retries)
create table if not exists public.processed_messages (
    message_id text primary key,
    received_at timestamptz default now()
);

-- 14. TTS CACHE (Hashed audio caching in Supabase Storage)
create table if not exists public.tts_cache (
    hash text primary key,
    lang text not null,
    storage_path text not null,
    created_at timestamptz default now()
);

-- 15. CHAT HISTORY (Single cross-channel conversation history)
create table if not exists public.chat_history (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete cascade,
    identity_id bigint references public.channel_identities(id) on delete set null,
    channel text default 'web' check (channel in ('whatsapp', 'telegram', 'web', 'app')),
    lang text default 'hi',
    sender text not null check (sender in ('farmer', 'bot', 'agronomist')),
    message text not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

-- 16. HANDOFF TICKETS (Agronomist Human Handoff)
create table if not exists public.handoff_tickets (
    id bigserial primary key,
    identity_id bigint references public.channel_identities(id) on delete set null,
    user_id uuid references auth.users(id) on delete set null,
    question text not null,
    language text default 'hi',
    status text default 'open' check (status in ('open', 'answered', 'closed')),
    agronomist_reply text,
    created_at timestamptz default now(),
    answered_at timestamptz
);

-- 17. ALERTS (Price trigger alerts)
create table if not exists public.alerts (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete cascade,
    commodity text not null,
    condition text not null check (condition in ('above', 'below')),
    target_price numeric(10, 2) not null,
    is_active boolean default true,
    created_at timestamptz default now()
);

-- 18. DEVICES (Expo push tokens & Web Push VAPID subscriptions)
create table if not exists public.devices (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete cascade,
    expo_push_token text,
    web_push_subscription jsonb,
    created_at timestamptz default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.saved_crops enable row level security;
alter table public.commodity_master enable row level security;
alter table public.markets enable row level security;
alter table public.prices enable row level security;
alter table public.price_forecasts enable row level security;
alter table public.products enable row level security;
alter table public.fertilizer_plans enable row level security;
alter table public.product_requests enable row level security;
alter table public.user_soil_inputs enable row level security;
alter table public.channel_identities enable row level security;
alter table public.chat_history enable row level security;
alter table public.handoff_tickets enable row level security;
alter table public.alerts enable row level security;
alter table public.devices enable row level security;

-- Public read-only catalogs
create policy "Products are public read-only" on public.products for select using (true);
create policy "Fertilizer plans are public read-only" on public.fertilizer_plans for select using (true);
create policy "Commodities are public read-only" on public.commodity_master for select using (true);
create policy "Markets are public read-only" on public.markets for select using (true);
create policy "Prices are public read-only" on public.prices for select using (true);
create policy "Forecasts are public read-only" on public.price_forecasts for select using (true);

-- User-scoped policies
create policy "Users manage own profiles" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own saved crops" on public.saved_crops for all using (auth.uid() = user_id);
create policy "Users manage own soil inputs" on public.user_soil_inputs for all using (auth.uid() = user_id);
create policy "Users view own product requests" on public.product_requests for select using (auth.uid() = user_id or auth.uid() is null);
create policy "Users create product requests" on public.product_requests for insert with check (true);
create policy "Users view own chat history" on public.chat_history for select using (auth.uid() = user_id);
create policy "Users view own channel identities" on public.channel_identities for select using (auth.uid() = user_id);
create policy "Users view own handoff tickets" on public.handoff_tickets for select using (auth.uid() = user_id);
create policy "Users manage own alerts" on public.alerts for all using (auth.uid() = user_id);
create policy "Users manage own devices" on public.devices for all using (auth.uid() = user_id);

-- Admin role checks can bypass via service_role key
