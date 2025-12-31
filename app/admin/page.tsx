"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
    stock: number;
}

export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Estados del formulario CREAR
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Tarjetas de Video");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [stock, setStock] = useState("10"); // Stock para crear

    // ESTADOS MODAL ELIMINAR
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    // ESTADOS MODAL EDITAR
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // 1. PROTECCIÓN Y CARGA
    useEffect(() => {
        const checkSessionAndFetch = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setIsCheckingAuth(false);
                fetchProducts();
            }
        };
        checkSessionAndFetch();
    }, [router]);

    const fetchProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (data) setProducts(data);
    };

    // LOGICA CREAR
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!file) throw new Error("¡Debes subir una imagen!");
            const fileName = `${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage.from('hardware-images').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('hardware-images').getPublicUrl(fileName);

            const { error: insertError } = await supabase.from('products').insert([{
                name,
                price: parseFloat(price),
                category,
                description,
                image: publicUrl,
                stock: parseInt(stock)
            }]);

            if (insertError) throw insertError;
            toast.success("Producto creado con éxito 🚀");
            setName(""); setPrice(""); setDescription(""); setFile(null); setStock("10");
            fetchProducts();
        } catch (error: any) {
            toast.error("Error al crear", { description: error.message });
        } finally {
            setLoading(false);
        }
    };

    // LOGICA ELIMINAR
    const openDeleteModal = (id: number) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        const { error } = await supabase.from('products').delete().eq('id', productToDelete);
        if (error) { toast.error("Error al borrar"); } else { toast.success("Producto eliminado"); fetchProducts(); }
        setIsDeleteModalOpen(false); setProductToDelete(null);
    };

    // LOGICA EDITAR
    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            const { error } = await supabase
                .from('products')
                .update({
                    name: editingProduct.name,
                    price: editingProduct.price,
                    category: editingProduct.category,
                    description: editingProduct.description,
                    stock: editingProduct.stock // Esto ahora sí enviará el valor correcto
                })
                .eq('id', editingProduct.id);

            if (error) throw error;
            toast.success("Producto actualizado ✨");
            setIsEditModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error: any) {
            toast.error("Error al actualizar", { description: error.message });
        }
    };

    if (isCheckingAuth) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-blue-600 font-bold animate-pulse">Verificando...</p></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 relative">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* FORMULARIO CREAR */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Agregar Producto 📦</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Ej: Mouse Gamer" required />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Precio ($)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0.00" step="0.01" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Stock</label>
                                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="10" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="cursor-pointer w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm">
                                    <option>Tarjetas de Video</option>
                                    <option>Procesadores</option>
                                    <option>Memorias RAM</option>
                                    <option>Almacenamiento</option>
                                    <option>Monitores</option>
                                    <option>Periféricos</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Detalles..." required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Imagen</label>
                            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="cursor-pointer w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                        </div>
                        <button type="submit" disabled={loading} className="cursor-pointer w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 text-sm">
                            {loading ? "Subiendo..." : "Publicar Producto"}
                        </button>
                    </form>
                </div>

                {/* LISTA DE STOCK */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Stock ({products.length})</h2>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {products.map((product) => (
                            <div key={product.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition group">
                                <div className="flex items-center gap-3">
                                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md bg-gray-100" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm line-clamp-1">{product.name}</p>
                                        <p className="text-xs text-blue-600 font-bold">${product.price} - Stock: {product.stock}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(product)} className="cursor-pointer text-blue-500 hover:bg-blue-100 p-2 rounded-lg transition" title="Editar">✏️</button>
                                    <button onClick={() => openDeleteModal(product.id)} className="cursor-pointer text-red-500 hover:bg-red-100 p-2 rounded-lg transition" title="Eliminar">🗑️</button>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && <p className="text-gray-400 text-center text-sm py-10">No hay productos.</p>}
                    </div>
                </div>
            </div>

            {/* MODAL ELIMINAR */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl">⚠️</div>
                            <h3 className="text-xl font-bold text-gray-900">¿Eliminar producto?</h3>
                            <p className="text-gray-500 text-sm">Esta acción es permanente.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl">Cancelar</button>
                            <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl">Sí, Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDITAR */}
            {isEditModalOpen && editingProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Producto ✏️</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
                                <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-800" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Precio</label>
                                    <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-800" step="0.01" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Stock</label>
                                    {/* --- AQUÍ ESTABA EL ERROR, AHORA ESTÁ CORREGIDO --- */}
                                    <input
                                        type="number"
                                        value={editingProduct.stock} // Conectado a editingProduct
                                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })} // Actualiza editingProduct
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-800"
                                    />
                                    {/* ----------------------------------------------- */}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                                    <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="cursor-pointer w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm text-gray-800">
                                        <option>Tarjetas de Video</option>
                                        <option>Procesadores</option>
                                        <option>Memorias RAM</option>
                                        <option>Almacenamiento</option>
                                        <option>Monitores</option>
                                        <option>Periféricos</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
                                <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-800" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="cursor-pointer flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition">Cancelar</button>
                                <button type="submit" className="cursor-pointer flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}