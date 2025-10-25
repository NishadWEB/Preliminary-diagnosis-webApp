// Online Preliminary diagnosis system
import express from "express";
import http from "http";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

// import session from "express-session";
// import pgSession from "connect-pg-simple";

// import patientRoutes from "./routes/patientRoutes.js";
import launchPageRoutes from "./routes/launchPageRoutes.js";
import preLoginRoutes from "./routes/preLoginRoutes.js";
import registerRoutes from './routes/registerRoutes.js'
import loginRoutes from './routes/loginRoutes.js';
// import patientRoutes from './routes/patientRoutes.js';

import pool from "./config/db.js";

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));

// const pgSessionStore = pgSession(session); // pgSession(session) gives pg session store class , (pgSessionStore knows how and where to store the sessions now !)
// const store = new pgSessionStore({
//   pool,
//   tableName : "session",
//   createTableIfMissing : true
// })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// app.use(
//   session({
//     store,
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 1000 * 60 * 60 * 24 * 15},
//   })
// );

// app.use(passport.initialize()); // helper function adding to req obj
// app.use(passport.session()); // req.user accessible

app.get("/", (req, res) => {
  res.render("launch_page/launch-page_home.ejs");
});

app.use("/home", launchPageRoutes);

app.use("/preLogin", preLoginRoutes);

app.use("/auth/register", registerRoutes);

app.use('/auth/login', loginRoutes);

// app.use('/patient', patientRoutes);

// app.get("/secrets", (req,res) => {
//   // console.log(req.user);
//   if(req.isAuthenticated()){
//     res.send("logged in and secret page");
//   }else{
//     res.render("login_page/patientLoginPage.ejs", { role: "patient" });
//   }
// });

server.listen(port, () => console.log("listening on port : ", port));
