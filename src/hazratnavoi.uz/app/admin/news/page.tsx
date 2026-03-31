"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"

export default function AdminNewsPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
          Янгилик қўшиш
        </h1>
        <p className="text-gray-600">
          Масжидимиз янгиликлари учун янги хабар яратинг
        </p>
      </div>

      <form className="space-y-6">
        {/* Расм юклаш */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Хабар расми
          </label>
          
          {imagePreview ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={imagePreview}
                alt="Расм кўриниши"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Расмни ўчириш"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <span className="text-sm text-gray-600 font-medium">
                Расм юклаш учун босинг
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG (макс. 5MB)
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Сарлавҳа */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
            Сарлавҳа
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Масалан: Рамазон ойи муборак бўлсин!"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Матн */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-3">
            Хабар матни
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Хабарнинг тўлиқ матнини ёзинг..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            {content.length} та белги
          </p>
        </div>

        {/* Тугмалар */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Чоп этиш
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300"
          >
            Қора тайёр
          </button>
        </div>
      </form>
    </div>
  )
}
