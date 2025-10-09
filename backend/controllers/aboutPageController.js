export const getAboutPage = (req, res) => {
  const page = req.params.page;
  console.log("inside getAboutPage");
  console.log("so user role is : ", global.userRole);
  switch (page) {
    case "launch_page":
      res.render("launch_page/about.ejs");
      break;
    case "pre_login":
      res.render("pre_login_page/pre_login_about.ejs", {
        role: global.userRole,
      });
      break;
    default:
      res.status(404).json({ error: "Page not found" });
  }
};
