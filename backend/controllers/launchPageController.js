export const getAboutPage = (req, res) => {
  const currentPage = req.params.page;

  switch (currentPage) {
    case "launch_page":
      res.render("launch_page/about.ejs");
      break;
    case "pre_login":
      res.render("pre_login_page/pre_login_about.ejs", { role: global.userRole });
      break;
    default:
      res.status(404).json({ error: "Page not found" });
  }
};

export const getFeaturesPage = (req, res) => {
  const currentPage = req.params.page;

  switch (currentPage) {
    case "launch_page":
      res.render("launch_page/features.ejs");
      break;
    case "pre_login":
      res.render("pre_login_page/pre_login_features.ejs", { role: global.userRole });
      break;
    default:
      res.status(404).json({ error: "Page not found" });
  }
};

export const getFaqsPage = (req, res) => {
  const currentPage = req.params.page;

  switch (currentPage) {
    case "launch_page":
      res.render("launch_page/faqs.ejs");
      break;
    case "pre_login":
      res.render("pre_login_page/pre_login_faqs.ejs", { role: global.userRole ,page : currentPage});
      break;
    default:
      res.status(404).json({ error: "Page not found" });
  }
};

export const getContactPage = (req, res) => {
  const currentPage = req.params.page;

  switch (currentPage) {
    case "launch_page":
      res.render("launch_page/contact.ejs");
      break;
    case "pre_login":
      res.render("pre_login_page/pre_login_contact.ejs", { role: global.userRole, page : currentPage });
      break;
    default:
      res.status(404).json({ error: "Page not found" });
  }
};
