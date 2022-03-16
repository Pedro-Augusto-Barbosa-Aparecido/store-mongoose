const express = require("express");
const Product = require("../models/Product");

const listFunctions = require("../../utils/listFunctions");
const formatData = require("../../utils/formatData");
const auth = require("../middlewares/auth");

const productRouter = express.Router();

productRouter.use(auth);

productRouter.get("/", async (req, res) => {
    try {
        const start = parseInt(req.body.start) || 0;
        const limit = parseInt(req.body.limit) || 10;
        const filter = req.body.filter || false;

        let products = await Product.find();

        if (filter)
            products = listFunctions.filter(filter, products);

        products = listFunctions.paginate(products, start, limit);

        return res.send({
           results: products,
           start: start,
           total: products.length

        });

    } catch (err) {
        return res.status(400).send({ error: "Problem to loading products!" });

    }

});

productRouter.post("/", async (req, res) => {
    try {
        const _product = await Product.create(req.body);

        return res.send({
            result: {
                success: true,
                object: _product

            }

        });

    } catch (err) {
        return res.status(500).send({ error: "Error on create product!" });

    }

});

productRouter.get("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        let createAt = formatData.formatDate(product.createAt, "Created in ");
        let updatedAt = formatData.formatDate(product.updatedAt, "Updated in ");

        return res.status(200).send({
            result: {
                ...product._doc,
                createAt, updatedAt
            },
            total: 1

        });

    } catch (err) {
        return res.status(400).send({ error: "Error to load Product!" });

    }

});

productRouter.put("/:productId", async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findByIdAndUpdate(productId, {
            ...req.body,
            updatedAt: Date.now()
        }, { new: true });

        return res.status(200).send({
           result: product,
           success: true

        });

    } catch (err) {
        return res.status(400).send({ error: "Error to load Product!" });

    }

});

productRouter.delete("/:productId", async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findByIdAndDelete(productId);

        return res.status(200).send({
            result: product,
            success: true

        });

    } catch (err) {
        return res.status(400).send({ error: "Error on delete product, try again!" });

    }

});

module.exports = app => app.use("/product", productRouter);
