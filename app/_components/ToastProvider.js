"use client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function ToastProvider({ children }){
  const contextClass = {
    success: "bg-gray-100 text-dark/80",
    error: "bg-red-600",
    info: "bg-gray-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 text-gray-300",
  };

  return (
    <>
      {children}
      <ToastContainer
        toastClassName={(context) =>
          contextClass[context?.type || "default"] +
          " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer mt-2 mx-6 mb-2 xs:mx-0 xs:mb-0"
        }
        bodyClassName={() => "text-sm font-medium flex items-center p-3"}
        position="bottom-center"
        autoClose={3000}
      />
    </>
  );
}