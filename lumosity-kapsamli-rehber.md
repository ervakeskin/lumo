# Lumosity Web Demo — Kapsamlı Ürün, Oyun ve Teknik Rehber

> Bu doküman, hiç Lumosity duymamış birinin projeyi tam olarak anlayabilmesi **ve** bir yapay zeka aracının bunu doğrudan koda dökebilmesi için hazırlanmıştır. Tek dosyada: ürün araştırması, oyun/quiz mekanikleri, gerçek kullanıcı geri bildirim analizi, bizim eklediğimiz özgün fark, ve katı teknik/kalite standartları var. **Hedef kitle: yetişkinler.** Hiçbir bölüm "çocuk uygulaması" seviyesinde olmamalı — hem görsel hem mekanik olarak profesyonel bir ürün hissi verilmeli.

---

## 1. Lumosity Nedir? (Sıfırdan Anlatım)

Lumosity, 2007'de nörobilimci **Michael Scanlon** ve ekibi tarafından kurulan **Lumos Labs** şirketinin ürettiği bir **bilişsel (zihinsel) antrenman platformu**dur. Web, iOS ve Android üzerinden çalışır. Temel fikir şudur: vücudu spor salonunda antrenman yaptırır gibi, kısa ve oyunlaştırılmış zihinsel görevlerle **hafıza, dikkat, işlem hızı, zihinsel esneklik ve problem çözme** becerilerini düzenli olarak "antrene etmek."

- **100 milyon+** kullanıcıya ulaştığını iddia ediyor (dünya genelinde)
- **40+ mini oyun**dan oluşan bir kütüphanesi var
- **Freemium** model: ücretsiz sınırlı erişim + aylık/yıllık premium abonelik (~$12/ay veya ~$60/yıl seviyelerinde, zamanla değişmiş)
- Kendini "eğlenceli ve renkli" bir deneyim olarak konumlandırıyor — bu yönüyle daha "klinik" hissettiren rakibi **BrainHQ**'dan ayrışıyor

**Neden popüler oldu?** Çünkü "akıllı olmak" gibi soyut bir hedefi, günde 5-10 dakikalık, oyun gibi hissettiren küçük görevlere indirgedi. Fitness takip uygulamalarının (Fitbit vb.) "quantified self" (kendini ölçme) trendinin zihinsel karşılığı gibi düşünülebilir.

---

## 2. Kullanıcı Yolculuğu — Uçtan Uca Akış

### 2.1 Onboarding: "Fit Test" (Çok Önemli — Ürünün Kalbi)

Lumosity'nin en akıllıca tasarım kararı budur: yeni kullanıcıya sıkıcı bir "hoş geldin turu" göstermek yerine, doğrudan **10 dakikalık bir değerlendirme testine** sokuyor. Bu iki işi birden yapıyor:
1. Kullanıcının başlangıç ("baseline") skorlarını ölçüyor
2. Kullanıcıyı daha ilk dakikada gerçek bir oyun deneyimine sokup "yatırım" (sunk cost) hissi yaratıyor

**Fit Test akışı:**
1. Birkaç **kişiselleştirme sorusu** ile başlar — evet/hayır veya çoktan seçmeli: *"İsimleri hatırlamakta zorlanır mısın?"*, *"Aynı anda birden fazla fikri takip edebiliyor musun?"*, *"Stres altında daha iyi kararlar vermek ister misin?"* gibi. Bu cevaplar, sonraki günlük programın hangi beceri kategorilerine ağırlık vereceğini belirliyor.
2. Ardından **3-4 kısa mini oyun** art arda oynatılıyor (tam versiyon değil, kısaltılmış "assessment" versiyonu).
3. Test bitince bir **skor ekranı** geliyor: kullanıcının yaş grubuna göre yüzdelik dilimi, kategori bazlı güçlü/zayıf yön grafiği.
4. Hemen ardından bir **paywall** (14 günlük ücretsiz deneme + "En Popüler" olarak işaretlenmiş yıllık plan) gösteriliyor. Kritik nokta: parayı, kullanıcı zaten zaman/emek yatırdıktan **sonra** istiyor — "önce değeri kanıtla, sonra dönüşüm iste" stratejisi.

### 2.2 Günlük Antrenman (Daily Workout)

- Ana ekranda kullanıcıya özel seçilmiş **3-5 oyunluk bir set** öneriliyor ("Bugünün Antrenmanı" butonu).
- Kullanıcı isterse kategoriye göre (Hafıza/Dikkat/Hız/Esneklik/Problem Çözme/Matematik/Dil) doğrudan oyun seçip serbest oynayabiliyor.
- Ücretsiz kullanıcı günde sınırlı sayıda oyun oynayabiliyor, set her gün **rotasyona** giriyor (yani her gün farklı oyunlar sunulur — ama gerçek kullanıcı yorumlarında bu rotasyonun yeterince çeşitli hissettirmediği en büyük şikayetlerden biri, bkz. Bölüm 6).

### 2.3 İstatistikler / Insights Paneli

- Her oyun sonunda bireysel skor + geçmişe göre karşılaştırma
- **Lumosity Performance Index (LPI)** benzeri toplam bir "genel skor" — tüm oyun skorlarının birleşimi
- Kategori bazlı radar/örümcek grafiği (5 beceri ekseni)
- Zaman içindeki gelişim eğrisi (haftalık/aylık)

### 2.4 Fiyatlandırma
Aylık ve yıllık abonelik seçenekleri var (fiyat zamanla değişmiş, genelde aylık $12 - $15, yıllık $60 - $90 aralığında konumlanmış). Ömür boyu tek seferlik paket de sunulmuş dönemler olmuş. **Bu, kullanıcı şikayetlerinin en büyük kaynağı — Bölüm 6 ve 7'de detaylı ele alınıyor.**

---

## 3. Bilimsel Arka Plan ve Eleştiriler (Bilinmesi Şart)

2016 yılında ABD **Federal Ticaret Komisyonu (FTC)**, Lumosity'yi **yanıltıcı reklamcılık** nedeniyle dava etti; şirket **2 milyon dolar** ödeyerek anlaştı. İddialar:
- Lumosity'nin okul/iş/spor performansını artırdığı, demans ve Alzheimer'a karşı koruduğu gibi iddiaların **bilimsel olarak kanıtlanmadığı**
- Sitede kullanılan kullanıcı yorumlarının aslında **ödüllü bir yarışma** (iPad, ömür boyu üyelik gibi ödüller) karşılığında toplandığının gizlenmesi

**Bunun projemiz için anlamı:** Abartılı "bilişsel yeteneğini kalıcı olarak artırır" gibi tıbbi iddialar kullanma. Bunun yerine dürüst bir çerçeve kullan: *"Bu oyunlar belirli bilişsel becerileri (dikkat, hafıza, işlem hızı) hedefler ve düzenli pratik genel olarak bu görevlerdeki performansını artırabilir."* Bu hem etik olarak daha doğru hem de Bölüm 7'deki "şeffaflık" farkımızla doğrudan bağlantılı.

---

## 4. Mini Oyunlar — Kategori Bazlı Detaylı Analiz

> **Kritik kural:** Aşağıdaki oyunların hepsi **yetişkin seviyesinde** olmalı. Emoji tabanlı, tek round'luk, statik zorluklu "okul ödevi" hissi veren versiyonlar kabul edilemez. Her oyunun tam teknik gereksinimi aşağıda.

### 🧠 Hafıza (Memory)

**Memory Matrix** — Izgarada bazı kareler kısaca yanıp sönüyor, kullanıcı hangilerinin yandığını hatırlayıp tıklıyor. Grid 3x3'ten başlayıp performansa göre 7x7'ye kadar büyüyor.

**Familiar Faces** — Garson rolünde, müşterilerin yüz+isim+sipariş kombinasyonunu hatırlayıp doğru servis etmen gerekiyor (epizodik hafıza).

**Tidal Treasures** — Ekranda beliren deniz objelerinden her seferinde **daha önce seçilmemiş** birini seçiyorsun; obje sayısı ve görsel benzerlik arttıkça zorlaşıyor.

**Memory Match (N-back)** — Akan sembol dizisinde mevcut sembol N adım önce gösterilenle aynı mı diye karar veriyorsun. Gerçek bilişsel bilimde kullanılan "adaptive n-back" paradigmasıdır — doğru uygulanırsa en akademik ciddiyete sahip oyun budur.

**Pinball Recall** — Top atılmadan önce tahtadaki tampon konumlarını ezberliyorsun, sonra gerçek fizik kurallarına göre oynuyorsun.

### 🎯 Dikkat (Attention)

**Lost in Migration** — Klasik **flanker task**: ortadaki kuşun yönünü, etrafındaki "distraktör" kuşlar aynı veya ters yöne bakarken doğru tespit ediyorsun. Gerçek bir bilişsel psikoloji deneyi paradigmasıdır.

**Splitting Seeds** — Bir tohum yığınını saymadan, göz kararıyla iki eşit parçaya bölüyorsun (subitizing — hızlı miktar tahmini).

**Penguin Pursuit** — Labirentte rakip penguenden önce balığa ulaşmak için hız + mekansal yönelim gerektiriyor.

### ⚡ Hız (Speed)

**Speed Match** — Akan sembollerde mevcut sembol bir öncekiyle aynı mı diye mümkün olan en hızlı şekilde karar veriyorsun. En "akıcı/bağımlılık yapan" tempoya sahip oyunlardan biri.

**Train of Thought** — Trenleri doğru istasyona hızlıca yönlendirmen gerekiyor; ray değiştirme + zaman baskısı.

### 🔄 Esneklik (Flexibility)

**Disillusion** — Bir formu sembolüne veya rengine göre eşleştiriyorsun; hangi kritere göre eşleşeceğini hedefin yönü belirliyor (kural sürekli değişiyor — kognitif esneklik testi).

**Ebb and Flow** — Yeşil yapraklar için "baktıkları yön", turuncu yapraklar için "hareket yönü" soruluyor — klasik bir **task-switching** paradigması.

**Color Match / Brain Shift** — Stroop etkisi tarzı: renk-kelime çatışması + konum bazlı kural değişimi (sayı/harf ayrımı).

### 🧩 Problem Çözme

**Pirate Passage** — Gemiyi hazineye çarpışmadan yönlendirme; grid tabanlı planlama bulmacası.

**Chalkboard Challenge** — Mantık/örüntü problemleri çözme odaklı.

### 🔢 Matematik & 🗣️ Dil

**Raindrops** — Düşen yağmur damlalarındaki aritmetik işlemleri damla yere değmeden çözüyorsun.

**Word Bubbles** — Verilen bir kökle başlayan olabildiğince çok kelime üretiyorsun, süre sınırlı (sözel akıcılık testi).

---

## 5. Quiz / Değerlendirme Sistemi (Detaylı — Bu Bölüm Kritik)

Kullanıcı "quiz" dediğinde Lumosity'de bu karşılığa geliyor — ayrı bir "trivia quiz" değil, **oyun-tabanlı değerlendirme** sistemi. Biz bunu hem koruyup hem de genişleteceğiz:

### 5.1 Onboarding Kişiselleştirme Anketi
Fit Test öncesi 6-8 soruluk, tek seçimli/çoklu seçimli bir anket:
- *"Hangi alanda kendini geliştirmek istiyorsun?"* (isim hatırlama / odaklanma / karar verme hızı / matematik refleksi vb. — çoklu seçim)
- *"Günde ne kadar zaman ayırabilirsin?"* (5dk / 10dk / 15dk+)
- *"Hangi saatlerde daha zinde hissediyorsun?"* (sabah/öğlen/akşam — bildirim zamanlaması için)

Bu cevaplar, günlük oyun setinin ağırlığını belirleyen bir **skorlama vektörüne** dönüşmeli (örn. her kategoriye 0-1 arası bir "ilgi ağırlığı" ataması).

### 5.2 Fit Test (Baseline Değerlendirme)
- 3-4 mini oyunun **kısaltılmış** (assessment) versiyonu art arda oynatılır (her biri ~90 saniye)
- Sonunda: yaş grubuna göre yüzdelik dilim + kategori bazlı radar grafiği
- **Teknik not:** Bu skor, sonraki her günlük antrenumun zorluk başlangıç noktasını belirlemeli (cold-start problemi çözümü — yeni kullanıcı sıfırdan başlamak yerine gerçek seviyesinden başlar)

### 5.3 Periyodik Yeniden Değerlendirme
Her 30 günde bir (veya X oturumda bir), kullanıcıya otomatik olarak kısa bir "yeniden test" sunulmalı — Fit Test'in aynısı tekrar oynatılır ve **ilk sonuçla karşılaştırmalı** bir gelişim raporu gösterilir. Lumosity'de bu zayıf bir noktadır (kullanıcılar "gerçekten gelişiyor muyum bilmiyorum" diye şikayet ediyor) — biz bunu güçlü ve görünür yapacağız.

### 5.4 Bilgi Quizleri (ÖZGÜN EKLEME)
Oyunlar arasında ara sıra (örn. her 3 oyunda bir) kısa, **çoktan seçmeli bilgi quiz kartı** çıkar: *"Az önce oynadığın oyun beynin hangi bölgesini/becerisini hedefliyor, biliyor musun?"* Doğru/yanlış cevap sonrası kısa, kaynak destekli bir açıklama gösterilir (gerçek araştırmaya referans, abartısız dil). Bu, Bölüm 3'teki "şeffaflık" sorununa doğrudan çözüm ve Lumosity'de **olmayan** bir özellik.

---

## 6. Gerçek Kullanıcı Geri Bildirim Analizi (49.703 Yorum, 2014–2026)

**Puan dağılımı:** ★5 %65.6 · ★4 %16.9 · ★3 %5.9 · ★2 %3.3 · ★1 %8.3

| # | Tema | Mention | Özet |
|---|------|---------|------|
| 1 | Abonelik/ödeme | ~4.200 | Çift çekim, iptal edememe, şeffaf olmayan fiyatlandırma |
| 2 | Premium kilit / kısıtlı ücretsiz | ~2.400 | Zamanla daralan ücretsiz erişim |
| 3 | Oyun çeşitliliği/tekrarı | ~1.770 | Aynı oyunlar tekrar geliyor, kişiselleştirme yetersiz |
| 4 | Giriş/hesap sorunları | ~1.460 | Login hataları, hesap eşleştirme sorunları |
| 5 | Crash/teknik hata | ~530 | Belirli oyunlarda tekrarlayan çökme |

**Güçlü yönler (korunmalı):** "Eğlenceli" en sık geçen olumlu tema (6.618 mention); reklamsız ücretsiz sürüm net bir farklılaştırıcı olarak övülüyor; kullanıcılar gerçek odak/hafıza faydası hissettiğini belirtiyor.

---

## 7. Bizim Farkımız — Lumosity'de Eksik Olan Şey

Geri bildirim analizinde ve piyasa araştırmasında ortaya çıkan net bir boşluk var: **Lumosity tamamen tek kişilik (solo) bir deneyim.** Hiçbir sosyal/rekabetçi katman yok — oysa davranış bilimi, sosyal hesap verebilirliğin (accountability) alışkanlık oluşturmada tek kişilik ilerleme takibinden çok daha güçlü olduğunu gösteriyor. Ayrıca Bölüm 6'daki en büyük şikayet olan "şeffaf olmayan abonelik" sorunu da çözülmemiş durumda.

### Önerilen Özgün Özellik: **Beyin Düellosu (Brain Duel) — Gerçek Zamanlı 1v1 Mod**

- İki kullanıcı aynı anda, aynı mini oyunun (örn. Speed Match veya Lost in Migration) **gerçek zamanlı** bir versiyonunu oynar
- Skor tablosu canlı güncellenir, kazanan anlık belirlenir
- Haftalık "Dostlar Arası Lig" — arkadaş listesiyle skor kıyaslama (Lumosity'de yok)
- Teknik altyapı: WebSocket (Socket.io) ile iki oyuncu arasında senkron round başlatma, sunucu taraflı zaman damgası ile hile önleme

### İkinci Fark: Radikal Şeffaflık
- Tek tıkla iptal edilebilen, gizli koşul içermeyen abonelik ekranı (Bölüm 6'daki #1 şikayete doğrudan cevap)
- Her oyunun yanında, hangi bilişsel beceriyi neden hedeflediğine dair kısa, kaynaklı bir açıklama (Bölüm 5.4 ile bağlantılı, abartılı sağlık iddiası **yok**)

Bu iki fark, "diğer yapay zekaya" verdiğinde şu cümleyle özetlenebilir: *"Lumosity'nin çözemediği iki büyük problemi (sosyal motivasyon eksikliği + şeffaf olmayan abonelik) çözen bir versiyon inşa ediyoruz."*

---

## 8. Teknik Mimari ve Kalite Standartları (Zorunlu — Atlanamaz)

### 8.1 Neden Sonuçlar "İlkokul Seviyesi" Çıkar — Yasaklı Kısayollar
1. **Statik zorluk** (sabit sayı/süre, hiç değişmiyor) → YASAK, her oyunda matematiksel adaptif zorluk formülü olmalı
2. **`transition: all 0.3s` ile düz animasyon** → YASAK, spring/bounce easing (Framer Motion/GSAP) kullan
3. **Sadece doğru/yanlış göstermek** → YASAK, ms hassasiyetinde tepki süresi ölç ve oturum sonunda görselleştir
4. **Emoji/clipart görseller** → YASAK, tutarlı SVG/Canvas görsel dili kullan
5. **Tek round'luk kısa oyun** → YASAK, en az 3 dakikalık, çok round'lu oturum
6. **Beyaz arka plan + sistem fontu** → YASAK, aşağıdaki görsel kimliği uygula

### 8.2 Görsel Kimlik
- Arka plan: koyu lacivert/mor gradient (`#0F1729` → `#1A2340`)
- Vurgu: bir sıcak (turuncu/mercan) + bir soğuk (turkuaz/mor) ton
- Tipografi: yuvarlak modern sans-serif (Inter/Poppins/Manrope)
- Kart stili: 12-20px radius, glassmorphism (`backdrop-filter: blur`)
- Mikro-etkileşim: doğru cevapta 150-250ms "pop" + renk flaşı; yanlışta hafif shake

### 8.3 Navigasyon — Geri Tuşu Zorunluluğu
Bu proje bir **SPA (Single Page Application)** olarak kurgulanacaksa, tarayıcı **geri/ileri tuşları mutlaka doğru çalışmalı**:
- React Router / Next.js routing kullan, `history.pushState` manuel hackleme yapma
- Her oyun/ekran kendi URL'ine sahip olmalı (`/oyunlar/memory-matrix`, `/fit-test/sonuc` gibi)
- Bir oyun ortasındayken geri tuşuna basılırsa, oyun state'i kaybolmadan bir "oyundan çıkmak istediğine emin misin?" onay diyaloğu çıkmalı — sessizce state kaybı **YASAK**
- Mobil için: uygulama içi bir "Geri" butonu da her ekranın sol üstünde tutarlı biçimde bulunmalı, sadece tarayıcı geri tuşuna güvenme

### 8.4 Flagship Oyunlar İçin Ek Teknik Derinlik

**Memory Matrix — Adaptif Formül:**
```
Son round %100 doğruysa: K += 1 (kare sayısı)
1 hata: K sabit
2+ hata: K -= 1 (min 3)
Her 3 K artışında grid +1 büyür (3x3 → 7x7 max)
Yanma süresi: max(600ms, 1200ms - round*15ms)
```

**Lost in Migration — Adaptif Formül:**
```
Trial süresi = max(700ms, 2000ms - doğru_streak*40ms)
Doğruluk %90 üzeriyse incongruent oran %65'e çıkar
Congruent/incongruent trial'larda ayrı ortalama tepki süresi raporla (gerçek "flanker effect" metriği)
```

**Speed Match — Adaptif Formül:**
```
Gösterim aralığı = max(500ms, 1500ms - doğru_streak*30ms)
Match oranı %35-45 arası sabit tutulur
60 saniyelik round'lar
```

**Raindrops — Adaptif Formül:**
```
Düşme süresi = max(3s, 8s - round*0.2s)
round 1-5: tek basamaklı toplama/çıkarma
round 6-15: iki basamaklı + tek basamaklı çarpma
round 16+: iki basamaklı çarpma/bölme
Eşzamanlı damla: 1 → 2 (round 9+) → 3 (round 20+)
```

### 8.5 Ortak Oturum Sonu Ekranı (Her Oyun İçin Zorunlu)
- Animasyonlu, 0'dan gerçek değere sayan skor
- Tepki süresi histogramı veya round bazlı doğruluk grafiği
- "Önceki en iyi skorunla kıyasla" kutusu
- Gerçek hesaplanmış performans yorumu (şablon sabit metin değil — örn. "Tepki sürende %12 iyileşme")
- "Tekrar Oyna" + "Diğer Oyunlar" CTA butonları

---

## 9. Uygulama Yol Haritası (Öncelik Sırası)

1. Görsel kimlik + routing/navigasyon altyapısını kur (geri tuşu dahil)
2. Onboarding anketi + Fit Test akışını bitir
3. Flagship 4 oyunu tam kalitede tamamla: **Memory Matrix → Speed Match → Lost in Migration → Raindrops**
4. Ortak oturum sonu ekranını tüm oyunlara bağla
5. Şeffaf abonelik/paywall ekranını kur
6. Bilgi quizlerini oyun akışına entegre et
7. (Zaman kalırsa) Beyin Düellosu — gerçek zamanlı 1v1 modu ekle

---

### Diğer Yapay Zekaya Vereceğin Tek Cümlelik Özet
> "Bu dosyadaki her kural zorunludur; özellikle Bölüm 8'deki yasaklı kısayolları kullanma. Sonuç, ilkokul ödevi değil, yetişkinler için gerçek bir SaaS ürünü gibi hissettirmeli."
