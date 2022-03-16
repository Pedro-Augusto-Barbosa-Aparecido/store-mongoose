const mongoose = require("../connection");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },

    description: {
        type: String,
        default: "No description",
        required: false

    },

    price: {
        type: Number,
        required: true,
        default: 0.0

    },

    active: {
        type: Boolean,
        required: true,
        default: true

    },

    createAt: {
        type: Date,
        required: false,
        default: Date.now

    },

    updatedAt: {
        type: Date,
        required: false,
        default: Date.now

    }

});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
