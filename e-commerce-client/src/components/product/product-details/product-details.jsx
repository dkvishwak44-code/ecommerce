// components/products/ProductDetails.jsx

import ProductImageGallery from "./product-image-gallery";
import ProductInfo from "./product-info";
import ProductTabs from "./product-tab";
import QuantitySelector from "./quantity-selector";
import RelatedProducts from "./related-product";

// import ProductImageGallery from "./ProductImageGallery";

// import ProductInfo from "./ProductInfo";

// import ProductTabs from "./ProductTabs";

// import RelatedProducts from "./RelatedProducts";

export default function ProductDetails({ product }) {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* TOP */}
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductImageGallery product={product} />

          <ProductInfo product={product} />
        </div>

        {/* TABS */}
        <div className="mt-16">
          <ProductTabs product={product} />
        </div>

        {/* RELATED */}
        <div className="mt-16">
          <RelatedProducts />
        </div>
      </div>
    </section>
  );
}
