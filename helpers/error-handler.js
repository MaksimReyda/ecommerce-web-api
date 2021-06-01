//hendeling errors

function errorHandler(err, req, res, next){
    // if(err){
        // res.status(500).json({
        //     message: err,
        //     success: false
        // })
    // }

    if(err.name === 'UnauthorazedError'){
        return res.status(401).json({
            message: 'The user is not authorized'
        })
    }

    if(err.name === 'ValidationError'){
        return res.status(401).json({
            message: err
        })
    }

    // general errors
    return res.status(500).json({
        message: err,
        success: false
    })
}

module.exports = errorHandler