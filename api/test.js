const jwt = require("jwt-simple")

var key = "skdkadmaskd"

var token = jwt.encode({
       ploneId : "123231",
       exp : Date.now()+10*60*1000
},key)

console.log(jwt.decode(token,key))