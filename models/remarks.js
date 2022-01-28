const mongoose = require('mongoose') 
const Schema = mongoose.Schema 

const remarkSchema = new Schema({
    remark: {
        type: String
    },
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }
})

module.exports = mongoose.model('Remark', remarkSchema) 