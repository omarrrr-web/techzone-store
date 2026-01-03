import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, customerInfo } = body;

        // Usamos http://localhost:3000 a la fuerza
        const origin = request.headers.get("origin") || "http://localhost:3000";

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

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/success`,
            cancel_url: `${origin}/cart`,
            customer_email: customerInfo.email,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Error en Stripe:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}