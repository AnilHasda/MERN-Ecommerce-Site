import express from "express";
const router=express.Router();
import { getData,insertData } from "../../Controllers/productControllers/productControllers.js";
import { isLoggin } from "../../isLoggin/isLoggin.js";
import { isAdmin } from "../../isAdmin/isAdmin.js";
import { data } from "../../multerMiddleware/multer.js";
router.get("/",isLoggin,isAdmin,getData);
router.post("/product/insertData",data,insertData);
export default router;
