"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/app/lib/auth-context"

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signUp(email, password, fullName)
      alert("¡Verificación enviada a tu email!")
      router.push("/auth/login")
    } catch (err: any) {
      setError(err.message || "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Top Marquee Bar */}
      <div className="marquee-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            MASCOTAS FELICES • PRODUCTOS DE CALIDAD • ENVÍO RÁPIDO • ATENCIÓN AL CLIENTE 24/7 • MASCOTAS FELICES •
            PRODUCTOS DE CALIDAD • ENVÍO RÁPIDO •
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
          <Link href="/" className="nav-link">
            INICIO
          </Link>
          <Link href="/#trending" className="nav-link">
            COMIDA
          </Link>
          <Link href="/#trending" className="nav-link">
            ROPA
          </Link>
          <Link href="/#trending" className="nav-link">
            SERVICIOS
          </Link>
        </div>

        <div className="nav-actions">
          <Link href="/profile" className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
          <Link href="/cart" className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
        </div>
      </nav>

      {/* Signup Section */}
      <main className="hero-section" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div className="hero-content" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <h1 className="hero-headline">REGISTRATE</h1>
          <p className="hero-subtext">Crea tu cuenta y obtén acceso a descuentos especiales y ofertas exclusivas.</p>

          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>NOMBRE COMPLETO</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>CONTRASEÑA</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary hover-lift"
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              {loading ? "REGISTRANDO..." : "CREAR CUENTA"}
            </button>
          </form>

          <p style={{ textAlign: "center" }}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" style={{ color: "#5D3FD3", fontWeight: "600", textDecoration: "underline" }}>
              Inicia sesión
            </Link>
          </p>
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
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
