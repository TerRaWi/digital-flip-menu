// lib/database-schema.js
import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase'

// Sample Restaurant Data
export const sampleRestaurant = {
    name: "ร้านอาหารดีมาก",
    nameEn: "Good Food Restaurant",
    description: "ร้านอาหารไทยต้นตำรับ",
    phone: "081-234-5678",
    address: "123 ถนนสุขุมวิท กรุงเทพฯ",
    ownerId: "admin",
    settings: {
        theme: "classic",
        currency: "THB",
        language: "th",
        itemsPerPage: 6
    }
}

// Sample Categories
export const sampleCategories = [
    {
        name: "อาหารจานเดียว",
        nameEn: "One Dish Meals",
        color: "#FF6B6B",
        icon: "🍛",
        order: 1,
        isActive: true
    },
    {
        name: "อาหารคาว",
        nameEn: "Main Dishes",
        color: "#4ECDC4",
        icon: "🍽️",
        order: 2,
        isActive: true
    },
    {
        name: "ของหวาน",
        nameEn: "Desserts",
        color: "#45B7D1",
        icon: "🍰",
        order: 3,
        isActive: true
    },
    {
        name: "เครื่องดื่ม",
        nameEn: "Beverages",
        color: "#F39C12",
        icon: "🥤",
        order: 4,
        isActive: true
    }
]

// Sample Menus
export const sampleMenus = [
    {
        nameTh: "ข้าวผัดกุ้ง",
        nameEn: "Fried Rice with Shrimp",
        description: "ข้าวผัดกุ้งสดใหม่ เสิร์ฟพร้อมผักสด และไข่ดาว",
        price: 120,
        categoryName: "อาหารจานเดียว",
        status: "available",
        order: 1
    },
    {
        nameTh: "ผัดไทย",
        nameEn: "Pad Thai",
        description: "ผัดไทยแท้ รสชาติต้นตำรับ",
        price: 80,
        categoryName: "อาหารจานเดียว",
        status: "available",
        order: 2
    },
    {
        nameTh: "ต้มยำกุ้ง",
        nameEn: "Tom Yum Goong",
        description: "ต้มยำกุ้งใส รสจัดจ้าน เปรี้ยว เผ็ด เค็ม หวาน ครบรส",
        price: 150,
        categoryName: "อาหารคาว",
        status: "available",
        order: 1
    },
    {
        nameTh: "แกงเขียวหวานไก่",
        nameEn: "Green Curry Chicken",
        description: "แกงเขียวหวานไก่ รสชาติเข้มข้น เสิร์ฟพร้อมข้าวสวย",
        price: 130,
        categoryName: "อาหารคาว",
        status: "available",
        order: 2
    },
    {
        nameTh: "มะม่วงข้าวเหนียว",
        nameEn: "Mango Sticky Rice",
        description: "ข้าวเหนียวหวาน เสิร์ฟพร้อมมะม่วงสุก",
        price: 60,
        categoryName: "ของหวาน",
        status: "available",
        order: 1
    },
    {
        nameTh: "น้ำมะนาว",
        nameEn: "Lime Juice",
        description: "น้ำมะนาวสดใหม่ หวานเปรี้ยว สดชื่น",
        price: 35,
        categoryName: "เครื่องดื่ม",
        status: "available",
        order: 1
    }
]

// Function to create sample data
export async function createSampleData() {
    try {
        // Create restaurant
        const restaurantDoc = await addDoc(collection(db, 'restaurants'), {
            ...sampleRestaurant,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const restaurantId = restaurantDoc.id

        // Create categories with restaurantId
        const categoryIds = {}
        for (const category of sampleCategories) {
            const categoryDoc = await addDoc(collection(db, 'categories'), {
                ...category,
                restaurantId,
                createdAt: new Date()
            })
            categoryIds[category.name] = categoryDoc.id
        }

        // Create menus with restaurantId and categoryId
        for (const menu of sampleMenus) {
            await addDoc(collection(db, 'menus'), {
                ...menu,
                restaurantId,
                categoryId: categoryIds[menu.categoryName],
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }

        return { success: true, restaurantId }

    } catch (error) {
        return { success: false, error: error.message }
    }
}