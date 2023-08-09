import React, { useEffect, useState } from 'react'
import { ProductType } from './types'
const STRIPE_KEY = ''

interface ProductProps {
    product: ProductType,
    addToCart: (item:ProductType)=>void
}

const Product:React.FC<ProductProps> = ({ product, addToCart }) => {
    const [price, setPrice] = useState(0.00)


    const getPrice = async () => {
        const url = `https://api.stripe.com/v1/prices/${product.default_price}`;
        const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${STRIPE_KEY}`
        }
        };
        const res = await fetch(url, options);
        const data = await res.json();
        if (res.status === 200){
            setPrice(data.unit_amount/100)
        }
    };

    useEffect(()=>{
        getPrice()
    }, [])

  return (
    <div>
        <h3>{product.name} - ${price.toFixed(2)} <button onClick={()=>addToCart(product)}>+</button></h3>

    </div>
  )
}

export default Product