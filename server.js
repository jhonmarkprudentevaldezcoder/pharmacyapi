const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Users = require("./models/userModel");
const Products = require("./models/productModel");
const Cart = require("./models/cartModel");
const Order = require("./models/orderModel");
const History = require("./models/historyModel");
const Prescribed = require("./models/prescribedModel");


const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//default route
app.get("/", (req, res) => {
  res.send("API SUCCESS");
});

//count users
app.get("/user/count", async (req, res) => {
  try {
    const userCount = await Users.countDocuments({});
    res.status(200).json(userCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all members
app.get("/transac", async (req, res) => {
  try {
    const orders = await Prescribed.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all members
app.get("/user", async (req, res) => {
  try {
    const members = await Users.find({ rfid: { $exists: true } });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all orders
app.get("/order", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add members
app.post("/user", async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//search members by rfid
app.get("/user/:rfid", async (req, res) => {
  try {
    const { rfid } = req.params;
    const user = await Users.find({ rfid: rfid });

    if (user.length === 0) {
      return res
        .status(404)
        .json({ message: "No resreved id matching records found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search user by id
app.get("/user/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.find({ _id: id });

    if (user.length === 0) {
      return res
        .status(404)
        .json({ message: "No resreved id matching records found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update product
app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res
        .status(404)
        .json({ message: `cannot find any Bus with ID ${id}` });
    }
    const updatedUser = await Users.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/user/shipped/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const Orderstatus = "DELIVERED"; // Corrected the variable name

    // Ensure that orderStatus is provided in the request body
    if (!Orderstatus) {
      return res
        .status(400)
        .json({ message: "OrderStatus is required in the request body" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { Orderstatus } }, // Corrected the variable name
      { new: true } // Returns the updated document
    );

    if (!order) {
      return res
        .status(404)
        .json({ message: `Cannot find any Order with ID ${id}` });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//count order
app.get("/order/count", async (req, res) => {
  try {
    const orderCount = await Order.countDocuments({
      Orderstatus: "NO DELIVERED",
    });
    res.status(200).json(orderCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  products
app.post("/checkout/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    // Find the user's cart based on the user ID
    const cart = await Cart.findOne({ userid });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Create a new order based on the cart data
    const order = new Order({
      userid: cart.userid,
      products: cart.products,
      Orderstatus: cart.Orderstatus,
      userContact: cart.userContact,
      totalPrice: cart.totalPrice,
      createdAt: new Date(),
    });

    const history = new History({
      userid: cart.userid,
      Orderstatus: cart.Orderstatus,
      userContact: cart.userContact,
      products: cart.products,
      totalPrice: cart.totalPrice,
      createdAt: new Date(),
    });

    // Save the order data to the orders table
    await order.save();
    await history.save();

    // Remove the cart
    await Cart.findOneAndRemove({ userid });

    res.status(200).json({ message: "Checkout successful" });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "An error occurred during checkout" });
  }
});

// List all user contact numbers
app.get("/userContactNumbers", async (req, res) => {
  try {
    const users = await Cart.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Extract contact numbers from users
    const contactNumbers = users.map((user) => user.userContact);

    res.status(200).json(contactNumbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search for a userContact
app.get("/userContactNumbers/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const users = await Cart.find({ userContact: new RegExp(searchTerm, "i") });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found matching the search term" });
    }

    // Extract contact numbers from users
    const contactNumbers = users.map((user) => user.userContact);

    res.status(200).json(contactNumbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add product
app.post("/product", async (req, res) => {
  try {
    const product = await Products.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all products
app.get("/product", async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//count products
app.get("/product/count", async (req, res) => {
  try {
    const productCount = await Products.countDocuments({});
    res.status(200).json(productCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search product by category
app.get("/product/:Name", async (req, res) => {
  try {
    const { Name } = req.params;
    const product = await Products.find({ Name: Name });

    if (product.length === 0) {
      return res
        .status(404)
        .json({ message: "No resreved id matching records found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update product
app.put("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByIdAndUpdate(id, req.body);

    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any Bus with ID ${id}` });
    }
    const updatedproduct = await Products.findById(id);
    res.status(200).json(updatedproduct);
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

// Add a product to the cart
app.post("/cart/add/:userId/:productId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    if (
      !productId ||
      !quantity ||
      typeof quantity !== "number" ||
      quantity <= 0
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const product = await Products.findById(productId);
    const user = await Users.findById(userId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ userid: userId });

    if (!cart) {
      const newCart = new Cart({
        userid: userId,
        userContact: user.contact,
        Orderstatus: "NO DELIVERED",
        products: [
          {
            Orderstatus: "NO DELIVERED",
            userEmail: user.email,
            productId,
            quantity,
            productName: product.Name,
            totalPrice: product.Price * quantity,
          },
        ],
        totalPrice: product.Price * quantity,
      });
      await newCart.save();
    } else {
      const existingItem = cart.products.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.products.push({
          userEmail: user.email,
          productId,
          quantity,
          Orderstatus: "NOT DELIVERED",
          productName: product.Name,
          totalPrice: product.Price * quantity,
        });
      }

      cart.totalPrice += product.Price * quantity;
      await cart.save();
    }

    res.status(201).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the user's cart
app.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userid: userId }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const totalCount = cart.products.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );

    res.status(200).json({ cart, totalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Order.findOne({ userid: userId }).populate(
      "products.productId"
    );

    if (!history) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const totalCount = history.products.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );

    res.status(200).json({ history, totalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a product from the cart
app.delete("/cart/remove/:userid/:productId", async (req, res) => {
  try {
    const { userid, productId } = req.params;

    // Find the user's cart based on the user ID
    const cart = await Cart.findOne({ userid });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the product to remove in the cart
    const productIndex = cart.products.findIndex(
      (product) => product.productId._id == productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Save the updated cart data
    await cart.save();

    res
      .status(200)
      .json({ message: "Product removed from the cart successfully" });
  } catch (error) {
    console.error("Error removing product from the cart:", error);
    res.status(500).json({
      message: "An error occurred while removing the product from the cart",
    });
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

app.post("/loginrfid", async (req, res) => {
  const { rfid } = req.body;

  try {
    // Find the user by email
    const user = await Users.findOne({ rfid });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
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
      rfid: user.rfid,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb+srv://capstone:Capstone2@cluster0.sqm4la8.mongodb.net/POMS")
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Node API app is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
