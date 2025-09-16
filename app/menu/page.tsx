'use client'

import { useState, useEffect } from 'react'
import { getMenusWithCategories } from '../../lib/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Restaurant ID
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
    const [isFlipping, setIsFlipping] = useState(false)

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

    const flipToPage = (newPage: number) => {
        if (newPage === currentPage || isFlipping) return

        setIsFlipping(true)

        // After flip animation completes, change page
        setTimeout(() => {
            setCurrentPage(newPage)
            setIsFlipping(false)
        }, 400) // Half of the animation duration
    }

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            flipToPage(currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 0) {
            flipToPage(currentPage - 1)
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
            {/* Custom CSS for 3D flip effect */}
            <style jsx>{`
        .flip-container {
          perspective: 2000px;
          transform-style: preserve-3d;
        }
        
        .flipper {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s ease-in-out;
        }
        
        .flipper.flipping {
          transform: rotateY(-180deg);
        }
        
        .front, .back {
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .back {
          transform: rotateY(180deg);
        }
        
        .book-shadow {
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .page-curl {
          background: linear-gradient(
            135deg, 
            transparent 0%, 
            rgba(0,0,0,0.05) 100%
          );
          position: absolute;
          top: 0;
          right: 0;
          width: 50px;
          height: 50px;
          border-radius: 0 0 0 50px;
        }
      `}</style>

            {/* Header */}
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-amber-900 mb-2">🍽️ เมนูอาหาร</h1>
                <p className="text-amber-700">ร้านอาหารดีมาก</p>
            </div>

            {/* Flip Book Container */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="relative flip-container">
                    {/* Book */}
                    <div className="flipper" style={{
                        transform: isFlipping ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                        minHeight: '600px'
                    }}>

                        {/* Front side of the page */}
                        <div className="front">
                            <div className="bg-white rounded-2xl book-shadow p-8 min-h-[600px] relative overflow-hidden">
                                {/* Book binding effect */}
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-200 to-amber-100 opacity-50 shadow-inner"></div>

                                {/* Page curl effect */}
                                <div className="page-curl opacity-30"></div>

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
                                        {getCurrentPageMenus().map((menu, index) => (
                                            <div
                                                key={menu.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 bg-white hover:scale-105"
                                                style={{
                                                    animationDelay: `${index * 100}ms`,
                                                    animation: !isFlipping ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                                                }}
                                            >
                                                {/* Menu Image */}
                                                <div className="w-full h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                                    {menu.image ? (
                                                        <img
                                                            src={menu.image}
                                                            alt={menu.nameTh}
                                                            className="w-full h-full object-cover rounded-lg transition-transform hover:scale-110"
                                                        />
                                                    ) : (
                                                        <span className="text-4xl">🍽️</span>
                                                    )}
                                                </div>

                                                {/* Menu Details */}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate" title={menu.nameTh}>
                                                        {menu.nameTh}
                                                    </h3>
                                                    {menu.nameEn && (
                                                        <p className="text-gray-600 text-sm italic mb-2 truncate" title={menu.nameEn}>
                                                            {menu.nameEn}
                                                        </p>
                                                    )}

                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-2xl font-bold text-amber-600">฿{menu.price.toFixed(2)}</p>
                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="พร้อมจำหน่าย"></div>
                                                    </div>

                                                    {menu.description && (
                                                        <p className="text-gray-600 text-sm line-clamp-2" title={menu.description}>
                                                            {menu.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Empty state */}
                                    {getCurrentPageMenus().length === 0 && (
                                        <div className="text-center py-16 text-gray-500">
                                            <div className="text-6xl mb-4">📖</div>
                                            <p className="text-xl">ไม่มีเมนูในหน้านี้</p>
                                            <p className="text-sm mt-2">กลับไปหน้าแรกหรือเพิ่มเมนูใหม่</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Back side of the page (for 3D effect) */}
                        <div className="back">
                            <div className="bg-gray-100 rounded-2xl book-shadow p-8 min-h-[600px] relative overflow-hidden">
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-300 to-gray-200 opacity-50"></div>
                                <div className="mr-8 flex items-center justify-center h-full">
                                    <div className="text-center text-gray-500">
                                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto mb-4"></div>
                                        <p>กำลังพลิกหน้า...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-4">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 0 || isFlipping}
                            className={`p-3 rounded-full shadow-xl transition-all duration-300 transform ${currentPage === 0 || isFlipping
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-95'
                                : 'bg-white text-amber-600 hover:bg-amber-50 hover:shadow-2xl hover:scale-110 active:scale-95'
                                }`}
                            title="หน้าก่อนหน้า"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </div>

                    <div className="absolute top-1/2 transform -translate-y-1/2 right-4">
                        <button
                            onClick={nextPage}
                            disabled={currentPage >= totalPages - 1 || isFlipping}
                            className={`p-3 rounded-full shadow-xl transition-all duration-300 transform ${currentPage >= totalPages - 1 || isFlipping
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-95'
                                : 'bg-white text-amber-600 hover:bg-amber-50 hover:shadow-2xl hover:scale-110 active:scale-95'
                                }`}
                            title="หน้าถัดไป"
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
                            onClick={() => flipToPage(index)}
                            disabled={isFlipping}
                            className={`transition-all duration-300 ${index === currentPage
                                ? 'w-8 h-3 bg-amber-600 rounded-full scale-125'
                                : 'w-3 h-3 bg-amber-300 rounded-full hover:bg-amber-400 hover:scale-110'
                                }`}
                            title={`หน้า ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Reading Progress */}
                <div className="mt-4">
                    <div className="bg-amber-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
                            style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-center text-sm text-amber-700 mt-2">
                        อ่านไปแล้ว {Math.round(((currentPage + 1) / totalPages) * 100)}%
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-8">
                <a
                    href="/admin"
                    className="text-amber-700 hover:text-amber-900 text-sm underline transition-colors"
                >
                    จัดการเมนู (Admin)
                </a>
            </div>

            {/* Animation Keyframes */}
            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    )
}