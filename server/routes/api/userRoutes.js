const User = require("../../models/User");
const router = require("express").Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a new User
router.post("/signup", async (req, res) => {
  try {
    const userData = await User.create({
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.email = userData.email;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Log in
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });

    if (!userData) res.status(400).json({ message: "Incorrect credentials" });

    const validPassword = await userData.isCorrectPassword(req.body.password);

    if (!validPassword)
      res.status(400).json({ message: "Incorrect credentials" });

    req.session.save(() => {
      // declare session variables
      req.session.user_id = userData._id;
      req.session.email = userData.email;
      req.session.logged_in = true;

      res
        .status(200)
        .json({ user: userData, message: "You are now logged in!" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Log out
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(200).end();
    });
  } else {
    res.status(400).end();
  }
});

module.exports = router;
