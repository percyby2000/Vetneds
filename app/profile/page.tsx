"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"
import { createClient } from "@/app/lib/supabase"

interface Order {
  id: string
  order_number: string
  total_price: number
  status: string
  created_at: string
  order_items: Array<{
    product_id: string
    quantity: number
    price: number
  }>
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, signOut, loading } = useAuth()
  const supabase = createClient()
  const [searchOpen, setSearchOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      fetchUserProfile()
      fetchOrders()
    }
  }, [user, loading])

  const fetchUserProfile = async () => {
    const { data } = await supabase.from("users").select("*").eq("id", user?.id).single()
    if (data) setUserProfile(data)
  }

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })

    if (data) setOrders(data)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#fbbf24",
      confirmed: "#60a5fa",
      shipped: "#34d399",
      delivered: "#10b981",
      cancelled: "#ef4444",
    }
    return colors[status] || "#6b7280"
  }

  if (loading) return <div>Cargando...</div>

  return (
    <>
      {/* Top Marquee Bar */}
      <div className="marquee-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            TU PERFIL • MIS PEDIDOS • MIS DATOS • DESCUENTOS ESPECIALES • TU PERFIL • MIS PEDIDOS • MIS DATOS •
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navigation">
        <div className="logo">
          <Link href="/">
            PETLY<span>.</span>STORE
          </Link>
          <div className="beta-badge">MASCOTA</div>
        </div>

        <div className="nav-links">
          <Link href="/#trending" className="nav-link">
            COMIDA
          </Link>
          <Link href="/#trending" className="nav-link">
            ROPA
          </Link>
          <Link href="/#trending" className="nav-link">
            SERVICIOS
          </Link>
          <Link href="/#trending" className="nav-link">
            JUGUETES
          </Link>
        </div>

        <div className="nav-actions">
          <div className="nav-icon" onClick={() => setSearchOpen(!searchOpen)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <Link href="/profile" className="nav-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
          <Link href="/cart" className="nav-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
        </div>
      </nav>

      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-container" onClick={(e) => e.stopPropagation()}>
            <input type="text" placeholder="Buscar productos..." className="search-input" autoFocus />
            <button className="search-close" onClick={() => setSearchOpen(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <main className="profile-section">
        <div className="profile-container">
          <h1 className="profile-title">MI PERFIL</h1>

          {/* Profile Info */}
          <div className="profile-info-card">
            <div className="profile-avatar">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="#5D3FD3">
                <circle cx="50" cy="30" r="20" />
                <path d="M20 80 Q20 60 50 60 Q80 60 80 80" />
              </svg>
            </div>
            <div className="profile-info">
              <h2>{userProfile?.full_name || "Usuario"}</h2>
              <p>{userProfile?.email}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button
                  onClick={() => router.push("/")}
                  className="btn-secondary hover-lift"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  VER TIENDA
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  CERRAR SESIÓN
                </button>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="order-history">
            <h2 className="section-title">HISTORIAL DE PEDIDOS</h2>
            {orders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  background: "#f9fafb",
                  borderRadius: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                <p>No tienes pedidos aún</p>
                <Link href="/" className="btn-primary hover-lift">
                  EMPEZAR A COMPRAR
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="order-card"
                    style={{
                      background: "white",
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      padding: "1.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      className="order-header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <h3 style={{ margin: 0, fontWeight: "700" }}>{order.order_number || "Pedido"}</h3>
                        <p
                          className="order-date"
                          style={{
                            margin: "0.25rem 0 0",
                            fontSize: "0.875rem",
                            color: "#6b7280",
                          }}
                        >
                          {new Date(order.created_at).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div
                        style={{
                          background: getStatusColor(order.status),
                          color: "white",
                          padding: "0.5rem 1rem",
                          borderRadius: "9999px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {order.status}
                      </div>
                    </div>
                    <div
                      className="order-details"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "1rem",
                        borderTop: "2px solid #e5e7eb",
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        {order.order_items?.length || 0} {order.order_items?.length === 1 ? "producto" : "productos"}
                      </p>
                      <p
                        className="order-total"
                        style={{
                          margin: 0,
                          fontWeight: "700",
                          fontSize: "1.125rem",
                        }}
                      >
                        ${order.total_price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Settings */}
          <div className="profile-settings">
            <h2 className="section-title">CONFIGURACIÓN</h2>
            <div
              className="settings-list"
              style={{
                background: "white",
                border: "2px solid #e5e7eb",
                borderRadius: "0.5rem",
                overflow: "hidden",
              }}
            >
              <button
                className="setting-item"
                style={{
                  width: "100%",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid #e5e7eb",
                  background: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <span>Mi Email</span>
                <span style={{ color: "#9ca3af" }}>→</span>
              </button>
              <button
                className="setting-item"
                style={{
                  width: "100%",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid #e5e7eb",
                  background: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <span>Preferencias de Email</span>
                <span style={{ color: "#9ca3af" }}>→</span>
              </button>
              <button
                className="setting-item"
                style={{
                  width: "100%",
                  padding: "1rem 1.5rem",
                  background: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <span style={{ color: "#ef4444" }}>Eliminar Cuenta</span>
                <span style={{ color: "#9ca3af" }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <Link href="/" className="footer-logo">
            PETLY.STORE
          </Link>
          <div className="footer-copyright">© 2026 Petly Store. Todos los derechos reservados.</div>
          <div className="footer-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
