const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const app = express();
const users = require("./routes/api/users");
const auth = require("./routes/api/auth");
const patientsRoute = require("./routes/api/patient");

/*const personnels = require("./routes/api/personnels");
const cars = require("./routes/api/cars");

const rdvsadmin= require("./routes/api/rdvsadmin");
const factures= require("./routes/api/factures");
const rdvsclient= require("./routes/api/rdvsclient");
const contacts= require("./routes/api/contacts");*/
app.use(express.json());
app.use(cors());
const mongo_url = config.get("mongo_url");
mongoose.set('strictQuery', true);
mongoose
.connect(mongo_url, { useNewUrlParser:true , useUnifiedTopology:true })
.then(() =>console.log("MongoDB connected..."))
.catch((err) =>console.log(err));
app.use("/api/users",users);
app.use("/api/auth",auth);
app.use("/api/patients", patientsRoute);
/*app.use("/api/personnels",personnels);
app.use("/api/cars",cars);
app.use("/api/rdvsadmin",rdvsadmin);
app.use("/api/factures",factures);
app.use("/api/rdvsclient",rdvsclient);
app.use("/api/contacts",contacts);*/

const port = process.env.PORT || 3001;
app.listen(port, () =>console.log(`Server running on port ${port}`));
