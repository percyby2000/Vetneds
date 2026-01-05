"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"
import { createClient } from "@/app/lib/supabase"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  image_url: string
  stock_quantity: number
  is_active: boolean
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, userRole, loading } = useAuth()
  const supabase = createClient()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
    stock_quantity: "",
  })

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, userRole, loading, router])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*")
    if (data) setCategories(data)
  }

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false })
    if (data) setProducts(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          category_id: formData.category_id,
          image_url: formData.image_url,
          stock_quantity: Number.parseInt(formData.stock_quantity),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId)

      if (!error) {
        setShowForm(false)
        setEditingId(null)
        resetForm()
        fetchProducts()
      }
    } else {
      const { error } = await supabase.from("products").insert({
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url,
        stock_quantity: Number.parseInt(formData.stock_quantity),
        created_by: user?.id,
      })

      if (!error) {
        setShowForm(false)
        resetForm()
        fetchProducts()
      }
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id,
      image_url: product.image_url || "",
      stock_quantity: product.stock_quantity.toString(),
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este producto?")) {
      await supabase.from("products").delete().eq("id", id)
      fetchProducts()
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      image_url: "",
      stock_quantity: "",
    })
  }

  if (loading) return <div>Cargando...</div>

  return (
    <>
      {/* Top Marquee Bar */}
      <div className="marquee-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            PANEL ADMINISTRATIVO • GESTIONA TUS PRODUCTOS • CONTROLA EL INVENTARIO • PANEL ADMINISTRATIVO •
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navigation">
        <div className="logo">
          <Link href="/admin">
            PETLY<span>.</span>ADMIN
          </Link>
          <div className="beta-badge">ADMIN</div>
        </div>

        <div className="nav-links">
          <Link href="/admin" className="nav-link">
            PRODUCTOS
          </Link>
          <Link href="/admin/orders" className="nav-link">
            PEDIDOS
          </Link>
          <Link href="/admin/analytics" className="nav-link">
            ESTADÍSTICAS
          </Link>
        </div>

        <div className="nav-actions">
          <div className="nav-icon" onClick={() => setSearchOpen(!searchOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <Link href="/" className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </Link>
        </div>
      </nav>

      {/* Admin Section */}
      <main style={{ minHeight: "100vh", padding: "2rem", background: "#f9fafb" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1 className="hero-headline" style={{ margin: 0 }}>
              GESTIÓN DE PRODUCTOS
            </h1>
            <button
              onClick={() => {
                resetForm()
                setEditingId(null)
                setShowForm(!showForm)
              }}
              className="btn-primary hover-lift"
            >
              {showForm ? "CANCELAR" : "+ AGREGAR PRODUCTO"}
            </button>
          </div>

          {/* Product Form */}
          {showForm && (
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "0.5rem",
                marginBottom: "2rem",
                border: "2px solid #e5e7eb",
              }}
            >
              <h2 style={{ marginTop: 0 }}>{editingId ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>NOMBRE</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>CATEGORÍA</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>PRECIO</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>STOCK</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>URL DE IMAGEN</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.5rem",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>DESCRIPCIÓN</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <button type="submit" className="btn-primary hover-lift">
                  {editingId ? "ACTUALIZAR PRODUCTO" : "CREAR PRODUCTO"}
                </button>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div
            style={{
              background: "white",
              borderRadius: "0.5rem",
              overflow: "hidden",
              border: "2px solid #e5e7eb",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.875rem",
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>PRODUCTO</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>CATEGORÍA</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>PRECIO</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>STOCK</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {product.image_url && (
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              style={{ width: "40px", height: "40px", borderRadius: "0.25rem", objectFit: "cover" }}
                            />
                          )}
                          <div>
                            <p style={{ margin: 0, fontWeight: "600" }}>{product.name}</p>
                            <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>
                              {product.description.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>{categories.find((c) => c.id === product.category_id)?.name}</td>
                      <td style={{ padding: "1rem" }}>${product.price.toFixed(2)}</td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            background: product.stock_quantity > 0 ? "#dcfce7" : "#fee2e2",
                            color: product.stock_quantity > 0 ? "#166534" : "#991b1b",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          {product.stock_quantity} unidades
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleEdit(product)}
                            style={{
                              background: "#3b82f6",
                              color: "white",
                              border: "none",
                              padding: "0.5rem 1rem",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            EDITAR
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            style={{
                              background: "#ef4444",
                              color: "white",
                              border: "none",
                              padding: "0.5rem 1rem",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            ELIMINAR
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {products.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "white",
                borderRadius: "0.5rem",
                marginTop: "2rem",
              }}
            >
              <p>No hay productos aún. Crea uno para empezar.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <Link href="/admin" className="footer-logo">
            PETLY.ADMIN
          </Link>
          <div className="footer-copyright">© 2026 Petly Store. Todos los derechos reservados.</div>
        </div>
      </footer>
    </>
  )
}
