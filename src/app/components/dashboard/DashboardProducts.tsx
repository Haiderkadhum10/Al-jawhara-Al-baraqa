import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Image as ImageIcon,
  Settings2,
  Archive,
  History,
  RotateCcw,
  Bell,
  AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useProducts } from "../../context/ProductContext";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export function DashboardProducts() {
  const { products, loading, refreshProducts } = useProducts();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("edit");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isManageCatsOpen, setIsManageCatsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<"archived" | "deleted">("archived");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    actionLabel?: string;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => { },
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const activeProducts = useMemo(
    () => products.filter((p: any) => p.status === 'active' || !p.status),
    [products],
  );
  const archivedProducts = useMemo(
    () => products.filter((p: any) => p.status === 'archived'),
    [products],
  );
  const deletedProducts = useMemo(
    () => products.filter((p: any) => p.status === 'deleted'),
    [products],
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((p: any) => p.category))).filter(Boolean),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return activeProducts;
    const lower = q.toLowerCase();
    return activeProducts.filter((p: any) =>
      p.name.includes(q) || p.nameEn.toLowerCase().includes(lower)
    );
  }, [activeProducts, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage, PAGE_SIZE]);

  const handleDelete = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setConfirmConfig({
      open: true,
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من رغبتك في حذف "${product.name}"؟ سينتقل المنتج إلى سجل المحذوفات ويمكنك استعادته لاحقاً.`,
      actionLabel: "نقل لسجل المحذوفات",
      variant: "destructive",
      onConfirm: async () => {
        const { error } = await supabase
          .from('products')
          .update({ status: 'deleted' })
          .eq('id', id);

        if (error) {
          showToast(`فشل الحذف: ${error.message}`, "error");
        } else {
          showToast(`تم نقل "${product.name}" إلى سلة المحذوفات`, "info");
          refreshProducts();
        }
      }
    });
  };

  const handleArchive = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const { error } = await supabase
        .from('products')
        .update({ status: 'archived' })
        .eq('id', id);

      if (error) {
        showToast(`فشلت الأرشفة: ${error.message}`, "error");
      } else {
        showToast(`تمت أرشفة "${product.name}" بنجاح`, "success");
        refreshProducts();
      }
    }
  };

  const handleRestore = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const { error } = await supabase
        .from('products')
        .update({ status: 'active' })
        .eq('id', id);

      if (error) {
        showToast(`فشلت الاستعادة: ${error.message}`, "error");
      } else {
        showToast(`تمت استعادة "${product.name}" إلى المتجر`, "success");
        refreshProducts();
      }
    }
  };

  const handlePermanentDelete = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setConfirmConfig({
      open: true,
      title: "حذف نهائي",
      description: `هل أنت متأكد من حذف "${product.name}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء وسيتم مسح بيانات المنتج تماماً.`,
      actionLabel: "حذف للأبد",
      variant: "destructive",
      onConfirm: async () => {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) {
          showToast(`فشل الحذف النهائي: ${error.message}`, "error");
        } else {
          showToast(`تم حذف "${product.name}" نهائياً`, "error");
          refreshProducts();
        }
      }
    });
  };

  const handleAddClick = () => {
    setEditingProduct({
      name: "",
      nameEn: "",
      price: "",
      description: "",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000",
      rating: 5,
      category: "",
      status: "active"
    });
    setDialogMode("add");
    setIsAddingNewCategory(false);
    setNewCategoryName("");
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const finalCategory = isAddingNewCategory ? newCategoryName : editingProduct.category;
    const productToSave = { ...editingProduct, category: finalCategory };

    if (dialogMode === "add") {
      const { error } = await supabase
        .from('products')
        .insert([productToSave]);

      if (error) {
        showToast(`فشلت الإضافة: ${error.message}`, "error");
      } else {
        showToast(`تمت إضافة "${productToSave.name}" بنجاح`, "success");
        refreshProducts();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .update(productToSave)
        .eq('id', editingProduct.id);

      if (error) {
        showToast(`فشل التحديث: ${error.message}`, "error");
      } else {
        showToast(`تم تحديث "${productToSave.name}" بنجاح`, "success");
        refreshProducts();
      }
    }
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (category: string) => {
    setConfirmConfig({
      open: true,
      title: "حذف الفئة بالكامل",
      description: `هل أنت متأكد من رغبتك في حذف فئة "${category}"؟ سيؤدي ذلك لحذف جميع المنتجات التابعة لها نهائياً.`,
      actionLabel: "حذف الفئة والمنتجات",
      variant: "destructive",
      onConfirm: async () => {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('category', category);

        if (error) {
          showToast(`فشل حذف الفئة: ${error.message}`, "error");
        } else {
          showToast(`تم حذف فئة "${category}" ومنتجاتها بنجاح`, "info");
          refreshProducts();
        }
      }
    });
  };

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 10 ميجابايت");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const optimized = await compressImage(result);
        setEditingProduct((prev: any) => prev ? { ...prev, image: optimized } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="بحث عن المنتجات..."
            className="pl-10 pr-4 py-6 rounded-2xl bg-card border-border/50 focus:ring-primary/20 text-right"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsManageCatsOpen(true)}
            className="flex-1 sm:flex-none border-border/50 px-6 py-6 rounded-2xl font-bold bg-card"
          >
            <Settings2 className="w-5 h-5 ml-2" />
            إدارة الفئات
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsHistoryOpen(true)}
            className="flex-1 sm:flex-none border-border/50 px-6 py-6 rounded-2xl font-bold bg-card"
          >
            <History className="w-5 h-5 ml-2" />
            السجل
          </Button>
          <Button
            onClick={handleAddClick}
            className="flex-1 sm:flex-none bg-primary text-white px-8 py-6 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة منتج جديد
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
          <table className="w-full text-right min-w-[600px]">
            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-bold text-xs md:text-sm text-muted-foreground">المنتج</th>
                <th className="px-6 py-4 font-bold text-xs md:text-sm text-muted-foreground">الفئة</th>
                <th className="px-6 py-4 font-bold text-xs md:text-sm text-muted-foreground">السعر</th>
                <th className="px-6 py-4 font-bold text-xs md:text-sm text-muted-foreground text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-border/50">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">{product.nameEn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-muted text-[10px] font-bold">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-primary">{product.price} د.ع</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                        onClick={() => {
                          setEditingProduct(product);
                          setDialogMode("edit");
                          setIsAddingNewCategory(false);
                          setNewCategoryName("");
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-all"
                        onClick={() => handleArchive(product.id)}
                        title="أرشفة"
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                        onClick={() => handleDelete(product.id)}
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            className="px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-bold disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            الصفحة السابقة
          </button>
          <span className="text-sm text-muted-foreground font-bold">
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-bold disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            الصفحة التالية
          </button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-right">
              {dialogMode === "add" ? "إضافة منتج جديد" : "تعديل المنتج"}
            </DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleSave} className="space-y-6 pt-6">
              <div className="flex flex-col items-center gap-4 mb-6">
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Label htmlFor="imageUpload" className="relative cursor-pointer group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-dashed border-primary/20 group-hover:border-primary/50 transition-all shadow-xl">
                    <img src={editingProduct.image} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="text-primary w-8 h-8" />
                    </div>
                  </div>
                </Label>
                <Label htmlFor="imageUpload" className="text-xs font-bold text-primary cursor-pointer hover:underline">
                  تغيير صورة المنتج من الجهاز
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label className="font-bold">اسم المنتج (عربي)</Label>
                  <Input
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl py-6 bg-muted/50 border-border/50 rtl"
                  />
                </div>
                <div className="space-y-2 text-right">
                  <Label className="font-bold">اسم المنتج (English)</Label>
                  <Input
                    required
                    value={editingProduct.nameEn}
                    onChange={(e) => setEditingProduct((prev: any) => ({ ...prev, nameEn: e.target.value }))}
                    className="rounded-xl py-6 bg-muted/50 border-border/50 ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <Label className="font-bold">السعر (د.ع)</Label>
                  <Input
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct((prev: any) => ({ ...prev, price: e.target.value }))}
                    className="rounded-xl py-6 bg-muted/50 border-border/50"
                  />
                </div>
                <div className="space-y-2 text-right">
                  <Label className="font-bold">الفئة</Label>
                  <Select
                    value={isAddingNewCategory ? "new" : editingProduct.category}
                    onValueChange={(value) => {
                      if (value === "new") {
                        setIsAddingNewCategory(true);
                      } else {
                        setIsAddingNewCategory(false);
                        setEditingProduct((prev: any) => ({ ...prev, category: value }));
                      }
                    }}
                  >
                    <SelectTrigger className="rounded-xl py-6 bg-muted/50 border-border/50 text-right h-auto">
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="new" className="text-primary font-bold">
                        + إضافة فئة جديدة...
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isAddingNewCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2 text-right"
                >
                  <Label className="font-bold">اسم الفئة الجديدة</Label>
                  <Input
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="أدخل اسم الفئة الجديدة..."
                    className="rounded-xl py-6 bg-muted/50 border-border/50"
                  />
                </motion.div>
              )}

              <div className="space-y-2 text-right">
                <Label className="font-bold">وصف المنتج</Label>
                <textarea
                  required
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-xl p-4 bg-muted/50 border-border/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <DialogFooter className="flex-row-reverse gap-4 pt-6">
                <Button type="submit" className="flex-1 bg-primary text-white py-6 rounded-2xl font-bold shadow-lg shadow-primary/20">
                  <Check className="w-5 h-5 ml-2" />
                  {dialogMode === "add" ? "إضافة المنتج" : "حفظ التغييرات"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 py-6 rounded-2xl font-bold">
                  إلغاء
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isManageCatsOpen} onOpenChange={setIsManageCatsOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-right">إدارة الفئات</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-6">
            {categories.length > 0 ? (
              <div className="divide-y divide-border/50">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 rounded-xl"
                      onClick={() => handleDeleteCategory(cat)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <span className="font-bold">{cat}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">لا توجد فئات حالياً</p>
            )}
          </div>
          <DialogFooter className="pt-6">
            <Button onClick={() => setIsManageCatsOpen(false)} className="w-full py-6 rounded-2xl font-bold">
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-right">سجل المنتجات</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6 mt-4">
            <Button
              variant={historyTab === "archived" ? "default" : "ghost"}
              className={`flex-1 rounded-lg font-bold ${historyTab === "archived" ? "bg-card text-foreground shadow-sm" : ""}`}
              onClick={() => setHistoryTab("archived")}
            >
              المؤرشفة ({archivedProducts.length})
            </Button>
            <Button
              variant={historyTab === "deleted" ? "default" : "ghost"}
              className={`flex-1 rounded-lg font-bold ${historyTab === "deleted" ? "bg-card text-foreground shadow-sm" : ""}`}
              onClick={() => setHistoryTab("deleted")}
            >
              المحذوفة ({deletedProducts.length})
            </Button>
          </div>

          <div className="space-y-4">
            {(historyTab === "archived" ? archivedProducts : deletedProducts).length > 0 ? (
              <div className="divide-y divide-border/50 border rounded-2xl overflow-hidden">
                {(historyTab === "archived" ? archivedProducts : deletedProducts).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/50">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg hover:bg-primary/10 text-primary"
                        onClick={() => handleRestore(product.id)}
                        title="استعادة"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      {historyTab === "deleted" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-lg hover:bg-destructive/10 text-destructive"
                          onClick={() => handlePermanentDelete(product.id)}
                          title="حذف نهائي"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
                لا توجد منتجات في هذا السجل
              </div>
            )}
          </div>

          <DialogFooter className="pt-6">
            <Button onClick={() => setIsHistoryOpen(false)} className="w-full py-6 rounded-2xl font-bold">
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {notification && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className={`flex items-center gap-4 px-8 py-5 rounded-3xl shadow-2xl border backdrop-blur-xl ${notification.type === "success"
                ? "bg-primary/95 border-primary/20 text-white"
                : notification.type === "error"
                  ? "bg-destructive/95 border-destructive/20 text-white"
                  : "bg-card/95 border-border/50 text-foreground"
                }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${notification.type === "success" ? "bg-white/20" : "bg-primary/10"
                }`}>
                {notification.type === "success" && <Check className="w-6 h-6" />}
                {notification.type === "error" && <AlertCircle className="w-6 h-6" />}
                {notification.type === "info" && <Bell className="w-6 h-6 text-primary" />}
              </div>
              <p className="text-lg font-black">{notification.message}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AlertDialog open={confirmConfig.open} onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="rounded-[2rem] p-8 max-w-[450px]">
          <AlertDialogHeader>
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${confirmConfig.variant === "destructive" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
              <AlertCircle className="w-8 h-8" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-center">{confirmConfig.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base pt-2 font-medium">
              {confirmConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-4 pt-6 sm:justify-center">
            <AlertDialogAction
              onClick={confirmConfig.onConfirm}
              className={`flex-1 py-6 rounded-2xl font-bold shadow-lg transition-all hover:scale-105 ${confirmConfig.variant === "destructive"
                ? "bg-destructive text-destructive-foreground shadow-destructive/20"
                : "bg-primary text-primary-foreground shadow-primary/20"
                }`}
            >
              {confirmConfig.actionLabel || "تأكيد"}
            </AlertDialogAction>
            <AlertDialogCancel className="flex-1 py-6 rounded-2xl font-bold border-border/50">
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
