"use client"

import { useState } from "react"
import { BookOpen, Star, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

// Ҳанафий мазҳабидаги саҳиҳ ҳадислар (Президент учун)
const HADITHS = [
  {
    id: 1,
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    latin: "Innamal a'mālu bin-niyyāt",
    cyrillic: "Иннамал аъмолу бин-ниййот",
    translationLatin: "Амаллар фақат ниятлар биландир",
    translationCyrillic: "Амаллар фақат ниятлар биландир",
    source: "Бухорий ва Муслим ривояти",
    category: "Ният",
    explanationLatin: "Ҳар бир иш ниятга боғлиқ. Ибодатларда ният тўғри бўлиши шарт.",
    explanationCyrillic: "Ҳар бир иш ниятга боғлиқ. Ибодатларда ният тўғри бўлиши шарт.",
  },
  {
    id: 2,
    arabic: "الصَّلاَةُ عِمَادُ الدِّينِ",
    latin: "As-salātu 'imādu d-dīn",
    cyrillic: "Ас-салоту имодуд-дин",
    translationLatin: "Намоз — диннинг устуни",
    translationCyrillic: "Намоз — диннинг устуни",
    source: "Термизий ривояти",
    category: "Намоз",
    explanationLatin: "Намоз Ислом динининг асосий рукнларидан биридир.",
    explanationCyrillic: "Намоз Ислом динининг асосий рукнларидан биридир.",
  },
  {
    id: 3,
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    latin: "Khayrukum man ta'allama al-Qur'āna wa 'allamah",
    cyrillic: "Хайрукум ман та'алламал Қуръона ва 'алламаҳ",
    translationLatin: "Энг яхшингиз Қуръон ўрганиб, ўргатувчидир",
    translationCyrillic: "Энг яхшингиз Қуръон ўрганиб, ўргатувчидир",
    source: "Бухорий ривояти",
    category: "Илм",
    explanationLatin: "Қуръон ўрганиш ва ўргатиш — энг фазилатли амал.",
    explanationCyrillic: "Қуръон ўрганиш ва ўргатиш — энг фазилатли амал.",
  },
  {
    id: 4,
    arabic: "الْوَالِدُ أَوْسَطُ أَبْوَابِ الْجَنَّةِ",
    latin: "Al-wālidu awsatu abwābi l-jannah",
    cyrillic: "Ал-волиду авсату абвобил-жаннаҳ",
    translationLatin: "Ота-она — жаннатнинг ўрта эшиги",
    translationCyrillic: "Ота-она — жаннатнинг ўрта эшиги",
    source: "Термизий ривояти",
    category: "Ота-она",
    explanationLatin: "Ота-онага хизмат қилиш — жаннатга киритувчи сабаб.",
    explanationCyrillic: "Ота-онага хизмат қилиш — жаннатга киритувчи сабаб.",
  },
  {
    id: 5,
    arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    latin: "Lā yu'minu aḥadukum ḥattā yuḥibba li-akhīhi mā yuḥibbu li-nafsih",
    cyrillic: "Ла юъмину аҳадукум ҳатта юҳибба ли-ахийҳи ма юҳиббу ли-нафсиҳ",
    translationLatin: "Ўзингга хоҳлаган яхшиликни биродарингга ҳам хоҳламагунингча иймон келтирмайсан",
    translationCyrillic: "Ўзингга хоҳлаган яхшиликни биродарингга ҳам хоҳламагунингча иймон келтирмайсан",
    source: "Бухорий ва Муслим ривояти",
    category: "Ахлоқ",
    explanationLatin: "Мусулмон киши ўзига хоҳлаган яхшиликни бошқаларга ҳам хоҳлаши керак.",
    explanationCyrillic: "Мусулмон киши ўзига хоҳлаган яхшиликни бошқаларга ҳам хоҳлаши керак.",
  },
  {
    id: 6,
    arabic: "الدِّينُ النَّصِيحَةُ",
    latin: "Ad-dīnu an-nasīḥah",
    cyrillic: "Ад-динун насиҳаҳ",
    translationLatin: "Дин — насиҳатдир",
    translationCyrillic: "Дин — насиҳатдир",
    source: "Муслим ривояти",
    category: "Ахлоқ",
    explanationLatin: "Мусулмонлар бир-бирига насиҳат қилиши лозим.",
    explanationCyrillic: "Мусулмонлар бир-бирига насиҳат қилиши лозим.",
  },
  {
    id: 7,
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    latin: "Man kāna yu'minu billāhi wal-yawmi l-ākhir-i falyaqul khayran aw liyasmut",
    cyrillic: "Ман кона юъмину биллаҳи вал-явмил-охири фал-яқул хайран ав лисмут",
    translationLatin: "Ким Аллоҳга ва охират кунига иймон келтирса, яхши гапирсин ёки жим турсин",
    translationCyrillic: "Ким Аллоҳга ва охират кунига иймон келтирса, яхши гапирсин ёки жим турсин",
    source: "Бухорий ва Муслим ривояти",
    category: "Ахлоқ",
    explanationLatin: "Мусулмон киши тилини ёмон сўзлардан сақлаши керак.",
    explanationCyrillic: "Мусулмон киши тилини ёмон сўзлардан сақлаши керак.",
  },
]

const CATEGORIES = ["Барчаси", "Ният", "Намоз", "Илм", "Ота-она", "Ахлоқ"]

export function HadithSection({ lang }: { lang: Lang }) {
  const [selectedCategory, setSelectedCategory] = useState("Барчаси")
  const [expandedHadith, setExpandedHadith] = useState<number | null>(null)

  const filteredHadiths = HADITHS.filter((hadith) => {
    const matchesCategory = selectedCategory === "Барчаси" || hadith.category === selectedCategory
    return matchesCategory
  })

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 islamiy-pattern opacity-25" aria-hidden="true" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 bg-emerald-800/50 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-emerald-900" aria-hidden="true" />
            </div>
            <span className="text-yellow-400 text-sm font-bold uppercase tracking-widest">
              {label(lang, "ҲАДИСЛАР", "HADISLAR")}
            </span>
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {label(
              lang,
              "Пайғамбаримиздан ҳадислар",
              "Пайғамбаримиздан ҳадислар"
            )}
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto">
            {label(
              lang,
              "Пайғамбаримиз Муҳаммад ﷺ дан саҳиҳ ҳадислар",
              "Пайғамбаримиз Муҳаммад ﷺ дан саҳиҳ ҳадислар"
            )}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-6 py-3 rounded-full font-semibold transition-all duration-300",
                selectedCategory === category
                  ? "bg-yellow-500 text-emerald-900 shadow-lg"
                  : "bg-emerald-800/60 text-emerald-200 border border-emerald-600 hover:border-yellow-500/50"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Hadith Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredHadiths.map((hadith) => (
            <div
              key={hadith.id}
              className="bg-emerald-800/60 backdrop-blur-xl rounded-2xl border-2 border-yellow-500/30 p-6 shadow-2xl hover:border-yellow-400/50 transition-all duration-300"
            >
              {/* Arabic Text */}
              <div className="mb-4">
                <p className="text-2xl font-serif text-right text-yellow-400 leading-loose direction-rtl">
                  {hadith.arabic}
                </p>
              </div>

              {/* Translation */}
              <div className="mb-4">
                <p className="text-lg font-semibold text-white mb-2">
                  {label(lang, hadith.translationLatin, hadith.translationCyrillic)}
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <Star className="w-4 h-4" />
                  <span>{hadith.source}</span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
                  {hadith.category}
                </span>
              </div>

              {/* Expand Button */}
              <button
                onClick={() => setExpandedHadith(expandedHadith === hadith.id ? null : hadith.id)}
                className="w-full py-3 bg-emerald-700/50 hover:bg-emerald-600/50 rounded-xl text-emerald-200 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                {expandedHadith === hadith.id ? (
                  <>
                    <span>
                      {label(lang, "Ёпиш", "Yopish")}
                    </span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    <span>
                      {label(lang, "Шарҳини кўриш", "Sharhini ko'rish")}
                    </span>
                  </>
                )}
              </button>

              {/* Explanation */}
              {expandedHadith === hadith.id && (
                <div className="mt-4 pt-4 border-t border-emerald-600/50">
                  <p className="text-emerald-100 leading-relaxed">
                    {label(lang, hadith.explanationLatin, hadith.explanationCyrillic)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHadiths.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <p className="text-emerald-200 text-lg">
              {label(
                lang,
                "Ҳеч қандай ҳадис топилмади",
                "Hech qanday hadis topilmadi"
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
