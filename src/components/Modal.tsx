'use client';
import React from 'react';

// เพิ่ม title แบบ optional (?) เข้าไปเพื่อไม่ให้หน้าอื่นที่ส่ง title มา Error
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; 
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[3px] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14"
      onClick={onClose}
    >
      {/* Outer wrapper: constrains size and provides safe margins */}
      <div
        className="w-full max-w-xl max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ถ้ามีการส่ง title มา ให้แสดงเป็นส่วนหัวของ Modal */}
        {title && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
          </div>
        )}
        
        {/* เนื้อหาด้านในที่ถูกส่งผ่าน children */}
        <div className="w-full">
          {children}
        </div>
        
      </div>
    </div>
  );
}