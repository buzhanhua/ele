const jwt = require("jwt-simple")

var key = "nihaoa@@"
//生成token
module.exports.encode = function(payload){
           payload.exp = Date.now()+60*60*1000
           return jwt.encode(payload,key)
}
//验证token
// 1 、 验证成功  -2 token 过期  -1 token验证失败
module.exports.decode = function(token){
       try{
            var results = jwt.decode(token,key)
            if(results.exp > Date.now()){
                  return {
                       ok : 1,
                       msg : "验证成功"
                  }
            }else{
                return {
                    ok : -2,
                    msg : "token过期"
               }
            }
       } 
       catch(err){
              return {
                   ok : -1,
                   msg : "token验证失败"
              }   
       }
}
