"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import Header from "../Components/Header";
import { Package, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            // 1. Verificar sesión
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }

            // 2. Traer pedidos del usuario
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false }); // Los más recientes primero

            if (data) setOrders(data);
            setLoading(false);
        };

        fetchOrders();
    }, [router]);

    return (
        <main className="min-h-screen bg-gray-50 pb-10">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Mis Pedidos</h1>
                <p className="text-slate-500 mb-8">Historial de tus compras recientes</p>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-medium text-slate-900">Aún no tienes pedidos</p>
                        <Link href="/" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                            Ir a comprar
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">

                                {/* Cabecera del Pedido */}
                                <div className="flex flex-wrap justify-between items-start border-b border-gray-50 pb-4 mb-4 gap-4">
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID Pedido</span>
                                        <p className="font-mono text-sm text-slate-700">#{order.id}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</span>
                                        <div className="flex items-center gap-1 text-sm text-slate-700">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.created_at).toLocaleDateString('es-PE')}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                                        <p className="text-lg font-extrabold text-slate-900">
                                            {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(order.total * 3.7)}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold self-start">
                                        Pagado
                                    </div>
                                </div>

                                {/* Lista de productos (Miniatura) */}
                                <div className="space-y-3">
                                    {order.items.map((item: any, index: number) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-gray-50 rounded-lg" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-blue-600 font-medium">{item.category}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}