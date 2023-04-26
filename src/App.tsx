import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Dexie from 'dexie';
import "./App.css"
import {Product} from "./types/types";
import ProductCard from "./components/ProductCard";

const db = new Dexie('FakeStore');
db.version(1).stores({
    products: 'id',
});

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const getProducts = async () => {
        try {
            const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
            const products = response.data;

            // Проверяем, есть ли данные уже в IndexedDB
            const indexedDBProducts = await db.table('products').toArray();

            // Если данные отсутствуют в IndexedDB, то записываем их туда.
            if (indexedDBProducts.length === 0) {
                await db.table('products').bulkPut(products);
                console.log('Данные успешно записаны в IndexedDB');
                setProducts(products);
            } else {
                // Если данные уже есть в IndexedDB, то сравниваем их с данными с сервера.
                const isSameData = JSON.stringify(indexedDBProducts) === JSON.stringify(products);

                if (!isSameData) {
                    await db.table('products').clear();
                    await db.table('products').bulkPut(products);
                    console.log('Данные успешно обновлены в IndexedDB');
                }
                setProducts(indexedDBProducts);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

  return (
    <div className="App">
        {products.map((product) => (
            <ProductCard
                key={product.id}
                product={product}
            />
        ))}
    </div>
  );
}

export default App;
