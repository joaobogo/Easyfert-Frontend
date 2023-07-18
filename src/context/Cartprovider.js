import React, { useState, useEffect } from "react";
import { getsum } from "../functions";
import Cartcontext from "./Cartcontext";
import { client } from "../client";
import { getBlingProducts } from "../functions";



const savedCart = localStorage.getItem("newcart");
console.log(savedCart);
const initialCart = savedCart ? JSON.parse(savedCart) : [];
const id = localStorage.getItem("orderId");
const customerKey = localStorage.getItem("customerKey");
const savedWishList = localStorage.getItem("newWishList");
const initialWishList = savedWishList ? JSON.parse(savedWishList) : [];

function CartProvider({ children }) {
  const [cart, setCart] = useState(initialCart);
  const [totalprice, setTotalprice] = useState(getsum(initialCart));
  const [globalCep, setGlobalCep] = useState("");
  const [shippings, setShippings] = useState([]);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [orderId, setOrderId] = useState(id);
  const [customerData, setCustomerData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!customerKey);
  const [customerId, setCustomerId] = useState(customerKey);
  const [sanityprod, setSanityProd] = useState([]);
  const [wishlist, setWishList] = useState(initialWishList);
  const [tokenData, setTokenData] = useState({});

  useEffect(() => {
    client.fetch('*[_type=="shipping"]').then((prices) => {
      setShippings(prices);
    });
    client.fetch('*[_type=="product"]').then((products) => {
      setSanityProd(products);
    });
    client.fetch('*[_type=="token"]').then((token) => {
      console.log(token);
      setTokenData(token[0]);
      getBlingProducts(token[0],handleToken).then(console.log)
    });
    client.getDocument(customerId).then((res) => setCustomerData(res));
  }, []);

  const handleToken = (data) => {
    const { access_token, refresh_token, expires_in } = data;
    setTokenData(data);
    client
      .patch(tokenData._id)
      .set({ access_token, refresh_token, expires_in })
      .commit();
  };

  const setCustomerKey = (key) => {
    localStorage.setItem("customerKey", key);
    setCustomerId(key);
  };

  const handleWish = (id) => {
    setWishList((prevlist) => {
      const newWishList = [...prevlist, id];
      localStorage.setItem("newWishList", JSON.stringify(newWishList));
      if (customerData._id) {
        client.patch(customerData._id).set({ wishlist: newWishList }).commit();
      }
      return newWishList;
    });
  };

  const handleUnWish = (id) => {
    setWishList((prevlist) => {
      const newWishList = prevlist.filter((item) => item !== id);
      localStorage.setItem("newWishList", JSON.stringify(newWishList));
      if (customerData._id) {
        client.patch(customerData._id).set({ wishlist: newWishList }).commit();
      }
      return newWishList;
    });
  };

  const globalState = {
    cart,
    setCart,
    totalprice,
    setTotalprice,
    setGlobalCep,
    globalCep,
    shippings,
    setShippings,
    setShippingPrice,
    shippingPrice,
    orderId,
    setOrderId,
    customerData,
    setCustomerData,
    isLoggedIn,
    setIsLoggedIn,
    setCustomerKey,
    sanityprod,
    wishlist,
    handleWish,
    handleUnWish,
    tokenData,
    setTokenData,
    handleToken,
  };

  return (
    <Cartcontext.Provider value={globalState}>{children}</Cartcontext.Provider>
  );
}

export default CartProvider;
