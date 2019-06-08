const db = require("../module/db")
const common = require("../module/common")
const md5 = require("md5")
const formidable = require("formidable")
const {uppic} = require("../module/uppic")
const fs = require("fs")
const mongodb = require("mongodb")

module.exports.addgoodstype = function(req,res){
    db.findOne("goodsType",{
        goodsTypeName : req.body.goodsTypeName,
        shopId : req.body.shopId
   },function(err,goodsInfo){
          
          if(goodsInfo){
               res.json({
                   ok : 2,
                   msg :  "该类别已经被添加"
               })
          }else{
               db.insertOne("goodsType",{
                   goodsTypeName : req.body.goodsTypeName,
                   shopId : mongodb.ObjectId(req.body.shopId),
                   createTime : common.getNowTime(),
                   
                  
               },function(err,rsults){
                        res.json({
                            ok : 1,
                            msg : "添加成功"
                        })
               })
          }
   })
}
module.exports.getgoodstypelist = function(req,res){
         db.getgoodstypelist(function(err,goodstypelist){
                  if(err){
                        res.json({
                             ok : 2,
                             msg : '网络连接错误'
                        })
                  }else{
                       res.json({
                           ok : 1,
                           goodstypelist
                       })
                  }
         })
}

module.exports.deletegoodstype = function(req,res){
        db.deleteOneById("goodsType",req.query.id,function(err,results){
                      res.json({
                          ok : 1,
                          msg : "删除成功"
                      })
        })
}

module.exports.addgoods = function(req,res){
        uppic(req,"goodsPic",function(obj){
            if(obj.ok===2){
                res.json(obj)
           }else{
                if(obj.ok===1){
                      db.findOne("goodsList",{
                           goodsName : obj.params.goodsName
                      },function(err,goodsInfo){
                             if(goodsInfo){
                                  res.json({
                                      ok : 2,
                                      msg :  "该商品名已别已经被占用"
                                  })
                             }else{
                                  db.insertOne("goodsList",{
                                      goodsName :  obj.params.goodsName,
                                      goodsPic : obj.newPicName,
                                      createTime : common.getNowTime(),
                                      
                                      shopId : mongodb.ObjectId(obj.params.shopId),
                                      goodsTypeId : mongodb.ObjectId(obj.params.goodsTypeId),
                                      isHot : obj.params.isHot,
                                      goodsPrice : obj.params.goodsPrice
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

module.exports.getgoods = function(req,res){
         db.getgoods(function(err,goodsList){
                  res.json({
                      ok : 1,
                      goodsList
                  })
         })
}

module.exports.deletegoods = function(req,res){
        db.findOneById("goodsList",req.query.id,function(err,goodsInfo){
                 fs.unlink("./upload/"+goodsInfo.goodsPic,function(){
                    db.deleteOneById("goodsList",req.query.id,function(err,results){
                        res.json({
                            ok : 1,
                            msg : "删除成功"
                        })
               })
                 })
        })
}