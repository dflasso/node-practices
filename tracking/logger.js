const finishedProcessApi = ({ msg = "", code = 0, details = {}, method = "GET", url = "/", ipClient = "localhost", agentClient = "",
tokenAccess = "", bodyReq = {}, queryReq = {} }) => {

    info({
        msg,
        code,
        details,
        trace: {
            method,
            url,
            bodyRequest: bodyReq ,
            queryRequest: queryReq,
            ipClient,
            agentClient,
            tokenAccess
        }
    })

}

const info = ({ msg = "", code = 0, details = {}, trace = {} }) => {
    console.log({
        timestamp: new Date().toISOString(),
        msg,
        code,
        details,
        trace
    })
}

module.exports = {
    info,
    finishedProcessApi
}