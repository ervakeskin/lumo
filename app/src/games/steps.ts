// Öğretici (3 adım) metinleri: yeni oyunlar için. Eski oyunların adımları GameShell içinde.
export const NEW_STEPS: Record<string, { tr: string[]; en: string[] }> = {
  'tidal-treasures': {
    tr: ['Dalgalar kıyıya tek tek hazine getirir.', 'Bu hazineyi daha önce buldun mu? Bulmadıysan YENİ (←), buldundan eminsen BULMUŞTUM (→).', 'Yeni hazineler koleksiyonuna girer. İlerledikçe yeni hazineler eskilerine daha çok benzer ve süre kısalır.'],
    en: ['Waves wash up one treasure at a time.', 'Have you found this one before? NEW (←) if not, SEEN (→) if you are sure.', 'New treasures join your collection. Later, new ones look more like old ones and time shrinks.'],
  },
  'memory-match': {
    tr: ['Şekiller sağdan gelir, sonra kartlar kapanır.', 'Sağdaki şekil, işaretli kartla (N önceki) aynıysa AYNI (→), değilse FARKLI (←). Cevaptan sonra kart açılıp doğrusu gösterilir.', 'Doğru seri yaptıkça N artar: 1-geri → 2-geri → 3-geri.'],
    en: ['Shapes arrive on the right, then cards flip face-down.', 'If the shape on the right matches the marked card (N back) press SAME (→), else DIFFERENT (←). After you answer, the card flips to show the truth.', 'As you score, N grows: 1-back → 2-back → 3-back.'],
  },
  'familiar-faces': {
    tr: ['Müşterilerin yüzünü, adını ve siparişini ezberle.', 'Süre dolunca ya da "Hazırım" deyince sorular başlar: bu müşteri ne sipariş etti / adı neydi?', 'Her başarılı turda müşteri sayısı artar.'],
    en: ['Memorize each customer’s face, name and order.', 'When time is up (or you press "Ready") questions begin: what did they order / what was their name?', 'Each clean round adds more customers.'],
  },
  'splitting-seeds': {
    tr: ['Bir tohum yığını görürsün.', 'Çizgiyi sürükle ya da ←/→ kullan: solda ve sağda eşit sayıda tohum kalsın. Saymadan, göz kararı!', 'Enter ile böl. Hata payı seviye arttıkça daralır.'],
    en: ['You see a pile of seeds.', 'Drag the line (or use ←/→) so left and right hold equal seeds. Don’t count — eyeball it!', 'Press Enter to split. The tolerance shrinks with the level.'],
  },
  'star-search': {
    tr: ['Kalabalık bir yıldız alanı görürsün.', 'Diğerlerinden farklı olan TEK yıldıza dokun.', 'Önce rengi, sonra şekli, en sonda renk + şekil birleşimiyle farklı olanı ararsın.'],
    en: ['You see a crowded field of stars.', 'Tap the ONE star that differs from the rest.', 'First by color, then by shape, finally by a color + shape combination.'],
  },
  'spatial-speed': {
    tr: ['İki şekil görürsün.', 'Sağdaki, soldakinin sadece DÖNDÜRÜLMÜŞ hali mi? Evet → AYNI (→).', 'Aynalanmış (ters çevrilmiş) şekil FARKLI sayılır (←). Zamanla şekiller büyür.'],
    en: ['You see two shapes.', 'Is the right one just a ROTATED copy of the left? Yes → SAME (→).', 'A mirror image counts as DIFFERENT (←). Shapes grow over time.'],
  },
  disillusion: {
    tr: ['Üstte bir kural yazar: RENGE / ŞEKLE / SAYIYA GÖRE.', 'Ortadaki kartı, kurala göre eşleşen referans karta yerleştir (dokun ya da 1-4 tuşları).', 'Kural değişir! Seviye 3\'te kural kısa süre görünüp kaybolur; aklında tut.'],
    en: ['A rule is shown on top: BY COLOR / SHAPE / COUNT.', 'Place the center card on the reference card that matches it under the rule (tap or keys 1-4).', 'The rule changes! At level 3 it flashes briefly, then hides; remember it.'],
  },
  'ebb-and-flow': {
    tr: ['Bir yaprak göletten geçer.', 'YEŞİL yaprakta BAKTIĞI yönü, TURUNCU yaprakta HAREKET ettiği yönü seç.', 'Yaprak bir yöne bakıp başka yöne gidebilir; rengine göre doğru kuralı uygula.'],
    en: ['A leaf drifts across the pond.', 'For a GREEN leaf pick the direction it FACES; for an ORANGE leaf, the direction it MOVES.', 'It may face one way and move another; apply the rule its color demands.'],
  },
  'pirate-passage': {
    tr: ['Gemin bir yönde kayar ve kayaya ya da duvara çarpana kadar durmaz.', 'Hazine sandığının üzerinden geçince onu alırsın; hamle hakkın sınırlıdır.', 'Önceden planla: en kısa yolu bulmak ekstra puan verir. R ile baştan başla.'],
    en: ['Your ship slides in one direction until it hits a rock or wall.', 'Sail over the treasure chest to collect it; your moves are limited.', 'Plan ahead: finding the shortest route earns bonus points. Press R to restart.'],
  },
  'pattern-logic': {
    tr: ['3×3 bir tablo görürsün, sağ alt köşe eksik.', 'Her satır ve sütun aynı kurallara uyar (şekil, renk, sayı).', 'Eksik parçayı seçeneklerden bul (dokun ya da 1-4).'],
    en: ['You see a 3×3 grid with the bottom-right cell missing.', 'Every row and column follows the same rules (shape, color, count).', 'Pick the missing piece from the options (tap or keys 1-4).'],
  },
  'penguin-pursuit': {
    tr: ['Mavi penguen sensin, kırmızı penguen rakip.', 'Ok tuşlarıyla labirentte ilerle ve balığa rakipten ÖNCE ulaş.', 'Rakip en kısa yolu bilir; sen de kestirme bulmalısın. Labirent büyüdükçe rakip hızlanır.'],
    en: ['You are the blue penguin, the red one is your rival.', 'Use the arrow keys to move through the maze and reach the fish BEFORE the rival.', 'The rival knows the shortest path; find shortcuts too. The maze grows and the rival speeds up.'],
  },
  'word-bubbles': {
    tr: ['Ekranda bir kök (ör. KAR…) görürsün.', 'Bu kökle başlayan Türkçe sözcükler yaz ve Enter\'a bas. Uzun sözcük daha çok puan getirir.', 'Kök her 30 saniyede değişir. Aynı sözcüğü tekrar yazamazsın.'],
    en: ['You see a stem (e.g. KAR…).', 'Type Turkish words that start with it and press Enter. Longer words score more.', 'The stem changes every 30 seconds. You cannot reuse a word.'],
  },
  'train-of-thought': {
    tr: ['Soldan renkli trenler gelir; sağda renkli istasyonlar bekler.', 'Makaslara dokunarak trenin hattını değiştir: her makas treni bir alt hatta geçirir.', 'Her treni kendi renkli istasyonuna ulaştır. 3 yanlış teslimatta oyun biter.'],
    en: ['Colored trains arrive from the left; colored stations wait on the right.', 'Tap switches to change a train’s line: each switch shifts it one line down.', 'Deliver every train to its matching station. Three wrong deliveries end the game.'],
  },
  'pinball-recall': {
    tr: ['Tamponların yerini birkaç saniye görürsün, sonra gizlenirler.', 'Top yukarıdan bırakılınca tamponlara çarparak nereye düşer? Hangi yuvaya düşeceğini tahmin et.', 'Cevaptan sonra topun yolu gösterilir. Tampon sayısı arttıkça zorlaşır.'],
    en: ['You see the bumpers for a few seconds, then they vanish.', 'When the ball drops and bounces off them, where will it land? Guess the slot.', 'After your answer the ball’s path is replayed. More bumpers make it harder.'],
  },
}
