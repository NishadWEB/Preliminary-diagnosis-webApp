import { getPatientloginPage, getDoctorloginPage, loginPatient, loginDoctor} from "../controllers/loginController.js";
import express from 'express';

const router = express.Router();

router.get('/patient', getPatientloginPage);
router.get('/doctor', getDoctorloginPage);

router.post('/patient', loginPatient);
router.post('/doctor', loginDoctor);

export default router;
