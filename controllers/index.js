const ProductModel = require("../models");
const { uploadFile, deleteFile } = require("../services/file.service");
const { validatePayload } = require("../utils/validate");

const Controller = {
    search: async (req, res) => {
        try {
            const { keyword } = req.query;
            const products = await ProductModel.search(keyword);
            return res.render("index", { products });

        } catch (error) {
            console.log(error);
            res.status(500).send("Error getting products");
        }
    },
    create: async (req, res) => {
        try {
            const data = req.body;
            
            const errors = validatePayload(data, false, !!req.file);
            if (errors) {
                return res.status(400).send(errors.join(", "));
            }

            const image = await uploadFile(req.file);
            data.image = image;

            await ProductModel.create(data);
            res.redirect("/products");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error creating product: " + error.message);
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Get product to get image path before deleting
            const product = await ProductModel.getById(id);
            if (product && product.image) {
                await deleteFile(product.image);
            }
            
            await ProductModel.delete(id);
            res.redirect("/products");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error deleting product");
        }
    },
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductModel.getById(id);
            if (!product) {
                return res.status(404).send("Product not found");
            }
            res.render("edit", { product });
        } catch (error) {
            console.log(error);
            res.status(500).send("Error getting product");
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductModel.getById(id);
            if (!product) {
                return res.status(404).send("Product not found");
            }
            const data = req.body;
            
            const errors = validatePayload(data, true, !!req.file);
            if (errors) {
                return res.status(400).send(errors.join(", "));
            }

            let imageUrl = product.image;
            if (req.file) {
                imageUrl = await uploadFile(req.file);
                // Delete old image if exists
                if (product.image) {
                    await deleteFile(product.image);
                }
            }

            await ProductModel.update(id, { ...data, image: imageUrl });
            res.redirect("/products");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error updating product: " + error.message);
        }
    }
};

module.exports = Controller;