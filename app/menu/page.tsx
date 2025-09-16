'use client'

import { useState, useEffect } from 'react'
import { getMenusWithCategories } from '../../lib/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Restaurant ID (ใส่ ID จริง)
const RESTAURANT_ID = 'UeorBo3lcwbczVRiNJz3'

interface Menu {
    id: string
    nameTh: string
    nameEn?: string
    price: number
    description?: string
    image?: string
}

interface Category {
    id: string
    name: string
    nameEn?: string
    color: string
    icon: string
    menus: Menu[]
}

export default function CustomerMenu() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const ITEMS_PER_PAGE = 6

    useEffect(() => {
        loadMenuData()
    }, [])

    const loadMenuData = async () => {
        setLoading(true)
        const result = await getMenusWithCategories(RESTAURANT_ID)
        if (result.success) {
            setCategories(result.data)

            // Calculate total pages
            const totalItems = result.data.reduce((total: number, cat: any) => total + cat.menus.length, 0)
            setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE))
        }
        setLoading(false)
    }

    // Get all menus flattened
    const getAllMenus = () => {
        return categories.reduce((allMenus: Menu[], category) => {
            return [...allMenus, ...category.menus]
        }, [])
    }

    // Get menus for current page
    const getCurrentPageMenus = () => {
        const allMenus = getAllMenus()
        const startIndex = currentPage * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return allMenus.slice(startIndex, endIndex)
    }

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-amber-800 font-medium">กำลังโหลดเมนู...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
            {/* Header */}
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-amber-900 mb-2">🍽️ เมนูอาหาร</h1>
                <p className="text-amber-700">ร้านอาหารดีมาก</p>
            </div>

            {/* Flip Book Container */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="relative">
                    {/* Book */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 min-h-[600px] relative overflow-hidden">
                        {/* Book binding effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-200 to-amber-100 opacity-50"></div>

                        {/* Page content */}
                        <div className="ml-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    หน้า {currentPage + 1} จาก {totalPages}
                                </h2>
                                <div className="text-sm text-gray-500">
                                    {getAllMenus().length} รายการ
                                </div>
                            </div>

                            {/* Menu Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {getCurrentPageMenus().map((menu) => (
                                    <div key={menu.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                                        {/* Menu Image Placeholder */}
                                        <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                            {menu.image ? (
                                                <img src={menu.image} alt={menu.nameTh} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <span className="text-4xl">🍽️</span>
                                            )}
                                        </div>

                                        {/* Menu Details */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{menu.nameTh}</h3>
                                            {menu.nameEn && (
                                                <p className="text-gray-600 text-sm italic mb-2">{menu.nameEn}</p>
                                            )}

                                            <div className="flex justify-between items-center">
                                                <p className="text-2xl font-bold text-amber-600">฿{menu.price.toFixed(2)}</p>
                                            </div>

                                            {menu.description && (
                                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{menu.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty state */}
                            {getCurrentPageMenus().length === 0 && (
                                <div className="text-center py-16 text-gray-500">
                                    <p className="text-xl">ไม่มีเมนูในหน้านี้</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-4">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            className={`p-3 rounded-full shadow-lg transition-all ${currentPage === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-amber-600 hover:bg-amber-50 hover:shadow-xl'
                                }`}
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </div>

                    <div className="absolute top-1/2 transform -translate-y-1/2 right-4">
                        <button
                            onClick={nextPage}
                            disabled={currentPage >= totalPages - 1}
                            className={`p-3 rounded-full shadow-lg transition-all ${currentPage >= totalPages - 1
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-amber-600 hover:bg-amber-50 hover:shadow-xl'
                                }`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Page Indicators */}
                <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentPage
                                    ? 'bg-amber-600 scale-125'
                                    : 'bg-amber-300 hover:bg-amber-400'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-8">
                <a
                    href="/admin"
                    className="text-amber-700 hover:text-amber-900 text-sm underline"
                >
                    จัดการเมนู (Admin)
                </a>
            </div>
        </div>
    )
}