const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Patient = require("../../models/Patient");

// @route POST api/patient/add_patient
// @desc add new patient
// @access Public
router.post("/add_patient", (req, res) => {
    const { first_name, last_name, email, password, role, securiteSocial, telephone, birthday } = req.body;

    if (!first_name || !last_name || !email || !password || !role || !securiteSocial || !telephone || !birthday) {
        return res.status(400).send({ msg: "Please enter all data" });
    }

    Patient.findOne({ email: email }).then((existingPatient) => {
        if (existingPatient) {
            return res.status(400).send({ msg: "Email already exists" });
        } else {
            const newPatient = new Patient({
                first_name,
                last_name,
                email,
                password: bcrypt.hashSync(password, 10), 
                role,
                securiteSocial,
                telephone,
                birthday,
            });

            newPatient.save()
                .then(() => res.status(201).send({ msg: "Patient added successfully" }))
                .catch(err => res.status(500).send({ msg: "Error saving patient", error: err.message }));
        }
    }).catch(err => {
        res.status(500).send({ msg: "Error checking email", error: err.message });
    });
});


// to test : http://localhost:3001/api/patients/add_patient
/* 
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "password": "john",
    "role": "patient",
    "securiteSocial": "123456789",
    "telephone": "12345678",
    "birthday": "1990-01-01"
}
*/


router.get("/:email", (req, res) => {
    const { email } = req.params;

    // Find the patient by email
    Patient.findOne({ email: email })
        .then(patient => {
            if (!patient) {
                return res.status(404).send({ msg: "Patient not found" });
            }
            res.status(200).json(patient); // Return the patient data as JSON
        })
        .catch(err => {
            res.status(500).send({ msg: "Error fetching patient", error: err.message });
        });
});

router.get("/", (req, res) => {
    Patient.find()
        .then(patients => {
            if (patients.length === 0) {
                return res.status(404).send({ msg: "No patients found" });
            }
            res.status(200).json(patients); // Return the patients as JSON
        })
        .catch(err => {
            res.status(500).send({ msg: "Error fetching patients", error: err.message });
        });
});


router.delete("/:email", (req, res) => {
    const { email } = req.params;

    Patient.findOneAndDelete({ email: email })
        .then(deletedPatient => {
            if (!deletedPatient) {
                return res.status(404).send({ msg: "Patient not found" });
            }
            res.status(200).send({ msg: "Patient deleted successfully" });
        })
        .catch(err => {
            res.status(500).send({ msg: "Error deleting patient", error: err.message });
        });
});
module.exports = router;
