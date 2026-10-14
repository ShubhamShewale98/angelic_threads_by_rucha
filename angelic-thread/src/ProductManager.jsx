import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cmsProducts from "./utils/loadProducts";

const EMPTY_FORM = {
  title: "",
  price: "",
  category: "Dresses",
  image: "",
  description: "",
};
const AUTHORIZED_EMAIL = "shubhamshewale498@gmail.com";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductManager() {
  const identityAvailable = typeof window !== "undefined" && Boolean(window.netlifyIdentity);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [identityReady, setIdentityReady] = useState(!identityAvailable);

  useEffect(() => {
    const identity = window.netlifyIdentity;
    if (!identity) return undefined;

    const handleInit = (currentUser) => {
      setUser(currentUser);
      setIdentityReady(true);
    };
    const handleLogin = (currentUser) => {
      setUser(currentUser);
      identity.close();
    };
    const handleLogout = () => setUser(null);
    const handleError = (error) => {
      setNotice(error?.message || "Netlify Identity could not initialize. Check that Identity is enabled for this site.");
      setIdentityReady(true);
    };

    identity.on("init", handleInit);
    identity.on("login", handleLogin);
    identity.on("logout", handleLogout);
    identity.on("error", handleError);

    try {
      identity.init();
      // Also read the current session in case the widget initialized before this route mounted.
      window.setTimeout(() => {
        const currentUser = identity.currentUser();
        if (currentUser) setUser(currentUser);
        setIdentityReady(true);
      }, 0);
    } catch (error) {
      handleError(error);
    }

    return () => {
      identity.off("init", handleInit);
      identity.off("login", handleLogin);
      identity.off("logout", handleLogout);
      identity.off("error", handleError);
    };
  }, []);

  const isAdmin = user?.email?.toLowerCase() === AUTHORIZED_EMAIL;
  console.log("---isAdmin", user?.email)

  function beginEdit(product) {
    setEditingId(product.id);
    setForm({
      title: product.title ?? product.name ?? "",
      price: String(product.price ?? ""),
      category: product.category ?? "Dresses",
      image: product.image ?? "",
      description: product.description ?? "",
    });
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");

    const slug = editingId || slugify(form.title);
    const product = {
      title: form.title.trim(),
      price: form.price.trim(),
      category: form.category,
      image: form.image.trim(),
      description: form.description.trim(),
    };

    try {
      const token = await user.jwt();
      const response = await fetch("/.netlify/functions/products", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, product }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save product.");

      setNotice("Product committed to the repository. Netlify will rebuild the site shortly.");
      setForm(EMPTY_FORM);
      setEditingId(null);
      window.setTimeout(() => window.location.reload(), 1800);
    } catch (error) {
      setNotice(error.message || "Could not save product.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete ${product.name}? This commits a deletion to the repository.`)) return;
    setBusy(true);
    setNotice("");

    try {
      const token = await user.jwt();
      const response = await fetch("/.netlify/functions/products", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: product.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not delete product.");
      setNotice("Product deleted from the repository. Netlify will rebuild the site shortly.");
      window.setTimeout(() => window.location.reload(), 1800);
    } catch (error) {
      setNotice(error.message || "Could not delete product.");
    } finally {
      setBusy(false);
    }
  }

  if (!identityReady) return <main className="product-manager"><p>Checking sign-in…</p></main>;

  if (!identityAvailable) {
    return <main className="product-manager"><Link to="/" className="text-link">← Back to store</Link><section className="product-manager-panel"><h1>Sign-in is unavailable</h1><p>The Netlify Identity widget did not load. Check your connection and confirm that this site is deployed on Netlify with Identity enabled.</p><button className="secondary-button" onClick={() => window.location.reload()}>Try again</button></section></main>;
  }

  if (!user) {
    return (
      <main className="product-manager">
        <Link to="/" className="text-link">← Back to store</Link>
        <section className="product-manager-panel">
          <p className="eyebrow">STORE MANAGEMENT</p>
          <h1>Sign in to manage products</h1>
          <p>Sign in with the authorized Netlify Identity account.</p>
          <button className="primary-button" onClick={() => window.netlifyIdentity.open("login")}>Sign in</button>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="product-manager">
        <p>This account is not authorized to manage products.</p>
        <button className="secondary-button" onClick={() => window.netlifyIdentity.logout()}>Sign out</button>
      </main>
    );
  }

  return (
    <main className="product-manager">
      <header className="product-manager-header">
        <div><p className="eyebrow">ANGELIC THREAD</p><h1>Manage products</h1></div>
        <div className="product-manager-links">
          <Link to="/" className="text-link">View store</Link>
          <a href="/admin/" className="text-link">Open Decap CMS</a>
          <button className="secondary-button" onClick={() => window.netlifyIdentity.logout()}>Sign out</button>
        </div>
      </header>

      <section className="product-manager-panel">
        <h2>{editingId ? "Edit product" : "Add a product"}</h2>
        <form className="product-manager-form" onSubmit={saveProduct}>
          <label>Product title<input required maxLength="120" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label>Price<input required maxLength="40" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
          <label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Dresses</option><option>Tops</option><option>Kurtis</option><option>Festive</option></select></label>
          <label>Image URL<input required type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://… or /uploads/image.jpg" /></label>
          <label className="product-manager-full">Description<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <div className="product-manager-full product-manager-actions">
            <button className="primary-button" disabled={busy || !slugify(form.title)}>{busy ? "Saving…" : editingId ? "Save changes" : "Add product"}</button>
            {editingId && <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}>Cancel edit</button>}
          </div>
        </form>
        {notice && <p className="product-manager-notice" role="status">{notice}</p>}
      </section>

      <section className="product-manager-panel">
        <h2>Current products ({cmsProducts.length})</h2>
        {cmsProducts.length === 0 ? <p>No products have been added yet.</p> : (
          <div className="product-manager-list">
            {cmsProducts.map((product) => (
              <article className="product-manager-item" key={product.id}>
                <img src={product.image} alt="" />
                <div><strong>{product.name}</strong><span>{product.category} · ₹{product.price}</span></div>
                <button className="secondary-button" disabled={busy} onClick={() => beginEdit(product)}>Edit</button>
                <button className="delete-button" disabled={busy} onClick={() => deleteProduct(product)}>Delete</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
