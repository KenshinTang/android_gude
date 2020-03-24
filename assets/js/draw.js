
function setRotae(v){
	if(v==null)
		v='';
	else
		v='rotate('+v+'deg)';
	document.getElementById('trun').style.transform=v;
}
function doDraw(opt){
	var opt =opt ||{}; 
	/*
	*opt.id  中奖的id
	**/
    // if(!$('#turn>*').length)return;
	if(pagedata.runing==1)return;
	pagedata.runing=1;
	//$('#trunbutton').html('天降<br>鸿福');
	$('#trun').attr('class','runing');
	setRotae();  
	setTimeout(dostop,Math.floor(Math.random()*1500)+2000,opt);
}
function dostop(){
	var opt=(arguments[0]);
	var exp=$('#trun').css('transform');
	console.dir( $('#trun') )
	if(exp&&exp.length>10){
		exp='getmatrix('+exp.split('(')[1];
		var deg=eval(exp);
		if(deg>=0){
			setRotae(deg);
			$('#trun').attr('class','stop');
			var result=opt.id||Math.floor(Math.random()*6);
			setTimeout(function(){
					setRotae(720+(6-result+1)*60);
			},50);
			setTimeout(function(){
				pagedata.runing=0;
                $("#MessgeBox").html( template("wtdshow",opt.info) ).show();
				//$('#trunbutton').html('开始<br>抽奖');
				$('#MainBg').css('background-color',' rgba(0,0,0,0.5)');
			},3600);
		}
	}
}
/*随机设置旋转开始角度|矩阵方式*/
function getmatrix(a,b,c,d,e,f){  
	var aa=Math.round(180*Math.asin(a)/ Math.PI);  
	var bb=Math.round(180*Math.acos(b)/ Math.PI);  
	var cc=Math.round(180*Math.asin(c)/ Math.PI);  
	var dd=Math.round(180*Math.acos(d)/ Math.PI);  
	var deg=0;  
	if(aa==bb||-aa==bb){  
		deg=dd;  
	}else if(-aa+bb==180){  
		deg=180+cc;  
	}else if(aa+bb==180){  
		deg=360-cc||360-dd;  
	}  
   return deg>=360?0:deg;
}