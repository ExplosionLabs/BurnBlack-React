import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center ">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 h-96 overflow-auto ">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 float-right"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
