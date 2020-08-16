const mongoose = require('mongoose')


const pictureSchema = new mongoose.Schema({ 
    name: { 
        type: String,
        required: true,
    },

    size: { 
        type: Number,
        required: true,
    },

    key: { 
        type: String,
        required: true,
    },

    url: { 
        type: String,
    },

}, { 
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
})


module.exports = mongoose.model('Picture', pictureSchema)