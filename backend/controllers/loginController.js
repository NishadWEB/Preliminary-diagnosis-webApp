import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const getPatientloginPage = (req, res) => {
  res.render("login_page/patientLoginPage.ejs", { role: "patient" });
};

export const getDoctorloginPage = (req, res) => {
  res.render("login_page/doctorLoginPage.ejs", { role: "doctor" });
};

export const loginPatient = async (req, res) => {
  try {
    console.log("Patient trying to log in:", req.body);

    const { p_email, p_password } = req.body;

    // get user 
    const response = await pool.query("SELECT * FROM patients WHERE p_email = $1",[p_email]);
    const result = response.rows[0];

    if (!result) {
      console.log("Patient not found");
      return res.status(404).json({ message: "Patient not found" });
    }

    // compare password
    const valid = await bcrypt.compare(p_password, result.p_password);

    if (!valid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    // SUCCESS - Return patient ID for frontend redirect
    console.log("✅ Password correct, login successful");
    
    // Return patient ID and profile status for frontend to handle redirect
    return res.status(200).json({
      message: "Login successful",
      patientId: result.p_id,
      profileComplete: result.profile_complete || false
    });
    
  } catch (err) {
    console.error("Error during patient login:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const loginDoctor = async (req, res) => {
  try {
    console.log("dctr trying to log in:", req.body);

    const { d_email, d_password } = req.body;

    // get user 
    const response = await pool.query("SELECT * FROM doctors WHERE d_email = $1",[d_email]);

    const result = response.rows[0];

    if (!result) {
      console.log("Doctr not found");
      return res.status(404).send({ message: "dctor not found" });
    }

    // compare password
    const valid = await bcrypt.compare(d_password, result.d_password);

    if (!valid) {
      console.log("Invalid password");
      return res.status(401).send({ message: "Invalid password" });
    }

    // success
    console.log("✅ Password correct, login successful");
    return res.status(200).send({message: "Login successful"});
  } catch (err) {
    console.error("Error during dctor login:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
};


// POST
// export const loginPatient = (req, res, next) => {
//    passport.authenticate("local", //(err, user, info) => {
//   //   if (err) return next(err);
//   //   if (!user) return res.redirect("/auth/login/patient");

//   //   req.logIn(user, (err) => {
//   //     if (err) return next(err);
//   //     return res.redirect("/patient/home");
//   //   });
//   {
//     successRedirect : "/patient/dashboard",
//     failureRedirect : "/auth/login/patient"
//   }
// );
// };

// export const loginPatient = (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);

//     if (!user) {
//       // Authentication failed
//       return res.status(401).json({
//         message: info.message || "Invalid email or password",
//         redirect: "/auth/login/patient"
//       });
//     }

//     req.logIn(user, (err) => {
//       if (err) return next(err);

//       // Authentication successful
//       return res.status(200).json({
//         message: "Login successful",
//         redirect: "/patient/dashboard"
//       });
//     });
//   })(req, res, next); // Important: pass req, res, next here
// };

// //POST
// export const loginDoctor = (req, res, next) => {
//    passport.authenticate("local",// (err, user, info) => {
//   //   if (err) return next(err);
//   //   if (!user) return res.redirect("/auth/login/doctor");

//   //   req.logIn(user, (err) => {
//   //     if (err) return next(err);
//   //     return res.redirect("/doctor/home");
//   //   });
//   {
//     successRedirect : "/doctor/dashboard",
//     failureRedirect : "/auth/login/doctor"
//   }
// );
// };

// Patient login
// export const loginPatient = (req, res, next) => {
//   passport.authenticate("patient-local", (err, user, info) => {
//     if (err) return next(err);
//     if (!user) {
//       return res.status(401).json({ message: info.message });
//     }

//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       return res.status(200).json({
//         message: "Patient login successful",
//         redirect: "/patient/dashboard"
//       });
//     });
//   })(req, res, next);
// };

// Doctor login
// export const loginDoctor = (req, res, next) => {
//   passport.authenticate("doctor-local", (err, user, info) => {
//     if (err) return next(err);
//     if (!user) {
//       return res.status(401).json({ message: info.message });
//     }

//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       return res.status(200).json({
//         message: "Doctor login successful",
//         redirect: "/doctor/dashboard"
//       });
//     });
//   })(req, res, next);
// };
