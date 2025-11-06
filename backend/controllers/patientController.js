import { 
    checkProfileCompletion, 
    savePersonalInfo,
    getPersonalInfo,
    getMedicalInfo ,
    saveMedicalInfo,
    updatePersonalInfoInDB 
} from '../models/User.js';

export const logout = (req, res) => {
    res.render('launch_page/launch-page_home.ejs');
}

// GET /patient/profile?patientId=123
export const getPatientProfile = async (req, res) => {
    try {
        const patientId = req.query.patientId;
        console.log('📱 Patient ID received:', patientId); // Debug log
        
        if (!patientId) {
            return res.status(400).render('error', { message: 'Patient ID required' });
        }

        // Check if profile is complete
        const profileComplete = await checkProfileCompletion(patientId);
        console.log('✅ Profile complete status:', profileComplete); // Debug log
        
        if (!profileComplete) {
            // First login - show profile with modal
            console.log('🔄 First login detected - showing modal');
            return res.render('patient/profile.ejs', {
                patientId: patientId,
                isFirstLogin: true,
                personalInfo: null,
                medicalInfo: null
            });
        } else {
            // Profile complete - fetch and show actual patient data
            console.log('✅ Profile complete - fetching data');
            const personalInfo = await getPersonalInfo(patientId);
            const medicalInfo = await getMedicalInfo(patientId);
            
            console.log('📊 Personal Info:', personalInfo); // Debug log
            console.log('🏥 Medical Info:', medicalInfo); // Debug log
            
            return res.render('patient/profile.ejs', {
                patientId: patientId,
                isFirstLogin: false,
                personalInfo: personalInfo,
                medicalInfo: medicalInfo
            });
        }
    } catch (error) {
        console.error('❌ Profile error:', error);
        res.status(500).render('error', { message: 'Server error: ' + error.message });
    }
};

// GET /patient/profile/setup?patientId=123
export const getSetupWizard = async (req, res) => {
    try {
        const patientId = req.query.patientId;
        
        if (!patientId) {
            return res.status(400).render('error', { message: 'Patient ID required' });
        }

        // For now, let's comment this out since we don't have setup-wizard.ejs
        // res.render('patient/setup-wizard', {
        //     patientId: patientId
        // });
        
        // Instead, redirect to profile which will show the modal
        res.redirect(`/patient/profile?patientId=${patientId}`);
        
    } catch (error) {
        console.error('Setup wizard error:', error);
        res.status(500).render('error', { message: 'Server error' });
    }
};

// POST /patient/profile/personal-info
export const updatePersonalInfo = async (req, res) => {
    try {
        const patientId = req.body.patientId;
        const personalData = {
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            address: req.body.address || null,
            emergencyContact: req.body.emergencyContact || null
        };

        console.log('📝 Saving personal info for patient:', patientId);
        console.log('📋 Data:', personalData);

        // Save to database
        const result = await savePersonalInfo(patientId, personalData);
        
        if (result.success) {
            res.json({ 
                success: true, 
                message: 'Profile updated successfully',
                redirectUrl: `/patient/profile?patientId=${patientId}`
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to save profile' 
            });
        }
    } catch (error) {
        console.error('Personal info update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
};

// POST /patient/profile/medical-info
export const updateMedicalInfo = async (req, res) => {
    try {
        const patientId = req.body.patientId;
        const medicalData = {
            bloodType: req.body.bloodType || null,
            allergies: req.body.allergies || null,
            height: req.body.height || null,
            weight: req.body.weight || null,
            chronicConditions: req.body.chronicConditions || null
        };

        console.log('🏥 Saving medical info for patient:', patientId);
        console.log('📋 Medical Data:', medicalData);

        // Validate blood type if provided
        if (medicalData.bloodType && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(medicalData.bloodType)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid blood type' 
            });
        }

        // Save to database
        const result = await saveMedicalInfo(patientId, medicalData);
        
        if (result.success) {
            res.json({ 
                success: true, 
                message: 'Medical information updated successfully',
                redirectUrl: `/patient/profile?patientId=${patientId}`
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to save medical information' 
            });
        }
    } catch (error) {
        console.error('Medical info update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
};

// POST /patient/profile/update-personal-info
export const updatePersonalInfoEdit = async (req, res) => {
    try {
        const patientId = req.body.patientId;
        const personalData = {
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            address: req.body.address || null,
            emergencyContact: req.body.emergencyContact || null
        };

        console.log('📝 Updating personal info for patient:', patientId);
        console.log('📋 Personal Data:', personalData);

        // Validate required fields
        if (!personalData.fullName || !personalData.phoneNumber || 
            !personalData.dateOfBirth || !personalData.gender) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be filled' 
            });
        }

        // Validate gender
        if (!['Male', 'Female'].includes(personalData.gender)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Gender must be Male or Female' 
            });
        }

        // Save to database
        const result = await updatePersonalInfoInDB(patientId, personalData);
        
        if (result.success) {
            res.json({ 
                success: true, 
                message: 'Personal information updated successfully',
                redirectUrl: `/patient/profile?patientId=${patientId}`
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to update personal information' 
            });
        }
    } catch (error) {
        console.error('Personal info update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
};