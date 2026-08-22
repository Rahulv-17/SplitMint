require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Make io accessible to routers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/settlements', require('./routes/settlementRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/recurring', require('./routes/recurringRoutes'));

app.get('/', (req, res) => {
  res.send('SplitMint API is running...');
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
  });
  
  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});

// Fix P0: Handle EADDRINUSE error gracefully instead of crashing nodemon loop
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use. Please kill the existing process and retry.\n`);
    process.exit(1);
  } else {
    throw err;
  }
});
