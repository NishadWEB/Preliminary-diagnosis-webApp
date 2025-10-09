export const selectRole = (req, res) => {
global.userRole = req.params.role ;
  if (userRole === "doctor" || userRole === "patient") {
    res.render("pre_login_page/pre_login_home.ejs", { role: userRole });
  } else {
    res.send("no such endpoint exist!");
  }
};
