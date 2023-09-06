//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];
// mongoose.connect(
//   "mongodb+srv://sripurna:test123@cluster0.iktn6ai.mongodb.net/todolistDB"
// );
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
const ItemsSchema = {
  name: String,
};
const ListSchema = {
  name: String,
  items: [ItemsSchema],
};

const Item = mongoose.model("Item", ItemsSchema);
const item1 = new Item({ name: "call" });
const item2 = new Item({ name: "study" });
const item3 = new Item({ name: "sleep" });

const defaultItems = [item1, item2, item3];

const List = mongoose.model("List", ListSchema);
// Item.insertMany(defaultItems);

app.get("/", async (req, res) => {
  const itemArray = await Item.find({});
  if (itemArray.length === 0) {
    Item.insertMany(defaultItems);
    res.redirect("/");
  } else {
    res.render("list.ejs", { listTitle: "Today", newListItems: itemArray });
  }
  console.log(itemArray);
});

app.get("/:word", async (req, res) => {
  const customListName = req.params.word;

  // list.save();

  List.findOne({ name: customListName })
    .then((docs) => {
      console.log(docs);
      res.render("list.ejs", {
        listTitle: docs.name,
        newListItems: docs.items,
      });
    })
    .catch((err) => {
      const list = new List({ name: customListName, items: defaultItems });
      list.save();
      res.redirect("/" + customListName);
    });
});

app.post("/", async (req, res) => {
  const itemName = req.body.newItem;
  const ListName = req.body.list;
  const item4 = new Item({ name: itemName });

  if (ListName === "Today") {
    item4.save();
    res.redirect("/");
  } else {
    List.findOne({ name: ListName }).then((docs) => {
      // console.log(docs);
      docs.items.push(item4);
      docs.save();
      res.redirect("/" + ListName);
    });
  }
});

app.post("/delete", async (req, res) => {
  const checkboxId = req.body.checkbox;
  await Item.deleteOne({ _id: checkboxId });
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about.ejs");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
