"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={"light" as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/80 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-foreground group-[.toaster]:border-border/50 group-[.toaster]:shadow-xl group-[.toaster]:shadow-primary/20 group-[.toaster]:rounded-2xl p-4 flex gap-3 rtl text-right",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:bg-gradient-to-l group-[.toaster]:from-[#c9a85c] group-[.toaster]:to-[#9d7e3a] group-[.toaster]:text-white group-[.toaster]:border-transparent [&>div>svg]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
