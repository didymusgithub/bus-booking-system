const express = require("express");
const app = express();
require("dotenv").config();
const dbconfig = require("./config/dbConfig");
const path = require('path')

const port = process.env.PORT || 5000;
app.use(express.json());

const usersRoute = require("./routes/usersRoute");
const busesRoute = require("./routes/busesRoute");
const bookingRoute = require("./routes/bookingRoute");

// routes
app.use("/api/users", usersRoute);
app.use("/api/buses", busesRoute);
app.use("/api/bookings", bookingRoute);

// static files
app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', function(req,res){
  res.sendFile(path.join(__dirname,"./client/build/index.html"));
})
app.listen(port, () => {
  console.log(`node sever listening on port ${port}`);
});
