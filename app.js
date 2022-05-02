const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

dotenv.config();

const indexRouter = require('./routes/index.routes');
const app = express();

const db = require('./configs/db/index');
db.connect();

app.use(cors({ origin: [process.env.clientI, process.env.clientII] }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


module.exports = app;


