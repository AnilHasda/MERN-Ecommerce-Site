import mongoose from "mongoose";
import { orderModel } from "../../Database/orderDatabase/orderModel/orderModel.js";
import { ObjectId } from "mongodb";

const getOrder = async (req, resp) => {
    console.log(req.body);
    const { userId, productId,quantity,price } = req.body;

    try {
        const query = new orderModel({ user: userId, product: productId,quantity:quantity,price:price });
        const result = await query.save();

        // Find the order by its ID and populate the user and product fields
        const finalResult = await orderModel.findById(result._id)
            .populate("user")
            .populate("product")
            .exec();


        if (finalResult) {
            console.log("success")
            resp.status(200).json({ message: "Your order has been created", order: finalResult });
        } else {
            console.log("wrong")
            resp.status(500).json({ message: "Something went wrong!" });
        }
    } catch (error) {
        console.log(error);
        resp.status(500).json({ message: "Internal server error", error });
    }
};

const updateOrder = async (req, resp) => {
    try {
        const query = await orderModel.updateOne({ _id: new ObjectId(req.params.id) });

        if (query) {
            resp.status(200).json({ message: "Data updated successfully" });
        } else {
            resp.status(500).json({ message: "Something went wrong!" });
        }
    } catch (error) {
        console.log(error);
        resp.status(500).json({ message: "Internal server error", error });
    }
};

export { getOrder, updateOrder };