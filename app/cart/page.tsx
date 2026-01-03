"use client";
import { useCart } from "@/app/store/useCart";
import Header from "../Components/Header";
import Link from "next/link";
import { Trash2, ArrowLeft, MessageCircle, CreditCard } from "lucide-react";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
    const { cart, removeFromCart, clearCart } = useCart();
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        let message = "Hola TechZone, quiero pedir lo siguiente:%0A%0A";
        cart.forEach((product) => {
            message += `- ${product.name} (S/ ${product.price * 3.7})%0A`;
        });
        message += `%0A*TOTAL: S/ ${(total * 3.7).toFixed(2)}*`;
        window.open(`https://wa.me/51984932392?text=${message}`, "_blank");
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Tu Carrito</h1>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                        {cart.length} items
                    </span>
                </div>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="text-xl text-slate-500 mb-6 font-medium">Tu carrito está vacío</p>
                        <Link href="/" className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 font-bold transition cursor-pointer shadow-lg shadow-slate-900/20">
                            Explorar Tienda
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LISTA DE PRODUCTOS */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((product, index) => (
                                <div key={`${product.id}-${index}`} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex gap-6 items-center">
                                    <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-2">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-grow">
                                        <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">{product.category}</span>
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{product.name}</h3>
                                        <p className="text-slate-500 text-sm">Garantía incluida</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-extrabold text-slate-900 mb-2">
                                            {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(product.price * 3.7)}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(product.id)}
                                            className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RESUMEN DE PAGO (Sticky) */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50 sticky top-28">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Resumen de Orden</h2>

                                <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Subtotal</span>
                                        <span>S/ {(total * 3.7).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Impuestos (IGV)</span>
                                        <span>Calculado</span>
                                    </div>
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Envío</span>
                                        <span>Gratis 🚚</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-slate-900 font-bold">Total a Pagar</span>
                                    <span className="text-3xl font-extrabold text-slate-900">
                                        {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(total * 3.7)}
                                    </span>
                                </div>
                                {/* BOTÓN IR A CHECKOUT */}
                                <Link href="/checkout">
                                    <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition flex justify-center items-center gap-3 shadow-xl shadow-slate-900/20 mb-3 cursor-pointer">
                                        <CreditCard className="w-6 h-6" />
                                        Ir a Pagar
                                    </button>
                                </Link>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex justify-center items-center gap-3 shadow-xl shadow-green-600/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                    Completar en WhatsApp
                                </button>

                                <button onClick={clearCart} className="w-full mt-4 text-slate-400 text-sm hover:text-red-500 font-medium cursor-pointer transition">
                                    Vaciar Carrito
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}