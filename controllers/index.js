const ProductModel = require("../models");
const { uploadFile, deleteFile } = require("../services/file.service");
const { validatePayload } = require("../utils/validate");

const Controller = {
    search: async (req, res) => {
        try {
            const { keyword, success, error } = req.query;
            const products = await ProductModel.search(keyword);
            return res.render("index", { products, success, error });

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
                return res.redirect("/products?error=" + encodeURIComponent(errors.join(", ")));
            }

            const image = await uploadFile(req.file);
            data.image = image;

            await ProductModel.create(data);
            res.redirect("/products?success=Thêm sản phẩm thành công");
        } catch (error) {
            console.log(error);
            res.redirect("/products?error=" + encodeURIComponent("Lỗi thêm sản phẩm: " + error.message));
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
            res.redirect("/products?success=Xóa sản phẩm thành công");
        } catch (error) {
            console.log(error);
            res.redirect("/products?error=" + encodeURIComponent("Lỗi xóa sản phẩm"));
        }
    },
    viewDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductModel.getById(id);
            if (!product) {
                return res.status(404).send("Product not found");
            }
            res.render("detail", { product });
        } catch (error) {
            console.log(error);
            res.status(500).send("Error getting product detail");
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
                return res.redirect("/products?error=" + encodeURIComponent(errors.join(", ")));
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
            res.redirect("/products?success=Cập nhật sản phẩm thành công");
        } catch (error) {
            console.log(error);
            res.redirect("/products?error=" + encodeURIComponent("Lỗi cập nhật sản phẩm: " + error.message));
        }
    }
};

module.exports = Controller;