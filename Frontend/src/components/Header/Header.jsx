import React from "react";
import { NavLink } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { BsCartPlus } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import {InputGroup,Input,InputRightElement,useMediaQuery} from "@chakra-ui/react";
const Header = () => {
  return (
    <nav className="h-[80px] w-full bg-[#ff5900be] opacity-100 z-10 sticky top-0 left-0 text-white flex justify-between items-center px-[10px] sm:px[30px] md:px-10 mb-[1px]">
      <div className="flex gap-5"><IoCartOutline size={30}/><h3 className="hidden sm:block sm:text-md md:text-xl font-semibold">E-commerce Site</h3></div>
      {/* input chakra component */}
    <InputGroup bg="#fff"w={{base:"60vw",md:"50vw",lg:"40vw"}}textColor="#000"className="rounded-md searchBar">
      <Input
        pr='4.5rem'
        placeholder='search items here...'
        focusBorderColor="gray.400"
        border={2}
        fontSize={14}
      />
      <InputRightElement width='4.5rem'>
        <IoMdSearch size={20} color="gray"/>
      </InputRightElement>
    </InputGroup>
      {/* input chakra component end here*/}
      <IoMdMenu size={30} className="block md:hidden"/>
      <div className="hidden md:flex gap-5">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/Profile">Profile</NavLink>
        <NavLink to="/Admin">Admin</NavLink>
        <NavLink to="/Login">Login</NavLink>
        <NavLink to="#"className="relative"><BsCartPlus size={30} className=""/><div className="absolute h-5 w-5 rounded-full bg-white top-[-15px] left-4 grid place-content-center text-[rgb(255,106,0)] text-sm">0</div></NavLink>
      </div>
    </nav>
  );
};

export default Header;
