import React, { createContext, useState, useEffect, useContext } from "react";
import type { Product } from "@/types/product";
import { products as staticProducts } from "@/lib/data/products";
import { supabase } from "@/lib/supabase";
import { fetchAllProducts } from "@/lib/services/productsService";
import { logger } from "@/lib/logger";

interface ProductContextType {
    products: Product[];
    allProducts: Product[];
    loading: boolean;
    refreshProducts: () => Promise<void>;
    updateStock: (purchasedItems: { id: string, quantity: number }[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchAllProducts(1000);
            setAllProducts(data || []);
        } catch (err) {
            logger.error("Unexpected error fetching products", err, { feature: "products", action: "contextFetch" });
            setAllProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const updateStock = (purchasedItems: { id: string, quantity: number }[]) => {
        setAllProducts(prevProducts => prevProducts.map(p => {
            const purchased = purchasedItems.find(item => item.id === p.id);
            if (purchased && p.stock !== undefined) {
                return { ...p, stock: Math.max(0, p.stock - purchased.quantity) };
            }
            return p;
        }));
    };

    const activeProducts = React.useMemo(() => {
        return allProducts.filter(p => !p.status || p.status === 'active');
    }, [allProducts]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{
                products: activeProducts,
                allProducts,
                loading,
                refreshProducts: fetchProducts,
                updateStock,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
}
