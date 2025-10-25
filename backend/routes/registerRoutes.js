import express from 'express';
import {registerPatient , registerDoctor, getPatientRegisterPage, getDoctorRegisterPage} from '../controllers/registerController.js';

const router = express.Router();

router.get('/patient', getPatientRegisterPage);
router.get('/doctor', getDoctorRegisterPage);


router.post('/patient',registerPatient);
router.post('/doctor', registerDoctor);


export default router;
