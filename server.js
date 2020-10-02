const express = require('express');
const mongoose = require('mongoose');
const applicantRouter = require('./routes/applicant');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

const connectionURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/applicants';
// connect to mongodb

mongoose.connect(connectionURI, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => console.log('Error while connecting to the db'));

db.on('open', (error) => console.log('Successfully connected to mongodb'));

app.use(express.static('upload')); // allow access in upload folder

app.use(cors()); // enable all the cors

app.use(express.json());

app.use(fileUpload());

app.use('/applicant', applicantRouter);

const port = process.env.PORT || 3000;
const ip = process.env.HOST || '0.0.0.0';

app.listen(port, ip, (error, success) => {
   console.log(`
    ==================================
    Server is running on ${ip}:${port}
    ==================================
    `);
});
