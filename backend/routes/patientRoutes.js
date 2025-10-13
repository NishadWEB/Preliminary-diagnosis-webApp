import express from "express";
import {selectRole, getRegisterPage, registerPatient} from "../controllers/patientController.js";
import { getAboutPage } from "../controllers/aboutPageController.js";

const router = express.Router();

router.get("/home/selectRole/:role", selectRole);
router.get('/about/:page', getAboutPage);

router.get('/registerPatient', getRegisterPage);

router.post('/registerPatient', registerPatient);

export default router;