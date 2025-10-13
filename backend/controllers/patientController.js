import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

export const selectRole = (req, res) => {
  global.userRole = req.params.role;

  if (userRole === "doctor" || userRole === "patient") {
    res.render("pre_login_page/pre_login_home.ejs", { role: global.userRole });
  } else {
    res.send("no such endpoint exist!");
  }
};

//get register page
export const getRegisterPage = (req, res) => {
  res.render("register_page/register_og.ejs", { role: "patient" });
};


//creating user (that is patient) and stroring in db 
export const registerPatient = async (req, res) => {
  try {
    console.log("inside register patient (server side)");

    const email = req.body.email;
    const password = req.body.password;

    console.log("email : (server side)", email);
    console.log("pass : (server side)", password);

    const hashedPassword = await hashPassword(password);
    console.log("hashed password is : ", hashedPassword);

    const query =
      "INSERT INTO patients(p_email, p_password) VALUES($1, $2) RETURNING *";
    const values = [email, hashedPassword];

    const result = await db.query(query, values);
    res.status(200).json({ status: "success" }); // 200 OK
  } catch (e) {
    console.log("error inserting : (server side)", e);
    res.status(400).json({ status: "error", error: e });
  }
};

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (e) {
    console.log("error hashing password.(server-side) : ", e);
    throw e;
  }
}
