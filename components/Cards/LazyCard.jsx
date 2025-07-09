"use client";

import { useInView } from "react-intersection-observer";
import Card from "./card";

const LazyCard = ({ product, isProductInCart }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!inView) {
    // Optionally return a placeholder/skeleton here
    return <div ref={ref} style={{ height: 300, width: "100%" }} />;
  }

  return (
    <div ref={ref}>
      <Card
        title={product.productTitle}
        productImages={product.productImages}
        specialPrice={product?.specialprice}
        price={product.perUnitPrice}
        desc={product.productTitle}
        shortDescription={product.shortDescription}
        demandtype={product.demandtype}
        imgSrc={product.images}
        rating={product.ratings}
        id={product._id}
        category={product.category}
        productId={product.productId}
        cssClass={"card1flex"}
        inCart={isProductInCart(product._id)}
        unitType={product.unitType}
        productType={product.productType}
        expectedDelivery={product.expectedDelivery}
        discountedprice={product.discountedprice}
        offer={product.offer}
        urgency={product.urgency}
      />
    </div>
  );
};

export default LazyCard;
