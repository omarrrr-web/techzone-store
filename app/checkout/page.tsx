"use client";
import { useState } from "react";
import { useCart } from "@/app/store/useCart";
import Header from "@/app/Components/Header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreditCard, Truck } from "lucide-react";

export default function CheckoutPage() {
    const { cart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        phone: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    customerInfo: formData,
                }),
            });

            // --- CAMBIO PARA DETECTAR EL ERROR ---
            const text = await response.text(); // 1. Leemos como texto primero
            console.log("Respuesta del servidor:", text); // 2. La imprimimos en consola

            try {
                const data = JSON.parse(text); // 3. Intentamos convertir a JSON manualmente
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    console.error(data);
                    toast.error("Error: " + (data.error || "Desconocido"));
                }
            } catch (jsonError) {
                // Si falla aquí, es porque recibimos HTML (Error 404 o 500)
                console.error("No es JSON válido:", text);
                toast.error("Error del servidor. Revisa la consola.");
            }
            // -------------------------------------

        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-10">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Truck className="w-8 h-8 text-blue-600" /> Finalizar Compra
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* COLUMNA IZQUIERDA: DATOS DE ENVÍO */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Datos de Envío</h2>
                        <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="juan@gmail.com"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Dirección de Entrega</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    placeholder="Av. Javier Prado 123"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Ciudad</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        placeholder="Lima"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Celular</label>
                                    <input
                                        maxLength={9}
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="999 999 999"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: RESUMEN Y PAGO */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Resumen del Pedido</h2>
                            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center border-b border-gray-50 pb-2">
                                        <img src={item.image} className="w-12 h-12 object-contain bg-gray-50 rounded-md" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-blue-600 font-bold">
                                                {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(item.price * 3.7)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                                <span className="text-slate-600">Total a Pagar:</span>
                                <span className="text-2xl font-extrabold text-slate-900">
                                    {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(total * 3.7)}
                                </span>
                            </div>
                        </div>

                        {/* BOTÓN DE PAGO */}
                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition flex justify-center items-center gap-3 shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                "Procesando..."
                            ) : (
                                <>
                                    <CreditCard className="w-6 h-6" /> Pagar con Tarjeta
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                            🔒 Pagos seguros procesados por Stripe
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );
}