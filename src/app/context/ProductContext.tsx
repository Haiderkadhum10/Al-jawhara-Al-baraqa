import React, { createContext, useState, useEffect, useContext } from "react";
import type { Product } from "@/types/product";
import { products as staticProducts } from "@/lib/data/products";
import { supabase } from "@/lib/supabase";

interface ProductContextType {
    products: Product[];
    loading: boolean;
    refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("products")
                .select("id, name, nameEn, price, image, category, description, rating, status, created_at")
                .eq("status", "active")
                .order("created_at", { ascending: false })
                .limit(100);

            if (error) {
                // eslint-disable-next-line no-console
                console.error("Error fetching products from Supabase:", error);
                setProducts(staticProducts);
            } else if (data && data.length > 0) {
                setProducts(data as Product[]);
            } else {
                setProducts(staticProducts);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Unexpected error fetching products:", err);
            setProducts(staticProducts);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                refreshProducts: fetchProducts,
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
