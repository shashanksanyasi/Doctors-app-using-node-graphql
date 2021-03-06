const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  user: {
    name: { type: String, required: "Name is required" },
    email: { type: String, required: "E-mail is required" },
    phone: { type: Number, required: "Phone is required" }
  },
  dateAndTime: { type: Date, required: "Appointment start date is required" },
  endDateAndTime: { type: Date }
});

AppointmentSchema.path("dateAndTime").validate(function(value, done) {
  var self = this;
  return mongoose.models.Appointment.find({
    _id: { $ne: self._id },
    $or: [
      { dateAndTime: { $lt: self.endDateAndTime, $gte: self.dateAndTime } },
      { endDateAndTime: { $lte: self.endDateAndTime, $gt: self.dateAndTime } }
    ]
  }).then(appointments => {
    return !appointments || appointments.length === 0;
  });
}, "The appointment is already taken");

AppointmentSchema.path("dateAndTime").validate(function(value, done) {
  return value > new Date();
}, "The appointment cannot be scheduled in the past");

AppointmentSchema.path("endDateAndTime").validate(function(value, done) {
  return value ? value > this.dateAndTime : true;
}, "End date must be greater than start date");

module.exports = mongoose.model("Appointment", AppointmentSchema);
