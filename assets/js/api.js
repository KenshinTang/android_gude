/*-------------------------------------------------------------------------------------------*/
//图片加载失败替换图片- - - - - 方
var onerrorImg_square = 'onerror="this.src=\'img/jzsb.png\'" class="bgGoods"'

/*---------------------------------用户基本接口-------------------------------------*/
{
    API_ = ''
}



//拼接Get接口和参数
function appendApi(api, parmas) {
    var string = api || '';
    string = string.length ? (api + '?') : '';
    for (var attr in parmas) {
        var param = attr + '=' + parmas[attr] + '&';
        string += param;
    }
    return string;
}

//将字典中的空值或空字符串的 key-value删除
function skipNullValueKey(params) {
    for (var key in params) {
        if (params[key] == '' || params[key] == null) {
            delete params[key];
        }
    }
    return params;
};

//参数混淆
function confusionParams(params) {
    return params;
}

/*-------------------------------------------------------------------------------------------*/

//分页
var PgInfo = {
    pagesize: 10,
    pageno: 1,
}

function resetPageInfo() {
    PgInfo.pageno = 1;
    PgInfo.pagesize = 20;
}


/*--------------------------------------SLNetwork------------------------------------------------*/
//列表数据加载
/*
* rqType:请求方式 post / get
* apistr:接口短链接
* params:请求参数
* cb:回调函数
* addMore:是否加载更多（ture:加载更多  false:加载第一页或者）
* */

function SLNetwork(rqType, apistr, params, cb, addMore) {
    params = params || {};
    var newParms = params;
    if (!newParms.pagesize) {
        newParms.pagesize = PgInfo.pagesize;
    }
    var pagesize = params.pagesize;

    if (pagesize > 0) {
        newParms.pagesize = pagesize;
    }
    if (params.pageno > 0) {
        newParms.pageno = params.pageno;
    } else {
        newParms.pageno = PgInfo.pageno;
    }
    params._device = '2';

    // var userinfo = Comm.db('userinfo');
    // if (userinfo) {
    //     if (!params.customerid) {
    //         if (userinfo.customerid) {
    //             params.customerid = userinfo.customerid;
    //         }
    //     }
    // }

    // console.log(newParms);
    // console.log('-------------------------------分割线');
    // console.log('接口名：' + apistr + '\n参数：' + JSON.stringify(params));

    if (rqType == 'post') {
        AJAX.POST(apistr, newParms, function (data) {
            nslog('-----------------------------------------------------完成请求');
            nslog('接口名：' + apistr + '\n返回数据|||');
            nslog(data);
            if (cb) {
                cb(data)
            }

            if (data.code == 1) {
                if (addMore) {
                    var c = data.curPage * data.pageSize;
                    if (data.totalCount < c) {
                        PgInfo.pageno -= 1;
                    }
                }
            } else {
                PgInfo.pageno = data.curPage;
                checkLoginToken(data);
            }
        });
    }
    else if (rqType == 'get') {
        AJAX.GET(appendApi(apistr, newParms), function (data) {

            nslog('-----------------------------------------------------完成请求');
            nslog('接口名：' + apistr + '\n返回数据');
            nslog(data);
            if (cb) {
                cb(data)
            }

            if (data.code == 1) {
                if (addMore) {
                    var c = data.curPage * data.pageSize;
                    if (data.totalCount < c) {
                        PgInfo.pageno -= 1;
                    }
                }
            } else {
                PgInfo.pageno = data.curPage;
                checkLoginToken(data);
            }
        });
    } else {
        console.log('rqType不正确');
    }
}


function checkLoginToken(data) {

    if (data.code == 110) {
        return;
    }
}


function nslog(text) {
    console.log(text);
}


/*
*公用验证类
*如需扩展对应验证， 在reg对象内添加对应验证规则即可
* 111
*  1加input属性 data-reg='m',  m == 对应reg正则；
*  2加input属性 name =‘phone’ 或 data-type='phone',  'phone' == 设置成对应ajax参数属性 （注：未设置input的name属性此项直接跳过）
*  3选填 data-nocheck='true'; 如果有 此属性 则跳过此项验证
*调用方式1）单个验证触发 需结合事件绑定对应标签 onblur="Check.check(this)"
 调用方式2）批量验证 Check.submit('GET/POST')" 验证全部通过返回参数值，验证有误返回false；
*/
var Check = (function (g) {
    var inputArr = {}; //保存返回内容
    var falg = false; //初始状态
    var reg = {
        empty: {
            t: '请输入必填项',
            e: /^[/[\S]+/
        },
        m: {
            t: '手机号码格式错误',
            e: /^1\d{10}$/
        },
        m2: {
            t: '推荐码格式错误（上级手机号）',
            e: /^1\d{10}$/
        },
        p: {
            t: '密码格式错误（6-16位）字母或者数字',
            e: /^[a-zA-Z0-9]{6,16}$/,
        },
        c: {
            t: '验证码格式错误(6位)',
            e: /^\d{6}$/
        },
        length4: {
            t: '位数错误（4-20位）',
            e: /^.{4,20}$/
        },
        required: {
            t: '必填项',
            e: /^.{1,999}$/
        },
        money: {
            t: '价格格式错误',
            e: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,8})?$)/
        },
        amount: {
            t: '数量格式错误',
            e: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,8})?$)/
        },
        bankac: {
            t: '位数错误（10-20位）',
            e: /^.{10,20}$/
        },
        email: {
            t: '邮箱格式错误',
            e: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        },
        nz: {
            t: '请输入正整数',
            e: /^\d+$/
        },
        nzfloat: {
            t: '请输入正确数字',
            e: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
        },
        rn: {
            t: '请输入正确姓名',
            e: /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/
        },
        cd: {
            t: '请输入正确身份证号',
            e: /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
        },
        bcd: {
            t: '请输入正确银行卡号',
            e: /^([1-9]{1})(\d{14,18})$/
        },
        nickName: {
            t: '昵称请输入字母、数字或中文',
            e: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
        },
        money: {
            t: '金额应是数字或小数点后两位以内的小数',
            e: /^\d+(\.\d{0,2})?$/
        },

    }
    //g.reg = reg // 挂在Comm对象上去
    return new function () {
        this.reg = reg;
        //验证方法 【需使用事件绑定绑定对应html标签】
        //批量验证调用this.sub0mit('POST')方法 返回 验证通过的对应参数；
        this.check = function (t, e) {
            var _t = t.dataset['reg']; //需验证
            var nocheck = t.dataset['nocheck']; // nocheck ==‘true’跳过验证
            if (typeof nocheck == "string" && nocheck == "true") {
                return true;
            } else {
                if (_t && _t != "") {
                    var regs = _t.split(' ');
                    for (var i = 0; i < regs.length; i++) {
                        if (regs[i] != "") {
                            if (!regfun(regs[i])) {
                                return false;
                            }
                        }
                    }
                } else {
                    //验证通过
                    t.dataset['iserror'] = 1;
                    return true;
                }

                function regfun(v) {

                    var regs = reg.p.e;
                    var aa =  regs.test(t.value);

                    var bb  = reg[v]['e'].test(t.value);

                    if (!bb && !aa) {
                        //验证错误
                        if (e) {
                            var placeholder = t.getAttribute('placeholder');
                            if (placeholder != undefined && placeholder != "" && placeholder != null && v == "empty") {
                            } else {
                                Comm.message(reg[v]['t']);
                            }
                        }
                        t.dataset['iserror'] = 0;
                        return false;
                    } else {
                        //验证通过
                        t.dataset['iserror'] = 1;
                        return true;
                    }
                }

            }
        }
        //验证状态 ,返回元素数组
        this.st = function () {
            var _this = this;
            inputArr['okay'] = [];
            inputArr['iserror'] = [];
            //对应的每个值
            $.each($('input[name],textarea[name]'), function (i, e) {
                var v = e.value;
                var k = e.name || $(e).data('type');
                //返回保存的数据
                //var arr = [];
                //验证每个带name属性的input
                _this.check(e);
                var kv = new Array;
                if (k) {
                    kv.push(k, v);
                };
                //失败的
                if (e.dataset['iserror'] == "0" && (e.dataset['nocheck'] == "false" || e.dataset['nocheck'] == undefined)) {
                    inputArr['iserror'].push(e); //验证失败的DOM
                } else {
                    inputArr['okay'].push(kv); //验证通过的
                }
            })
            return inputArr;
        }
        //返回初始状态
        this.stDefault = function () {
            return falg;
        };
        this.stDefault.msg = '请填写完整信息';

        //提交数据前步骤 { 验证 + 格式化参数 }
        this.submit = function (action) {
            //falg = true; //重置初始状态
            /*if (!this.stDefault()) {
                Comm.message(this.stDefault.msg);
                return false;
            }*/

            var arr = this.st();
            var errorObj = arr['iserror']; //错误的HtmlDom
            var dataArr = arr['okay']; //返回保存的数据
            var opt = null; //存ajax参数
            //格式化参数
            function optFormat(_opt) {
                $.each(dataArr, function (i, e) {
                    if (typeof _opt == 'object') {
                        _opt[e[0]] = e[1];
                    } else {
                        _opt += ('&' + e[0] + '=' + e[1]);
                    }
                });
                return _opt;
            }
            nslog(optFormat(opt = {}));

            if (arr['iserror'].length > 0) { //检查是否有验证错误未通过
                this.check(errorObj[0], true);
                return false;
            } else if (action == 'POST' || action == 'post') {
                //post格式参数
                opt = optFormat(opt = {});
            } else {
                // 默认 get格式参数
                opt = optFormat(opt = '');
            }
            return opt;
        }

        this.getParms = function () {

            var Parms = {};
            //对应的每个值
            $.each($('input[name],textarea[name]'), function (i, e) {
                var v = e.value;
                var k = e.name || $(e).data('type');
                Parms[k] = v;
            })

            logText(Parms);
            return Parms;
        }




    }
}(window['']));


/*--------------------------------------network------------------------------------------------*/

/*

<script id="" type="text/html">

//循环
{{each $data as model i}}
{{/each}}


//条件判断
{{if model.face}}
    <img src={{model.face}} alt="">
{{else}}
    <img src="img/tempIcon/banner.png" alt="">
{{/if}}

</script>




var list = data.data;
var html = template('banner_id', list);
document.getElementById('list_id_banner').innerHTML = html;

*/

function network() {
    var params = {}
    SLNetwork('get/post', API_, params, function (data) {
        if (data.code == 1) {
            nslog(data);
        } else {
            // Comm.message(data.msg);
        }
    });
}

function getListElementWithArr_TT(arr) {

    var list = '';
    for (var i = 0; arr && arr.length > 0 && i < arr.length; i++) {
        list += '';
    }
    return list;
}

function dealWith() {
    var arr = [];
    for (var i = 0; i < arr.length; i++) {
        var model = arr[i];
    }
}


var SLValid = new function (str) {

    this.isValidCode = function (str) {
        var pattern = /^\d{6}$/;
        return pattern.test(str);
    };

    this.isValidPassword = function (str) {
        var pattern = /^[a-zA-Z0-9]{6,16}$/;
        return pattern.test(str);
    };


    this.isValidText = function (str) {

        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

        if(regEn.test(str) || regCn.test(str)) {
            return false;
        }
        return true;
    };





    this.isValidName = function (str) {
        var pattern = /[A-Za-z0-9_\-\u4e00-\u9fa5]+/;
        return pattern.test(str);
    };

    this.isValidTel = function (str) {
        var pattern = /0?(13|14|15|18|17)[0-9]{9}/;
        return pattern.test(str);
    };

    this.isValidEmail = function (str) {
        var pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
        return (pattern.test(str));
    }

    this.isValidIDcard = function (str) {
        var pattern = /\d{17}[\d|x]|\d{15}/;
        return pattern.test(str);
    };

    this.isValid_ = function (str) {
        var pattern = /正则表达式/;
        return pattern.test(str);
    };

}



/*☄↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓（）↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓☄*/


/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑（）↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/





