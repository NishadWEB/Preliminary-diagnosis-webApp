import express from 'express';
import {registerPatient , registerDoctor, getPatientRegisterPage, getDoctorRegisterPage} from '../controllers/registerController.js';

const router = express.Router();

router.get('/registerPatient', getPatientRegisterPage);
router.get('/registerDoctor', getDoctorRegisterPage);


router.post('/registerPatient',registerPatient);
router.post('/registerDoctor', registerDoctor);


export default router;
