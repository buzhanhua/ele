const db = require("../module/db")
const common = require("../module/common")
const md5 = require("md5")
const formidable = require("formidable")
const {uppic} = require("../module/uppic")
const fs = require("fs")
const mongodb = require("mongodb")
module.exports.addshoptype = function(req,res){
         uppic(req,"shopTypePic",function(obj){
                     if(obj.ok===2){
                          res.json(obj)
                     }else{
                          if(obj.ok===1){
                                db.findOne("shopType",{
                                     shopTypeName : obj.params.shopTypeName
                                },function(err,shopInfo){
                                       if(shopInfo){
                                            res.json({
                                                ok : 2,
                                                msg :  "该类别已经被添加"
                                            })
                                       }else{
                                            db.insertOne("shopType",{
                                                shopTypeName :  obj.params.shopTypeName,
                                                shopTypePic : obj.newPicName,
                                                createTime : common.getNowTime(),
                                                
                                                orderBy : obj.params.orderBy/1
                                            },function(err,rsults){
                                                     res.json({
                                                         ok : 1,
                                                         msg : "添加成功"
                                                     })
                                            })
                                       }
                                })
                          }else{
                              res.json({
                                  ok : 2,
                                  msg : "图片不能为空"
                              })
                          }
                     }                         
         })
}

module.exports.getshoptypelist = function(req,res){
        var pageIndex = req.query.pageIndex ? req.query.pageIndex/1 : 1
        var pageNum = 3  
        db.count("shopType",{},function(count){
                var pageSum = Math.ceil(count/pageNum)
                if(pageSum<1)
                   pageSum = 1
                if(pageIndex>pageSum)
                   pageIndex = pageSum
                if(pageIndex<1)
                   pageIndex = 1

                   db.find("shopType",{
                    sort : {
                        
                        orderBy : -1,
                        createTime : -1
        
                    },
                    limit : pageNum,
                    skip : (pageIndex-1)*pageNum
                    
                },function(err,shopTypeList){
                          if(err){
                                res.json({
                                    ok : 2,
                                    msg : "网络连接错误"
                                })
                          }else{
                               res.json({
                                   ok : 1,
                                   shopTypeList,
                                   pageSum,
                                   pageIndex
                               })
                          }
                })
        })
     
}

module.exports.deleteShopTypeList = function(req,res){
        db.findOneById("shopType",req.query.id,function(err,shopTypeInfo){
                     fs.unlink("./upload/"+shopTypeInfo.shopTypePic,function(err){
                        db.deleteOneById("shopType",req.query.id,function(err,results){
                            if(err){
                                 res.json({
                                     ok : 2,
                                     msg : "网络连接错误"
                                 })
                            }else{
                                 res.json({
                                     ok : 1,
                                      msg : "删除成功" 
                                 })
                            }
                })
                     })
        })
}

module.exports.getshoptypelistall = function(req,res){
    db.find("shopType",{
        sort : {
            
            orderBy : -1,
            createTime : -1

        }
       
        
    },function(err,shopTypeList){
              if(err){
                    res.json({
                        ok : 2,
                        msg : "网络连接错误"
                    })
              }else{
                   res.json({
                       ok : 1,
                       shopTypeList,
                      
                   })
              }
    })
}

module.exports.addshop = function(req,res){
    uppic(req,"shopPic",function(obj){
        if(obj.ok===2){
             res.json(obj)
        }else{
             if(obj.ok===1){
                   db.findOne("shopList",{
                        shopName : obj.params.shopName
                   },function(err,shopInfo){
                          if(shopInfo){
                               res.json({
                                   ok : 2,
                                   msg :  "该店铺名已别已经被占用"
                               })
                          }else{
                               db.insertOne("shopList",{
                                   shopName :  obj.params.shopName,
                                   shopPic : obj.newPicName,
                                   createTime : common.getNowTime(),
                                   
                                   shopTypeId : mongodb.ObjectId(obj.params.shopTypeId)
                               },function(err,rsults){
                                        res.json({
                                            ok : 1,
                                            msg : "添加成功"
                                        })
                               })
                          }
                   })
             }else{
                 res.json({
                     ok : 2,
                     msg : "图片不能为空"
                 })
             }
        }                         
})
}

module.exports.getshop = function(req,res){
          var keyword = req.query.keyword
         db.getshoplist(keyword,function(err,shopList){
                   if(err){
                        res.json({
                            ok : 2,
                            msg : "网络连接失败"
                        })
                   }else{
                        res.json({
                            ok : 1,
                            shopList
                        })
                   }
         })
}

module.exports.getshopinfo = function(req,res){
          db.findOneById("shopList",req.query.id,function(err,shopInfo){
                         if(err){
                               res.json({
                                   ok : 2,
                                   msg : "网络连接错误"
                               })
                         }else{
                              res.json({
                                  ok : 1,
                                  shopInfo
                              })
                         }
          })
}

module.exports.updateshop = function(req,res){
    uppic(req,"shopPic",function(obj){
        if(obj.ok===2){
             res.json(obj)
        }else{
             if(obj.ok===1){
                    db.findOneById("shopList",obj.params.shopId,function(err,shopInfo){
                               fs.unlink("./upload/"+shopInfo.shopPic,function(err){
                                db.updateOneById("shopList",obj.params.shopId,{
                                    $set : {
                                          shopName : obj.params.shopName,
                                          shopPic : obj.newPicName,
                                          shopTypeId : mongodb.ObjectId(obj.params.shopTypeId)
                                    }
                              },function(err,results){
                                      if(err){
                                           res.json({
                                               ok : 2,
                                               msg : "网络连接错误"
                                           })
                                      }else{
                                           res.json({
                                               ok : 1,
                                               msg : "修改成功"
                                           })
                                      }
                              })
                               })
                    })

                    
             }else{
                db.updateOneById("shopList",obj.params.shopId,{
                    $set : {
                          shopName : obj.params.shopName,
                          
                          shopTypeId : mongodb.ObjectId(obj.params.shopTypeId)
                    }
              },function(err,results){
                      if(err){
                           res.json({
                               ok : 2,
                               msg : "网络连接错误"
                           })
                      }else{
                           res.json({
                               ok : 1,
                               msg : "修改成功"
                           })
                      }
              })
             }
        }                         
})
}

module.exports.deleteshop = function(req,res){
           db.deleteOneById("shopList",req.query.id,function(err,results){
                     if(err){
                           res.json({
                               ok : 2,
                               msg : "网络连接错误"
                           })
                     }else{
                           res.json({
                               ok : 1,
                               msg : "删除成功"
                           })
                     }
           })
}