"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"
import { createClient } from "@/app/lib/supabase"

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const { user, userRole, loading } = useAuth()
  const supabase = createClient()

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    newsletterSubs: 0,
  })

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, userRole, loading, router])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const { count: orderCount, data: orderData } = await supabase
      .from("orders")
      .select("total_price", { count: "exact" })

    const { count: productCount } = await supabase.from("products").select("*", { count: "exact" })

    const { count: subCount } = await supabase.from("newsletter_subscriptions").select("*", { count: "exact" })

    const totalRevenue = (orderData || []).reduce((sum, order) => sum + (order.total_price || 0), 0)

    setStats({
      totalOrders: orderCount || 0,
      totalRevenue,
      totalProducts: productCount || 0,
      newsletterSubs: subCount || 0,
    })
  }

  if (loading) return <div>Cargando...</div>

  return (
    <>
      {/* Top Marquee Bar */}
      <div className="marquee-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            PANEL ADMINISTRATIVO • ESTADÍSTICAS • ANÁLISIS DE VENTAS • PANEL ADMINISTRATIVO •
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
          <Link href="/admin/analytics" className="nav-link" style={{ color: "#5D3FD3", fontWeight: "700" }}>
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
            ESTADÍSTICAS
          </h1>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {/* Total Orders Card */}
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "0.5rem",
                border: "2px solid #e5e7eb",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#6b7280", fontSize: "0.875rem", fontWeight: "600" }}>
                PEDIDOS TOTALES
              </h3>
              <p style={{ margin: 0, fontSize: "2.25rem", fontWeight: "700", color: "#3b82f6" }}>{stats.totalOrders}</p>
            </div>

            {/* Revenue Card */}
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "0.5rem",
                border: "2px solid #e5e7eb",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#6b7280", fontSize: "0.875rem", fontWeight: "600" }}>
                INGRESOS TOTALES
              </h3>
              <p style={{ margin: 0, fontSize: "2.25rem", fontWeight: "700", color: "#10b981" }}>
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>

            {/* Products Card */}
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "0.5rem",
                border: "2px solid #e5e7eb",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#6b7280", fontSize: "0.875rem", fontWeight: "600" }}>
                PRODUCTOS
              </h3>
              <p style={{ margin: 0, fontSize: "2.25rem", fontWeight: "700", color: "#8b5cf6" }}>
                {stats.totalProducts}
              </p>
            </div>

            {/* Newsletter Subs Card */}
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "0.5rem",
                border: "2px solid #e5e7eb",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#6b7280", fontSize: "0.875rem", fontWeight: "600" }}>
                SUSCRIPTORES
              </h3>
              <p style={{ margin: 0, fontSize: "2.25rem", fontWeight: "700", color: "#f59e0b" }}>
                {stats.newsletterSubs}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "0.5rem",
              border: "2px solid #e5e7eb",
            }}
          >
            <h2 style={{ marginTop: 0 }}>ACCIONES RÁPIDAS</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <Link href="/admin" className="btn-primary hover-lift" style={{ textAlign: "center", display: "block" }}>
                GESTIONAR PRODUCTOS
              </Link>
              <Link
                href="/admin/orders"
                className="btn-primary hover-lift"
                style={{ textAlign: "center", display: "block" }}
              >
                VER PEDIDOS
              </Link>
              <Link href="/" className="btn-secondary hover-lift" style={{ textAlign: "center", display: "block" }}>
                VER TIENDA
              </Link>
            </div>
          </div>
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
