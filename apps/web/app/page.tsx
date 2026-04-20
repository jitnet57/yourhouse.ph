'use client';

import { ShieldCheck, MapPin, Calculator, MessageSquare, Clock, Star, Volume2, X, Globe, Phone, Mail, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

type Language = 'en' | 'ko' | 'ja' | 'zh';
type PropertyTab = 'buy' | 'rent' | 'sold' | 'address' | 'agents';

const translations = {
  en: {
    nav: {
      browse: 'Browse',
      type: 'Property Type',
      location: 'Location',
      signin: 'Sign In',
      links: { buy: 'Buy', rent: 'Rent', sold: 'Sold', newLaunches: 'New Launches', findAgents: 'Find Agents', investmentLoans: 'Investment Loans', marketNews: 'Market News' },
    },
    hero: {
      title: "Discover Cebu's Coastal Investment Market",
      subtitle: 'Curated luxury listings, smart underwriting, and local market intelligence driven by orchestration from Cebu IT Park.',
      promo: 'AI orchestration at 38 Ave IT Park',
      search: 'Search',
      placeholder: 'Search suburbs, assets or agents',
      location: 'Location',
      type: 'Type',
      budget: 'Max Budget',
      find: 'Find Properties',
      volume: 'Volume Sold',
      listings: 'Active Listings',
      agency: '#1 Real Estate Platform',
      tabs: { buy: 'Buy', rent: 'Rent', invest: 'Invest' },
      searchTabs: { buy: 'Buy', rent: 'Rent', sold: 'Sold', address: 'Address', agents: 'Agents' },
      tabDescription: {
        buy: 'Explore handpicked Cebu residences with strong rental yield and resale upside.',
        rent: 'Find premium coastal rentals with flexible terms and exceptional tenant demand.',
        invest: 'Access investor-grade developments with AI-verified returns and transparent risk metrics.',
      },
      asset: { featured: 'Featured asset', highYield: 'High Yield', location: 'Location', price: 'Price', type: 'Type' },
    },
    stats: {
      verifiedListings: 'Verified Listings',
      avgRoi: 'Avg. ROI',
      propertiesVerified: 'Properties Verified',
      aiAccuracy: 'AI Accuracy Rate',
      averageRoi: 'Average ROI',
    },
    featuredPortfolio: { label: 'Investment Portfolio', title: 'Featured Opportunities', prev: 'Previous', next: 'Next' },
    card: {
      premiumAgent: 'Premium Agent',
      analysis: 'AI Analysis',
      support: '24/7 Support',
      description: 'Real-time AI-powered property evaluation and investment guidance.',
      schedule: 'Schedule Consult',
      report: 'Get Report',
    },
    features: {
      amenities: 'Premium Amenities',
      primeLocation: 'Prime Location',
      locationLabel: 'Cebu IT Park Hub',
      verification: 'Verification',
      analytics: 'Analytics',
      support: 'Support',
      accuracy: '99.8% Accuracy',
      roiData: 'Real ROI Data',
      consultation: '24/7 Consultation',
      verificationDesc: 'Advanced AI algorithms verify every property detail with precision.',
      analyticsDesc: 'Transparent calculations including all costs and market factors.',
      supportDesc: 'Voice-enabled AI agents ready to assist your investment journey.',
    },
    cta: {
      label: 'Investment Ready',
      title: 'Start Your Portfolio',
      subtitle: 'Get comprehensive AI analysis, market insights, and personalized investment recommendations.',
      schedule: 'Free Analysis',
      browse: 'Browse Properties',
      note: 'No credit card required • Free AI analysis • Cancel anytime',
    },
    widget: {
      badge: 'PREMIUM AGENT',
      helpTitle: 'Need help?',
      helpText: 'Ask about investments, ROI, or consultations',
      call: 'Start a call',
      askText: 'Ask about properties and ROI analysis',
      realTime: 'Real-time AI analysis',
    },
    footer: { quick: 'Quick Links', services: 'Services', contact: 'Contact Us', address: 'Cebu IT Park', phone: '+63 (32) 888-1234', email: 'invest@yourhouse.ph', rights: '© 2026 YourHouse.PH. All rights reserved.' },
    voice: { title: 'AI Consultant', start: 'Start Voice Chat', stop: 'Stop', listening: 'Listening...', speaking: 'Speaking...' },
    navContent: {
      buy: '🏠 Properties for Sale',
      rent: '🔑 Rental Properties',
      sold: '✅ Recently Sold',
      newLaunches: '🆕 New Launches',
      findAgents: '👥 Expert Agents',
      investmentLoans: '💰 Investment Loans',
      marketNews: '📊 Market News',
      results: 'results',
      viewDetails: 'View Details',
      managedProperties: 'Managed Properties',
      avgRoi: 'Avg. ROI',
      requestConsult: 'Request Consultation',
      loanInquiry: 'Loan Inquiry',
      term: 'Term',
      limit: 'Limit',
      verified: 'Verified',
      readReport: 'Read Report',
      loans: {
        premiumMortgage: { name: 'Premium Mortgage', term: '30 years', features: ['Low Interest Rate', 'Flexible Repayment'] },
        quickInvestment: { name: 'Quick Investment', term: '15 years', features: ['Fast Approval', 'No Collateral'] },
        luxuryPropertyLoan: { name: 'Luxury Property Loan', term: '25 years', features: ['Luxury Only', 'Premium Benefits'] },
        firstTimeBuyer: { name: 'First-Time Buyer', term: '20 years', features: ['For Beginners', 'Low Rate'] },
        commercialLoan: { name: 'Commercial Loan', term: '20 years', features: ['Commercial', 'High Limit'] },
      },
      tourBooking: {
        title: '📅 Book a Property Tour',
        subtitle: 'Select a date and time with our agents',
        description: 'Fill in your details and our agent will confirm your tour within 2 hours.',
        fullName: 'Full Name',
        fullNamePlaceholder: 'Your name',
        phone: 'Phone / WhatsApp',
        phonePlaceholder: '+63 XXX XXX XXXX',
        email: 'Email',
        emailPlaceholder: 'you@email.com',
        dateTime: 'Preferred Date & Time',
        message: 'Message (Optional)',
        messagePlaceholder: 'Which property are you interested in?',
        submit: '📅 Request Tour Booking',
        bookDirect: 'Or book directly:',
        bookTour: 'Book Tour',
      },
    },
  },
  ko: {
    nav: {
      browse: '찾기',
      type: '매물 유형',
      location: '지역',
      signin: '로그인',
      links: { buy: '구매', rent: '임대', sold: '판매', newLaunches: '신규 출시', findAgents: '에이전트 찾기', investmentLoans: '투자 대출', marketNews: '시장 뉴스' },
    },
    hero: {
      title: '세부 해안 투자 시장을 발견하세요',
      subtitle: '럭셔리 매물, 스마트 언더라이팅, 현지 시장 인텔리전스를 통해 고급 투자자를 위한 최적의 플랫폼입니다.',
      promo: 'AI가 제안하는 럭셔리 매물',
      search: '검색',
      placeholder: '커뮤니티, 자산 또는 에이전트를 검색하세요',
      location: '지역',
      type: '유형',
      budget: '최대 예산',
      find: '매물 찾기',
      volume: '거래량',
      listings: '활성 매물',
      agency: '#1 부동산 플랫폼',
      tabs: { buy: '구매', rent: '임대', invest: '투자' },
      searchTabs: { buy: '구매', rent: '임대', sold: '판매', address: '지역', agents: '에이전트' },
      tabDescription: {
        buy: '강력한 임대 수익과 재판매 잠재력을 갖춘 세부 주거지를 찾아보세요.',
        rent: '유연한 조건과 뛰어난 임대 수요를 가진 해안 임대 매물을 찾으세요.',
        invest: 'AI 검증 수익과 투명한 리스크 지표를 갖춘 투자 등급 개발을 확인하세요.',
      },
      asset: { featured: '추천 자산', highYield: '높은 수익', location: '위치', price: '가격', type: '유형' },
    },
    stats: {
      verifiedListings: '검증된 매물',
      avgRoi: '평균 ROI',
      propertiesVerified: '검증된 매물',
      aiAccuracy: 'AI 정확도',
      averageRoi: '평균 ROI',
    },
    featuredPortfolio: { label: '투자 포트폴리오', title: '추천 기회', prev: '이전', next: '다음' },
    card: {
      premiumAgent: '프리미엄 에이전트',
      analysis: 'AI 분석',
      support: '24시간 지원',
      description: '실시간 AI 기반 부동산 평가 및 투자 안내.',
      schedule: '상담 예약',
      report: '보고서 받기',
    },
    features: {
      amenities: '프리미엄 편의시설',
      primeLocation: '핵심 위치',
      locationLabel: '세부 IT 파크 허브',
      verification: '검증',
      analytics: '분석',
      support: '지원',
      accuracy: '99.8% 정확도',
      roiData: '실제 ROI 데이터',
      consultation: '24/7 상담',
      verificationDesc: '고급 AI 알고리즘이 모든 매물 정보를 정확하게 검증합니다.',
      analyticsDesc: '모든 비용과 시장 요소를 포함한 투명한 계산.',
      supportDesc: '음성 AI 에이전트가 투자 여정을 도와드립니다.',
    },
    cta: {
      label: '투자 준비 완료',
      title: '투자 포트폴리오를 시작하세요',
      subtitle: '포괄적인 AI 분석, 시장 인사이트 및 맞춤형 투자 권장 사항을 받으세요.',
      schedule: '무료 분석',
      browse: '매물 찾기',
      note: '신용카드 불필요 • 무료 AI 분석 • 언제든 취소 가능',
    },
    widget: {
      badge: '프리미엄 에이전트',
      helpTitle: '도움이 필요하신가요?',
      helpText: '투자, ROI 또는 상담을 문의하세요',
      call: '통화 시작',
      askText: '매물 및 수익 분석을 문의하세요',
      realTime: '실시간 AI 분석',
    },
    footer: { quick: '빠른 링크', services: '서비스', contact: '연락처', address: '세부 IT파크', phone: '+63 (32) 888-1234', email: 'invest@yourhouse.ph', rights: '© 2026 YourHouse.PH. 모든 권리 보유.' },
    voice: { title: 'AI 상담원', start: '음성 상담 시작', stop: '중지', listening: '듣는 중...', speaking: '말하는 중...' },
    navContent: {
      buy: '🏠 구매 매물',
      rent: '🔑 임대 매물',
      sold: '✅ 판매 완료',
      newLaunches: '🆕 신규 출시',
      findAgents: '👥 전문 에이전트',
      investmentLoans: '💰 투자 대출',
      marketNews: '📊 시장 뉴스',
      results: '개 결과',
      viewDetails: '상세보기',
      managedProperties: '매물 관리',
      avgRoi: '평균 ROI',
      requestConsult: '상담 요청',
      loanInquiry: '대출 문의',
      term: '기간',
      limit: '한도',
      verified: '검증됨',
      readReport: '보고서 읽기',
      loans: {
        premiumMortgage: { name: 'Premium Mortgage', term: '30년', features: ['낮은 이자율', '유연한 상환'] },
        quickInvestment: { name: 'Quick Investment', term: '15년', features: ['빠른 승인', '담보 무관'] },
        luxuryPropertyLoan: { name: 'Luxury Property Loan', term: '25년', features: ['럭셔리 전용', '프리미엄 혜택'] },
        firstTimeBuyer: { name: 'First-Time Buyer', term: '20년', features: ['초보자 전용', '저금리'] },
        commercialLoan: { name: 'Commercial Loan', term: '20년', features: ['상업용', '높은 한도'] },
      },
      tourBooking: {
        title: '📅 투어 예약하기',
        subtitle: '에이전트와 함께 날짜와 시간을 선택하세요',
        description: '정보를 입력하면 2시간 이내에 투어를 확인해드립니다.',
        fullName: '이름',
        fullNamePlaceholder: '당신의 이름',
        phone: '전화 / WhatsApp',
        phonePlaceholder: '+63 XXX XXX XXXX',
        email: '이메일',
        emailPlaceholder: 'you@email.com',
        dateTime: '희망 날짜 및 시간',
        message: '메시지 (선택사항)',
        messagePlaceholder: '관심 있는 부동산은?',
        submit: '📅 투어 예약 요청',
        bookDirect: '또는 직접 예약:',
        bookTour: '투어 예약',
      },
    },
  },
  ja: {
    nav: {
      browse: '検索',
      type: '物件タイプ',
      location: 'エリア',
      signin: 'ログイン',
      links: { buy: '購入', rent: '賃貸', sold: '売却', newLaunches: '新規公開', findAgents: 'エージェント検索', investmentLoans: '投資ローン', marketNews: '市場ニュース' },
    },
    hero: {
      title: 'セブの沿岸投資市場を発見',
      subtitle: '洗練された高級物件、スマートアンダーライティング、地域市場インテリジェンスを提供します。',
      promo: 'AIで導くラグジュアリー物件',
      search: '検索',
      placeholder: '地域、資産、またはエージェントを検索',
      location: 'エリア',
      type: 'タイプ',
      budget: '予算',
      find: '物件を探す',
      volume: '取引高',
      listings: 'アクティブ物件',
      agency: '#1 不動産プラットフォーム',
      tabs: { buy: '購入', rent: '賃貸', invest: '投資' },
      searchTabs: { buy: '購入', rent: '賃貸', sold: '売却', address: '場所', agents: 'エージェント' },
      tabDescription: {
        buy: '高い賃料収益と転売の可能性を備えたセブの厳選住宅を探しましょう。',
        rent: '柔軟な条件と優れたテナント需要を持つ高級沿岸賃貸を見つけましょう。',
        invest: 'AI検証済みのリターンと透明なリスク指標を備えた投資等級開発物件にアクセスします。',
      },
      asset: { featured: '特集資産', highYield: '高収益', location: '場所', price: '価格', type: 'タイプ' },
    },
    stats: {
      verifiedListings: '検証済み物件',
      avgRoi: '平均 ROI',
      propertiesVerified: '検証済み物件',
      aiAccuracy: 'AI 精度',
      averageRoi: '平均 ROI',
    },
    featuredPortfolio: { label: '投資ポートフォリオ', title: '特集機会', prev: '前へ', next: '次へ' },
    card: {
      premiumAgent: 'プレミアムエージェント',
      analysis: 'AI 分析',
      support: '24時間サポート',
      description: 'リアルタイムAIによる物件評価と投資ガイダンス。',
      schedule: '相談を予約',
      report: 'レポートを入手',
    },
    features: {
      amenities: 'プレミアム設備',
      primeLocation: '一等地',
      locationLabel: 'セブITパークハブ',
      verification: '検証',
      analytics: '分析',
      support: 'サポート',
      accuracy: '99.8% 精度',
      roiData: '実際の ROI データ',
      consultation: '24/7相談',
      verificationDesc: '高度なAIアルゴリズムがすべての物件詳細を正確に検証します。',
      analyticsDesc: 'すべての費用と市場要因を含む透明な計算。',
      supportDesc: '音声AIエージェントが投資をサポートします。',
    },
    cta: {
      label: '投資準備完了',
      title: 'ポートフォリオを始めましょう',
      subtitle: '包括的なAI分析、市場洞察、パーソナライズされた投資推奨を入手します。',
      schedule: '無料分析',
      browse: '物件を探す',
      note: 'クレジットカード不要 • 無料AI分析 • いつでもキャンセル可能',
    },
    widget: {
      badge: 'プレミアムエージェント',
      helpTitle: 'お困りですか？',
      helpText: '投資、ROI、または相談についてお尋ねください',
      call: '通話を開始',
      askText: '物件とROI分析について質問する',
      realTime: 'リアルタイムAI分析',
    },
    footer: { quick: 'クイックリンク', services: 'サービス', contact: 'お問い合わせ', address: 'セブITパーク', phone: '+63 (32) 888-1234', email: 'invest@yourhouse.ph', rights: '© 2026 YourHouse.PH. すべての権利を保有。' },
    voice: { title: 'AI 相談員', start: '音声相談開始', stop: '停止', listening: '聴取中...', speaking: '話し中...' },
    navContent: {
      buy: '🏠 購入物件',
      rent: '🔑 賃貸物件',
      sold: '✅ 売却済み',
      newLaunches: '🆕 新規公開',
      findAgents: '👥 専門エージェント',
      investmentLoans: '💰 投資ローン',
      marketNews: '📊 市場ニュース',
      results: '件の結果',
      viewDetails: '詳細を見る',
      managedProperties: '管理物件',
      avgRoi: '平均 ROI',
      requestConsult: '相談を依頼',
      loanInquiry: 'ローン問い合わせ',
      term: '期間',
      limit: '限度額',
      verified: '検証済み',
      readReport: 'レポートを読む',
      loans: {
        premiumMortgage: { name: 'Premium Mortgage', term: '30年', features: ['低金利', '柔軟な返済'] },
        quickInvestment: { name: 'Quick Investment', term: '15年', features: ['迅速な承認', '無担保'] },
        luxuryPropertyLoan: { name: 'Luxury Property Loan', term: '25年', features: ['高級物件専用', 'プレミアム特典'] },
        firstTimeBuyer: { name: 'First-Time Buyer', term: '20年', features: ['初心者向け', '低金利'] },
        commercialLoan: { name: 'Commercial Loan', term: '20年', features: ['商業用', '高限度額'] },
      },
      tourBooking: {
        title: '📅 ツアーを予約する',
        subtitle: 'エージェントと一緒に日付と時刻を選択してください',
        description: '詳細を入力していただくと、2時間以内にツアーを確認いたします。',
        fullName: 'お名前',
        fullNamePlaceholder: 'あなたのお名前',
        phone: '電話 / WhatsApp',
        phonePlaceholder: '+63 XXX XXX XXXX',
        email: 'メール',
        emailPlaceholder: 'you@email.com',
        dateTime: 'ご希望の日時',
        message: 'メッセージ (オプション)',
        messagePlaceholder: 'ご興味のある物件は?',
        submit: '📅 ツアー予約をリクエスト',
        bookDirect: '別のご予約方法:',
        bookTour: 'ツアーを予約',
      },
    },
  },
  zh: {
    nav: {
      browse: '浏览',
      type: '物业类型',
      location: '地点',
      signin: '登录',
      links: { buy: '买', rent: '租', sold: '售出', newLaunches: '新上线', findAgents: '寻找经纪人', investmentLoans: '投资贷款', marketNews: '市场新闻' },
    },
    hero: {
      title: '探索宿务沿海投资市场',
      subtitle: '精心策划的豪华房源、智能承保和本地市场情报，为高端投资者打造。',
      promo: 'AI赋能的豪华房源',
      search: '搜索',
      placeholder: '搜索社区、资产或经纪人',
      location: '地点',
      type: '类型',
      budget: '最高预算',
      find: '查找房源',
      volume: '成交量',
      listings: '活跃房源',
      agency: '#1 房地产平台',
      tabs: { buy: '买', rent: '租', invest: '投资' },
      searchTabs: { buy: '买', rent: '租', sold: '售出', address: '地点', agents: '经纪人' },
      tabDescription: {
        buy: '探索精心挑选的宿务住宅，享受高租金收益和再售潜力。',
        rent: '查找灵活合约、高需求的优质沿海租赁房源。',
        invest: '获取 AI 验证回报和透明风险指标的投资级项目。',
      },
      asset: { featured: '精选资产', highYield: '高收益', location: '地点', price: '价格', type: '类型' },
    },
    stats: {
      verifiedListings: '已验证房源',
      avgRoi: '平均 ROI',
      propertiesVerified: '已验证房源',
      aiAccuracy: 'AI 准确率',
      averageRoi: '平均 ROI',
    },
    featuredPortfolio: { label: '投资组合', title: '精选机会', prev: '上一个', next: '下一个' },
    card: {
      premiumAgent: '高级顾问',
      analysis: 'AI 分析',
      support: '24/7 支持',
      description: '实时 AI 驱动的房产评估与投资指导。',
      schedule: '预约咨询',
      report: '获取报告',
    },
    features: {
      amenities: '尊享设施',
      primeLocation: '黄金地段',
      locationLabel: '宿务 IT 公园枢纽',
      verification: '验证',
      analytics: '分析',
      support: '支持',
      accuracy: '99.8% 准确率',
      roiData: '真实 ROI 数据',
      consultation: '全天候咨询',
      verificationDesc: '先进的 AI 算法精准验证每一处房产信息。',
      analyticsDesc: '透明计算涵盖所有成本和市场因素。',
      supportDesc: '语音 AI 客服随时协助您的投资之旅。',
    },
    cta: {
      label: '投资准备就绪',
      title: '开启投资组合',
      subtitle: '获取全面 AI 分析、市场洞察和个性化投资建议。',
      schedule: '免费分析',
      browse: '浏览房源',
      note: '无需信用卡 • 免费 AI 分析 • 随时取消',
    },
    widget: {
      badge: '高级顾问',
      helpTitle: '需要帮助吗？',
      helpText: '咨询投资、ROI 或预约服务',
      call: '开始通话',
      askText: '咨询房产和收益分析',
      realTime: '实时 AI 分析',
    },
    footer: { quick: '快速链接', services: '服务', contact: '联系我们', address: '宿务 IT 园区', phone: '+63 (32) 888-1234', email: 'invest@yourhouse.ph', rights: '© 2026 YourHouse.PH。保留所有权利。' },
    voice: { title: 'AI 咨询', start: '开始语音聊天', stop: '停止', listening: '正在聆听...', speaking: '正在讲话...' },
    navContent: {
      buy: '🏠 待售房源',
      rent: '🔑 租赁房源',
      sold: '✅ 已售房源',
      newLaunches: '🆕 新上线',
      findAgents: '👥 专业经纪人',
      investmentLoans: '💰 投资贷款',
      marketNews: '📊 市场新闻',
      results: '个结果',
      viewDetails: '查看详情',
      managedProperties: '管理房源',
      avgRoi: '平均 ROI',
      requestConsult: '申请咨询',
      loanInquiry: '贷款咨询',
      term: '期限',
      limit: '额度',
      verified: '已验证',
      readReport: '阅读报告',
      loans: {
        premiumMortgage: { name: 'Premium Mortgage', term: '30年', features: ['低利率', '灵活还款'] },
        quickInvestment: { name: 'Quick Investment', term: '15年', features: ['快速审批', '无需抵押'] },
        luxuryPropertyLoan: { name: 'Luxury Property Loan', term: '25年', features: ['豪宅专用', '尊享特权'] },
        firstTimeBuyer: { name: 'First-Time Buyer', term: '20年', features: ['新手专属', '低利率'] },
        commercialLoan: { name: 'Commercial Loan', term: '20年', features: ['商业用途', '高额度'] },
      },
      tourBooking: {
        title: '📅 预约房产参观',
        subtitle: '与我们的代理选择日期和时间',
        description: '填写您的信息，我们的代理将在2小时内确认您的参观。',
        fullName: '全名',
        fullNamePlaceholder: '您的名字',
        phone: '电话 / WhatsApp',
        phonePlaceholder: '+63 XXX XXX XXXX',
        email: '电子邮件',
        emailPlaceholder: 'you@email.com',
        dateTime: '首选日期和时间',
        message: '留言 (可选)',
        messagePlaceholder: '您对哪个房产感兴趣?',
        submit: '📅 请求参观预约',
        bookDirect: '或直接预约:',
        bookTour: '预约参观',
      },
    },
  },
};

type ColorTheme = 'night' | 'day';

const colorThemes = {
  night: {
    bg: '#0A2540',
    text: '#FFFFFF',
    accent: '#60c6d4',
    card: '#051827',
    label: '🌙 Night',
  },
  day: {
    bg: '#F5F8FC',
    text: '#0A2540',
    accent: '#0088AA',
    card: '#FFFFFF',
    label: '☀️ Day',
  },
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  // Force English as default display regardless of browser locale
  // (user request: show all data in English by default)
  const t = translations[language];
  const [colorTheme, setColorTheme] = useState<ColorTheme>('night');
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<PropertyTab>('buy');
  const [heroTab, setHeroTab] = useState<'buy' | 'rent' | 'invest'>('buy');
  const [activeNavItem, setActiveNavItem] = useState<'buy' | 'rent' | 'sold' | 'newLaunches' | 'findAgents' | 'investmentLoans' | 'marketNews'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredActive, setFeaturedActive] = useState(0);
  const [activeMap, setActiveMap] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [detailModal, setDetailModal] = useState<{ type: 'property' | 'agent' | 'loan' | 'report'; data: any } | null>(null);
  const [aiAnalysisOpen, setAiAnalysisOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [compareOpen, setCompareOpen] = useState(false);
  const [tourBookingOpen, setTourBookingOpen] = useState(false);

  const handleSampleLogin = (provider?: 'google' | 'facebook' | 'email') => {
    const sampleUser = provider === 'google'
      ? { email: 'demo@gmail.com', name: 'Google User' }
      : provider === 'facebook'
      ? { email: 'demo@facebook.com', name: 'Facebook User' }
      : { email: 'demo@yourhouse.ph', name: 'Demo User' };
    setCurrentUser(sampleUser);
    setShowAuthModal(false);
  };

  const handleSampleSignUp = () => {
    setCurrentUser({ email: 'newuser@yourhouse.ph', name: 'New User' });
    setShowAuthModal(false);
  };

  const theme = colorThemes[colorTheme];

  const navItems = [
    { key: 'buy', label: t.nav.links.buy },
    { key: 'rent', label: t.nav.links.rent },
    { key: 'sold', label: t.nav.links.sold },
    { key: 'newLaunches', label: t.nav.links.newLaunches },
    { key: 'findAgents', label: t.nav.links.findAgents },
    { key: 'investmentLoans', label: t.nav.links.investmentLoans },
    { key: 'marketNews', label: t.nav.links.marketNews },
  ] as const;

  const toggleFavorite = (id: number) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const featuredListings = [
    {
      name: 'Skyrise 4 IT Park Tower',
      location: 'Cebu IT Park, Lahug',
      price: '₱7.2M',
      details: '2BR · 55sqm',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&q=80',
    },
    {
      name: 'Park Centrale Residences',
      location: 'Cebu Business Park',
      price: '₱9.5M',
      details: '3BR · 88sqm',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80',
    },
    {
      name: 'Mactan Newtown Ocean Suite',
      location: 'Lapu-Lapu, Mactan Island',
      price: '₱5.8M',
      details: '1BR · 42sqm',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=300&q=80',
    },
  ];

  const mapItems = [
    { title: 'Skyrise 4 Tower', location: 'IT Park, Lahug', price: '₱7.2M', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=120&q=80' },
    { title: 'Summit Business Park', location: 'Cebu Business Park', price: '₱9.5M', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=80' },
    { title: 'Azure Cove Villa', location: 'Mactan Island', price: '₱5.8M', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=120&q=80' },
  ];

  // Mock Data per Menu Category
  const mockPropertiesByMenu = {
    buy: [
      { id: 101, name: 'Skyrise 4 Tower', location: 'Cebu IT Park', price: '₱7.2M', roi: '8.5%', type: '2BR', sqm: '55', status: 'For Sale',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', label: 'Exterior – Front View' },
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', label: 'Exterior – Night View' },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', label: 'Interior – Living Room' },
          { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80', label: 'Interior – Master Bedroom' },
        ],
      },
      { id: 102, name: 'Park Centrale Residences', location: 'Banilad', price: '₱9.5M', roi: '7.8%', type: '3BR', sqm: '88', status: 'For Sale',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', label: 'Exterior – Front View' },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', label: 'Exterior – Side View' },
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', label: 'Interior – Kitchen' },
          { url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80', label: 'Interior – Bedroom' },
        ],
      },
      { id: 103, name: 'Mactan Ocean Suite', location: 'Mactan Island', price: '₱5.8M', roi: '9.2%', type: '1BR', sqm: '42', status: 'For Sale',
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80', label: 'Exterior – Ocean View' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', label: 'Exterior – Building' },
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80', label: 'Interior – Living Area' },
          { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', label: 'Interior – Bathroom' },
        ],
      },
      { id: 104, name: 'Lahug Luxury Villa', location: 'Lahug', price: '₱12.5M', roi: '8.1%', type: '4BR', sqm: '120', status: 'For Sale',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', label: 'Exterior – Villa Front' },
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', label: 'Exterior – Garden View' },
          { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80', label: 'Interior – Open Kitchen' },
          { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80', label: 'Interior – Master Suite' },
        ],
      },
      { id: 105, name: 'Cebu Business Park Suite', location: 'Cebu Business Park', price: '₱8.9M', roi: '7.5%', type: '3BR', sqm: '95', status: 'For Sale',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', label: 'Exterior – Tower View' },
          { url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80', label: 'Exterior – Lobby' },
          { url: 'https://images.unsplash.com/photo-1600607687644-c7531e0c3e2b?w=800&q=80', label: 'Interior – Living Room' },
          { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', label: 'Interior – Dining Area' },
        ],
      },
    ],
    rent: [
      { id: 201, name: 'IT Park Studio', location: 'Cebu IT Park', price: '₱35K/mo', roi: 'N/A', type: 'Studio', sqm: '30', status: 'Available',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', label: 'Exterior – Building' },
          { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', label: 'Exterior – Street View' },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', label: 'Interior – Studio Space' },
          { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', label: 'Interior – Bathroom' },
        ],
      },
      { id: 202, name: 'Banilad Apartment', location: 'Banilad', price: '₱45K/mo', roi: 'N/A', type: '1BR', sqm: '45', status: 'Available',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', label: 'Exterior – Building' },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', label: 'Exterior – Facade' },
          { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80', label: 'Interior – Bedroom' },
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', label: 'Interior – Kitchen' },
        ],
      },
      { id: 203, name: 'Mactan Beach Condo', location: 'Mactan Island', price: '₱60K/mo', roi: 'N/A', type: '2BR', sqm: '70', status: 'Available',
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80', label: 'Exterior – Beach View' },
          { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80', label: 'Exterior – Ocean Front' },
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80', label: 'Interior – Living Room' },
          { url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80', label: 'Interior – Bedroom' },
        ],
      },
      { id: 204, name: 'Lahug Premium Flat', location: 'Lahug', price: '₱55K/mo', roi: 'N/A', type: '2BR', sqm: '65', status: 'Available',
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', label: 'Exterior – Building View' },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', label: 'Exterior – Entrance' },
          { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80', label: 'Interior – Kitchen' },
          { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80', label: 'Interior – Bedroom' },
        ],
      },
      { id: 205, name: 'Mandaue Penthouse', location: 'Mandaue', price: '₱80K/mo', roi: 'N/A', type: '3BR', sqm: '100', status: 'Available',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', label: 'Exterior – Penthouse Tower' },
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', label: 'Exterior – City View' },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', label: 'Interior – Open Plan Living' },
          { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', label: 'Interior – Dining Room' },
        ],
      },
    ],
    sold: [
      { id: 301, name: 'IT Park Residence A', location: 'Cebu IT Park', price: '₱6.5M', roi: 'Complete', type: '2BR', sqm: '52', status: 'Sold',
        image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&q=80', label: 'Exterior – Building' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', label: 'Exterior – Lobby' },
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80', label: 'Interior – Living Room' },
          { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80', label: 'Interior – Bedroom' },
        ],
      },
      { id: 302, name: 'Banilad House', location: 'Banilad', price: '₱15M', roi: 'Complete', type: '4BR', sqm: '180', status: 'Sold',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', label: 'Exterior – House Front' },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', label: 'Exterior – Garden' },
          { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80', label: 'Interior – Kitchen' },
          { url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80', label: 'Interior – Master Bedroom' },
        ],
      },
      { id: 303, name: 'Mactan Villa', location: 'Mactan Island', price: '₱22M', roi: 'Complete', type: '5BR', sqm: '250', status: 'Sold',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', label: 'Exterior – Villa Front' },
          { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80', label: 'Exterior – Pool View' },
          { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80', label: 'Interior – Living Suite' },
          { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', label: 'Interior – Master Bath' },
        ],
      },
      { id: 304, name: 'Lahug Condo', location: 'Lahug', price: '₱4.2M', roi: 'Complete', type: '1BR', sqm: '35', status: 'Sold',
        image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80', label: 'Exterior – Building' },
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', label: 'Exterior – Entrance' },
          { url: 'https://images.unsplash.com/photo-1600607687644-c7531e0c3e2b?w=800&q=80', label: 'Interior – Living Area' },
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', label: 'Interior – Kitchen' },
        ],
      },
      { id: 305, name: 'Cebu Tower Unit', location: 'Cebu Business Park', price: '₱8M', roi: 'Complete', type: '2BR', sqm: '60', status: 'Sold',
        image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80', label: 'Exterior – Tower' },
          { url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80', label: 'Exterior – Glass Facade' },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', label: 'Interior – Living Room' },
          { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', label: 'Interior – Dining Room' },
        ],
      },
    ],
    newLaunches: [
      { id: 401, name: 'Azure Sky Tower', location: 'Cebu IT Park', price: '₱10M+', roi: '9.5%', type: '2-4BR', sqm: '60-150', status: 'Pre-Selling',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', label: 'Exterior – Tower Render' },
          { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', label: 'Exterior – Aerial View' },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', label: 'Interior – Show Unit Living' },
          { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80', label: 'Interior – Show Unit Bedroom' },
        ],
      },
      { id: 402, name: 'The Oceana', location: 'Mactan Island', price: '₱15M+', roi: '10.2%', type: '3-5BR', sqm: '90-200', status: 'Pre-Selling',
        image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80', label: 'Exterior – Beachfront Render' },
          { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80', label: 'Exterior – Ocean View' },
          { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80', label: 'Interior – Luxury Suite' },
          { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', label: 'Interior – En-suite Bath' },
        ],
      },
      { id: 403, name: 'Lahug Green Residences', location: 'Lahug', price: '₱8M+', roi: '9.0%', type: '1-3BR', sqm: '40-100', status: 'Pre-Selling',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', label: 'Exterior – Green Building' },
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', label: 'Exterior – Garden Level' },
          { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80', label: 'Interior – Show Unit Kitchen' },
          { url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80', label: 'Interior – Bedroom' },
        ],
      },
      { id: 404, name: 'Mandaue Financial Hub', location: 'Mandaue', price: '₱12M+', roi: '8.8%', type: '2-4BR', sqm: '70-150', status: 'Pre-Selling',
        image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80', label: 'Exterior – Tower Render' },
          { url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80', label: 'Exterior – Skyline View' },
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80', label: 'Interior – Show Lounge' },
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', label: 'Interior – Kitchen' },
        ],
      },
      { id: 405, name: 'Cebu Business Park Center', location: 'Cebu Business Park', price: '₱11M+', roi: '9.3%', type: '2-3BR', sqm: '65-120', status: 'Pre-Selling',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
        photos: [
          { url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80', label: 'Exterior – Glass Tower' },
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', label: 'Exterior – Podium Level' },
          { url: 'https://images.unsplash.com/photo-1600607687644-c7531e0c3e2b?w=800&q=80', label: 'Interior – Show Unit' },
          { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80', label: 'Interior – Dining Area' },
        ],
      },
    ],
  };

  const mockProperties = activeNavItem === 'rent' ? mockPropertiesByMenu.rent :
                          activeNavItem === 'sold' ? mockPropertiesByMenu.sold :
                          activeNavItem === 'newLaunches' ? mockPropertiesByMenu.newLaunches :
                          mockPropertiesByMenu.buy;

  // Mock Data for Agents (5 items)
  const mockAgents = [
    { id: 1, name: 'Maria Santos', email: 'maria@yourhouse.ph', properties: 24, roi: '8.5%', image: '👩‍💼' },
    { id: 2, name: 'Juan Dela Cruz', email: 'juan@yourhouse.ph', properties: 31, roi: '8.9%', image: '👨‍💼' },
    { id: 3, name: 'Ana Reyes', email: 'ana@yourhouse.ph', properties: 19, roi: '7.8%', image: '👩‍💼' },
    { id: 4, name: 'Carlos Mendoza', email: 'carlos@yourhouse.ph', properties: 28, roi: '8.3%', image: '👨‍💼' },
    { id: 5, name: 'Sofia Garcia', email: 'sofia@yourhouse.ph', properties: 22, roi: '8.6%', image: '👩‍💼' },
  ];

  // Mock Data for Leads (5 items)
  const mockLeads = [
    { id: 1, name: 'Kenneth Liu', email: 'kenneth.liu@example.com', budget: '₱7M-10M', status: 'Active', date: '2026-04-20' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', budget: '₱5M-8M', status: 'Interested', date: '2026-04-19' },
    { id: 3, name: 'Michael Chen', email: 'mchen@example.com', budget: '₱10M+', status: 'Active', date: '2026-04-18' },
    { id: 4, name: 'Jessica Brown', email: 'jbrown@example.com', budget: '₱3M-6M', status: 'Negotiating', date: '2026-04-17' },
    { id: 5, name: 'David Kim', email: 'dkim@example.com', budget: '₱6M-9M', status: 'Contacted', date: '2026-04-16' },
  ];

  // Mock Data for Reports (5 items)
  const mockReports = [
    { id: 1, title: 'Q1 2026 Market Analysis', type: 'Market Report', roi: '8.2%', verified: true, date: '2026-04-15' },
    { id: 2, title: 'Cebu IT Park Investment Guide', type: 'Investment Report', roi: '8.5%', verified: true, date: '2026-04-10' },
    { id: 3, title: 'Property Valuation Report - Mactan', type: 'Valuation', roi: '9.1%', verified: true, date: '2026-04-05' },
    { id: 4, title: 'Coastal Area Risk Assessment', type: 'Risk Report', roi: '7.8%', verified: true, date: '2026-03-28' },
    { id: 5, title: 'Rental Yield Analysis 2026', type: 'Analytics', roi: '8.3%', verified: true, date: '2026-03-20' },
  ];

  // Update CSS variables on theme change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', theme.bg);
    root.style.setProperty('--bg-secondary', colorTheme === 'night' ? '#051827' : colorTheme === 'day' ? '#87CDD8' : '#F0F0F0');
    root.style.setProperty('--text-primary', theme.text);
    root.style.setProperty('--text-secondary', colorTheme === 'night' ? '#94A3B8' : colorTheme === 'day' ? '#0A5570' : '#666666');
    root.style.setProperty('--accent', theme.accent);
  }, [colorTheme, theme]);

  return (
    <div className="font-sans" style={{
      fontFamily: "'Manrope', sans-serif",
      backgroundColor: theme.bg,
      color: theme.text,
      transition: 'background-color 0.3s, color 0.3s',
    }}>
      {/* ========== PRIMARY NAVIGATION ========== */}
      <nav className="fixed top-0 w-full z-[60] backdrop-blur-xl px-8 lg:px-12 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-colors duration-300" style={{ backgroundColor: `${theme.bg}/95`, color: theme.text }}>
        <div className="flex items-center justify-between gap-6">
          <div className="font-serif italic text-2xl tracking-tight" style={{ color: theme.text }}>YourHouse.PH</div>
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMenuOpen((current) => !current)}
              className="w-10 h-10 rounded-full bg-[#60c6d4]/10 text-[#60c6d4] border border-white/10 flex items-center justify-center transition hover:bg-[#60c6d4]/15">
              {menuOpen ? <X size={18} /> : <span className="text-lg">≡</span>}
            </button>
            <span className="text-sm text-slate-300">Menu</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-slate-100">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveNavItem(item.key);
                setTimeout(() => {
                  document.getElementById('nav-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              aria-current={activeNavItem === item.key ? 'page' : undefined}
              className={`transition px-1 pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60c6d4] focus-visible:rounded ${activeNavItem === item.key
                ? 'text-[#f2ca50] border-b-2 border-[#f2ca50]'
                : 'text-slate-200 hover:text-white hover:border-b-2 hover:border-[#f2ca50]/40'
                }`}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} aria-label="Select language" className="px-3 py-2 rounded-xl border text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60c6d4]" style={{ backgroundColor: colorTheme === 'night' ? '#132c45' : '#FFFFFF', color: colorTheme === 'night' ? '#FFFFFF' : '#0A2540', borderColor: colorTheme === 'night' ? '#60c6d4' : '#0088AA' }}>
            <option value="en" style={{ backgroundColor: '#132c45', color: '#FFFFFF' }}>🌐 EN</option>
            <option value="ko" style={{ backgroundColor: '#132c45', color: '#FFFFFF' }}>🇰🇷 한국어</option>
            <option value="ja" style={{ backgroundColor: '#132c45', color: '#FFFFFF' }}>🇯🇵 日本語</option>
            <option value="zh" style={{ backgroundColor: '#132c45', color: '#FFFFFF' }}>🇨🇳 中文</option>
          </select>

          <select value={colorTheme} onChange={(e) => setColorTheme(e.target.value as ColorTheme)} aria-label="Select color theme" className="px-3 py-2 rounded-xl border text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60c6d4]" style={{ backgroundColor: colorTheme === 'night' ? '#132c45' : '#FFFFFF', color: colorTheme === 'night' ? '#FFFFFF' : '#0A2540', borderColor: colorTheme === 'night' ? '#60c6d4' : '#0088AA' }}>
            <option value="night" style={{ backgroundColor: '#0A2540', color: '#FFFFFF' }}>🌙 Night</option>
            <option value="day" style={{ backgroundColor: '#F5F8FC', color: '#0A2540' }}>☀️ Day</option>
          </select>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-3 py-2 rounded-full" style={{ backgroundColor: `${theme.accent}33`, color: theme.text }}>
                👤 {currentUser.name}
              </span>
              <button onClick={() => setCurrentUser(null)} aria-label="Sign out" className="rounded-full px-4 py-2 text-xs font-semibold transition hover:opacity-80" style={{ borderColor: theme.accent, color: theme.text, border: `1px solid ${theme.accent}` }}>
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }} aria-label="Sign in to account" className="rounded-full px-6 py-2 text-sm font-semibold transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" style={{ backgroundColor: theme.accent, color: theme.bg }}>
              {t.nav.signin}
            </button>
          )}
        </div>
      </nav>
      {menuOpen ? (
        <div className="md:hidden px-8 pb-6 border-b transition-colors duration-300" style={{ backgroundColor: `${theme.bg}/95`, borderColor: `${theme.text}/10` }}>
          <div className="space-y-4 mt-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveNavItem(item.key);
                  setMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('nav-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={`block text-left w-full text-base font-medium transition py-2 rounded-2xl ${activeNavItem === item.key
                  ? 'text-[#f2ca50] bg-white/5'
                  : 'text-white hover:text-[#60c6d4] hover:bg-white/5'
                  }`}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="w-full px-4 py-3 rounded-2xl border text-sm font-medium" style={{ backgroundColor: colorTheme === 'night' ? '#132c45' : '#FFFFFF', color: colorTheme === 'night' ? '#FFFFFF' : '#0A2540', borderColor: colorTheme === 'night' ? '#60c6d4' : '#0088AA' }}>
              <option value="en" style={{ backgroundColor: '#132c45', color: '#FFFFFF' }}>🌐 English</option>
              <option value="ko" style={{ backgroundColor: '#132c45', color: '#FFFFFF' }}>🇰🇷 한국어</option>
              <option value="ja" style={{ backgroundColor: '#132c45', color: '#FFFFFF' }}>🇯🇵 日本語</option>
              <option value="zh" style={{ backgroundColor: '#132c45', color: '#FFFFFF' }}>🇨🇳 中文</option>
            </select>
            <button className="w-full rounded-2xl bg-[#59d9d9] text-[#0A2540] py-3 font-semibold hover:bg-[#5ee3e3] transition">
              {t.nav.signin}
            </button>
          </div>
        </div>
      ) : null}

      {/* ========== HERO + SEARCH INTERFACE ========== */}
      <section className="relative min-h-screen sm:min-h-screen w-full overflow-hidden pt-24 sm:pt-28 transition-colors duration-300" style={{
        backgroundColor: colorTheme === 'night' ? '#0A2540' : colorTheme === 'day' ? '#E8F4F8' : '#FFFFFF',
        color: colorTheme === 'night' ? '#FFFFFF' : '#000000'
      }}>
        <div className="absolute inset-0 z-0">
          <img
            alt="38 Park Avenue, Cebu IT Park Luxury Residences"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#051925]/90 via-[#081f39]/80 to-[#0A2540]/95" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#60c6d4]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#77d8e4]/10 blur-3xl" />
        </div>

        <div className="relative z-10 h-full py-12 sm:py-20 px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            {/* Headline */}
            <div className="mb-8 sm:mb-16 text-center md:text-left">
              <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-slate-300 mb-2 sm:mb-4">{t.hero.promo}</p>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight text-white mb-3 sm:mb-4">
                {t.hero.title}
              </h1>
              <p className="text-slate-200 text-base sm:text-lg max-w-3xl mx-auto md:mx-0">
                {t.hero.subtitle}
              </p>
            </div>

            <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
              <div className="rounded-[2rem] bg-[#051827]/90 border border-white/10 shadow-[0_32px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center md:justify-start">
                  {(['buy', 'rent', 'invest'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setHeroTab(tab)}
                      className={`px-4 sm:px-5 py-3 sm:py-3 text-xs sm:text-sm font-semibold tracking-[0.08em] rounded-full transition min-h-[44px] flex items-center justify-center ${heroTab === tab
                        ? 'bg-[#60c6d4] text-[#0A2540] shadow-lg shadow-[#60c6d4]/20'
                        : 'bg-white/5 text-slate-200 hover:bg-white/10'
                        }`}>
                      {tab === 'buy' && t.hero.tabs.buy}
                      {tab === 'rent' && t.hero.tabs.rent}
                      {tab === 'invest' && t.hero.tabs.invest}
                    </button>
                  ))}
                </div>

                <div className="mb-8 sm:mb-10 text-slate-300 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3 sm:mb-4">
                    {(['buy', 'rent', 'sold', 'address', 'agents'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSearchTab(tab)}
                        className={`px-3 sm:px-4 py-2 sm:py-2 text-xs font-semibold uppercase tracking-[0.2em] rounded-full transition min-h-[40px] flex items-center justify-center ${searchTab === tab ? 'bg-[#60c6d4] text-[#0A2540]' : 'bg-white/10 text-slate-200 hover:bg-white/15'
                          }`}>
                        {t.hero.searchTabs[tab]}
                      </button>
                    ))}
                  </div>
                  <p className="text-base leading-relaxed">
                    {t.hero.tabDescription[heroTab]}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                    <div className="rounded-3xl bg-white/5 p-3 sm:p-4 border border-white/10">
                      <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">{t.stats.verifiedListings}</span>
                      <strong className="block text-white text-lg sm:text-xl mt-2">2,340+</strong>
                    </div>
                    <div className="rounded-3xl bg-white/5 p-3 sm:p-4 border border-white/10">
                      <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">{t.stats.avgRoi}</span>
                      <strong className="block text-white text-lg sm:text-xl mt-2">8.2%</strong>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_auto] mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.hero.placeholder}
                      className="w-full pl-12 pr-4 py-4 rounded-3xl bg-[#0b1f33] border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#60c6d4]/40"
                    />
                  </div>
                  <button className="rounded-3xl bg-[#60c6d4] text-[#0A2540] font-semibold tracking-[0.08em] uppercase transition hover:bg-[#4cc0cc] py-4 px-6 shadow-[0_16px_40px_rgba(96,198,212,0.28)] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2540]">
                    {t.hero.search}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="rounded-3xl bg-[#0a2336] p-3 sm:p-4 border border-white/10 flex flex-col justify-center min-h-[56px] sm:min-h-auto">
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-500 block mb-1">{t.hero.type}</label>
                    <select className="w-full bg-transparent text-slate-100 text-xs sm:text-sm outline-none cursor-pointer">
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Mixed-Use</option>
                    </select>
                  </div>
                  <div className="rounded-3xl bg-[#0a2336] p-3 sm:p-4 border border-white/10 flex flex-col justify-center min-h-[56px] sm:min-h-auto">
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-500 block mb-1">{t.hero.budget}</label>
                    <select className="w-full bg-transparent text-slate-100 text-xs sm:text-sm outline-none cursor-pointer">
                      <option>Up to ₱500K</option>
                      <option>₱500K - ₱1M</option>
                      <option>₱1M - ₱5M</option>
                      <option>₱5M+</option>
                    </select>
                  </div>
                  <div className="rounded-3xl bg-[#0a2336] p-3 sm:p-4 border border-white/10 flex flex-col justify-center min-h-[56px] sm:min-h-auto">
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-500 block mb-1">{t.hero.location}</label>
                    <select className="w-full bg-transparent text-slate-100 text-xs sm:text-sm outline-none cursor-pointer">
                      <option>Cebu IT Park</option>
                      <option>Banilad</option>
                      <option>Lahug</option>
                      <option>Mandaue</option>
                    </select>
                  </div>
                  <button className="rounded-3xl bg-[#152b42] text-white font-semibold tracking-[0.08em] uppercase py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm hover:bg-[#1b3f58] transition border border-white/10 min-h-[56px] sm:min-h-auto flex items-center justify-center">
                    Advanced
                  </button>
                </div>
              </div>

              <div className="relative hidden xl:block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f2a40]/90 via-transparent to-[#0f2a40]/90 rounded-[2rem] blur-3xl" />
                <div className="relative rounded-[2rem] bg-[#081826]/95 border border-white/10 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Featured asset</p>
                      <h3 className="text-2xl font-semibold text-white">Mactan Ocean Suite</h3>
                    </div>
                    <span className="rounded-full bg-[#60c6d4]/15 text-[#a5f2ff] text-xs px-3 py-1">High Yield</span>
                  </div>

                  <div className="rounded-[1.75rem] overflow-hidden mb-5 shadow-inner shadow-black/30">
                    <img alt="Mactan Ocean Suite" src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80" className="w-full h-56 object-cover" />
                  </div>

                  <div className="space-y-4 text-slate-300">
                    <div className="flex items-center justify-between text-sm">
                      <span>Location</span>
                      <span className="text-white">Mactan Island</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Price</span>
                      <span className="text-white">₱5.8M</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Type</span>
                      <span className="text-white">1BR · 42sqm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <div className="rounded-[2rem] bg-[#051827]/90 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-white/10">
                <div className="text-4xl font-semibold text-[#60c6d4] mb-2">10,000+</div>
                <p className="text-slate-300 text-sm">Properties Verified</p>
              </div>
              <div className="rounded-[2rem] bg-[#051827]/90 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-white/10">
                <div className="text-4xl font-semibold text-[#60c6d4] mb-2">99.8%</div>
                <p className="text-slate-300 text-sm">AI Accuracy Rate</p>
              </div>
              <div className="rounded-[2rem] bg-[#051827]/90 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-white/10">
                <div className="text-4xl font-semibold text-[#60c6d4] mb-2">8.2%</div>
                <p className="text-slate-300 text-sm">Average ROI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== NAV CONTENT SECTION ========== */}
      <section id="nav-content" className="py-16 px-8 lg:px-12 bg-[#061828] scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              {t.navContent[activeNavItem]}
            </h2>
            <span className="text-sm text-slate-400">
              {(activeNavItem === 'findAgents' ? mockAgents.length :
                activeNavItem === 'marketNews' ? mockReports.length :
                mockProperties.length)} {t.navContent.results}
            </span>
          </div>

          {/* Properties View (buy, rent, sold, newLaunches) */}
          {(activeNavItem === 'buy' || activeNavItem === 'rent' || activeNavItem === 'sold' || activeNavItem === 'newLaunches') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProperties.map((property) => (
                <div key={property.id} onClick={() => { setGalleryIndex(0); setDetailModal({ type: 'property', data: property }); }} className="rounded-2xl overflow-hidden bg-[#0a1f33] border border-white/10 hover:border-[#60c6d4]/50 transition group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 right-3 bg-[#60c6d4] text-[#0A2540] px-3 py-1 rounded-full text-xs font-bold">
                      ROI {property.roi}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-1">{property.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">📍 {property.location}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-[#60c6d4]">{property.price}</p>
                        <p className="text-xs text-slate-400">{property.type} · {property.sqm}sqm</p>
                      </div>
                      <button className="px-4 py-2 bg-[#60c6d4] text-[#0A2540] rounded-full text-sm font-semibold hover:bg-[#4cc0cc] transition">
                        {t.navContent.viewDetails}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agents View */}
          {activeNavItem === 'findAgents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAgents.map((agent) => (
                <div key={agent.id} onClick={() => setDetailModal({ type: 'agent', data: agent })} className="rounded-2xl bg-[#0a1f33] border border-white/10 hover:border-[#60c6d4]/50 transition p-6 text-center cursor-pointer">
                  <div className="text-6xl mb-3">{agent.image}</div>
                  <h3 className="text-white font-bold text-lg mb-1">{agent.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{agent.email}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 p-3 rounded-xl">
                      <p className="text-xs text-slate-400">{t.navContent.managedProperties}</p>
                      <p className="text-xl font-bold text-white">{agent.properties}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                      <p className="text-xs text-slate-400">{t.navContent.avgRoi}</p>
                      <p className="text-xl font-bold text-[#60c6d4]">{agent.roi}</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-[#60c6d4] text-[#0A2540] rounded-full text-sm font-semibold hover:bg-[#4cc0cc] transition">
                    {t.navContent.requestConsult}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Investment Loans View */}
          {activeNavItem === 'investmentLoans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { ...t.navContent.loans.premiumMortgage, rate: '4.5%', max: '₱50M' },
                { ...t.navContent.loans.quickInvestment, rate: '5.2%', max: '₱20M' },
                { ...t.navContent.loans.luxuryPropertyLoan, rate: '4.2%', max: '₱100M' },
                { ...t.navContent.loans.firstTimeBuyer, rate: '5.0%', max: '₱15M' },
                { ...t.navContent.loans.commercialLoan, rate: '5.5%', max: '₱80M' },
              ].map((loan, idx) => (
                <div key={idx} onClick={() => setDetailModal({ type: 'loan', data: loan })} className="rounded-2xl bg-[#0a1f33] border border-white/10 hover:border-[#60c6d4]/50 transition p-6 cursor-pointer">
                  <h3 className="text-white font-bold text-lg mb-2">{loan.name}</h3>
                  <div className="text-3xl font-bold text-[#60c6d4] mb-3">{loan.rate}</div>
                  <div className="space-y-2 mb-4 text-sm text-slate-300">
                    <p>📅 {t.navContent.term}: {loan.term}</p>
                    <p>💰 {t.navContent.limit}: {loan.max}</p>
                    {loan.features.map((f, i) => <p key={i}>✓ {f}</p>)}
                  </div>
                  <button className="w-full py-2 bg-[#60c6d4] text-[#0A2540] rounded-full text-sm font-semibold hover:bg-[#4cc0cc] transition">
                    {t.navContent.loanInquiry}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Market News View */}
          {activeNavItem === 'marketNews' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockReports.map((report) => (
                <div key={report.id} onClick={() => setDetailModal({ type: 'report', data: report })} className="rounded-2xl bg-[#0a1f33] border border-white/10 hover:border-[#60c6d4]/50 transition p-6 cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-widest text-[#60c6d4] font-bold">{report.type}</span>
                    {report.verified && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">✓ {t.navContent.verified}</span>}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{report.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">📅 {report.date}</span>
                    <span className="text-[#60c6d4] font-bold">ROI {report.roi}</span>
                  </div>
                  <button className="w-full mt-4 py-2 border border-[#60c6d4] text-[#60c6d4] rounded-full text-sm font-semibold hover:bg-[#60c6d4]/10 transition">
                    {t.navContent.readReport}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== NARRATIVE SECTION ========== */}
      <section className="py-32 px-8 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <h2 className="font-serif text-4xl mb-8 leading-snug italic text-white">Smart Living <br />Reimagined</h2>
            <p className="font-body text-lg text-slate-200 leading-relaxed mb-8">
              YourHouse redefines residential investments with coastal luxury curation, AI-powered verification, and transparent ROI insight.
            </p>
            <p className="font-body text-lg text-slate-200 leading-relaxed">
              Our platform blends serene design, trusted data, and local market expertise to make property investing effortless.
            </p>
          </div>
          <div className="md:col-span-7 flex flex-col gap-12">
            <div className="aspect-[4/5] overflow-hidden group cursor-pointer">
              <img alt="Interior luxury" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&h=750&fit=crop" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED PROPERTIES (BENTO STYLE) ========== */}
      <section className="py-32 px-8 lg:px-12 transition-colors duration-300" style={{ backgroundColor: colorTheme === 'night' ? '#1a1a1a' : colorTheme === 'day' ? '#D4E8F0' : '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="font-label text-[#60c6d4] tracking-[0.2em] uppercase text-xs mb-2 block">{t.featuredPortfolio.label}</span>
              <h2 className="font-serif text-5xl italic">{t.featuredPortfolio.title}</h2>
            </div>
            <div className="flex gap-4">
              <button className="p-4 border border-[#60c6d4]/30 hover:border-[#60c6d4] hover:bg-[#60c6d4]/10 transition-all">
                <ChevronLeft size={20} />
              </button>
              <button className="p-4 border border-[#60c6d4]/30 hover:border-[#60c6d4] hover:bg-[#60c6d4]/10 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Featured Card */}
            <div className="md:col-span-2 relative overflow-hidden group cursor-crosshair h-96">
              <img alt="Featured property" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1512207736139-51b42d5a2ed2?w=800&h=600&fit=crop" />
              <div className="absolute bottom-6 left-6 font-label uppercase tracking-widest text-[10px] bg-black/80 px-3 py-1">Lahug Luxury</div>
              <div className="absolute top-6 right-6 bg-[#60c6d4] text-[#0A2540] px-3 py-1 rounded text-xs font-bold">$200K</div>
            </div>

            {/* Agent Card (Glassmorphism) */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 flex flex-col justify-between relative overflow-hidden group hover:bg-white/20 transition-all duration-300">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#0d6b74]/20 rounded-full blur-3xl group-hover:bg-[#0d6b74]/40 transition"></div>
              <div>
                <h3 className="font-serif text-3xl mb-6 italic text-white">{t.card.premiumAgent}</h3>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-[#0d6b74]/20 rounded-full flex items-center justify-center">
                    <Volume2 size={24} className="text-[#60c6d4]" />
                  </div>
                  <div>
                    <p className="font-body font-bold text-lg text-white">{t.card.analysis}</p>
                    <p className="font-label text-xs text-[#60c6d4] uppercase tracking-widest">{t.card.support}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed mb-8">
                  {t.card.description}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <button className="bg-gradient-to-r from-[#60c6d4] to-[#0d6b74] text-white py-4 font-label uppercase tracking-widest text-xs font-bold hover:shadow-lg hover:shadow-[#60c6d4]/40 transition">
                  {t.card.schedule}
                </button>
                <button className="border border-[#60c6d4]/50 py-4 font-label uppercase tracking-widest text-xs text-white hover:bg-[#60c6d4]/10 transition-colors">
                  {t.card.report}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== QUICK SERVICES ========== */}
      <section className="py-24 px-8 lg:px-12 transition-colors duration-300" style={{ backgroundColor: colorTheme === 'night' ? '#0F1B2A' : colorTheme === 'day' ? '#D4E8F0' : '#F9F9F9' }}>
        <div className="max-w-5xl mx-auto">
          <div className="rounded-[2rem] border transition-colors duration-300 p-8 lg:p-12" style={{
            backgroundColor: colorTheme === 'night' ? '#051827' : colorTheme === 'day' ? '#A8D9ED' : '#EEEEEE',
            borderColor: colorTheme === 'night' ? 'rgba(255,255,255,0.1)' : colorTheme === 'day' ? 'rgba(0,168,184,0.2)' : 'rgba(0,0,0,0.1)'
          }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full transition-colors duration-300" style={{ backgroundColor: theme.accent }}></div>
              <h3 className="text-xl font-semibold" style={{ color: theme.text }}>Quick Services</h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: '📍', title: 'Schedule Property Tour', desc: 'Book a personalized tour with our agents',
                  action: () => setTourBookingOpen(true),
                },
                {
                  icon: '📊', title: 'Get Investment Analysis', desc: 'Receive detailed ROI and property evaluation',
                  action: () => {
                    setGalleryIndex(0);
                    setDetailModal({ type: 'property', data: { name: 'Skyrise 4 Tower', location: 'Cebu IT Park', price: '₱7.2M', roi: '8.5%', type: '2BR', sqm: '55', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', status: 'For Sale', photos: [] } });
                    setAiAnalysisOpen(true);
                  },
                },
                {
                  icon: '🔍', title: 'Compare Properties', desc: 'Side-by-side comparison of listings',
                  action: () => setCompareOpen(true),
                },
                {
                  icon: '📈', title: 'Market Report', desc: 'Latest trends and investment opportunities',
                  action: () => {
                    setActiveNavItem('marketNews');
                    setTimeout(() => document.getElementById('nav-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  },
                },
                {
                  icon: '👤', title: 'Consult with Premium Agent', desc: 'Get expert guidance from our specialists',
                  action: () => setVoiceOpen(true),
                },
              ].map((service, idx) => (
                <button
                  key={idx}
                  onClick={service.action}
                  className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:opacity-80 hover:scale-[1.01] active:scale-95 border"
                  style={{
                    backgroundColor: colorTheme === 'night' ? '#0a1f33' : '#E8F4FA',
                    borderColor: colorTheme === 'night' ? 'rgba(255,255,255,0.1)' : 'rgba(0,168,184,0.3)'
                  }}
                >
                  <div className="text-3xl flex-shrink-0">{service.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold" style={{ color: theme.text }}>{service.title}</div>
                    <div className="text-sm" style={{ color: colorTheme === 'night' ? '#94A3B8' : '#0A5570' }}>{service.desc}</div>
                  </div>
                  <div className="text-xl" style={{ color: theme.accent }}>›</div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t text-center transition-colors duration-300" style={{ borderColor: colorTheme === 'night' ? 'rgba(255,255,255,0.1)' : colorTheme === 'day' ? 'rgba(0,168,184,0.2)' : 'rgba(0,0,0,0.1)' }}>
              <div className="flex items-center justify-center gap-2">
                <span style={{ color: theme.accent }}>🤖</span>
                <span style={{ color: theme.text }} className="text-sm">Talk to AI Assistant below →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES GRID ========== */}
      <section className="py-32 px-8 lg:px-12 transition-colors duration-300" style={{ backgroundColor: colorTheme === 'night' ? '#000000' : colorTheme === 'day' ? '#E8F4F8' : '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 aspect-video relative overflow-hidden group">
              <img alt="Pool" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src="https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&h=500&fit=crop" />
              <div className="absolute bottom-6 left-6 font-label uppercase tracking-widest text-[10px] bg-black/70 px-3 py-1">{t.features.amenities}</div>
            </div>

            <div className="aspect-square bg-[#071926] p-8 flex flex-col justify-end border border-[#60c6d4]/20 hover:border-[#60c6d4]/40 transition">
              <MapPin size={24} className="text-[#60c6d4] mb-4" />
              <h4 className="font-serif text-xl mb-2 text-white">{t.features.primeLocation}</h4>
              <p className="text-xs text-slate-300 font-label">{t.features.locationLabel}</p>
            </div>

            <div className="aspect-square overflow-hidden group">
              <img alt="Modern kitchen" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop" />
            </div>

            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-4 border-l border-[#60c6d4]/30 pl-8 py-4 hover:border-[#60c6d4]/80 transition">
                <span className="text-[#60c6d4] font-label text-xs tracking-widest uppercase">{t.features.verification}</span>
                <h4 className="font-serif text-2xl italic text-white">{t.features.accuracy}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{t.features.verificationDesc}</p>
              </div>
              <div className="flex flex-col gap-4 border-l border-[#60c6d4]/30 pl-8 py-4 hover:border-[#60c6d4]/80 transition">
                <span className="text-[#60c6d4] font-label text-xs tracking-widest uppercase">{t.features.analytics}</span>
                <h4 className="font-serif text-2xl italic text-white">{t.features.roiData}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{t.features.analyticsDesc}</p>
              </div>
              <div className="flex flex-col gap-4 border-l border-[#60c6d4]/30 pl-8 py-4 hover:border-[#60c6d4]/80 transition">
                <span className="text-[#60c6d4] font-label text-xs tracking-widest uppercase">{t.features.support}</span>
                <h4 className="font-serif text-2xl italic text-white">{t.features.consultation}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{t.features.supportDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-24 px-8 lg:px-12 bg-gradient-to-t from-[#0A2540] via-[#08203d] to-[#062034]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-label text-[#60c6d4] tracking-[0.3em] uppercase text-sm mb-4 block">{t.cta.label}</span>
          <h2 className="font-serif text-5xl md:text-6xl italic mb-6 text-white">{t.cta.title}</h2>
          <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="px-8 py-4 bg-[#60c6d4] text-[#0A2540] font-bold uppercase tracking-widest hover:bg-[#53b9ca] hover:shadow-lg hover:shadow-[#60c6d4]/30 transition duration-300 transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {t.cta.schedule}
            </button>
            <button className="px-8 py-4 border-2 border-[#60c6d4] text-[#60c6d4] font-bold uppercase tracking-widest hover:bg-[#60c6d4]/10 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60c6d4]">
              {t.cta.browse}
            </button>
          </div>

          <p className="text-sm text-slate-400">{t.cta.note}</p>
        </div>
      </section>

      {/* ========== TOUR BOOKING MODAL ========== */}
      {tourBookingOpen && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-start justify-center p-4 overflow-y-auto pt-16" onClick={() => setTourBookingOpen(false)}>
          <div className="rounded-3xl w-full max-w-2xl bg-[#0A2540] border border-[#60c6d4]/30 shadow-2xl my-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">{t.tourBooking.title}</h2>
                <p className="text-sm text-slate-400 mt-0.5">{t.tourBooking.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#60c6d4]">
                  <option value="en">English</option>
                  <option value="ko">한국어</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
                <button onClick={() => setTourBookingOpen(false)} className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center"><X size={18} /></button>
              </div>
            </div>
            {/* Booking form */}
            <div className="p-6 space-y-4">
              <p className="text-slate-300 text-sm">{t.tourBooking.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t.tourBooking.fullName}</label>
                  <input type="text" placeholder={t.tourBooking.fullNamePlaceholder} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#60c6d4]" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t.tourBooking.phone}</label>
                  <input type="tel" placeholder={t.tourBooking.phonePlaceholder} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#60c6d4]" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.tourBooking.email}</label>
                <input type="email" placeholder={t.tourBooking.emailPlaceholder} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#60c6d4]" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.tourBooking.dateTime}</label>
                <input type="datetime-local" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#60c6d4]" style={{colorScheme: 'dark'}} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t.tourBooking.message}</label>
                <textarea placeholder={t.tourBooking.messagePlaceholder} rows={3} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#60c6d4] resize-none" />
              </div>
              <button className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#60c6d4] to-[#0088AA] hover:opacity-90 transition text-sm">
                {t.tourBooking.submit}
              </button>
              <p className="text-center text-xs text-slate-500">
                {t.tourBooking.bookDirect}{' '}
                <a href="https://cal.com/yourhouse-ph" target="_blank" rel="noopener noreferrer" className="text-[#60c6d4] hover:underline">
                  cal.com/yourhouse-ph →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== COMPARE MODAL ========== */}
      {compareOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto pt-20" onClick={() => setCompareOpen(false)}>
          <div className="rounded-3xl w-full max-w-5xl bg-[#0A2540] border border-[#60c6d4]/30 shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">🔍 Property Comparison</h2>
              <button onClick={() => setCompareOpen(false)} className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-slate-400 font-normal pb-4 pr-4 w-32">Feature</th>
                    {[
                      { name: 'Skyrise 4 Tower', price: '₱7.2M', roi: '8.5%', type: '2BR', sqm: '55', location: 'Cebu IT Park', status: 'For Sale', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80' },
                      { name: 'Mactan Ocean Suite', price: '₱5.8M', roi: '9.2%', type: '1BR', sqm: '42', location: 'Mactan Island', status: 'For Sale', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80' },
                      { name: 'Azure Sky Tower', price: '₱10M+', roi: '9.5%', type: '2-4BR', sqm: '60-150', location: 'Cebu IT Park', status: 'Pre-Selling', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80' },
                    ].map((p, i) => (
                      <th key={i} className="pb-4 px-3 text-center min-w-[180px]">
                        <img src={p.image} alt={p.name} className="w-full h-28 object-cover rounded-xl mb-2" />
                        <div className="text-white font-bold text-sm">{p.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { label: '💰 Price', vals: ['₱7.2M', '₱5.8M', '₱10M+'] },
                    { label: '📈 ROI', vals: ['8.5%', '9.2%', '9.5%'] },
                    { label: '🏠 Type', vals: ['2BR', '1BR', '2-4BR'] },
                    { label: '📐 Area', vals: ['55 sqm', '42 sqm', '60-150 sqm'] },
                    { label: '📍 Location', vals: ['Cebu IT Park', 'Mactan Island', 'Cebu IT Park'] },
                    { label: '🔖 Status', vals: ['For Sale', 'For Sale', 'Pre-Selling'] },
                    { label: '⭐ Rating', vals: ['4.8', '4.9', '4.7'] },
                    { label: '🏊 Pool', vals: ['✅', '✅', '✅'] },
                    { label: '🅿️ Parking', vals: ['2 slots', '1 slot', '2 slots'] },
                    { label: '🔒 Security', vals: ['24/7', '24/7', '24/7'] },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4 text-slate-400 text-xs font-medium">{row.label}</td>
                      {row.vals.map((v, j) => (
                        <td key={j} className={`py-3 px-3 text-center font-medium ${j === 1 ? 'text-[#60c6d4]' : 'text-white'}`}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6 border-t border-white/10">
              {['Skyrise 4 Tower', 'Mactan Ocean Suite', 'Azure Sky Tower'].map((name, i) => (
                <button
                  key={i}
                  onClick={() => { setCompareOpen(false); setTourBookingOpen(true); }}
                  className="py-3 bg-[#60c6d4] text-[#0A2540] rounded-full text-sm font-bold hover:bg-[#4cc0cc] transition"
                >
                  Book Tour
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== DETAIL MODAL ========== */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setDetailModal(null)}>
          <div className="relative rounded-3xl w-full max-w-3xl bg-[#0A2540] border border-[#60c6d4]/30 shadow-2xl overflow-hidden my-8" onClick={(e) => e.stopPropagation()}>
            {/* Persistent close button for all detail types */}
            <button
              onClick={() => setDetailModal(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-black/70 text-white hover:bg-black/90 hover:scale-110 transition flex items-center justify-center shadow-xl border border-white/20 backdrop-blur-sm"
            >
              <X size={20} />
            </button>

            {/* Property Detail */}
            {detailModal.type === 'property' && (
              <>
                {/* Photo Gallery */}
                {(() => {
                  const photos = detailModal.data.photos ?? [{ url: detailModal.data.image, label: 'Main Photo' }];
                  const idx = Math.min(galleryIndex, photos.length - 1);
                  return (
                    <div>
                      {/* Main Image */}
                      <div className="relative h-80 overflow-hidden bg-[#051827]">
                        <img
                          src={photos[idx].url}
                          alt={photos[idx].label}
                          className="w-full h-full object-cover transition-all duration-500"
                        />
                        {/* Label */}
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                          {photos[idx].label}
                        </div>
                        {/* Counter */}
                        <div className="absolute bottom-3 right-14 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          {idx + 1} / {photos.length}
                        </div>
                        {/* Prev/Next */}
                        {idx > 0 && (
                          <button
                            onClick={() => setGalleryIndex(idx - 1)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/90 transition flex items-center justify-center backdrop-blur-sm"
                          >
                            <ChevronLeft size={18} />
                          </button>
                        )}
                        {idx < photos.length - 1 && (
                          <button
                            onClick={() => setGalleryIndex(idx + 1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/90 transition flex items-center justify-center backdrop-blur-sm"
                          >
                            <ChevronRight size={18} />
                          </button>
                        )}
                        <div className="absolute top-4 left-4 bg-[#60c6d4] text-[#0A2540] px-4 py-2 rounded-full text-sm font-bold">
                          ROI {detailModal.data.roi}
                        </div>
                      </div>
                      {/* Thumbnails */}
                      <div className="flex gap-2 p-3 bg-[#041320]">
                        {photos.map((p: { url: string; label: string }, i: number) => (
                          <button
                            key={i}
                            onClick={() => setGalleryIndex(i)}
                            className={`relative flex-1 h-16 rounded-lg overflow-hidden transition border-2 ${i === idx ? 'border-[#60c6d4]' : 'border-transparent opacity-60 hover:opacity-90'}`}
                          >
                            <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white text-center py-0.5 truncate px-1">
                              {p.label.split(' – ')[0]}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{detailModal.data.name}</h2>
                      <p className="text-slate-400">📍 {detailModal.data.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-[#60c6d4]">{detailModal.data.price}</p>
                      <p className="text-sm text-slate-400 mt-1">{detailModal.data.type} · {detailModal.data.sqm}sqm</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 my-6">
                    <div className="bg-white/5 p-4 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">Area</p>
                      <p className="text-xl font-bold text-white">{detailModal.data.sqm}sqm</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">Type</p>
                      <p className="text-xl font-bold text-white">{detailModal.data.type}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">ROI</p>
                      <p className="text-xl font-bold text-[#60c6d4]">{detailModal.data.roi}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">🏠 Key Features</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>✅ Premium Location ({detailModal.data.location})</li>
                      <li>✅ AI Verified (99.8% accuracy)</li>
                      <li>✅ 24/7 Security System</li>
                      <li>✅ Modern Amenities</li>
                      <li>✅ Guaranteed ROI</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">📍 Location Map</h3>
                    <div className="rounded-xl overflow-hidden border border-[#60c6d4]/30 bg-[#051827]">
                      <iframe
                        src={`https://www.google.com/maps?q=${encodeURIComponent(detailModal.data.location + ', Cebu, Philippines')}&output=embed`}
                        width="100%"
                        height="280"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map of ${detailModal.data.location}`}
                        allowFullScreen
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailModal.data.location + ', Cebu, Philippines')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4]/10 text-[#60c6d4] rounded-full hover:bg-[#60c6d4]/20 transition"
                      >
                        🗺️ Open in Google Maps
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(detailModal.data.location + ', Cebu, Philippines')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4] text-[#0A2540] rounded-full hover:bg-[#4cc0cc] transition"
                      >
                        🧭 Get Directions
                      </a>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">📊 Investment Analysis</h3>
                    <div className="bg-gradient-to-r from-[#60c6d4]/10 to-transparent p-4 rounded-xl">
                      <p className="text-slate-300 text-sm mb-2">Est. Monthly Rent: <span className="text-white font-bold">₱{(parseInt(detailModal.data.price.replace(/[₱M.]/g,'')) * 0.005).toFixed(0)}K</span></p>
                      <p className="text-slate-300 text-sm mb-2">5-Year Projected Return: <span className="text-[#60c6d4] font-bold">+{(parseFloat(detailModal.data.roi) * 5).toFixed(1)}%</span></p>
                      <p className="text-slate-300 text-sm">Risk Level: <span className="text-green-400 font-bold">Low</span></p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setTourBookingOpen(true)}
                      className="flex-1 py-3 bg-[#60c6d4] text-[#0A2540] rounded-full font-bold hover:bg-[#4cc0cc] transition">
                      🏠 Book Tour
                    </button>
                    <button
                      onClick={() => setAiAnalysisOpen(true)}
                      className="flex-1 py-3 border-2 border-[#60c6d4] text-[#60c6d4] rounded-full font-bold hover:bg-[#60c6d4]/10 transition">
                      📊 AI Analysis
                    </button>
                    <button
                      onClick={() => setInquiryOpen(true)}
                      className="flex-1 py-3 border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/5 transition">
                      💬 Inquiry
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Agent Detail */}
            {detailModal.type === 'agent' && (
              <div className="p-8 pt-16">
                <div className="text-center mb-6">
                  <div className="text-8xl mb-4">{detailModal.data.image}</div>
                  <h2 className="text-3xl font-bold text-white mb-2">{detailModal.data.name}</h2>
                  <p className="text-[#60c6d4]">🏆 Premium Agent</p>
                  <p className="text-slate-400 mt-2">{detailModal.data.email}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <p className="text-xs text-slate-400 mb-1">Managed Properties</p>
                    <p className="text-2xl font-bold text-white">{detailModal.data.properties}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <p className="text-xs text-slate-400 mb-1">Avg. ROI</p>
                    <p className="text-2xl font-bold text-[#60c6d4]">{detailModal.data.roi}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl text-center">
                    <p className="text-xs text-slate-400 mb-1">Rating</p>
                    <p className="text-2xl font-bold text-yellow-400">⭐ 4.9</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">🎯 Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Luxury Real Estate', 'IT Park', 'Investment Consulting', 'Overseas Buyers', 'Mactan Island'].map((spec, i) => (
                      <span key={i} className="px-3 py-1 bg-[#60c6d4]/10 text-[#60c6d4] rounded-full text-sm">{spec}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">📍 Office Location</h3>
                  <div className="rounded-xl overflow-hidden border border-[#60c6d4]/30 bg-[#051827]">
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent('38 Ave Cebu IT Park, Cebu, Philippines')}&output=embed`}
                      width="100%"
                      height="240"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Agent Office Location"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('38 Ave Cebu IT Park, Cebu, Philippines')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4]/10 text-[#60c6d4] rounded-full hover:bg-[#60c6d4]/20 transition"
                    >
                      🗺️ Open in Google Maps
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('38 Ave Cebu IT Park, Cebu, Philippines')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4] text-[#0A2540] rounded-full hover:bg-[#4cc0cc] transition"
                    >
                      🧭 Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-[#60c6d4] text-[#0A2540] rounded-full font-bold hover:bg-[#4cc0cc] transition">
                    📞 Call Agent
                  </button>
                  <button className="flex-1 py-3 border-2 border-[#60c6d4] text-[#60c6d4] rounded-full font-bold hover:bg-[#60c6d4]/10 transition">
                    📧 Send Email
                  </button>
                </div>
              </div>
            )}

            {/* Loan Detail */}
            {detailModal.type === 'loan' && (
              <div className="p-8 pt-16">
                <h2 className="text-3xl font-bold text-white mb-6">{detailModal.data.name}</h2>

                <div className="bg-gradient-to-r from-[#60c6d4]/20 to-transparent p-6 rounded-2xl mb-6">
                  <p className="text-sm text-slate-400 mb-1">Annual Interest Rate</p>
                  <p className="text-5xl font-bold text-[#60c6d4]">{detailModal.data.rate}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Loan Term</p>
                    <p className="text-2xl font-bold text-white">{detailModal.data.term}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Max Limit</p>
                    <p className="text-2xl font-bold text-white">{detailModal.data.max}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">✨ Benefits</h3>
                  <ul className="space-y-2 text-slate-300">
                    {detailModal.data.features.map((f: string, i: number) => <li key={i}>✓ {f}</li>)}
                    <li>✓ Fast Approval (within 24 hours)</li>
                    <li>✓ No Processing Fee</li>
                  </ul>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">💰 Monthly Payment Examples</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Loan Amount ₱10M:</span>
                      <span className="text-white font-bold">₱{(10000000 * (parseFloat(detailModal.data.rate)/100) / 12 * 1.2).toFixed(0).slice(0, -3)}K/mo</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Loan Amount ₱30M:</span>
                      <span className="text-white font-bold">₱{(30000000 * (parseFloat(detailModal.data.rate)/100) / 12 * 1.2).toFixed(0).slice(0, -3)}K/mo</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">📍 Lender Office</h3>
                  <div className="rounded-xl overflow-hidden border border-[#60c6d4]/30 bg-[#051827]">
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent('Cebu Business Park, Cebu, Philippines')}&output=embed`}
                      width="100%"
                      height="240"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Lender Office Location"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Cebu Business Park, Cebu, Philippines')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4]/10 text-[#60c6d4] rounded-full hover:bg-[#60c6d4]/20 transition"
                    >
                      🗺️ Open in Google Maps
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Cebu Business Park, Cebu, Philippines')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4] text-[#0A2540] rounded-full hover:bg-[#4cc0cc] transition"
                    >
                      🧭 Get Directions
                    </a>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#60c6d4] text-[#0A2540] rounded-full font-bold hover:bg-[#4cc0cc] transition">
                  💰 Apply for Loan
                </button>
              </div>
            )}

            {/* Report Detail */}
            {detailModal.type === 'report' && (
              <div className="p-8 pt-16">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-widest text-[#60c6d4] font-bold">{detailModal.data.type}</span>
                  <h2 className="text-3xl font-bold text-white mt-2">{detailModal.data.title}</h2>
                  <p className="text-slate-400 mt-2">📅 {detailModal.data.date}</p>
                </div>

                {detailModal.data.verified && (
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mb-6 flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-green-400 text-sm font-semibold">Verified Report - AI & Expert Validated</span>
                  </div>
                )}

                <div className="bg-gradient-to-r from-[#60c6d4]/20 to-transparent p-6 rounded-2xl mb-6">
                  <p className="text-sm text-slate-400 mb-1">Average ROI</p>
                  <p className="text-5xl font-bold text-[#60c6d4]">{detailModal.data.roi}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">📊 Key Findings</h3>
                  <div className="space-y-3 text-slate-300">
                    <p>• Cebu coastal investment values up <span className="text-[#60c6d4] font-bold">+12.5%</span> YoY</p>
                    <p>• IT Park area average occupancy rate <span className="text-[#60c6d4] font-bold">94%</span></p>
                    <p>• Mactan Island resort investment demand surging (+35%)</p>
                    <p>• Overseas buyer ratio reached <span className="text-[#60c6d4] font-bold">42%</span></p>
                    <p>• Additional growth expected in H2 2026</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">💡 Recommended Investment Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Cebu IT Park', 'Mactan Island', 'Banilad', 'Lahug', 'Cebu Business Park'].map((loc, i) => (
                      <span key={i} className="px-4 py-2 bg-[#60c6d4]/10 text-[#60c6d4] rounded-full text-sm font-semibold">📍 {loc}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">🗺️ Area Map</h3>
                  <div className="rounded-xl overflow-hidden border border-[#60c6d4]/30 bg-[#051827]">
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent('Cebu IT Park, Cebu, Philippines')}&output=embed`}
                      width="100%"
                      height="240"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Investment Area Map"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Cebu IT Park, Cebu, Philippines')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4]/10 text-[#60c6d4] rounded-full hover:bg-[#60c6d4]/20 transition"
                    >
                      🗺️ Open in Google Maps
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Cebu IT Park, Cebu, Philippines')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4] text-[#0A2540] rounded-full hover:bg-[#4cc0cc] transition"
                    >
                      🧭 Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-[#60c6d4] text-[#0A2540] rounded-full font-bold hover:bg-[#4cc0cc] transition">
                    📄 Download PDF
                  </button>
                  <button className="flex-1 py-3 border-2 border-[#60c6d4] text-[#60c6d4] rounded-full font-bold hover:bg-[#60c6d4]/10 transition">
                    📧 Subscribe
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== AI ANALYSIS MODAL ========== */}
      {aiAnalysisOpen && detailModal && detailModal.type === 'property' && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setAiAnalysisOpen(false)}>
          <div className="rounded-3xl w-full max-w-2xl bg-[#0A2540] border border-[#60c6d4]/30 p-8 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">📊 AI ROI Analysis</h2>
                <p className="text-sm text-slate-400 mt-1">{detailModal.data.name}</p>
              </div>
              <button onClick={() => setAiAnalysisOpen(false)} className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center">✕</button>
            </div>

            <div className="bg-gradient-to-r from-[#60c6d4]/20 to-transparent p-6 rounded-2xl mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-300">Projected Annual ROI</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">AI Verified</span>
              </div>
              <p className="text-5xl font-bold text-[#60c6d4]">{detailModal.data.roi}</p>
              <p className="text-sm text-slate-300 mt-2">+1.3% above market average</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">📈 1-Year Projected Return</p>
                <p className="text-2xl font-bold text-white">+{parseFloat(detailModal.data.roi)}%</p>
                <p className="text-xs text-[#60c6d4] mt-1">₱{((parseInt(detailModal.data.price.replace(/[^0-9]/g,'')) * parseFloat(detailModal.data.roi) / 100) || 600000).toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">📊 5-Year Cumulative Return</p>
                <p className="text-2xl font-bold text-white">+{(parseFloat(detailModal.data.roi) * 5).toFixed(1)}%</p>
                <p className="text-xs text-[#60c6d4] mt-1">Compound included</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">🏠 Est. Monthly Rent</p>
                <p className="text-2xl font-bold text-white">₱{Math.round((parseInt(detailModal.data.price.replace(/[^0-9]/g,'')) * 0.004) || 30000).toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-1">Based on area avg.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">⚠️ Risk Level</p>
                <p className="text-2xl font-bold text-green-400">Low</p>
                <p className="text-xs text-slate-400 mt-1">Stable investment</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">📉 Market Trend Analysis</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                  <span className="text-slate-300">Local Property Value Growth (YoY)</span>
                  <span className="text-[#60c6d4] font-bold">+12.5%</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                  <span className="text-slate-300">Rental Demand Index</span>
                  <span className="text-green-400 font-bold">94% (High)</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                  <span className="text-slate-300">Resale Value (3 years out)</span>
                  <span className="text-[#60c6d4] font-bold">+35%</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                  <span className="text-slate-300">Overseas Buyer Interest</span>
                  <span className="text-yellow-400 font-bold">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
            </div>

            <div className="bg-[#60c6d4]/10 border border-[#60c6d4]/30 p-4 rounded-xl mb-6">
              <p className="text-sm text-[#60c6d4] font-bold mb-2">💡 AI Recommendation</p>
              <p className="text-sm text-slate-200 leading-relaxed">
                This property represents a premium investment opportunity in {detailModal.data.location}.
                Under current market conditions, an annual return of {detailModal.data.roi} is projected,
                with high compounding upside when held for 5+ years.
              </p>
            </div>

            <button
              onClick={() => { setAiAnalysisOpen(false); setTourBookingOpen(true); }}
              className="w-full py-3 bg-[#60c6d4] text-[#0A2540] rounded-full font-bold hover:bg-[#4cc0cc] transition">
              🤖 Book Expert AI Consultation
            </button>
          </div>
        </div>
      )}

      {/* ========== INQUIRY MODAL ========== */}
      {inquiryOpen && detailModal && detailModal.type === 'property' && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setInquiryOpen(false)}>
          <div className="rounded-3xl w-full max-w-2xl bg-[#0A2540] border border-[#60c6d4]/30 p-8 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">💬 Property Details</h2>
                <p className="text-sm text-slate-400 mt-1">{detailModal.data.name}</p>
              </div>
              <button onClick={() => setInquiryOpen(false)} className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center">✕</button>
            </div>

            <div className="rounded-2xl overflow-hidden mb-6">
              <img src={detailModal.data.image} alt={detailModal.data.name} className="w-full h-56 object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">📍 Location</p>
                <p className="text-white font-bold">{detailModal.data.location}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">💰 Price</p>
                <p className="text-[#60c6d4] font-bold">{detailModal.data.price}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">🏠 Type</p>
                <p className="text-white font-bold">{detailModal.data.type}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">📐 Area</p>
                <p className="text-white font-bold">{detailModal.data.sqm} sqm</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">📊 ROI</p>
                <p className="text-[#60c6d4] font-bold">{detailModal.data.roi}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">🔖 Status</p>
                <p className="text-green-400 font-bold">{detailModal.data.status || 'For Sale'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">📍 Location Map</h3>
              <div className="rounded-xl overflow-hidden border border-[#60c6d4]/30 bg-[#051827]">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(detailModal.data.location + ', Cebu, Philippines')}&output=embed`}
                  width="100%"
                  height="240"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${detailModal.data.location}`}
                  allowFullScreen
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detailModal.data.location + ', Cebu, Philippines')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4]/10 text-[#60c6d4] rounded-full hover:bg-[#60c6d4]/20 transition"
                >
                  🗺️ Open in Google Maps
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(detailModal.data.location + ', Cebu, Philippines')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-[#60c6d4] text-[#0A2540] rounded-full hover:bg-[#4cc0cc] transition"
                >
                  🧭 Get Directions
                </a>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">🏢 Detailed Information</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span>Total Floors</span>
                  <span className="text-white">32 floors</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span>Year Built</span>
                  <span className="text-white">2024</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span>Parking</span>
                  <span className="text-white">2 slots</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span>Maintenance Fee</span>
                  <span className="text-white">₱8,500/mo</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span>Total Units</span>
                  <span className="text-white">250 units</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span>Amenities</span>
                  <span className="text-white">Pool, Gym, Sauna, 24/7 Security</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">✅ Key Features</h3>
              <ul className="space-y-2 text-slate-300">
                <li>✓ AI Verified (99.8% accuracy)</li>
                <li>✓ Legal documents thoroughly reviewed</li>
                <li>✓ Previous owner fully relocated</li>
                <li>✓ Renovation completed in 2025</li>
                <li>✓ Move-in ready</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setInquiryOpen(false); setTourBookingOpen(true); }}
                className="flex-1 py-3 bg-[#60c6d4] text-[#0A2540] rounded-full font-bold hover:bg-[#4cc0cc] transition">
                📅 Book Tour
              </button>
              <button className="flex-1 py-3 border-2 border-[#60c6d4] text-[#60c6d4] rounded-full font-bold hover:bg-[#60c6d4]/10 transition">
                📧 Request Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== AUTH MODAL ========== */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl w-full max-w-sm p-8 transition-colors duration-300" style={{ backgroundColor: theme.bg, color: theme.text }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
              <button onClick={() => setShowAuthModal(false)} className="text-xl hover:opacity-60">✕</button>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleSampleLogin('google')}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 transition hover:opacity-80 font-semibold"
                style={{ borderColor: theme.accent, color: theme.text }}
              >
                <span className="text-xl">🔵</span> Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleSampleLogin('facebook')}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 transition hover:opacity-80 font-semibold"
                style={{ borderColor: theme.accent, color: theme.text }}
              >
                <span className="text-xl">📘</span> Continue with Facebook
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" style={{ opacity: 0.3 }}>
                  <div className="w-full border-t" style={{ borderColor: theme.text }}></div>
                </div>
                <div className="relative flex justify-center text-sm" style={{ color: theme.text }}>
                  <span style={{ backgroundColor: theme.bg }} className="px-2">or</span>
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: colorTheme === 'night' ? '#0a1f33' : colorTheme === 'day' ? '#FFFFFF' : '#F5F5F5',
                      borderColor: theme.accent,
                      color: theme.text
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colorTheme === 'night' ? '#0a1f33' : colorTheme === 'day' ? '#FFFFFF' : '#F5F5F5',
                    borderColor: theme.accent,
                    color: theme.text
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colorTheme === 'night' ? '#0a1f33' : colorTheme === 'day' ? '#FFFFFF' : '#F5F5F5',
                    borderColor: theme.accent,
                    color: theme.text
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => authMode === 'signin' ? handleSampleLogin('email') : handleSampleSignUp()}
                className="w-full py-3 rounded-lg font-semibold transition hover:opacity-90"
                style={{ backgroundColor: theme.accent, color: theme.bg }}
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            <p className="text-center text-sm mt-6" style={{ color: theme.text }}>
              {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="font-semibold hover:underline"
                style={{ color: theme.accent }}
              >
                {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ========== FLOATING HELP BOX ========== */}
      <div className="fixed bottom-8 right-8 z-40">
        {!voiceOpen && (
          <div className="animate-fade-in">
            <div className="relative w-72 rounded-3xl bg-[#04131f]/95 backdrop-blur-2xl border border-[#60c6d4]/20 shadow-2xl p-6 hover:shadow-3xl hover:border-[#60c6d4]/40 transition-all duration-300">
              {/* Badge */}
              <div className="absolute -top-3 right-6 px-4 py-1 rounded-full bg-[#60c6d4] text-[#0A2540] text-xs font-bold shadow-lg">
                {t.widget.badge}
              </div>

              <div className="flex gap-4 items-center">
                {/* Icon Circle */}
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20">
                    {/* Gradient Background Circle */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#60c6d4] via-[#3db9ca] to-[#0d6b74] rounded-full opacity-90 animate-pulse"></div>

                    {/* Inner circle */}
                    <div className="absolute inset-1 bg-gradient-to-br from-[#93e1ea] to-[#60c6d4] rounded-full"></div>

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Phone className="w-8 h-8 text-black font-bold" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100 mb-1">{t.widget.helpTitle}</h3>
                  <p className="text-sm text-slate-300 mb-3">{t.widget.helpText}</p>

                  <button
                    onClick={() => setVoiceOpen(true)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#0d6b74] text-white font-semibold hover:bg-[#0f7f86] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border border-[#60c6d4]/50 hover:border-[#60c6d4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Phone size={16} />
                    {t.widget.call}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {voiceOpen && (
          <div className="animate-fade-in">
            <div className="w-80 rounded-2xl bg-[#04131f]/95 backdrop-blur-2xl border border-[#60c6d4]/30 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#60c6d4] to-[#0d6b74] p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white">{t.voice.title}</h3>
                  <p className="text-xs text-slate-200">Powered by ElevenLabs</p>
                </div>
                <button onClick={() => setVoiceOpen(false)} className="text-white hover:bg-white/10 p-1 rounded transition">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center mb-2">
                  <p className="text-sm text-slate-200/90 mb-1 font-bold">ElevenLabs AI Voice Consultation</p>
                  <div className="text-xs text-slate-400">Start a conversation using the widget below</div>
                </div>

                {/* ElevenLabs ConvAI Widget */}
                <div className="rounded-xl overflow-hidden bg-white/5 p-3 min-h-[300px]">
                  <div dangerouslySetInnerHTML={{
                    __html: '<elevenlabs-convai agent-id="agent_1601knwk3fqees0tt9h8xr6x4z8j"></elevenlabs-convai>'
                  }} />
                </div>

                <div className="text-xs text-slate-400 text-center pt-2">{t.widget.realTime}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4 } 50% { opacity: 1 } }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
        .animate-fade-in { animation: fade-in 0.3s ease-out }
      `}</style>
    </div>
  );
}
