import type { ComponentType } from 'react'
import type { GameProps } from '../engine/types'
import MemoryMatrix from './MemoryMatrix'
import SpeedMatch from './SpeedMatch'
import LostInMigration from './LostInMigration'
import Raindrops from './Raindrops'
import ColorMatch from './ColorMatch'
import Chalkboard from './Chalkboard'
import TrainOfThought from './TrainOfThought'
import PinballRecall from './PinballRecall'
import TidalTreasures from './TidalTreasures'
import MemoryMatch from './MemoryMatch'
import FamiliarFaces from './FamiliarFaces'
import SplittingSeeds from './SplittingSeeds'
import StarSearch from './StarSearch'
import SpatialSpeed from './SpatialSpeed'
import Disillusion from './Disillusion'
import EbbAndFlow from './EbbAndFlow'
import PiratePassage from './PiratePassage'
import PatternLogic from './PatternLogic'
import PenguinPursuit from './PenguinPursuit'
import WordBubbles from './WordBubbles'

export type CategoryId = 'memory' | 'attention' | 'speed' | 'flexibility' | 'problem' | 'math' | 'language'
type L = { tr: string; en: string }

export const CATEGORIES: Record<CategoryId, { name: L; color: string }> = {
  memory: { name: { tr: 'Hafıza', en: 'Memory' }, color: '#FF8C42' },
  attention: { name: { tr: 'Dikkat', en: 'Attention' }, color: '#22C7A9' },
  speed: { name: { tr: 'Hız', en: 'Speed' }, color: '#EF5B5B' },
  flexibility: { name: { tr: 'Esneklik', en: 'Flexibility' }, color: '#A78BFA' },
  problem: { name: { tr: 'Problem Çözme', en: 'Problem Solving' }, color: '#4C9AFF' },
  math: { name: { tr: 'Matematik', en: 'Math' }, color: '#3BB2F6' },
  language: { name: { tr: 'Dil', en: 'Language' }, color: '#F472B6' },
}

export interface GameMeta {
  id: string
  name: string
  category: CategoryId
  paradigm: L
  description: L
  /** Bu oyun neyi ölçer? Abartısız, kaynağa dayalı dil. */
  insight: L
  durationSec: number
  premium: boolean
  Component?: ComponentType<GameProps>
}

const g = (m: Omit<GameMeta, 'premium'> & { premium?: boolean }): GameMeta => ({ premium: false, ...m })

export const GAMES: GameMeta[] = [
  g({
    id: 'memory-matrix', name: 'Memory Matrix', category: 'memory', durationSec: 120, Component: MemoryMatrix,
    paradigm: { tr: 'Görsel-uzamsal çalışan bellek', en: 'Visuo-spatial working memory' },
    description: { tr: 'Kareler kısa süre parlar. Deseni aklında tut, sonra parlayan kareleri işaretle.', en: 'Tiles flash briefly. Hold the pattern in mind, then tap the tiles that lit up.' },
    insight: { tr: 'Uzamsal çalışan bellek görevleri (Corsi tipi) bilgiyi kısa süre zihinde tutma kapasitesini ölçer.', en: 'Spatial span tasks (Corsi-type) measure how much visual-spatial information you can hold in mind.' },
  }),
  g({
    id: 'speed-match', name: 'Speed Match', category: 'speed', durationSec: 60, Component: SpeedMatch,
    paradigm: { tr: 'İşlem hızı', en: 'Processing speed' },
    description: { tr: 'Şimdiki sembol bir öncekiyle aynı mı? Mümkün olduğunca hızlı karar ver.', en: 'Is the current symbol the same as the previous one? Decide as fast as you can.' },
    insight: { tr: 'Basit karar görevlerinde tepki süresi, bilgi işleme hızının yaygın bir göstergesidir.', en: 'Reaction time on simple decision tasks is a common index of information processing speed.' },
  }),
  g({ id: 'lost-in-migration', name: 'Lost in Migration', category: 'attention', durationSec: 120, Component: LostInMigration, paradigm: { tr: 'Flanker görevi', en: 'Flanker task' }, description: { tr: 'Sürünün liderinin yönünü bul; çevresindekileri yok say. Kuş, balık ve uçak sürüleri; 2 ve 4 yön.', en: 'Find the leader’s direction and ignore the group around it. Birds, fish and planes; 2 and 4 directions.' }, insight: { tr: 'Flanker görevi seçici dikkati ve çeldirici bastırmayı ölçer.', en: 'The flanker task measures selective attention and distractor suppression.' } }),
  g({ id: 'raindrops', name: 'Raindrops', category: 'math', durationSec: 120, Component: Raindrops, paradigm: { tr: 'Aritmetik akıcılık', en: 'Arithmetic fluency' }, description: { tr: 'Damlalar yere düşmeden işlemleri çöz.', en: 'Solve the equations before the drops land.' }, insight: { tr: 'Zaman baskısı altında aritmetik akıcılık.', en: 'Arithmetic fluency under time pressure.' } }),
  g({ id: 'color-match', name: 'Color Match', category: 'flexibility', durationSec: 90, Component: ColorMatch, paradigm: { tr: 'Stroop + kural değişimi', en: 'Stroop + rule switching' }, description: { tr: 'İki kelimeyi karşılaştır: anlam mı, yazı rengi mi soruluyor? Kural sürekli değişir.', en: 'Compare two words: is it meaning or ink color? The rule keeps changing.' }, insight: { tr: 'Stroop etkisi otomatik okuma ile renk adlandırma çatışmasını ölçer.', en: 'The Stroop effect measures conflict between automatic reading and color naming.' } }),
  g({ id: 'chalkboard-challenge', name: 'Chalkboard Challenge', category: 'problem', durationSec: 90, Component: Chalkboard, paradigm: { tr: 'Nicel karşılaştırma', en: 'Quantitative comparison' }, description: { tr: 'Tebeşirle yazılmış iki ifadeden hangisi daha büyük, yoksa eşit mi?', en: 'Which of the two chalk expressions is greater, or are they equal?' }, insight: { tr: 'Sayısal büyüklük karşılaştırması.', en: 'Numerical magnitude comparison.' } }),
  g({ id: 'train-of-thought', Component: TrainOfThought, name: 'Train of Thought', category: 'attention', premium: true, durationSec: 150, paradigm: { tr: 'Bölünmüş dikkat', en: 'Divided attention' }, description: { tr: 'Trenleri doğru istasyona yönlendir.', en: 'Route trains to the matching station.' }, insight: { tr: 'Birden çok dinamik görevi aynı anda yönetme.', en: 'Managing multiple dynamic tasks at once.' } }),
  g({ id: 'pinball-recall', Component: PinballRecall, name: 'Pinball Recall', category: 'memory', premium: true, durationSec: 150, paradigm: { tr: 'Uzamsal hafıza + zihinsel simülasyon', en: 'Spatial memory + mental simulation' }, description: { tr: 'Tamponları ezberle, topun yolunu tahmin et.', en: 'Memorize the bumpers, predict the ball path.' }, insight: { tr: 'Çoklu nesne konum hafızası.', en: 'Multi-object location memory.' } }),
  g({ id: 'tidal-treasures', Component: TidalTreasures, name: 'Tidal Treasures', category: 'memory', durationSec: 120, paradigm: { tr: 'Tanıma hafızası', en: 'Recognition memory' }, description: { tr: 'Daha önce seçmediğin nesneyi seç.', en: "Pick the object you haven't picked before." }, insight: { tr: 'Tanıma hafızası ve interferans.', en: 'Recognition memory and interference.' } }),
  g({ id: 'memory-match', Component: MemoryMatch, name: 'Memory Match', category: 'memory', durationSec: 120, paradigm: { tr: 'Adaptif n-back', en: 'Adaptive n-back' }, description: { tr: 'Sembol N adım önceki ile aynı mı?', en: 'Is the symbol the same as N steps back?' }, insight: { tr: 'n-back çalışan belleği ölçen standart bir görevdir.', en: 'n-back is a standard working-memory task.' } }),
  g({ id: 'familiar-faces', Component: FamiliarFaces, name: 'Familiar Faces', category: 'memory', premium: true, durationSec: 150, paradigm: { tr: 'İlişkisel hafıza', en: 'Associative memory' }, description: { tr: 'Yüz, isim ve siparişi eşleştir.', en: 'Match face, name and order.' }, insight: { tr: 'Yüz-isim ilişkisel hafızası.', en: 'Face-name associative memory.' } }),
  g({ id: 'splitting-seeds', Component: SplittingSeeds, name: 'Splitting Seeds', category: 'attention', durationSec: 90, paradigm: { tr: 'Miktar tahmini', en: 'Quantity estimation' }, description: { tr: 'Tohum yığınını göz kararıyla ikiye böl.', en: 'Split the pile of seeds in two by eye.' }, insight: { tr: 'Hızlı miktar algısı (subitizing).', en: 'Rapid quantity perception (subitizing).' } }),
  g({ id: 'star-search', Component: StarSearch, name: 'Star Search', category: 'attention', durationSec: 90, paradigm: { tr: 'Görsel arama', en: 'Visual search' }, description: { tr: 'Kalabalıkta farklı olanı bul.', en: 'Find the odd one out in the crowd.' }, insight: { tr: 'Görsel arama verimliliği.', en: 'Visual search efficiency.' } }),
  g({ id: 'spatial-speed', Component: SpatialSpeed, name: 'Spatial Speed', category: 'speed', durationSec: 90, paradigm: { tr: 'Zihinsel rotasyon', en: 'Mental rotation' }, description: { tr: 'Döndürülmüş şekiller aynı mı?', en: 'Are the rotated shapes the same?' }, insight: { tr: 'Zihinsel rotasyon hızı.', en: 'Mental rotation speed.' } }),
  g({ id: 'disillusion', Component: Disillusion, name: 'Disillusion', category: 'flexibility', premium: true, durationSec: 120, paradigm: { tr: 'Kural değişimi', en: 'Rule switching' }, description: { tr: 'Eşleştirme kuralı sürekli değişir.', en: 'The matching rule keeps changing.' }, insight: { tr: 'Bilişsel esneklik.', en: 'Cognitive flexibility.' } }),
  g({ id: 'ebb-and-flow', Component: EbbAndFlow, name: 'Ebb and Flow', category: 'flexibility', durationSec: 120, paradigm: { tr: 'Görev geçişi', en: 'Task switching' }, description: { tr: 'Renge göre bakış ya da hareket yönünü işaretle.', en: 'Report facing or moving direction depending on color.' }, insight: { tr: 'Görev geçiş maliyeti.', en: 'Task-switching cost.' } }),
  g({ id: 'pirate-passage', Component: PiratePassage, name: 'Pirate Passage', category: 'problem', premium: true, durationSec: 150, paradigm: { tr: 'Yol planlama', en: 'Path planning' }, description: { tr: 'Gemiyi hamle sınırı içinde hazineye ulaştır.', en: 'Reach the treasure within the move limit.' }, insight: { tr: 'Planlama ve ileriyi görme.', en: 'Planning and foresight.' } }),
  g({ id: 'pattern-logic', Component: PatternLogic, name: 'Pattern Logic', category: 'problem', durationSec: 120, paradigm: { tr: 'Matris akıl yürütme', en: 'Matrix reasoning' }, description: { tr: 'Eksik parçayı bul.', en: 'Find the missing piece.' }, insight: { tr: 'Soyut akıl yürütme.', en: 'Abstract reasoning.' } }),
  g({ id: 'penguin-pursuit', Component: PenguinPursuit, name: 'Penguin Pursuit', category: 'problem', premium: true, durationSec: 150, paradigm: { tr: 'Labirent stratejisi', en: 'Maze strategy' }, description: { tr: 'Rakipten önce balığa ulaş.', en: 'Reach the fish before your rival.' }, insight: { tr: 'Uzamsal strateji.', en: 'Spatial strategy.' } }),
  g({ id: 'word-bubbles', Component: WordBubbles, name: 'Word Bubbles', category: 'language', premium: true, durationSec: 90, paradigm: { tr: 'Sözel akıcılık', en: 'Verbal fluency' }, description: { tr: 'Verilen kökle başlayan kelimeler türet.', en: 'Generate words starting with the given stem.' }, insight: { tr: 'Sözel akıcılık.', en: 'Verbal fluency.' } }),
]

export const getGame = (id: string) => GAMES.find((x) => x.id === id)
export const isPlayable = (x: GameMeta) => !!x.Component
