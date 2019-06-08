module.exports.getNowTime = function(){
	          var date=new Date();
        return (date.getFullYear()
        +"-"+(date.getMonth()+1).toString().padStart(2,"0")
        +"-"+date.getDate().toString().padStart(2,"0")
        +" "+date.getHours().toString().padStart(2,"0")
        +":"+date.getMinutes().toString().padStart(2,"0")
        +":"+date.getSeconds().toString().padStart(2,"0"));
}

module.exports.validate = function(min,max){
         return Math.round(Math.random()*(max-min)+min)
}
