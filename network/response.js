const logger = require('../tracking/logger')

const builderParserResponse = ({req , res}) => {
    let messageProcess = "process finished successfully"
    let statusHttp = 200

    const setMessageProcess = (msg ) => {
        messageProcess = msg
    }

    const setStatusHttp = state => {
        statusHttp = state
    }

    const successfully = (data) => {
        success(req,res, messageProcess, statusHttp, data)
    }

    const failed = (error, messageError = "process failed", statusError = 400) => {
        exception(req, res,  messageError, statusError, error)
    }

    return {
        setMessageProcess,
        setStatusHttp,
        successfully,
        failed
    }
}

const success = (req, res, msg, status, data) => {
    logger.finishedProcessApi({
        msg: msg,
        code: status,
        details: data,
        method: req.method,
        url: req.url,
        ipClient:req.headers.host ,
        agentClient:  req.get('User-Agent'),
        tokenAccess: req.headers.Autorization || "",
        bodyReq: req.body,
        queryReq: req.query
    })
    res.status(status).send({
        status,
        msg,
        data, 
        error : null
    })
}


const exception = (req, res, msg, status, error) => {
    console.error(req, msg, error)
    res.status(status || 500).send({
        status,
        msg,
        data: null, 
        error 
    })
}

module.exports = {
    builderParserResponse,
    success,
    exception
}