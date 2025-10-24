"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ToastNotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function ToastNotification({
  message,
  type = "success",
  duration = 4000,
  onClose,
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 400);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200"
      : type === "error"
        ? "bg-red-50 border-red-200"
        : "bg-blue-50 border-blue-200";

  const textColor =
    type === "success"
      ? "text-green-900"
      : type === "error"
        ? "text-red-900"
        : "text-blue-900";

  const iconColor =
    type === "success"
      ? "text-green-600"
      : type === "error"
        ? "text-red-600"
        : "text-blue-600";

  const icon =
    type === "success"
      ? "✅"
      : type === "error"
        ? "❌"
        : "ℹ️";

  return (
    <div
      className={`fixed bottom-6 right-6 max-w-sm transform transition-all duration-400 ${
        isExiting 
          ? "opacity-0 scale-95 translate-y-2" 
          : "opacity-100 scale-100 translate-y-0"
      }`}
    >
      <div
        className={`${bgColor} ${textColor} border rounded-lg shadow-md p-4 flex items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xl ${iconColor}`}>{icon}</span>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose?.();
            }, 400);
          }}
          className={`hover:bg-white/40 p-1 rounded transition-colors ${iconColor}`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
