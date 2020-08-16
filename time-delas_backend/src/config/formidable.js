module.exports = {
    opts: {
        encoding: 'utf-8',
        multiples: true
    },

    events: [
        {
            event: 'fileBegin',
            action: function (req, res, next, name, file) { 
                return console.log('EVENT!', file, name, req.fields)
            }
        }, 
        {
            event: 'field',
            action: function (req, res, next, name, value) { 
                return console.log('EVENT!', name, value)
            }
        }
    ]
}