const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use((req,res,next)=>{
  req.io = io;
  next();
});
app.use("/api/leave", require("./routes/leaveRoutes"));
app.use("/api/payroll", require("./routes/payrollRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));



io.on("connection", socket => {
  console.log("Socket Connected:", socket.id);
});


mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("MongoDB Connected"));

server.listen(5000, ()=>console.log("Backend running on 5000"));
