import React from "react";

const Modal = ({ open, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {children}
      </div>
    </div>
  );
};

export default Modal;
