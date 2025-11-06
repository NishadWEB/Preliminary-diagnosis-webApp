import express from "express";
import { selectRole } from "../controllers/roleController.js";
import {getAboutPage} from "../controllers/aboutPageController.js"
import { getContactPage, getFaqsPage, getFeaturesPage } from "../controllers/launchPageController.js";

const router = express.Router();

router.get('/home/selectRole/:role', selectRole);
router.get('/about/:page', getAboutPage);
router.get('/features/:page' ,getFeaturesPage);
router.get('/faqs/:page', getFaqsPage);
router.get('/contact/:page', getContactPage);

export default router;