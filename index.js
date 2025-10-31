const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const Chat = require("./models/chat");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Connect DB
mongoose.connect("mongodb://127.0.0.1:27017/whatsappChat")
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

// ==================== ROUTES ====================

// Home Page
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// Contacts
app.get("/contacts", async (req, res) => {
  const chats = await Chat.find();
  const contactsSet = new Set();
  chats.forEach(chat => {
    contactsSet.add(chat.from);
    contactsSet.add(chat.to);
  });
  const contacts = Array.from(contactsSet).map(name => ({ contactName: name }));
  res.render("contacts/index", { contacts });
});

// Add new contact
app.post("/contacts", async (req, res) => {
  const { name } = req.body;
  const newChat = new Chat({
    from: name,
    to: name,
    msz: "Welcome! Start chatting.",
    createdAt: new Date()
  });
  await newChat.save();
  res.redirect("/contacts");
});

// Chats
app.get("/chats/:contactName", async (req, res) => {
  const contactName = req.params.contactName;
  const chats = await Chat.find({
    $or: [{ from: contactName }, { to: contactName }]
  }).sort({ createdAt: 1 });

  res.render("chats/show", { contactName, chats });
});

// Send new message
app.post("/chats", async (req, res) => {
  const { from, to, msz } = req.body.chat;
  const newChat = new Chat({ from, to, msz, createdAt: new Date() });
  await newChat.save();
  res.redirect(`/chats/${to}`);
});

// Edit message
app.get("/chats/:id/edit", async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  res.render("chats/edit", { chat });
});

// Update message
app.put("/chats/:id", async (req, res) => {
  const updatedChat = await Chat.findByIdAndUpdate(
    req.params.id,
    { ...req.body.chat },
    { new: true }
  );
  const contactName = updatedChat.to;
  res.redirect(`/chats/${contactName}`);
});

// Delete message
app.delete("/chats/:id", async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  const contactName = chat.to;
  await Chat.findByIdAndDelete(req.params.id);
  res.redirect(`/chats/${contactName}`);
});

// Start server
app.listen(8080, () => {
  console.log("Chat server running on port 8080");
});
