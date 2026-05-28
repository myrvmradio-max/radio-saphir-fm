"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration: number;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success";
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: "danger" | "warning" | "info" | "success";
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirmer",
    cancelText: "Annuler",
    type: "info",
    resolve: null,
  });

  // Function to display a toast notification
  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    []
  );

  // Function to remove a toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Function to show confirm modal (Promise-based)
  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || "Confirmer",
        cancelText: options.cancelText || "Annuler",
        type: options.type || "info",
        resolve,
      });
    });
  }, []);

  const handleConfirmClose = (value: boolean) => {
    if (confirmState.resolve) {
      confirmState.resolve(value);
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false, resolve: null }));
  };

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* Internal Custom CSS Styles for Progress Bar shrinking */}
      <style>{`
        @keyframes shrink-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .toast-progress-bar {
          animation: shrink-progress var(--toast-duration) linear forwards;
        }
      `}</style>

      {/* TOASTS CONTAINER */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          // Select colors & icons based on toast type
          let iconColor = "text-saphir-electric";
          let bgColor = "bg-[#0D1B4C]/95 border-saphir-electric/30";
          let progressBg = "bg-saphir-electric";
          let Icon = Info;

          if (toast.type === "success") {
            iconColor = "text-emerald-400";
            bgColor = "bg-[#0D1B4C]/95 border-emerald-500/20";
            progressBg = "bg-emerald-400";
            Icon = CheckCircle2;
          } else if (toast.type === "error") {
            iconColor = "text-rose-400";
            bgColor = "bg-[#0D1B4C]/95 border-rose-500/20";
            progressBg = "bg-rose-400";
            Icon = AlertCircle;
          } else if (toast.type === "warning") {
            iconColor = "text-amber-400";
            bgColor = "bg-[#0D1B4C]/95 border-amber-500/20";
            progressBg = "bg-amber-400";
            Icon = AlertTriangle;
          }

          return (
            <ToastItem
              key={toast.id}
              toast={toast}
              iconColor={iconColor}
              bgColor={bgColor}
              progressBg={progressBg}
              Icon={Icon}
              onClose={() => removeToast(toast.id)}
            />
          );
        })}
      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <div
            className="absolute inset-0 bg-[#0D1B4C]/50 backdrop-blur-md transition-opacity duration-300"
            onClick={() => handleConfirmClose(false)}
          />

          {/* Modal Content Box */}
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-8 border border-gray-100 shadow-2xl shadow-saphir-navy/20 overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Elegant Accent Header Icon */}
            <div className="flex justify-center mb-6">
              {confirmState.type === "danger" ? (
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 animate-bounce">
                  <AlertCircle size={28} />
                </div>
              ) : confirmState.type === "warning" ? (
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                  <AlertTriangle size={28} />
                </div>
              ) : confirmState.type === "success" ? (
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-pulse">
                  <CheckCircle2 size={28} />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-saphir-electric">
                  <Info size={28} />
                </div>
              )}
            </div>

            {/* Title & Message */}
            <h3 className="text-2xl font-black text-[#0D1B4C] text-center mb-3 tracking-tight leading-none">
              {confirmState.title}
            </h3>
            <p className="text-sm text-[#0D1B4C]/60 text-center leading-relaxed mb-8 font-medium">
              {confirmState.message}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleConfirmClose(false)}
                className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-[#0D1B4C]/50 hover:bg-gray-100 hover:text-[#0D1B4C] transition-all duration-200 active:scale-95"
              >
                {confirmState.cancelText}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmClose(true)}
                className={`flex-1 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all duration-200 active:scale-95 shadow-lg ${
                  confirmState.type === "danger"
                    ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                    : confirmState.type === "warning"
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                    : confirmState.type === "success"
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                    : "bg-[#6A7CFF] hover:bg-[#5365E6] shadow-[#6A7CFF]/20"
                }`}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Small helper component to handle auto-dismiss and progress timers cleanly per Toast Item
function ToastItem({
  toast,
  iconColor,
  bgColor,
  progressBg,
  Icon,
  onClose,
}: {
  toast: Toast;
  iconColor: string;
  bgColor: string;
  progressBg: string;
  Icon: React.ComponentType<any>;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  return (
    <div
      className={`pointer-events-auto w-full border backdrop-blur-md rounded-[1.5rem] shadow-2xl shadow-saphir-navy/20 p-4 pr-6 flex gap-4 items-center justify-between overflow-hidden animate-in slide-in-from-right-10 fade-in duration-300 relative ${bgColor}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1 flex-shrink-0 ${iconColor}`}>
          <Icon size={20} />
        </div>
        <p className="text-xs font-bold text-white leading-relaxed">{toast.message}</p>
      </div>

      <button
        onClick={onClose}
        className="text-white/40 hover:text-white transition-all p-1 flex-shrink-0 rounded-lg hover:bg-white/10"
      >
        <X size={14} />
      </button>

      {/* Progress Bar indicator */}
      <div
        className={`absolute bottom-0 left-0 h-1 toast-progress-bar ${progressBg}`}
        style={
          {
            "--toast-duration": `${toast.duration}ms`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
