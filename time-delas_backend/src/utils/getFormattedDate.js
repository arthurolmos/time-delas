const moment = require('moment')

module.exports = function getFormattedDate() { 
    const options = { 
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
    }
    
    moment.locale('pt-br')
    const date = moment().format('lll, ZZ')
    console.log(date)

}