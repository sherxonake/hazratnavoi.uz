"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase/server"

interface QAPair {
  id: string
  question: string
  answer: string
  category: string | null
  order_num: number
  published: boolean
}

export default function AdminQAPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [qaPairs, setQAPairs] = useState<QAPair[]>([])
  const [isAdding, setIsAdding] = useState(false)
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order_num: 10
  })

  useEffect(() => {
    loadQAPairs()
  }, [])

  async function loadQAPairs() {
    try {
      const { data, error } = await supabaseAdmin
        .from('qa_pairs')
        .select('*')
        .order('order_num', { ascending: true })

      if (error) throw error
      setQAPairs(data || [])
    } catch (error) {
      console.error('Error loading QA pairs:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabaseAdmin.from('qa_pairs').insert({
        question: formData.question,
        answer: formData.answer,
        category: formData.category || null,
        order_num: formData.order_num,
        published: true,
      })

      if (error) throw error

      setMessage({ type: 'success', text: '✅ Савол-жавоб муваффақиятли қўшилди!' })
      
      setFormData({
        question: '',
        answer: '',
        category: '',
        order_num: 10
      })
      setIsAdding(false)
      loadQAPairs()

    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: '❌ Хатолик юз берди! Илтимос, қайта урининг.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ўчиришни истайсизми?')) return

    try {
      const { error } = await supabaseAdmin.from('qa_pairs').delete().eq('id', id)
      if (error) throw error
      
      setMessage({ type: 'success', text: '✅ Ўчирилди!' })
      loadQAPairs()
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Хатолик юз берди!' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
            Савол-жавоб
          </h1>
          <p className="text-gray-600">
            Саволлар ва жавобларни бошқариш
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          {isAdding ? 'Бекор қилиш' : 'Янги қўшиш'}
        </button>
      </div>

      {/* Сообщение */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Форма добавления */}
      {isAdding && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Янги савол-жавоб қўшиш
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Савол
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Масалан: Жума намози қачон ўқилади?"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Жавоб
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Жавобни ёзинг..."
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Масалан: Намоз"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тартиб рақами
                </label>
                <input
                  type="number"
                  value={formData.order_num}
                  onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Сақланмоқда...' : 'Сақлаш'}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Бекор қилиш
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список вопросов */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Мавжуд савол-жавоблар ({qaPairs.length})
        </h2>

        <div className="space-y-4">
          {qaPairs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Ҳали савол-жавоблар йўқ
            </p>
          ) : (
            qaPairs.map((qa) => (
              <div
                key={qa.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {qa.question}
                    </h3>
                    {qa.category && (
                      <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                        {qa.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(qa.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Ўчириш"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {qa.answer}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span>Тартиб: {qa.order_num}</span>
                  <span className={qa.published ? 'text-green-600' : 'text-gray-400'}>
                    {qa.published ? 'Эълон қилинган' : 'Қора тайёр'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
