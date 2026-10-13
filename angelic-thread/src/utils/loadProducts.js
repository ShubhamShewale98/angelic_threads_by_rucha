const productModules = import.meta.glob("../data/products/*.json", {
  eager: true,
  import: "default",
});

// Decap stores a product title as `title`; the storefront uses `name`.
export const cmsProducts = Object.entries(productModules).map(([path, product]) => ({
  ...product,
  id: product.id ?? path.split("/").pop().replace(/\.json$/, ""),
  name: product.name ?? product.title,
}));

export default cmsProducts;
