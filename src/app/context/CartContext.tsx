import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/types/product";
import { parsePrice } from "@/lib/utils";

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number, maxStock?: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem("shaka_cart");
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            // تصفية العناصر التي تحمل معرفات قديمة (ليست UUID) لتجنب أخطاء الداتابيس
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return Array.isArray(parsed) 
                ? parsed.filter((item: any) => uuidRegex.test(item.id))
                : [];
        } catch (e) {
            console.error("Error parsing cart:", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("shaka_cart", JSON.stringify(items));
    }, [items]);



    const addToCart = (product: Product, quantity: number) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            const available = product.stock ?? Infinity;

            if (existing) {
                const newQuantity = Math.min(existing.quantity + quantity, available);
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity, stock: available }
                        : item
                );
            }
            const initialQuantity = Math.min(quantity, available);
            return [...prev, { ...product, quantity: initialQuantity }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number, maxStock?: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === productId) {
                    const available = maxStock ?? item.stock ?? Infinity;
                    const safeQuantity = Math.min(quantity, available);
                    return { ...item, quantity: safeQuantity, stock: available };
                }
                return item;
            })
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + parsePrice(item.price) * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
