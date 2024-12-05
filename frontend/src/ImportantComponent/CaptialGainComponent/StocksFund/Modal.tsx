import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end">
      {/* Modal Container */}
      <div className="bg-white h-full w-1/2 shadow-lg transform transition-transform translate-x-0">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
        >
          ✕
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
