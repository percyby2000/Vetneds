"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"
import { createClient } from "@/app/lib/supabase"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  products: {
    name: string
    price: number
    image_url: string
    stock_quantity: number
  }
}

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    fetchCartItems()
  }, [user])

  const fetchCartItems = async () => {
    const { data } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity, products(name, price, image_url, stock_quantity)")
      .eq("user_id", user?.id)

    if (data) setCartItems(data)
    setLoading(false)
  }

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(cartId)
      return
    }

    await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", cartId)
    fetchCartItems()
  }

  const removeItem = async (cartId: string) => {
    await supabase.from("cart_items").delete().eq("id", cartId)
    fetchCartItems()
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0)
  const shipping = subtotal > 75 ? 0 : 8.99
  const total = subtotal + shipping

  const handleCheckoutWhatsApp = () => {
    if (!customerEmail || !customerPhone) {
      alert("Por favor completa tu email y teléfono")
      return
    }

    const itemsList = cartItems
      .map((item) => `${item.quantity}x ${item.products?.name} - $${item.products?.price}`)
      .join("\n")

    const message = `Hola! Quiero comprar:\n\n${itemsList}\n\nSubtotal: $${subtotal.toFixed(2)}\nEnvío: ${shipping === 0 ? "GRATIS" : `$${shipping.toFixed(2)}`}\nTotal: $${total.toFixed(2)}\n\nMi email: ${customerEmail}\nMi teléfono: ${customerPhone}`

    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) return <div>Cargando carrito...</div>

  return (
    <>
      {/* Top Marquee Bar */}
      <div className="marquee-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            ENVÍO GRATIS EN PEDIDOS MAYORES A $75 • PAGA POR WHATSAPP • ENTREGA RÁPIDA Y SEGURA • ENVÍO GRATIS EN
            PEDIDOS MAYORES A $75 •
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
            <span className="cart-badge">{cartItems.length}</span>
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

      {/* Cart Section */}
      <main className="cart-section">
        <div className="cart-container">
          <h1 className="cart-title">TU CARRITO</h1>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
              <Link href="/" className="btn-primary hover-lift">
                SEGUIR COMPRANDO
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Cart Items */}
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h3>{item.products?.name}</h3>
                      <p className="cart-item-price">${item.products?.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          −
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>
                        ELIMINAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <h2 className="summary-title">RESUMEN DE ORDEN</h2>
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Envío</span>
                  <span>{shipping === 0 ? "GRATIS" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {subtotal < 75 && (
                  <p className="shipping-note">¡Agrega ${(75 - subtotal).toFixed(2)} más para envío gratis!</p>
                )}
                <div className="summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Checkout Form */}
                <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "2px solid #e5e7eb" }}>
                  <h3 style={{ marginTop: 0, fontSize: "1rem", marginBottom: "1rem" }}>DATOS DE CONTACTO</h3>
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      marginBottom: "0.75rem",
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Tu teléfono (ej: +1234567890)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      marginBottom: "1rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="btn-primary hover-lift"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.23c-1.477.787-2.753 1.882-3.71 3.2C2.957 10.445 2.507 12.369 2.507 14.38c0 .934.119 1.86.35 2.76l.37-1.355c.084-.31.181-.645.29-.99.584-1.905.89-3.477.89-4.414 0-1.26.257-2.427.73-3.528.52-1.274 1.282-2.38 2.262-3.22 1.052-.914 2.313-1.494 3.71-1.748 1.207-.215 2.351-.196 3.411.054 1.06.25 2.038.714 2.921 1.383-.784-.122-1.543-.035-2.27.278-1.122.497-2.049 1.302-2.748 2.384-.508.787-.864 1.684-1.082 2.64z" />
                  </svg>
                  PAGAR POR WHATSAPP
                </button>

                <Link
                  href="/"
                  className="btn-secondary hover-lift"
                  style={{ width: "100%", textAlign: "center", display: "block", marginTop: "0.75rem" }}
                >
                  SEGUIR COMPRANDO
                </Link>
              </div>
            </div>
          )}
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
