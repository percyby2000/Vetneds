"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/app/lib/supabase"
import { useAuth } from "@/app/lib/auth-context"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  description: string
  stock_quantity: number
}

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const { user, userRole } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }
  }, [searchQuery, products])

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").eq("is_active", true).limit(8)
    if (data) setProducts(data)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchOpen(false)
  }

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      alert("Por favor inicia sesión para agregar productos al carrito")
      return
    }

    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity: 1,
    })

    if (!error) {
      alert("Producto agregado al carrito!")
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("newsletter-email") as string

    try {
      await supabase.from("newsletter_subscriptions").insert({
        email,
        is_active: true,
      })
      alert("¡Gracias por suscribirse! Recibirás descuentos exclusivos en tu email.")
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      alert("Error al suscribirse. Intenta de nuevo.")
    }
  }

  return (
    <>
      {/* Top Marquee Bar */}
      <div className="marquee-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            ENVÍO GRATIS EN PEDIDOS MAYORES A S/.100 • COMIDA PREMIUM PARA MASCOTAS • PRODUCTOS DE CALIDAD • ENVÍO A TODO
            EL PAÍS • ENVÍO GRATIS EN PEDIDOS MAYORES A S/.100 • COMIDA PREMIUM PARA MASCOTAS •
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navigation">
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            VET<span>.</span>NEDS
          </Link>
          <div className="beta-badge">MASCOTAS</div>
        </div>

        {/* Links */}
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
          {userRole === "admin" && (
            <Link href="/admin" className="nav-link" style={{ color: "#5D3FD3", fontWeight: "700" }}>
              ADMIN
            </Link>
          )}
        </div>

        {/* Actions */}
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
          <Link href={user ? "/profile" : "/auth/login"} className="nav-icon">
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
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Busca comida, ropa, servicios..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
            <button className="search-close" onClick={() => setSearchOpen(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Hero Section */}
      <main className="hero-section">
        {/* Left Content */}
        <div className="hero-content">
          {/* Badge */}
          <div className="season-badge">COLECCIÓN ESPECIAL 2026</div>

          {/* Headline */}
          <h1 className="hero-headline">
            TUS MASCOTAS
            <br />
            MERECEN LO <span className="hero-headline-highlight">MEJOR.</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subtext">
            Comida premium, ropa cómoda y servicios profesionales para el bienestar de tus mascotas. Calidad
            garantizada, precios justos y envío rápido.
          </p>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <Link href="#trending" className="btn-primary hover-lift">
              VER PRODUCTOS
            </Link>
            <Link href="/auth/signup" className="btn-secondary hover-lift">
              SUSCRIBIRSE
            </Link>
          </div>

          {/* Social Proof */}
          <div className="social-proof">
            <div className="avatar-stack">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="User" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User" />
              <img src="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop" alt="User" />
            </div>
            <div>
              <div className="social-proof-title">5000+ Mascotas Felices</div>
              <div className="social-proof-subtitle">Confían en vetneds</div>
            </div>
          </div>
        </div>

        {/* Right Visuals (Collage Style) */}
        <div className="hero-visuals">
          {/* Abstract Background Shape */}
          <svg
            className="abstract-shape"
            width="600"
            height="600"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#5D3FD3"
              d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,31.6C59,41.7,47.1,49,35.3,55.1C23.5,61.2,11.8,66.1,-0.6,67.1C-12.9,68.1,-25.8,65.2,-37.9,59.2C-50,53.2,-61.3,44.1,-70.5,32.6C-79.7,21.1,-86.8,7.2,-85.1,-6.1C-83.3,-19.4,-72.7,-32.1,-61.6,-41.8C-50.5,-51.5,-38.9,-58.2,-27.1,-66.9C-15.3,-75.6,-3.3,-86.3,10.2,-83.8C23.7,-81.3,30.5,-83.6,44.7,-76.4Z"
              transform="translate(100 100)"
            ></path>
          </svg>

          {/* Main Image */}
          <div className="main-image-container">
            <img
              src="comida.webp"
              alt="Perro feliz comiendo"
            />
            <div className="price-tag">DESDE S/.79.90</div>
          </div>

          {/* Secondary Image (Floating) */}
          <div className="secondary-image">
            <img
              src="perrito1.png"
              alt="Gato adorable"
            />
          </div>

          {/* Sticker Graphic */}
          <div className="sticker-graphic">
            <img
              src="/animalitos.jpg"
              alt="Perro jugando"
            />
            <div className="hot-badge">NUEVO</div>
          </div>

          {/* Decorative Star */}
          <svg
            className="decorative-star"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="#ccff00"
            stroke="#000"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
      </main>

      {/* Trending Strip */}
      <section className="trending-section" id="trending">
        <div className="container">
          <div className="trending-header">
            <h3>Nuestros Productos {searchQuery && `- Resultados de "${searchQuery}"`}</h3>
            <Link href="#trending">Ver Todo</Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>{searchQuery ? "No encontramos productos con esa búsqueda" : "Cargando productos..."}</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card hover-lift">
                  <div className="product-image">
                    {product.stock_quantity === 0 && <span className="product-badge sale">AGOTADO</span>}
                    <img src={product.image_url || "/placeholder.svg"} alt={product.name} />
                  </div>
                  <h4>{product.name}</h4>
                  <p>${product.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock_quantity === 0}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      marginTop: "0.5rem",
                      background: product.stock_quantity === 0 ? "#d1d5db" : "#5D3FD3",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontWeight: "600",
                      cursor: product.stock_quantity === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    {product.stock_quantity === 0 ? "AGOTADO" : "AÑADIR AL CARRITO"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        style={{
          background: "#5D3FD3",
          color: "white",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2 style={{ marginTop: 0, fontSize: "2rem", marginBottom: "1rem" }}>SUSCRÍBETE A NUESTRO BOLETÍN</h2>
          <p style={{ marginBottom: "2rem", fontSize: "1.125rem" }}>
            Obtén descuentos exclusivos y sé el primero en enterarte de nuestros nuevos productos.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            style={{ display: "flex", gap: "0.5rem", maxWidth: "500px", margin: "0 auto" }}
          >
            <input
              type="email"
              name="newsletter-email"
              placeholder="Tu email"
              required
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "none",
                borderRadius: "0.5rem",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#ccff00",
                color: "#000",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              SUSCRIBIR
            </button>
          </form>
        </div>
      </section>

      {/* Simple Footer Strip */}
      <footer className="footer">
        <div className="footer-content">
          <Link href="/" className="footer-logo">
            VETNEDS
          </Link>
          <div className="footer-copyright">© 2026 VETNEDS Todos los derechos reservados.</div>
          <div className="footer-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              TikTok
            </a>

            <a href="https://github.com/percyby2000" target="_blank" rel="noopener noreferrer">Hecho por Percy Cn
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ verticalAlign: "middle", marginRight: "4px" }}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
