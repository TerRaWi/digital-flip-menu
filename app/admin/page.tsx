'use client'

import { useState, useEffect } from 'react'
import { getAllMenusWithCategories, createMenu, updateMenu, deleteMenu } from '../../lib/api'
import { Plus, Edit2, Trash2, Save, X, Home } from 'lucide-react'

// ใส่ Restaurant ID ที่ได้จากการทดสอบ
const RESTAURANT_ID = 'UeorBo3lcwbczVRiNJz3'

interface Menu {
    id: string
    nameTh: string
    nameEn?: string
    price: number
    description?: string
    categoryId: string
    status: string
    order: number
}

interface Category {
    id: string
    name: string
    nameEn?: string
    color: string
    icon: string
    order: number
    menus: Menu[]
}

export default function AdminPanel() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')

    // Form state
    const [formData, setFormData] = useState({
        nameTh: '',
        nameEn: '',
        price: 0,
        description: '',
        categoryId: '',
        status: 'available'
    })

    // Load data
    useEffect(() => {
        loadMenuData()
    }, [])

    const loadMenuData = async () => {
        setLoading(true)
        try {
            const result = await getAllMenusWithCategories(RESTAURANT_ID)
            if (result.success) {
                setCategories(result.data)
            } else {
                console.error('Failed to load menu data:', result.error)
                alert('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + result.error)
            }
        } catch (error) {
            console.error('Error loading menu data:', error)
            alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
        setLoading(false)
    }

    // Handle form
    const resetForm = () => {
        setFormData({
            nameTh: '',
            nameEn: '',
            price: 0,
            description: '',
            categoryId: '',
            status: 'available'
        })
        setEditingMenu(null)
        setShowAddForm(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.nameTh.trim()) {
            alert('กรุณาใส่ชื่อเมนูภาษาไทย')
            return
        }

        if (!formData.categoryId) {
            alert('กรุณาเลือกหมวดหมู่')
            return
        }

        const menuData = {
            ...formData,
            restaurantId: RESTAURANT_ID,
            order: editingMenu ? editingMenu.order : Date.now()
        }

        let result
        if (editingMenu) {
            result = await updateMenu(editingMenu.id, menuData)
        } else {
            result = await createMenu(menuData)
        }

        if (result.success) {
            await loadMenuData()
            resetForm()
            alert(editingMenu ? 'แก้ไขเมนูสำเร็จ!' : 'เพิ่มเมนูสำเร็จ!')
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.error)
        }
    }

    const handleEdit = (menu: Menu) => {
        setEditingMenu(menu)
        setFormData({
            nameTh: menu.nameTh,
            nameEn: menu.nameEn || '',
            price: menu.price,
            description: menu.description || '',
            categoryId: menu.categoryId,
            status: menu.status
        })
        setShowAddForm(true)
    }

    const handleDelete = async (menuId: string, menuName: string) => {
        if (confirm(`คุณต้องการลบเมนู "${menuName}" หรือไม่?`)) {
            const result = await deleteMenu(menuId)
            if (result.success) {
                await loadMenuData()
                alert('ลบเมนูสำเร็จ!')
            } else {
                alert('เกิดข้อผิดพลาด: ' + result.error)
            }
        }
    }

    const handleAddNew = (categoryId?: string) => {
        setFormData({
            ...formData,
            categoryId: categoryId || categories[0]?.id || ''
        })
        setShowAddForm(true)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800'
            case 'unavailable':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'พร้อม'
            case 'unavailable':
                return 'ไม่พร้อม'
            default:
                return status
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <a
                                href="/"
                                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="กลับหน้าแรก"
                            >
                                <Home size={20} />
                            </a>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">จัดการเมนูอาหาร</h1>
                                <p className="text-gray-600">เพิ่ม แก้ไข และจัดการเมนูของร้าน</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleAddNew()}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            เพิ่มเมนูใหม่
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">จำนวนหมวดหมู่</h3>
                        <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">เมนูทั้งหมด</h3>
                        <p className="text-2xl font-semibold text-gray-900">
                            {categories.reduce((total, cat) => total + cat.menus.length, 0)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">พร้อมจำหน่าย</h3>
                        <p className="text-2xl font-semibold text-green-600">
                            {categories.reduce((total, cat) =>
                                total + cat.menus.filter(m => m.status === 'available').length, 0
                            )}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">ไม่พร้อมจำหน่าย</h3>
                        <p className="text-2xl font-semibold text-yellow-600">
                            {categories.reduce((total, cat) =>
                                total + cat.menus.filter(m => m.status === 'unavailable').length, 0
                            )}
                        </p>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    {editingMenu ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ชื่อเมนู (ไทย) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.nameTh}
                                            onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="เช่น ข้าวผัดกุ้ง"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ชื่อเมนู (English)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nameEn}
                                            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g. Fried Rice with Shrimp"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ราคา (บาท) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="150.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            หมวดหมู่ *
                                        </label>
                                        <select
                                            required
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">เลือกหมวดหมู่</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.icon} {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            สถานะ
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="available">พร้อมจำหน่าย</option>
                                            <option value="unavailable">ไม่พร้อมจำหน่าย</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        รายละเอียด
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="รายละเอียดของเมนู..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Save size={16} />
                                        {editingMenu ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Categories and Menus */}
                <div className="space-y-8">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white rounded-lg shadow-sm">
                            <div
                                className="p-4 border-b flex items-center justify-between"
                                style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{category.icon}</span>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {category.name}
                                        </h2>
                                        {category.nameEn && (
                                            <p className="text-sm text-gray-600">{category.nameEn}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {category.menus.length} รายการ
                                    </span>
                                    <button
                                        onClick={() => handleAddNew(category.id)}
                                        className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                                        title="เพิ่มเมนูในหมวดหมู่นี้"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                {category.menus.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>ยังไม่มีเมนูในหมวดหมู่นี้</p>
                                        <button
                                            onClick={() => handleAddNew(category.id)}
                                            className="text-blue-500 hover:text-blue-600 mt-2"
                                        >
                                            + เพิ่มเมนูแรก
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {category.menus.map((menu) => (
                                            <div key={menu.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900">{menu.nameTh}</h3>
                                                        {menu.nameEn && (
                                                            <p className="text-sm text-gray-600 italic">{menu.nameEn}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1 ml-2">
                                                        <button
                                                            onClick={() => handleEdit(menu)}
                                                            className="text-blue-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                                                            title="แก้ไขเมนู"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(menu.id, menu.nameTh)}
                                                            className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                                            title="ลบเมนู"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <div className="flex-1">
                                                        <p className="text-lg font-semibold text-blue-600">
                                                            ฿{menu.price.toFixed(2)}
                                                        </p>
                                                        {menu.description && (
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                                {menu.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded ml-2 ${getStatusBadge(menu.status)}`}>
                                                        {getStatusText(menu.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg mb-2">ยังไม่มีหมวดหมู่เมนู</p>
                        <p className="text-sm mb-4">เพิ่มข้อมูลตัวอย่างเพื่อเริ่มต้นใช้งาน</p>
                        <a
                            href="/"
                            className="text-blue-500 hover:text-blue-600"
                        >
                            กลับไปหน้าแรกเพื่อสร้างข้อมูลตัวอย่าง
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}