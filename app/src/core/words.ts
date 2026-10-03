// Word Bubbles (TR): sözel akıcılık. Küçük, elle derlenmiş sözlük — kök ile başlayan sözcükler.
export const trLower = (s: string) => s.trim().toLocaleLowerCase('tr')

export const WORDS: Record<string, string[]> = {
  kar: ['kar', 'kara', 'karar', 'karga', 'kargo', 'karides', 'karpuz', 'karşı', 'karın', 'karne', 'karışık', 'karton', 'karakol', 'karanlık', 'kardeş', 'kariyer', 'karakter', 'karınca', 'karizma', 'karavan', 'karikatür', 'karyola', 'karnaval', 'kararlı', 'karşılık', 'karışım', 'karabiber', 'karnabahar', 'karaciğer', 'karakış', 'karalama', 'karatahta', 'karlı', 'karma', 'karmaşa', 'karanfil'],
  gel: ['gel', 'gelir', 'gelin', 'gelinlik', 'gelişme', 'gelecek', 'gelenek', 'gelgit', 'gelmek', 'gelen', 'gelişim', 'geliş', 'gelişmiş', 'geldi', 'gelmiş', 'gelmeli'],
  yol: ['yol', 'yolcu', 'yolculuk', 'yollamak', 'yolluk', 'yolsuz', 'yoldaş', 'yoldan', 'yolda', 'yollar', 'yollu', 'yolun', 'yolcular', 'yolsuzluk'],
  bah: ['bahçe', 'bahçıvan', 'bahar', 'bahane', 'bahis', 'bahriye', 'bahşiş', 'bahtiyar', 'bahçeli', 'bahsetmek', 'bahadır', 'baharat', 'bahaneler'],
  göz: ['göz', 'gözlük', 'gözlem', 'gözcü', 'gözyaşı', 'gözaltı', 'gözlemci', 'gözbebeği', 'gözetmen', 'gözde', 'gözlü', 'gözetlemek', 'gözler', 'gözlemek'],
  ses: ['ses', 'sesli', 'sessiz', 'sessizlik', 'seslenmek', 'sesler', 'seslendirme', 'sesteş', 'sesbilim', 'seslendirmek', 'sesim', 'sesin'],
  ara: ['ara', 'araba', 'arabacı', 'arabesk', 'aracı', 'araç', 'arama', 'aramak', 'aralık', 'aralamak', 'aranmak', 'arasıra', 'arazi', 'aralıksız', 'arasında', 'aratmak', 'arayış', 'aramızda', 'aralar', 'arabalar'],
  su: ['su', 'sular', 'suluk', 'sucuk', 'susam', 'susmak', 'susuz', 'susuzluk', 'sunmak', 'sunum', 'sunucu', 'surat', 'suç', 'suçlu', 'suçlamak', 'sumak'],
  ev: ['ev', 'evet', 'evren', 'evrak', 'evlat', 'evli', 'evlilik', 'evcil', 'evrim', 'evham', 'evde', 'evler', 'evsiz', 'evrensel', 'evcilik', 'evirmek'],
  kal: ['kalem', 'kalın', 'kale', 'kalp', 'kalabalık', 'kalıp', 'kalite', 'kaldırım', 'kalay', 'kalkan', 'kalkmak', 'kalmak', 'kalıcı', 'kalori', 'kalça', 'kaldırmak', 'kalfa'],
  dön: ['dönmek', 'dönüş', 'dönem', 'dönüm', 'dönemeç', 'dönüşüm', 'döner', 'dönek', 'döndürmek', 'dönüşmek', 'dönence', 'dönmece'],
  gül: ['gül', 'gülmek', 'gülüş', 'gülümsemek', 'gülücük', 'gülle', 'güllaç', 'gülünç', 'gülşeker', 'gülsuyu', 'gülistan', 'gülhane'],
  dağ: ['dağ', 'dağlar', 'dağcı', 'dağcılık', 'dağıtmak', 'dağınık', 'dağılmak', 'dağıtım', 'dağarcık', 'dağlık', 'dağdağa', 'dağıtıcı'],
  ata: ['ata', 'atamak', 'atak', 'atalet', 'atasözü', 'atardamar', 'atasal', 'atari', 'atar', 'atama', 'ataç', 'ataş'],
  sev: ['sevgi', 'sevmek', 'sevinç', 'sevimli', 'sevgili', 'sevinmek', 'sevdalı', 'sevda', 'sevişmek', 'sevap', 'sevecen', 'sevk', 'sevgisiz'],
  kitap: ['kitap', 'kitaplık', 'kitapçı', 'kitaplar', 'kitapsız', 'kitapçık', 'kitapevi', 'kitapta', 'kitapla', 'kitapçılık', 'kitaplarım'],
  ışı: ['ışık', 'ışıl', 'ışıltı', 'ışıldak', 'ışıldamak', 'ışıma', 'ışımak', 'ışın', 'ışınlar', 'ışıklı', 'ışıksız', 'ışınım'],
  sür: ['sürmek', 'sürat', 'sürpriz', 'sürü', 'sürekli', 'sürgün', 'sürücü', 'süreç', 'süre', 'sürünmek', 'sürdürmek', 'sürtünme', 'sürme'],
  yaz: ['yaz', 'yazı', 'yazmak', 'yazar', 'yazıcı', 'yazlık', 'yazılım', 'yazıt', 'yazım', 'yazgı', 'yazışma', 'yazboz', 'yazıhane', 'yazdırmak'],
  bil: ['bilmek', 'bilgi', 'bilim', 'bilet', 'bilgisayar', 'bilek', 'bilgin', 'bilinç', 'bilmece', 'bilezik', 'bilinmez', 'bilanço', 'bilye', 'bilimsel', 'bilge', 'bilgelik'],
  tat: ['tat', 'tatil', 'tatlı', 'tatmak', 'tatlılık', 'tatsız', 'tatmin', 'tatar', 'tatlandırmak', 'tatbikat', 'tatlıcı'],
  tas: ['tas', 'tasa', 'taslak', 'tasarım', 'tasarruf', 'tasvir', 'tasdik', 'tasfiye', 'tasarlamak', 'tasnif', 'tasasız', 'taslama', 'tasarımcı'],
}
const EXTRA: Record<string, string> = {
  kar: 'karakalem karamel karantina karasu karadut karakuş kararsız karartı karşılaşmak karşılamak karşıt karşılaştırmak karışmak karıştırmak karı karım karmakarışık kartal kartpostal kart kartvizit karnıyarık',
  gel: 'gelgitler gelişmek geliştirmek gelirler gelincik gelmedi gelsin geldik gelirim gelirsin',
  yol: 'yolculuklar yoldaşlık yolları yolunu yoluna yolcuk',
  ara: 'araştırma araştırmak aralamak arayıcı aranan arananlar arabuluculuk aracılık',
  bas: 'basmak basın basit basamak basiret baskı baskın baskül basketbol basma basmakalıp basık baston bastırmak basılı basınç basitlik baskıcı',
  gör: 'görmek görev görevli görüş görüntü görsel görkemli görgü görücü görünüm görünmek görmezden görevlendirmek görüşmek görümce görece göreli görselleştirmek görüşme',
  çiçe: 'çiçek çiçekçi çiçeklik çiçekli çiçekler çiçeği çiçeklenmek çiçeksiz çiçeklendirmek çiçeğim çiçekçilik',
  ört: 'örtmek örtü örtük örtülü örtmece örtbas örtüşmek örtünmek örtüler örtmeli örtüyü',
  ağa: 'ağa ağabey ağaç ağaçlık ağaçlar ağaçkakan ağaçlandırmak ağalık ağarmak ağartmak ağaçsız ağaçtan',
  mut: 'mutlu mutluluk mutfak mutlak mutasyon mutsuz mutsuzluk mutabakat mutlaka mutluyum mutlulukla mutad mutemet',
  kış: 'kış kışlık kışla kışkırtmak kışın kışlamak kışkırtıcı kışlar kışlak kışlaklar',
  yağ: 'yağ yağmur yağmak yağlı yağız yağcı yağmacı yağdırmak yağlamak yağlıboya yağışlı yağış yağmurluk yağlık yağma',
  gök: 'gök gökyüzü gökkuşağı gökdelen göktaşı gökbilim gökgürültüsü gökçe göklü gökler gökada',
  ay: 'ay ayna aylık aylar ayak ayakkabı ayrılmak ayrıca ayran ayrım aydınlık aydın aygıt ayıp ayı ayva ayçiçeği aylak ayırmak ayarlamak ayet',
  sar: 'sarı sarmak sarmal sarmaşık sarsıntı sarhoş saray sarılmak sargı sarkmak sarkıt sarnıç sarımsak sarsmak sarkaç',
  dil: 'dil dilek dilim dilbilim dilsiz dilenci dilekçe dilemek dillendirmek dilimlemek dilbilgisi dilbaz',
  ben: 'ben benzer benzin benim bence benlik bencil benzemek benzeşmek benzetmek benzeri benzerlik bendeniz bent',
  son: 'son sonra sonuç sonbahar sonsuz sonsuzluk sonradan sonlu sonuçlanmak sonlandırmak sonrası sonuncu sonda sonat sondaj sonlar sonuçsuz',
  ilk: 'ilk ilkel ilkbahar ilkokul ilke ilkin ilkönce ilkeli ilkesiz ilkyardım ilkçağ ilkeler',
  üz: 'üzüm üzgün üzmek üzere üzeri üzerinde üzüntü üzücü üzerine üzengi üzümlü',
  çal: 'çalmak çalışmak çalışma çalışkan çalı çalım çalgı çalkantı çalkalamak çalar çalıştırmak çalışan çalışkanlık çalıntı çaldı çalıkuşu',
  yaş: 'yaş yaşam yaşamak yaşlı yaşlılık yaşıt yaşça yaşayış yaşanmak yaşatmak yaşlanmak yaşlılar yaşar',
  sıc: 'sıcak sıcaklık sıcacık sıcağı sıcakta sıcaklar sıcaktan sıcakkanlı sıcaklığı sıcaklıkta',
  kök: 'kök köken köklü köksüz kökenli köklenmek kökleşmek kökler kökten kökeni kökü',
  tur: 'turp turuncu turizm turist turşu turna turnuva turne turkuaz turba turbo turistik turnike turta',
  kuş: 'kuş kuşak kuşatmak kuşku kuşkulu kuşlar kuşbaşı kuşkonmaz kuşçu kuşburnu kuşluk kuşanmak',
  kap: 'kapı kapak kapmak kapalı kapamak kapsam kapsül kapışmak kaplan kaplama kaplumbağa kapıcı kapitalist kapris kaptan kapsamlı kapkara',
  zam: 'zaman zamir zambak zamk zamanla zamanında zamansız zamlı zamanlama zamanlayıcı',
  tel: 'tel telefon televizyon telgraf telaş telaffuz telli telsiz teleskop teller telkin telif telefonlar telaşlı',
  ter: 'ter terzi terlik termos terim terör terbiye tercih tercüman tertip terlemek termometre terminal tersane tersine tereyağı terapi terazi teras terk',
  sağ: 'sağ sağlık sağlam sağır sağlayıcı sağlamak sağdıç sağduyu sağlıklı sağanak sağlamlık sağcı sağlıksız',
  sol: 'sol solgun solmak solucan soluk solunum solak solist solcu soldurmak soldaki',
  çök: 'çökmek çökelti çöktürmek çöküş çöküntü çökmüş çökertmek çökelmek çökük çökme',
  dur: 'durmak durum durak durgun durdurmak duraklamak duruş durgunluk duran durulmak duruşma durağan',
  gez: 'gezmek gezi gezgin gezegen gezinti gezdirmek gezinmek gezici gezintiye gezginci',
  ok: 'okul okumak okuma okyanus okuyucu oksijen okşamak oklava okunmak okur okuntu okça okçu okunaklı okullar',
  bul: 'bulmak bulut bulmaca bulgu bulunmak bulaşık bulaşmak bulvar buluş bulgur bulantı bulanık buluşmak bulgular bulutlu buldozer bulucu',
  duy: 'duymak duygu duyuru duyarlı duyum duygusal duyurmak duyulmak duyarsız duygudaş duyuş duyumsamak duygulu duygusuz',
}
for (const [stem, list] of Object.entries(EXTRA))
  WORDS[stem] = Array.from(new Set([...(WORDS[stem] ?? []), ...list.split(/\s+/)]))
export const STEMS = Object.keys(WORDS)

export type WordCheck = 'ok' | 'invalid' | 'dup' | 'stem'
/** Kök ile başlıyor mu, sözlükte var mı, daha önce girildi mi. */
export function checkWord(stem: string, raw: string, used: string[]): WordCheck {
  const w = trLower(raw)
  if (!w.startsWith(stem)) return 'stem'
  if (used.includes(w)) return 'dup'
  return WORDS[stem]?.some((x) => trLower(x) === w) ? 'ok' : 'invalid'
}
/** Puan: uzun sözcük daha değerli. */
export const wordPoints = (w: string) => 40 + Math.max(0, w.length - 3) * 25
