require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MySQL = require('mysql2');
const { sequelize } = require('./db/sql');
const schoolsRouter = require('./routes/sql/schools');
const hospitalsRouter = require('./routes/sql/hospitals');
const energyRouter = require('./routes/sql/energy');
const transportRouter = require('./routes/sql/transport');
const tourismRouter = require('./routes/sql/tourism');
const usersRouter = require('./routes/sql/users');
const complaintsRouter = require('./routes/sql/complaints');
const authRouter = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' }));

app.use('/api/sql/schools', schoolsRouter);
app.use('/api/sql/hospitals', hospitalsRouter);
app.use('/api/sql/energy', energyRouter);
app.use('/api/sql/transport', transportRouter);
app.use('/api/sql/tourism', tourismRouter);
app.use('/api/sql/users', usersRouter);
app.use('/api/sql/complaints', complaintsRouter);
app.use('/api/auth', authRouter);

async function start() {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		console.log('MySQL connected and models synchronized');
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
	} catch (err) {
		console.error('Failed to start server:', err);
		process.exit(1);
	}
}

start();
