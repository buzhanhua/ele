const mongodb = require("mongodb")
const mongoClient = mongodb.MongoClient;

function _connect(cb){
	    mongoClient.connect("mongodb://127.0.0.1:27017",{useNewUrlParser:true},function(err,client){
	    	    cb(client.db("ele"))
	    })
}


module.exports.getshopinfo = function(id,cb){
	   _connect(function(db){
		     db.collection("shopList").aggregate([
				 
                    {
						$match : {
                             _id : mongodb.ObjectId(id)
						}
					}
				 ,
				{
					$lookup : {
						   from : "goodsType",
						   localField : "_id",
						   foreignField : "shopId",
						   as : "goodsTypeList"
					}
				},
				{
					$lookup : {
						   from : "goodsList",
						   localField : "_id",
						   foreignField : "shopId",
						   as : "goodsList"
					}
				},
			 ]).toArray(cb)
	   })
}
//多表联查==》 获取一条
module.exports.getadminLog = function(limit,skip,cb){
	  _connect(function(db){
		     db.collection("adminLog").aggregate([
				   {
                         $sort : {
							  addTime : -1
						 }
				   },
				   {
					   $skip : skip
				   },
				   {
					   $limit : limit
				   },

				  {
					  $lookup : {
						 from : "adminList",
						 localField : "adminId",
						 foreignField : "_id",
						 as : "adminInfo"
					  }
				  },
				  {
					$lookup : {
					   from : "logType",
					   localField : "logType",
					   foreignField : "type",
					   as : "adminType"
					}
				}
				
			 ]).toArray(cb)
	  })
}
module.exports.getshoplistbyid = function(id,cb){
	    _connect(function(db){
			  db.collection("shopType").aggregate([
				  {
					  $match : {
                         _id : mongodb.ObjectId(id)
					  }
				  },
				{
					$lookup : {
						   from : "shopList",
						   localField : "_id",
						   foreignField : "shopTypeId",
						   as : "shopList"
					}
				}
			  ]).toArray(cb)            
		})
}

module.exports.getshoplist = function(keyword,cb){
	  _connect(function(db){
		     db.collection("shopList").aggregate([
				   {$match:{
					      shopName : new RegExp(keyword)   
				   }},
				  {
					$sort : {
						 
					  shopName : -1,
					  createTime : -1
					}
				   },
				   {
					   $lookup : {
							  from : "shopType",
							  localField : "shopTypeId",
							  foreignField : "_id",
							  as : "shopInfo"
					   }
				   }
			 ]).toArray(cb)
	  })
}

module.exports.getgoodstypelist = function(cb){
	 _connect(function(db){
		     db.collection("goodsType").aggregate([
				  {
					  $sort : {
						   
						shopId : -1,
						createTime : -1
					  }
				  },
				  {
					$lookup : {
						   from : "shopList",
						   localField : "shopId",
						   foreignField : "_id",
						   as : "shopInfo"
					}
				}
			 ]).toArray(cb)
	 })
}

module.exports.getgoods = function(cb){
	    _connect(function(db){
			    db.collection("goodsList").aggregate([
					{
						$sort : {
						 	 
						  shopId : -1,
						  goodsTypeId : -1,
						  createTime : -1
						}
					},
					 {
						$lookup : {
							from : "shopList",
							localField : "shopId",
							foreignField : "_id",
							as : "shopInfo"
					 } 
					 },
					 {
						$lookup : {
							from : "goodsType",
							localField : "goodsTypeId",
							foreignField : "_id",
							as : "goodsTypeInfo"
					 } 
					 }

				]).toArray(cb)
		})
}

module.exports.getcar = function(id,cb){
	    _connect(function(db){
			   db.collection("carList").aggregate([
				{
					$match : {
					   ploneId : id
					}
				},  
				{
					$sort : {
						shopId : -1,	
					  createTime : -1
					}
				},
				{
					$lookup : {
						from : "shopList",
						localField : "shopIdM",
						foreignField : "_id",
						as : "shopInfo"
				 } 
				},
				{
					$lookup : {
						from : "goodsList",
						localField : "goodsIdM",
						foreignField : "_id",
						as : "goodsInfo"
				 } 
				},
			   ]).toArray(cb)
		})
}
//添加一条数据
module.exports.insertOne = function(coll,obj,cb){
	   _connect(function(db){
	   	      db.collection(coll).insertOne(obj,cb)
	   })
}
//查找多条数据
module.exports.find = function(coll,obj,cb){
	    obj.where = obj.where || {};
	    obj.sort  = obj.sort  || {};
	    obj.limit = obj.limit || 0 ;
	    obj.skip  = obj.skip  || 0 ;
	    
	   _connect(function(db){
	   	     db.collection(coll).find(obj.where).sort(obj.sort).limit(obj.limit).skip(obj.skip).toArray(cb)
	   })
}
//根据ID查找一条数据

module.exports.findOneById = function(coll,id,cb){
	    _connect(function(db){
	    	 db.collection(coll).findOne({
	    	 	  _id : mongodb.ObjectId(id)
	    	 },cb)
	    })
}
//根据条件查找一条信息
module.exports.findOne = function(coll,obj,cb){
	_connect(function(db){
		 db.collection(coll).findOne(obj,cb)
	})
}

//根据ID删除一条数据
module.exports.deleteOneById = function(coll,id,cb){
	     _connect(function(db){
	     	   db.collection(coll).deleteOne({
	     	   	   _id:mongodb.ObjectId(id)
	     	   },cb)
	     })
}
//删除一条数据
module.exports.deleteOne = function(coll,obj,cb){
	_connect(function(db){
		   db.collection(coll).deleteOne(obj,cb)
	})
}

//删除多天数据

module.exports.deleteMany = function(coll,obj,cb){
	_connect(function(db){
		   db.collection(coll).deleteMany(obj,cb)
	})
}

//根据ID修改一条数据
module.exports.updateOneById = function(coll,id,upobj,cb){
	    _connect(function(db){
	    	   db.collection(coll).updateOne({
	    	   	   _id : mongodb.ObjectId(id)
	    	   },upobj,cb)
	    })
}

//查找符合条件数据的数量

module.exports.count = function(coll,where,cb){
	   _connect(function(db){
	   	   db.collection(coll).countDocuments(where).then(cb)
	   })
}

//修改一条数据
module.exports.updateOne = function(coll,obj,upobj,cb){
	_connect(function(db){
		   db.collection(coll).updateOne(obj,upobj,cb)
	})
}

//修改多条条数据
module.exports.updateMany = function(coll,obj,upobj,cb){
	_connect(function(db){
		   db.collection(coll).updateMany(obj,upobj,cb)
	})
}