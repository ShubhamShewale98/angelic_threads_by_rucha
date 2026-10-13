
import { useState } from "react";

const initialForm = {
  name: "",
  category: "Dresses",
  price: "",
  image: "",
  tag: "New arrival",
};

export default function ProductForm({ onAddProduct }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }
function convertDriveImageUrl(url) {
  if (!url || typeof url !== "string") {
    return "";
  }

  const trimmedUrl = url.trim();

  // Match Google Drive file links
  const match = trimmedUrl.match(
    /drive\.google\.com\/file\/d\/([^/?#]+)/
  );

  // Also support links containing ?id=FILE_ID
  const queryMatch = trimmedUrl.match(
    /[?&]id=([^&]+)/
  );

  const fileId = match?.[1] || queryMatch?.[1];

  // Convert to a direct thumbnail URL
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  // Keep other image URLs unchanged
  return trimmedUrl;
}
  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!/^https:\/\/drive\.google\.com\//i.test(form.image.trim())) {
      setError("Please enter a Google Drive sharing URL.");
      return;
    }
console.log("----on Product save",{
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: form.price.trim(),
      image: convertDriveImageUrl(form.image),
      tag: form.tag.trim() || "New arrival",
    })
    onAddProduct({
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: form.price.trim(),
      image: convertDriveImageUrl(form.image),
      tag: form.tag.trim() || "New arrival",
    });

    setForm(initialForm);
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Add a boutique product</h2>

      <label>
        Product name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Pink festive dress"
          required
        />
      </label>

      <label>
        Category
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Dresses</option>
          <option>One Piece</option>
          <option>Short Skirt</option>
          <option>Tops</option>
          <option>Reacreated Outfits</option>
          <option>Kurtis</option>
          <option>Blouses</option>
          <option>Sarries</option>
              <option>Other</option>
        </select>
      </label>

      <label>
        Price
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="e.g. ₹1,299"
          required
        />
      </label>

      <label>
        Google Drive image URL
        <input
          type="url"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://drive.google.com/..."
          required
        />
      </label>

      <label>
        Product tag
        <input
          name="tag"
          value={form.tag}
          onChange={handleChange}
          placeholder="e.g. Bestseller"
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit">Add product</button>
    </form>
  );
}
