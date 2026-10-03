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
