"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  FilePlus,
  Clock,
  MessageSquare,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  {
    title: "Бош саҳифа",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Янгиликлар қўшиш",
    href: "/admin/news",
    icon: FilePlus,
    highlight: true,
  },
  {
    title: "Намоз вақтлари",
    href: "/admin/prayer-times",
    icon: Clock,
  },
  {
    title: "Савол-жавоб",
    href: "/admin/qa",
    icon: MessageSquare,
  },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Login саҳифасида sidebar кўрсатмаслик
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 bg-emerald-800 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-700">
          <div>
            <h1 className="text-white font-serif font-bold text-xl">
              HazratNavoi
            </h1>
            <p className="text-emerald-300 text-xs mt-0.5">
              Админ панел
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-emerald-300 hover:text-white transition-colors"
            aria-label="Ёпиш"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  item.highlight
                    ? "bg-yellow-500 hover:bg-yellow-400 text-emerald-900 font-semibold"
                    : isActive
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-100 hover:bg-emerald-700 hover:text-white"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    item.highlight
                      ? "text-emerald-900"
                      : isActive
                      ? "text-white"
                      : "text-emerald-300 group-hover:text-white"
                  )}
                />
                <span className="text-sm">{item.title}</span>
                {item.highlight && (
                  <span className="ml-auto text-xs bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded-full">
                    Янги
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-700">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 text-emerald-100 hover:bg-emerald-700 hover:text-white rounded-lg transition-all duration-200"
            onClick={() => {
              document.cookie = 'admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
              window.location.href = '/admin/login'
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Чиқиш</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Меню"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumbs / Title */}
            <div className="hidden lg:block">
              <h2 className="text-gray-800 font-semibold text-lg">
                Админ панел
              </h2>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-gray-800 font-semibold text-sm">
                  Ассалому алайкум, Ҳаёт!
                </p>
                <p className="text-gray-500 text-xs">
                  Администратор
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-300">
                <span className="text-emerald-700 font-bold text-sm">
                  Ҳ
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
