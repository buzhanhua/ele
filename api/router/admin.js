const db = require("../module/db")
const common = require("../module/common")
const md5 = require("md5")
module.exports.adminlogin = function (req, res) {
    var password = md5(req.body.password + "@ele.com")

    db.findOne("adminList", {
        adminName: req.body.adminName,
        password
    }, function (err, adminInfo) {

        if (adminInfo) {
            db.insertOne("adminLog", {
                adminId: adminInfo._id,
                logType: 4,
                detail: req.body.adminName + "在" + common.getNowTime() + "登录了饿了么管理系统",
                addTime: Date.now()
            }, function (err, results) {
                res.json({
                    ok: 1,
                    adminName: adminInfo.adminName,
                    adminId: adminInfo._id
                })
            })
        } else {
            res.json({
                ok: 2,
                msg: "账号密码错误"
            })
        }
    })
}

module.exports.adminLog = function (req, res) {
    var pageIndex = req.query.pageIndex / 1 || 1
    var pageNum = 2
    db.count("adminLog", {}, function (count) {
        var pageSum = Math.ceil(count / pageNum)
        if (pageSum < 1)
            pageSum = 1
        if (pageIndex > pageSum)
            pageIndex = pageSum
        if (pageIndex < 1)
            pageIndex = 1

        db.getadminLog(pageNum, (pageIndex - 1) * pageNum, function (err, adminInfo) {
            if (err) {

                res.json({
                    ok: 2,
                    msg: "网络连接错误"
                })
            } else {
                res.json({
                    ok: 1,
                    adminInfo,
                    pageSum

                })
            }
        })

    })

}

module.exports.addadmin = function (req, res) {
    var password = md5(req.body.password + '@ele.com')
    console.log(password)
    db.find("adminList", {
        where: {
            adminName: req.body.adminName
        }
    }, function (err, adminList) {
        console.log(adminList)
        if (adminList.length > 0) {
            res.json({
                ok: 2,
                msg: "该用户名已经被占用"
            })
        } else {
            db.insertOne("adminList", {
                adminName: req.body.adminName,
                password
            }, function (err, results) {
                if (err) {
                    res.json({
                        ok: 2,
                        msg: "网络连接错误"
                    })
                } else {
                    db.find("adminList", {
                        where: {
                            adminName: req.body.adminName
                        }
                    }, function (err, adminList) {
                        db.insertOne("adminLog", {
                            adminId: adminList[0]._id,
                            logType: 5,
                            detail: req.body.adminName + "在" + common.getNowTime() + "添加了管理员",
                            addTime: Date.now()
                        }, function (err, results) {
                            res.json({
                                ok: 1,
                                msg: "添加成功"
                            })
                        })
                    })
                }
            })
        }
    })
}

module.exports.getadminlist = function (req, res) {

    db.find("adminList", {}, function (err, adminList) {
        if (err) {
            res.json({
                ok: 2,
                msg: "网络连接错误"
            })
        } else {
            res.json({
                ok: 1,
                adminList
            })
        }
    })
}

module.exports.changepass = function (req, res) {
    db.findOne("adminList", {
        adminName: req.body.adminName,
        password: md5(req.body.password + "@ele.com")
    }, function (err, adminInfo) {
        if (adminInfo) {
            db.updateOne("adminList", {
                adminName: req.body.adminName,
                password: md5(req.body.password + "@ele.com")
            }, {
                    $set: {
                        password: md5(req.body.newpass + '@ele.com')
                    }
                }, function (err, results) {
                    if (err) {
                        res.json({
                            ok: 2,
                            msg: "网络连接失败"
                        })
                    } else {
                        res.json({
                            ok: 1,
                            msg: "修改成功"
                        })
                    }
                })
        } else {
            res.json({
                ok: 2,
                msg: "修改失败，请检查您的账号密码"
            })
        }
    })
}

module.exports.deleteadminlog = function (req, res) {
    db.deleteOneById("adminLog", req.query.id, function (err, results) {
        if (err) {
            res.json({
                ok: 2,
                msg: "网络连接错误"
            })
        } else {
            res.json({
                ok: 1,
                msg: "删除成功"
            })
        }
    })
}
