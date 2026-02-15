"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const website_controller_1 = require("../controllers/website.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(auth_middleware_1.protect, website_controller_1.getWebsites)
    .post(auth_middleware_1.protect, website_controller_1.addWebsite);
router.route('/:id')
    .get(auth_middleware_1.protect, website_controller_1.getWebsiteById)
    .delete(auth_middleware_1.protect, website_controller_1.deleteWebsite)
    .put(auth_middleware_1.protect, website_controller_1.updateWebsite);
exports.default = router;
