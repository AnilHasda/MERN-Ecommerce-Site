import React, { useState, useEffect } from "react";
import ContextData from "../Context/createContext";
const ContextProvider = ({ children }) => {
  // this object stores add to cart data
  let [cartData, setCartData] = useState([]);
  // function that dispatch data
  const getData = () => {
    let getCartData = localStorage.getItem("cartData") ? JSON.parse(localStorage.getItem("cartData")):null;
    setCartData(getCartData || []);
  };
  useEffect(() => {
    getData();
  }, []);
  const addToCart = (items) => {
    let getCartData = JSON.parse(localStorage.getItem("cartData"));
    if (getCartData !== null) {
      let findId = getCartData.filter((ele) => ele.id === items.id);
      if (findId.length > 0) {
        let filterInsert = getCartData.map((ele) =>
          ele.id === items.id ? { ...ele, quantity: ele.quantity + 1,price:ele.price+items.price } : ele
        );
        console.log(filterInsert);
        localStorage.setItem("cartData", JSON.stringify(filterInsert));
      } else {
        setCartData((prev) => {
          let cartItems = [...prev, items];
          localStorage.setItem("cartData", JSON.stringify(cartItems));
          return cartItems;
        });
      }
    }else{
      setCartData((prev) => {
        let cartItems = [...prev, items];
        localStorage.setItem("cartData", JSON.stringify(cartItems));
        return cartItems;
      });
    }
    getData();
  };
  const removeAll = () => {
    localStorage.removeItem("cartData");
    window.location.reload();
  };
  // function to remove individual item from localStorage
  function removeLocal(id) {
    let data = cartData.filter((ele) => ele.id !== id);
    localStorage.setItem("cartData", JSON.stringify(data));
    getData();
  }
  return (
    <ContextData.Provider
      value={{ cartData,setCartData,addToCart, getData, removeAll, removeLocal }}
    >
      {children}
    </ContextData.Provider>
  );
};

export default ContextProvider;