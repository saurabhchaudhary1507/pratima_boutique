'use client';

import { useEffect } from 'react';
import FocusTrap from 'focus-trap-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onCancel}
      />
      <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true }}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-desc"
          className="relative bg-white rounded-2xl shadow-modal max-w-sm w-full p-6 z-10"
        >
          <h2 id="dialog-title" className="font-serif text-xl font-medium text-brand-text-primary mb-2">
            {title}
          </h2>
          <p id="dialog-desc" className="text-sm text-brand-text-secondary mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-brand-text-secondary border border-cream-300 rounded-full hover:bg-cream-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-full hover:bg-brand-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
