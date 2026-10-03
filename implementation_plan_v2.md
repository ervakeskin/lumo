# Lumo — Yeni Uygulama Planı (v2)

> Önceki plan (`Downloads/implementation_plan.md`) yerine geçer. Hazırlanırken kodun gerçek durumu (`js/app.js`, `index.html`, `css/style.css`) ve tüm md dosyaları okundu: `lumosity-kapsamli-rehber.md`, `lumosity-mini-oyunlar-analizi.md`, `lumosity-web-demo-brief.md` (3 kopya, birebir aynı) ve `lumosity-feedbacks.md` (49.7 bin yorum, 10 MB; analizi rehberde özetli). `proje_ozeti_gemini_icin.md` başka bir projeye (YKS/TikZ) ait, kapsam dışı.

---

## 0. Önceki Plan Neden Yetersizdi (Doğrulanmış Bulgular)

| # | Önceki planın iddiası / eksiği | Gerçek durum |
|---|---|---|
| 1 | "P0: `launchGame` tanımlı değil" | **Eskimiş.** `launchGame` `app.js:1511`'de var, `node --check` temiz. Tarayıcıda uçtan uca doğrulama yine de Faz 0'da yapılacak. |
| 2 | Fit Test = 3 oyun, sonuç = **5 eksenli radar** | Matematiksel olarak tutarsız: 3 oyun 5 beceriyi ölçemez. Rehber 3-4 oyun der; biz 5 kısa değerlendirme kullanacağız (her kategori bir oyun). |
| 3 | Routing / geri tuşu hiç yok | Rehber §8.3 **zorunlu** kılıyor. Kodda `pushState/popstate` **0** kez geçiyor; ekranlar sadece `showPage()` ile değişiyor. Geri tuşu uygulamayı terk ettirir, oyun state'i sessizce kaybolur. |
| 4 | Adaptif zorluk formülleri yok | Rehber §8.4 dört flagship oyun için formül veriyor. Kodda kısmi (`Math.max(3000, 8000 - round*200)` gibi) ama Memory Matrix K/grid kuralı, Flanker congruent/incongruent ayrı RT, Speed Match match-oranı sabitleme yok. |
| 5 | Brain Duel (rehber §7, projenin **özgün farkı**) planda yok | Eklenmedi → "özgünlük" hedefi boşta. |
| 6 | Şeffaf abonelik (şikayet #1, ~4.200 mention) planda yok | Landing/profilde paywall var ama şeffaflık kriterleri tanımlı değil. |
| 7 | 30 günlük yeniden değerlendirme (rehber §5.3) yok | Lumosity'nin en zayıf noktası ("gerçekten gelişiyor muyum?") — bizim en büyük fırsatımız. |
| 8 | Oyunlar "juice" ile parlatılacak deniyor, **ölçülebilir kalite çıtası** yok | "Lumosity+" öznel. Aşağıda Definition of Done ile ölçülebilir hale getirildi. |
| 9 | Kod mimarisi hiç ele alınmadı | Tek dosya 3.600 satır `app.js`, global state, 20 oyun eklenirse yönetilemez. |
| 10 | Rehberin "yasaklı kısayolları" (§8.1) kontrol edilmedi | Kodda hâlâ emoji UI (`💧`, `🔥`, `⚡`), tek round mantığı ve `transition: all` olasılığı var → temizlenecek. |
| 11 | Oyun listesi karışık (Word Shift, Motion Velocity, Rapid Calculation gibi kaynaklarda olmayan/belirsiz oyunlar; Familiar Faces, Splitting Seeds, Ebb and Flow, Word Bubbles eksik) | Liste rehber + analiz dokümanındaki gerçek paradigmalarla yeniden kuruldu (Bölüm 4). Dil kategorisi (Türkçe kelime oyunu) yoktu. |

---

## 1. Ürün Hedefi — "Aynı Kalite, Özgün, Daha İyi"

**Aynı kalite:** akıcı 60 fps, bilimsel paradigmalar (flanker, n-back, Stroop, task-switching), ms hassasiyetli ölçüm, günlük antrenman + Fit Test + LPI + radar.

**Özgün (Lumosity'de olmayan):**
1. **Brain Duel** — 1v1 rekabet + arkadaş ligi (Lumosity tamamen solo).
2. **Radikal şeffaflık** — tek tıkla iptal, gizli koşul yok; her oyunda kaynaklı "ne ölçüyor" açıklaması, sağlık iddiası yok.
3. **Kanıtlanabilir gelişim** — 30 günde bir Fit Test tekrarı, ilk sonuçla yan yana karşılaştırma (etki büyüklüğü + güven aralığı ile, abartısız).
4. **Kendi setini seç** — günlük antrenmanda oyun değiştirme/sabitleme (şikayet #3 ve "ilgilenmediğim beceriyi değiştiremiyorum" yorumları).
5. **Türkçe-öncelikli** — Türkçe kelime oyunu, TR/EN çift dil, Türkçe bilimsel açıklamalar.
6. **Bilgi kartları** — oyunlar arası kaynaklı mini quiz (zaten kodda `KNOWLEDGE_QUIZZES` var, geliştirilecek).
7. **Erişilebilirlik & rahatlık** — koyu tema varsayılan, renk körü dostu palet, `prefers-reduced-motion`, tam klavye kullanımı, oturum süresi seçimi (5/10/15 dk), veri dışa aktarma, offline/PWA.

**Daha iyi (şikayet → çözüm):**

| Lumosity şikayeti | Mention | Bizim çözüm |
|---|---|---|
| Abonelik/çift çekim/iptal edememe | ~4.200 | Tek fiyat, tek ekran, "İptal Et" ilk seviyede buton, deneme bitiş tarihi açık yazılı |
| Premium kilit, daralan ücretsiz erişim | ~2.400 | Ücretsiz katmanın kapsamı **sabit ve yazılı**: 14 oyun ücretsiz, 6 premium; ücretsiz kapsam sonradan daraltılmaz (ürün sözü olarak sayfada) |
| Tekrarlayan oyunlar / kişiselleştirme yok | ~1.770 | Rotasyon algoritması (son 3 günde oynananı geriye atar), "neden bugün bu oyun" açıklaması, oyun takası |
| Giriş/hesap sorunları | ~1.460 | Tek yöntem (e-posta, sihirli bağlantı ya da yerel profil); demo aşamasında yerel profil |
| Crash/teknik hata | ~530 | Her oyun `destroy()` ile temizlenir, zaman/RAF sızıntısı yok, otomatik smoke test |
| Dark mode, offline, tutorial belirsizliği | küçük | Dark mode varsayılan, PWA, her oyunda aynı formatta 3 adımlı animasyonlu tutorial |

---

## 2. Mimari (Kod Sağlığı Önce Gelir)

**Karar (önerim): Vanilla ES Modules + küçük kendi router'ı, derleme adımı yok (Vite opsiyonel).**
Gerekçe: mevcut 3.600 satırlık vanilla kod korunur, yeniden yazma riski yok. Rehber React Router önerse de asıl gereksinim *"her ekran kendi URL'i + geri tuşu doğru çalışsın"* — History API ile karşılanır. (Bu bir karar noktası: React/Next istersen Faz 1 değişir, Bölüm 8'e bak.)

```
lumo/
  index.html
  css/  tokens.css · base.css · components.css · games/*.css
  js/
    main.js                  # bootstrap
    core/
      router.js              # History API: /, /giris, /fit-test, /oyunlar, /oyun/:id, /sonuc, /istatistik, /profil, /fiyat, /duello
      state.js               # tek store + şema versiyonlu localStorage (migrate)
      i18n.js  audio.js  particles.js  storage.js  rng.js (seeded PRNG)
      adaptive.js            # saf fonksiyonlar: staircase, formüller  ← unit test'li
      metrics.js             # RT log, doğruluk, flanker etkisi, yüzdelik, LPI
    engine/
      GameBase.js            # yaşam döngüsü: init → tutorial → countdown → run → pause → end → destroy
      Hud.js  ResultScreen.js  Tutorial.js  ExitGuard.js
    games/  memory-matrix.js  speed-match.js  ... (her oyun = 1 modül, GameBase'den türer)
    features/ onboarding.js fittest.js retest.js dashboard.js workout.js pricing.js quizzes.js duel/
  sw.js  manifest.webmanifest
  tests/  adaptive.test.js  smoke.spec.js (Playwright)
```

**Oyun sözleşmesi (`GameBase`):** her oyun şunları sağlar: `meta` (id, kategori, TR/EN metin, kaynaklı insight), `createTrial(difficulty, rng)`, `evaluate(input)`, `difficultyUpdate(history)`, `render()`, `destroy()`. Yeni oyun eklemek = 1 dosya + 1 kayıt satırı. Zamanlayıcı/RAF/klavye dinleyicileri yalnızca `GameBase` üzerinden açılır → `destroy()` hepsini otomatik kapatır (mevcut `clearAllGameTimers` dağınıklığı biter).

**Router kuralları:** oyun sırasında geri tuşu → "Oyundan çıkılsın mı?" diyaloğu (state kaybı yok); her ekranda sol üstte uygulama içi Geri butonu; derin bağlantı (`/oyun/memory-matrix`) doğrudan açılır.

---

## 3. Kalite Çıtası — Her Oyun İçin Definition of Done

Bir oyun aşağıdakilerin **tamamı** sağlanmadan "bitti" sayılmaz:

1. **Adaptif zorluk** (saf fonksiyon, unit test'li); statik sabit yok.
2. **ms hassasiyetli RT** kaydı; oturum sonunda dağılım/eğri görselleştirmesi.
3. **Çok round'lu oturum**, hedef ≥ 3 dk (Fit Test sürümü ~75 sn).
4. **Prosedürel içerik** (seeded RNG; aynı seed = tekrarlanabilir → Duel ve testler için şart).
5. **Görsel:** yalnızca SVG/Canvas, emoji yok, tutarlı palet; `transition: all` yok, spring/bounce easing (GSAP/WAAPI); 60 fps (Performance panelinde uzun frame yok).
6. **Juice:** doğru → 150-250 ms pop + parçacık + yükselen perde; yanlış → hafif shake + yumuşak tok ses (cezalandırıcı değil); seviye atlama fanfarı.
7. **Tutorial:** ortak 3 adım formatı, ≥ 1 canlı deneme turu, "Atla" seçeneği.
8. **Erişilebilirlik:** klavye ile tam oynanabilir, `aria-label`'lar, reduced-motion'da animasyonlar sadeleşir, renk tek başına bilgi taşımaz.
9. **Ortak sonuç ekranı:** 0'dan sayan skor, RT histogramı/round doğruluk grafiği, önceki en iyiyle kıyas, **hesaplanmış** yorum ("Tepki süren %12 düştü"), Tekrar Oyna / Diğer Oyunlar.
10. **Yaşam döngüsü güvenliği:** 20 kez üst üste aç-kapat sonrası bellek/dinleyici sızıntısı yok; geri tuşu diyaloğu çalışıyor; duraklatma tüm zamanlayıcıları dondurur.
11. **Çift dil** (TR/EN) ve kaynaklı `insight` metni.

---

## 4. Oyun Kataloğu — 20 Oyun (Gerçek Paradigmalara Dayalı)

Not: mekanikler bilinen bilişsel paradigmalar; **isim, tema ve görsel dil bizim** (Lumosity marka varlıkları/isimleri birebir kopyalanmaz — yeni oyunlara özgün Türkçe/İngilizce adlar veriyoruz, mevcut 8'inin adı çalışma adı olarak kalır ve lansman öncesi yeniden adlandırılır).

| Kategori | # | Oyun (çalışma adı) | Paradigma | Durum |
|---|---|---|---|---|
| 🧠 Hafıza (5) | 1 | Memory Matrix | Görsel-uzamsal çalışan bellek | ✅ var → **yeniden yapılacak (Tier A)** |
| | 2 | Pinball Recall | Çoklu nesne uzamsal hafıza + zihinsel simülasyon (Matter.js) | kilitli → yapılacak |
| | 3 | Tidal Treasures | Tanıma hafızası, interferans (benzer nesneler) | yeni |
| | 4 | Memory Match (n-back) | Adaptif 1-2-3-back çalışma belleği | yeni |
| | 5 | Familiar Faces | Epizodik/ilişkisel hafıza (prosedürel SVG avatar + isim + sipariş) | yeni |
| 🎯 Dikkat (4) | 6 | Lost in Migration | Flanker görevi | ✅ var → **Tier A** |
| | 7 | Train of Thought | Bölünmüş dikkat, çoklu tren + makas | kilitli → yapılacak |
| | 8 | Splitting Seeds | Subitizing / miktar tahmini (tolerans skoru) | yeni |
| | 9 | Star Search | Görsel arama (feature vs conjunction) | yeni |
| ⚡ Hız (2) | 10 | Speed Match | İşlem hızı, "önceki ile aynı mı" | ✅ var → **Tier A** |
| | 11 | Spatial Speed | Zihinsel rotasyon (Shepard-Metzler tarzı) | yeni |
| 🔄 Esneklik (3) | 12 | Color Match | Stroop + kural değişimi | ✅ var → yeniden |
| | 13 | Disillusion | Kural değişimi (renk/sembol/boyut) | yeni |
| | 14 | Ebb and Flow | Task-switching (bakış yönü vs hareket yönü) | yeni |
| 🧩 Problem Çözme (4) | 15 | Chalkboard Challenge | Nicel karşılaştırma / örüntü | ✅ var → yeniden |
| | 16 | Pirate Passage | Grid yol planlama, hamle kısıtı | yeni |
| | 17 | Pattern Logic | Matris akıl yürütme (Raven tarzı, prosedürel) | yeni |
| | 18 | Penguin Pursuit | Prosedürel labirent + A* rakip | yeni |
| 🔢 Matematik (1) | 19 | Raindrops | Aritmetik akıcılık | ✅ var → **Tier A** |
| 🗣️ Dil (1) | 20 | Word Bubbles (TR) | Sözel akıcılık, Türkçe kök→kelime (sözlük doğrulama) | yeni |

Önceki plandan çıkarılanlar: Word Shift, Motion Velocity, Rapid Calculation (kaynaklarda net paradigması yok; Raindrops + Chalkboard matematiği zaten kapsıyor). Spatial Sequence (Corsi) opsiyonel **21. oyun** olarak yedekte.

**Freemium dengesi:** 14 ücretsiz / 6 premium. Ücretsiz set her kategoriden en az 2 oyun içerir; premium'lar "ağır" oyunlar (Pinball, Train, Pirate, Penguin, Familiar Faces, Word Bubbles). Ücretsiz kapsam sayfada yazılı ve sonradan daraltılmaz.

**Tier A adaptif formüller** (rehber §8.4, birebir uygulanacak):

```
Memory Matrix : son round %100 → K+1 | 1 hata → K sabit | 2+ hata → K-1 (min 3)
                her 3 K artışında grid +1 (3x3 → 7x7) | yanma = max(600, 1200 - round*15) ms
Lost in Migr. : trial süresi = max(700, 2000 - streak*40) ms
                doğruluk > %90 ise incongruent oranı %65 | congruent/incongruent RT ayrı → "flanker etkisi" (ms)
Speed Match   : aralık = max(500, 1500 - streak*30) ms | match oranı %35-45 sabit | 60 sn round
Raindrops     : düşme = max(3, 8 - round*0.2) sn | r1-5 tek basamak +/− | r6-15 iki basamak + tek basamak ×
                r16+ iki basamak ×/÷ | eşzamanlı damla 1 → 2 (r9+) → 3 (r20+)
```

---

## 5. Kullanıcı Akışları

**Onboarding (6-8 soru)** → ilgi ağırlık vektörü (kategori başına 0-1) + günlük süre + zinde saat. *(kodda `OB_QUESTIONS` var; vektör çıktısı günlük sete bağlanacak.)*

**Fit Test (~8 dk, 5 kısa oyun):** Memory Matrix → Speed Match → Lost in Migration → Color Match → Chalkboard (her biri ~75 sn, aralarında ara değerlendirme kartı). Sonuç: 5 eksenli radar (her eksen gerçekten ölçülmüş), LPI, yaş grubu yüzdeliği (normlar demo'da simüle edilmiş — arayüzde "örnek norm verisi" diye belirtilir, dürüstlük ilkesi), güçlü/zayıf yön. **Skor, her oyunun başlangıç zorluğunu (cold-start) belirler.**

**Günlük antrenman:** ilgi vektörü + zayıf yön + son 3 gün rotasyonu → 3-5 oyun; kullanıcı oyun değiştirebilir/sabitleyebilir; her oyunun yanında "neden bugün" etiketi.

**30 gün yeniden değerlendirme:** Fit Test tekrarı, ilk sonuçla karşılaştırmalı rapor; küçük örneklemde "kesin gelişim" iddiası yok, dürüst dil.

**İstatistik:** LPI eğrisi (hafta/ay), kategori radarı, RT trendi, streak; **veri dışa aktarma (JSON/CSV)**.

**Fiyat/paywall (şeffaf):** tek plan tablosu, deneme bitiş tarihi, yenileme tutarı, "İptal Et" ilk seviye buton (tek tık + onay), ücretsiz kapsam listesi. Demo olduğu için ödeme entegrasyonu yok; ekranın kendisi ürün sözünü sergiler.

---

## 6. Beyin Düellosu (Özgün Özellik) — Kademeli

Gerçek zamanlı 1v1 gerçek backend ister; riski kademelendiriyoruz:

1. **Duel-0 (backend yok):** aynı `seed` ile oynanan **hayalet düello** — rakibin kaydedilmiş RT/skor akışı ya da meydan okuma linki (`/duello?seed=…&hedef=…`) ile arkadaşınla asenkron kıyas.
2. **Duel-1 (hafif backend):** oda kodu + WebSocket, iki oyuncu aynı seed'de, canlı skor çubuğu.
3. **Duel-2:** sunucu zaman damgasıyla hile önleme, haftalık arkadaş ligi.

Seeded RNG (Faz 1) sayesinde Duel-0 neredeyse bedavaya gelir.

---

## 7. Fazlar ve Kabul Kriterleri

| Faz | İçerik | Bitti sayılma kriteri |
|---|---|---|
| **0 — Doğrulama & Temizlik** | `launchGame` akışını tarayıcıda uçtan uca çalıştır (Fit Test, kart, günlük antrenman, Tekrar Oyna); konsol hatası taraması; emoji UI → SVG; `transition: all` taraması | 6 oyun her giriş noktasından açılıp bitiyor, konsol temiz |
| **1 — Çekirdek** | ES modül bölme, router + geri tuşu/ExitGuard, state şema v3 + migrate, `GameBase`, adaptive.js + unit test, audio/particles/rng, ortak Sonuç ekranı, tasarım token'ları | Geri tuşu tüm ekranlarda doğru; `adaptive.js` testleri yeşil; 1 oyun yeni motora taşındı |
| **2 — 4 Flagship** | Memory Matrix, Speed Match, Lost in Migration, Raindrops tam kalite (DoD 11 madde) | Her biri DoD'yi geçti; 60 fps; 20× aç-kapat sızıntı yok |
| **3 — Akışlar** | Onboarding vektörü, 5 oyunluk Fit Test + radar + LPI, cold-start, günlük set + rotasyon + oyun takası, İstatistik, 30 gün retest | Yeni kullanıcı landing→Fit Test→dashboard'a hatasız iniyor |
| **4 — Şeffaf Fiyat & Bilgi Kartları** | Fiyat ekranı, 14/6 kilit modeli, kaynaklı insight'lar, quiz entegrasyonu | Şeffaflık kontrol listesi (Bölüm 1 tablosu) tam |
| **5 — Kalan Oyunlar** | Mevcut 2 yeniden (Color Match, Chalkboard) + 2 kilitli (Train, Pinball) + 12 yeni; paketler halinde: (a) Hafıza: Tidal, N-back, Familiar; (b) Dikkat/Hız: Splitting Seeds, Star Search, Spatial Speed; (c) Esneklik: Disillusion, Ebb and Flow; (d) Problem/Dil: Pirate, Pattern Logic, Penguin, Word Bubbles | Her paket sonrası DoD + 20 oyunda rotasyon çalışıyor |
| **6 — Brain Duel** | Duel-0 → Duel-1 → Duel-2 | Duel-0 zorunlu; 1-2 backend kararına bağlı |
| **7 — Cila** | PWA/offline, a11y denetimi (klavye, kontrast, reduced-motion), Lighthouse ≥ 90, mobil (375 px) test, Playwright smoke suite | Tüm ekranlar mobil+masaüstünde hatasız |

Sıralama mantığı: altyapı (Faz 1) oyun yazmadan önce gelir — aksi halde 14 yeni oyun eski monolitin üstüne inşa edilip yeniden yazılmak zorunda kalır. Her faz sonunda çalışır, gösterilebilir bir sürüm var.

---

## 8. Kararlar (Onaylandı — 2026-09-30)

1. **Teknoloji: React** (Vite + TypeScript, react-router, zustand, framer-motion, vitest). Bölüm 2'deki vanilla modül yapısı yerine `app/` altında React; eski kod referans olarak `legacy/` altında.
2. **Brain Duel: sadece Duel-0** (backend yok; aynı seed + meydan okuma linki / hayalet skor). Gerçek zamanlı WebSocket kapsam dışı.
3. Oyun adları, hesap sistemi, norm verisi: önerilen varsayılanlar geçerli (özgün adlar lansman öncesi, yerel profil, simüle norm + "örnek veri" etiketi).
4. **Özgünlük** her fazda birinci sınıf kriter: her oyunda kaynaklı insight, "neden bugün bu oyun", oyun takası, seed'li meydan okuma linki, dürüst dil, erişilebilirlik.

## 9. İlerleme

| Faz | Durum |
|---|---|
| 0 Doğrulama | `launchGame` eskiden beri vardı; legacy'ye taşındı, yerine React çekirdeği yazıldı |
| 1 Çekirdek | **Bitti:** router + geri tuşu (her sayfada Geri butonu, oyunda çıkış onayı), zustand store, `adaptive.ts` + `mathgen.ts` (14 unit test yeşil), seed'li rng, Web Audio, `GameShell` (tutorial → gerçek 3-2-1 → oyun → duraklat → sonuç → erken bitirme), ortak Sonuç ekranı (sayaç, doğruluk eğrisi, RT histogramı, hesaplanmış yorum, flanker etkisi) |
| UI / Auth | **Bitti:** yeni tasarım sistemi, Landing, Panel, Profil, giriş/kayıt (yerel demo hesap, PBKDF2), misafir modu |
| 2 Flagship | **Bitti (4/4) + Color Match ve Chalkboard (Fit Test için öne alındı):** Memory Matrix, Speed Match (renk/şekil kural değişimi, 3 seviye, cömert başlayıp azalan süre — rehberdeki `1500-streak*30` formülünden bilinçli sapma), Lost in Migration v2 (flanker; kuş/balık/uçak temaları, 2→4 yön, 5→9 kişilik sürü, nötr denemeler, parlamayan lider; congruent/incongruent RT ayrı), Raindrops (3 kademe, su seviyesi, sayı tuş takımı) |
| 3 Akışlar | **Büyük ölçüde bitti:** onboarding anketi (ilgi vektörü) → 5 oyunluk Fit Test (Memory Matrix, Lost in Migration, Speed Match, Color Match, Chalkboard) → radar + Lumo Endeksi + önceki testle karşılaştırma; günlük antrenman (ilgi + zayıf yön + rotasyon, "değiştir" ile oyun takası); 30 gün yeniden test uyarısı; Fit Test her zaman standart seviyeden başlar. **Kalan:** istatistik sayfası (zaman içinde gelişim eğrileri), oyun içi çapraz-oturum cold-start ayarı |
| 4 Şeffaf fiyat & bilgi kartları | **Kısmen:** şeffaf fiyat sayfası var; kaynaklı insight metinleri ve oyunlar arası bilgi quizleri **bekliyor** |
| 5 Kalan oyunlar | **Bitti: 20/20 oyun oynanabilir.** Bu turda 14 oyun eklendi (Tidal Treasures, Memory Match n-back, Familiar Faces, Splitting Seeds, Star Search, Spatial Speed, Disillusion, Ebb and Flow, Pirate Passage, Pattern Logic, Penguin Pursuit, Word Bubbles, Train of Thought, Pinball Recall). Saf mantık `core/*.ts` içinde, 51 unit test |
| Giriş akışı | **Bitti:** istediğin oyunla başlama (ana sayfa vitrini karışık sırada + "Beni şaşırt"), ilk oyundan sonra kayıt/giriş penceresi (bir kez; hesap yoksa 4. oyunda bir kez daha) |
| 6 Brain Duel (Duel-0) | Bekliyor |
| 7 Cila | Bekliyor: PWA, erişilebilirlik denetimi, gerçek cihazda akıcılık, Word Bubbles sözlüğünü genişletme, istatistik sayfası |

Çalıştırma: `cd app && npm run dev` · Test: `npm test` · Build: `npm run build`.
