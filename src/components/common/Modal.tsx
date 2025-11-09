import React, { useEffect } from "react";
import { X } from "lucide-react";
import { THEME } from "../../constants/theme";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  headerExtra?: React.ReactNode; // Extra content in header (e.g., search bar)
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "md",
  headerExtra,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Light dimmed overlay - background still visible */}
      <div
        className="fixed inset-0 transition-opacity backdrop-blur-[2px]"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)", // Only 30% opacity - light dim
        }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content */}
        <div
          className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-2xl shadow-2xl transform transition-all z-10 overflow-visible`}
          style={{
            backgroundColor: THEME.colors.background.secondary,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="p-6 border-b overflow-visible"
            style={{ borderColor: THEME.colors.border.DEFAULT }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3
                  className="text-xl font-semibold"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {title}
                </h3>
                {headerExtra && (
                  <div className="flex-1 min-w-[260px] max-w-[460px] relative z-[100]">
                    {headerExtra}
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: THEME.colors.text.tertiary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      THEME.colors.background.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-visible">{children}</div>

          {/* Footer */}
          {footer && (
            <div
              className="flex items-center justify-end gap-3 p-6 border-t"
              style={{ borderColor: THEME.colors.border.DEFAULT }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
