# Lumo — Lumosity'den farklılaşma notları

Kaynak: `lumosity-feedbacks.md` (Play Store yorumları, ~155 bin satır) üzerinde anahtar kelime sayımı + 1–2★ yorum örnekleri. Sayılar yaklaşık (yorum satırı eşleşmesi), kesin istatistik değil.

## Kullanıcıların en çok şikâyet ettiği şeyler

| Tema | Kabaca eşleşme | Tipik yorum özeti | Lumo'nun cevabı |
|---|---|---|---|
| Fiyat / abonelik / paywall | ~1400 "price", ~1000 "subscription", ~800 "pay" | "Sadece 3 ücretsiz oyun, gerisi premium", "aşırı pahalı" | Tüm oyunlar açık ve ücretsiz; premium yok ya da yalnızca kozmetik/destek |
| Aynı oyunların tekrarı | ~500 "repetitive/boring" | "Ücretsiz sürüm hep aynı oyunları döndürüyor" | Seeded üreteçler + büyük içerik havuzları (bu sprintte genişletildi) + "günün meydan okuması" |
| Oyun seçememe / değiştirememe | ~40 | "Neden oyunu seçemiyorum, sevdiğim oyunu kaldırdılar" | Kullanıcı kendi antrenman planını seçer; öneri var, zorlama yok |
| İptal / faturalama | ~170 cancel, ~180 charged/refund | "İptal etmek kâbus", "iptal ettim yine de ücret kesildi" | Abonelik yok → bu sorun hiç doğmaz. Ücretli katman olursa tek tık iptal |
| Hesap / veri zorunluluğu | ~340 | "Hesap şart, veri topluyorlar", "çevrimdışı çalışmıyor" | Hesapsız, yerel veri (localStorage/IndexedDB), PWA ile çevrimdışı |
| Hatalar / donma / kayıt kaybı | ~560 | "Son günlük antrenmanda donuyor, skor kaydolmuyor" | Yerel kayıt, her denemede anında yazma; oyun başına kalite kontrolü |
| Adaptif zorluk adaletsizliği | ~60 "too hard/easy" + skor/adalet | "Üst seviyelerde imkânsız, oyun takas edilemiyor" | Şeffaf adaptasyon: neden seviye değişti gösterilir; seviye elle ayarlanabilir |
| Reklam baskısı | ~330 | "Oynamaktan çok reklam izliyorsun" | Reklam yok |
| Bilimsel iddia güveni | ~150 | Kanıt/etkililik şüphesi | Dürüst dil: "eğlenceli bilişsel egzersiz", abartılı iddia yok; yöntem ve sınırlar açık yazılır |

## Lumo'yu özgün kılacak yönler (öncelik sırasıyla)

1. **Gizlilik ve sahiplik**: hesap yok, bulut yok, verin cihazında. CSV/JSON dışa aktarma ve içe aktarma. (Rakip yorumlarında en sinir bozucu madde.)
2. **Tam erişim, sıfır paywall**: 20 oyunun hepsi ve tüm seviyeler baştan açık.
3. **Seçim özgürlüğü**: kendi planını kur, favori oyunları sabitle, "bugün şunu çalış" önerisi opsiyonel.
4. **Şeffaf adaptasyon**: her blok sonunda "doğruluk %X → seviye Y çünkü …" ve elle seviye seçme. `core/adaptive.ts` zaten saf ve testli; açıklama katmanı eklenebilir.
5. **Türkçe-öncelikli içerik**: Word Bubbles (TR kökleri), TR/EN iki dilli arayüz. Dil bazlı oyunlar (hece, anagram, eş anlamlı) eklenebilir.
6. **Günün meydan okuması + Duel (seed paylaşımı)**: aynı seed ile arkadaşla karşılaştırma. Seeded RNG (`core/rng.ts`) bunu neredeyse bedavaya getiriyor. Sunucu gerekmeden link/kod ile paylaşım.
7. **Erişilebilirlik**: renk körü modları (renk + şekil çifte kodlama), azaltılmış hareket, tam klavye desteği, büyük yazı. Rakipte zayıf alan.
8. **Çevrimdışı PWA + hafif**: telefonda "oyunlar indiriliyor" bekleme yok; ilk açılışta her şey hazır.
9. **Dürüst bilim dili**: her oyunun hangi bilişsel beceriyi ölçtüğü, hangi klasik göreve dayandığı (Flanker, Stroop, n-back…) ve kanıt düzeyi kısaca yazılı.
10. **Açık ve topluluk içeriği**: oyun içerik havuzları (sözcük listeleri, yüz isimleri vb.) dosya olarak açık; katkıyla büyür.

## Bu sprintte yapılan ilgili iyileştirmeler
- Memory Matrix: ilk raunddaki tıklanamaz bekleme ve gecikme giderildi (hazır evresi, hafif döşeme, CSS geçişi).
- Lost in Migration: 3 → 8 tür (seviyeye göre 4/6/8 havuz).
- Duraklatmaya saygılı zamanlayıcılar (`useLater`), Pinball interval sızıntısı kapatıldı.
- İçerik havuzları: Color Match 5→7 renk, Star Search 5→7 renk, Tidal/Memory Match şekil 8→12, Familiar Faces isim 24→36 ve sipariş 6→9, Word Bubbles kök 8→23 ve süre artık sabit 90 sn varsayımına bağlı değil.

## Sonraki adımlar (plan `implementation_plan_v2.md` ile uyumlu)
- Duel-0 (seed paylaşımı), PWA, erişilebilirlik denetimi.
- Word Bubbles sözlüğünü kök başına 30+ sözcüğe çıkar; geçerli sözcük için daha büyük TR sözlük kaynağı değerlendir (lisansına dikkat).
- Star Search / Speed Match / Disillusion için ek şekil çizimleri.
- İlk-gösterim RT doğruluğu: `shownAt` ilk denemede mount anında alınıyor (geri sayımdan sonra olduğu için küçük sapma).
- Oyun içi "seviyem neden değişti" paneli.
