// Import library
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Import component
const route = require('./routes');
const db = require('./config/db');

// Config server
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '200mb' })); // For parsing application/json
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true })); // For parsing application/x-www-form-urlendcoded

// Connect to db
db.connect(process.env.MONGODB_URI);

// Set up routes
route(app);

// Listen server
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
