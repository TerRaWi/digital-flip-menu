// lib/api.js
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    writeBatch
} from 'firebase/firestore'
import { db } from './firebase'

// ================== RESTAURANTS ==================

export async function createRestaurant(restaurantData) {
    try {
        const docRef = await addDoc(collection(db, 'restaurants'), {
            ...restaurantData,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        return { success: true, id: docRef.id }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function getRestaurant(restaurantId) {
    try {
        const docRef = doc(db, 'restaurants', restaurantId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } }
        } else {
            return { success: false, error: 'Restaurant not found' }
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function updateRestaurant(restaurantId, updateData) {
    try {
        const restaurantRef = doc(db, 'restaurants', restaurantId)
        await updateDoc(restaurantRef, {
            ...updateData,
            updatedAt: new Date()
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// ================== CATEGORIES ==================

export async function createCategory(categoryData) {
    try {
        const docRef = await addDoc(collection(db, 'categories'), {
            ...categoryData,
            createdAt: new Date()
        })
        return { success: true, id: docRef.id }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function getCategoriesByRestaurant(restaurantId) {
    try {
        const q = query(
            collection(db, 'categories'),
            where('restaurantId', '==', restaurantId),
            where('isActive', '==', true),
            orderBy('order', 'asc')
        )

        const querySnapshot = await getDocs(q)
        const categories = []

        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() })
        })

        return { success: true, data: categories }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function updateCategory(categoryId, updateData) {
    try {
        const categoryRef = doc(db, 'categories', categoryId)
        await updateDoc(categoryRef, updateData)
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function deleteCategory(categoryId) {
    try {
        const categoryRef = doc(db, 'categories', categoryId)
        await updateDoc(categoryRef, { isActive: false })
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// ================== MENUS ==================

export async function createMenu(menuData) {
    try {
        const docRef = await addDoc(collection(db, 'menus'), {
            ...menuData,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        return { success: true, id: docRef.id }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Get menus for customer view (only available status)
export async function getMenusByRestaurant(restaurantId) {
    try {
        const q = query(
            collection(db, 'menus'),
            where('restaurantId', '==', restaurantId),
            where('status', '==', 'available'),
            orderBy('order', 'asc')
        )

        const querySnapshot = await getDocs(q)
        const menus = []

        querySnapshot.forEach((doc) => {
            menus.push({ id: doc.id, ...doc.data() })
        })

        return { success: true, data: menus }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Get ALL menus for admin view (all statuses except deleted)
export async function getAllMenusByRestaurant(restaurantId) {
    try {
        const q = query(
            collection(db, 'menus'),
            where('restaurantId', '==', restaurantId),
            orderBy('order', 'asc')
        )

        const querySnapshot = await getDocs(q)
        const menus = []

        querySnapshot.forEach((doc) => {
            const data = doc.data()
            // Filter out deleted menus but show all other statuses
            if (data.status !== 'deleted') {
                menus.push({ id: doc.id, ...data })
            }
        })

        return { success: true, data: menus }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function getMenusByCategory(restaurantId, categoryId) {
    try {
        const q = query(
            collection(db, 'menus'),
            where('restaurantId', '==', restaurantId),
            where('categoryId', '==', categoryId),
            where('status', '==', 'available'),
            orderBy('order', 'asc')
        )

        const querySnapshot = await getDocs(q)
        const menus = []

        querySnapshot.forEach((doc) => {
            menus.push({ id: doc.id, ...doc.data() })
        })

        return { success: true, data: menus }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function getMenuById(menuId) {
    try {
        const docRef = doc(db, 'menus', menuId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return {
                success: true,
                data: { id: docSnap.id, ...docSnap.data() }
            }
        } else {
            return { success: false, error: 'Menu not found' }
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function updateMenu(menuId, updateData) {
    try {
        const menuRef = doc(db, 'menus', menuId)
        await updateDoc(menuRef, {
            ...updateData,
            updatedAt: new Date()
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function deleteMenu(menuId) {
    try {
        const menuRef = doc(db, 'menus', menuId)
        await updateDoc(menuRef, {
            status: 'deleted',
            updatedAt: new Date()
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// ================== BATCH OPERATIONS ==================

export async function reorderMenus(menuUpdates) {
    try {
        const batch = writeBatch(db)

        menuUpdates.forEach(({ id, order }) => {
            const menuRef = doc(db, 'menus', id)
            batch.update(menuRef, {
                order: order,
                updatedAt: new Date()
            })
        })

        await batch.commit()
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function reorderCategories(categoryUpdates) {
    try {
        const batch = writeBatch(db)

        categoryUpdates.forEach(({ id, order }) => {
            const categoryRef = doc(db, 'categories', id)
            batch.update(categoryRef, { order: order })
        })

        await batch.commit()
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// ================== UTILITY FUNCTIONS ==================

// For customer view - only available menus
export async function getMenusWithCategories(restaurantId) {
    try {
        // Get categories
        const categoriesResult = await getCategoriesByRestaurant(restaurantId)
        if (!categoriesResult.success) {
            return categoriesResult
        }

        // Get menus (only available)
        const menusResult = await getMenusByRestaurant(restaurantId)
        if (!menusResult.success) {
            return menusResult
        }

        // Group menus by category
        const categoriesWithMenus = categoriesResult.data.map(category => ({
            ...category,
            menus: menusResult.data.filter(menu => menu.categoryId === category.id)
        }))

        return { success: true, data: categoriesWithMenus }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// For admin view - all menus (including unavailable)
export async function getAllMenusWithCategories(restaurantId) {
    try {
        // Get categories
        const categoriesResult = await getCategoriesByRestaurant(restaurantId)
        if (!categoriesResult.success) {
            return categoriesResult
        }

        // Get ALL menus (all statuses except deleted)
        const menusResult = await getAllMenusByRestaurant(restaurantId)
        if (!menusResult.success) {
            return menusResult
        }

        // Group menus by category
        const categoriesWithMenus = categoriesResult.data.map(category => ({
            ...category,
            menus: menusResult.data.filter(menu => menu.categoryId === category.id)
        }))

        return { success: true, data: categoriesWithMenus }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Search menus
export async function searchMenus(restaurantId, searchTerm) {
    try {
        const menusResult = await getMenusByRestaurant(restaurantId)
        if (!menusResult.success) {
            return menusResult
        }

        const filteredMenus = menusResult.data.filter(menu =>
            menu.nameTh.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (menu.nameEn && menu.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (menu.description && menu.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )

        return { success: true, data: filteredMenus }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Get menu statistics for admin dashboard
export async function getMenuStats(restaurantId) {
    try {
        const menusResult = await getAllMenusByRestaurant(restaurantId)
        if (!menusResult.success) {
            return menusResult
        }

        const stats = {
            total: menusResult.data.length,
            available: menusResult.data.filter(m => m.status === 'available').length,
            unavailable: menusResult.data.filter(m => m.status === 'unavailable').length,
            byCategory: {}
        }

        // Count by category
        menusResult.data.forEach(menu => {
            if (!stats.byCategory[menu.categoryId]) {
                stats.byCategory[menu.categoryId] = 0
            }
            stats.byCategory[menu.categoryId]++
        })

        return { success: true, data: stats }
    } catch (error) {
        return { success: false, error: error.message }
    }
}