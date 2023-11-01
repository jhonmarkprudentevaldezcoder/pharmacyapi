const express = require("express");
const mongoose = require("mongoose");
const Users = require("./models/userModel");
const Themes = require("./models/themeModel");
const Foods = require("./models/foodModel");
const Drinks = require("./models/drinkModel");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//default route
app.get("/", (req, res) => {
  res.send("API CATERING APP WORKING SUCCESS");
});

//  theme

//add theme
app.post("/theme", async (req, res) => {
  try {
    const theme = await Themes.create(req.body);
    res.status(200).json(theme);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all thenes
app.get("/theme", async (req, res) => {
  try {
    const themes = await Themes.find({});
    res.status(200).json(themes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search theme by category
app.get("/theme/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const theme = await Themes.find({ category: category });

    if (theme.length === 0) {
      return res
        .status(404)
        .json({ message: "No resreved id matching records found" });
    }

    res.status(200).json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update theme
app.put("/theme/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const theme = await Themes.findByIdAndUpdate(id, req.body);

    if (!theme) {
      return res
        .status(404)
        .json({ message: `cannot find any Bus with ID ${id}` });
    }
    const updatedtheme = await Themes.findById(id);
    res.status(200).json(updatedtheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//register
app.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already taken." });
    }

    const user = await Users.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    // Set the token as a cookie (optional)
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    // Respond with the token as a Bearer token
    res.status(200).json({
      message: "Authentication successful",
      token: `${token}`,
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// close theme

// food

//add food
app.post("/food", async (req, res) => {
  try {
    const food = await Foods.create(req.body);
    res.status(200).json(food);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all foods
app.get("/food", async (req, res) => {
  try {
    const foods = await Foods.find({});
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search foods by category
app.get("/food/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const food = await Foods.find({ category: category });

    if (food.length === 0) {
      return res
        .status(404)
        .json({ message: "No resreved id matching records found" });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update food
app.put("/food/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Foods.findByIdAndUpdate(id, req.body);

    if (!food) {
      return res
        .status(404)
        .json({ message: `cannot find any Bus with ID ${id}` });
    }
    const updatedFood = await Foods.findById(id);
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// close food

// drinks

//add drinks
app.post("/drink", async (req, res) => {
  try {
    const drink = await Drinks.create(req.body);
    res.status(200).json(drink);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all foods
app.get("/drink", async (req, res) => {
  try {
    const drinks = await Drinks.find({});
    res.status(200).json(drinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search foods by category
app.get("/drink/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const drink = await Drinks.find({ category: category });

    if (drink.length === 0) {
      return res
        .status(404)
        .json({ message: "No resreved id matching records found" });
    }

    res.status(200).json(drink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update food
app.put("/drink/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const drink = await Drinks.findByIdAndUpdate(id, req.body);

    if (!drink) {
      return res
        .status(404)
        .json({ message: `cannot find any Bus with ID ${id}` });
    }
    const updateddrink = await Drinks.findById(id);
    res.status(200).json(updateddrink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://catering4D:catering%40123@cateringcluster.t92orr6.mongodb.net/reservation_management"
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Node API app is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
