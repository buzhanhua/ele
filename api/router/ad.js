const db = require("../module/db")
const common = require("../module/common")
const md5 = require("md5")
const formidable = require("formidable")
const {uppic} = require("../module/uppic")
const fs = require("fs")
const mongodb = require("mongodb")

module.exports.addad = function(req,res){
    uppic(req,"adPic",function(obj){
        if(obj.ok===2){
            res.json(obj)
       }else{
            if(obj.ok===1){
              
                              db.insertOne("adList",{
                                  adName :  obj.params.adName,
                                  adPic : obj.newPicName,
                                  createTime : common.getNowTime(),
                                  
                                  adType : obj.params.adType/1,
                                 
                                  
                                  adUrl : obj.params.adUrl,
                                  orderBy : obj.params.orderBy/1
                              },function(err,rsults){
                                       res.json({
                                           ok : 1,
                                           msg : "添加成功"
                                       })
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

module.exports.getad = function(req,res){
        db.find("adList",{
              sort : {
                   
                   adType : 1,
                   adName : -1
              }
        },function(err,adList){
               res.json({
                   ok : 1,
                   adList
               })
        })
}

module.exports.deleteAd = function(req,res){
    db.findOneById("adList",req.query.id,function(err,adInfo){
             fs.unlink("./upload/"+adInfo.adPic,function(){
                db.deleteOneById("adList",req.query.id,function(err,results){
                    res.json({
                        ok : 1,
                        msg : "删除成功"
                    })
           })
             })
    })
}