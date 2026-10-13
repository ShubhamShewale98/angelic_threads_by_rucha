
import { useState } from "react";
import {
  ArrowRight,
  Heart,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import "./App.css";
const WHATSAPP_NUMBER = "917057354437"; // Replace with your WhatsApp number
import { useProducts } from "./context/ProductContext";
function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const products = useProducts();
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All","Reacreated Outfits", "One Piece", "Short Skirt", "Tops",  "Kurtis" , "Blouses" , "Sarries"];


  const visibleProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.category === activeFilter);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <>
      <div className="announcement">
        A little style, a lot of love. Welcome to our boutique.
      </div>

      <header className="header">
        <a className="brand" href="#home" aria-label="Angelic Thread home">
          <span className="brand-icon">✳</span>
          <span>
            <strong>Angelic Thread</strong>
            <small>BY RUCHA</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
          <a href="#garba" onClick={() => setMenuOpen(false)}>Garba Special</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>

        <a
          className="header-cta"
          href={whatsappLink("Hello Rucha! I would like to know more about your collection.")}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={17} />
          Let's Talk
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <span className="eyebrow">STYLE THAT FEELS LIKE YOU</span>
            <h1>
              Every thread tells
              <br />
              <em>a beautiful story.</em>
            </h1>
            <p>
              Discover thoughtfully chosen styles, timeless ethnic wear,
              and little details that make every outfit feel special.
            </p>

            <div className="hero-actions">
              <a className="button button-dark" href="#collections">
                Explore Collection <ArrowRight size={18} />
              </a>
              <a className="text-link" href="#about">
                Our story <span>↗</span>
              </a>
            </div>

            <div className="hero-note">
              <span className="note-star">✳</span>
              <span>Curated with love, just for you.</span>
            </div>
          </div>

          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=90"
              alt="Elegant fashion inspiration"
            />
            <div className="image-caption">
              <span>THE NEW EDIT</span>
              <strong>Made to feel beautiful.</strong>
            </div>
            <div className="floating-stamp">
              <span>MADE</span>
              <span>WITH</span>
              <strong>♥</strong>
              <span>LOVE</span>
            </div>
          </div>
        </section>

        <section className="values-strip">
          <span>✳ Thoughtfully Curated</span>
          <span>✳ Style for Every Occasion</span>
          <span>✳ Personalised Enquiries</span>
        </section>
        <section className="collections section" id="collections">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FIND YOUR FAVOURITE</span>
              <h2>Pieces you'll <em>fall for.</em></h2>
            </div>
            <p>
              From everyday favourites to festive statement pieces,
              find a style that feels like you.
            </p>
          </div>

          <div className="filters" aria-label="Filter collections">
            {categories.map((category) => (
              <button
                key={category}
                className={activeFilter === category ? "filter active" : "filter"}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <button
                    className={favorites.includes(product.id) ? "favorite selected" : "favorite"}
                    onClick={() => toggleFavorite(product.id)}
                    aria-label={`Save ${product.name} to favourites`}
                    aria-pressed={favorites.includes(product.id)}
                  >
                    <Heart
                      size={19}
                      fill={favorites.includes(product.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <a
                    className="quick-enquiry"
                    href={whatsappLink(`Hello Rucha! I am interested in ${product.name}. Please share details.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Enquire on WhatsApp <ArrowRight size={16} />
                  </a>
                </div>
                <div className="product-info">
                  <div>
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                  </div>
                  <span className="product-price">{product.price}</span>
                </div>
              </article>
            ))}
          </div>

          <p className="gallery-note">
            Love a style? Message us for availability, sizes and pricing.
          </p>
        </section>

        <section className="garba-section" id="garba">
          <div className="garba-image">
            <img
              src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1000&q=85"
              alt="Festive traditional fashion inspiration"
              loading="lazy"
            />
            <span className="garba-tag">FESTIVE SPECIAL ✳</span>
          </div>
          <div className="garba-copy">
            <span className="eyebrow">A LITTLE FESTIVE MAGIC</span>
            <h2>
              Old Jeans
              <br />
              to <em>Garba-Ready!</em>
            </h2>
            <p>
              Have an old pair of jeans? Let's give it a festive twist.
              Contact us to discuss your ideas and explore a Garba-ready look.
            </p>
            <a
              className="button button-dark"
              href={whatsappLink("Hello Rucha! I am interested in the Old Jeans to Garba-Ready offer. Please share the details.")}
              target="_blank"
              rel="noreferrer"
            >
              Ask About the Offer <ArrowRight size={18} />
            </a>
            <span className="garba-footnote">
              ✳ Contact us for customisation details and availability.
            </span>
          </div>
        </section>

        <section className="about section" id="about">
          <span className="about-symbol">✳</span>
          <span className="eyebrow">A NOTE FROM RUCHA</span>
          <h2>Fashion is personal.<br /><em>Let's make it yours.</em></h2>
          <p>
            Angelic Thread is about finding the joy in getting dressed.
            We're here to help you discover styles for your everyday moments,
            celebrations, and everything in between.
          </p>
          <a
            className="text-link"
            href={whatsappLink("Hello Rucha! I'd love to know more about Angelic Thread.")}
            target="_blank"
            rel="noreferrer"
          >
            Say hello to Rucha <ArrowRight size={16} />
          </a>
        </section>

        <section className="contact-section" id="contact">
          <div>
            <span className="eyebrow">LET'S CONNECT</span>
            <h2>Your next favourite outfit<br />could be <em>one message away.</em></h2>
          </div>
          <a
            className="button button-light"
            href={whatsappLink("Hello Rucha! I'd like to enquire about your boutique collection.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={19} /> Chat on WhatsApp
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">✳</span>
          <span>
            <strong>Angelic Thread</strong>
            <small>BY RUCHA</small>
          </span>
        </a>
        <p>Made with love, for your beautiful moments.</p>
        <a href="#home" className="back-top">Back to top ↑</a>
        <span className="copyright">© {new Date().getFullYear()} Angelic Thread by Rucha</span>
      </footer>
    </>
  );
}

export default App;
