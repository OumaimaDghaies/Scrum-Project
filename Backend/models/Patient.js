const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PatientSchema = new Schema({
first_name: {
type:String,
required:true,
},
last_name: {
    type:String,
    required:true,
    },
email: {
type:String,
required:true,
unique:true,
},
password: {
type:String,
required:true,
},
role: {
    type:String, 
    required:true,
},
securiteSocial: {
    type:String, 
    required:true,
},
telephone: {
    type: String,
    required: true,
    validate: {
        validator: function(v) {
            return /^\d{8}$/.test(v);
        },
        message: props => `${props.value} is not a valid telephone number! It must be 8 digits long.`
    }
},
birthday: {
    type:Date, 
    required:true,
},

});
module.exports = Patient = mongoose.model("patient", PatientSchema);