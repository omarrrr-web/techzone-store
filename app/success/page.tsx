"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/app/store/useCart";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function SuccessPage() {
    const clearCart = useCart((state) => state.clearCart);

    useEffect(() => {
        clearCart(); // Vaciamos el carrito porque ya pagó
        confetti(); // Lanzamos confeti 🎉 (si instalaste la librería, si no, borra esta línea)
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-500 mb-8">
                    Gracias por tu compra. Hemos enviado el recibo a tu correo electrónico. Tu hardware está en camino 🚚.
                </p>

                <Link
                    href="/"
                    className="block w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                    Volver a la Tienda
                </Link>
            </div>
        </div>
    );
}