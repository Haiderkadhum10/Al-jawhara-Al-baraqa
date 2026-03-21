import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Home, ShoppingBag, Info, Phone, User } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import type { Product } from "@/types/product";

interface NavLinkItem {
  path: string;
  label: string;
}

interface HeaderSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  products: Product[];
  navLinks: NavLinkItem[];
}

export function HeaderSearchDialog({
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
  products,
  navLinks,
}: HeaderSearchDialogProps) {
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          (product.nameEn || "").toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [products, searchQuery]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div dir="rtl">
        <CommandInput
          placeholder="ابحث عن المنتجات..."
          className="text-right"
          value={searchQuery}
          onValueChange={onSearchQueryChange}
        />
        <CommandList className="text-right">
          <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>

          {searchQuery.trim().length > 0 && (
            <CommandGroup heading="المنتجات">
              {filteredProducts.map((product) => (
                <CommandItem
                  key={`search-${product.id}`}
                  onSelect={() => {
                    onOpenChange(false);
                    onSearchQueryChange("");
                    navigate(`/products/${product.id}`);
                  }}
                  className="flex justify-start gap-3 py-2 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 text-right">
                    <span className="font-bold text-sm line-clamp-1">{product.name}</span>
                    <span className="text-[10px] text-muted-foreground">{product.price} د.ع</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchQuery.trim().length === 0 && (
            <CommandGroup heading="روابط سريعة">
              {navLinks.map((link) => {
                let Icon = Sparkles;
                if (link.path === "/") Icon = Home;
                if (link.path === "/products") Icon = ShoppingBag;
                if (link.path === "/about") Icon = Info;
                if (link.path === "/contact") Icon = Phone;

                return (
                  <CommandItem
                    key={link.path}
                    onSelect={() => {
                      onOpenChange(false);
                      navigate(link.path);
                    }}
                    className="flex justify-start gap-3 py-3"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{link.label}</span>
                  </CommandItem>
                );
              })}
              <CommandItem
                onSelect={() => {
                  onOpenChange(false);
                  navigate("/login");
                }}
                className="flex justify-start gap-3 py-3"
              >
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">حسابي</span>
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </div>
    </CommandDialog>
  );
}
