//creating user (that is patient) and stroring in db 
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (e) {
    console.log("error hashing password : ", e);
    throw e;
  }
}

export const getPatientRegisterPage = (req, res) => {
  res.render("register_page/patientRegisterPage.ejs", { role: "patient" });
};

export const getDoctorRegisterPage = (req, res) => {
  res.render("register_page/doctorRegisterPage.ejs", { role: "doctor" });
};


export const registerPatient = async (req, res) => {
  try {
    console.log("inside register patient (server side)");

    const patientEmail = req.body.email;
    const patientPassword = req.body.password;

    console.log("email : (server side)", patientEmail);
    console.log("pass : (server side)", patientPassword);

    const hashedPassword = await hashPassword(patientPassword);
    console.log("hashed password is : ", hashedPassword);

    const query =
      "INSERT INTO patients(p_email, p_password) VALUES($1, $2) RETURNING *";
    const values = [patientEmail, hashedPassword];

    const result = await pool.query(query, values);
    res.status(200).json({ status: "success" }); // 200 OK
  } catch (e) {
    console.log("error inserting : (server side)", e);
    res.status(400).json({ status: "error", error: e });
  }
};




//creating user (that is dctor) and stroring in db 
export const registerDoctor = async (req, res) => {
  try {
    console.log("inside register doctor ");

    const doctorEmail = req.body.email;
    const doctorPassword = req.body.password;

    console.log("email : ", doctorEmail);
    console.log("pass : ", doctorPassword);

    const hashedPassword = await hashPassword(doctorPassword);
    console.log("hashed password is : ", hashedPassword);

    const query = "INSERT INTO doctors(d_email, d_password) VALUES($1, $2) RETURNING *";
    const values = [doctorEmail, hashedPassword];

    const result = await pool.query(query, values);
    res.status(200).json({ status: "success" }); // 200 OK
  } catch (e) {
    console.log("error inserting : (server side)", e);
    res.status(400).json({ status: "error", error: e });
  }
};