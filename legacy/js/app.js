/* ===================================================
   LUMO — Comprehensive App Logic v2.0
   Based on lumosity-kapsamli-rehber.md
   =================================================== */

'use strict';

// ===================================================
// INTERNATIONALIZATION (i18n) — TR & EN
// ===================================================
let currentLang = localStorage.getItem('lumo_lang') || 'tr';

const I18N = {
  tr: {
    langLabel: "TR",
    // Landing
    landingHeroTitle: 'Beynini eğit.<br>Gelişimini <span class="highlight">takip et.</span>',
    landingHeroSub: 'Bilişsel psikoloji temelli, performansına göre gerçek zamanlı adapte olan beyin egzersizleri — hafıza, dikkat, işlem hızı, esneklik ve problem çözme becerilerini geliştirir.',
    landingStartFit: 'Ücretsiz Fit Teste Başla',
    landingNote: 'Kredi kartı gerekmez · Gizli ücret yok · %100 bilimsel şeffaflık',
    landingLogin: 'Giriş Yap',
    landingGetStarted: 'Ücretsiz Başla',
    featAdaptiveTitle: 'Adaptif Zorluk',
    featAdaptiveDesc: 'Her oyun performans seviyene göre milisaniyelik ayarlanır — asla çok kolay ya da yıldırıcı olmaz.',
    featPrecisionTitle: 'Milisaniye Hassasiyeti',
    featPrecisionDesc: 'Tepki süren milisaniye cinsinden ölçülür ve oturum oturum gelişimin grafiklerle gösterilir.',
    featTransparentTitle: 'Radikal Şeffaflık',
    featTransparentDesc: 'Abartılı sağlık iddiaları yok, gerçek bilimsel referanslar ve kolay iptal garantisi.',

    // Auth & Navigation
    loginTitle: 'Tekrar Hoş Geldin',
    loginSubmit: 'Giriş Yap',
    loginSwitch: 'Yeni misin?',
    loginStartFree: 'Ücretsiz Fit Teste başla',
    backHome: '← Ana Sayfaya Dön',
    navHome: 'Ana Sayfa',
    navGames: 'Oyunlar',
    navInsights: 'Analizler',
    navProfile: 'Profil',

    // Fit Test
    fitTestTitle: 'Bilişsel Seviye Testi',
    fitTestDesc: 'Performans seviyene uyarlanan 3 hızlı oyun ile zihinsel temel profilini çıkaralım.',
    fitTestEst: '~90 sn',
    fitTestBtn: 'Fit Teste Başla',
    fitTestNote: '~4.5 dakika sürer · Başlamak için hesap gerekmez',
    fitResultTitle: 'Başlangıç Bilişsel Profilin',
    fitResultSub: 'Tamamladığın oyunlara göre mevcut zihinsel haritan:',
    fitPercentileLabel: 'Genel Yüzdelik Dilim · Yaş Grubu 25–34',
    fitStartTraining: 'Antrenmana Başla →',
    fitSaveLater: 'Daha Sonra Devam Et',

    // Home
    goodMorning: 'Günaydın!',
    goodAfternoon: 'Tünaydın!',
    goodEvening: 'İyi akşamlar!',
    readyWorkout: 'Bugünkü zihinsel antrenmanına hazır mısın?',
    todayWorkout: 'Günün Antrenmanı',
    startWorkoutBtn: 'Antrenmana Başla',
    yourPerformance: 'Bilişsel Performansın',
    thisWeek: 'Bu Hafta',
    sessions: 'Oturum',
    avgSpeed: 'Ort. Hız',
    lpiChange: 'LPI Değişimi',
    weeklyInsightDef: 'İlk antrenmanını tamamlayarak haftalık analizleri aç.',
    profileBadgeTag: 'Bilişsel Profil Tipi',
    profileBadgeShare: 'Paylaş →',
    copiedClipboard: '📋 Panoya kopyalandı!',

    // Games
    startGameBtn: 'Oyuna Başla',
    exitConfirmTitle: 'Oyundan çıkmak istiyor musunuz?',
    exitConfirmDesc: 'Mevcut tur ilerlemeniz kaydedilmeyecek. En yüksek skorunuz korundu.',
    exitYes: 'Evet, Çık',
    exitKeep: 'Oynamaya Devam Et',
    memorizeFirst: '🧠 <strong>İlk sembolü aklında tut...</strong>',
    btnYes: '✓ EVET',
    btnNo: '✕ HAYIR',
    keyboardHelp: 'Klavye: ← [HAYIR] &nbsp;·&nbsp; [EVET] →',
    mmMemorize: 'Kareleri aklında tut…',
    mmTap: 'Kareleri hatırla!',
    mmLevel: 'Seviye',
    mmRound: 'Tur',
    mmCorrect: 'Harika!',
    mmMistake: 'Dikkat!',
    mmCompleted: 'Tamamlandı!',
    mmRoundOver: 'Tur Bitti!',
    correctText: '✓ Doğru!',
    wrongText: '✕ Yanlış!',
    correctAnswerWas: 'Doğru cevap:',
    matchedNotice: 'EVET (eşleşiyordu)',
    differedNotice: 'HAYIR (farklıydı)',
    streakWord: 'seri!',
    limInstruction: 'Ortadaki <span style="color:var(--accent-teal);font-weight:800;">kuşun yönünü</span> seç',
    limDistracted: '✗ Dikkat dağıldı! Hedef yön:',
    limArrowHelp: 'Klavye veya butonlar: ↑ [YUKARI] · ↓ [AŞAĞI] · ← [SOL] · → [SAĞ]',
    dirUp: 'YUKARI',
    dirDown: 'AŞAĞI',
    dirLeft: 'SOL',
    dirRight: 'SAĞ',
    nextGameLabel: 'Sıradaki Oyun:',
    pauseSession: 'Oturumu Duraklat',
    seeBaselineResults: 'Temel Seviye Sonuçlarını Gör →',
    premiumLocked: 'bu oyun Premium üyelere özeldir. Kilidi açmak için yükseltin!',
    flankerEffectTitle: 'Flanker Etkisi',
    flankerEffectSuppression: 'Mükemmel odaklanma ve çeldirici bastırma!',
    flankerEffectTypical: 'Tipik çeldirici etkisi — normal seviyede.',
    flankerEffectSensitive: 'Çeldiricilere karşı hassasiyet yüksek — antrenmanla gelişir!',
    kqTitle: '🧠 BİLİMSEL BİLGİ KÖŞESİ',
    kqContinue: 'Devam Et →',
    raindropsInstruction: 'İşlemleri yere çarpmadan önce doğru cevabı yazarak çöz!',
    colorMatchInstruction: 'Üstteki kelimenin anlamı, alttaki yazının rengiyle eşleşiyor mu?',
    chalkboardInstruction: 'Hangi işlemin matematiksel sonucu DAHA BÜYÜK?',

    // Result
    resultOutstanding: 'Harika Performans!',
    resultGreat: 'Tebrikler!',
    resultNice: 'İyi Deneme!',
    resultAccuracy: 'Doğruluk',
    resultAvgSpeed: 'Ort. Hız',
    resultMaxCombo: 'Maks. Seri',
    resultRanking: 'Sıralama',
    detailedAnalysis: '📊 Detaylı Analiz',
    fastestResponses: '⚡ En Hızlı Tepkiler',
    slowestResponses: '🐢 En Yavaş Tepkiler',
    vsLastSession: '📈 Önceki Oturuma Göre',
    playAgainBtn: 'Tekrar Oyna',
    backToGamesBtn: 'Oyunlara Dön',

    // Categories & Nav
    catAll: 'Tümü',
    catMemory: 'Hafıza',
    catAttention: 'Dikkat',
    catSpeed: 'İşlem Hızı',
    catFlexibility: 'Esneklik',
    catProblemSolving: 'Problem Çözme',
    gamesPageTitle: 'Oyunlar',
    insightsPageTitle: 'İçgörüler',
    profilePageTitle: 'Profil',
    workoutGamesCount: count => `${count} oyun`,
    nbackLevelUp: '🚀 N-Back Seviye Atladı! Şimdi 2 adım öncesini takip ediyorsun',
    flankerCongruentVs: 'uyumlu ort.',
    flankerIncongruentVs: 'uyumsuz',
    scienceNoteTitle: 'Bu neyi ölçer?',
    scienceNoteDesc: 'Tepki süresi değişkenliği (en hızlı ve en yavaş tepkileriniz arasındaki fark), bilişsel tutarlılığın tek başına ortalama hızdan daha güçlü bir göstergesidir.',
    rtChartTitle: 'Tur Başına Tepki Süresi',
    statGamesPlayed: 'Oynanan Oyun',
    statDaysActive: 'Aktif Gün',
    statTopArea: 'En Güçlü Alan',
    statSevenDayProgress: '7 Günlük İlerleme',
    bpiDescText: 'Lumo Bilişsel Performans Endeksi'
  },
  en: {
    langLabel: "EN",
    // Landing
    landingHeroTitle: 'Train your brain.<br>Track your <span class="highlight">progress.</span>',
    landingHeroSub: 'Scientifically inspired mini-games that adapt to your performance level — measuring memory, attention, processing speed, cognitive flexibility, and problem solving.',
    landingStartFit: 'Start Free Fit Test',
    landingNote: 'No credit card · No hidden fees · 100% transparent',
    landingLogin: 'Log In',
    landingGetStarted: 'Get Started Free',
    featAdaptiveTitle: 'Adaptive Difficulty',
    featAdaptiveDesc: 'Every game adjusts to your exact performance level in real time — never too easy, never frustrating.',
    featPrecisionTitle: 'Millisecond Precision',
    featPrecisionDesc: 'We measure reaction time to the millisecond and visualize your improvement session by session.',
    featTransparentTitle: 'Radical Transparency',
    featTransparentDesc: 'Honest science explanations, no exaggerated health claims, and zero hidden subscription tricks.',

    // Auth & Navigation
    loginTitle: 'Welcome Back',
    loginSubmit: 'Log In',
    loginSwitch: 'New user?',
    loginStartFree: 'Start your Fit Test free',
    backHome: '← Back to Home',
    navHome: 'Home',
    navGames: 'Games',
    navInsights: 'Insights',
    navProfile: 'Profile',

    // Fit Test
    fitTestTitle: 'Your Fit Test',
    fitTestDesc: 'Three quick games that adapt to your skill level, establishing your baseline cognitive profile.',
    fitTestEst: '~90 sec',
    fitTestBtn: 'Begin Fit Test',
    fitTestNote: '~5 minutes total · No account required to start',
    fitResultTitle: 'Your Baseline Results',
    fitResultSub: 'Based on your performance, here is where your cognitive profile stands today.',
    fitPercentileLabel: 'Overall Percentile · Age Group 25–34',
    fitStartTraining: 'Start Training →',
    fitSaveLater: 'Save for Later',

    // Home
    goodMorning: 'Good morning!',
    goodAfternoon: 'Good afternoon!',
    goodEvening: 'Good evening!',
    readyWorkout: "Ready for today's workout?",
    todayWorkout: "Today's Workout",
    startWorkoutBtn: 'Start Workout',
    yourPerformance: 'Your Performance',
    thisWeek: 'This Week',
    sessions: 'Sessions',
    avgSpeed: 'Avg Speed',
    lpiChange: 'LPI Change',
    weeklyInsightDef: 'Complete your first workout to unlock weekly insights.',
    profileBadgeTag: 'Your Cognitive Profile',
    profileBadgeShare: 'Share →',
    copiedClipboard: '📋 Copied to clipboard!',

    // Games
    startGameBtn: 'Start Game',
    exitConfirmTitle: 'Leave this game?',
    exitConfirmDesc: 'Your current round progress will be lost. Your high score is already saved.',
    exitYes: 'Yes, Exit',
    exitKeep: 'Keep Playing',
    memorizeFirst: '🧠 <strong>Memorize the first symbol...</strong>',
    btnYes: '✓ YES',
    btnNo: '✕ NO',
    keyboardHelp: 'Keyboard: ← [NO] &nbsp;·&nbsp; [YES] →',
    mmMemorize: 'Memorize the tiles…',
    mmTap: 'Tap the tiles!',
    mmLevel: 'Level',
    mmRound: 'Round',
    mmCorrect: 'Perfect!',
    mmMistake: 'Careful!',
    mmCompleted: 'Completed!',
    mmRoundOver: 'Round Over!',
    correctText: '✓ Correct!',
    wrongText: '✕ Incorrect!',
    correctAnswerWas: 'Correct answer:',
    matchedNotice: 'YES (they matched)',
    differedNotice: 'NO (they differed)',
    streakWord: 'streak!',
    limInstruction: 'Tap direction of the <span style="color:var(--accent-teal);font-weight:800;">center bird</span>',
    limDistracted: '✗ Distracted! Target direction was:',
    limArrowHelp: 'Keyboard or buttons: ↑ [UP] · ↓ [DOWN] · ← [LEFT] · → [RIGHT]',
    dirUp: 'UP',
    dirDown: 'DOWN',
    dirLeft: 'LEFT',
    dirRight: 'RIGHT',
    nextGameLabel: 'Next Game:',
    pauseSession: 'Pause Session',
    seeBaselineResults: 'See Your Baseline Results →',
    premiumLocked: 'is a Premium game. Upgrade to unlock!',
    flankerEffectTitle: 'Flanker Effect',
    flankerEffectSuppression: 'Excellent focus and distractor suppression!',
    flankerEffectTypical: 'Typical distractor interference — average level.',
    flankerEffectSensitive: 'High distractor sensitivity — practice helps!',
    kqTitle: '🧠 SCIENCE KNOWLEDGE QUIZ',
    kqContinue: 'Continue →',
    raindropsInstruction: 'Solve arithmetic equations before they hit the ground!',
    colorMatchInstruction: 'Does the top word match the ink color of the bottom text?',
    chalkboardInstruction: 'Which expression has the GREATER value?',

    // Result
    resultOutstanding: 'Outstanding!',
    resultGreat: 'Great Work!',
    resultNice: 'Nice Effort!',
    resultAccuracy: 'Accuracy',
    resultAvgSpeed: 'Avg Speed',
    resultMaxCombo: 'Max Combo',
    resultRanking: 'Ranking',
    detailedAnalysis: '📊 Detailed Analysis',
    fastestResponses: '⚡ Fastest Responses',
    slowestResponses: '🐢 Slowest Responses',
    vsLastSession: '📈 vs. Last Session',
    playAgainBtn: 'Play Again',
    backToGamesBtn: 'Back to Games',

    // Categories & Nav
    catAll: 'All',
    catMemory: 'Memory',
    catAttention: 'Attention',
    catSpeed: 'Speed',
    catFlexibility: 'Flexibility',
    catProblemSolving: 'Problem Solving',
    gamesPageTitle: 'Games',
    insightsPageTitle: 'Insights',
    profilePageTitle: 'Profile',
    workoutGamesCount: count => `${count} games`,
    nbackLevelUp: '🚀 N-Back Level Up! Now tracking 2 steps back',
    flankerCongruentVs: 'congruent avg',
    flankerIncongruentVs: 'incongruent',
    scienceNoteTitle: 'What does this measure?',
    scienceNoteDesc: 'Reaction time variance (the difference between your fastest and slowest responses) is a stronger predictor of cognitive consistency than average speed alone.',
    rtChartTitle: 'Reaction Time per Round',
    statGamesPlayed: 'Games Played',
    statDaysActive: 'Days Active',
    statTopArea: 'Top Area',
    statSevenDayProgress: '7-Day Progress',
    bpiDescText: 'Lumo Performance Index'
  }
};

function t(key, ...args) {
  const dict = I18N[currentLang] || I18N.tr;
  const val = dict[key];
  if (typeof val === 'function') return val(...args);
  return val || key;
}

function toggleLanguage() {
  const next = currentLang === 'tr' ? 'en' : 'tr';
  setLanguage(next);
  showToast(next === 'tr' ? '🇹🇷 Dil Türkçe olarak ayarlandı' : '🇬🇧 Language switched to English');
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lumo_lang', lang);
  applyLanguageToDOM();
}

function applyLanguageToDOM() {
  const dict = I18N[currentLang] || I18N.tr;

  // Language button labels
  ['landing-lang-label', 'app-lang-label', 'game-lang-label'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = dict.langLabel;
  });

  // Landing page texts
  const heroH1 = document.querySelector('.hero-content h1');
  if (heroH1) heroH1.innerHTML = dict.landingHeroTitle;
  const heroSub = document.querySelector('.hero-subtitle');
  if (heroSub) heroSub.textContent = dict.landingHeroSub;
  const heroNote = document.querySelector('.hero-note');
  if (heroNote) heroNote.textContent = dict.landingNote;
  const heroFitBtn = document.querySelector('.hero-content .btn-primary');
  if (heroFitBtn) heroFitBtn.innerHTML = `${dict.landingStartFit} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  const landLoginBtn = document.getElementById('landing-login-btn');
  if (landLoginBtn) landLoginBtn.textContent = dict.landingLogin;
  const landGetStartedBtn = document.getElementById('landing-getstarted-btn');
  if (landGetStartedBtn) landGetStartedBtn.textContent = dict.landingGetStarted;

  // Features
  const features = document.querySelectorAll('.landing-features .feature');
  if (features.length >= 3) {
    features[0].querySelector('h3').textContent = dict.featAdaptiveTitle;
    features[0].querySelector('p').textContent = dict.featAdaptiveDesc;
    features[1].querySelector('h3').textContent = dict.featPrecisionTitle;
    features[1].querySelector('p').textContent = dict.featPrecisionDesc;
    features[2].querySelector('h3').textContent = dict.featTransparentTitle;
    features[2].querySelector('p').textContent = dict.featTransparentDesc;
  }

  // Hero visual cards
  const heroCardCats = {
    'hc-memory': dict.catMemory,
    'hc-attention': dict.catAttention,
    'hc-speed': dict.catSpeed,
    'hc-flexibility': dict.catFlexibility,
    'hc-problem': dict.catProblemSolving
  };
  Object.keys(heroCardCats).forEach(cls => {
    const el = document.querySelector(`.hero-card.${cls} span`);
    if (el) el.textContent = heroCardCats[cls];
  });

  // Login page texts
  const loginH2 = document.querySelector('#login-page h2');
  if (loginH2) loginH2.textContent = dict.loginTitle;
  const lblEmail = document.getElementById('lbl-login-email');
  if (lblEmail) lblEmail.textContent = currentLang === 'tr' ? 'E-posta' : 'Email';

  const lblPass = document.getElementById('lbl-login-password');
  if (lblPass) lblPass.textContent = currentLang === 'tr' ? 'Şifre' : 'Password';
  const loginEmail = document.getElementById('login-email');
  if (loginEmail) loginEmail.placeholder = currentLang === 'tr' ? 'ornek@email.com' : 'you@example.com';
  const loginPass = document.getElementById('login-password');
  if (loginPass) loginPass.placeholder = currentLang === 'tr' ? 'Şifrenizi girin' : '••••••••';
  const btnLogin = document.getElementById('btn-login-submit');
  if (btnLogin) btnLogin.textContent = dict.loginSubmit;
  const backHomeBtn = document.querySelector('#login-page .btn-text');
  if (backHomeBtn) backHomeBtn.textContent = dict.backHome;
  const authSwitch = document.querySelector('.auth-switch');
  if (authSwitch) authSwitch.innerHTML = `${dict.loginSwitch} <a href="#" onclick="startOnboarding()">${dict.loginStartFree}</a>`;

  // Fit Test screen

  const ftTitle = document.querySelector('.fittest-container h2');
  if (ftTitle) ftTitle.textContent = dict.fitTestTitle;
  const ftDesc = document.querySelector('.fittest-container > p');
  if (ftDesc) ftDesc.textContent = dict.fitTestDesc;
  const ftBtn = document.querySelector('.fittest-container button.btn-primary');
  if (ftBtn) ftBtn.innerHTML = `${dict.fitTestBtn} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  const ftNote = document.querySelector('.fittest-container > p:last-child');
  if (ftNote) ftNote.textContent = dict.fitTestNote;

  const ftPips = document.querySelectorAll('.ft-game-pip .ft-est');
  ftPips.forEach(p => { p.textContent = currentLang === 'tr' ? '~90 sn' : '~90 sec'; });

  // Nav buttons
  const navMap = { home: dict.navHome, games: dict.navGames, stats: dict.navInsights, profile: dict.navProfile };
  document.querySelectorAll('.desktop-nav button, .bottom-nav button').forEach(btn => {
    const tab = btn.dataset.tab;
    if (tab && navMap[tab]) {
      const span = btn.querySelector('span');
      if (span) span.textContent = navMap[tab];
      else btn.textContent = navMap[tab];
    }
  });

  // Category Filters
  const catNames = {
    all: dict.catAll,
    memory: dict.catMemory,
    attention: dict.catAttention,
    speed: dict.catSpeed,
    flexibility: dict.catFlexibility,
    'problem-solving': dict.catProblemSolving
  };
  document.querySelectorAll('.cat-filter').forEach(btn => {
    const cat = btn.dataset.cat;
    if (cat && catNames[cat]) btn.textContent = catNames[cat];
  });

  // Performance Cards on Home Tab
  document.querySelectorAll('.perf-card').forEach(card => {
    const cat = card.dataset.category;
    const label = card.querySelector('.perf-label');
    if (cat && label && catNames[cat]) label.textContent = catNames[cat];
  });

  // Section Headers & Page Titles
  const gamesTitle = document.querySelector('#tab-games .page-title');
  if (gamesTitle) gamesTitle.textContent = dict.gamesPageTitle;
  const statsTitle = document.querySelector('#tab-stats .page-title');
  if (statsTitle) statsTitle.textContent = dict.insightsPageTitle;
  const profileTitle = document.querySelector('#tab-profile .page-title');
  if (profileTitle) profileTitle.textContent = dict.profilePageTitle;
  const perfHeader = document.querySelector('#tab-home .section-header h3');
  if (perfHeader) perfHeader.textContent = dict.yourPerformance;
  const dailyWorkoutLabel = document.querySelector('.daily-workout-card .workout-label');
  if (dailyWorkoutLabel) dailyWorkoutLabel.textContent = dict.todayWorkout;
  const startWorkoutBtn = document.getElementById('start-workout-btn');
  if (startWorkoutBtn) startWorkoutBtn.textContent = dict.startWorkoutBtn;
  const wrTitle = document.querySelector('#weekly-report .wr-title');
  if (wrTitle) wrTitle.textContent = dict.thisWeek;

  const wrStatLabels = document.querySelectorAll('#weekly-report .wr-stat-label');
  if (wrStatLabels.length >= 3) {
    wrStatLabels[0].textContent = dict.sessions;
    wrStatLabels[1].textContent = dict.avgSpeed;
    wrStatLabels[2].textContent = dict.lpiChange;
  }

  // Stats tab labels
  const chartH3 = document.querySelector('.chart-header h3');
  if (chartH3) chartH3.textContent = dict.statSevenDayProgress;
  const bpiDesc = document.querySelector('.bpi-desc');
  if (bpiDesc) bpiDesc.textContent = dict.bpiDescText;
  const statItems = document.querySelectorAll('.stats-games-played .stat-item .stat-label');
  if (statItems.length >= 3) {
    statItems[0].textContent = dict.statGamesPlayed;
    statItems[1].textContent = dict.statDaysActive;
    statItems[2].textContent = dict.statTopArea;
  }

  // Exit dialog
  const exitH3 = document.querySelector('#exit-dialog h3');
  if (exitH3) exitH3.textContent = dict.exitConfirmTitle;
  const exitP = document.querySelector('#exit-dialog p');
  if (exitP) exitP.textContent = dict.exitConfirmDesc;
  const exitYes = document.querySelector('#exit-dialog .btn-coral');
  if (exitYes) exitYes.textContent = dict.exitYes;
  const exitKeep = document.querySelector('#exit-dialog .btn-ghost');
  if (exitKeep) exitKeep.textContent = dict.exitKeep;

  // Knowledge quiz overlay
  const kqBadge = document.querySelector('.kq-badge');
  if (kqBadge) {
    kqBadge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> ${currentLang === 'tr' ? 'Beyin Bilgisi' : 'Brain Fact'}`;
  }
  const kqCont = document.getElementById('kq-continue-btn');
  if (kqCont) kqCont.textContent = dict.kqContinue;

  // Fit Test baseline result screen
  const fitResH2 = document.querySelector('.fit-result-header h2');
  if (fitResH2) fitResH2.textContent = dict.fitResultTitle;
  const fitResP = document.querySelector('.fit-result-header p');
  if (fitResP) fitResP.textContent = dict.fitResultSub;
  const fitPercLabel = document.querySelector('.percentile-label');
  if (fitPercLabel) fitPercLabel.textContent = dict.fitPercentileLabel;
  const fitStartBtn = document.querySelector('#fittest-result-screen .btn-primary');
  if (fitStartBtn) fitStartBtn.textContent = dict.fitStartTraining;
  const fitSaveBtn = document.querySelector('#fittest-result-screen .btn-secondary');
  if (fitSaveBtn) fitSaveBtn.textContent = dict.fitSaveLater;

  // Result screen debrief and labels
  const debriefToggleSpan = document.querySelector('.session-debrief-toggle span');
  if (debriefToggleSpan) debriefToggleSpan.textContent = dict.detailedAnalysis;
  const debriefTitles = document.querySelectorAll('.debrief-section-title');
  if (debriefTitles.length >= 3) {
    debriefTitles[0].textContent = dict.fastestResponses;
    debriefTitles[1].textContent = dict.slowestResponses;
    debriefTitles[2].textContent = dict.vsLastSession;
  }
  const scienceNote = document.querySelector('.science-note-text');
  if (scienceNote) {
    scienceNote.innerHTML = `<strong>${dict.scienceNoteTitle}</strong> ${dict.scienceNoteDesc}`;
  }
  const rtChartTitle = document.querySelector('.result-rt-title');
  if (rtChartTitle) rtChartTitle.textContent = dict.rtChartTitle;

  // Re-render onboarding if active
  if (document.getElementById('onboarding-page')?.classList.contains('active')) {
    renderOnboardingQ();
  }

  // Re-render components with translated texts
  initGreeting();
  renderDailyWorkout();
  renderGamesGrid();
  renderWeeklyReport();
  renderProfileBadge();
  renderStatsChart();

  // Dynamic game text updates if game is active
  const mmKEl = document.getElementById("mm-k-indicator");
  if (mmKEl && typeof mmK !== "undefined") {
    mmKEl.textContent = `${dict.mmLevel} K: ${mmK} · ${dict.mmRound} ${mmRoundNum}`;
  }
}


// ===================================================
// APP STATE
// ===================================================
const state = {
  user: {
    name: "Demo User",
    email: "demo@lumo.app",
    isLoggedIn: false,
    streak: 3,
    gamesPlayed: 24,
    daysActive: 8,
    lpi: 612,
    categoryScores: {
      memory: 650,
      attention: 720,
      speed: 580,
      flexibility: 450,
      "problem-solving": 600
    },
    onboardingProfile: null,
    fitTestDone: false,
    fitTestScores: null,
    gamesSinceLastQuiz: 0
  },
  currentGame: null,
  gameTimer: null,
  score: 0,
  round: 0,
  correctCount: 0,
  totalCount: 0,
  comboStreak: 0,
  multiplier: 1,
  maxCombo: 0,
  startTime: 0,
  reactionTimes: [],
  roundAccuracies: [],
  workoutQueue: [],
  currentWorkoutIndex: 0,
  isWorkoutMode: false,
  isFitTestMode: false,
  isGameActive: false,
  isPaused: false
};


// ===================================================
// WEB AUDIO SYNTHESIZER (LUMOSITY+)
// ===================================================
let audioCtx = null;
function playSound(type) {
  // If game is paused, only allow UI clicks
  if (state.isPaused && type !== "click") return;

  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const t = audioCtx.currentTime;

    if (type === "tick") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t); osc.stop(t + 0.08);
    } else if (type === "go") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25);
    } else if (type === "flip") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(620, t + 0.06);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.start(t); osc.stop(t + 0.06);
    } else if (type === "pop") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(700, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.09);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.start(t); osc.stop(t + 0.09);
    } else if (type === "correct") {
      // Sparkling major arpeggio (C5 -> E5 -> G5)
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t + i * 0.04);
        gain.gain.setValueAtTime(0.15, t + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.14);
        osc.start(t + i * 0.04);
        osc.stop(t + i * 0.04 + 0.14);
      });
    } else if (type === "wrong") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.linearRampToValueAtTime(130, t + 0.22);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
      osc.start(t); osc.stop(t + 0.22);
    } else if (type === "combo") {
      [523, 659, 784, 1047].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t + i * 0.07);
        gain.gain.setValueAtTime(0.2, t + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.07 + 0.2);
        osc.start(t + i * 0.07);
        osc.stop(t + i * 0.07 + 0.2);
      });
    } else if (type === "fanfare") {
      [523, 659, 784, 1047, 1318].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t + i * 0.09);
        gain.gain.setValueAtTime(0.22, t + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.09 + 0.3);
        osc.start(t + i * 0.09);
        osc.stop(t + i * 0.09 + 0.3);
      });
    } else if (type === "quiz") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(550, t + 0.1);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.start(t); osc.stop(t + 0.25);
    }
  } catch(e) { /* silent */ }
}

// ===================================================
// GAMES DATABASE
// ===================================================
const GAMES = [
  {
    id: "memory-matrix",
    name: "Memory Matrix",
    category: "memory",
    icon: `<svg viewBox="0 0 36 36" width="36" height="36"><rect x="4" y="4" width="28" height="28" rx="6" fill="#FF8C42" opacity="0.15"/><rect x="8" y="8" width="8" height="8" rx="2" fill="#FF8C42"/><rect x="20" y="8" width="8" height="8" rx="2" fill="#FF8C42"/><rect x="8" y="20" width="8" height="8" rx="2" fill="#FF8C42"/><rect x="20" y="20" width="8" height="8" rx="2" fill="#FF8C42" opacity="0.3"/></svg>`,
    description: {
      tr: "Kareler ızgara üzerinde yanıp söner — deseni aklında tut ve ardından hafızandan her vurgulanan kareye dokun.",
      en: "Tiles flash on a grid — memorize the pattern, then tap each highlighted cell from memory."
    },
    playable: true,
    insight: {
      tr: "Görsel-uzamsal çalışan bellek, bilgiyi zihninde tutarken aynı anda üzerinde işlem yapmanı sağlar. Yön bulma, karmaşık planlama ve görselleştirme için kritiktir.",
      en: "Spatial working memory holds visual-spatial information while you manipulate it. It's crucial for navigation, following directions, and visualizing complex structures."
    },
    duration: 180
  },
  {
    id: "speed-match",
    name: "Speed Match",
    category: "speed",
    icon: `<svg viewBox="0 0 36 36" width="36" height="36"><circle cx="18" cy="18" r="14" fill="#EF4444" opacity="0.15"/><path d="M19 8L10 20h8l-1 10 9-12h-8l1-10z" fill="#EF4444"/></svg>`,
    description: {
      tr: "Mevcut sembol bir öncekiyle eşleşiyor mu? EVET veya HAYIR ile olabildiğince hızlı yanıt ver.",
      en: "Does the current symbol match the previous? Respond as fast as you can with YES or NO."
    },
    playable: true,
    insight: {
      tr: "İşlem hızı, bilgiyi ne kadar hızlı algılayıp tepki verdiğini ölçer. Daha hızlı işlem yapabilmek, karmaşık düşünme için zihinsel kapasiteyi serbest bırakır.",
      en: "Processing speed measures how quickly you take in and respond to information. Faster processing frees up mental bandwidth for complex thinking."
    },
    duration: 180
  },
  {
    id: "lost-in-migration",
    name: "Lost in Migration",
    category: "attention",
    icon: `<svg viewBox="0 0 36 36" width="36" height="36"><circle cx="18" cy="18" r="14" fill="#10B981" opacity="0.15"/><path d="M12 18l6-6 6 6M18 12v12" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    description: {
      tr: "Bir kuş sürüsü belirir. Yanlardaki çeldirici kuşları görmezden gel — sadece parlayan ortadaki kuşun uçuş yönüne odaklan.",
      en: "A flock of birds appears. Ignore the distractors — only the glowing center bird's direction matters."
    },
    playable: true,
    insight: {
      tr: "Bu klasik Flanker testidir. Seçici dikkati ve ilgisiz uyarıcılardan gelen zihinsel paraziti bastırma yeteneğini ölçer.",
      en: "This is the flanker task — a classic cognitive neuroscience paradigm measuring selective attention and the ability to suppress interference from irrelevant stimuli."
    },
    duration: 180
  },
  {
    id: "raindrops",
    name: "Raindrops",
    category: "speed",
    icon: `<svg viewBox="0 0 36 36" width="36" height="36"><path d="M18 6 C18 6, 26 16, 26 22 C26 26.4 22.4 30 18 30 C13.6 30 10 26.4 10 22 C10 16, 18 6, 18 6Z" fill="#3B82F6" opacity="0.8"/></svg>`,
    description: {
      tr: "Matematik denklemleri yağmur damlaları gibi düşer — yere çarpmadan önce doğru cevabı yazarak çöz!",
      en: "Math equations fall as raindrops — solve them before they hit the ground!"
    },
    playable: true,
    insight: {
      tr: "Aritmetik akıcılık sadece ezber değil, zaman baskısı altında hızlı sembolik akıl yürütmeyi gerektirir ve sol paryetal korteksi çalıştırır.",
      en: "Arithmetic fluency is more than memorized facts — it involves rapid symbolic reasoning under time pressure, exercising the brain's left parietal cortex."
    },
    duration: 180
  },
  {
    id: "color-match",
    name: "Color Match",
    category: "flexibility",
    icon: `<svg viewBox="0 0 36 36" width="36" height="36"><circle cx="18" cy="18" r="14" fill="#A78BFA" opacity="0.15"/><circle cx="18" cy="18" r="10" fill="none" stroke="#A78BFA" stroke-width="3"/><circle cx="18" cy="18" r="5" fill="#A78BFA"/></svg>`,
    description: {
      tr: "Üstteki kelimenin anlamı, alttaki yazının mürekkep rengiyle eşleşiyor mu? Otomatik okuma dürtünü bastır!",
      en: "Does the top word name match the ink color of the bottom text? Suppress your reading impulse!"
    },
    playable: true,
    insight: {
      tr: "Stroop etkisi: Otomatik okuma alışkanlığı ile renk adlandırma yarışır. Bu çatışmayı kontrol etmek beynin yönetici merkezi prefrontal korteksi geliştirir.",
      en: "The Stroop effect: automatic word reading competes with color naming. Inhibiting this response exercises the prefrontal cortex — the brain's executive control center."
    },
    duration: 120
  },
  {
    id: "chalkboard-challenge",
    name: "Chalkboard Challenge",
    category: "problem-solving",
    icon: `<svg viewBox="0 0 36 36" width="36" height="36"><rect x="4" y="4" width="28" height="28" rx="6" fill="#3B82F6" opacity="0.15"/><path d="M12 12h12M12 18h12M12 24h12" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    description: {
      tr: "İki matematiksel ifade yan yana belirir. Hangisinin daha büyük olduğuna veya eşit olup olmadıklarına hızla karar ver.",
      en: "Two math expressions appear side by side. Quickly decide which is greater — or if they're equal."
    },
    playable: true,
    insight: {
      tr: "Hız baskısı altında nicel akıl yürütme, beynin sayısal büyüklük karşılaştırmalarını yöneten intraparyetal sulkus bölgesini aktive eder.",
      en: "Quantitative reasoning under speed pressure activates the intraparietal sulcus — the brain region handling numerical magnitude comparisons."
    },
    duration: 120
  },
  {
    id: "train-of-thought",
    name: "Train of Thought",
    category: "attention",
    icon: `<svg viewBox="0 0 36 36" width="36" height="36"><rect x="4" y="4" width="28" height="28" rx="6" fill="#10B981" opacity="0.15"/><path d="M10 24h16M14 12h8M12 18h12" stroke="#10B981" stroke-width="3" stroke-linecap="round"/></svg>`,
    description: {
      tr: "Renkli trenleri kaza yapmadan eşleşen istasyonlarına yönlendir.",
      en: "Guide colored trains to their matching destination stations before they crash."
    },
    playable: false,
    insight: {
      tr: "Bölünmüş dikkat, birden fazla dinamik görevi aynı anda yönetebilme yeteneğini test eder.",
      en: "Divided attention allows managing multiple dynamic tasks simultaneously — a core component of multitasking ability."
    },
    duration: 180
  },
  {
    id: "pinball-recall",
    name: "Pinball Recall",
    category: "memory",
    icon: `<svg viewBox="0 0 36 36" width="36" height="36"><circle cx="18" cy="18" r="14" fill="#FF8C42" opacity="0.15"/><circle cx="18" cy="18" r="8" fill="#FF8C42"/></svg>`,
    description: {
      tr: "Tamponların konumlarını aklında tut, ardından topun nereye gideceğini tahmin et.",
      en: "Memorize bumper positions, then predict where the ball will go."
    },
    playable: false,
    insight: {
      tr: "Zihinsel simülasyon ve görsel hafızayı birlikte çalıştırmayı gerektirir.",
      en: "Visual tracking and mental simulation strengthen multi-object memory and predictive spatial cognition."
    },
    duration: 180
  }
];

// ===================================================
// ONBOARDING QUIZ — BILINGUAL (TR / EN)
// ===================================================
const OB_QUESTIONS = [
  {
    question: {
      tr: "En çok hangi zihinsel alanını geliştirmek istersin?",
      en: "Which area do you most want to improve?"
    },
    multi: true,
    options: [
      { label: { tr: "İsimleri ve yüzleri hatırlama", en: "Remembering names & faces" }, weights: { memory: 1.0, attention: 0.2 } },
      { label: { tr: "Dikkatin dağılmadan odaklanabilme", en: "Focusing without getting distracted" }, weights: { attention: 1.0, flexibility: 0.3 } },
      { label: { tr: "Hızlı ve isabetli kararlar verme", en: "Making quick decisions" }, weights: { speed: 1.0, "problem-solving": 0.3 } },
      { label: { tr: "Pratik zihinsel matematik ve mantık", en: "Mental math & logic" }, weights: { "problem-solving": 1.0, speed: 0.4 } },
      { label: { tr: "İşler arasında akıcı geçiş yapabilme", en: "Switching between tasks smoothly" }, weights: { flexibility: 1.0, attention: 0.4 } }
    ]
  },
  {
    question: {
      tr: "Günde beyin egzersizine ne kadar zaman ayırabilirsin?",
      en: "How much time can you commit daily?"
    },
    multi: false,
    options: [
      { label: { tr: "5 dakika", en: "5 minutes" }, weights: {} },
      { label: { tr: "10 dakika", en: "10 minutes" }, weights: {} },
      { label: { tr: "15+ dakika", en: "15+ minutes" }, weights: {} }
    ]
  },
  {
    question: {
      tr: "Günün hangi saatinde zihnini en zinde hissedersin?",
      en: "When do you feel most mentally sharp?"
    },
    multi: false,
    options: [
      { label: { tr: "Sabah (06:00 – 12:00)", en: "Morning (6 AM – 12 PM)" }, weights: {} },
      { label: { tr: "Öğleden Sonra (12:00 – 18:00)", en: "Afternoon (12 PM – 6 PM)" }, weights: {} },
      { label: { tr: "Akşam (18:00 – Gece)", en: "Evening (6 PM – midnight)" }, weights: {} }
    ]
  },
  {
    question: {
      tr: "Eşyalarını nereye koyduğunu sık sık unutur musun?",
      en: "Do you often forget where you put things?"
    },
    multi: false,
    options: [
      { label: { tr: "Nadiren — hafızam güçlüdür", en: "Rarely — my memory is solid" }, weights: { memory: 0 } },
      { label: { tr: "Bazen", en: "Sometimes" }, weights: { memory: 0.5 } },
      { label: { tr: "Sık sık — bu benim için bir sorun", en: "Often — this is a real issue" }, weights: { memory: 1.0 } }
    ]
  },
  {
    question: {
      tr: "Bir şeye odaklanırken dikkatin ne kadar kolay dağılır?",
      en: "How easily do you get distracted when concentrating?"
    },
    multi: false,
    options: [
      { label: { tr: "Kolayca odaklı kalırım", en: "I stay focused easily" }, weights: { attention: 0 } },
      { label: { tr: "Küçük uyaranlar dikkatimi çeker", en: "Moderate distractions pull me away" }, weights: { attention: 0.5 } },
      { label: { tr: "Odaklanmakta ve sürdürmekte zorlanırım", en: "I find it hard to stay on task" }, weights: { attention: 1.0 } }
    ]
  },
  {
    question: {
      tr: "Zihinsel işlem ve hesaplama hızını nasıl değerlendirirsin?",
      en: "How would you rate your mental math speed?"
    },
    multi: false,
    options: [
      { label: { tr: "Hızlı — sayılarla aram çok iyidir", en: "Fast — numbers come naturally" }, weights: { speed: 0 } },
      { label: { tr: "Ortalama — bazen biraz düşünmem gerekir", en: "Average — sometimes I need a moment" }, weights: { speed: 0.4 } },
      { label: { tr: "Yavaş — yazarak hesaplamayı tercih ederim", en: "Slow — I prefer to write things down" }, weights: { speed: 0.9 } }
    ]
  }
];

let obCurrentQ = 0;
let obAnswers = [];

function startOnboarding() {
  obCurrentQ = 0;
  obAnswers = new Array(OB_QUESTIONS.length).fill(null).map(() => []);
  showPage('onboarding-page');
  renderOnboardingQ();
}

function renderOnboardingQ() {
  const q = OB_QUESTIONS[obCurrentQ];
  const lang = currentLang === 'tr' ? 'tr' : 'en';

  // Progress dots
  const progressEl = document.getElementById('ob-progress');
  if (progressEl) {
    progressEl.innerHTML = OB_QUESTIONS.map((_, i) => {
      let cls = 'progress-dot';
      if (i < obCurrentQ) cls += ' done';
      else if (i === obCurrentQ) cls += ' active';
      return `<div class="${cls}"></div>`;
    }).join('');
  }

  const area = document.getElementById('ob-question-area');
  if (!area) return;

  const qNumText = lang === 'tr' ? `Soru ${obCurrentQ + 1} / ${OB_QUESTIONS.length}` : `Question ${obCurrentQ + 1} of ${OB_QUESTIONS.length}`;
  const qTitle = typeof q.question === 'object' ? (q.question[lang] || q.question.en) : q.question;

  area.innerHTML = `
    <div class="onboarding-q-num">${qNumText}</div>
    <div class="onboarding-q-text">${qTitle}</div>
    <div class="onboarding-options" id="ob-options">
      ${q.options.map((opt, i) => {
        const label = typeof opt.label === 'object' ? (opt.label[lang] || opt.label.en) : opt.label;
        return `
          <button class="onboarding-option ${obAnswers[obCurrentQ].includes(i) ? 'selected' : ''}"
            onclick="obToggleOption(${i})" data-idx="${i}">
            <div class="option-check">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            ${label}
          </button>
        `;
      }).join('')}
    </div>
  `;

  // Buttons
  const backBtn = document.getElementById('ob-back-btn');
  const nextBtn = document.getElementById('ob-next-btn');
  if (backBtn) {
    backBtn.textContent = lang === 'tr' ? '← Geri' : '← Back';
    backBtn.style.opacity = obCurrentQ === 0 ? '0' : '1';
  }
  if (nextBtn) {
    nextBtn.textContent = lang === 'tr' ? 'Devam Et →' : 'Continue →';
  }
}


function obToggleOption(idx) {
  const q = OB_QUESTIONS[obCurrentQ];
  if (q.multi) {
    const pos = obAnswers[obCurrentQ].indexOf(idx);
    if (pos === -1) obAnswers[obCurrentQ].push(idx);
    else obAnswers[obCurrentQ].splice(pos, 1);
  } else {
    obAnswers[obCurrentQ] = [idx];
  }
  renderOnboardingQ();
}

function obNext() {
  if (obAnswers[obCurrentQ].length === 0) {
    // Allow skipping
    obAnswers[obCurrentQ] = [];
  }
  if (obCurrentQ < OB_QUESTIONS.length - 1) {
    obCurrentQ++;
    renderOnboardingQ();
  } else {
    // Compute onboarding profile
    computeOnboardingProfile();
    showPage('fittest-screen');
  }
}

function obBack() {
  if (obCurrentQ > 0) {
    obCurrentQ--;
    renderOnboardingQ();
  }
}

function computeOnboardingProfile() {
  const weights = { memory: 0.5, attention: 0.5, speed: 0.5, flexibility: 0.5, "problem-solving": 0.5 };
  OB_QUESTIONS.forEach((q, qi) => {
    obAnswers[qi].forEach(oi => {
      const optWeights = q.options[oi].weights;
      Object.keys(optWeights).forEach(cat => {
        if (weights[cat] !== undefined) {
          weights[cat] = Math.min(1.0, weights[cat] + optWeights[cat] * 0.25);
        }
      });
    });
  });
  state.user.onboardingProfile = weights;
  saveState();
}

// ===================================================
// STATE PERSISTENCE
// ===================================================
function loadSavedState() {
  const saved = localStorage.getItem("lumo_v2_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(state.user, parsed);
    } catch(e) { /* ignore */ }
  }
}

function saveState() {
  localStorage.setItem("lumo_v2_state", JSON.stringify(state.user));
}

// ===================================================
// PAGE & TAB ROUTING
// ===================================================
function showPage(pageId) {
  // Clear any dangling game timers and DOM when navigating away
  if (pageId !== "game-screen") {
    state.isGameActive = false;
    state.isPaused = false;
    clearAllGameTimers();
    const area = document.getElementById("game-area");
    if (area) area.innerHTML = "";
    const exitDialog = document.getElementById("exit-dialog");
    if (exitDialog) exitDialog.style.display = "none";
  }

  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add("active");
    window.scrollTo(0, 0);
    target.scrollTop = 0;
  }

  if (pageId === "app") {
    renderDailyWorkout();
    renderPerformanceOverview();
    renderProfileBadge();
    renderWeeklyReport();
    updateHeaderBadges();
  }
}

function switchTab(tabId, btnElement) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".nav-item, .d-nav-item").forEach(n => n.classList.remove("active"));

  const tab = document.getElementById(`tab-${tabId}`);
  if (tab) tab.classList.add("active");

  document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(b => b.classList.add("active"));

  if (tabId === "home") {
    renderDailyWorkout();
    renderPerformanceOverview();
    renderProfileBadge();
    renderWeeklyReport();
  } else if (tabId === "games") {
    renderGamesGrid();
  } else if (tabId === "stats") {
    renderStatsChart();
  }
}

function handleLogin(e) {
  if (e) e.preventDefault();
  state.user.isLoggedIn = true;
  saveState();
  showPage("app");
  switchTab("home");
}

function logout() {
  state.user.isLoggedIn = false;
  showPage("landing-page");
}

function toggleUserMenu() { switchTab("profile"); }

// ===================================================
// INIT
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  loadSavedState();
  applyLanguageToDOM();
  renderDailyWorkout();
  renderGamesGrid();
  renderPerformanceOverview();
  renderProfileBadge();
  renderWeeklyReport();
  renderStatsChart();
  updateHeaderBadges();
});

function initGreeting() {
  const el = document.getElementById("greeting-text");
  if (!el) return;
  const h = new Date().getHours();
  el.textContent = h < 12 ? t('goodMorning') : h < 17 ? t('goodAfternoon') : t('goodEvening');
}


function updateHeaderBadges() {
  const el = document.getElementById("streak-count");
  if (el) el.textContent = state.user.streak;
}

// ===================================================
// HOME TAB
// ===================================================
function renderDailyWorkout() {
  const container = document.getElementById("daily-games");
  if (!container) return;

  // Determine workout order based on onboarding profile
  const profile = state.user.onboardingProfile;
  let ordered = GAMES.filter(g => g.playable);
  if (profile) {
    ordered = ordered.sort((a, b) => {
      const wa = profile[a.category] || 0;
      const wb = profile[b.category] || 0;
      return wb - wa;
    });
  }
  const workoutGames = ordered.slice(0, 4);

  const badge = document.getElementById('workout-count-badge');
  if (badge) badge.textContent = currentLang === 'tr' ? `${workoutGames.length} oyun` : `${workoutGames.length} games`;

  const catNames = {
    all: currentLang === 'tr' ? 'Tümü' : 'All',
    memory: currentLang === 'tr' ? 'Hafıza' : 'Memory',
    attention: currentLang === 'tr' ? 'Dikkat' : 'Attention',
    speed: currentLang === 'tr' ? 'İşlem Hızı' : 'Speed',
    flexibility: currentLang === 'tr' ? 'Esneklik' : 'Flexibility',
    'problem-solving': currentLang === 'tr' ? 'Problem Çözme' : 'Problem Solving'
  };

  container.innerHTML = workoutGames.map(game => `
    <div class="workout-game-item" onclick="launchGame('${game.id}')">
      <div class="workout-game-icon ${game.category}">${game.icon}</div>
      <div class="workout-game-info">
        <div class="workout-game-name">${game.name}</div>
        <div class="workout-game-cat">${catNames[game.category] || game.category} · ${Math.round(game.duration / 60)} ${currentLang === 'tr' ? 'dak' : 'min'}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(240,244,255,0.3)" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
    </div>
  `).join("");
}

function renderPerformanceOverview() {
  Object.keys(state.user.categoryScores).forEach(cat => {
    const score = state.user.categoryScores[cat];
    const card = document.querySelector(`.perf-card[data-category="${cat}"]`);
    if (!card) return;
    const fill = card.querySelector(".perf-fill");
    const scoreEl = card.querySelector(".perf-score");
    if (fill) fill.style.width = `${Math.min(100, Math.round((score / 1000) * 100))}%`;
    if (scoreEl) scoreEl.textContent = score;
  });
}

function startDailyWorkout() {
  state.isWorkoutMode = true;
  state.isFitTestMode = false;
  const profile = state.user.onboardingProfile;
  let ordered = GAMES.filter(g => g.playable);
  if (profile) {
    ordered = ordered.sort((a, b) => (profile[b.category] || 0) - (profile[a.category] || 0));
  }
  state.workoutQueue = ordered.slice(0, 4).map(g => g.id);
  state.currentWorkoutIndex = 0;
  launchGame(state.workoutQueue[0]);
}

// ===================================================
// GAMES TAB
// ===================================================
function renderGamesGrid(filter = "all") {
  const container = document.getElementById("games-grid");
  if (!container) return;
  const filtered = filter === "all" ? GAMES : GAMES.filter(g => g.category === filter);
  const catNames = {
    all: currentLang === 'tr' ? 'Tümü' : 'All',
    memory: currentLang === 'tr' ? 'Hafıza' : 'Memory',
    attention: currentLang === 'tr' ? 'Dikkat' : 'Attention',
    speed: currentLang === 'tr' ? 'İşlem Hızı' : 'Speed',
    flexibility: currentLang === 'tr' ? 'Esneklik' : 'Flexibility',
    'problem-solving': currentLang === 'tr' ? 'Problem Çözme' : 'Problem Solving'
  };
  container.innerHTML = filtered.map(game => `
    <div class="game-card ${game.category}"
      onclick="${game.playable ? `launchGame('${game.id}')` : `showLockedToast('${game.name}')`}">
      ${!game.playable ? '<div class="game-card-lock">🔒</div>' : ''}
      <div class="game-card-icon">${game.icon}</div>
      <div class="game-card-name">${game.name}</div>
      <div class="game-card-category">${catNames[game.category] || game.category.replace("-"," ")}</div>
    </div>
  `).join("");
}

function filterGames(cat, btn) {
  document.querySelectorAll(".cat-filter").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderGamesGrid(cat);
}

function showLockedToast(name) {
  // Simple in-page notification
  const tEl = document.createElement('div');
  tEl.style.cssText = `
    position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
    background:rgba(30,42,74,0.97);border:1px solid rgba(255,255,255,0.1);
    color:var(--text-primary);padding:12px 22px;border-radius:50px;
    font-size:14px;font-weight:600;z-index:9999;
    box-shadow:0 8px 24px rgba(0,0,0,0.4);
    animation:fadeUp 0.3s ease;
  `;
  tEl.textContent = `${name} ${t('premiumLocked')}`;
  document.body.appendChild(tEl);
  setTimeout(() => tEl.remove(), 3000);
}

// ===================================================
// FIT TEST FLOW
// ===================================================
function beginFitTest() {
  state.isFitTestMode = true;
  state.isWorkoutMode = false;
  state.workoutQueue = ["memory-matrix", "speed-match", "lost-in-migration"];
  state.currentWorkoutIndex = 0;
  // Immediate start without redundant instructions
  launchGame(state.workoutQueue[0], true);
}


function completeFitTest() {
  state.user.fitTestDone = true;
  state.user.isLoggedIn = true;
  saveState();
  showPage("app");
  switchTab("home");
  renderDailyWorkout();
  renderPerformanceOverview();
  updateHeaderBadges();
}

function showFitTestResults() {
  const scores = state.user.fitTestScores || state.user.categoryScores;
  const percentile = Math.min(99, Math.max(40, Math.round(
    Object.values(scores).reduce((a,b) => a+b, 0) / Object.values(scores).length / 10
  )));

  const el = document.getElementById('fit-percentile');
  if (el) animateNumber(el, 0, percentile, 1200);

  // Render category scores list
  const list = document.getElementById('fit-cat-scores');
  if (list) {
    const catColors = {
      memory: '#FF8C42', attention: '#10B981', speed: '#EF4444',
      flexibility: '#A78BFA', 'problem-solving': '#3B82F6'
    };
    const catGrads = {
      memory: 'linear-gradient(90deg,#FF8C42,#FF6B6B)',
      attention: 'linear-gradient(90deg,#10B981,#059669)',
      speed: 'linear-gradient(90deg,#EF4444,#FF6B6B)',
      flexibility: 'linear-gradient(90deg,#A78BFA,#7C3AED)',
      'problem-solving': 'linear-gradient(90deg,#3B82F6,#00F2FE)'
    };
    list.innerHTML = Object.keys(scores).map(cat => {
      const pct = Math.min(100, Math.round(scores[cat] / 10));
      return `
        <div class="cat-score-row">
          <div class="cat-score-dot" style="background:${catColors[cat]}"></div>
          <div class="cat-score-name">${cat.replace('-',' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
          <div class="cat-score-bar-wrap">
            <div class="cat-score-bar" style="width:${pct}%;background:${catGrads[cat]}"></div>
          </div>
          <div class="cat-score-val">${scores[cat]}</div>
        </div>
      `;
    }).join('');
  }

  // Draw radar chart
  drawRadarChart(scores);

  showPage('fittest-result-screen');
}

function drawRadarChart(scores) {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 130, cy = 130, R = 100;
  const cats = ['memory','attention','speed','flexibility','problem-solving'];
  const colors = ['#FF8C42','#10B981','#EF4444','#A78BFA','#3B82F6'];

  ctx.clearRect(0, 0, 260, 260);

  const angle = (i) => (i * 2 * Math.PI / cats.length) - Math.PI/2;

  // Grid rings
  [0.25, 0.5, 0.75, 1.0].forEach(r => {
    ctx.beginPath();
    cats.forEach((_, i) => {
      const x = cx + Math.cos(angle(i)) * R * r;
      const y = cy + Math.sin(angle(i)) * R * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Spokes
  cats.forEach((_, i) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle(i)) * R, cy + Math.sin(angle(i)) * R);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.stroke();
  });

  // Data polygon
  ctx.beginPath();
  cats.forEach((cat, i) => {
    const v = Math.min(1000, scores[cat] || 500) / 1000;
    const x = cx + Math.cos(angle(i)) * R * v;
    const y = cy + Math.sin(angle(i)) * R * v;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  grad.addColorStop(0, 'rgba(0,242,254,0.35)');
  grad.addColorStop(1, 'rgba(59,130,246,0.12)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,242,254,0.70)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dots & labels
  cats.forEach((cat, i) => {
    const v = Math.min(1000, scores[cat] || 500) / 1000;
    const x = cx + Math.cos(angle(i)) * R * v;
    const y = cy + Math.sin(angle(i)) * R * v;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = colors[i];
    ctx.fill();

    const lx = cx + Math.cos(angle(i)) * (R + 18);
    const ly = cy + Math.sin(angle(i)) * (R + 18);
    ctx.fillStyle = 'rgba(240,244,255,0.55)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cat.replace('-solving','').replace('-',' '), lx, ly);
  });
}

// ===================================================
// GAME CONTROLLER & CLEANUP MANAGEMENT
// ===================================================
class GameTimer {
  constructor(callback, delay) {
    this.callback = callback;
    this.remaining = delay;
    this.timerId = null;
    this.start = Date.now();
    this.resume();
  }

  pause() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
      this.remaining = Math.max(0, this.remaining - (Date.now() - this.start));
    }
  }

  resume() {
    if (this.timerId) return;
    this.start = Date.now();
    this.timerId = setTimeout(() => {
      activeGameTimers = activeGameTimers.filter(t => t !== this);
      if (state.isGameActive && !state.isPaused) {
        this.callback();
      }
    }, this.remaining);
  }

  clear() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

let activeGameTimers = [];

function setGameTimeout(callback, delay) {
  const gt = new GameTimer(callback, delay);
  activeGameTimers.push(gt);
  return gt;
}

function clearAllGameTimeouts() {
  activeGameTimers.forEach(t => t.clear());
  activeGameTimers = [];
}

function pauseAllGameTimeouts() {
  activeGameTimers.forEach(t => t.pause());
}

function resumeAllGameTimeouts() {
  activeGameTimers.forEach(t => t.resume());
}

let rdAnimFrames = [];
function cancelAllRdAnimFrames() {
  rdAnimFrames.forEach(id => cancelAnimationFrame(id));
  rdAnimFrames = [];
  if (typeof rdAnimFrame !== "undefined" && rdAnimFrame) {
    cancelAnimationFrame(rdAnimFrame);
    rdAnimFrame = null;
  }
}

function pauseGame() {
  if (!state.isGameActive) return;
  state.isPaused = true;
  pauseAllGameTimeouts();
}

function resumeGame() {
  if (!state.isGameActive) return;
  state.isPaused = false;
  resumeAllGameTimeouts();
}

// ===================================================
// EXIT CONFIRMATION & DIALOG CONTROLLER
// ===================================================
function requestExitGame() {
  if (!state.isGameActive) {
    if (state.isFitTestMode) {
      showPage("fittest-screen");
    } else {
      showPage("app");
      switchTab("games");
    }
    return;
  }
  pauseGame();
  const exitDialog = document.getElementById("exit-dialog");
  if (exitDialog) exitDialog.style.display = "flex";
}

function closeExitDialog(e) {
  if (e && e.target && e.target.id !== "exit-dialog" && e.currentTarget && e.target !== e.currentTarget) {
    return;
  }
  const exitDialog = document.getElementById("exit-dialog");
  if (exitDialog) exitDialog.style.display = "none";
  if (state.isGameActive) {
    resumeGame();
  }
}

function exitGameConfirmed() {
  const exitDialog = document.getElementById("exit-dialog");
  if (exitDialog) exitDialog.style.display = "none";
  clearAllGameTimers();
  state.isGameActive = false;
  state.isPaused = false;
  state.isFitTestMode = false;
  state.isWorkoutMode = false;
  showPage("app");
  switchTab("games");
}

// ===================================================
// CENTRALIZED GAME ORCHESTRATOR & LAUNCHER (P0 FIX)
// ===================================================
function launchGame(gameId, isFitTest = false) {
  const game = GAMES.find(g => g.id === gameId);
  if (!game) {
    console.error("Game not found:", gameId);
    return;
  }
  if (!game.playable) {
    showLockedToast(game.name);
    return;
  }

  // Set mode state
  if (isFitTest) {
    state.isFitTestMode = true;
    state.isWorkoutMode = false;
  }
  state.currentGame = game;

  // Reset metrics & timers
  clearAllGameTimers();
  state.score = 0;
  state.round = 0;
  state.correctCount = 0;
  state.totalCount = 0;
  state.comboStreak = 0;
  state.multiplier = 1;
  state.maxCombo = 0;
  state.reactionTimes = [];
  state.roundAccuracies = [];
  state.isGameActive = false;
  state.isPaused = false;

  // Navigate to game-screen
  showPage("game-screen");

  // Update Game Screen HUD
  const titleEl = document.getElementById("game-title");
  if (titleEl) titleEl.textContent = game.name;
  const scoreEl = document.getElementById("game-score-display");
  if (scoreEl) scoreEl.innerHTML = "0";
  const langLabel = document.getElementById("game-lang-label");
  if (langLabel) langLabel.textContent = currentLang.toUpperCase();
  const fill = document.getElementById("cog-load-fill");
  const label = document.getElementById("cog-load-label");
  if (fill) fill.style.width = "15%";
  if (label) {
    label.textContent = "LOW";
    label.style.color = "#10B981";
  }

  // Render high-impact pre-game screen
  renderPreGameScreen(game);
}

function renderPreGameScreen(game) {
  const area = document.getElementById("game-area");
  if (!area) return;

  const catNames = {
    memory: currentLang === 'tr' ? 'Hafıza' : 'Memory',
    attention: currentLang === 'tr' ? 'Dikkat' : 'Attention',
    speed: currentLang === 'tr' ? 'İşlem Hızı' : 'Speed',
    flexibility: currentLang === 'tr' ? 'Esneklik' : 'Flexibility',
    'problem-solving': currentLang === 'tr' ? 'Problem Çözme' : 'Problem Solving'
  };

  const gameGuides = {
    "memory-matrix": {
      stepsTr: [
        "Izgara üzerindeki mavi kareler birkaç saniye yanıp söner.",
        "Desen kaybolduktan sonra hafızandaki karelere dokun.",
        "Hata yapmadıkça kare sayısı ve ızgara boyutu artar."
      ],
      stepsEn: [
        "Highlighted blue tiles appear on the grid for a moment.",
        "Recall and tap all highlighted tiles from memory.",
        "Success increases the number of targets and grid size."
      ],
      keys: currentLang === 'tr' ? ["Fare / Tıkla", "Dokunmatik"] : ["Mouse / Click", "Touch"]
    },
    "speed-match": {
      stepsTr: [
        "Ekrana gelen sembolü dikkatle incele.",
        "Bu sembol, bir önceki sembolle aynı mı?",
        "Hızla EVET veya HAYIR tuşuna bas (hız puan çarpanını artırır)."
      ],
      stepsEn: [
        "Observe each presented symbol closely.",
        "Does the current symbol match the one shown previously?",
        "Answer YES or NO as quickly as possible to build your combo."
      ],
      keys: ["← HAYIR / NO", "EVET / YES →"]
    },
    "lost-in-migration": {
      stepsTr: [
        "Ekranda uçan bir göçmen kuş sürüsü belirir.",
        "Etraftaki çeldirici kuşları tamamen görmezden gel.",
        "Yalnızca ortada parlayan lider kuşun uçtuğu yöne bas!"
      ],
      stepsEn: [
        "A flock of migrating birds appears on the screen.",
        "Ignore the outer distractor birds entirely.",
        "Press the arrow key matching the center glowing bird's heading!"
      ],
      keys: ["↑", "↓", "←", "→"]
    },
    "raindrops": {
      stepsTr: [
        "Yukarıdan matematik denklemleri içeren damlalar düşer.",
        "Damla su seviyesine inmeden önce işlemi zihninde çöz.",
        "Doğru cevabı tuşlayarak damlayı patlat."
      ],
      stepsEn: [
        "Raindrops containing math equations descend continuously.",
        "Calculate the arithmetic problem before it touches the ground.",
        "Enter the correct value to pop the raindrop."
      ],
      keys: ["0 - 9", "Enter", "Tuş Takımı"]
    },
    "color-match": {
      stepsTr: [
        "Üstte bir renk adı (kelime), altta ise renkli bir yazı belirir.",
        "Üstteki kelimenin anlamı, alttaki yazının mürekkep rengiyle eşleşiyor mu?",
        "Okuma dürtünü bastır ve görsel renge odaklan."
      ],
      stepsEn: [
        "A color word appears at top, and colored text below.",
        "Does top word name match bottom ink color?",
        "Inhibit your urge to read and judge pure ink color."
      ],
      keys: ["← HAYIR / NO", "EVET / YES →"]
    },
    "chalkboard-challenge": {
      stepsTr: [
        "Kara tahtada yan yana iki matematiksel ifade gösterilir.",
        "İki tarafı hızla zihninde hesapla.",
        "Hangi tarafın değeri daha büyükse o yönü seç!"
      ],
      stepsEn: [
        "Two math expressions appear side-by-side on the chalkboard.",
        "Mentally evaluate both sides quickly under time pressure.",
        "Select which side is greater or if they are equal."
      ],
      keys: ["← SOL / LEFT", "SAĞ / RIGHT →"]
    }
  };

  const guide = gameGuides[game.id] || {
    stepsTr: [typeof game.description === 'object' ? (game.description[currentLang] || game.description.tr) : game.description],
    stepsEn: [typeof game.description === 'object' ? (game.description.en || game.description.tr) : game.description],
    keys: ["Klavye / Mouse"]
  };

  const steps = currentLang === 'tr' ? guide.stepsTr : guide.stepsEn;
  const modeText = state.isFitTestMode
    ? (currentLang === 'tr' ? `⚡ Bilişsel Seviye Testi · Aşama ${state.currentWorkoutIndex + 1} / ${state.workoutQueue.length || 3}` : `⚡ Cognitive Fit Test · Game ${state.currentWorkoutIndex + 1} / ${state.workoutQueue.length || 3}`)
    : (catNames[game.category] || game.category.toUpperCase());

  area.innerHTML = `
    <div class="game-stage-card pregame-card">
      <div class="pregame-mode-badge ${state.isFitTestMode ? 'fit-badge' : ''}">${modeText}</div>
      <div class="pregame-icon-glow">${game.icon}</div>
      <h2 class="pregame-title">${game.name}</h2>
      <div class="pregame-cat-tag">${catNames[game.category] || game.category}</div>

      <div class="pregame-instruction-box">
        ${steps.map((st, i) => `
          <div class="pregame-step">
            <span class="pregame-step-num">${i + 1}</span>
            <span class="pregame-step-text">${st}</span>
          </div>
        `).join("")}
      </div>

      <div class="pregame-controls-card">
        <span class="pregame-controls-label">${currentLang === 'tr' ? 'Kontroller:' : 'Controls:'}</span>
        <div class="pregame-keys">
          ${guide.keys.map(k => `<span class="k-badge">${k}</span>`).join("")}
        </div>
      </div>

      <button class="btn-primary btn-large btn-full btn-glow" id="btn-pregame-start" onclick="startCountdownAndLaunch()">
        ${currentLang === 'tr' ? 'BAŞLA' : 'START'}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
    </div>
  `;

  // Bind Space or Enter to immediately start
  setGameKeyHandler((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      startCountdownAndLaunch();
    }
  });
}

function startCountdownAndLaunch() {
  const area = document.getElementById("game-area");
  if (!area || !state.currentGame) return;

  setGameKeyHandler(null);
  let count = 3;
  playSound("tick");

  area.innerHTML = `
    <div class="game-stage-card pregame-card" style="min-height:360px;display:flex;align-items:center;justify-content:center;">
      <div class="countdown-stage">
        <div class="countdown-ring">
          <span class="countdown-num" id="countdown-val">${count}</span>
        </div>
        <div class="countdown-label" id="countdown-sub">${currentLang === 'tr' ? 'Odaklan...' : 'Focus...'}</div>
      </div>
    </div>
  `;

  const timer = setInterval(() => {
    count--;
    const numEl = document.getElementById("countdown-val");
    const subEl = document.getElementById("countdown-sub");
    if (!numEl) {
      clearInterval(timer);
      return;
    }

    if (count > 0) {
      playSound("tick");
      numEl.textContent = count;
      numEl.style.animation = 'none';
      void numEl.offsetWidth;
      numEl.style.animation = 'countPulse 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      if (subEl) subEl.textContent = count === 2 ? (currentLang === 'tr' ? 'Hazırlan...' : 'Get Ready...') : (currentLang === 'tr' ? 'Başlıyor...' : 'Starting...');
    } else if (count === 0) {
      playSound("go");
      numEl.textContent = currentLang === 'tr' ? 'BAŞLA!' : 'GO!';
      numEl.classList.add('go');
      if (subEl) subEl.textContent = state.currentGame.name;
    } else {
      clearInterval(timer);
      startActualGame(state.currentGame.id);
    }
  }, 750);
}

function startActualGame(gameId) {
  state.isGameActive = true;
  state.isPaused = false;
  state.startTime = Date.now();

  switch(gameId) {
    case "memory-matrix":
      initMemoryMatrix();
      break;
    case "speed-match":
      initSpeedMatch();
      break;
    case "lost-in-migration":
      initLostInMigration();
      break;
    case "raindrops":
      initRaindrops();
      break;
    case "color-match":
      initColorMatch();
      break;
    case "chalkboard-challenge":
      initChalkboardChallenge();
      break;
    default:
      console.warn("Unimplemented game id:", gameId);
      initMemoryMatrix();
  }
}

let activeKeyHandler = null;

function setGameKeyHandler(handler) {
  if (activeKeyHandler) {
    window.removeEventListener("keydown", activeKeyHandler);
    activeKeyHandler = null;
  }
  if (typeof handler === "function") {
    activeKeyHandler = (e) => {
      if (e.key === "Escape") {
        const exitDialog = document.getElementById('exit-dialog');
        if (exitDialog && exitDialog.style.display === 'flex') {
          closeExitDialog();
        } else {
          requestExitGame();
        }
        return;
      }
      if (state.isPaused || !state.isGameActive) return;
      handler(e);
    };
    window.addEventListener("keydown", activeKeyHandler);
  }
}

function clearAllGameTimers() {
  if (state.gameTimer) {
    clearInterval(state.gameTimer);
    state.gameTimer = null;
  }
  clearAllGameTimeouts();
  cancelAllRdAnimFrames();
  if (typeof clearMemoryMatrixTimers === "function") {
    clearMemoryMatrixTimers();
  }
  if (typeof smAutoTimer !== "undefined" && smAutoTimer) {
    clearTimeout(smAutoTimer);
    smAutoTimer = null;
  }
  if (typeof limAutoTimer !== "undefined" && limAutoTimer) {
    clearTimeout(limAutoTimer);
    limAutoTimer = null;
  }
  setGameKeyHandler(null);
}

function updateScore(delta, isCorrect = true) {
  if (state.isPaused || !state.isGameActive) return;
  if (isCorrect) {
    state.comboStreak++;
    if (state.comboStreak > state.maxCombo) state.maxCombo = state.comboStreak;
    const prev = state.multiplier;
    state.multiplier = Math.min(4, Math.floor(state.comboStreak / 3) + 1);
    playSound(state.multiplier > prev ? "combo" : "correct");
    state.score = Math.max(0, state.score + delta * state.multiplier);
  } else {
    state.comboStreak = 0;
    state.multiplier = 1;
    playSound("wrong");
    state.score = Math.max(0, state.score + delta);
  }
  const el = document.getElementById("game-score-display");
  if (el) {
    el.innerHTML = state.multiplier > 1
      ? `${state.score} <span style="color:#F59E0B;font-size:13px;">×${state.multiplier}</span>`
      : `${state.score}`;
  }
}

// ===================================================
// GAME 1: MEMORY MATRIX (ADAPTIVE & CRASH-PROOF)
// Adaptive Formula (rehber §8.4):
//   100% correct (0 error) → K += 1
//   1 error               → K stable (round continues to completion)
//   2+ errors             → K -= 1 (min 3, targets revealed, round restarts)
//   grid sizing: K<=3: 3x3, K<=5: 4x4, K<=7: 5x5, K>=8: 6x6
//   display time: max(700, 1300 - round*20)
// ===================================================
let mmGridSize = 3, mmK = 3, mmErrorsInRound = 0;
let mmRoundNum = 0, mmTargetTiles = [], mmFoundTargets = new Set(), mmWrongTiles = new Set();
let mmCanClick = false;
let mmRoundTimer = null;
let mmDuration = 60;

function clearMemoryMatrixTimers() {
  if (mmRoundTimer) {
    if (typeof mmRoundTimer.clear === 'function') {
      mmRoundTimer.clear();
    } else {
      clearTimeout(mmRoundTimer);
    }
    mmRoundTimer = null;
  }
}

function renderMemoryTracker() {
  const trackerEl = document.getElementById("mm-tracker");
  if (!trackerEl) return;
  trackerEl.innerHTML = "";
  for (let i = 0; i < mmTargetTiles.length; i++) {
    const pip = document.createElement("div");
    pip.className = "target-pip" + (i < mmFoundTargets.size ? " found" : "");
    trackerEl.appendChild(pip);
  }
}

function initMemoryMatrix() {
  clearMemoryMatrixTimers();
  mmGridSize = 3;
  mmK = 3;
  mmRoundNum = 0;
  mmErrorsInRound = 0;
  mmFoundTargets.clear();
  mmWrongTiles.clear();
  state.score = 0;
  state.correctCount = 0;
  state.totalCount = 0;
  state.comboStreak = 0;
  state.multiplier = 1;
  state.roundAccuracies = [];
  mmDuration = state.currentGame ? state.currentGame.duration : 60;

  let timeLeft = mmDuration;
  const area = document.getElementById("game-area");
  if (!area) return;
  area.innerHTML = `
    <div class="game-stage-card">
      <div class="game-timer-bar"><div class="game-timer-fill" id="timer-fill" style="width:100%"></div></div>
      <div class="game-round-indicator" id="mm-status">${t('mmMemorize')}</div>
      <div class="memory-targets-tracker" id="mm-tracker"></div>
      <div class="memory-grid-wrapper">
        <div class="memory-grid" id="mm-grid"></div>
      </div>
      <div style="font-size:13px;color:var(--text-muted);margin-top:12px;font-weight:500;" id="mm-k-indicator">${t('mmLevel')} K: ${mmK} · ${t('mmRound')} 1</div>
    </div>
  `;

  startMemoryMatrixRound();

  state.gameTimer = setInterval(() => {
    if (state.isPaused || !state.isGameActive) return;
    timeLeft -= 0.1;
    const fill = document.getElementById("timer-fill");
    if (fill) {
      fill.style.width = `${Math.max(0, (timeLeft / mmDuration) * 100)}%`;
      if (timeLeft < 15) fill.classList.add('warning');
    }
    if (timeLeft <= 0) {
      clearAllGameTimers();
      finishGame();
    }
  }, 100);
}

function startMemoryMatrixRound() {
  clearMemoryMatrixTimers();
  const gridEl = document.getElementById("mm-grid");
  const statusEl = document.getElementById("mm-status");
  const kEl = document.getElementById("mm-k-indicator");
  if (!gridEl) return;

  mmRoundNum++;
  mmErrorsInRound = 0;
  mmFoundTargets.clear();
  mmWrongTiles.clear();
  mmCanClick = false;

  // Grid size progression according to Lumosity spec
  if (mmK <= 3) {
    mmGridSize = 3;
  } else if (mmK <= 5) {
    mmGridSize = 4;
  } else if (mmK <= 7) {
    mmGridSize = 5;
  } else {
    mmGridSize = 6;
  }

  const totalCells = mmGridSize * mmGridSize;
  const tileCount = Math.min(totalCells - 2, mmK);

  // Set grid template columns and rows symmetrically
  gridEl.style.gridTemplateColumns = `repeat(${mmGridSize}, 1fr)`;
  gridEl.style.gridTemplateRows = `repeat(${mmGridSize}, 1fr)`;
  gridEl.className = mmGridSize >= 5 ? "memory-grid grid-dense" : "memory-grid";
  gridEl.innerHTML = "";

  // Generate unique random target tiles
  mmTargetTiles = [];
  const pool = Array.from({ length: totalCells }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  mmTargetTiles = pool.slice(0, tileCount);

  if (statusEl) statusEl.textContent = `${t('mmMemorize')} (${tileCount})`;
  if (kEl) kEl.textContent = `${t('mmLevel')} K: ${mmK} · ${t('mmRound')} ${mmRoundNum}`;

  renderMemoryTracker();

  // Create clean cells without hardcoded inline dimensions
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "memory-cell";
    cell.dataset.index = String(i);
    if (mmTargetTiles.includes(i)) {
      cell.classList.add("highlighted");
    }
    gridEl.appendChild(cell);
  }

  // Display time: starts at 1300ms, gently scales down with rounds, minimum 700ms
  const displayTime = Math.max(700, 1300 - mmRoundNum * 20);
  mmRoundTimer = setGameTimeout(() => {
    const currentGrid = document.getElementById("mm-grid");
    if (!currentGrid) return;

    currentGrid.querySelectorAll(".memory-cell").forEach(cell => {
      cell.classList.remove("highlighted");
      const idx = parseInt(cell.dataset.index, 10);
      cell.onclick = () => handleMemoryCellClick(idx, cell);
    });

    mmCanClick = true;
    if (statusEl) statusEl.textContent = `${t('mmTap')} (${tileCount})`;
  }, displayTime);
}

function handleMemoryCellClick(index, cellEl) {
  // If not clickable, paused, inactive, or tile already clicked, safely ignore
  if (!mmCanClick || state.isPaused || !state.isGameActive || mmFoundTargets.has(index) || mmWrongTiles.has(index)) return;

  state.totalCount++;

  if (mmTargetTiles.includes(index)) {
    // CORRECT TILE
    mmFoundTargets.add(index);
    state.correctCount++;
    cellEl.classList.add("correct");
    updateScore(120 + mmK * 15, true);
    renderMemoryTracker();

    if (mmFoundTargets.size === mmTargetTiles.length) {
      // Round successfully finished!
      mmCanClick = false;
      const statusEl = document.getElementById("mm-status");

      if (mmErrorsInRound === 0) {
        mmK++;
        state.roundAccuracies.push(100);
        if (statusEl) statusEl.innerHTML = `<span style="color:#10B981">✓ ${t('mmCorrect')} (+1 ${t('mmLevel')})</span>`;
      } else {
        state.roundAccuracies.push(75);
        if (statusEl) statusEl.innerHTML = `<span style="color:#00F2FE">✓ ${t('mmCompleted')}</span>`;
      }

      clearMemoryMatrixTimers();
      mmRoundTimer = setGameTimeout(() => {
        startMemoryMatrixRound();
      }, 550);
    }
  } else {
    // WRONG TILE
    mmWrongTiles.add(index);
    mmErrorsInRound++;
    cellEl.classList.add("wrong");
    updateScore(-40, false);
    shakeStage();

    const statusEl = document.getElementById("mm-status");

    if (mmErrorsInRound === 1) {
      // 1 error allowed - round continues, user can keep finding targets
      if (statusEl) statusEl.innerHTML = `<span style="color:#F59E0B">⚠️ ${t('mmMistake')} (1/2)</span>`;
    } else {
      // 2 or more errors - round failed
      mmCanClick = false;
      state.roundAccuracies.push(30);
      mmK = Math.max(3, mmK - 1);

      if (statusEl) statusEl.innerHTML = `<span style="color:#EF4444">✕ ${t('mmRoundOver')}</span>`;

      // Reveal remaining target tiles so the user learns
      mmTargetTiles.forEach(idx => {
        if (!mmFoundTargets.has(idx)) {
          const c = document.querySelector(`.memory-cell[data-index="${idx}"]`);
          if (c) c.classList.add("revealed");
        }
      });

      clearMemoryMatrixTimers();
      mmRoundTimer = setGameTimeout(() => {
        startMemoryMatrixRound();
      }, 1100);
    }
  }
}

// ===================================================
// GAME 2: SPEED MATCH — DUAL ATTRIBUTE N-BACK OVERDRIVE
// Inspired by Lumosity Speed Match Overdrive:
//   - Tracks shape + color as independent dimensions
//   - Each trial queries ONE dimension (color or shape)
//   - 1st symbol is purely for memorization (no answer asked)
//   - Subsequent symbols query matching with previous (N=1, then N=2)
//   - NO AUTO-FAIL: The stimulus waits for user input
//   - Scoring rewards fast response times (ms)
//   - Key listeners strictly bound via setGameKeyHandler
// ===================================================
const SM_SHAPE_PATHS = [
  // circle
  (c) => { c.beginPath(); c.arc(70,70,48,0,Math.PI*2); c.fill(); },
  // triangle
  (c) => { c.beginPath(); c.moveTo(70,22); c.lineTo(120,118); c.lineTo(20,118); c.closePath(); c.fill(); },
  // star (5-point)
  (c) => {
    c.beginPath();
    for (let i=0; i<5; i++) {
      const outer = {x: 70 + 50*Math.cos((i*72-90)*Math.PI/180), y: 70 + 50*Math.sin((i*72-90)*Math.PI/180)};
      const inner = {x: 70 + 22*Math.cos(((i*72+36)-90)*Math.PI/180), y: 70 + 22*Math.sin(((i*72+36)-90)*Math.PI/180)};
      i===0 ? c.moveTo(outer.x,outer.y) : c.lineTo(outer.x,outer.y);
      c.lineTo(inner.x,inner.y);
    }
    c.closePath(); c.fill();
  },
  // diamond
  (c) => { c.beginPath(); c.moveTo(70,18); c.lineTo(118,70); c.lineTo(70,122); c.lineTo(22,70); c.closePath(); c.fill(); },
  // hexagon
  (c) => {
    c.beginPath();
    for (let i=0; i<6; i++) {
      const x = 70 + 52*Math.cos((i*60-30)*Math.PI/180);
      const y = 70 + 52*Math.sin((i*60-30)*Math.PI/180);
      i===0 ? c.moveTo(x,y) : c.lineTo(x,y);
    }
    c.closePath(); c.fill();
  },
  // square (rounded)
  (c) => { c.beginPath(); c.roundRect(20,20,100,100,14); c.fill(); }
];
const SM_COLORS = ['#EF4444','#3B82F6','#10B981','#F59E0B','#A78BFA','#FF8C42'];

let smHistory = [];        // [{shapeIdx, colorIdx}, ...]
let smNBack = 1;
let smQueryType = 'color'; // 'color' | 'shape'
let smCorrectStreak = 0;
let smAnswerPending = false;
let smDuration = 60;
let smAccuracyHistory = [];

function initSpeedMatch() {
  clearAllGameTimers();

  state.score = 0; state.correctCount = 0; state.totalCount = 0;
  smHistory = []; smNBack = 1; smCorrectStreak = 0; smAnswerPending = false;
  smAccuracyHistory = [];
  smDuration = 60; // 60s intense Lumosity workout round
  let timeLeft = smDuration;

  const area = document.getElementById("game-area");
  area.innerHTML = `
    <div class="game-stage-card">
      <div class="game-timer-bar"><div class="game-timer-fill" id="timer-fill" style="width:100%"></div></div>
      <div style="text-align:center;">
        <div class="sm-nback-badge" id="sm-nback-badge">N=1 · 1-BACK</div>
        <div class="sm-query-label" id="sm-query-label">
          🧠 <strong>Memorize the first symbol...</strong>
        </div>
      </div>
      <div class="sm-dual-stage">
        <div class="sm-stimulus-card query-color" id="sm-card">
          <canvas id="sm-canvas" width="140" height="140"></canvas>
        </div>
        <div class="sm-attr-labels">
          <div class="sm-attr-chip active-color" id="chip-color">🎨 COLOR</div>
          <div class="sm-attr-chip" id="chip-shape">⬡ SHAPE</div>
        </div>
      </div>
      <div class="speed-match-streak" id="sm-streak"></div>
      <div class="speed-buttons">
        <button class="speed-btn no" id="sm-btn-no" onclick="handleSpeedChoice(false)">✕ NO</button>
        <button class="speed-btn yes" id="sm-btn-yes" onclick="handleSpeedChoice(true)">✓ YES</button>
      </div>
      <div class="speed-feedback" id="speed-feedback"></div>
      <p style="font-size:12px;color:var(--text-muted);margin-top:10px;">Keyboard: ← [NO] &nbsp;·&nbsp; [YES] →</p>
    </div>
  `;

  // Bind single clean keydown listener
  setGameKeyHandler((e) => {
    if (state.currentGame?.id !== "speed-match") return;
    if (e.key === "ArrowLeft")  handleSpeedChoice(false);
    if (e.key === "ArrowRight") handleSpeedChoice(true);
  });

  // Start initial stimulus
  nextSpeedRound(true);

  state.gameTimer = setInterval(() => {
    if (state.isPaused || !state.isGameActive) return;
    timeLeft -= 0.1;
    const fill = document.getElementById("timer-fill");
    if (fill) {
      fill.style.width = `${Math.max(0, (timeLeft / smDuration) * 100)}%`;
      if (timeLeft < 15) fill.classList.add('warning');
    }
    if (timeLeft <= 0) {
      clearAllGameTimers();
      finishGame();
    }
  }, 100);
}

function nextSpeedRound(isInitial = false) {
  const canvas = document.getElementById('sm-canvas');
  if (!canvas) return;

  const refIdx = smHistory.length - smNBack;
  let shapeIdx, colorIdx;

  // Controlled match rate (~40% match probability)
  if (refIdx >= 0 && Math.random() < 0.40) {
    shapeIdx = smHistory[refIdx].shapeIdx;
  } else {
    do { shapeIdx = Math.floor(Math.random() * SM_SHAPE_PATHS.length); }
    while (refIdx >= 0 && smHistory.length > 0 && shapeIdx === smHistory[refIdx]?.shapeIdx && SM_SHAPE_PATHS.length > 1);
  }

  if (refIdx >= 0 && Math.random() < 0.40) {
    colorIdx = smHistory[refIdx].colorIdx;
  } else {
    do { colorIdx = Math.floor(Math.random() * SM_COLORS.length); }
    while (refIdx >= 0 && smHistory.length > 0 && colorIdx === smHistory[refIdx]?.colorIdx && SM_COLORS.length > 1);
  }

  smHistory.push({ shapeIdx, colorIdx });

  // Pick attribute to test (50% color, 50% shape)
  smQueryType = Math.random() < 0.5 ? 'color' : 'shape';

  // Draw current stimulus
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 140, 140);
  ctx.fillStyle = SM_COLORS[colorIdx];
  SM_SHAPE_PATHS[shapeIdx](ctx);

  const card = document.getElementById('sm-card');
  const chipColor = document.getElementById('chip-color');
  const chipShape = document.getElementById('chip-shape');
  const queryLabel = document.getElementById('sm-query-label');
  const badge = document.getElementById('sm-nback-badge');
  const btnNo = document.getElementById('sm-btn-no');
  const btnYes = document.getElementById('sm-btn-yes');

  if (card) {
    card.classList.remove('query-color','query-shape','pop-anim');
    void card.offsetWidth;
    card.classList.add(smQueryType === 'color' ? 'query-color' : 'query-shape', 'pop-anim');
  }
  if (chipColor) chipColor.className = `sm-attr-chip${smQueryType === 'color' ? ' active-color' : ''}`;
  if (chipShape) chipShape.className = `sm-attr-chip${smQueryType === 'shape' ? ' active-shape' : ''}`;

  if (badge) {
    badge.textContent = `N=${smNBack} · ${smNBack === 1 ? '1-BACK' : '2-BACK CHALLENGE'}`;
    badge.className = `sm-nback-badge${smNBack === 2 ? ' level2' : ''}`;
  }

  if (isInitial || smHistory.length <= smNBack) {
    // 1st item: user cannot answer yet
    smAnswerPending = false;
    if (queryLabel) queryLabel.innerHTML = t('memorizeFirst');
    if (btnNo) btnNo.disabled = true;
    if (btnYes) btnYes.disabled = true;

    setGameTimeout(() => {
      if (state.currentGame?.id === "speed-match" && state.isGameActive && !state.isPaused) {
        if (btnNo) btnNo.disabled = false;
        if (btnYes) btnYes.disabled = false;
        nextSpeedRound(false);
      }
    }, 900);
    return;
  }

  // Active round: prompt user
  smAnswerPending = true;
  if (btnNo) btnNo.disabled = false;
  if (btnYes) btnYes.disabled = false;

  const dimText = smQueryType === 'color' ? (currentLang==='tr'?'RENK':'COLOR') : (currentLang==='tr'?'ŞEKİL':'SHAPE');
  const stepText = smNBack === 1 ? (currentLang==='tr'?'1 önceki sembolle':'previous symbol') : (currentLang==='tr'?'2 önceki sembolle':'2 symbols ago');
  if (queryLabel) {
    queryLabel.innerHTML = currentLang === 'tr'
      ? `Bu <span class="query-dim">${dimText}</span>, <strong>${stepText}</strong> AYNI mı?`
      : `Does the <span class="query-dim">${dimText}</span> match the <strong>${stepText}?</strong>`;
  }

  state.startTime = Date.now();
}

function handleSpeedChoice(userSaysYes) {
  if (!smAnswerPending || state.isPaused || !state.isGameActive || smHistory.length <= smNBack) return;
  smAnswerPending = false;

  const rt = Date.now() - state.startTime;
  state.reactionTimes.push(rt);
  updateCogLoadMeter();

  const current   = smHistory[smHistory.length - 1];
  const reference = smHistory[smHistory.length - 1 - smNBack];
  const isMatch = smQueryType === 'color'
    ? current.colorIdx === reference.colorIdx
    : current.shapeIdx === reference.shapeIdx;

  const fb = document.getElementById("speed-feedback");
  const streakEl = document.getElementById("sm-streak");
  state.totalCount++;

  if (userSaysYes === isMatch) {
    // Dynamic score based on reaction time
    const speedBonus = Math.max(50, Math.round(350 - rt * 0.25));
    updateScore(speedBonus, true);
    state.correctCount++;
    smCorrectStreak++;
    smAccuracyHistory.push(1);
    state.roundAccuracies.push(1);

    if (fb) { fb.textContent = `${t('correctText')} — ${rt}ms (+${speedBonus * state.multiplier})`; fb.style.color = "var(--accent-green)"; }
    if (streakEl) streakEl.textContent = smCorrectStreak > 2 ? `🔥 ${smCorrectStreak} ${t('streakWord')}` : '';

    // Adaptive N-Back upgrade (after 10 trials at >88% accuracy)
    if (smNBack === 1 && smAccuracyHistory.length >= 10) {
      const recent10 = smAccuracyHistory.slice(-10);
      const acc = recent10.reduce((a,b)=>a+b,0) / 10;
      if (acc >= 0.90) {
        smNBack = 2;
        showNBackLevelUpToast();
      }
    }
  } else {
    updateScore(-60, false);
    smCorrectStreak = 0;
    smAccuracyHistory.push(0);
    state.roundAccuracies.push(0);

    const matchNotice = isMatch ? t('matchedNotice') : t('differedNotice');
    if (fb) {
      fb.textContent = `${t('wrongText')} · ${t('correctAnswerWas')} ${matchNotice}`;
      fb.style.color = "var(--accent-coral)";
    }
    if (streakEl) streakEl.textContent = '';
    shakeStage();

    if (smNBack === 2 && smAccuracyHistory.length >= 8) {
      const recent8 = smAccuracyHistory.slice(-8);
      const acc = recent8.reduce((a,b)=>a+b,0) / 8;
      if (acc < 0.50) smNBack = 1;
    }
  }

  // Smooth short delay before next symbol
  setGameTimeout(() => {
    if (state.currentGame?.id === "speed-match" && state.isGameActive && !state.isPaused) {
      nextSpeedRound(false);
    }
  }, 220);
}


function showNBackLevelUpToast() {
  const toast = document.createElement('div');
  toast.className = 'sm-level-up-toast';
  toast.textContent = t('nbackLevelUp');
  document.body.appendChild(toast);
  playSound('combo');
  setTimeout(() => toast.remove(), 2600);
}


// ===================================================
// GAME 3: LOST IN MIGRATION (ADAPTIVE FLANKER)
// Classic Eriksen Flanker Task:
//   - User must indicate direction of glowing center bird
//   - Flankers match center (congruent) or differ (incongruent)
//   - NO AUTO-FAIL: Stimulus waits for user choice
//   - Clean event listener binding via setGameKeyHandler
// ===================================================
const DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT"];
const DIR_ARROWS = { UP: "↑", DOWN: "↓", LEFT: "←", RIGHT: "→" };
let limTargetDir = "UP", limIsCongruent = true;
let limCongruentRt = [], limIncongruentRt = [];
let limCorrectStreak = 0, limCongruentRatio = 0.60;
let limAnswerPending = false;
let limDuration = 60;

function renderLimBird(dir, isCenter = false) {
  // Pure cardinal rotations: UP:0°, RIGHT:90°, DOWN:180°, LEFT:270°
  const angles = { UP: 0, RIGHT: 90, DOWN: 180, LEFT: 270 };
  const deg = angles[dir] ?? 0;
  const wrapClass = isCenter ? "bird-center-wrap" : "bird-flanker-wrap";
  const fillColor = isCenter ? "#00F2FE" : "rgba(240, 244, 255, 0.65)";
  const strokeColor = isCenter ? "#FFFFFF" : "rgba(255, 255, 255, 0.25)";
  const size = isCenter ? 38 : 28;

  return `
    <div class="${wrapClass}">
      <svg width="${size}" height="${size}" viewBox="0 0 36 36" style="transform:rotate(${deg}deg);transition:transform 0.15s ease;" fill="none">
        <!-- Aerodynamic Bird Silhouette pointing UP -->
        <path d="M18 3 L20 8 L33 16 L22 20 L21 32 L18 27 L15 32 L14 20 L3 16 L16 8 Z"
              fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.2" stroke-linejoin="round"/>
        <circle cx="18" cy="6" r="1.5" fill="${isCenter ? '#FFFFFF' : '#1A2340'}"/>
      </svg>
    </div>
  `;
}

function initLostInMigration() {
  clearAllGameTimers();

  state.score = 0; state.correctCount = 0; state.totalCount = 0;
  limCongruentRt = []; limIncongruentRt = [];
  limCorrectStreak = 0; limCongruentRatio = 0.60; limAnswerPending = false;
  limDuration = 60;
  let timeLeft = limDuration;

  const area = document.getElementById("game-area");
  area.innerHTML = `
    <div class="game-stage-card">
      <div class="game-timer-bar"><div class="game-timer-fill" id="timer-fill" style="width:100%"></div></div>
      <div class="game-round-indicator">${t('limInstruction')}</div>
      <div class="flock-display" id="flock-display"></div>
      <div class="lim-dir-grid">
        <div></div>
        <button class="lim-btn lim-btn-up" onclick="handleLimChoice('UP')" title="UP / YUKARI">
          <span class="lim-arrow">↑</span>
          <span class="lim-label">${t('dirUp')}</span>
        </button>
        <div></div>
        <button class="lim-btn lim-btn-left" onclick="handleLimChoice('LEFT')" title="LEFT / SOL">
          <span class="lim-arrow">←</span>
          <span class="lim-label">${t('dirLeft')}</span>
        </button>
        <button class="lim-btn lim-btn-down" onclick="handleLimChoice('DOWN')" title="DOWN / AŞAĞI">
          <span class="lim-arrow">↓</span>
          <span class="lim-label">${t('dirDown')}</span>
        </button>
        <button class="lim-btn lim-btn-right" onclick="handleLimChoice('RIGHT')" title="RIGHT / SAĞ">
          <span class="lim-arrow">→</span>
          <span class="lim-label">${t('dirRight')}</span>
        </button>
      </div>
      <div class="speed-feedback" id="lim-feedback"></div>
      <p style="font-size:12px;color:var(--text-muted);margin-top:10px;">${t('limArrowHelp')}</p>
    </div>
  `;

  // Bind key listener cleanly
  setGameKeyHandler((e) => {
    if (state.currentGame?.id !== "lost-in-migration") return;
    if (e.key === "ArrowUp")    { e.preventDefault(); handleLimChoice("UP"); }
    if (e.key === "ArrowDown")  { e.preventDefault(); handleLimChoice("DOWN"); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); handleLimChoice("LEFT"); }
    if (e.key === "ArrowRight") { e.preventDefault(); handleLimChoice("RIGHT"); }
  });

  setGameTimeout(() => nextLimRound(), 400);

  state.gameTimer = setInterval(() => {
    if (state.isPaused || !state.isGameActive) return;
    timeLeft -= 0.1;
    const fill = document.getElementById("timer-fill");
    if (fill) {
      fill.style.width = `${Math.max(0, (timeLeft / limDuration) * 100)}%`;
      if (timeLeft < 15) fill.classList.add('warning');
    }
    if (timeLeft <= 0) {
      clearAllGameTimers();
      finishGame();
    }
  }, 100);
}

function nextLimRound() {
  const displayEl = document.getElementById("flock-display");
  if (!displayEl) return;
  limAnswerPending = true;

  limTargetDir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  const accuracy = state.totalCount > 0 ? state.correctCount / state.totalCount : 0.5;
  if (accuracy > 0.85 && state.totalCount > 6) {
    limCongruentRatio = Math.max(0.35, limCongruentRatio - 0.03);
  }

  limIsCongruent = Math.random() < limCongruentRatio;
  const flankers = DIRECTIONS.filter(d => d !== limTargetDir);
  const flankerDir = limIsCongruent ? limTargetDir : flankers[Math.floor(Math.random() * flankers.length)];

  displayEl.innerHTML = [
    renderLimBird(flankerDir, false),
    renderLimBird(flankerDir, false),
    renderLimBird(limTargetDir, true),
    renderLimBird(flankerDir, false),
    renderLimBird(flankerDir, false)
  ].join("");

  state.startTime = Date.now();
}

function handleLimChoice(dir) {
  if (!limAnswerPending || state.isPaused || !state.isGameActive) return;
  limAnswerPending = false;

  const rt = Date.now() - state.startTime;
  state.reactionTimes.push(rt);
  if (limIsCongruent) limCongruentRt.push(rt);
  else limIncongruentRt.push(rt);

  updateCogLoadMeter();
  state.totalCount++;
  const fb = document.getElementById("lim-feedback");

  if (dir === limTargetDir) {
    const speedBonus = Math.max(50, Math.round(300 - rt * 0.2));
    updateScore(speedBonus, true);
    state.correctCount++;
    limCorrectStreak++;
    state.roundAccuracies.push(1);
    if (fb) {
      fb.textContent = `${t('correctText')} — ${rt}ms (+${speedBonus * state.multiplier})`;
      fb.style.color = "var(--accent-green)";
    }
  } else {
    updateScore(-60, false);
    limCorrectStreak = 0;
    state.roundAccuracies.push(0);
    const targetLabel = limTargetDir === "UP" ? t('dirUp') : limTargetDir === "DOWN" ? t('dirDown') : limTargetDir === "LEFT" ? t('dirLeft') : t('dirRight');
    if (fb) {
      fb.textContent = `${t('wrongText')} · ${t('limDistracted')} ${targetLabel} (${DIR_ARROWS[limTargetDir]})`;
      fb.style.color = "var(--accent-coral)";
    }
    shakeStage();
  }

  setGameTimeout(() => {
    if (state.currentGame?.id === "lost-in-migration" && state.isGameActive && !state.isPaused) {
      nextLimRound();
    }
  }, 180);
}


// ===================================================
// GAME 4: RAINDROPS (PROGRESSIVE MATH)
// Formula from rehber:
//   fall time = max(3s, 8s - round*0.2s)
//   rounds 1-5: single digit add/sub
//   rounds 6-15: 2-digit + single-digit mult
//   rounds 16+: 2-digit mult/div
//   simultaneous drops: 1 → 2 (round 9+) → 3 (round 20+)
// ===================================================
let rdRoundNum = 0, rdLives = 3, rdDrops = [], rdAnimFrame = null;
let rdDuration = 180, rdTimeLeft = 180;

function initRaindrops() {
  state.score = 0; state.correctCount = 0; state.totalCount = 0;
  rdLives = 3; rdRoundNum = 0; rdDrops = [];
  rdDuration = state.currentGame.duration;
  rdTimeLeft = rdDuration;

  cancelAllRdAnimFrames();

  const area = document.getElementById("game-area");
  area.innerHTML = `
    <div class="game-stage-card" style="padding:24px 20px;">
      <div class="game-timer-bar"><div class="game-timer-fill" id="timer-fill" style="width:100%"></div></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span class="game-round-indicator" style="margin:0;" id="rd-level">Level 1</span>
        <span id="rd-lives" style="font-size:18px;">💧💧💧</span>
      </div>
      <div class="rd-arena" id="rd-arena"></div>
      <div class="rd-options" id="rd-options"></div>
      <div class="speed-feedback" id="rd-feedback"></div>
    </div>
  `;

  spawnRaindrop();

  state.gameTimer = setInterval(() => {
    if (state.isPaused || !state.isGameActive) return;
    rdTimeLeft -= 0.1;
    const fill = document.getElementById("timer-fill");
    if (fill) {
      fill.style.width = `${Math.max(0, (rdTimeLeft / rdDuration) * 100)}%`;
      if (rdTimeLeft < 30) fill.classList.add('warning');
    }
    if (rdTimeLeft <= 0 || rdLives <= 0) {
      clearAllGameTimers();
      finishGame();
    }
  }, 100);
}

function genMathExpr(round) {
  let a, b, val, text;
  if (round <= 5) {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    if (Math.random() > 0.5) { val = a + b; text = `${a} + ${b}`; }
    else { const hi = Math.max(a,b); const lo = Math.min(a,b); val = hi - lo; text = `${hi} − ${lo}`; }
  } else if (round <= 15) {
    if (Math.random() > 0.5) {
      a = Math.floor(Math.random() * 8) + 3; b = Math.floor(Math.random() * 8) + 3;
      val = a * b; text = `${a} × ${b}`;
    } else {
      a = Math.floor(Math.random() * 35) + 12; b = Math.floor(Math.random() * 35) + 12;
      val = a + b; text = `${a} + ${b}`;
    }
  } else {
    b = Math.floor(Math.random() * 9) + 3; val = Math.floor(Math.random() * 12) + 2; a = b * val;
    text = `${a} ÷ ${b}`;
  }
  return { text, val };
}

function spawnRaindrop() {
  if (state.isPaused || !state.isGameActive) return;
  rdRoundNum++;
  const maxDrops = rdRoundNum >= 20 ? 3 : rdRoundNum >= 9 ? 2 : 1;
  const arena = document.getElementById('rd-arena');
  const optEl = document.getElementById('rd-options');
  if (!arena || !optEl) return;

  const expr = genMathExpr(rdRoundNum);
  const correctAns = expr.val;

  // Arena dimensions
  const arenaW = arena.offsetWidth || 400;
  const arenaH = arena.offsetHeight || 180;

  // Fall duration (adaptive)
  const fallDuration = Math.max(3000, 8000 - rdRoundNum * 200);

  // Create drop element
  const drop = document.createElement('div');
  drop.className = 'raindrop';
  drop.style.left = `${Math.floor(Math.random() * (arenaW - 90)) + 10}px`;
  drop.style.top = '-80px';
  drop.style.width = '80px';
  drop.style.height = '80px';
  drop.dataset.ans = correctAns;

  drop.innerHTML = `
    <svg viewBox="0 0 80 80" width="80" height="80">
      <path d="M40 4 C40 4, 66 28, 66 48 C66 62.4 54.4 74 40 74 C25.6 74 14 62.4 14 48 C14 28, 40 4, 40 4Z"
        fill="url(#rdGrad${rdRoundNum})" opacity="0.92"/>
      <defs>
        <linearGradient id="rdGrad${rdRoundNum}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00F2FE"/>
          <stop offset="100%" stop-color="#3B82F6"/>
        </linearGradient>
      </defs>
    </svg>
    <div class="raindrop-text">${expr.text}</div>
  `;

  arena.appendChild(drop);
  rdDrops.push({ el: drop, ans: correctAns, startTime: Date.now(), fallDuration });

  // Update level indicator
  const lvlEl = document.getElementById('rd-level');
  if (lvlEl) lvlEl.textContent = rdRoundNum <= 5 ? 'Level 1' : rdRoundNum <= 15 ? 'Level 2' : 'Level 3';

  // Generate answer options
  const choices = [correctAns];
  const offsets = [-7,-5,-3,3,5,7,10,-10];
  const shuffled = offsets.sort(() => Math.random()-0.5);
  let oi = 0;
  while (choices.length < 4) {
    const w = correctAns + shuffled[oi++];
    if (w >= 0 && !choices.includes(w)) choices.push(w);
    if (oi >= shuffled.length) break;
  }
  while (choices.length < 4) choices.push(correctAns + choices.length * 3);
  choices.sort(() => Math.random() - 0.5);

  optEl.innerHTML = choices.map(c => `
    <button class="speed-btn neutral" onclick="handleRdChoice(${c}, ${correctAns})"
      style="padding:14px 8px;font-size:20px;font-weight:800;">${c}</button>
  `).join('');

  // Animate fall
  animateDrop(drop, arenaH, fallDuration, correctAns);
}

function animateDrop(dropEl, arenaH, fallDuration, correctAns) {
  let start = Date.now();
  let pausedAt = null;
  let totalPausedTime = 0;

  function frame() {
    if (!state.isGameActive) {
      if (dropEl && dropEl.parentNode) dropEl.remove();
      return;
    }

    if (state.isPaused) {
      if (!pausedAt) pausedAt = Date.now();
      const id = requestAnimationFrame(frame);
      rdAnimFrames.push(id);
      return;
    }

    if (pausedAt) {
      totalPausedTime += (Date.now() - pausedAt);
      pausedAt = null;
    }

    if (!dropEl.parentNode) return;
    const elapsed = Date.now() - start - totalPausedTime;
    const progress = elapsed / fallDuration;
    const y = -80 + (arenaH + 80) * progress;
    dropEl.style.top = `${y}px`;

    if (progress >= 1) {
      dropEl.remove();
      if (!state.isGameActive || state.isPaused) return;
      rdLives--;
      playSound('wrong');
      const livesEl = document.getElementById('rd-lives');
      if (livesEl) livesEl.textContent = '💧'.repeat(Math.max(0, rdLives));
      const fb = document.getElementById('rd-feedback');
      if (fb) { fb.textContent = `💦 Missed! Answer was ${correctAns}`; fb.style.color = 'var(--accent-coral)'; }
      shakeStage();
      if (rdLives > 0 && rdTimeLeft > 0) {
        setGameTimeout(spawnRaindrop, 600);
      } else {
        clearInterval(state.gameTimer);
        cancelAllRdAnimFrames();
        setGameTimeout(finishGame, 600);
      }
      return;
    }
    const id = requestAnimationFrame(frame);
    rdAnimFrames.push(id);
  }
  const id = requestAnimationFrame(frame);
  rdAnimFrames.push(id);
}

function handleRdChoice(choice, correctAns) {
  if (state.isPaused || !state.isGameActive) return;
  const rt = Date.now() - state.startTime;
  state.reactionTimes.push(rt);
  state.totalCount++;

  // Remove current drop
  const arena = document.getElementById('rd-arena');
  if (arena) { const drops = arena.querySelectorAll('.raindrop'); drops.forEach(d => d.remove()); }

  const fb = document.getElementById('rd-feedback');

  if (choice === correctAns) {
    updateScore(200, true);
    state.correctCount++;
    state.roundAccuracies.push(1);
    if (fb) { fb.textContent = `💥 Popped! +${200 * state.multiplier}pts`; fb.style.color = 'var(--accent-green)'; }
    setGameTimeout(spawnRaindrop, 250);
  } else {
    updateScore(-100, false);
    rdLives--;
    state.roundAccuracies.push(0);
    const livesEl = document.getElementById('rd-lives');
    if (livesEl) livesEl.textContent = '💧'.repeat(Math.max(0, rdLives));
    if (fb) { fb.textContent = `✗ Wrong — ${correctAns} was right`; fb.style.color = 'var(--accent-coral)'; }
    shakeStage();
    if (rdLives <= 0) {
      clearInterval(state.gameTimer);
      cancelAllRdAnimFrames();
      setGameTimeout(finishGame, 700);
    } else {
      setGameTimeout(spawnRaindrop, 700);
    }
  }
}

// ===================================================
// GAME 5: COLOR MATCH (STROOP)
// ===================================================
const COLOR_WORDS = [
  { name: "RED",    color: "#EF4444" },
  { name: "BLUE",   color: "#3B82F6" },
  { name: "GREEN",  color: "#10B981" },
  { name: "YELLOW", color: "#F59E0B" },
  { name: "PURPLE", color: "#A78BFA" }
];
let cmTopWord = null, cmBottomWord = null, cmDuration = 120;

function initColorMatch() {
  state.score = 0; state.correctCount = 0; state.totalCount = 0;
  cmDuration = state.currentGame.duration;
  let timeLeft = cmDuration;
  const area = document.getElementById("game-area");
  area.innerHTML = `
    <div class="game-stage-card">
      <div class="game-timer-bar"><div class="game-timer-fill" id="timer-fill" style="width:100%"></div></div>
      <div class="game-round-indicator">Does the <strong>TOP WORD</strong> match the <strong>ink color</strong> of the bottom text?</div>
      <div style="background:rgba(255,255,255,0.04);padding:20px 16px;border-radius:14px;margin:16px 0;border:1px solid var(--border);">
        <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:1px;margin-bottom:8px;">TOP WORD</div>
        <div id="cm-top" style="font-size:44px;font-weight:800;min-height:58px;display:flex;align-items:center;justify-content:center;color:var(--text-primary);">RED</div>
      </div>
      <div style="background:rgba(255,255,255,0.04);padding:20px 16px;border-radius:14px;margin:16px 0;border:1px solid var(--border);">
        <div style="font-size:11px;font-weight:700;color:var(--text-muted);letter-spacing:1px;margin-bottom:8px;">BOTTOM TEXT INK COLOR</div>
        <div id="cm-bottom" style="font-size:44px;font-weight:800;min-height:58px;display:flex;align-items:center;justify-content:center;">BLUE</div>
      </div>
      <div class="speed-buttons">
        <button class="speed-btn no" onclick="handleColorChoice(false)">✕ NO</button>
        <button class="speed-btn yes" onclick="handleColorChoice(true)">✓ YES</button>
      </div>
      <div class="speed-feedback" id="cm-feedback"></div>
      <p style="font-size:12px;color:var(--text-muted);margin-top:10px;">← NO · → YES</p>
    </div>
  `;
  setGameKeyHandler((e) => {
    if (state.currentGame?.id !== "color-match") return;
    if (e.key === "ArrowLeft") handleColorChoice(false);
    if (e.key === "ArrowRight") handleColorChoice(true);
  });
  nextColorRound();
  state.gameTimer = setInterval(() => {
    if (state.isPaused || !state.isGameActive) return;
    timeLeft -= 0.1;
    const fill = document.getElementById("timer-fill");
    if (fill) { fill.style.width = `${Math.max(0,(timeLeft/cmDuration)*100)}%`; if (timeLeft<15) fill.classList.add('warning'); }
    if (timeLeft <= 0) { clearAllGameTimers(); finishGame(); }
  }, 100);
}

function nextColorRound() {
  const topEl = document.getElementById("cm-top"), bottomEl = document.getElementById("cm-bottom");
  if (!topEl || !bottomEl) return;
  cmTopWord = COLOR_WORDS[Math.floor(Math.random() * COLOR_WORDS.length)].name;
  const bWord = COLOR_WORDS[Math.floor(Math.random() * COLOR_WORDS.length)];
  const bInk  = COLOR_WORDS[Math.floor(Math.random() * COLOR_WORDS.length)];
  cmBottomWord = { text: bWord.name, inkColor: bInk.color, inkName: bInk.name };
  topEl.textContent = cmTopWord;
  bottomEl.textContent = cmBottomWord.text;
  bottomEl.style.color = cmBottomWord.inkColor;
  state.startTime = Date.now();
}

function handleColorChoice(userYes) {
  if (state.isPaused || !state.isGameActive) return;
  const rt = Date.now() - state.startTime;
  state.reactionTimes.push(rt);
  updateCogLoadMeter();
  const match = cmTopWord === cmBottomWord.inkName;
  const fb = document.getElementById("cm-feedback");
  state.totalCount++;
  if (userYes === match) {
    updateScore(200, true); state.correctCount++;
    if (fb) { fb.textContent = `✓ Correct — ${rt}ms`; fb.style.color = "var(--accent-green)"; }
  } else {
    updateScore(-100, false);
    if (fb) { fb.textContent = `✗ Wrong — ${rt}ms`; fb.style.color = "var(--accent-coral)"; }
    shakeStage();
  }
  nextColorRound();
}

// ===================================================
// GAME 6: CHALKBOARD CHALLENGE
// ===================================================
let ccLeft = 0, ccRight = 0, ccDuration = 120;

function initChalkboardChallenge() {
  clearAllGameTimers();
  state.score = 0; state.correctCount = 0; state.totalCount = 0;
  ccDuration = state.currentGame.duration;
  let timeLeft = ccDuration;
  const area = document.getElementById("game-area");
  area.innerHTML = `
    <div class="game-stage-card">
      <div class="game-timer-bar"><div class="game-timer-fill" id="timer-fill" style="width:100%"></div></div>
      <div class="game-round-indicator">Which expression has the GREATER value?</div>
      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin:22px 0;">
        <div class="cc-panel" id="cc-left"></div>
        <div class="cc-vs">VS</div>
        <div class="cc-panel" id="cc-right"></div>
      </div>
      <div class="speed-buttons">
        <button class="speed-btn yes" onclick="handleCcChoice('LEFT')" style="font-size:14px;">← LEFT</button>
        <button class="speed-btn neutral" onclick="handleCcChoice('EQUAL')" style="font-size:14px;">=</button>
        <button class="speed-btn yes" onclick="handleCcChoice('RIGHT')" style="font-size:14px;">RIGHT →</button>
      </div>
      <div class="speed-feedback" id="cc-feedback"></div>
    </div>
  `;
  setGameKeyHandler((e) => {
    if (state.currentGame?.id !== "chalkboard-challenge") return;
    if (e.key === "ArrowLeft") handleCcChoice("LEFT");
    if (e.key === "=" || e.key === "ArrowDown") handleCcChoice("EQUAL");
    if (e.key === "ArrowRight") handleCcChoice("RIGHT");
  });
  nextCcRound();
  state.gameTimer = setInterval(() => {
    if (state.isPaused || !state.isGameActive) return;
    timeLeft -= 0.1;
    const fill = document.getElementById("timer-fill");
    if (fill) { fill.style.width = `${Math.max(0,(timeLeft/ccDuration)*100)}%`; if (timeLeft<15) fill.classList.add('warning'); }
    if (timeLeft <= 0) { clearAllGameTimers(); finishGame(); }
  }, 100);
}


function nextCcRound() {
  const leftEl = document.getElementById("cc-left"), rightEl = document.getElementById("cc-right");
  if (!leftEl || !rightEl) return;
  const e1 = genCcExpr(), e2 = genCcExpr();
  ccLeft = e1.val; ccRight = e2.val;
  leftEl.textContent = e1.text; rightEl.textContent = e2.text;
  state.startTime = Date.now();
}

function genCcExpr() {
  const round = state.totalCount || 0;
  const ops = round < 8 ? ["+","-"] : ["+","-","×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, val, text;
  if (op === "+") { a = Math.floor(Math.random()*40)+10; b = Math.floor(Math.random()*40)+10; val=a+b; text=`${a} + ${b}`; }
  else if (op === "-") { a = Math.floor(Math.random()*50)+20; b = Math.floor(Math.random()*20)+1; val=a-b; text=`${a} − ${b}`; }
  else { a = Math.floor(Math.random()*9)+3; b = Math.floor(Math.random()*9)+3; val=a*b; text=`${a} × ${b}`; }
  return { text, val };
}

function handleCcChoice(choice) {
  if (state.isPaused || !state.isGameActive) return;
  const rt = Date.now() - state.startTime;
  state.reactionTimes.push(rt);
  let correct = ccLeft > ccRight ? "LEFT" : ccRight > ccLeft ? "RIGHT" : "EQUAL";
  const fb = document.getElementById("cc-feedback");
  state.totalCount++;
  if (choice === correct) {
    updateScore(200, true); state.correctCount++;
    if (fb) { fb.textContent = `✓ Correct — ${rt}ms`; fb.style.color = "var(--accent-green)"; }
  } else {
    updateScore(-100, false);
    if (fb) { fb.textContent = `✗ Wrong (${ccLeft} vs ${ccRight}) — ${rt}ms`; fb.style.color = "var(--accent-coral)"; }
    shakeStage();
  }
  nextCcRound();
}

// ===================================================
// HELPERS
// ===================================================
function shakeStage() {
  const card = document.querySelector(".game-stage-card");
  if (card) { card.classList.add("shake-stage"); setTimeout(() => card.classList.remove("shake-stage"), 320); }
}

function animateNumber(el, from, to, duration) {
  const start = Date.now();
  function frame() {
    const elapsed = Date.now() - start;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function showToast(msg, color = '#00F2FE') {
  const t = document.createElement('div');
  t.className = 'share-toast';
  t.style.borderColor = `${color}44`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// ===================================================
// COGNITIVE LOAD METER — REAL-TIME
// 300ms = 0% load, 1500ms+ = 100% load
// Color: green (low) → orange (medium) → red (high)
// ===================================================
function updateCogLoadMeter() {
  const recent = state.reactionTimes.slice(-5);
  if (recent.length < 2) return;
  const avgRt = recent.reduce((a,b) => a+b,0) / recent.length;
  const load = Math.min(100, Math.max(0, ((avgRt - 300) / 1200) * 100));

  const fill  = document.getElementById('cog-load-fill');
  const label = document.getElementById('cog-load-label');
  if (!fill || !label) return;

  fill.style.width = `${load}%`;
  if (load < 35) {
    fill.style.background = 'linear-gradient(90deg, #10B981, #00F2FE)';
    label.textContent = 'LOW';
    label.style.color = '#10B981';
  } else if (load < 65) {
    fill.style.background = 'linear-gradient(90deg, #F59E0B, #FF8C42)';
    label.textContent = 'MED';
    label.style.color = '#F59E0B';
  } else {
    fill.style.background = 'linear-gradient(90deg, #FF6B6B, #EF4444)';
    label.textContent = 'HIGH';
    label.style.color = '#EF4444';
  }
}

// ===================================================
// COGNITIVE PROFILE BADGE
// Computed from category scores
// Unlocks after 5 sessions
// ===================================================
const PROFILE_TYPES = [
  { id:'eagle',    icon:'🦅', label:'Eagle Mind',      desc:'Attention + Speed dominant. You process fast and stay focused.',       cond: s => s.attention > 700 && s.speed > 650 },
  { id:'elephant', icon:'🐘', label:'Memory Titan',    desc:'Exceptional working memory. You hold more than most minds can.',       cond: s => s.memory > 700 },
  { id:'circuit',  icon:'⚡', label:'Circuit Brain',   desc:'Processing speed leader. Decisions come as fast as lightning.',        cond: s => s.speed > 700 },
  { id:'sniper',   icon:'🎯', label:'Laser Focus',     desc:'Selective attention mastered. Distractors don\'t stand a chance.',     cond: s => s.attention > 720 },
  { id:'math',     icon:'🧮', label:'Math Machine',    desc:'Problem solving dominant. Numbers are your native language.',          cond: s => s['problem-solving'] > 680 },
  { id:'flex',     icon:'🔄', label:'Flex Thinker',    desc:'Task-switching champion. You adapt faster than anyone.',              cond: s => s.flexibility > 660 },
  { id:'balanced', icon:'🌐', label:'Balanced Brain',  desc:'Well-rounded cognitive profile. Consistently strong across areas.',    cond: () => true }
];

function computeProfileBadge() {
  if (state.user.gamesPlayed < 5) return null;
  const s = state.user.categoryScores;
  return PROFILE_TYPES.find(p => p.cond(s)) || PROFILE_TYPES[PROFILE_TYPES.length - 1];
}

function renderProfileBadge() {
  const badge = computeProfileBadge();
  const el = document.getElementById('profile-badge-home');
  if (!el) return;
  if (!badge) { el.style.display = 'none'; return; }

  el.style.display = 'flex';
  const iconEl = document.getElementById('pbh-icon');
  const typeEl = document.getElementById('pbh-type');
  const descEl = document.getElementById('pbh-desc');
  if (iconEl) iconEl.textContent = badge.icon;
  if (typeEl) typeEl.textContent = badge.label;
  if (descEl) descEl.textContent = badge.desc;
}

function shareBadge() {
  const badge = computeProfileBadge();
  if (!badge) return;
  const avg = Math.round(state.reactionTimes.slice(-20).reduce((a,b)=>a+b,0) / Math.max(1, Math.min(20,state.reactionTimes.length)));
  const text = `Lumo brain training: ${badge.icon} ${badge.label} profile! Avg reaction time: ${avg || '–'}ms | ${state.user.gamesPlayed} sessions played`;
  navigator.clipboard?.writeText(text).then(() => showToast('📋 Copied to clipboard!')).catch(() => {});
  showToast(`${badge.icon} Copied: ${badge.label}`);
}

// ===================================================
// WEEKLY REPORT — HOME TAB
// ===================================================
function renderWeeklyReport() {
  const now = new Date();
  const dayNames = currentLang === 'tr'
    ? ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Build 7-day activity data (demo: based on gamesPlayed)
  const playedDays = Math.min(7, Math.ceil(state.user.gamesPlayed / 2));
  const todayIdx = now.getDay();

  const calEl = document.getElementById('streak-calendar');
  const labEl = document.getElementById('streak-day-labels');
  const periodEl = document.getElementById('wr-period');
  const sessionsEl = document.getElementById('wr-sessions');
  const rtEl = document.getElementById('wr-avg-rt');
  const deltaEl = document.getElementById('wr-lpi-delta');
  const insightEl = document.getElementById('wr-insight');

  if (!calEl || !labEl) return;

  // 7-day bars
  const barHeights = [20,35,28,45,40,52,60]; // demo trend
  const maxH = Math.max(...barHeights);
  calEl.innerHTML = Array.from({length:7}, (_,i) => {
    const isToday = i === 6;
    const isPlayed = i >= (7 - playedDays);
    const h = Math.max(8, Math.round((barHeights[i] / maxH) * 48));
    return `<div class="streak-day${isToday ? ' today' : isPlayed ? ' played' : ''}" style="height:${h}px"></div>`;
  }).join('');

  labEl.innerHTML = Array.from({length:7}, (_,i) => {
    const dIdx = (todayIdx - 6 + i + 7) % 7;
    return `<div class="streak-day-label">${i===6?(currentLang==='tr'?'Bugün':'Today'):dayNames[dIdx]}</div>`;
  }).join('');

  if (periodEl) {
    const start = new Date(now); start.setDate(now.getDate() - 6);
    const locale = currentLang === 'tr' ? 'tr-TR' : 'en-US';
    periodEl.textContent = `${start.toLocaleDateString(locale,{month:'short',day:'numeric'})} – ${now.toLocaleDateString(locale,{month:'short',day:'numeric'})}`;
  }
  if (sessionsEl) sessionsEl.textContent = Math.min(playedDays * 2, state.user.gamesPlayed);
  if (rtEl) {
    const avg = state.reactionTimes.length > 0
      ? Math.round(state.reactionTimes.slice(-30).reduce((a,b)=>a+b,0) / Math.min(30,state.reactionTimes.length))
      : null;
    rtEl.textContent = avg ? `${avg}ms` : '—';
  }
  if (deltaEl) {
    const baselineLpi = 580;
    const delta = state.user.lpi - baselineLpi;
    deltaEl.textContent = delta >= 0 ? `+${delta}` : `${delta}`;
    deltaEl.className = `wr-stat-val ${delta >= 0 ? 'positive' : 'negative'}`;
  }
  if (insightEl && state.user.gamesPlayed > 0) {
    const topCat = Object.keys(state.user.categoryScores).reduce((a,b) =>
      state.user.categoryScores[a] > state.user.categoryScores[b] ? a : b);
    const catNames = {
      memory: currentLang === 'tr' ? 'Hafıza' : 'Memory',
      attention: currentLang === 'tr' ? 'Dikkat' : 'Attention',
      speed: currentLang === 'tr' ? 'İşlem Hızı' : 'Speed',
      flexibility: currentLang === 'tr' ? 'Esneklik' : 'Flexibility',
      'problem-solving': currentLang === 'tr' ? 'Problem Çözme' : 'Problem Solving'
    };
    insightEl.innerHTML = currentLang === 'tr'
      ? `Bu haftaki en güçlü alanın <strong>${catNames[topCat] || topCat}</strong>. Zihinsel kazanımları kalıcı hale getirmek için günlük serini sürdür.`
      : `Your strongest area this week is <strong>${topCat.replace('-solving','').replace('-',' ')}</strong>. Keep your daily streak going for compounding gains.`;
  }
}

// ===================================================
// SESSION DEBRIEF
// ===================================================
function buildSessionDebrief() {
  const rts = state.reactionTimes;
  if (rts.length < 4) return;

  const sorted = [...rts].map((rt,i) => ({rt,i})).sort((a,b) => a.rt - b.rt);
  const fastEl = document.getElementById('debrief-fast');
  const slowEl = document.getElementById('debrief-slow');
  const compareEl = document.getElementById('debrief-compare');

  if (fastEl) {
    fastEl.innerHTML = sorted.slice(0,3).map(({rt,i}) =>
      `<div class="debrief-trial fast">
        <span class="debrief-trial-idx">${currentLang==='tr'?'Deneme #':'Trial #'}${i+1}</span>
        <span class="debrief-trial-rt">${rt}ms ⚡</span>
      </div>`
    ).join('');
  }
  if (slowEl) {
    slowEl.innerHTML = sorted.slice(-3).reverse().map(({rt,i}) =>
      `<div class="debrief-trial slow">
        <span class="debrief-trial-idx">${currentLang==='tr'?'Deneme #':'Trial #'}${i+1}</span>
        <span class="debrief-trial-rt">${rt}ms</span>
      </div>`
    ).join('');
  }

  if (compareEl) {
    const game = state.currentGame;
    const prevKey = `lumo_prev_rt_${game.id}`;
    const prevAvg = parseInt(localStorage.getItem(prevKey) || '0');
    const curAvg  = Math.round(rts.reduce((a,b) => a+b,0) / rts.length);
    localStorage.setItem(prevKey, curAvg.toString());

    if (prevAvg > 0) {
      const delta = prevAvg - curAvg; // positive = faster this time
      const pct = Math.round(Math.abs(delta) / prevAvg * 100);
      if (delta > 0) {
        compareEl.innerHTML = `<span class="delta-pos">⬆ %${pct} ${currentLang==='tr'?'daha hızlı':'faster'}</span> ${currentLang==='tr'?`önceki oturuma göre! Ortalamanız: ${curAvg}ms vs önceki: ${prevAvg}ms. Düzenli antrenman karşılığını veriyor.`:`than last session! Your avg: ${curAvg}ms vs ${prevAvg}ms previously. Consistent practice is paying off.`}`;
      } else if (delta < 0) {
        compareEl.innerHTML = `<span class="delta-neg">⬇ %${pct} ${currentLang==='tr'?'daha yavaş':'slower'}</span> ${currentLang==='tr'?`önceki oturuma göre (${curAvg}ms vs ${prevAvg}ms). Uyku ve yorgunluk gibi etkenler tepki hızını etkileyebilir.`:`than last session (${curAvg}ms vs ${prevAvg}ms). This can happen — sleep, stress, and time of day all affect reaction speed.`}`;
      } else {
        compareEl.innerHTML = currentLang==='tr'?`Önceki oturumla neredeyse aynı (${curAvg}ms). Performansınız oldukça istikrarlı.`:`Nearly identical to last session (${curAvg}ms). Your performance is very consistent.`;
      }
    } else {
      compareEl.textContent = currentLang==='tr'?`Bu oyun için ilk oturum! Ort. tepki hızı: ${curAvg}ms. Gelişimi görmek için tekrar oynayın.`:`First session for this game! Avg speed: ${curAvg}ms. Play again to track improvement.`;
    }
  }
}

function toggleDebrief() {
  const el = document.getElementById('session-debrief');
  if (el) el.classList.toggle('open');
}


// ===================================================
// KNOWLEDGE QUIZ SYSTEM — BILINGUAL (TR / EN)
// ===================================================
const KNOWLEDGE_QUIZZES = [
  {
    question: {
      tr: "Yetişkinlerin çoğunda çalışan bellek (kısa süreli hafıza) kapasitesi aynı anda yaklaşık kaç birimdir?",
      en: "Working memory capacity in most adults is approximately how many items at once?"
    },
    options: {
      tr: ["3–4 anlamlı öbek", "7 ± 2 öbek", "15 öbek", "Sınırsız"],
      en: ["3–4 chunks", "7 ± 2 chunks", "15 chunks", "Unlimited"]
    },
    correct: 0,
    explanation: {
      tr: "Nelson Cowan'ın (2010) güncel araştırmaları, klasik '7±2' kuralını yaklaşık 3–4 anlamlı birime revize etmiştir. Memory Matrix oyununun 3 kare ile başlamasının nedeni budur.",
      en: "Recent research by Nelson Cowan (2010) revised the classic '7±2' figure down to approximately 3–4 meaningful chunks. This is why Memory Matrix starts at just 3 tiles."
    },
    source: "Kaynak / Source: Cowan (2010), Current Biology"
  },
  {
    question: {
      tr: "Lost in Migration (Flanker testi) öncelikle hangi bilişsel beceriyi ölçer?",
      en: "The flanker task (Lost in Migration) primarily measures which cognitive ability?"
    },
    options: {
      tr: ["Uzun süreli hafıza", "Seçici dikkat ve çeldirici bastırma", "Aritmetik işlem hızı", "Görsel örüntü tanıma"],
      en: ["Long-term memory", "Selective attention & conflict resolution", "Arithmetic speed", "Pattern recognition"]
    },
    correct: 1,
    explanation: {
      tr: "Flanker testleri, ilgisiz çeldirici uyarıcıları ne kadar iyi bastırabildiğinizi ölçer. Ön singulat korteks ve prefrontal korteks, ortadaki kuş ile yanlardaki çeldiriciler arasındaki çatışmayı çözmek için birlikte çalışır.",
      en: "Flanker tasks measure how well you suppress irrelevant stimuli. The anterior cingulate cortex and prefrontal cortex coordinate to resolve the conflict between the center bird and its distractors."
    },
    source: "Kaynak / Source: Eriksen & Eriksen (1974), Perception & Psychophysics"
  },
  {
    question: {
      tr: "Stroop (Color Match) görevi sırasında beynin hangi bölgesi en aktif çalışır?",
      en: "Which part of your brain is most active during the Stroop (Color Match) task?"
    },
    options: {
      tr: ["Beyincik", "Hipokampus", "Ön Singulat Korteks (ACC)", "Görsel Korteks"],
      en: ["Cerebellum", "Hippocampus", "Anterior cingulate cortex", "Visual cortex"]
    },
    correct: 2,
    explanation: {
      tr: "Ön singulat korteks (ACC), otomatik kelime okuma ile renk adlandırma arasındaki çatışmayı algılar ve alışılmış tepkiyi bastırması için prefrontal kortekse sinyal gönderir.",
      en: "The anterior cingulate cortex (ACC) detects the conflict between automatic reading and color naming, then signals the prefrontal cortex to override the habitual response."
    },
    source: "Kaynak / Source: MacLeod (1991), Psychological Bulletin"
  },
  {
    question: {
      tr: "İşlem hızı (Speed Match) insanların çoğunda yaklaşık hangi yaşlarda zirveye ulaşır?",
      en: "Processing speed (Speed Match) peaks at roughly what age in most people?"
    },
    options: {
      tr: ["10 yaş civarında", "18–25 yaşları arasında", "40 yaşında", "50 yaşından sonra"],
      en: ["Around age 10", "Late teens to mid-20s", "Age 40", "After age 50"]
    },
    correct: 1,
    explanation: {
      tr: "Bilgi işlem hızı 20'li yaşların başlarında zirveye ulaşır, sonrasında kademeli olarak yavaşlar. Ancak düzenli zihinsel antrenman bu gerilemeyi önemli ölçüde telafi eder.",
      en: "Information processing speed peaks in the late teens to mid-20s, then declines gradually. However, regular cognitive training can partially compensate for this decline."
    },
    source: "Kaynak / Source: Salthouse (1996), Psychological Review"
  },
  {
    question: {
      tr: "N-back görevi (adaptif hafıza) en tutarlı gelişimi hangi antrenman sıklığında gösterir?",
      en: "The 'n-back' task (adaptive memory) improves most reliably when practiced how often?"
    },
    options: {
      tr: ["Haftada bir gün", "En az 4 hafta boyunca düzenli", "Ayda bir kez", "Sadece yorgunken"],
      en: ["Once a week", "Daily for at least 4 weeks", "Once a month", "Only when tired"]
    },
    correct: 1,
    explanation: {
      tr: "Jaeggi ve çalışma arkadaşları, N-back antrenmanından elde edilen çalışan bellek kazanımlarının 4+ hafta boyunca düzenli pratikle kalıcı hale geldiğini kanıtlamıştır.",
      en: "Research by Jaeggi et al. found that working memory improvements from n-back training are most consistent with daily practice over 4+ weeks. Occasional sessions show much weaker effects."
    },
    source: "Kaynak / Source: Jaeggi et al. (2008), PNAS"
  },
  {
    question: {
      tr: "Uyumlu ve uyumsuz Flanker turları arasındaki tipik milisaniye gecikme farkı (Flanker Etkisi) nedir?",
      en: "What is the 'flanker effect' in milliseconds that typically separates congruent from incongruent trials?"
    },
    options: {
      tr: ["0–10 ms", "20–80 ms", "200–500 ms", "1 saniyenin üzerinde"],
      en: ["0–10 ms", "20–80 ms", "200–500 ms", "Over 1 second"]
    },
    correct: 1,
    explanation: {
      tr: "Çeldiricilerin zıt yöne baktığı turlar, tepkileri tipik olarak 20–80ms yavaşlatır. Bu gecikme beyninizin dikkat çatışmasını çözmek için harcadığı süreyi yansıtır.",
      en: "Incongruent flanker trials typically slow responses by 20–80ms compared to congruent ones. This interference cost reflects the time your brain spends resolving attentional conflict."
    },
    source: "Kaynak / Source: Eriksen & Eriksen (1974)"
  }
];

let kqAnswered = false;

function maybeShowKnowledgeQuiz() {
  state.user.gamesSinceLastQuiz = (state.user.gamesSinceLastQuiz || 0) + 1;
  if (state.user.gamesSinceLastQuiz >= 3) {
    state.user.gamesSinceLastQuiz = 0;
    setTimeout(() => showKnowledgeQuiz(), 500);
    return true;
  }
  return false;
}

function showKnowledgeQuiz() {
  const quiz = KNOWLEDGE_QUIZZES[Math.floor(Math.random() * KNOWLEDGE_QUIZZES.length)];
  kqAnswered = false;

  const qText = typeof quiz.question === 'object' ? (quiz.question[currentLang] || quiz.question.en) : quiz.question;
  const opts = typeof quiz.options === 'object' && !Array.isArray(quiz.options)
    ? (quiz.options[currentLang] || quiz.options.en)
    : quiz.options;
  const expText = typeof quiz.explanation === 'object' ? (quiz.explanation[currentLang] || quiz.explanation.en) : quiz.explanation;
  const srcText = typeof quiz.source === 'object' ? (quiz.source[currentLang] || quiz.source.en) : quiz.source;

  document.getElementById('kq-question').textContent = qText;
  document.getElementById('kq-options').innerHTML = opts.map((opt, i) => `
    <button class="kq-option" onclick="handleKqAnswer(${i}, ${quiz.correct})" data-idx="${i}">${opt}</button>
  `).join('');
  document.getElementById('kq-explain-text').textContent = expText;
  document.getElementById('kq-source').textContent = srcText;
  document.getElementById('kq-explanation').classList.remove('visible');
  const contBtn = document.getElementById('kq-continue-btn');
  if (contBtn) {
    contBtn.style.display = 'none';
    contBtn.textContent = t('kqContinue');
  }
  document.getElementById('knowledge-quiz-overlay').style.display = 'flex';
  playSound('quiz');
}

function handleKqAnswer(chosen, correct) {
  if (kqAnswered) return;
  kqAnswered = true;

  document.querySelectorAll('.kq-option').forEach((btn, i) => {
    if (i === correct) btn.classList.add('correct-answer');
    else if (i === chosen && chosen !== correct) btn.classList.add('wrong-answer');
    btn.disabled = true;
  });

  if (chosen === correct) playSound('correct'); else playSound('wrong');

  document.getElementById('kq-explanation').classList.add('visible');
  document.getElementById('kq-continue-btn').style.display = 'block';
}

function closeKnowledgeQuiz() {
  document.getElementById('knowledge-quiz-overlay').style.display = 'none';
}

// ===================================================
// SESSION END / RESULT SCREEN
// ===================================================
function finishGame() {
  clearAllGameTimers();
  state.isGameActive = false;


  const game = state.currentGame;
  const accuracy = state.totalCount > 0 ? Math.round((state.correctCount / state.totalCount) * 100) : 0;
  const avgRt = state.reactionTimes.length > 0
    ? Math.round(state.reactionTimes.reduce((a,b) => a+b, 0) / state.reactionTimes.length) : 0;
  const percentile = Math.min(99, Math.max(10, Math.round(accuracy * 0.8 + state.score / 60)));

  // Update scores
  state.user.gamesPlayed++;
  if (game && state.user.categoryScores[game.category] !== undefined) {
    const delta = Math.round(state.score / 10);
    state.user.categoryScores[game.category] = Math.max(0, state.user.categoryScores[game.category] + delta);
    state.user.lpi = Math.round(Object.values(state.user.categoryScores).reduce((a,b) => a+b, 0) / 5);
  }

  // Fit test scores accumulation
  if (state.isFitTestMode && game) {
    if (!state.user.fitTestScores) state.user.fitTestScores = { ...state.user.categoryScores };
    state.user.fitTestScores[game.category] = state.user.categoryScores[game.category];
  }
  saveState();

  // Personal best
  const bestKey = `lumo_best_${game.id}`;
  const prevBest = parseInt(localStorage.getItem(bestKey) || "0");
  const isNewBest = state.score > prevBest;
  if (isNewBest) localStorage.setItem(bestKey, state.score.toString());

  // Result badge
  const badge = document.getElementById('result-badge');
  const title = document.getElementById('result-title');
  const subtitle = document.getElementById('result-subtitle');
  if (badge) {
    if (state.score > 2000) { badge.textContent = '🏆'; badge.className = 'result-badge gold'; }
    else if (state.score > 1000) { badge.textContent = '⭐'; badge.className = 'result-badge teal'; }
    else { badge.textContent = '🎯'; badge.className = 'result-badge coral'; }
  }
  if (title) title.textContent = state.score > 2000 ? t('resultOutstanding') : state.score > 800 ? t('resultGreat') : t('resultNice');
  if (subtitle) subtitle.textContent = game.name;

  // Animated score + arc
  const scoreEl = document.getElementById('result-score');
  if (scoreEl) {
    let cur = 0;
    const inc = Math.max(1, Math.ceil(state.score / 40));
    const t = setInterval(() => {
      cur = Math.min(state.score, cur + inc);
      scoreEl.textContent = cur;
      if (cur >= state.score) clearInterval(t);
    }, 25);
  }
  const arc = document.getElementById('result-arc');
  if (arc) {
    const circumference = 364;
    const offset = circumference - (Math.min(100, percentile) / 100) * circumference;
    setTimeout(() => { arc.style.strokeDashoffset = offset; arc.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)'; }, 200);
  }

  // Stats
  const statsEl = document.getElementById('result-stats');
  if (statsEl) {
    const rankLabel = currentLang === 'tr' ? `%${Math.max(1, 100 - percentile)} Dilim` : `Top ${Math.max(1, 100 - percentile)}%`;
    statsEl.innerHTML = `
      <div class="result-stat">
        <span class="result-stat-val">${accuracy}%</span>
        <span class="result-stat-label">${t('resultAccuracy')}</span>
      </div>
      <div class="result-stat">
        <span class="result-stat-val">${avgRt > 0 ? avgRt + 'ms' : state.correctCount}</span>
        <span class="result-stat-label">${avgRt > 0 ? t('resultAvgSpeed') : (currentLang==='tr'?'Doğru':'Correct')}</span>
      </div>
      <div class="result-stat">
        <span class="result-stat-val">${state.maxCombo}×</span>
        <span class="result-stat-label">${t('resultMaxCombo')}</span>
      </div>
      <div class="result-stat">
        <span class="result-stat-val">${rankLabel}</span>
        <span class="result-stat-label">${t('resultRanking')}</span>
      </div>
    `;
  }

  // Personal best banner
  const pbEl = document.getElementById('result-pb');
  const pbText = document.getElementById('result-pb-text');
  if (pbEl && isNewBest) {
    pbEl.style.display = 'flex';
    if (pbText) {
      pbText.textContent = prevBest > 0
        ? (currentLang === 'tr' ? `Yeni Kişisel Rekor! (+${state.score - prevBest} puan)` : `New Personal Best! (+${state.score - prevBest} pts)`)
        : (currentLang === 'tr' ? 'İlk Skor Kaydedildi! 🏆' : 'First Score Set! 🏆');
    }
  } else if (pbEl) {
    pbEl.style.display = 'none';
  }

  // Reaction time chart & Science Insight
  const rtChart = document.getElementById('result-rt-chart');
  const rtBars = document.getElementById('rt-bars-container');
  const gameInsight = typeof game.insight === 'object' ? (game.insight[currentLang] || game.insight.en) : (game.insight || '');

  if (rtChart && rtBars && state.reactionTimes.length > 3) {
    rtChart.style.display = 'block';
    const times = state.reactionTimes.slice(-20); // last 20
    const maxRt = Math.max(...times);
    const minRt = Math.min(...times);
    const minIdx = times.indexOf(minRt);
    rtBars.innerHTML = times.map((rt, i) => {
      const h = Math.max(8, Math.round(((rt - minRt + 50) / (maxRt - minRt + 50)) * 60));
      return `<div class="rt-bar${i === minIdx ? ' best-bar' : ''}" style="height:${h}px;" title="${rt}ms"></div>`;
    }).join('');

    // Flanker effect for LiM
    if (game.id === 'lost-in-migration' && limCongruentRt.length > 0 && limIncongruentRt.length > 0) {
      const avgC = Math.round(limCongruentRt.reduce((a,b)=>a+b,0)/limCongruentRt.length);
      const avgI = Math.round(limIncongruentRt.reduce((a,b)=>a+b,0)/limIncongruentRt.length);
      const effect = Math.max(0, avgI - avgC);
      const effectComment = currentLang === 'tr'
        ? (effect < 30 ? t('flankerEffectSuppression') : effect < 70 ? t('flankerEffectTypical') : t('flankerEffectSensitive'))
        : (effect < 30 ? 'Excellent suppression!' : effect < 70 ? 'Typical interference.' : 'High distractor sensitivity — practice helps!');
      document.getElementById('insight-text').textContent = currentLang === 'tr'
        ? `${t('flankerEffectTitle')}: +${effect}ms (${t('flankerCongruentVs')} ${avgC}ms vs ${t('flankerIncongruentVs')} ${avgI}ms). ${effectComment} ${gameInsight}`
        : `Your flanker effect: +${effect}ms (congruent avg ${avgC}ms vs incongruent ${avgI}ms). ${effectComment} ${gameInsight}`;
    } else {
      document.getElementById('insight-text').textContent = gameInsight;
    }
  } else {
    if (rtChart) rtChart.style.display = 'none';
    const insightEl = document.getElementById('insight-text');
    if (insightEl) insightEl.textContent = gameInsight;
  }

  // Workout / Fit Test sequencing
  const actionsEl = document.getElementById('result-actions');
  if (state.isWorkoutMode || state.isFitTestMode) {
    state.currentWorkoutIndex++;
    if (state.currentWorkoutIndex < state.workoutQueue.length) {
      const nextId = state.workoutQueue[state.currentWorkoutIndex];
      const nextGame = GAMES.find(g => g.id === nextId);
      if (actionsEl) actionsEl.innerHTML = `
        <button class="btn-primary btn-full" onclick="launchGame('${nextId}', ${state.isFitTestMode ? 'true' : 'false'})">
          ${t('nextGameLabel')} ${nextGame.name} (${state.currentWorkoutIndex + 1}/${state.workoutQueue.length}) →
        </button>
        <button class="btn-secondary btn-full" onclick="exitGameConfirmed()">${t('pauseSession')}</button>
      `;
    } else {
      if (state.isFitTestMode) {
        if (actionsEl) actionsEl.innerHTML = `
          <button class="btn-primary btn-full" onclick="showFitTestResults()">${t('seeBaselineResults')}</button>
        `;
      } else {
        if (actionsEl) actionsEl.innerHTML = `
          <button class="btn-primary btn-full" onclick="showPage('app'); switchTab('home');">${currentLang==='tr'?'Günün Antrenmanını Tamamla 🏆':'Complete Today\'s Workout 🏆'}</button>
        `;
      }
    }
  } else {
    if (actionsEl) actionsEl.innerHTML = `
      <button class="btn-primary btn-full" id="btn-play-again" onclick="launchGame('${game.id}')">${t('playAgainBtn')}</button>
      <button class="btn-secondary btn-full" id="btn-back-games" onclick="showPage('app'); switchTab('games');">${t('backToGamesBtn')}</button>
    `;
  }

  // Session Debrief (detailed reaction time & comparison analysis)
  buildSessionDebrief();

  showPage("result-screen");
  renderPerformanceOverview();
  renderProfileBadge();
  renderWeeklyReport();
  updateHeaderBadges();

  // Knowledge quiz every 3 games (not in fit test mode)
  if (!state.isFitTestMode) {
    maybeShowKnowledgeQuiz();
  }
}


function playAgain() {
  if (state.currentGame) launchGame(state.currentGame.id);
}

// ===================================================
// STATS CHART
// ===================================================
function renderStatsChart() {
  const canvas = document.getElementById("stats-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const pad = 40, cW = W - pad * 2, cH = H - pad * 2;
  const points = [540, 560, 555, 580, 595, 605, state.user.lpi];
  const days = currentLang === 'tr'
    ? ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxV = 720, minV = 500;

  // Grid
  for (let i = 0; i <= 4; i++) {
    const y = pad + (cH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y);
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = "rgba(240,244,255,0.3)"; ctx.font = "11px Inter,sans-serif"; ctx.textAlign = "right";
    ctx.fillText(Math.round(maxV - (maxV - minV) * (i / 4)), pad - 6, y + 4);
  }

  const coords = points.map((v, i) => ({
    x: pad + (cW / (points.length - 1)) * i,
    y: pad + cH - ((v - minV) / (maxV - minV)) * cH,
    v, day: days[i]
  }));

  // Area fill
  const areaGrad = ctx.createLinearGradient(0, pad, 0, pad + cH);
  areaGrad.addColorStop(0, "rgba(0,242,254,0.18)");
  areaGrad.addColorStop(1, "rgba(0,242,254,0.01)");
  ctx.beginPath();
  coords.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
  ctx.lineTo(coords[coords.length-1].x, pad + cH);
  ctx.lineTo(coords[0].x, pad + cH);
  ctx.closePath();
  ctx.fillStyle = areaGrad; ctx.fill();

  // Line
  const lineGrad = ctx.createLinearGradient(pad, 0, W - pad, 0);
  lineGrad.addColorStop(0, "#00F2FE"); lineGrad.addColorStop(1, "#3B82F6");
  ctx.beginPath();
  coords.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
  ctx.strokeStyle = lineGrad; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();

  // Dots + labels
  coords.forEach(pt => {
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI*2);
    ctx.fillStyle = "#00F2FE"; ctx.fill();
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI*2);
    ctx.fillStyle = "#0F1729"; ctx.fill();
    ctx.fillStyle = "rgba(240,244,255,0.45)"; ctx.font = "11px Inter,sans-serif"; ctx.textAlign = "center";
    ctx.fillText(pt.day, pt.x, H - 10);
  });

  // Update counters
  const tg = document.getElementById("total-games-played");
  const td = document.getElementById("total-days");
  const bc = document.getElementById("best-category");
  const bpiNum = document.getElementById("bpi-number");
  if (tg) tg.textContent = state.user.gamesPlayed;
  if (td) td.textContent = state.user.daysActive;
  if (bpiNum) bpiNum.textContent = state.user.lpi;
  if (bc) {
    const best = Object.keys(state.user.categoryScores).reduce((a,b) =>
      state.user.categoryScores[a] > state.user.categoryScores[b] ? a : b);
    const catNames = {
      memory: currentLang === 'tr' ? 'Hafıza' : 'Memory',
      attention: currentLang === 'tr' ? 'Dikkat' : 'Attention',
      speed: currentLang === 'tr' ? 'İşlem Hızı' : 'Speed',
      flexibility: currentLang === 'tr' ? 'Esneklik' : 'Flexibility',
      'problem-solving': currentLang === 'tr' ? 'Problem Çözme' : 'Problem Solving'
    };
    bc.textContent = catNames[best] || best;
  }

  // Update BPI arc
  const bpiArc = document.getElementById('bpi-arc');
  if (bpiArc) {
    const circumference = 377;
    const offset = circumference - (Math.min(1000, state.user.lpi) / 1000) * circumference;
    bpiArc.style.strokeDashoffset = offset;
    bpiArc.style.transition = 'stroke-dashoffset 1s ease';
  }
}
