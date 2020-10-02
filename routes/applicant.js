const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Applicant = require('../models/applicant');

// create applicant middleware
const applicantMiddleware = async (req, res, next) => {
   let applicant;
   try {
      let applicantId = mongoose.Types.ObjectId(req.params.id);
      applicant = await Applicant.findById(applicantId);
      if (applicant == null) {
         return res.status(401).json({ message: 'Cannot find applicant !!!' });
      }
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
   res.applicant = applicant;
   next();
};

// get all applicants
router.get('/', async (req, res) => {
   try {
      const applicants = await Applicant.find();
      res.status(200).json({ status: 'success', data: applicants });
   } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
   }
});

// get one applicant
router.get('/:id', applicantMiddleware, async (req, res) => {
   try {
      await res.status(200).json({ status: 'success', data: res.applicant });
   } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
   }
});

// create applicant
router.post('/', async (req, res) => {
   const applicant = new Applicant({
      ...req.body,
   });
   try {
      const createdApplicant = await applicant.save();
      res.status(201).json({ status: 'success', data: createdApplicant });
   } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
   }
});

// delete applicant
router.delete('/:id', applicantMiddleware, async (req, res) => {
   try {
      await res.applicant.remove();
      res.status(200).json({
         status: 'success',
         data: `applicant with id ${req.params.id} deleted`,
      });
   } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
   }
});

// Updating one
router.patch('/:id', applicantMiddleware, async (req, res) => {
   if (req.body.status != null) {
      res.applicant.status = req.body.status;
   }
   try {
      const updatedApplicant = await res.applicant.save();
      res.status(200).json({ status: 'success', data: updatedApplicant });
   } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
   }
});

router.post('/upload', async (req, res) => {
   try {
      if (!req.files) {
         res.status(500).json({ status: 'error', message: 'file not found !!' });
      }
      const cvFile = req.files.file;
      cvFile.mv(`${__dirname}/upload/${cvFile.name}`, (error) => {
         if (error) {
            console.log(error);
            res.status(500).json({ status: 'error', message: error.message });
         }
         return res.status(201).json({ status: 'success', data: `/${cvFile.name}` });
      });
   } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
   }
});

module.exports = router;
