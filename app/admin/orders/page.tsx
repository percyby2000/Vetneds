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
  customer_email: string
  customer_phone: string
  created_at: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user, userRole, loading } = useAuth()
  const supabase = createClient()

  const [orders, setOrders] = useState<Order[]>([])
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, userRole, loading, router])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (data) setOrders(data)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)
    fetchOrders()
  }

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((order) => order.status === filterStatus)

  if (loading) return <div>Cargando...</div>

  return (
    <>
      {/* Top Marquee Bar */}
      <div className="marquee-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            PANEL ADMINISTRATIVO • GESTIONA PEDIDOS • ACTUALIZA ESTADO • PANEL ADMINISTRATIVO •
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
          <Link href="/admin/orders" className="nav-link" style={{ color: "#5D3FD3", fontWeight: "700" }}>
            PEDIDOS
          </Link>
          <Link href="/admin/analytics" className="nav-link">
            ESTADÍSTICAS
          </Link>
        </div>

        <div className="nav-actions">
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
          <h1 className="hero-headline" style={{ margin: "0 0 2rem 0" }}>
            PEDIDOS
          </h1>

          {/* Filter Buttons */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            {["all", "pending", "confirmed", "shipped", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "2px solid #e5e7eb",
                  background: filterStatus === status ? "#5D3FD3" : "white",
                  color: filterStatus === status ? "white" : "#000",
                  borderColor: filterStatus === status ? "#5D3FD3" : "#e5e7eb",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  fontSize: "0.875rem",
                }}
              >
                {status === "all" ? "TODOS" : status.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Orders Table */}
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
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>NÚMERO</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>CLIENTE</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>TOTAL</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>ESTADO</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>FECHA</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "1rem", fontWeight: "600" }}>{order.order_number}</td>
                      <td style={{ padding: "1rem" }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: "600" }}>{order.customer_email}</p>
                          <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                            {order.customer_phone}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: "1rem", fontWeight: "700" }}>${order.total_price.toFixed(2)}</td>
                      <td style={{ padding: "1rem" }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            border: "1px solid #d1d5db",
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.75rem", color: "#6b7280" }}>
                        {new Date(order.created_at).toLocaleDateString("es-ES")}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <button
                          onClick={() => {
                            const message = `Pedido: ${order.order_number}\nTotal: $${order.total_price}\nEstado: ${order.status}`
                            const whatsappUrl = `https://wa.me/${order.customer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
                            window.open(whatsappUrl, "_blank")
                          }}
                          style={{
                            background: "#25d366",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          CONTACTAR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredOrders.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "white",
                borderRadius: "0.5rem",
                marginTop: "2rem",
              }}
            >
              <p>No hay pedidos con este estado</p>
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
