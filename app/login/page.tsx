"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Intentamos iniciar sesión con Supabase
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
            toast.success("¡Bienvenido Admin! 👋");
            // 2. Si todo sale bien, nos vamos al panel
            router.push("/admin");
            // router.refresh(); // A veces ayuda a actualizar el estado de la sesión
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-600">TechZone Admin 🔒</h1>
                    <p className="text-gray-500 text-sm">Ingresa tus credenciales de administrador</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="admin@techzone.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verificando..." : "Ingresar al Panel"}
                    </button>
                </form>
            </div>
        </div>
    );
}