module.exports = {
    validatePayload: (payload, isUpdate, hasFile) => {
        const { name, price, quantity } = payload;
        const errors = [];

        if (!name || name.trim() === "") {
            errors.push("Tên sản phẩm không được để trống");
        }

        if (!hasFile && !isUpdate) {
            errors.push("Hình ảnh không được để trống");
        }

        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            errors.push("Giá không hợp lệ");
        }

        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
            errors.push("Số lượng không hợp lệ");
        }

        if (errors?.length > 0) {
            return errors;
        }

        return null;
    },
};
