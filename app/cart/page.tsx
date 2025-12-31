"use client";
import { useCart } from "@/app/store/useCart";
import Header from "@/app/Components/Header";
import Link from "next/link";

export default function CartPage() {
    // Traemos el carrito y las funciones para borrar
    const { cart, removeFromCart, clearCart } = useCart();

    // Calcular el TOTAL (Suma de precios)
    // reduce es una función de JS para sumar arrays
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    // Función para generar el mensaje de WhatsApp
    const handleCheckout = () => {
        if (cart.length === 0) return;

        // 1. Crear el mensaje de texto
        let message = "Hola TechZone, quiero pedir lo siguiente:%0A%0A"; // %0A es salto de línea
        cart.forEach((product) => {
            message += `- ${product.name} (S/ ${product.price * 3.7})%0A`;
        });
        message += `%0A*TOTAL: S/ ${(total * 3.7).toFixed(2)}*`;

        // 2. Abrir WhatsApp (Reemplaza con tu número real)
        window.open(`https://wa.me/51984932392?text=${message}`, "_blank");

        // 3. Limpiar carrito (opcional)
        // clearCart(); 
    };

    return (
        <main className="min-h-screen bg-gray-100">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Tu Carrito de Compras</h1>

                {cart.length === 0 ? (
                    // ESTADO VACÍO
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-xl text-gray-500 mb-6">Tu carrito está vacío 😢</p>
                        <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold">
                            Volver a la Tienda
                        </Link>
                    </div>
                ) : (
                    // LISTA DE PRODUCTOS
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Columna Izquierda: Los productos */}
                        <div className="md:col-span-2 space-y-4">
                            {cart.map((product, index) => (
                                // Usamos index como key por si agregas el mismo producto 2 veces
                                <div key={`${product.id}-${index}`} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-center">
                                    <img src={product.image} alt={product.name} className="w-20 h-20 object-contain" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-gray-800">{product.name}</h3>
                                        <p className="text-blue-600 font-bold">
                                            {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(product.price * 3.7)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(product.id)}
                                        className="cursor-pointer text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Columna Derecha: El Resumen y Pago */}
                        <div className="bg-white p-6 rounded-xl shadow-sm h-fit sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen</h2>

                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>Subtotal</span>
                                <span>S/ {(total * 3.7).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-6 text-gray-600">
                                <span>Envío</span>
                                <span className="text-green-600 font-medium">Gratis</span>
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center mb-6">
                                <span className="text-2xl font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(total * 3.7)}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="cursor-pointer w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-lg shadow-green-500/20"
                            >
                                📱 Pedir por WhatsApp
                            </button>

                            <button
                                onClick={clearCart}
                                className="cursor-pointer w-full mt-4 text-gray-400 text-sm hover:text-red-500 underline"
                            >
                                Vaciar Carrito
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}