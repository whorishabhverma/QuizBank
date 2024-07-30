const express = require("express");
const router = require('./Routes/route.js');
const Connection = require('./Database/db.js');
const cors = require('cors');

const app = express();
app.use(cors());
Connection();
app.use(express.json());
app.use('/', router);

const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}`));
