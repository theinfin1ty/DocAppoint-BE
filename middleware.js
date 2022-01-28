const { appointmentSchema } = require('./schemas') 
const ExpressError = require('./utils/ExpressError') 

module.exports.validateAppointment = (req, res, next) => {
    const { error } = appointmentSchema.validate(req.body) 
    if(error){
        const msg = error.details.map(el => el.message).join(',') 
        throw new ExpressError(msg, 400) 
    } else{
        next() 
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first') 
        return res.redirect('/login') 
    }
    next() 
}

module.exports.isClient = (req, res, next) => {
    if(req.user.userType != 'client'){
        req.flash('error', 'You do not have permission to do that!') 
        if(req.user.userType == 'admin'){
            return res.redirect('/admin') 
        }
    } else{
        next() 
    }
}

module.exports.isAdmin = (req, res, next) => {
    if(req.user.userType != 'admin'){
        req.flash('error', 'You do not have permission to do that!') 
        if(req.user.userType == 'client'){
            return res.redirect('/client') 
        }
        if(req.user.userType == 'doctor'){
            return res.redirect('/doctor') 
        }
    } else{
        next() 
    }
}

module.exports.isDoctor = (req, res, next) => {
    if(req.user.userType != 'doctor'){
        req.flash('error', 'You do not have permission to do that!') 
        if(req.user.userType == 'client'){
            return res.redirect('/client') 
        }
        if(req.user.userType == 'admin'){
            return res.redirect('/admin') 
        }
    } else{
        next() 
    }
}