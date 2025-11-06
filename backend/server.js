// Online Preliminary diagnosis system
import express from "express";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import launchPageRoutes from "./routes/launchPageRoutes.js";
import preLoginRoutes from "./routes/preLoginRoutes.js";
import registerRoutes from './routes/registerRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import patientRoutes from './routes/patientRoutes.js'; 

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.render("launch_page/launch-page_home.ejs");
});

app.get('/n', (req, res) => res.render('patient/setup-wizard.ejs'));

app.use("/home", launchPageRoutes);
app.use("/preLogin", preLoginRoutes);
app.use("/auth/register", registerRoutes);
app.use('/auth/login', loginRoutes);
app.use('/patient', patientRoutes); 

// Test route to check EJS rendering
app.get('/test-profile', (req, res) => {
    res.render('patient/profile', {
        patientId: '1',
        isFirstLogin: true,
        personalInfo: null,
        medicalInfo: null
    });
});

server.listen(port, () => console.log("listening on port : ", port));