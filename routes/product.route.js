const Router = require('express').Router;
const router = Router();
const controller = require("../controllers");
const upload = require("../middleware/upload");

router.get("/", controller.search);
router.post("/", upload, controller.create);
router.post("/delete/:id", controller.delete);
router.get("/:id", controller.edit);
router.post("/:id", upload, controller.update);

module.exports = router;