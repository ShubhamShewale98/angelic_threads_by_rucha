import cmsProducts from "../utils/loadProducts";
import ProductContext from "./productContextInstance";

function ProductProvider({ children }) {
  return (
    <ProductContext.Provider value={cmsProducts}>
      {children}
    </ProductContext.Provider>
  );
}

export { ProductProvider };
