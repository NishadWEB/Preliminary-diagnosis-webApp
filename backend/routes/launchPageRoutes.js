import express from "express";
import {getAboutPage, getFeaturesPage, getFaqsPage, getContactPage} from "../controllers/launchPageController.js"

const router = express.Router();

router.get('/about/:page' , getAboutPage);
router.get('/features/:page' , getFeaturesPage);
router.get('/faqs/:page' , getFaqsPage);
router.get('/contact/:page' , getContactPage);

export default router;
