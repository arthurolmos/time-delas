


module.exports = function formatOrderNotes(newNotes, oldNotes=null) { 

    const options = { 
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
    }
    const date = new Date().toLocaleDateString('pt-BR', options)
    
    return oldNotes ? oldNotes + date + ' - ' + newNotes + '\n\n' : date + ' - ' + newNotes + '\n\n'
}
