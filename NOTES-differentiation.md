# Lumo — Lumosity'den farklılaşma notları

Kaynak: Lumosity'nin Play Store yorumları (~155 bin satırlık yerel döküm; telif/boyut nedeniyle repoya eklenmedi). Anahtar kelime sayımı + 1–2★ yorum örnekleri. Sayılar yaklaşık (yorum satırı eşleşmesi), kesin istatistik değil.

## Kullanıcıların en çok şikâyet ettiği şeyler

| Tema | Kabaca eşleşme | Tipik yorum özeti | Lumo'nun cevabı |
|---|---|---|---|
| Fiyat / abonelik / paywall | ~1400 "price", ~1000 "subscription", ~800 "pay" | "Sadece 3 ücretsiz oyun, gerisi premium", "aşırı pahalı" | Tüm oyunlar açık ve ücretsiz; ücretli katman yok |
| Aynı oyunların tekrarı | ~500 "repetitive/boring" | "Ücretsiz sürüm hep aynı oyunları döndürüyor" | Seeded üreteçler + büyük içerik havuzları (aşağıya bak) |
| Oyun seçememe / değiştirememe | ~40 | "Neden oyunu seçemiyorum, sevdiğim oyunu kaldırdılar" | Oyunların hepsi kütüphanede açık; kullanıcı istediğini oynar |
| İptal / faturalama | ~170 cancel, ~180 charged/refund | "İptal etmek kâbus", "iptal ettim yine de ücret kesildi" | Abonelik yok → bu sorun hiç doğmaz |
| Hesap / veri zorunluluğu | ~340 | "Hesap şart, veri topluyorlar", "çevrimdışı çalışmıyor" | Backend yok; oyun verisi cihazda. Hesap yalnızca yerel demo |
| Hatalar / donma / kayıt kaybı | ~560 | "Son günlük antrenmanda donuyor, skor kaydolmuyor" | Yerel çalışır; oyun mantığı birim testli (53 test) |
| Adaptif zorluk adaletsizliği | ~60 "too hard/easy" + skor/adalet | "Üst seviyelerde imkânsız, oyun takas edilemiyor" | Seviye blok doğruluğuna göre, saf ve testli (`core/adaptive.ts`); açıklama katmanı sırada |
| Reklam baskısı | ~330 | "Oynamaktan çok reklam izliyorsun" | Reklam yok |
| Bilimsel iddia güveni | ~150 | Kanıt/etkililik şüphesi | Her oyunda paradigma adı ve kısa "insight" metni; abartılı iddia yok |

## Lumo'yu özgün kılacak yönler

Şu an var olanlar ve sırada olanlar ayrı işaretlendi.

**Mevcut**
1. **Sıfır paywall, reklamsız**: 20 oyun ve tüm seviyeler baştan açık.
2. **Backend'siz, yerel**: sunucuya veri gitmiyor.
3. **Türkçe-öncelikli + iki dilli (TR/EN)**: arayüz ve oyun metinleri; Word Bubbles Türkçe sözcük köklerine dayanır.
4. **Görsel olarak anlaşılır oyunlar**: soyut görevler hikâyeye/somut nesneye bağlanıyor (kapanan kartlar, dalganın getirdiği hazine, çakışmayan sözcük balonları).
5. **Seeded RNG** (`core/rng.ts`): aynı seed aynı oyunu üretir; düello ve "günün meydan okuması" için hazır zemin.
6. **Dürüst bilim dili**: görev adı (Flanker, Stroop, n-back, sürekli tanıma…) ve ne ölçtüğü oyun kartında yazılı.

**Sırada**
7. **Düello / günün meydan okuması**: seed paylaşımı (link ya da kod), sunucusuz.
8. **Şeffaf adaptasyon paneli**: blok sonunda "doğruluk %X → seviye Y çünkü …", elle seviye seçme.
9. **Erişilebilirlik**: renk körü modları (renk + şekil çifte kodlama), azaltılmış hareket, büyük yazı; klavye desteği çoğu oyunda zaten var.
10. **PWA / çevrimdışı**: kurulabilir, bekleme yok.
11. **Veri sahipliği**: CSV/JSON dışa-içe aktarma, kendi gelişim grafikleri.
12. **Açık içerik**: sözcük listeleri, isim/sipariş havuzları dosya olarak açık; katkıyla büyür.

## Bu çalışmada yapılanlar (kodla eşleşen güncel durum)

| Oyun | Değişiklik |
|---|---|
| Memory Matrix | İlk raunddaki tıklanamaz bekleme/gecikme giderildi: "hazır" evresi (600 ms), flaş sonrası ek bekleme 500 → 200 ms, memo'lu CSS geçişli kareler, duraklatmaya saygılı tur arası zamanlayıcı |
| Lost in Migration | 3 → 8 tür: kuş, balık, uçak, kelebek, balina, arı, roket, kaplumbağa. Seviyeye göre havuz: L1 4 · L2 6 · L3 8 |
| Memory Match (n-back) | **Baştan tasarlandı:** şekiller sağdan gelir, kartlar kapanır; en soldaki işaretli kart "N önceki"dir. Cevaptan sonra kart çevrilip doğrusu gösterilir. Çift yüzlü kartlar, süre çubuğu. Şekil havuzu 12 |
| Tidal Treasures | **Baştan tasarlandı:** sürekli tanıma. Dalga tek tek hazine getirir; "YENİ" ya da "BULMUŞTUM". Yeni hazineler koleksiyona girer; seviye yükseldikçe yeni hazineler eskilere benzer (aynı şekil, yakın renk) ve süre kısalır. Şekil havuzu 12 |
| Color Match | 5 → 7 mürekkep (turuncu, pembe eklendi) |
| Star Search | 5 → 7 renk |
| Familiar Faces | İsim 24 → 36, sipariş 6 → 9 (kurabiye, dondurma, meyve suyu) |
| Word Bubbles | Kök 8 → 56, sözcük ~830. Baloncuklar artık sabit yuvalara (4×3) yerleşir, çakışmıyor; uzunluğa göre renk/boyut, kök zamanlayıcı çubuğu, "en uzun sözcük" rozeti. Süre artık 90 sn'ye sabitli değil |
| Görsel kimlik | Yeni tema (`theme.css`): krem kâğıt + kalın mürekkep çizgi + sert gölge + çıkartma hissi; Bricolage Grotesque başlıklar. Maskot **Lumo** (parlayan ateş böceği: imleci takip eden gözler, göz kırpma, kanat çırpma) logoda, ana sayfada ve sonuç ekranında. Ana sayfada kayan oyun şeridi, kategori renkli kartlar. Oyun ekranları ayrı "gece odası": koyu, oyunun kategori renginde parlayan zemin |
| Arayüz | PRO etiketleri kaldırıldı (kütüphane kartları, fiyat sayfası tek "herkes için ücretsiz" kartı). Oyun ekranı pencere yüksekliğine uyar: panolar `dvh`'ye göre küçülür, kısa ekranlarda yön tuşları ve cevap butonları görünür kalır (Penguin Pursuit'te doğrulandı) |
| Ortak | `useLater` kancası: 10 oyunda sonraki deneme zamanlayıcıları duraklatmada donar, oyun kapanınca temizlenir. Pinball Recall interval sızıntısı kapatıldı |

## Bilinen eksikler / sonraki adımlar
- Word Bubbles sözlüğü elle derlendi; geçerli ama listede olmayan sözcük reddediliyor (ceza yok). Kök başına 30+ sözcük ve daha geniş bir Türkçe sözlük kaynağı (lisansa dikkat) değerlendirilmeli.
- Star Search / Speed Match / Disillusion için ek şekil çizimleri.
- İlk denemede tepki süresi mount anından ölçülüyor (geri sayımdan sonra olduğu için sapma küçük).
- Düello, PWA, erişilebilirlik denetimi, "seviyem neden değişti" paneli.
