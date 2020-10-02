const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: true,
   },
   lastName: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: [true, 'Email required'],
      lowercase: true,
      unique: true,
      validate: {
         validator: function (v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
         },
         message: 'Please enter a valid email',
      },
   },
   cvUrl: {
      type: String,
      required: true,
   },
   status: {
      type: String,
      required: true,
      default: 'submitted',
   },
   submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
   },
});

module.exports = mongoose.model('Applicant', applicantSchema);
