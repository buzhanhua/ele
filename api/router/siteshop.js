const db = require("../module/db")
const mongodb = require("mongodb")
module.exports.getshoptypelist = function(req,res){
        db.find("shopType",{
             sort : {
                createTime : 1
             }
        },function(err,shopTypeList){
                var count = Math.ceil(shopTypeList.length/10)
                var shopType = []
                for(var i = 0 ; i< count ;i++){
                        shopType[i] = []
                        for( var j = i*10 ; j<i*10+10 && j<shopTypeList.length ; j++){
                            shopType[i].push(shopTypeList[j])
                        }
                }
                res.json({
                     ok : 1,
                     shopType
                })
                
        })
}

module.exports.sitegetad = function(req,res){
        var type = req.query.type/1

        db.find("adList",{
             where : {
                adType : type
             }     
        },function(err,adList){
               res.json({
                       ok : 1,
                       adList
               }) 
        })
}

module.exports.sitegetshoplist = function(req,res){
         var pageIndex = req.query.pageIndex/1 || 1
         var pageSum = 5
         var type = req.query.type ? req.query.type/1 : 1
         var skip = (pageIndex-1)*pageSum
         var obj = {}
         switch(type){
                case 1 : 
                obj.sort = {
                        shopName : -1   
                }
                break;
                case 2 : 
                obj.sort = {
                        createTime : -1   
                }
                break;
                case 3 : 
                obj.sort = {
                        shopTypeId : -1   
                }
                break;
                case 4 : 
                obj.sort = {
                        shopPic : -1   
                }
                break;

         }
          db.find("shopList",obj,function(err,shopList){
                   var shop = []
                   for( var i = skip ; i< skip + pageSum ; i++){
                           if(shopList[i])
                           shop.push(shopList[i])
                   }
                   res.json({
                           ok : 1,
                           shop
                   })
          })
}

module.exports.sitegetshopinfo = function(req,res){
        //创建一个新的数据格式  [{goodsTypeId:xxxx,goodsTypeName:xxx,goodsList:[xxx]}]
         db.getshopinfo(req.query.id,function(err,shopInfo){
                   
                     res.json({
                             ok : 1,
                             shopInfo
                     })
         })
}

module.exports.siteshoplistbyid = function(req,res){
            db.getshoplistbyid(req.query.id,function(err,shopList){
                    console.log(shopList)
                      res.json({
                              ok : 1,
                              shopList
                      })
            })
}