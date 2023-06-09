import React, { useContext, useEffect, useState } from "react";
import { urlFor } from "../client";
import CartContext from "../context/Cartcontext";
import ProductCardContainer from "./styles/ProductCard.styles";
import { Link } from "react-router-dom";
import { formatCurrency, getBlingProducts } from "../functions";
import redheart from '../assets/redheart.png'
import heart from '../assets/solidheart.png'

function ProductCard({ product }) {
  const { setCart, cart, wishlist, handleWish, handleUnWish } =
    useContext(CartContext);

  const handleClick = () => {
    setCart((prevcart) => {
      const newcart = [
        ...prevcart,
        {
          id: product._id,
          quantity: 1,
          price: product.price,
          _id: product._id,
        },
      ];
      localStorage.setItem("newcart", JSON.stringify(newcart));
      return newcart;
    });
  };

  return (
    <ProductCardContainer>
      {wishlist.some((id) => id === product._id) ? (
        <img className="heart" src={redheart} onClick={() => handleUnWish(product._id)}></img>
      ) : (
          <img className="heart" src={heart} onClick={() => handleWish(product._id)}></img>
      )}


      <Link to={`product/${product._id}`}>
        {product.image && product.image.length && (
          <img src={urlFor(product.image[0])} />
        )}

        <h3>{product.title}</h3>
        <p>{formatCurrency(product.price)}</p>
      </Link>

      

      {cart.some((item) => item.id === product._id) ? (
        <span> Produto já adicionado ao carrinho</span>
      ) : (
        <div className="buttoncontainer">
          <button className="buybutton" onClick={handleClick}>
            Adicionar ao Carrinho
          </button>
          <Link to={`product/${product._id}`} className="detailsbutton">
            Detalhes do Produto
          </Link>
        </div>
      )}
    </ProductCardContainer>
  );
}

export default ProductCard;
