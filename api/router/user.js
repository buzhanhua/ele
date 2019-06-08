const mongodb = require("mongodb")
const common = require("../module/common")
const db = require("../module/db")
const jwt = require("../module/jwt")
module.exports.getvalidate = function(req,res){
          if(req.body.ploneId.length !== 11){
               res.json({
                    ok : 2,
                    msg : "请填写正确的手机号"
               })
          }else{
            db.find("codeList",{
                where : {
                  ploneId : req.body.ploneId,
                  addTime : {$gt :Date.now()-60000}
                }
        },function(err,codeList){
                if(codeList.length>0){
                      res.json({
                           ok : 2,
                           msg : "60秒内只能获取一次验证码"
                      })
                }else{
                     var code = common.validate(100000,999999)
                     db.insertOne("codeList",{
                           ploneId :  req.body.ploneId,
                           code,
                           addTime : Date.now(),
                     },function(err,results){
                           res.json({
                               ok : 1,
                               code
                           })
                     })
                }
        })
          }
          
}

module.exports.login = function(req,res){
        db.findOne("codeList",{
            ploneId :  req.body.ploneId,
            code : req.body.code/1
        },function(err,userInfo){
                 if(!userInfo){
                      res.json({
                          ok : 2,
                          msg : "验证码错误"
                      })
                 }else{
                       if(userInfo.addTime >= Date.now()-60000){
                              db.findOne("userList",{
                                ploneId :  req.body.ploneId
                              },function(err,userInfo){
                                    if(userInfo){
                                         res.json({
                                             ok : 1,
                                             msg : "登录成功",
                                             ploneId :req.body.ploneId ,
                                             goldNum : userInfo.goldNum,
                                             token : userInfo.token
                                         })
                                    }else{
                                         db.insertOne("userList",{
                                            ploneId :  req.body.ploneId,
                                            goldNum : 9999
                                         },function(err,results){
                                                 res.json({
                                                     ok : 1,
                                                     msg : "注册成功",
                                                     ploneId :req.body.ploneId ,
                                                     goldNum :9999,
                                                     token : jwt.encode({ploneId :req.body.ploneId })
                                                 })
                                         })
                                    }
                              }) 
                       }
                 }
        })
}


//购物车

module.exports.addcar = function(req,res){
         
         var resultsToken = jwt.decode(req.headers.authorization)
         if(resultsToken.ok===1){
             db.findOne("carList",{
                    ploneId : req.body.ploneId,
                    shopId : req.body.shopId,
                    goodsTypeId : req.body.goodsTypeId,
                    goodsId : req.body.goodsId
             },function(err,carInfo){
                 
                     if(carInfo){
                            db.updateOne("carList",{
                                   _id : carInfo._id
                            },{
                                $inc : {
                                     buyNum : 1
                                },
                                $set : {
                                   overTime:common.getNowTime()
                                }
                            },function(err,results){
                                    res.json({
                                         ok :1,
                                         msg : "添加成功",
                                         buyNum : carInfo.buyNum+1
                                    })
                            })
                     }else{
                          db.insertOne("carList",{
                              ploneId : req.body.ploneId,
                              shopId : req.body.shopId,
                              shopIdM : mongodb.ObjectId(req.body.shopId),
                              goodsTypeId : req.body.goodsTypeId,
                              goodsId : req.body.goodsId,
                              goodsIdM : mongodb.ObjectId(req.body.goodsId),
                              buyNum : 1,
                              createTime : common.getNowTime(),
                              overTime:common.getNowTime()

                          },function(err,results){
                                  res.json({
                                       ok :1,
                                       msg : "添加成功",
                                       buyNum : 1
                                  })
                          })
                     }
             })
         }else{
             res.json(jwt.decode(req.headers.authorization))
         }
         
}


module.exports.downcar = function(req,res){
     var resultsToken = jwt.decode(req.headers.authorization)
     if(resultsToken.ok===1){
         db.findOne("carList",{
                ploneId : req.body.ploneId,
                shopId : req.body.shopId,
                goodsTypeId : req.body.goodsTypeId,
                goodsId : req.body.goodsId
         },function(err,carInfo){
                 if(carInfo){
                      
                    if(carInfo.buyNum>1){
                         db.updateOne("carList",{
                                _id : carInfo._id
                         },{
                             $inc : {
                                  buyNum : -1
                             },
                             $set : {
                                overTime:common.getNowTime()
                             }
                         },function(err,results){
                                 res.json({
                                      ok :1,
                                      msg : "减购成功",
                                      buyNum : carInfo.buyNum-1
                                 })
                         })
                  }else{
                          db.deleteOne("carList",{
                               _id : carInfo._id
                          },function(err,results){
                                   res.json({
                                        ok : 1,
                                        msg : "删除成功",
                                        buyNum : 0
                                   })
                          })
                  }
                 }else{
                       res.json({
                            ok : 2,
                            msg : "网络连接错误"
                       })
                 }
                 
         })
     }else{
         res.json(jwt.decode(req.headers.authorization))
     }
     
}

module.exports.getcar = function(req,res){
        var tokenResults = jwt.decode(req.headers.authorization)
        if(tokenResults.ok===1){
             
           db.getcar(req.query.ploneId,function(err,carList){
               res.json({
                    ok : 1,
                    carList
               })
           })
        }else{
             res.json(tokenResults)
        }
       
}

module.exports.clearall = function(req,res){
          db.deleteMany("carList",{
               ploneId : req.query.ploneId,
               shopId : req.query.shopId,
          },function(err,results){
                 
                  if(err){
                    res.json({
                         ok : 2,
                         msg : "网络连接错误"
                    })
                  }else{
                    res.json({
                         ok : 1,
                         msg : "清除成功"
                    })
                  }
          })
}