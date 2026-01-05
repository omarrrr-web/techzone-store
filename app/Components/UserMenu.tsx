"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase"; // Ajusta la ruta si es necesario
import Link from "next/link";
import { User, LogOut, Package, ShieldCheck, ChevronDown, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserMenu() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Verificar sesión al cargar
    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
            }
            setLoading(false);
        };
        getUser();

        // Escuchar cambios (Login/Logout en otras pestañas)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (event === 'SIGNED_OUT') {
                router.refresh();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.info("Sesión cerrada");
        setIsOpen(false);
        router.push("/");
        router.refresh();
    };

    // ESTADO DE CARGA (Skeleton pequeño)
    if (loading) return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>;

    // SI NO HAY USUARIO: Mostrar botón de Login
    if (!user) {
        return (
            <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition">
                <UserCircle2 className="w-6 h-6" />
                <div className="hidden md:block text-left leading-tight">
                    <p className="text-[10px] text-slate-400 font-normal">Bienvenido</p>
                    <p>Inicia Sesión</p>
                </div>
            </Link>
        );
    }

    // SI HAY USUARIO: Mostrar Menú Desplegable
    return (
        <div className="relative">
            {/* Botón Avatar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer flex items-center gap-2 focus:outline-none"
            >
                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-200">
                    {/* Primera letra del email o nombre */}
                    {user.user_metadata?.full_name ? user.user_metadata.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Fondo transparente para cerrar al hacer click afuera */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 animate-in fade-in slide-in-from-top-2">

                        <div className="px-4 py-3 border-b border-gray-50 mb-2">
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {user.user_metadata?.full_name || "Usuario"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>

                        <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Panel Admin
                        </Link>

                        {/* Mis Pedidos */}
                        <Link
                            href="/orders"
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 transition text-left"
                            onClick={() => setIsOpen(false)}
                        >
                            <Package className="w-4 h-4" />
                            Mis Pedidos
                        </Link>

                        <div className="border-t border-gray-50 mt-2 pt-2">
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}