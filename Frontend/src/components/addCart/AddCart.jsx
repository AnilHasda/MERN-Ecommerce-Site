import React, { useState, useEffect } from "react";
import { useContextData } from "../../addtocartContextApi/Context/createContext";
import { useSelector } from "react-redux";
import CartSummary from "./CartSummary";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Card,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
const AddCart = () => {
  // select variables
  let [totalPrice, setTotalPrice] = useState(0);
  let [userId,setUserId]=useState("");
  // state for checkbox
  // state for handling inputs data
  let [inputs, setInputs] = useState({});
  let { cartData, removeAll, removeLocal, setCartData,removeSelectedItem, getData } =
    useContextData();
    let [checkbox, setCheckbox] = useState([]);
  let isLoggin = useSelector((state) => state.isLogged.status);
  // get user id
  async function getUserId(){
    try {
      let { data } = await axios.get("http://localhost:4000/Profile", {
        withCredentials: true,
      });
      setUserId(data[0]._id)
    } catch (error) {
      // console.log(error);
    }
  }
  useEffect(()=>{
    getUserId();
  },[])
  useEffect(() => {
    if(cartData.length>0){
      setCheckbox(cartData.map(items=>({...items,isChecked:false})));
    }
  }, [cartData]);
  useEffect(() => {
    totalPriceCalculation();
  }, [checkbox, cartData]);
  // function to handle input/quantity
  function handleChange(e) {
    setInputs((prev) => {
      let updateInput = { ...prev, [e.target.name]: e.target.value };
      return updateInput;
    });
  }
  // function for checkBox
  const handleCheck = (e) => {
    let { name, checked } = e.target;
    if (name === "selectAll") {
      let updateCheck = cartData.map((ele) => ({ ...ele, isChecked: checked }));
      setCheckbox(updateCheck);
    } else {
      let updateCheck = checkbox.map((ele, index) =>
        ele.name + index === name ? { ...ele, isChecked: checked } : ele
      );
      // console.log(updateCheck);
      setCheckbox(updateCheck);
    }
  };
  const totalPriceCalculation = () => {
    let total = checkbox
      .filter((ele) => ele.isChecked === true)
      .reduce((acc, curEle) => {
        acc += curEle.price;
        return acc;
      }, 0);
    setTotalPrice(total);
    // console.log(total);
  };

  function changeQuantity(id, operation) {
    let updateData;
    let findData = cartData.filter((ele) => ele.id === id);
    if (operation === "increment") {
      updateData = cartData.map((ele) =>
        ele.id === id
          ? {
              ...ele,
              quantity: ele.quantity + 1,
              price: ele.price + ele.price / ele.quantity,
            }
          : ele
      );
      localStorage.setItem("cartData", JSON.stringify(updateData));
    } else {
      if (findData[0]?.quantity > 1) {
        updateData = cartData.map((ele) =>
          ele.id === id
            ? {
                ...ele,
                quantity: ele.quantity - 1,
                price: ele.price - ele.price / ele.quantity,
              }
            : ele
        );
        localStorage.setItem("cartData", JSON.stringify(updateData));
      } else {
        alert("You can decrease quantity lower than 1 ! Thank You!");
      }
    }
    setCheckbox(updateData);
    totalPriceCalculation();
    getData();
  }
  // function to make order
  async function placeSingleOrder(productId, quantity, price) {
    try {
      let { data } = await axios.post(
        "http://localhost:4000/Profile/placeSingleOrder",
        {
          userId: userId,
          productId: productId,
          quantity: quantity,
          price: price,
        },
        { withCredentials: true }
      );
      if (data) {
        removeLocal(productId);
        // console.log({productId})
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error);
      toast.error("Failed to place order ! Try again later");
    }
  }
  // function for placing multiple orders
  const placeMultipleOrder=async ()=>{
    console.log({multipleuserID:userId})
    let productData=checkbox.filter(ele=>ele?.isChecked===true);
    if(productData.length>0){
    try {
      let { data } = await axios.post(
        "http://localhost:4000/Profile/placeMultipleOrder",
        {
          userId,
          productData,
          totalPrice
        },
        { withCredentials: true }
      );
      if (data) {
        toast.success(data.message)
   let ids=productData.map(ele=>ele.id);
   removeSelectedItem(ids);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error);
      toast.error("Failed to place order ! Try again later");
    }
  }else{
    toast.error("You can not place order without selecting items")
  }
  }
  return isLoggin ? (
    cartData?.length > 0 ? (
      <div className="flex flex-col sm:flex-row gap-5 w-full md:pl-10">
        <div className="add-cart flex flex-col gap-5 w-full sm:w-[50%] pt-10">
          <div>
            <h3 className="text-md font-bold pl-10">
              There are {cartData.length} items available in your cart!
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 ml-10">
            <div>
              <input
                type="checkbox"
                name="selectAll"
                id="selectAll"
                checked={
                  checkbox?.filter((ele) => ele?.isChecked === true)?.length ===
                    checkbox?.length && checkbox?.length !== 0
                    ? true
                    : false
                }
                onChange={(e) => {
                  handleCheck(e);
                }}
              />
              <label htmlFor="selectAll" className="pl-1">
                Select All
              </label>
            </div>
            <Button
              colorScheme="red"
              fontSize="small"
              h={35}
              onClick={removeAll}
            >
              Remove All
            </Button>
            <Button colorScheme="teal" fontSize="small" h={35} onClick={placeMultipleOrder}>
              Order Selected
            </Button>
          </div>
          {cartData.map((ele, index) => {
            return (
              <div
                key={ele.id}
                className="grid place-content-center w-full md:w-[40vw] md:block"
              >
                <Card
                  direction={{ base: "column", lg: "row" }}
                  overflow="hidden"
                  variant="outline"
                  gap={5}
                  py={5}
                  px={5}
                  textAlign={{ base: "center", md: "left" }}
                >
                  <Image
                    objectFit="cover"
                    maxW={{ base: "150px", sm: "200px" }}
                    src={`http://localhost:4000/${ele.item}`}
                    alt={ele.name}
                    m={{ base: "auto", md: "0" }}
                  />
                  <Stack py={5}>
                    <CardBody>
                      <Heading fontSize="lg">{ele.name}</Heading>

                      <Text py="2" fontSize="sm">
                        {ele.description}
                      </Text>
                      <div className="flex justify-between items-center">
                        <Text
                          py="2"
                          color="rgb(242,117,64)"
                          fontWeight="semibold"
                        >
                          ${ele.price}
                        </Text>
                        <div>
                          <input
                            type="checkbox"
                            name={ele.name + index}
                            id="selectOne"
                            checked={checkbox[index]?.isChecked || false}
                            onChange={(e) => {
                              handleCheck(e);
                            }}
                          />
                          <label htmlFor="selectOne" className="pl-1">
                            Select
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Text
                          py="2"
                          color="rgb(242,117,64)"
                          fontWeight="semibold"
                        >
                          quantity:
                        </Text>
                        <div className="flex items-center gap-3">
                          <button
                            className="text-[30px]"
                            onClick={() => {
                              changeQuantity(ele.id, "decrement");
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            name={ele.name}
                            min={1}
                            max={10}
                            value={ele.quantity}
                            className="bg-[#e2dada] outline-none h-8 w-10 text-center"
                            readOnly
                            onChange={handleChange}
                          />
                          <button
                            className="text-[30px]"
                            onClick={() => {
                              changeQuantity(ele.id, "increment");
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </CardBody>

                    <CardFooter pb={5}>
                      <Button
                        variant="solid"
                        h={35}
                        colorScheme="blue"
                        fontSize="small"
                        onClick={() => {
                          placeSingleOrder(ele.id, ele.quantity, ele.price);
                        }}
                      >
                        Order
                      </Button>
                      <Button
                        variant="solid"
                        h={35}
                        colorScheme="red"
                        ml={5}
                        fontSize="small"
                        onClick={() => {
                          removeLocal(ele.id);
                        }}
                      >
                        Remove
                      </Button>
                    </CardFooter>
                  </Stack>
                </Card>
              </div>
            );
          })}
        </div>
        <CartSummary data={{ totalPrice, checkbox }} />
      </div>
    ) : (
      <p className="font-bold text-center pt-4">
        No cart data available you can add from home page.Thank You!
      </p>
    )
  ) : (
    <p className="font-bold text-center pt-4">Please login to continue</p>
  );
};

export default AddCart;
