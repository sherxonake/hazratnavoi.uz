"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FilePlus, Users, ArrowRight, BookOpen, Calendar, Eye, TrendingUp, Clock, MessageSquare } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Stats {
  news: number
  visitors: number
  qaPairs: number
  prayerTimes: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    news: 0,
    visitors: 0,
    qaPairs: 0,
    prayerTimes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // Янгиликлар сони
      const { count: newsCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })

      // Савол-жавоблар сони
      const { count: qaCount } = await supabase
        .from('qa_pairs')
        .select('*', { count: 'exact', head: true })

      // Намоз вақтлари сони
      const { count: prayerCount } = await supabase
        .from('prayer_times')
        .select('*', { count: 'exact', head: true })

      setStats({
        news: newsCount || 0,
        visitors: Math.floor(Math.random() * 500) + 100, // FIXME: Реальные данные из аналитики
        qaPairs: qaCount || 0,
        prayerTimes: prayerCount || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Приветственная карточка */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-8 shadow-xl">
        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-white font-serif text-3xl sm:text-4xl font-bold mb-2">
            Ассалому алайкум, Ҳаёт ака!
          </h1>
          <p className="text-emerald-100 text-lg">
            Масжидимиз веб-сайтини бошқариш тизимига хуш келибсиз.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/admin/news"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-full hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <FilePlus className="w-5 h-5" />
              Янги хабар ёзиш
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-emerald-500 transition-all duration-300 border border-emerald-400"
            >
              Сайтни кўриш
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div>
        <h2 className="text-gray-800 font-serif font-bold text-2xl mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          Статистика
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Янгиликлар */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FilePlus className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.news}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium text-sm">
              Жами янгиликлар
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              Барча эълон қилинган хабарлар
            </p>
          </div>

          {/* Зиёратчилар */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.visitors}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium text-sm">
              Бугунги зиёратчилар
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              Бугун сайтга ташриф буюрганлар
            </p>
          </div>

          {/* Савол-жавоб */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.qaPairs}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium text-sm">
              Савол-жавоблар
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              Фаол саволлар ва жавоблар
            </p>
          </div>

          {/* Намоз вақтлари */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.prayerTimes}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium text-sm">
              Намоз вақтлари
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              Яқинда янгиланган кунлар
            </p>
          </div>
        </div>
      </div>

      {/* Тезкор амалиётлар */}
      <div>
        <h2 className="text-gray-800 font-serif font-bold text-2xl mb-6">
          Тезкор амалиётлар
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/news"
            className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FilePlus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                  Янгилик қўшиш
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">
                  Хабар ва воқеалар
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/prayer-times"
            className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                  Намоз вақтлари
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">
                  Жадвални янгилаш
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/qa"
            className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                  Савол-жавоб
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">
                  Янги савол қўшиш
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
