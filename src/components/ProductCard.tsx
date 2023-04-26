import React from "react";
import {Product} from "../types/types";

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const [imageSrc, setImageSrc] = React.useState<string | undefined>(
        undefined
    );
    const fetchAndCacheImage = (url: string) => {
        return caches.open("images-cache").then((cache) => {
            return cache.match(url).then((response) => {
                if (!response) {
                    return fetch(url).then((newResponse) => {
                        cache.put(url, newResponse.clone());
                        return newResponse;
                    });
                }
                return response;
            });
        });
    };

    React.useEffect(() => {
        fetchAndCacheImage(product.image).then((response ) => {
            response.blob().then(img => {
                setImageSrc(URL.createObjectURL(img));
            })
        });
    }, [product]);

    return (
        <div className="product-card">
            {imageSrc && <img src={imageSrc} alt={product.title} />}
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <p>Rating: {product.rating.rate} ({product.rating.count} reviews)</p>
        </div>
    );
};

export default ProductCard;
