export type Language = 'en' | 'hi' | 'kn';

export interface Translations {
  // Brand & Nav
  brand_name: string;
  brand_tagline: string;
  brand_subtitle: string;
  nav_dashboard: string;
  nav_explore: string;
  nav_analysis: string;
  nav_compare: string;
  nav_simulator: string;
  nav_markets: string;
  nav_advisor: string;
  nav_settings: string;
  system_live_data: string;
  last_synced: string;
  back_to_assets: string;
  search_placeholder: string;
  search_prompt_btn: string;
  switch_to: string;
  light_mode: string;
  dark_mode: string;
  verified_bengaluru_db: string;
  verified_ml_models: string;

  // Dashboard
  portfolio_overview: string;
  greeting_investor: string;
  market_dynamics: string;
  hpi_index_label: string;
  portfolio_value: string;
  active_assets: string;
  avg_yield: string;
  ytd_gain: string;
  ai_pulse_title: string;
  ai_pulse_desc: string;
  ask_ai_btn: string;
  new_analysis_btn: string;
  recent_analysis: string;
  view_all: string;

  // Explorer
  all_assets: string;
  commercial: string;
  residential: string;
  villas: string;
  match_badge: string;
  est_value: string;
  proj_roi: string;
  asking_price: string;
  monthly_rent: string;
  no_properties_found: string;

  // Property Analysis
  decision_synthesis: string;
  confidence: string;
  initiate_acquisition: string;
  decision_rationale: string;
  risk_assessment: string;
  market_risk: string;
  price_volatility: string;
  data_fidelity: string;
  ml_fair_value: string;
  asking_vs_fair: string;
  open_simulator: string;

  // Decision Simulator
  simulator_title: string;
  simulator_subtitle: string;
  scenario_variables: string;
  purchase_price: string;
  down_payment: string;
  interest_rate: string;
  target_yield: string;
  holding_period: string;
  years: string;
  reset_base: string;
  base_case: string;
  your_scenario: string;
  net_cash_flow: string;
  monthly_emi: string;
  projected_roi: string;
  future_valuation: string;
  insight_engine: string;
  save_scenario: string;

  // Compare
  compare_title: string;
  compare_subtitle: string;
  add_asset: string;
  property_slot: string;
  metric_col: string;
  location: string;
  category: string;
  verdict: string;
  realvest_top_pick: string;
  highest_roi_desc: string;
  inspect_btn: string;

  // Market Intelligence
  market_intel_title: string;
  market_intel_subtitle: string;
  opportunity_heatmap: string;
  trend_velocity: string;
  five_year_projection: string;
  yoy_average: string;
  yield_trajectories: string;
  cash_on_cash: string;
  cap_rate: string;
  institutional_report_text: string;
  full_report_btn: string;
  zoom_in: string;
  zoom_out: string;
  reset_view: string;

  // AI Advisor
  advisor_title: string;
  advisor_subtitle: string;
  suggested_prompts: string;
  ask_advisor_placeholder: string;
  send_btn: string;
  advisor_greeting: string;
  
  // Settings
  platform_settings: string;
  settings_desc: string;
  visual_archetype: string;
  toggle_theme: string;
  currency_benchmark: string;
  language_preference: string;
  dataset_coverage: string;
  bengaluru_records_count: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brand_name: 'RealVest',
    brand_tagline: 'AI Real Estate Decision Engine',
    brand_subtitle: 'Data-backed valuations, yields, and risk intelligence for Bengaluru real estate.',
    nav_dashboard: 'Dashboard',
    nav_explore: 'Explore',
    nav_analysis: 'Analysis',
    nav_compare: 'Compare',
    nav_simulator: 'Simulator',
    nav_markets: 'Markets',
    nav_advisor: 'AI Advisor',
    nav_settings: 'Settings',
    system_live_data: 'Verified Bengaluru Dataset',
    last_synced: 'Synced with HPI Series',
    back_to_assets: 'Back to Properties',
    search_placeholder: 'Search Bengaluru localities (Whitefield, Indiranagar, HSR, BHK, ID)...',
    search_prompt_btn: 'Search',
    switch_to: 'Switch to',
    light_mode: 'Decision Light',
    dark_mode: 'Electric Obsidian',
    verified_bengaluru_db: 'Bengaluru Market Database',
    verified_ml_models: 'ML Valuation Engine Active',

    portfolio_overview: 'PORTFOLIO OVERVIEW',
    greeting_investor: 'Namaskara, Investor.',
    market_dynamics: 'Bengaluru Market Dynamics',
    hpi_index_label: 'NHB/RBI Residex Housing Price Index',
    portfolio_value: 'BENCHMARK CAPITAL',
    active_assets: 'Monitored Assets',
    avg_yield: 'Avg Rental Yield',
    ytd_gain: '↑ +₹18.5 L [YTD Capital Gain]',
    ai_pulse_title: 'REALVEST AI PULSE',
    ai_pulse_desc: '"Bengaluru IT corridors (Whitefield & Outer Ring Road) show strong rental compression with 7.4% average rental yield and +14.2% capital upside."',
    ask_ai_btn: 'Ask AI Advisor',
    new_analysis_btn: 'New Simulation',
    recent_analysis: 'Recent Property Analyses',
    view_all: 'VIEW ALL',

    all_assets: 'All Assets',
    commercial: 'Commercial',
    residential: 'Residential',
    villas: 'Villas & Penthouses',
    match_badge: 'Match',
    est_value: 'ML FAIR VALUE',
    proj_roi: 'PROJ. ROI',
    asking_price: 'ASKING PRICE',
    monthly_rent: 'EXP. RENT',
    no_properties_found: 'No properties found matching your criteria. Try adjusting your search query.',

    decision_synthesis: 'AI Decision Synthesis',
    confidence: 'CONFIDENCE',
    initiate_acquisition: 'INITIATE ACQUISITION',
    decision_rationale: 'Decision Rationale',
    risk_assessment: 'Risk Assessment',
    market_risk: 'Market Risk',
    price_volatility: 'Price Volatility',
    data_fidelity: 'Data Fidelity',
    ml_fair_value: 'ML Estimated Fair Value',
    asking_vs_fair: 'Asking vs Fair Value',
    open_simulator: 'Open in Simulator',

    simulator_title: 'Decision Simulator',
    simulator_subtitle: 'Simulate financial outcomes, monthly EMI, rental cash flow, and ROI with custom assumptions.',
    scenario_variables: 'Scenario Variables',
    purchase_price: 'PURCHASE PRICE',
    down_payment: 'DOWN PAYMENT',
    interest_rate: 'HOME LOAN INTEREST RATE',
    target_yield: 'EXPECTED RENTAL YIELD',
    holding_period: 'HOLDING PERIOD',
    years: 'Yrs',
    reset_base: 'Reset to Baseline',
    base_case: 'BASE CASE',
    your_scenario: 'YOUR SCENARIO',
    net_cash_flow: 'NET CASH FLOW',
    monthly_emi: 'MONTHLY EMI',
    projected_roi: 'PROJECTED ROI',
    future_valuation: 'FUTURE VALUATION',
    insight_engine: 'Sensitivity Insight Engine',
    save_scenario: 'Save Scenario Simulation',

    compare_title: 'Compare Properties',
    compare_subtitle: 'Side-by-side metric comparison, fair valuation gaps, and top investment pick.',
    add_asset: '+ Add 3rd Property',
    property_slot: 'Property',
    metric_col: 'Metrics',
    location: 'Location',
    category: 'Category',
    verdict: 'Verdict',
    realvest_top_pick: 'REALVEST TOP PICK',
    highest_roi_desc: 'Highest risk-adjusted score and rental yield across selected properties.',
    inspect_btn: 'Inspect',

    market_intel_title: 'Market Intelligence',
    market_intel_subtitle: 'Bengaluru micro-market demand velocity, HPI price index, and yield trajectories.',
    opportunity_heatmap: 'Bengaluru Opportunity Hotspots',
    trend_velocity: 'Trend Velocity',
    five_year_projection: '5Y HPI Capital Appreciation Index',
    yoy_average: 'YOY APPRECIATION',
    yield_trajectories: 'Yield Trajectories',
    cash_on_cash: 'CASH ON CASH YIELD',
    cap_rate: 'GROSS RENTAL CAP',
    institutional_report_text: 'Institutional Bengaluru market analytics show strong tech-corridor absorption across Whitefield, HSR Layout, and Bellandur, with rental yields consistently outperforming national metropolitan averages.',
    full_report_btn: 'Download Intelligence Brief',
    zoom_in: 'Zoom In',
    zoom_out: 'Zoom Out',
    reset_view: 'Center Bengaluru',

    advisor_title: 'AI Decision Advisor',
    advisor_subtitle: 'Grounded real estate decision support backed by Bengaluru housing price models and rental datasets.',
    suggested_prompts: 'Prompts:',
    ask_advisor_placeholder: 'Ask about Bengaluru properties, fair pricing, rental yields, or risk...',
    send_btn: 'Ask AI',
    advisor_greeting: 'Namaskara! I am RealVest AI Decision Advisor. Ask me anything regarding property fair valuations in Bengaluru, expected rental returns, EMI cash flows, or micro-market risk assessments.',

    platform_settings: 'Platform Settings',
    settings_desc: 'Configure visual archetypes, system currency benchmark, and localized language preferences.',
    visual_archetype: 'Visual Archetype Theme',
    toggle_theme: 'Toggle Theme',
    currency_benchmark: 'Currency Benchmark',
    language_preference: 'Language Preference (ಭಾಷೆ / भाषा)',
    dataset_coverage: 'Verified Dataset Coverage',
    bengaluru_records_count: '13,320+ Bengaluru Property Comps & RBI HPI Data',
  },
  hi: {
    brand_name: 'RealVest',
    brand_tagline: 'एआई रियल एस्टेट निर्णय इंजन',
    brand_subtitle: 'बेंगलुरु संपत्तियों के लिए डेटा-समर्थित मूल्यांकन, रिटर्न और जोखिम विश्लेषण।',
    nav_dashboard: 'डैशबोर्ड',
    nav_explore: 'खोजें',
    nav_analysis: 'विश्लेषण',
    nav_compare: 'तुलना करें',
    nav_simulator: 'सिम्युलेटर',
    nav_markets: 'बाज़ार',
    nav_advisor: 'एआई सलाहकार',
    nav_settings: 'सेटिंग्स',
    system_live_data: 'सत्यापित बेंगलुरु डेटासेट',
    last_synced: 'HPI श्रृंखला के साथ समन्वयित',
    back_to_assets: 'वापस संपत्तियों पर जाएं',
    search_placeholder: 'बेंगलुरु इलाके खोजें (व्हाइटफील्ड, इंदिरानगर, HSR, BHK)...',
    search_prompt_btn: 'खोजें',
    switch_to: 'बदलें',
    light_mode: 'निर्णय लाइट',
    dark_mode: 'इलेक्ट्रिक ओब्सीडियन',
    verified_bengaluru_db: 'बेंगलुरु बाज़ार डेटाबेस',
    verified_ml_models: 'एमएल वैल्यूएशन इंजन सक्रिय',

    portfolio_overview: 'पोर्टफोलियो अवलोकन',
    greeting_investor: 'नमस्कार, निवेशक।',
    market_dynamics: 'बेंगलुरु बाज़ार गतिशीलता',
    hpi_index_label: 'NHB/RBI रेसिडेक्स हाउसिंग प्राइस इंडेक्स',
    portfolio_value: 'बेंचमार्क पूंजी',
    active_assets: 'निगरानी संपत्ति',
    avg_yield: 'औसत रेंटल यील्ड',
    ytd_gain: '↑ +₹18.5 लाख [वार्षिक पूंजी लाभ]',
    ai_pulse_title: 'रियलवेस्ट एआई पल्स',
    ai_pulse_desc: '"बेंगलुरु आईटी कॉरिडोर (व्हाइटफील्ड और ओआरआर) 7.4% औसत रेंटल यील्ड और +14.2% पूंजी वृद्धि के साथ मजबूत मांग दिखा रहे हैं।"',
    ask_ai_btn: 'एआई से पूछें',
    new_analysis_btn: 'नया सिमुलेशन',
    recent_analysis: 'हालिया संपत्ति विश्लेषण',
    view_all: 'सभी देखें',

    all_assets: 'सभी संपत्तियां',
    commercial: 'कमर्शियल',
    residential: 'रेजिडेंशियल',
    villas: 'विला और पेंटहाउस',
    match_badge: 'मैच',
    est_value: 'एमएल उचित मूल्य',
    proj_roi: 'अनुमानित आरओआई',
    asking_price: 'मांगी गई कीमत',
    monthly_rent: 'अपेक्षित किराया',
    no_properties_found: 'आपके मानदंडों से मेल खाने वाली कोई संपत्ति नहीं मिली। खोज शब्द बदलें।',

    decision_synthesis: 'एआई निर्णय संश्लेषण',
    confidence: 'विश्वास स्कोर',
    initiate_acquisition: 'अधिग्रहण शुरू करें',
    decision_rationale: 'निर्णय का औचित्य',
    risk_assessment: 'जोखिम मूल्यांकन',
    market_risk: 'बाज़ार जोखिम',
    price_volatility: 'मूल्य अस्थिरता',
    data_fidelity: 'डेटा सटीकता',
    ml_fair_value: 'एमएल अनुमानित उचित मूल्य',
    asking_vs_fair: 'मांग बनाम उचित मूल्य',
    open_simulator: 'सिम्युलेटर में खोलें',

    simulator_title: 'निर्णय सिम्युलेटर',
    simulator_subtitle: 'कस्टम मान्यताओं के साथ वित्तीय परिणाम, मासिक ईएमआई, किराया नकदी प्रवाह और आरओआई का अनुकरण करें।',
    scenario_variables: 'परिदृश्य चर',
    purchase_price: 'खरीद मूल्य',
    down_payment: 'डाउन पेमेंट',
    interest_rate: 'होम लोन ब्याज दर',
    target_yield: 'अपेक्षित रेंटल यील्ड',
    holding_period: 'धारण अवधि',
    years: 'वर्ष',
    reset_base: 'मूल स्थिति में रीसेट करें',
    base_case: 'मूल मामला',
    your_scenario: 'आपका परिदृश्य',
    net_cash_flow: 'शुद्ध नकदी प्रवाह',
    monthly_emi: 'मासिक ईएमआई',
    projected_roi: 'अनुमानित आरओआई',
    future_valuation: 'भविष्य का मूल्यांकन',
    insight_engine: 'संवेदनशीलता अंतर्दृष्टि इंजन',
    save_scenario: 'परिदृश्य सहेजें',

    compare_title: 'संपत्तियों की तुलना करें',
    compare_subtitle: 'साथ-साथ मीट्रिक तुलना, उचित मूल्यांकन अंतर और शीर्ष निवेश विकल्प।',
    add_asset: '+ तीसरी संपत्ति जोड़ें',
    property_slot: 'संपत्ति',
    metric_col: 'मेट्रिक्स',
    location: 'स्थान',
    category: 'श्रेणी',
    verdict: 'निर्णय',
    realvest_top_pick: 'रियलवेस्ट शीर्ष पसंद',
    highest_roi_desc: 'चयनित संपत्तियों में उच्चतम जोखिम-समायोजित स्कोर और रेंटल यील्ड।',
    inspect_btn: 'जांचें',

    market_intel_title: 'बाज़ार की जानकारी',
    market_intel_subtitle: 'बेंगलुरु मांग गति, एचपीआई मूल्य सूचकांक और रिटर्न प्रक्षेपवक्र।',
    opportunity_heatmap: 'बेंगलुरु अवसर हॉटस्पॉट',
    trend_velocity: 'ट्रेंड वेग',
    five_year_projection: '5-वर्षीय HPI पूंजी प्रशंसा सूचकांक',
    yoy_average: 'वार्षिक वृद्धि',
    yield_trajectories: 'यील्ड प्रक्षेपवक्र',
    cash_on_cash: 'कैश ऑन कैश यील्ड',
    cap_rate: 'सकल रेंटल कैप',
    institutional_report_text: 'संस्थागत विश्लेषण से पता चलता है कि व्हाइटफील्ड, एचएसआर लेआउट और बेलंदूर में मजबूत मांग है, जो राष्ट्रीय औसत से बेहतर है।',
    full_report_btn: 'पूरी रिपोर्ट डाउनलोड करें',
    zoom_in: 'ज़ूम इन',
    zoom_out: 'ज़ूम आउट',
    reset_view: 'बेंगलुरु केंद्रित करें',

    advisor_title: 'एआई निर्णय सलाहकार',
    advisor_subtitle: 'बेंगलुरु मूल्य मॉडल और किराया डेटासेट द्वारा समर्थित रियल एस्टेट निर्णय सलाह।',
    suggested_prompts: 'सुझाए गए प्रश्न:',
    ask_advisor_placeholder: 'बेंगलुरु संपत्तियों, उचित मूल्य, किराए या जोखिम के बारे में पूछें...',
    send_btn: 'पूछें',
    advisor_greeting: 'नमस्कार! मैं रियलवेस्ट एआई निर्णय सलाहकार हूँ। बेंगलुरु में संपत्ति मूल्यांकन, अपेक्षित किराए, ईएमआई नकदी प्रवाह या जोखिम के बारे में कुछ भी पूछें।',

    platform_settings: 'सिस्टम सेटिंग्स',
    settings_desc: 'विज़ुअल थीम, मुद्रा मानदंड और भाषा प्राथमिकताएं कॉन्फ़िगर करें।',
    visual_archetype: 'विज़ुअल थीम मोड',
    toggle_theme: 'थीम बदलें',
    currency_benchmark: 'मुद्रा इकाई',
    language_preference: 'भाषा प्राथमिकता (Language / ಭಾಷೆ)',
    dataset_coverage: 'सत्यापित डेटासेट कवरेज',
    bengaluru_records_count: '13,320+ बेंगलुरु संपत्ति रिकॉर्ड और आरबीआई एचपीआई डेटा',
  },
  kn: {
    brand_name: 'RealVest',
    brand_tagline: 'ಎಐ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ನಿರ್ಧಾರ ಇಂಜಿನ್',
    brand_subtitle: 'ಬೆಂಗಳೂರು ರಿಯಲ್ ಎಸ್ಟೇಟ್‌ಗಾಗಿ ಡೇಟಾ-ಬೆಂಬಲಿತ ಮೌಲ್ಯಮಾಪನ, ಬಾಡಿಗೆ ಮತ್ತು ಅಪಾಯದ ವಿಶ್ಲೇಷಣೆ.',
    nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    nav_explore: 'ಅನ್ವೇಷಿಸಿ',
    nav_analysis: 'ವಿಶ್ಲೇಷಣೆ',
    nav_compare: 'ಹೋಲಿಕೆ',
    nav_simulator: 'ಸಿಮ್ಯುಲೇಟರ್',
    nav_markets: 'ಮಾರುಕಟ್ಟೆ',
    nav_advisor: 'ಎಐ ಸಲಹೆಗಾರ',
    nav_settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    system_live_data: 'ದೃಢೀಕೃತ ಬೆಂಗಳೂರು ಡೇಟಾಸೆಟ್',
    last_synced: 'HPI ಸರಣಿಯೊಂದಿಗೆ ನವೀಕರಿಸಲಾಗಿದೆ',
    back_to_assets: 'ಆಸ್ತಿಗಳ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ',
    search_placeholder: 'ಬೆಂಗಳೂರು ಬಡಾವಣೆಗಳನ್ನು ಹುಡುಕಿ (ವೈಟ್‌ಫೀಲ್ಡ್, ಇಂದಿರಾನಗರ, HSR, BHK)...',
    search_prompt_btn: 'ಹುಡುಕಿ',
    switch_to: 'ಬದಲಾಯಿಸಿ',
    light_mode: 'ಡಿಸಿಷನ್ ಲೈಟ್',
    dark_mode: 'ಎಲೆಕ್ಟ್ರಿಕ್ ಅಬ್ಸಿಡಿಯನ್',
    verified_bengaluru_db: 'ಬೆಂಗಳೂರು ಮಾರುಕಟ್ಟೆ ಡೇಟಾಬೇಸ್',
    verified_ml_models: 'ಎಂಎಲ್ ಮೌಲ್ಯಮಾಪನ ಸಕ್ರಿಯವಾಗಿದೆ',

    portfolio_overview: 'ಪೋರ್ಟ್‌ಫೋಲಿಯೊ ಅವಲೋಕನ',
    greeting_investor: 'ನಮಸ್ಕಾರ, ಹೂಡಿಕೆದಾರರೇ.',
    market_dynamics: 'ಬೆಂಗಳೂರು ಮಾರುಕಟ್ಟೆ ಡೈನಾಮಿಕ್ಸ್',
    hpi_index_label: 'NHB/RBI ರೆಸಿಡೆಕ್ಸ್ ಗೃಹ ಬೆಲೆ ಸೂಚ್ಯಂಕ',
    portfolio_value: 'ಬಂಡವಾಳ ಮೌಲ್ಯ',
    active_assets: 'ಮೇಲ್ವಿಚಾರಣೆ ಆಸ್ತಿಗಳು',
    avg_yield: 'ಸರಾಸರಿ ಬಾಡಿಗೆ ಇಳುವರಿ',
    ytd_gain: '↑ +₹18.5 ಲಕ್ಷ [ವಾರ್ಷಿಕ ಬಂಡವಾಳ ಲಾಭ]',
    ai_pulse_title: 'ರಿಯಲ್‌ವೆಸ್ಟ್ ಎಐ ಪಲ್ಸ್',
    ai_pulse_desc: '"ಬೆಂಗಳೂರಿನ ಐಟಿ ಕಾರಿಡಾರ್‌ಗಳು (ವೈಟ್‌ಫೀಲ್ಡ್ ಮತ್ತು ಒಆರ್‌ಆರ್) 7.4% ಸರಾಸರಿ ಬಾಡಿಗೆ ಇಳುವರಿ ಮತ್ತು +14.2% ಬೆಲೆ ಏರಿಕೆಯೊಂದಿಗೆ ಬಲವಾದ ಬೇಡಿಕೆಯನ್ನು ಹೊಂದಿವೆ."',
    ask_ai_btn: 'ಎಐ ಅನ್ನು ಕೇಳಿ',
    new_analysis_btn: 'ಹೊಸ ಸಿಮ್ಯುಲೇಶನ್',
    recent_analysis: 'ಇತ್ತೀಚಿನ ಆಸ್ತಿ ವಿಶ್ಲೇಷಣೆ',
    view_all: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',

    all_assets: 'ಎಲ್ಲಾ ಆಸ್ತಿಗಳು',
    commercial: 'ವಾಣಿಜ್ಯ',
    residential: 'ವಸತಿ',
    villas: 'ವಿಲ್ಲಾಗಳು & ಪೆಂಟ್‌ಹೌಸ್',
    match_badge: 'ಹೊಂದಾಣಿಕೆ',
    est_value: 'ಎಂಎಲ್ ನ್ಯಾಯಯುತ ಬೆಲೆ',
    proj_roi: 'ಅಂದಾಜು ಆರ್‌ಒಐ',
    asking_price: 'ಕೇಳಲಾದ ಬೆಲೆ',
    monthly_rent: 'ಅಂದಾಜು ಬಾಡಿಗೆ',
    no_properties_found: 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಆಸ್ತಿಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಪದಗಳನ್ನು ಬಳಸಿ.',

    decision_synthesis: 'ಎಐ ನಿರ್ಧಾರ ಸಂಶ್ಲೇಷಣೆ',
    confidence: 'ವಿಶ್ವಾಸಾರ್ಹತೆ',
    initiate_acquisition: 'ಖರೀದಿ ಪ್ರಕ್ರಿಯೆ ಆರಂಭಿಸಿ',
    decision_rationale: 'ನಿರ್ಧಾರದ ಕಾರಣಗಳು',
    risk_assessment: 'ಅಪಾಯ ಮೌಲ್ಯಮಾಪನ',
    market_risk: 'ಮಾರುಕಟ್ಟೆ ಅಪಾಯ',
    price_volatility: 'ಬೆಲೆ ಅಸ್ಥಿರತೆ',
    data_fidelity: 'ಡೇಟಾ ನಿಖರತೆ',
    ml_fair_value: 'ಎಂಎಲ್ ಅಂದಾಜು ನ್ಯಾಯಯುತ ಮೌಲ್ಯ',
    asking_vs_fair: 'ಕೇಳಲಾದ ಬೆಲೆ vs ನ್ಯಾಯಯುತ ಬೆಲೆ',
    open_simulator: 'ಸಿಮ್ಯುಲೇಟರ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ',

    simulator_title: 'ನಿರ್ಧಾರ ಸಿಮ್ಯುಲೇಟರ್',
    simulator_subtitle: 'ನಿಮ್ಮ ಊಹೆಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಇಎಂಐ, ಬಾಡಿಗೆ ನಗದು ಹರಿವು ಮತ್ತು ಆರ್‌ಒಐ ಲೆಕ್ಕಹಾಕಿ.',
    scenario_variables: 'ಸನ್ನಿವೇಶದ ನಿಯತಾಂಕಗಳು',
    purchase_price: 'ಖರೀದಿ ಬೆಲೆ',
    down_payment: 'ಡೌನ್ ಪೇಮೆಂಟ್',
    interest_rate: 'ಗೃಹ ಸಾಲದ ಬಡ್ಡಿ ದರ',
    target_yield: 'ನಿರೀಕ್ಷಿತ ಬಾಡಿಗೆ ಇಳುವರಿ',
    holding_period: 'ಹೂಡಿಕೆಯ ಅವಧಿ',
    years: 'ವರ್ಷಗಳು',
    reset_base: 'ಮೂಲ ಸ್ಥಿತಿಗೆ ಮರುಹೊಂದಿಸಿ',
    base_case: 'ಮೂಲ ಸನ್ನಿವೇಶ',
    your_scenario: 'ನಿಮ್ಮ ಸನ್ನಿವೇಶ',
    net_cash_flow: 'ನಿವ್ವಳ ನಗದು ಹರಿವು',
    monthly_emi: 'ಮಾಸಿಕ ಇಎಂಐ',
    projected_roi: 'ಅಂದಾಜು ಆರ್‌ಒಐ',
    future_valuation: 'ಭವಿಷ್ಯದ ಆಸ್ತಿ ಮೌಲ್ಯ',
    insight_engine: 'ಸೂಕ್ಷ್ಮತೆಯ ಒಳನೋಟ ಇಂಜಿನ್',
    save_scenario: 'ಸನ್ನಿವೇಶವನ್ನು ಉಳಿಸಿ',

    compare_title: 'ಆಸ್ತಿಗಳ ಹೋಲಿಕೆ',
    compare_subtitle: 'ಪಕ್ಕಪಕ್ಕದ ಮೆಟ್ರಿಕ್ ಹೋಲಿಕೆ, ನ್ಯಾಯಯುತ ಬೆಲೆ ಅಂತರ ಮತ್ತು ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ.',
    add_asset: '+ 3ನೇ ಆಸ್ತಿ ಸೇರಿಸಿ',
    property_slot: 'ಆಸ್ತಿ',
    metric_col: 'ಮೆಟ್ರಿಕ್ಸ್',
    location: 'ಸ್ಥಳ',
    category: 'ವರ್ಗ',
    verdict: 'ತೀರ್ಪು',
    realvest_top_pick: 'ರಿಯಲ್‌ವೆಸ್ಟ್ ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ',
    highest_roi_desc: 'ಆಯ್ಕೆಮಾಡಿದ ಆಸ್ತಿಗಳಲ್ಲಿ ಗರಿಷ್ಠ ಇಳುವರಿ ಮತ್ತು ಕಡಿಮೆ ಅಪಾಯದ ಆಯ್ಕೆ.',
    inspect_btn: 'ಪರಿಶೀಲಿಸಿ',

    market_intel_title: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ',
    market_intel_subtitle: 'ಬೆಂಗಳೂರು ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ, ಎಚ್‌ಪಿಐ ಬೆಲೆ ಸೂಚ್ಯಂಕ ಮತ್ತು ಇಳುವರಿ ಮಾಹಿತಿ.',
    opportunity_heatmap: 'ಬೆಂಗಳೂರು ಅವಕಾಶ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು',
    trend_velocity: 'ಬೆಳವಣಿಗೆ ವೇಗ',
    five_year_projection: '5 ವರ್ಷಗಳ HPI ಬೆಲೆ ಏರಿಕೆ ಸೂಚ್ಯಂಕ',
    yoy_average: 'ವಾರ್ಷಿಕ ಸರಾಸರಿ',
    yield_trajectories: 'ಇಳುವರಿ ವಿವರ',
    cash_on_cash: 'ಕ್ಯಾಶ್ ಆನ್ ಕ್ಯಾಶ್ ಇಳುವರಿ',
    cap_rate: 'ಒಟ್ಟು ಬಾಡಿಗೆ ಕ್ಯಾಪ್',
    institutional_report_text: 'ವೈಟ್‌ಫೀಲ್ಡ್, ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್ ಮತ್ತು ಬೆಳ್ಳಂದೂರಿನಲ್ಲಿ ಬಲವಾದ ಬೇಡಿಕೆ ಮುಂದುವರೆದಿದ್ದು, ರಾಷ್ಟ್ರೀಯ ಸರಾಸರಿಗಿಂತ ಉತ್ತಮ ಆದಾಯವನ್ನು ನೀಡುತ್ತಿದೆ.',
    full_report_btn: 'ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    zoom_in: 'ಹಿಗ್ಗಿಸಿ',
    zoom_out: 'ಕುಗ್ಗಿಸಿ',
    reset_view: 'ಬೆಂಗಳೂರು ಕೇಂದ್ರಿತ',

    advisor_title: 'ಎಐ ನಿರ್ಧಾರ ಸಲಹೆಗಾರ',
    advisor_subtitle: 'ಬೆಂಗಳೂರು ಗೃಹ ಬೆಲೆ ಮಾದರಿಗಳ ಆಧಾರದ ಮೇಲೆ ನೈಜ ನಿರ್ಧಾರ ಬೆಂಬಲ.',
    suggested_prompts: 'ಸಲಹೆ ಪ್ರಶ್ನೆಗಳು:',
    ask_advisor_placeholder: 'ಬೆಂಗಳೂರು ಆಸ್ತಿಗಳು, ಮೌಲ್ಯಮಾಪನ, ಬಾಡಿಗೆ ಅಥವಾ ಅಪಾಯದ ಬಗ್ಗೆ ಕೇಳಿ...',
    send_btn: 'ಕೇಳಿ',
    advisor_greeting: 'ನಮಸ್ಕಾರ! ನಾನು ರಿಯಲ್‌ವೆಸ್ಟ್ ಎಐ ಸಲಹೆಗಾರ. ಬೆಂಗಳೂರಿನ ಆಸ್ತಿಗಳ ಬೆಲೆ, ಬಾಡಿಗೆ ಆದಾಯ, ಇಎಂಐ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.',

    platform_settings: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    settings_desc: 'ಥೀಮ್, ಕರೆನ್ಸಿ ಮಾನದಂಡ ಮತ್ತು ಭಾಷಾ ಆಯ್ಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
    visual_archetype: 'ಥೀಮ್ ಶೈಲಿ',
    toggle_theme: 'ಥೀಮ್ ಬದಲಾಯಿಸಿ',
    currency_benchmark: 'ಕರೆನ್ಸಿ ಮಾನದಂಡ',
    language_preference: 'ಭಾಷಾ ಆದ್ಯತೆ (Language / भाषा)',
    dataset_coverage: 'ದೃಢೀಕೃತ ಡೇಟಾಸೆಟ್ ವ್ಯಾಪ್ತಿ',
    bengaluru_records_count: '13,320+ ಬೆಂಗಳೂರು ಆಸ್ತಿ ದಾಖಲೆಗಳು ಮತ್ತು ಆರ್‌ಬಿಐ ಎಚ್‌ಪಿಐ ಡೇಟಾ',
  }
};
