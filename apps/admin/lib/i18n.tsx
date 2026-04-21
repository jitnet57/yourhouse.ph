'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Lang = 'en' | 'ko' | 'ja' | 'zh'

// ─── Translation dictionary ───────────────────────────────────────────────────
export const translations = {
  en: {
    // Layout
    layout: {
      title: 'K-IREA',
      tagline: 'Real Estate Intelligence',
      adminDashboard: 'Admin Dashboard',
      subtitle: 'Monitor integrations, manage assets, and review analytics.',
      secureAdmin: 'Secure',
      adminUser: 'Admin User',
      signedIn: 'Administrator',
      search: 'Search anything...',
      mainMenu: 'Main Menu',
      collapse: 'Collapse',
      menu: {
        dashboard: 'Dashboard',
        properties: 'Properties',
        leads: 'Leads',
        agents: 'Agents',
        users: 'Users',
        reports: 'Reports',
        settings: 'Settings',
      },
    },
    // Dashboard
    dashboard: {
      welcomeBack: 'Welcome back',
      greeting: 'Good to see you, Admin 👋',
      heroSubtitle: (leads: number, tasks: number) =>
        `Here's what's happening with your platform today. You have <b>${leads} new leads</b> and <b>${tasks} pending tasks</b>.`,
      viewReport: 'View Report',
      newProperty: '+ New Property',
      newThisWeek: 'New this week',
      pendingApproval: 'Pending approval',
      activeSessions: 'Active sessions',
      metrics: {
        activeListings: 'Active Listings',
        openLeads: 'Open Leads',
        conversionRate: 'Conversion Rate',
        monthlyRevenue: 'Monthly Revenue',
        avgResponse: 'Avg Response',
      },
      vsPeriod: 'vs last period',
      charts: {
        leadPipeline: 'Lead Pipeline',
        pipelineSubtitle: 'Conversion across stages',
        conversionTrend: 'Conversion Trend',
        trendSubtitle: 'Last 7 months',
      },
      funnel: {
        leads: 'Leads', contacted: 'Contacted', interested: 'Interested',
        negotiating: 'Negotiating', closed: 'Closed',
      },
      recentActivity: 'Recent Activity',
      activitySubtitle: 'Latest events across your platform',
      viewAll: 'View all',
      aiInsights: 'AI Insights',
      hotLeads: '3 leads are hot right now',
      aiSubtitle: 'Based on engagement patterns, these leads have a high probability of converting this week.',
      openAssistant: 'Open AI Assistant',
      activities: [
        { title: 'New lead generated', description: 'Maria Santos submitted an inquiry for Makati Penthouse', time: '2 minutes ago' },
        { title: 'Property listed', description: '3BR Condo in BGC, Taguig — ₱18.5M', time: '1 hour ago' },
        { title: 'Campaign sent', description: 'Weekly newsletter delivered to 2,340 subscribers', time: '3 hours ago' },
        { title: 'Agent onboarded', description: 'Juan dela Cruz joined Makati branch team', time: '5 hours ago' },
      ],
    },
    // Properties
    properties: {
      title: 'Properties',
      totalListings: (n: number) => `${n} total listings`,
      excelImport: 'Excel Import',
      addProperty: 'Add Property',
      searchPlaceholder: 'Search properties...',
      filter: 'Filter',
      table: {
        property: 'Property', details: 'Details', price: 'Price',
        status: 'Status', aiScore: 'AI Score', actions: 'Actions',
      },
      noResults: 'No properties found',
      status: { active: 'Active', pending: 'Pending', sold: 'Sold', for_rent: 'For Rent' },
      modal: {
        title: 'Add New Property',
        subtitle: 'Fill in the details and upload photos',
        photos: 'Property Photos',
        dropzone: 'Drop photos or browse',
        dropzoneHint: 'JPG, PNG, WEBP — up to 10 files',
        cover: 'Cover',
        fieldTitle: 'Title',
        titlePlaceholder: 'e.g. 3BR Luxury Condo in BGC',
        address: 'Address',
        addressPlaceholder: 'Street, City, Province',
        price: 'Price (₱)',
        pricePlaceholder: 'e.g. 5500000',
        type: 'Type',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        area: 'Area (sqm)',
        status: 'Status',
        description: 'Description',
        descPlaceholder: 'Describe amenities, location, features...',
        cancel: 'Cancel',
        submit: 'Add Property',
        saving: 'Saving...',
        saved: 'Saved!',
      },
      excel: {
        title: 'Excel Bulk Import',
        subtitle: 'Upload .xlsx or .csv to add multiple properties at once',
        downloadTemplate: 'Download Template',
        downloadHint: 'Use our template for correct column format',
        downloadBtn: 'Download .xlsx',
        requiredCols: 'Required Columns',
        dropzone: 'Drop your Excel file or browse',
        dropzoneHint: 'Supports .xlsx, .xls, .csv',
        errors: 'Validation Errors',
        previewLabel: (n: number) => `Preview — ${n} rows ready to import`,
        clear: 'Clear',
        importBtn: (n: number) => `Import ${n} Properties`,
        importing: 'Importing...',
        imported: (n: number) => `${n} properties imported!`,
        cols: { title: 'Title', address: 'Address', price: 'Price', type: 'Type', status: 'Status', br: 'BR', ba: 'BA', sqm: 'sqm' },
      },
    },
    // Leads
    leads: {
      title: 'Leads',
      addLead: 'Add Lead',
      searchPlaceholder: 'Search leads...',
      viewPipeline: 'View: Pipeline',
      table: { name: 'Name', contact: 'Contact', property: 'Property', agent: 'Agent', status: 'Status', interactions: 'Interactions', actions: 'Actions' },
      status: { new: 'New', contacted: 'Contacted', interested: 'Interested', negotiating: 'Negotiating', closed: 'Closed', lost: 'Lost' },
      noResults: 'No leads found',
    },
    // Agents
    agents: {
      title: 'AI Agent Control Center',
      subtitle: 'Monitor and manage AI agents in real-time',
      newAgent: 'New Agent',
      metrics: { active: 'Active Agents', avgResponse: 'Avg Response Time', avgAccuracy: 'Avg Accuracy', todayCalls: 'Today Calls' },
      table: { agent: 'Agent', model: 'Model', status: 'Status', performance: 'Performance', activity: 'Last Activity', actions: 'Actions' },
      status: { active: 'Active', inactive: 'Inactive', error: 'Error' },
      noResults: 'No agents found',
    },
    // Users
    users: {
      title: 'Users',
      addUser: 'Add User',
      searchPlaceholder: 'Search users...',
      table: { user: 'User', role: 'Role', status: 'Status', lastLogin: 'Last Login', actions: 'Actions' },
      roles: { admin: 'Admin', manager: 'Manager', agent: 'Agent', viewer: 'Viewer' },
      status: { active: 'Active', inactive: 'Inactive' },
      noResults: 'No users found',
      permissions: 'Permissions',
    },
    // Reports
    reports: {
      title: 'Reports',
      newReport: 'New Report',
      export: 'Export',
      filter: 'Filter',
      table: { name: 'Report Name', type: 'Type', frequency: 'Frequency', nextRun: 'Next Run', format: 'Format', status: 'Status', actions: 'Actions' },
      status: { scheduled: 'Scheduled', completed: 'Completed', running: 'Running' },
      frequency: { once: 'Once', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' },
      noResults: 'No reports found',
    },
    // Settings
    settings: {
      title: 'Settings',
      notSaved: 'Not yet saved.',
      lastSaved: (ts: string) => `Last saved: ${ts}`,
      saveBtn: 'Save Changes',
      saving: 'Saving...',
      resetBtn: 'Reset',
      resetConfirm: 'Reset all settings to defaults?',
      unsavedBanner: 'You have unsaved changes.',
      saveNow: 'Save now',
      sections: {
        general: 'General',
        notifications: 'Notifications',
        security: 'Security',
        integrations: 'Integrations',
      },
      general: {
        platformName: 'Platform Name', platformNameHint: 'Shown in browser tab and emails',
        supportEmail: 'Support Email', supportEmailHint: 'Receives customer inquiries',
        supportPhone: 'Support Phone',
        timezone: 'Timezone', timezoneHint: 'Applied to all date/time display',
        language: 'Default Language',
        currency: 'Currency',
      },
      notif: {
        emailOnNewLead: 'Email alert on new lead',
        emailOnSale: 'Email alert on completed sale',
        smsOnNewLead: 'SMS alert on new lead (requires Twilio)',
        weeklyReport: 'Auto-send weekly report (every Monday)',
        dailyDigest: 'Daily digest email (every 9 AM)',
      },
      security: {
        sessionTimeout: 'Session timeout', sessionTimeoutHint: 'Auto-logout after inactivity (minutes)',
        loginAttempts: 'Login attempt limit', loginAttemptsHint: 'Account locked after this many failures',
        passwordLength: 'Min password length',
        twoFactor: 'Enable two-factor authentication (2FA)',
      },
      integration: {
        twilioSid: 'Twilio Account SID', twilioSidHint: 'Used for SMS',
        twilioToken: 'Twilio Auth Token',
        elevenlabs: 'ElevenLabs API Key', elevenlabsHint: 'AI voice synthesis',
        googleMaps: 'Google Maps API Key', googleMapsHint: 'Property map display',
        crmWebhook: 'CRM Webhook URL', crmWebhookHint: 'Sends lead data to external CRM',
        apiKeyNote: 'API keys are stored in browser localStorage. Use server .env for production.',
      },
      timeouts: { '15': '15 min', '30': '30 min', '60': '1 hour', '480': '8 hours', '0': 'Never' },
      attempts: { '3': '3 times', '5': '5 times', '10': '10 times' },
      lengths: { '6': '6+ chars', '8': '8+ chars', '12': '12+ chars' },
    },
  },

  // ── Korean ──────────────────────────────────────────────────────────────────
  ko: {
    layout: {
      title: 'K-IREA', tagline: '부동산 인텔리전스',
      adminDashboard: '관리자 대시보드',
      subtitle: '통합을 모니터링하고 자산을 관리하며 분석을 검토하세요.',
      secureAdmin: '보안', adminUser: '관리자', signedIn: '관리자 계정',
      search: '무엇이든 검색...', mainMenu: '메인 메뉴', collapse: '접기',
      menu: { dashboard: '대시보드', properties: '부동산', leads: '리드', agents: '에이전트', users: '사용자', reports: '보고서', settings: '설정' },
    },
    dashboard: {
      welcomeBack: '환영합니다', greeting: '돌아오셨군요, 관리자님 👋',
      heroSubtitle: (leads: number, tasks: number) => `오늘 플랫폼 현황입니다. <b>신규 리드 ${leads}건</b>과 <b>처리 대기 ${tasks}건</b>이 있습니다.`,
      viewReport: '보고서 보기', newProperty: '+ 매물 등록',
      newThisWeek: '이번 주 신규', pendingApproval: '승인 대기', activeSessions: '활성 세션',
      metrics: { activeListings: '활성 매물', openLeads: '미처리 리드', conversionRate: '전환율', monthlyRevenue: '월 수익', avgResponse: '평균 응답' },
      vsPeriod: '이전 기간 대비',
      charts: { leadPipeline: '리드 파이프라인', pipelineSubtitle: '단계별 전환', conversionTrend: '전환율 추이', trendSubtitle: '최근 7개월' },
      funnel: { leads: '리드', contacted: '연락', interested: '관심', negotiating: '협상', closed: '계약' },
      recentActivity: '최근 활동', activitySubtitle: '플랫폼 최신 이벤트', viewAll: '전체 보기',
      aiInsights: 'AI 인사이트', hotLeads: '현재 핫한 리드 3건',
      aiSubtitle: '참여 패턴을 기반으로 이번 주 전환 가능성이 높은 리드입니다.',
      openAssistant: 'AI 어시스턴트 열기',
      activities: [
        { title: '신규 리드 생성됨', description: 'Maria Santos가 마카티 펜트하우스 문의 제출', time: '2분 전' },
        { title: '매물 등록됨', description: 'BGC 타기그 콘도 3BR — ₱18.5M', time: '1시간 전' },
        { title: '캠페인 발송됨', description: '주간 뉴스레터 2,340명에게 전달', time: '3시간 전' },
        { title: '에이전트 합류', description: 'Juan dela Cruz가 마카티 지점 팀에 합류', time: '5시간 전' },
      ],
    },
    properties: {
      title: '부동산', totalListings: (n: number) => `총 ${n}개 매물`,
      excelImport: '엑셀 임포트', addProperty: '매물 등록',
      searchPlaceholder: '매물 검색...', filter: '필터',
      table: { property: '매물', details: '세부정보', price: '가격', status: '상태', aiScore: 'AI 점수', actions: '작업' },
      noResults: '매물이 없습니다',
      status: { active: '활성', pending: '대기', sold: '판매완료', for_rent: '임대' },
      modal: {
        title: '새 매물 등록', subtitle: '정보를 입력하고 사진을 업로드하세요',
        photos: '매물 사진', dropzone: '사진을 드래그하거나 클릭하여 선택', dropzoneHint: 'JPG, PNG, WEBP — 최대 10장', cover: '커버',
        fieldTitle: '제목', titlePlaceholder: '예: BGC 럭셔리 콘도 3BR',
        address: '주소', addressPlaceholder: '도로명, 시, 도',
        price: '가격 (₱)', pricePlaceholder: '예: 5500000',
        type: '타입', bedrooms: '침실', bathrooms: '화장실', area: '면적 (㎡)',
        status: '상태', description: '설명', descPlaceholder: '시설, 위치, 특징을 설명하세요...',
        cancel: '취소', submit: '매물 등록', saving: '저장 중...', saved: '저장됨!',
      },
      excel: {
        title: '엑셀 일괄 임포트', subtitle: '.xlsx 또는 .csv로 여러 매물을 한 번에 등록',
        downloadTemplate: '템플릿 다운로드', downloadHint: '올바른 컬럼 형식을 위해 템플릿을 사용하세요',
        downloadBtn: '.xlsx 다운로드', requiredCols: '필수 컬럼',
        dropzone: '엑셀 파일을 드래그하거나 클릭하여 선택', dropzoneHint: '.xlsx, .xls, .csv 지원',
        errors: '유효성 오류',
        previewLabel: (n: number) => `미리보기 — ${n}개 행 임포트 준비됨`,
        clear: '지우기', importBtn: (n: number) => `${n}개 매물 가져오기`,
        importing: '임포트 중...', imported: (n: number) => `${n}개 매물 임포트 완료!`,
        cols: { title: '제목', address: '주소', price: '가격', type: '타입', status: '상태', br: '침실', ba: '욕실', sqm: '㎡' },
      },
    },
    leads: {
      title: '리드', addLead: '리드 추가', searchPlaceholder: '리드 검색...', viewPipeline: '보기: 파이프라인',
      table: { name: '이름', contact: '연락처', property: '매물', agent: '에이전트', status: '상태', interactions: '상호작용', actions: '작업' },
      status: { new: '신규', contacted: '연락됨', interested: '관심', negotiating: '협상중', closed: '계약완료', lost: '이탈' },
      noResults: '리드가 없습니다',
    },
    agents: {
      title: 'AI 에이전트 제어 센터', subtitle: 'AI 에이전트를 실시간으로 모니터링 및 관리',
      newAgent: '새 에이전트',
      metrics: { active: '활성 에이전트', avgResponse: '평균 응답 시간', avgAccuracy: '평균 정확도', todayCalls: '오늘 호출 수' },
      table: { agent: '에이전트', model: '모델', status: '상태', performance: '성능', activity: '마지막 활동', actions: '작업' },
      status: { active: '활성', inactive: '비활성', error: '오류' },
      noResults: '에이전트가 없습니다',
    },
    users: {
      title: '사용자', addUser: '사용자 추가', searchPlaceholder: '사용자 검색...',
      table: { user: '사용자', role: '역할', status: '상태', lastLogin: '마지막 로그인', actions: '작업' },
      roles: { admin: '관리자', manager: '매니저', agent: '에이전트', viewer: '뷰어' },
      status: { active: '활성', inactive: '비활성' },
      noResults: '사용자가 없습니다', permissions: '권한',
    },
    reports: {
      title: '보고서', newReport: '새 보고서', export: '내보내기', filter: '필터',
      table: { name: '보고서명', type: '타입', frequency: '주기', nextRun: '다음 실행', format: '형식', status: '상태', actions: '작업' },
      status: { scheduled: '예약됨', completed: '완료', running: '실행중' },
      frequency: { once: '1회', daily: '매일', weekly: '매주', monthly: '매월' },
      noResults: '보고서가 없습니다',
    },
    settings: {
      title: '설정', notSaved: '아직 저장되지 않았습니다.',
      lastSaved: (ts: string) => `마지막 저장: ${ts}`,
      saveBtn: '변경사항 저장', saving: '저장 중...', resetBtn: '초기화',
      resetConfirm: '모든 설정을 초기값으로 되돌릴까요?',
      unsavedBanner: '저장하지 않은 변경사항이 있습니다.', saveNow: '지금 저장',
      sections: { general: '일반 설정', notifications: '알림 설정', security: '보안 설정', integrations: '외부 서비스 연동' },
      general: {
        platformName: '플랫폼 이름', platformNameHint: '브라우저 탭 및 이메일에 표시',
        supportEmail: '고객지원 이메일', supportEmailHint: '문의 이메일 수신 주소',
        supportPhone: '고객지원 전화번호', timezone: '시간대', timezoneHint: '모든 날짜/시간 표시에 적용',
        language: '기본 언어', currency: '통화',
      },
      notif: {
        emailOnNewLead: '신규 리드 발생 시 이메일 알림',
        emailOnSale: '거래 완료 시 이메일 알림',
        smsOnNewLead: '신규 리드 발생 시 SMS 알림 (Twilio 필요)',
        weeklyReport: '주간 리포트 자동 이메일 발송 (매주 월요일)',
        dailyDigest: '일일 요약 이메일 발송 (매일 오전 9시)',
      },
      security: {
        sessionTimeout: '세션 만료', sessionTimeoutHint: '비활성 후 자동 로그아웃 시간 (분)',
        loginAttempts: '로그인 시도 제한', loginAttemptsHint: '초과 시 계정 잠금',
        passwordLength: '최소 비밀번호 길이',
        twoFactor: '2단계 인증 (2FA) 활성화',
      },
      integration: {
        twilioSid: 'Twilio Account SID', twilioSidHint: 'SMS 발송에 사용',
        twilioToken: 'Twilio Auth Token', elevenlabs: 'ElevenLabs API Key', elevenlabsHint: 'AI 음성 합성',
        googleMaps: 'Google Maps API Key', googleMapsHint: '매물 지도 표시',
        crmWebhook: 'CRM Webhook URL', crmWebhookHint: '리드 생성 시 외부 CRM으로 전송',
        apiKeyNote: 'API 키는 브라우저 로컬스토리지에 저장됩니다. 운영 환경에서는 .env를 사용하세요.',
      },
      timeouts: { '15': '15분', '30': '30분', '60': '1시간', '480': '8시간', '0': '만료 안 함' },
      attempts: { '3': '3회', '5': '5회', '10': '10회' },
      lengths: { '6': '6자 이상', '8': '8자 이상', '12': '12자 이상' },
    },
  },

  // ── Japanese ─────────────────────────────────────────────────────────────────
  ja: {
    layout: {
      title: 'K-IREA', tagline: '不動産インテリジェンス',
      adminDashboard: '管理者ダッシュボード',
      subtitle: '統合を監視し、資産を管理し、分析をレビューします。',
      secureAdmin: 'セキュア', adminUser: '管理者', signedIn: '管理者アカウント',
      search: '検索...', mainMenu: 'メインメニュー', collapse: '折りたたむ',
      menu: { dashboard: 'ダッシュボード', properties: 'プロパティ', leads: 'リード', agents: 'エージェント', users: 'ユーザー', reports: 'レポート', settings: '設定' },
    },
    dashboard: {
      welcomeBack: 'おかえりなさい', greeting: '管理者様、お帰りなさい 👋',
      heroSubtitle: (leads: number, tasks: number) => `今日のプラットフォーム状況です。<b>新規リード ${leads}件</b>と<b>保留中タスク ${tasks}件</b>があります。`,
      viewReport: 'レポートを見る', newProperty: '+ 物件を追加',
      newThisWeek: '今週の新規', pendingApproval: '承認待ち', activeSessions: 'アクティブセッション',
      metrics: { activeListings: 'アクティブ物件', openLeads: '未処理リード', conversionRate: '転換率', monthlyRevenue: '月間収益', avgResponse: '平均応答' },
      vsPeriod: '前期比',
      charts: { leadPipeline: 'リードパイプライン', pipelineSubtitle: 'ステージ別転換', conversionTrend: '転換率推移', trendSubtitle: '直近7ヶ月' },
      funnel: { leads: 'リード', contacted: '連絡済', interested: '興味あり', negotiating: '交渉中', closed: '成約' },
      recentActivity: '最近の活動', activitySubtitle: 'プラットフォームの最新イベント', viewAll: 'すべて見る',
      aiInsights: 'AIインサイト', hotLeads: '現在ホットなリード3件',
      aiSubtitle: 'エンゲージメントパターンに基づき、今週転換確率の高いリードです。',
      openAssistant: 'AIアシスタントを開く',
      activities: [
        { title: '新規リード生成', description: 'Maria SantosがMakatiペントハウスの問い合わせを送信', time: '2分前' },
        { title: '物件登録', description: 'BGC、タギッグのコンド3BR — ₱18.5M', time: '1時間前' },
        { title: 'キャンペーン送信', description: '週次ニュースレターが2,340名に配信', time: '3時間前' },
        { title: 'エージェント参加', description: 'Juan dela CruzがMakati支店チームに参加', time: '5時間前' },
      ],
    },
    properties: {
      title: 'プロパティ', totalListings: (n: number) => `全${n}件`,
      excelImport: 'Excelインポート', addProperty: '物件を追加',
      searchPlaceholder: '物件を検索...', filter: 'フィルター',
      table: { property: '物件', details: '詳細', price: '価格', status: 'ステータス', aiScore: 'AIスコア', actions: '操作' },
      noResults: '物件が見つかりません',
      status: { active: 'アクティブ', pending: '審査中', sold: '売却済', for_rent: '賃貸' },
      modal: {
        title: '新規物件追加', subtitle: '詳細を入力して写真をアップロード',
        photos: '物件写真', dropzone: '写真をドロップまたはクリック', dropzoneHint: 'JPG, PNG, WEBP — 最大10枚', cover: 'カバー',
        fieldTitle: 'タイトル', titlePlaceholder: '例: BGCラグジュアリーコンド3BR',
        address: '住所', addressPlaceholder: '番地、市、県',
        price: '価格 (₱)', pricePlaceholder: '例: 5500000',
        type: 'タイプ', bedrooms: '寝室', bathrooms: 'バスルーム', area: '面積 (㎡)',
        status: 'ステータス', description: '説明', descPlaceholder: '設備、場所、特徴を説明...',
        cancel: 'キャンセル', submit: '物件を追加', saving: '保存中...', saved: '保存しました!',
      },
      excel: {
        title: 'Excel一括インポート', subtitle: '.xlsxまたは.csvで複数物件を一括登録',
        downloadTemplate: 'テンプレートDL', downloadHint: '正しい列形式のテンプレートを使用',
        downloadBtn: '.xlsxダウンロード', requiredCols: '必須列',
        dropzone: 'Excelファイルをドロップまたはクリック', dropzoneHint: '.xlsx, .xls, .csv対応',
        errors: 'バリデーションエラー',
        previewLabel: (n: number) => `プレビュー — ${n}行インポート準備完了`,
        clear: 'クリア', importBtn: (n: number) => `${n}件の物件をインポート`,
        importing: 'インポート中...', imported: (n: number) => `${n}件インポート完了!`,
        cols: { title: 'タイトル', address: '住所', price: '価格', type: 'タイプ', status: 'ステータス', br: '寝室', ba: 'バス', sqm: '㎡' },
      },
    },
    leads: {
      title: 'リード', addLead: 'リード追加', searchPlaceholder: 'リードを検索...', viewPipeline: '表示: パイプライン',
      table: { name: '名前', contact: '連絡先', property: '物件', agent: 'エージェント', status: 'ステータス', interactions: '対話数', actions: '操作' },
      status: { new: '新規', contacted: '連絡済', interested: '興味あり', negotiating: '交渉中', closed: '成約', lost: '失注' },
      noResults: 'リードが見つかりません',
    },
    agents: {
      title: 'AIエージェント制御センター', subtitle: 'AIエージェントをリアルタイムで管理・監視',
      newAgent: '新規エージェント',
      metrics: { active: 'アクティブ数', avgResponse: '平均応答時間', avgAccuracy: '平均精度', todayCalls: '本日の呼出数' },
      table: { agent: 'エージェント', model: 'モデル', status: 'ステータス', performance: '性能', activity: '最終活動', actions: '操作' },
      status: { active: 'アクティブ', inactive: '非アクティブ', error: 'エラー' },
      noResults: 'エージェントが見つかりません',
    },
    users: {
      title: 'ユーザー', addUser: 'ユーザー追加', searchPlaceholder: 'ユーザーを検索...',
      table: { user: 'ユーザー', role: '役割', status: 'ステータス', lastLogin: '最終ログイン', actions: '操作' },
      roles: { admin: '管理者', manager: 'マネージャー', agent: 'エージェント', viewer: 'ビューアー' },
      status: { active: 'アクティブ', inactive: '非アクティブ' },
      noResults: 'ユーザーが見つかりません', permissions: '権限',
    },
    reports: {
      title: 'レポート', newReport: '新規レポート', export: 'エクスポート', filter: 'フィルター',
      table: { name: 'レポート名', type: 'タイプ', frequency: '頻度', nextRun: '次回実行', format: '形式', status: 'ステータス', actions: '操作' },
      status: { scheduled: '予約済', completed: '完了', running: '実行中' },
      frequency: { once: '1回', daily: '毎日', weekly: '毎週', monthly: '毎月' },
      noResults: 'レポートが見つかりません',
    },
    settings: {
      title: '設定', notSaved: 'まだ保存されていません。',
      lastSaved: (ts: string) => `最終保存: ${ts}`,
      saveBtn: '変更を保存', saving: '保存中...', resetBtn: 'リセット',
      resetConfirm: 'すべての設定を初期値に戻しますか？',
      unsavedBanner: '未保存の変更があります。', saveNow: '今すぐ保存',
      sections: { general: '一般設定', notifications: '通知設定', security: 'セキュリティ設定', integrations: '外部サービス連携' },
      general: {
        platformName: 'プラットフォーム名', platformNameHint: 'ブラウザタブとメールに表示',
        supportEmail: 'サポートメール', supportEmailHint: 'お問い合わせ受信アドレス',
        supportPhone: 'サポート電話', timezone: 'タイムゾーン', timezoneHint: 'すべての日時表示に適用',
        language: 'デフォルト言語', currency: '通貨',
      },
      notif: {
        emailOnNewLead: '新規リード時メール通知', emailOnSale: '取引完了時メール通知',
        smsOnNewLead: '新規リード時SMS通知（Twilio必要）',
        weeklyReport: '週次レポート自動メール（毎週月曜）',
        dailyDigest: '日次ダイジェストメール（毎朝9時）',
      },
      security: {
        sessionTimeout: 'セッションタイムアウト', sessionTimeoutHint: '非アクティブ後の自動ログアウト（分）',
        loginAttempts: 'ログイン試行制限', loginAttemptsHint: '超過時アカウントロック',
        passwordLength: '最小パスワード長', twoFactor: '二段階認証（2FA）を有効化',
      },
      integration: {
        twilioSid: 'Twilio Account SID', twilioSidHint: 'SMS送信に使用',
        twilioToken: 'Twilio Auth Token', elevenlabs: 'ElevenLabs APIキー', elevenlabsHint: 'AI音声合成',
        googleMaps: 'Google Maps APIキー', googleMapsHint: '物件地図表示',
        crmWebhook: 'CRM Webhook URL', crmWebhookHint: 'リード生成時に外部CRMへ送信',
        apiKeyNote: 'APIキーはブラウザのlocalStorageに保存されます。本番環境では.envを使用してください。',
      },
      timeouts: { '15': '15分', '30': '30分', '60': '1時間', '480': '8時間', '0': 'なし' },
      attempts: { '3': '3回', '5': '5回', '10': '10回' },
      lengths: { '6': '6文字以上', '8': '8文字以上', '12': '12文字以上' },
    },
  },

  // ── Chinese ───────────────────────────────────────────────────────────────────
  zh: {
    layout: {
      title: 'K-IREA', tagline: '房地产智能',
      adminDashboard: '管理员仪表盘',
      subtitle: '监视集成、管理资产并查看分析。',
      secureAdmin: '安全', adminUser: '管理员', signedIn: '管理员账户',
      search: '搜索...', mainMenu: '主菜单', collapse: '收起',
      menu: { dashboard: '仪表盘', properties: '房源', leads: '线索', agents: '代理', users: '用户', reports: '报告', settings: '设置' },
    },
    dashboard: {
      welcomeBack: '欢迎回来', greeting: '欢迎回来，管理员 👋',
      heroSubtitle: (leads: number, tasks: number) => `今日平台概况。您有 <b>${leads} 条新线索</b>和 <b>${tasks} 个待处理任务</b>。`,
      viewReport: '查看报告', newProperty: '+ 新增房源',
      newThisWeek: '本周新增', pendingApproval: '待审批', activeSessions: '活跃会话',
      metrics: { activeListings: '活跃房源', openLeads: '待处理线索', conversionRate: '转化率', monthlyRevenue: '月收入', avgResponse: '平均响应' },
      vsPeriod: '与上期对比',
      charts: { leadPipeline: '线索漏斗', pipelineSubtitle: '各阶段转化', conversionTrend: '转化趋势', trendSubtitle: '近7个月' },
      funnel: { leads: '线索', contacted: '已联系', interested: '感兴趣', negotiating: '谈判中', closed: '已成交' },
      recentActivity: '最近活动', activitySubtitle: '平台最新事件', viewAll: '查看全部',
      aiInsights: 'AI洞察', hotLeads: '当前3条热门线索',
      aiSubtitle: '基于参与模式，这些线索本周转化概率较高。',
      openAssistant: '打开AI助手',
      activities: [
        { title: '新线索生成', description: 'Maria Santos提交了Makati顶层公寓询盘', time: '2分钟前' },
        { title: '房源已发布', description: 'BGC他基格3室公寓 — ₱18.5M', time: '1小时前' },
        { title: '活动已发送', description: '周刊新闻已送达2,340名订阅者', time: '3小时前' },
        { title: '经纪人入职', description: 'Juan dela Cruz加入了Makati分部团队', time: '5小时前' },
      ],
    },
    properties: {
      title: '房源', totalListings: (n: number) => `共 ${n} 套房源`,
      excelImport: 'Excel导入', addProperty: '新增房源',
      searchPlaceholder: '搜索房源...', filter: '筛选',
      table: { property: '房源', details: '详情', price: '价格', status: '状态', aiScore: 'AI评分', actions: '操作' },
      noResults: '未找到房源',
      status: { active: '在售', pending: '待审', sold: '已售', for_rent: '出租' },
      modal: {
        title: '新增房源', subtitle: '填写信息并上传照片',
        photos: '房源照片', dropzone: '拖拽照片或点击选择', dropzoneHint: 'JPG, PNG, WEBP — 最多10张', cover: '封面',
        fieldTitle: '标题', titlePlaceholder: '例：BGC豪华公寓3室',
        address: '地址', addressPlaceholder: '街道、城市、省份',
        price: '价格 (₱)', pricePlaceholder: '例：5500000',
        type: '类型', bedrooms: '卧室', bathrooms: '卫生间', area: '面积 (㎡)',
        status: '状态', description: '描述', descPlaceholder: '描述设施、位置、特色...',
        cancel: '取消', submit: '新增房源', saving: '保存中...', saved: '已保存!',
      },
      excel: {
        title: 'Excel批量导入', subtitle: '上传.xlsx或.csv批量添加房源',
        downloadTemplate: '下载模板', downloadHint: '请使用模板确保列格式正确',
        downloadBtn: '下载.xlsx', requiredCols: '必填列',
        dropzone: '拖拽Excel文件或点击选择', dropzoneHint: '支持.xlsx, .xls, .csv',
        errors: '验证错误',
        previewLabel: (n: number) => `预览 — ${n} 行待导入`,
        clear: '清除', importBtn: (n: number) => `导入 ${n} 套房源`,
        importing: '导入中...', imported: (n: number) => `已导入 ${n} 套房源!`,
        cols: { title: '标题', address: '地址', price: '价格', type: '类型', status: '状态', br: '卧室', ba: '卫生间', sqm: '㎡' },
      },
    },
    leads: {
      title: '线索', addLead: '添加线索', searchPlaceholder: '搜索线索...', viewPipeline: '视图：漏斗',
      table: { name: '姓名', contact: '联系方式', property: '房源', agent: '经纪人', status: '状态', interactions: '互动次数', actions: '操作' },
      status: { new: '新线索', contacted: '已联系', interested: '感兴趣', negotiating: '谈判中', closed: '已成交', lost: '已丢失' },
      noResults: '未找到线索',
    },
    agents: {
      title: 'AI代理控制中心', subtitle: '实时监控和管理AI代理',
      newAgent: '新建代理',
      metrics: { active: '活跃代理', avgResponse: '平均响应时间', avgAccuracy: '平均准确率', todayCalls: '今日调用' },
      table: { agent: '代理', model: '模型', status: '状态', performance: '性能', activity: '最后活动', actions: '操作' },
      status: { active: '活跃', inactive: '非活跃', error: '错误' },
      noResults: '未找到代理',
    },
    users: {
      title: '用户', addUser: '添加用户', searchPlaceholder: '搜索用户...',
      table: { user: '用户', role: '角色', status: '状态', lastLogin: '最后登录', actions: '操作' },
      roles: { admin: '管理员', manager: '经理', agent: '经纪人', viewer: '查看者' },
      status: { active: '活跃', inactive: '非活跃' },
      noResults: '未找到用户', permissions: '权限',
    },
    reports: {
      title: '报告', newReport: '新建报告', export: '导出', filter: '筛选',
      table: { name: '报告名称', type: '类型', frequency: '频率', nextRun: '下次运行', format: '格式', status: '状态', actions: '操作' },
      status: { scheduled: '已计划', completed: '已完成', running: '运行中' },
      frequency: { once: '一次', daily: '每天', weekly: '每周', monthly: '每月' },
      noResults: '未找到报告',
    },
    settings: {
      title: '设置', notSaved: '尚未保存。',
      lastSaved: (ts: string) => `最后保存：${ts}`,
      saveBtn: '保存更改', saving: '保存中...', resetBtn: '重置',
      resetConfirm: '将所有设置重置为默认值？',
      unsavedBanner: '您有未保存的更改。', saveNow: '立即保存',
      sections: { general: '常规设置', notifications: '通知设置', security: '安全设置', integrations: '外部服务集成' },
      general: {
        platformName: '平台名称', platformNameHint: '显示在浏览器标签和邮件中',
        supportEmail: '客服邮箱', supportEmailHint: '接收客户咨询',
        supportPhone: '客服电话', timezone: '时区', timezoneHint: '应用于所有日期/时间显示',
        language: '默认语言', currency: '货币',
      },
      notif: {
        emailOnNewLead: '新线索时邮件提醒', emailOnSale: '成交时邮件提醒',
        smsOnNewLead: '新线索时短信提醒（需要Twilio）',
        weeklyReport: '每周自动发送周报（每周一）',
        dailyDigest: '每日摘要邮件（每天早上9点）',
      },
      security: {
        sessionTimeout: '会话超时', sessionTimeoutHint: '非活动后自动注销（分钟）',
        loginAttempts: '登录尝试限制', loginAttemptsHint: '超过次数后锁定账户',
        passwordLength: '最小密码长度', twoFactor: '启用两步验证（2FA）',
      },
      integration: {
        twilioSid: 'Twilio账户SID', twilioSidHint: '用于短信发送',
        twilioToken: 'Twilio Auth Token', elevenlabs: 'ElevenLabs API密钥', elevenlabsHint: 'AI语音合成',
        googleMaps: 'Google Maps API密钥', googleMapsHint: '房源地图显示',
        crmWebhook: 'CRM Webhook URL', crmWebhookHint: '线索生成时发送到外部CRM',
        apiKeyNote: 'API密钥存储在浏览器localStorage中。生产环境请使用服务器.env文件。',
      },
      timeouts: { '15': '15分钟', '30': '30分钟', '60': '1小时', '480': '8小时', '0': '永不' },
      attempts: { '3': '3次', '5': '5次', '10': '10次' },
      lengths: { '6': '6位以上', '8': '8位以上', '12': '12位以上' },
    },
  },
} as const

export type Translations = typeof translations.en

// ─── Context ─────────────────────────────────────────────────────────────────
interface LanguageContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  const setLang = (l: Lang) => {
    setLangState(l)
    if (typeof window !== 'undefined') localStorage.setItem('kirea_lang', l)
  }

  // Restore from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('kirea_lang') as Lang | null
    if (saved && translations[saved]) setLangState(saved)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as unknown as Translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
