const formidable = require("formidable")
const fs = require("fs")
/*
 *  上传图片的封装
 *  将上传的结构返回出去
 *  cb({
 * 	    ok : 1     1   成功    2  上传异常  3 未上传图片
 * })
 * */
module.exports.uppic = function (req, picName, cb) {
	var form = new formidable.IncomingForm()
	form.uploadDir = "./upload"
	form.encoding = "utf-8"
	form.keepExtensions = true;
	form.parse(req, function (err, params, file) {
		if (err) {
			cb({
				ok: 2,
				msg: "网络连接错误"
			})
		} else {
			    
			if (file[picName]) {
				if (file[picName].size > 0) {
					var picN = file[picName].name;
					var keepName = picN.substr(picN.lastIndexOf(".")).toLowerCase()
					var keepArr = [".jpg", ".png", ".gif",".webp"]
					if (keepArr.includes(keepName)) {
						var newPicName = Date.now() + keepName
						fs.rename(file[picName].path, "./upload/" + newPicName, function (err) {
							cb({
								ok: 1,
								params,
								newPicName
							})
						})
					} else {
						fs.unlink(file[picName].path, function (err) {
							cb({
								ok: 2,
								msg: "请传输正确的文件类型  .jpg .png .gif"
							})
						})
					}
				} else {
					fs.unlink(file[picName].path, function (err) {
						cb({
							ok: 3,
							params
						})
					})
				}
			} else {
				cb({
					ok: 3,
					params
				})
			}
		}
	})


}

