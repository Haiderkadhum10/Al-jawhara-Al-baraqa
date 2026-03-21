import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, CheckCircle2, Truck, XCircle, Check } from "lucide-react";
import { OrderStatus } from "@/lib/services/ordersService";

interface StatusDropdownProps {
  status: OrderStatus;
  statusMap: any;
  onStatusChange: (newStatus: OrderStatus) => void;
  className?: string;
}

export function StatusDropdown({ status: currentStatus, statusMap, onStatusChange, className = "" }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentStatusData = statusMap[currentStatus] || statusMap.pending;
  const StatusIcon = currentStatusData.icon;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-sm font-bold border transition-all hover:shadow-md active:scale-95 ${currentStatusData.color}`}
      >
        <StatusIcon className="w-3.5 h-3.5" />
        {currentStatusData.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-xl"
          >
            <div className="p-1">
              {Object.entries(statusMap).map(([key, val]: [string, any]) => {
                const Icon = val.icon;
                const isSelected = key === currentStatus;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onStatusChange(key as OrderStatus);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-right text-xs font-bold transition-all ${
                      isSelected 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    dir="rtl"
                  >
                    <div className="flex items-center gap-2">
                       <Icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                       <span>{val.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
