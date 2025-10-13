// Online Preliminary diagnosis system
import express from "express";
import http from "http";
import dotenv from "dotenv";
import path, { dirname }  from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import pg from 'pg';
import passport from "passport";
import {Strategy as localStratgey}  from 'passport-local';
import pgSession from 'connect-pg-simple'

import patientRoutes from "./routes/patientRoutes.js";
import launchPageRoutes from "./routes/launchPageRoutes.js";
import preLoginRoutes from "./routes/preLoginRoutes.js";
import termsRoutes from './routes/termsRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_SESSION,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect();

const PgSessionStore = pgSession(session);

app.use(
  session({
    store: new PgSessionStore({
      client: client,        
      tableName: "session",  
    }),
    secret: process.env.SECRET_KEY,
    resave: false,          
    saveUninitialized: true, 
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, 
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// app.use((req, res, next) => {
//   console.log("current page : ", req.path);
//   res.locals.currentPage = req.path; // stores the current URL path in all templates
//   next();
// });

app.use("/home", launchPageRoutes);

app.use("/preLogin", preLoginRoutes);

app.use('/auth', patientRoutes);

app.use('/legal', termsRoutes);

app.get("/", (req, res) => {
  res.render("launch_page/launch-page_home.ejs");
});



// app.use("/patient", patientRoutes);
// app.get("/preLogin/home/selectRole/:role", (req, res) => {
//   // console.log("role is : ", req.params.role);
//   userRole = req.params.role;
//   console.log('user role is : ', userRole);
//   if (userRole === "doctor" || userRole === "patient") {
//     res.render("pre_login_page/pre_login_home.ejs", { role: userRole });
//   }else{
//     res.send( 'no such endpoint exist!');
//   }
// });

// app.get("/about/:page", (req, res) => {
//   const page = req.params.page;

//   switch (page) {
//     case "launch_page":
//       res.render("launch_page/about.ejs");
//       break;
//     case "pre_login":
//       res.render("pre_login_page/pre_login_about.ejs", { role: userRole });
//       break;
//     default:
//       res.status(404).json({ error: "Page not found" });
//   }
// });

// app.get("/features/:page", (req, res) => {
//   const page = req.params.page;

//   switch (page) {
//     case "launch_page":
//       res.render("launch_page/features.ejs");
//       break;
//     case "pre_login":
//       res.render("pre_login_page/pre_login_features.ejs", { role: userRole });
//       break;
//     default:
//       res.status(404).json({ error: "Page not found" });
//   }
// });

// app.get("/faqs/:page", (req, res) => {
//   const page = req.params.page;

//   switch (page) {
//     case "launch_page":
//       res.render("launch_page/faqs.ejs");
//       break;
//     case "pre_login":
//       res.render("pre_login_page/pre_login_faqs.ejs", { role: userRole });
//       break;
//     default:
//       res.status(404).json({ error: "Page not found" });
//   }
// });

// app.get("/contact/:page", (req, res) => {
//   const page = req.params.page;

//   switch (page) {
//     case "launch_page":
//       res.render("launch_page/contact.ejs");
//       break;
//     case "pre_login":
//       res.render("pre_login_page/pre_login_contact.ejs", { role: userRole });
//       break;
//     default:
//       res.status(404).json({ error: "Page not found" });
//   }
// });

server.listen(port, () => console.log("listening on port : ", port));
