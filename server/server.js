import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
});

// Store online users
export const userSocketMap = {}; // {userId: socketId}

// Helper function to validate user session/ID
const validateUser = async (userId) => {
    // Add your user validation logic here
    // For example: check if user exists in database
    try {
        // Replace with your actual user validation
        if (!userId || userId === 'undefined' || userId === 'null') {
            return false;
        }
        // Add database check here if needed
        // const user = await User.findById(userId);
        // return !!user;
        return true;
    } catch (error) {
        console.error('User validation error:', error);
        return false;
    }
};

// Socket.io connection handler
io.on("connection", async (socket) => {
    try {
        const userId = socket.handshake.query.userId;
        console.log("Connection attempt from userId:", userId);

        // Validate userId
        if (!userId) {
            console.log("No userId provided");
            socket.emit("error", { 
                code: 1, 
                message: "Session ID unknown" 
            });
            socket.disconnect();
            return;
        }

        // Validate user exists/is valid
        const isValidUser = await validateUser(userId);
        if (!isValidUser) {
            console.log("Invalid userId:", userId);
            socket.emit("error", { 
                code: 1, 
                message: "Session ID unknown" 
            });
            socket.disconnect();
            return;
        }

        // Store user connection
        userSocketMap[userId] = socket.id;
        console.log("User connected successfully:", userId);

        // Emit online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // Send success confirmation to the connected user
        socket.emit("connectionSuccess", { 
            message: "Connected successfully",
            userId: userId 
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });

        // Handle custom events here
        socket.on("sendMessage", (data) => {
            // Handle message sending logic
            console.log("Message from", userId, ":", data);
        });

    } catch (error) {
        console.error("Socket connection error:", error);
        socket.emit("error", { 
            code: 1, 
            message: "Session ID unknown" 
        });
        socket.disconnect();
    }
});

// Middleware setup
app.use(express.json({ limit: '4mb' }));
app.use(cors());

// Router setup
app.use('/api/status', (req, res) => res.send('Server is live'));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect DB
await connectDB();

// Use a different port to avoid permission issues
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}

// Export server for vercel
export default server;