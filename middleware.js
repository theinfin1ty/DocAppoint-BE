const { appointmentSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');

module.exports.validateAppointment = (req, res, next) => {
    const { error } = appointmentSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}