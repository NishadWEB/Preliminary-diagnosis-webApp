import pool from '../config/db.js';

// Check if patient profile is complete
export const checkProfileCompletion = async (patientId) => {
    try {
        const query = 'SELECT profile_complete FROM patients WHERE p_id = $1';
        const result = await pool.query(query, [patientId]);
        
        if (result.rows.length === 0) {
            throw new Error('Patient not found');
        }
        
        return result.rows[0].profile_complete;
    } catch (error) {
        console.error('Error checking profile completion:', error);
        throw error;
    }
};

// Save personal information and mark profile as complete
export const savePersonalInfo = async (patientId, personalData) => {
    try {
        // Start transaction
        await pool.query('BEGIN');

        // Insert into patient_personal table
        const personalQuery = `
            INSERT INTO patient_personal 
            (p_id, p_name, p_phone, p_dob, p_gender, p_address, p_emergency_contact)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        
        await pool.query(personalQuery, [
            patientId,
            personalData.fullName,
            personalData.phoneNumber,
            personalData.dateOfBirth,
            personalData.gender,
            personalData.address,
            personalData.emergencyContact
        ]);

        // Update profile_complete flag in patients table
        const updateQuery = `
            UPDATE patients 
            SET profile_complete = true 
            WHERE p_id = $1
        `;
        
        await pool.query(updateQuery, [patientId]);

        // Commit transaction
        await pool.query('COMMIT');
        
        return { success: true };
    } catch (error) {
        // Rollback on error
        await pool.query('ROLLBACK');
        console.error('Error saving personal info:', error);
        throw error;
    }
};

// Get personal information from patient_personal table
export const getPersonalInfo = async (patientId) => {
    try {
        const query = `
            SELECT p_name, p_phone, p_dob, p_gender, p_address, p_emergency_contact
            FROM patient_personal 
            WHERE p_id = $1
        `;
        const result = await pool.query(query, [patientId]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return {
            fullName: result.rows[0].p_name,
            phoneNumber: result.rows[0].p_phone,
            dateOfBirth: result.rows[0].p_dob,
            gender: result.rows[0].p_gender,
            address: result.rows[0].p_address,
            emergencyContact: result.rows[0].p_emergency_contact
        };
    } catch (error) {
        console.error('Error fetching personal info:', error);
        throw error;
    }
};

// Get medical information from patient_medical table
export const getMedicalInfo = async (patientId) => {
    try {
        const query = `
            SELECT p_blood_type, p_allergies, p_height, p_weight, p_chronic_conditions
            FROM patient_medical 
            WHERE p_id = $1
        `;
        const result = await pool.query(query, [patientId]);
        
        if (result.rows.length === 0) {
            // Medical info is optional - return empty object
            return {
                bloodType: null,
                allergies: null,
                height: null,
                weight: null,
                chronicConditions: null
            };
        }
        
        return {
            bloodType: result.rows[0].p_blood_type,
            allergies: result.rows[0].p_allergies,
            height: result.rows[0].p_height,
            weight: result.rows[0].p_weight,
            chronicConditions: result.rows[0].p_chronic_conditions
        };
    } catch (error) {
        console.error('Error fetching medical info:', error);
        throw error;
    }
};

// Save medical information
export const saveMedicalInfo = async (patientId, medicalData) => {
    try {
        // Check if medical info already exists
        const checkQuery = 'SELECT medical_id FROM patient_medical WHERE p_id = $1';
        const checkResult = await pool.query(checkQuery, [patientId]);

        let query, params;

        if (checkResult.rows.length > 0) {
            // Update existing record
            query = `
                UPDATE patient_medical 
                SET p_blood_type = $1, p_allergies = $2, p_height = $3, p_weight = $4, p_chronic_conditions = $5
                WHERE p_id = $6
            `;
            params = [
                medicalData.bloodType,
                medicalData.allergies,
                medicalData.height,
                medicalData.weight,
                medicalData.chronicConditions,
                patientId
            ];
        } else {
            // Insert new record
            query = `
                INSERT INTO patient_medical 
                (p_id, p_blood_type, p_allergies, p_height, p_weight, p_chronic_conditions)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            params = [
                patientId,
                medicalData.bloodType,
                medicalData.allergies,
                medicalData.height,
                medicalData.weight,
                medicalData.chronicConditions
            ];
        }

        await pool.query(query, params);
        return { success: true };
    } catch (error) {
        console.error('Error saving medical info:', error);
        throw error;
    }
};

// Update personal information in database
export const updatePersonalInfoInDB = async (patientId, personalData) => {
    // const client = await pool.connect();
    
    try {
        await pool.query('BEGIN');

        // Update personal info
        const updateQuery = `
            UPDATE patient_personal 
            SET p_name = $1, p_phone = $2, p_dob = $3, p_gender = $4, p_address = $5, p_emergency_contact = $6
            WHERE p_id = $7
        `;
        
        await pool.query(updateQuery, [
            personalData.fullName,
            personalData.phoneNumber,
            personalData.dateOfBirth,
            personalData.gender,
            personalData.address,
            personalData.emergencyContact,
            patientId
        ]);

        await pool.query('COMMIT');
        
        return { success: true };
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating personal info:', error);
        throw error;
     } // finally {
    //     client.release();
    // }
};