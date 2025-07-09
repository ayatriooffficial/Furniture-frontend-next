"use client";

import { useInView } from "react-intersection-observer";
import Card from "./card";

const LazyCardDataSlider = ({ product }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!inView) {
    return <div ref={ref} style={{ height: 300, width: "100%" }} />;
  }

  return (
    <div ref={ref}>
      <Card
        cardkey={product._id}
        specialPrice={product?.specialprice}
        title={product.productTitle}
        price={product.perUnitPrice}
        desc={product.subcategory}
        productId={product.productId}
        demandtype={product.demandtype}
        imgSrc={product.images}
        rating={product.ratings}
        id={product._id}
        cssClass={"card1flex"}
        productImages={product?.productImages}
        productType={product.productType}
        expectedDelivery={product.expectedDelivery}
        discountedprice={product.discountedprice}
        shortDescription={product.shortDescription}
        offer={product.offer}
        unitType={product.unitType}
        urgency={product.urgency}
      />
    </div>
  );
};

export default LazyCardDataSlider;
