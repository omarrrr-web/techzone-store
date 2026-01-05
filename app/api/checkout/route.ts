import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from '@supabase/supabase-js'; // Necesitas instalar esto si no usas @supabase/ssr aquí

// 1. Inicializamos Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover" as any,
});

// 2. Inicializamos Supabase (Cliente Admin para poder escribir sin restricciones si es necesario)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, customerInfo, userId } = body; // <--- AHORA RECIBIMOS userId

        const origin = request.headers.get("origin") || "http://localhost:3000";

        // Calculamos el total nosotros mismos por seguridad
        const totalAmount = items.reduce((sum: number, item: any) => sum + item.price, 0);

        // 3. Crear items para Stripe
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: "pen",
                product_data: {
                    name: item.name,
                    images: [item.image],
                    description: item.category,
                },
                unit_amount: Math.round(item.price * 3.7 * 100),
            },
            quantity: 1,
        }));

        // 4. Crear sesión de Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/success`,
            cancel_url: `${origin}/cart`,
            customer_email: customerInfo.email,
        });

        // 5. --- GUARDAR EN SUPABASE ---
        // Guardamos el pedido antes de responder al frontend
        if (userId) { // Solo guardamos si el usuario está logueado
            const { error } = await supabase
                .from('orders')
                .insert([{
                    user_id: userId,
                    items: items, // Guardamos el array de productos (JSON)
                    total: totalAmount,
                    customer_details: customerInfo,
                    stripe_id: session.id
                }]);

            if (error) {
                console.error("Error guardando pedido:", error);
                // No detenemos el flujo, pero lo logueamos
            }
        }
        // -----------------------------

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Error en Stripe:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}