import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import bcrypt from "bcrypt";
import pool from "./db.js";

// ---------------- PATIENT STRATEGY ----------------
passport.use("patient-local", new localStrategy(
  {
    usernameField: "p_email",
    passwordField: "p_password"
  },
  async (email, password, done) => {
    try {
      const result = await pool.query("SELECT * FROM patients WHERE p_email = $1", [email]);
      const user = result.rows[0];
      console.log('fetching done');
      if (!user) {
        return done(null, false, { message: "Patient not found" });
}

      const match = await bcrypt.compare(password, user.p_password);
      if (!match) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ---------------- DOCTOR STRATEGY ----------------
passport.use("doctor-local", new localStrategy(
  {
    usernameField: "d_email",
    passwordField: "d_password"
  },
  async (email, password, done) => {
    try {
      const result = await pool.query("SELECT * FROM doctors WHERE d_email = $1", [email]);
      const user = result.rows[0];

      if (!user) return done(null, false, { message: "Doctor not found" });

      const match = await bcrypt.compare(password, user.d_password);
      if (!match) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));



passport.serializeUser((user, done) => {
  if (user.p_id) { // patient
    console.log('user in serialization is : ', user);
    done(null, { id: user.p_id, role: "patient" });
  } else if (user.d_id) { // doctor
    done(null, { id: user.d_id, role: "doctor" });
  } else {
    done(new Error("Unknown user type"));
  }
});


passport.deserializeUser(async (obj, done) => {
  try {
  console.log('obj : ', obj);
    let result;
    if (obj.role === "patient") {
      result = await pool.query("SELECT * FROM patients WHERE p_id=$1", [obj.id]);
    } else {
      result = await pool.query("SELECT * FROM doctors WHERE d_id=$1", [obj.id]);
    }
    console.log('res is : ', result.rows[0]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

export default passport;