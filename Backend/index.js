const express = require('express');
const signupRoute = require('./routes/signup');
const cors = require('cors');
const connectDB = require('./db/connectDB');
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/userRoutes');
const manageUsersRoute = require('./routes/manageUsers'); // New route for user management

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/user-details', userRoutes);
app.use('/api/manage-users', manageUsersRoute); // Register new route

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
