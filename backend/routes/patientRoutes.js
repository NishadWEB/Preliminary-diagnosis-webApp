import express from "express";
import {selectRole, getRegisterPage} from "../controllers/patientController.js";
import { getAboutPage } from "../controllers/aboutPageController.js";

const router = express.Router();

router.get("/home/selectRole/:role", selectRole);
router.get('/about/:page', getAboutPage);

router.get('/registerPatient', getRegisterPage);

export default router;