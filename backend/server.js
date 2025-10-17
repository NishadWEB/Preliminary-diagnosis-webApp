// Online Preliminary diagnosis system
import express from "express";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import path, { dirname } from "path";
import { fileURLToPath } from "url";

import session from "express-session";
import pgSession from "connect-pg-simple";

import passport from "passport";
import { Strategy as localStrategy } from "passport-local";

import pg from "pg";

import patientRoutes from "./routes/patientRoutes.js";
import launchPageRoutes from "./routes/launchPageRoutes.js";
import preLoginRoutes from "./routes/preLoginRoutes.js";

import pool from "./config/db.js";

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));


const pgSessionStore = pgSession(session); // pgSession(session) gives pg session store class , (pgSessionStore knows how and where to store the sessions now !)
const store = new pgSessionStore({
  pool,
  tableName : "session",
  createTableIfMissing : true
})



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(
  session({
    store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 15},
  })
);

app.use(passport.initialize()); // helper function adding to req obj
app.use(passport.session()); // req.user accessible


passport.use(new localStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      let result = await pool.query("SELECT * FROM patients WHERE email=$1", [email]);
      let userType = "patient";

      if (result.rows.length === 0) {
        result = await pool.query("SELECT * FROM doctors WHERE email=$1", [email]);
        userType = "doctor";

        if (result.rows.length === 0) {
          return done(null, false); // not found
        }
      }

      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return done(null, false); // wrong password

      user.role = userType;
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));



passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role }); 
});


passport.deserializeUser(async (obj, done) => {
  try {
    let result;
    if (obj.role === "patient") {
      result = await pool.query("SELECT * FROM patients WHERE id=$1", [obj.id]);
    } else {
      result = await pool.query("SELECT * FROM doctors WHERE id=$1", [obj.id]);
    }
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});


// app.use((req, res, next) => {
//   console.log("current page : ", req.path);
//   res.locals.currentPage = req.path; // stores the current URL path in all templates
//   next();
// });

app.get("/", (req, res) => {
  res.render("launch_page/launch-page_home.ejs");
});

app.use("/home", launchPageRoutes);

app.use("/preLogin", preLoginRoutes);

app.use("/auth", patientRoutes);

app.get("/secrets", (req,res) => {
  // console.log(req.user);
  if(req.isAuthenticated()){
    res.render("secrets.ejs");
  }else{
    res.render("login.ejs");
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.user.role === "patient") {
    res.redirect("/patient/home");
  } else {
    res.redirect("/doctor/home");
  }
});



server.listen(port, () => console.log("listening on port : ", port));
