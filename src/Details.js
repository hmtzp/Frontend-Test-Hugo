import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Details = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchProductAndDescription = async () => {
      try {
        const productResponse = fetch(
          `https://api.mercadolibre.com/items/${itemId}`
        );
        const descriptionResponse = fetch(
          `https://api.mercadolibre.com/items/${itemId}/description`
        );

        const [productData, descriptionData] = await Promise.all([
          productResponse.then((res) => res.json()),
          descriptionResponse.then((res) => res.json()),
        ]);

        setProduct(productData);
        setDescription(descriptionData.plain_text);
      } catch (error) {
        console.error("Failed to fetch product or description", error);
      }
    };

    fetchProductAndDescription().then((r) => console.error("WTF"));
  }, [itemId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.pictures[0]?.url} alt={product.title} />
      <p>Price: ${product.price}</p>
      <p>Description: {description}</p>
    </div>
  );
};

export default Details;
