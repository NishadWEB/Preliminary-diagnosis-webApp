import express from 'express';
import { 
    getPatientProfile,
    updatePersonalInfo,
    getSetupWizard ,
     updateMedicalInfo,
    updatePersonalInfoEdit ,
    logout
} from '../controllers/patientController.js';

const router = express.Router();

// Profile page route - shows modal if first login
router.get('/profile', getPatientProfile);

// Setup wizard route (alternative approach)
router.get('/profile/setup', getSetupWizard);

// Handle personal info form submission
router.post('/profile/personal-info', updatePersonalInfo);

// Add medical info route
router.post('/profile/medical-info', updateMedicalInfo);

// Handle personal info update (edit)
router.post('/profile/update-personal-info', updatePersonalInfoEdit);

// handliing logout
router.get('/logout', logout);


export default router;