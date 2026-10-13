
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import "./App.css";
import FestiveTrends from "./FestiveTrends";
import { useProducts } from "./context/ProductContext";
import { ProductProvider } from "./context/ProductProvider";
import ProductManager from "./ProductManager";


function AppContent() {
  const products = useProducts();

  return (
    <Routes>
      <Route path="/" element={<Storefront products={products} />} />
      <Route path="/manage-products" element={<ProductManager />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function Storefront({ products }) {
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const visibleProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  return (
    <main className="storefront">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-name">Angelic Thread</span>
          <span className="brand-subtitle">BY RUCHA · MADE WITH LOVE</span>
        </Link>
        <a
          className="header-link"
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram ↗
        </a>
      </header>
      <section className="hero" aria-label="Angelic Thread boutique" />
      <FestiveTrends />

      <section id="collection" className="collection section">
        <p className="eyebrow">THE LATEST EDIT</p>
        <h2>Our Collection</h2>
        <p className="section-description">
          Find something that feels uniquely you.
        </p>

        <div className="category-list">
          {categories.map((item) => (
            <button
              key={item}
              className={`category-button ${category === item ? "active" : ""
                }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {visibleProducts.length === 0 ? (
          <p className="empty-state">
            No products here yet. Please check back soon.
          </p>
        ) : (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img
                    className="product-image"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                  {product.tag && (
                    <span className="product-tag">{product.tag}</span>
                  )}
                </div>
                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <p className="product-price">₹{product.price}</p>
                  <a
                    className="enquire-link"
                    href={`https://wa.me/917057354437?text=${encodeURIComponent(
                      `Hi, I'm interested in ${product.name} priced at ₹${product.price}. Please share more details.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Enquire on WhatsApp ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
<footer className="site-footer">
        <Link to="/" className="footer-brand">Angelic Thread by Rucha</Link>
        <p>Made with love. Worn with confidence.</p>
      </footer>
    </main>
  );
}

function NotFound() {
  return (
    <main className="admin-page">
      <section className="admin-panel">
        <h1>Page not found</h1>
        <Link to="/" className="primary-link">Return to store</Link>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ProductProvider>
  );
}
