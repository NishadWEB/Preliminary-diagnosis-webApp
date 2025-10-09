export const selectRole = (req, res) => {
  global.userRole = req.params.role;

  if (userRole === "doctor" || userRole === "patient") {
    res.render("pre_login_page/pre_login_home.ejs", { role: global.userRole });
  } else {
    res.send("no such endpoint exist!");
  }
};

//get register page
export const getRegisterPage = (req,res) => {
  res.render('register_page/register_og.ejs' , {role : global.userRole});
}