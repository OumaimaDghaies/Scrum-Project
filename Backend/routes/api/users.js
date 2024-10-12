const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const User = require("../../models/User");


// @route POST api/users
// @desc Register new user
// @access Public
router.post("/register", (req, res) => {
    let { fname, lname, email, password, role = "User" } = req.body;

    if (!fname || !lname || !email || !password)
        return res.status(400).send({ msg: "Please enter all data" });

    User.findOne({ email: email }).then((user) => {
        if (user) return res.status(400).send({ msg: "Email already exist" });
    });
    let newUser = new User({ fname, lname, email, password, role });

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then((user) => {
                jwt.sign(
                    { id: user.id },
                    config.get("jwtSecret"),
                    { expiresIn: config.get("tokenExpire") },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                fname: user.fname,
                                lname: user.lname,
                                email: user.email,
                                role: user.role,
                            },
                        });
                    }
                );
            });
        });
    });
});

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get("/", (req, res) => {
    User.find().then((users) => res.json(users));
});


// @route   PUT api/users
// @desc    Update user
// @access  Private
router.put("/maj/:id", async (req, res) => {
    try {
        console.log(req.body.lname)
        await User.findOneAndUpdate(
            { _id: req.params.id },
            { 
                $set: {
                    fname: req.body.fname,
                    lname: req.body.lname
                }
            }
        );
        res.send("Mise à jour des champs 'fname' et 'lname' avec succès");
    } 
    catch (err) {
        console.log(err);
    }

});

// @route   POST api/users
// @desc    Delete user
// @access  Private && ADMIN
router.delete("/supprimer/:id", async (req, res) => {
    console.log(req.params.id);
    try {
        await User.findOneAndDelete({ _id: req.params.id })
        res.send("supprimé avec succès")

    }
    catch (err) {
        console.log(err);
    }

});
module.exports = router;