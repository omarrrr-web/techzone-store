"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error("Error al ingresar", {
                description: "Correo o contraseña incorrectos ❌",
            });
            setLoading(false);
        } else {
            toast.success("¡Bienvenido! 👋");
            router.push("/"); // Redirigimos al Home (o /admin si prefieres)
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Iniciar Sesión</h1>
                    <p className="text-slate-500 mt-2">Accede a tu cuenta TechZone</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition text-slate-900"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition text-slate-900"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Verificando..." : "Ingresar"}
                    </button>
                </form>

                {/* 2. AGREGAMOS EL ENLACE DE REGISTRO AQUÍ */}
                <p className="text-center text-slate-500 mt-6 text-sm">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="text-blue-600 font-bold hover:underline cursor-pointer">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}