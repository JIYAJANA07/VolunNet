require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const signupRoutes = require("./routes/signupRoutes");
const hourRoutes = require("./routes/hourRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

connectDB();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/signups", signupRoutes);
app.use("/api/hours", hourRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "VolunNet Backend API is running"
    });
});

// Make Socket.io available to other parts of the app
app.set("io", io);

// Socket.io real-time functionality
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins their personal room
    socket.on("joinUser", (userId) => {
        if (!userId) {
            return;
        }

        socket.join(`user_${userId}`);

        console.log(`User ${userId} joined room user_${userId}`);
    });

    // Send real-time notification
    socket.on("sendNotification", (data) => {
        if (!data || !data.userId) {
            return;
        }

        io.to(`user_${data.userId}`).emit("notification", {
            title: data.title || "New Notification",
            message: data.message || "",
            type: data.type || "general"
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});