const User = require('../models/User')
const { Op } = require('sequelize')

async function validateEmail(email, userId=null){ 
    if(userId) { 
        const user = await User.findOne({ where: { email, id: { [Op.ne]: userId } }})
        return user ? false : true
    } else { 
        const user = await User.findOne({ where: { email }})
        return user ? false : true
    }
}


module.exports.validateEmail = validateEmail
