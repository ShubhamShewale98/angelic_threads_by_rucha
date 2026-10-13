import { useContext } from "react";
import ProductContext from "./productContextInstance";

function useProducts() {
  const products = useContext(ProductContext);

  if (products === null) {
    throw new Error("useProducts must be used inside ProductProvider");
  }

  return products;
}

export { useProducts };
