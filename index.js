const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const corsConfig = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
const app = express();

const port = process.env.PORT || 5000;

app.options("", cors(corsConfig));
app.use(cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ilfiw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// get api
function getApi(path, collection) {
  app.get(path, async (req, res) => {
    const cursor = collection.find({});
    const result = await cursor.toArray();
    res.json(result);
  });
}

async function run() {
  try {
    client.connect();
    const database = client.db("themetask_theme");
    const carouselCollection = database.collection("carousel");
    const themetaskCollection = database.collection("themetask");
    const socialBannerCollection = database.collection("socialbanner");
    const certificatesCollection = database.collection("certificate");
    const gamesCollection = database.collection("game");
    const cryptocurrencyCollection = database.collection("cryptocurrency");
    const businessCardCollection = database.collection("businesscard");
    const textEffectCollection = database.collection("texteffect");

    app.get("/carouselitems", async (req, res) => {
      const cursor = carouselCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    getApi("/themetask", themetaskCollection);
    getApi("/socialbanner", socialBannerCollection);
    getApi("/certificate", certificatesCollection);
    getApi("/game", gamesCollection);
    getApi("/cryptocurrency", cryptocurrencyCollection);
    getApi("/businesscard", businessCardCollection);
    getApi("/texteffect", textEffectCollection);

    app.get("/theme-detail/:category/:id", async (req, res) => {
      const id = req.params.id;
      const category = req.params.category;
      const query = { _id: ObjectId(id) };
      if (category === "themetask") {
        const result = await themetaskCollection.findOne(query);
        res.json(result);
      } else if (category == "socialbanner") {
        const result = await socialBannerCollection.findOne(query);
        res.json(result);
      } else if (category == "certificate") {
        const result = await certificatesCollection.findOne(query);
        res.json(result);
      } else if (category == "game") {
        const result = await gamesCollection.findOne(query);
        res.json(result);
      } else if (category == "cryptocurrency") {
        const result = await cryptocurrencyCollection.findOne(query);
        res.json(result);
      } else if (category == "businesscard") {
        const result = await businessCardCollection.findOne(query);
        res.json(result);
      } else if (category == "texteffect") {
        const result = await textEffectCollection.findOne(query);
        res.json(result);
      }
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Themetask server successfull");
});

app.listen(port, () => {
  console.log("Themetask listening on port", port);
});
