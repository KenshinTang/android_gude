var Root=new function(){
			var t=this;
			window.onmessage = function (e) {
				var d = e.data;
				if(d&&d.m&&window[d.m]){
					var r=window[d.m](d.d);
					if(d.code>0){
						e.source.postMessage({code:d.code,d:r}, "*");
					}
				}
			}
			t.send=function(method,data,ifr){
				var m={
					m:method,
					d:data
				}
				ifr.postMessage(m, "*");
			}
		}