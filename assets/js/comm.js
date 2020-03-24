var config = {

    // root: 'https://47.106.151.133/gude/',
    root: 'https://drgoodchina.cn/gude/',
    // root: 'http://192.168.0.136:8080/',

    webroot: "", //网址地址(调试模式下的地址前缀)
    base: '', //线上
    baseimg: '', //线上
    isTest: false,
    SLTest: false,

    SLShareBase: 'http://drgoodchina.cn/gude_share/',

    ossroot: 'http://gddoctor.oss-cn-chengdu.aliyuncs.com/',
    // appOss: '/common/oss/app/getUploadToken',
    appOss: '/api/imgupload/app/getUploadToken',

    pagesize: 10,
    appName: '全民瓜分',
    notDeal: false,

    noNetGetData: true
}


{
    (function () {
        if (location.href.indexOf('192.168') > -1 || Comm.db('BD') > 1) {
            config.isTest = true;
            config.SLTest = true;
        }
    })();
}


var UserJWD = new function () {
    var tempJwd = {
        lat:'30.632531',
        lng:'104.044401',
        dis:'金牛区',
        aid:'510106',
    };

    // tempJwd = {
    //     lat:'30.67',
    //     lng:'104.07',
    //     dis:'武侯区',
    //     aid:'510107',
    // };

    this.lng = function () {
        var JWD = this.JWD();
        return JWD.lng || tempJwd.lng;
    }

    this.lat = function () {
        var JWD = this.JWD();
        return JWD.lat || tempJwd.lat;
    }

    this.dis = function () {
        var JWD = this.JWD();
        return JWD.dis || tempJwd.dis;
    }

    this.curdis = function () {
        var JWD = this.JWD();
        return JWD.curdis || tempJwd.dis;
    }

    this.aid = function () {
        var JWD = this.JWD();

        if (JWD.aid == '++') {
            return '';
        }

        return JWD.aid || tempJwd.aid;
    }

    this.hasGetPosition = function () {
        var JWD = this.JWD();
        if (JWD.code == 1) {
            return true;
        }
        return false;
    }

    this.saveJWDValue = function (obj) {
        var areaM = areaFindAid(obj);
        if (areaM) {
            obj.aid = areaM.i;
        }
        Comm.db('JWD', obj);
    }

    this.updateJWDValue = function (obj) {
        var JWD = this.JWD();

        JWD.lat = obj.lat;
        JWD.lng = obj.lng;
        JWD.curdis = obj.dis;

        var areaM = areaFindAid(obj,JWD);
        if (areaM) {
            JWD.aid = areaM.i;
        } else {
            JWD.aid = this.aid();
        }
        Comm.db('JWD', JWD);
    }

    this.JWD = function () {
        var JWD = Comm.db('JWD') || {};
        // JWD.lat = 30.632531;
        // JWD.lng = 104.044401;
        return JWD;
    }


    function areaFindAid(areaModel,j) {

        var pro = areaModel.pro;
        var city = areaModel.city;
        var dis = areaModel.dis;

        if (Area){
            var plist = Area._d||[];

            for (var i = 0; i <plist.length ; i++) {

                var p = plist[i];
                if (pro.indexOf(p.s)>-1||p.s.indexOf(pro)>-1){
                    var clist = p.children||[];

                    for (var j = 0; j <clist.length ; j++) {
                        var c = clist[j];
                        if (city.indexOf(c.s) > -1 || c.s.indexOf(city) > -1) {


                            var dlist = c.children||[];
                            for (var k = 0; k <dlist.length ; k++) {
                                var d = dlist[k];
                                if (dis.indexOf(d.s) > -1 || d.s.indexOf(dis) > -1) {
                                    return d;
                                }
                            }

                            return c;
                        }
                    }

                    return p;
                }
            }
        }

        return UserJWD.JWD();
    }

    function findArea(list,name) {
        for (var i = 0; i <list.length ; i++) {
            var c = list[i];
            if (city.indexOf(c.s) > -1 || c.s.indexOf(city) > -1) {
                console.log(c);
                return c;
            }
        }
        return {};
    }


    // var EARTH_RADIUS = 6378137.0;    //单位M
    // var PI = Math.PI;
    //
    // function getRad(d){
    //     return d*PI/180.0;
    // }
    //
    // this.getGreatCircleDistance = function(lat1,lng1,lat2,lng2){
    //     var radLat1 = getRad(lat1);
    //     var radLat2 = getRad(lat2);
    //
    //     var a = radLat1 - radLat2;
    //     var b = getRad(lng1) - getRad(lng2);
    //
    //     var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    //     s = s*EARTH_RADIUS;
    //     s = Math.round(s*10000)/10000.0;
    //
    //
    //     return s;
    // }

}

function failReload() {
    Comm.message('请在页面重写 failReload 方法');
}


/*app 公用方法处理器*/
var app = new function () {

    //验证是否登录
    this.isLogin = function () {
        var user = Comm.db('userinfo');
        var token = Comm.db('_token');
        if ((!user || !token)) {
            return false;
        }
        return true;
    };
    //验证是否登录，并且提示登录
    this.needLoginCheck = function (show) {

        if ((!this.isLogin())) {
            if (show == true) {
                Comm.confirm('您还未登录,请先进行登录', function (t) {
                    if (t == 1) {
                        Comm.goLogin();
                    }
                });
            }

            return true;
        }

        return false;
    };

    this.saveUserinfo = function (info, cb) {
        if (!info) {
            Comm.message('缺少用户信息');
            return;
        }
        Comm.db('userinfo', info);
        Comm.db('account', info.phone || '');
        if (info.token) {
            AJAX.setTag(info.token);
            Comm.storageValue('_token', info.token, function () {
                cb && cb();
            });
        }
        return info;
    }

    this.getUserinfo = function () {
        var uinfo = Comm.db('userinfo');
        return uinfo;
    }

    //清除用户数据
    this.clearUserData = function () {
        Comm.db('userinfo', null);
        Comm.db('account', null);
        AJAX.setTag(null);
        Comm.storageValue('_token', null, function () {
        });

        regPush()

    }


    this.loadFail = function (ele, tp) {

        var html = '<div class="flex_center loadFail center mainW">\n' +
            '            <div>\n' +
            '                <div>数据加载失败</div>\n' +
            '                <div class="bg_theme col_white p10 br3 mt10" onclick="failReload &&failReload(' + (tp || 0) + ');">点击重新获取</div>\n' +
            '            </div>\n' +
            '        </div>';
        $(ele).html(html);
    }

    this.loading = function (ele) {
        var html = '<div class="flex_center loading mainW">\n' +
            '            <img src="img/loading.gif" class="w150">\n' +
            '        </div>';
        $(ele).html(html);
    }

    this.loadNoData = function (ele, text) {
        var html = '<div class="flex_center center load_Nodata mainW">\n' +
            '                <div>\n' +
            '                    <div>' + (text ? text : '没有找到数据') + '</div>\n' +
            '                </div>\n' +
            '            </div>';
        $(ele).html(html);
    }


    /*密码框切换显示和关闭*/
    /*o 参数是点击图片*/
    /*调用 app.checkimg(this)*/
    this.checkimg = function (o) {
        if (o.src.indexOf("eye_y") >= 0) {
            o.src = "img/eye_n.png"
            $(o).parent().parent().find("input[type='text']").attr("type", "password")
        } else {
            o.src = "img/eye_y.png"
            $(o).parent().parent().find("input[type='password']").attr("type", "text")
        }
    };

    /*发送验证码公用方法*/
    /*o 点击发送验证码按钮*/
    /*phone 发送短信手机号*/
    /*type 验证码类型*/
    /*imgcode 图片验证码，可不传*/
    /*调用 app.timeCountDown(this,15928877394,1,5421)*/
    //按钮倒计时
    var wait = 60,
        timeCountDownclick = true;
    waitTime = 60;
    wait = waitTime;
    this.timeCountDown = function (o, phone, type, imgcode, cb) {

        {
            var i = setInterval(function () {
                if (wait == 0) {
                    o.removeAttribute("disabled");
                    o.innerText = "重新发送";
                    o.style.color = 'white';
                    o.classList.remove('bg_disable');
                    o.classList.add('bg_trans');
                    wait = 60;
                    clearInterval(i);
                } else {
                    o.style.color = 'black';
                    o.classList.remove('bg_trans');
                    o.classList.add('bg_disable');
                    o.innerText = wait + '秒后重发';
                    // o.style.background = '#E4E4E4';
                    wait--;

                }
            }, 1000);
            o.style.color = 'black';
            // o.style.background = '#E4E4E4';
            o.classList.remove('bg_trans');
            o.classList.add('bg_disable');

        }


        imgcode = imgcode == undefined ? '' : imgcode;
        if (!phone) {
            Comm.message("请输入手机号");
            return;
        }
        var reg = /^1\d{10}$/;
        if (phone && !reg.test(phone)) {
            Comm.message("手机格式错误");
            return;
        }

        if (timeCountDownclick) {
            timeCountDownclick = false;
            o.setAttribute("disabled", true);
            AJAX.GET('/api/customer/getvcode?phone=' + phone + '&vtype=' + type + "&imgcode=" + imgcode, function (d) {
                if (d.code == 1 || d.code == 2) {
                    cb && cb(d.code)
                    Comm.message('短信已发送，请注意查收');
                    var i = setInterval(function () {
                        if (wait == 0) {
                            o.removeAttribute("disabled");
                            o.innerText = "重新发送";
                            o.style.color = 'white';
                            o.classList.remove('bg_disable');
                            o.classList.add('bg_trans');
                            wait = 60;
                            clearInterval(i);
                        } else {
                            o.style.color = 'black';
                            o.classList.remove('bg_trans');
                            o.classList.add('bg_disable');
                            o.innerText = wait + '秒后重发';
                            // o.style.background = '#E4E4E4';
                            wait--;

                        }
                    }, 1000);
                    o.style.color = 'black';
                    // o.style.background = '#E4E4E4';
                    o.classList.remove('bg_trans');
                    o.classList.add('bg_disable');
                } else {
                    o.removeAttribute("disabled");
                    Comm.message(d.msg);
                }
                timeCountDownclick = true;
            });
        }
    };

    /* 去掉字符串首位空格 */
    this.trim = function (s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    };

    //处理时间函数
    this.formatDate = function (timestamp, formats) {
        // formats格式包括
        // 1. Y-m-d
        // 2. Y-m-d H:i:s
        // 3. Y年m月d日
        // 4. Y年m月d日 H时i分
        formats = formats || 'Y-m-d';

        var zero = function (value) {
            if (value < 10) {
                return '0' + value;
            }
            return value;
        };

        if (typeof (timestamp) == typeof ("")) {
            timestamp = timestamp.replace(/-/g, "/").replace(/\.0/g, "")
        }

        var myDate = timestamp ? new Date(timestamp) : new Date();

        var year = myDate.getFullYear();
        var month = zero(myDate.getMonth() + 1);
        var day = zero(myDate.getDate());

        var hour = zero(myDate.getHours());
        var minite = zero(myDate.getMinutes());
        var second = zero(myDate.getSeconds());

        return formats.replace(/Y|m|d|H|i|s/ig, function (matches) {
            return ({
                Y: year,
                m: month,
                d: day,
                H: hour,
                i: minite,
                s: second
            })[matches];
        });
    };

    this.getWeekDay = function (timestamp, formats) {
        formats = formats || 'Y-m-d';
        var zero = function (value) {
            if (value < 10) {
                return '0' + value;
            }
            return value;
        };

        if (typeof (timestamp) == typeof ("")) {
            timestamp = timestamp.replace(/-/g, "/").replace(/\.0/g, "")
        }

        var mydate = timestamp ? new Date(timestamp) : new Date();

        var myddy = mydate.getDay(); //获取存储当前日期
        var weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return weekday[myddy];

    };


    //处理头像加载失败
    this.herrorimg = function (a) {
        a.src = config.baseimg + 'img/head.png';
        $(a).addClass('errorload');
        $(a).removeClass('placeImg');
    };
    this.hUerrorimg = function (a) {
        a.src = 'stIconfile/head_notlogin.png';
        $(a).addClass('errorload');
        $(a).removeClass('placeImg');
    };
    //处理图片加载失败
    this.errorimg = function (a) {
        a.src = config.baseimg + 'img/error.png';
        $(a).addClass('errorload');
        $(a).removeClass('placeImg');
    };
    //验证空字符串
    this.nullReplace = function (str) {
        if (!str || isEmpty(str)) return '';
        return str;
    };

    //合并数组
    this.assign = function (obj1, obj2) {

        var tmp = {};
        for (var i in arguments) {
            for (var key in arguments[i]) {
                tmp[key] = arguments[i][key];
            }
        }
        return tmp;
        ;
    };
    //处理数字工具
    /*
        v:转换的数字
        d:保留的位数
    */
    this.conunm = function (v, d) {
        if (v == undefined) {
            return 0;
        }
        if (v == 0) {
            return v;
        }
        if (d == undefined) {
            d = 3;
        }
        if (v > 10000) {
            return (Number(v) / 10000).toFixed(d) + "万"
        }
        if (v != null && v != "" && v != undefined) {
            if (v.toString().indexOf(".") >= 0) {
                //四舍五入
                return Number(v).toFixed(d);
            } else {
                return v;
            }
        }
    };
    this.price = function (v) {
        if (v == 0) {
            return v;
        }
        if (v != null && v != "" && v != undefined) {
            var f = parseFloat(v);
            var result = Math.round(f * 100) / 10000;
            return result.toFixed(2);
        }
    };

    //获取配置系统信息；
    this.getSys = function (keys, cb) {
        AJAX.GET('/api/config/bykeys?keys=' + keys, function (d) {
            cb && cb(d);
        });
    };

    //获取配置系统信息；
    this.getDictClild = function (pid, cb) {
        AJAX.GET('/api/dict/getlistbypid?pid=' + pid, function (d) {
            cb && cb(d);
        });
    };


    this.bitunencode = function (t, w) { //反解析 位运算的值
        var l = [];
        for (var i = 0; i < w; i++) {
            if (t & Math.round(Math.pow(2, i))) {
                console.log(i + 1)
                l.push(i + 1);
            }
        }
        return l;
    };
    this.bitencode = function (d) {
        //d:[1, 2, 4, 9, 12, 20, 26, 29, 30, 31]; 需要位运算的值
        var t = 0;
        for (var i = 0; i < d.length; i++) {
            t += Math.round(Math.pow(2, d[i] - 1))
            console.log(t)
        }
        return t;
    };
}

//输入框输入格式限制
//tag传入值：'number'(只能输入和粘贴数字)
function inputLimit(tag) {
    var arr = document.querySelectorAll('input[' + tag + ']');
    for (var i = 0; i < arr.length; i++) {
        var inputE = arr[i]
        inputE.oninput = chnu;
        inputE.onafterpaste = chnu;
    }

    function chnu(e) {
        e = (event || e).target;
        e.value = e.value.replace(/\D/g, '');
    }
}

//数组删除扩展
Array.prototype.del = function (n) {
    //n表示第几项，从0开始算起。
    //prototype为对象原型，注意这里为对象增加自定义方法的方法。
    if (n < 0) //如果n<0，则不进行任何操作。
        return this;
    else
        return this.slice(0, n).concat(this.slice(n + 1, this.length));
}

//底部v  Foot.init 渲染
var Foot = new function () {
    var list = [{
        cls: 'tabPage1',
        name: '首页',
        imgName: 'tab',
    },
        {
            cls: 'tabPage2',
            name: '找诊所',
            imgName: 'tab',
        },
        {
            cls: 'tabPage3',
            name: '我的预约',
            imgName: 'tab',
        },
        {
            cls: 'tabPage4',
            name: '我的',
            imgName: 'tab',
        },
    ];

    var user = Comm.db('userinfo');

    this.init = function () {
        // if (Comm.w9()) return;
        Comm.setAndroidHome();
        var oUL = document.createElement('ul');
        var frag = document.createDocumentFragment();
        oUL.className = 'footer-con';

        //判断链接是否存在
        function check(t) {
            return location.href.indexOf(t) >= 0;
        };


        var isclose = 0;
        if (location.href.indexOf('index') > 0) {
            isclose = 1;
        }
        for (var i = 0, l = list.length; i < l; i++) {
            var itemM = list[i];
            var oLi = document.createElement('li');
            oLi.setAttribute('class', 'footer-item ' + itemM.cls + " " + (check(itemM.cls + ".htm") ? 'col_theme' : ''));
            if (itemM.cls == "" || itemM.cls == "tabPage3") {
                oLi.setAttribute('onclick', 'clickedTabbar(\'' + itemM.cls + '.html\')');
            } else {
                oLi.setAttribute('onclick', 'Comm.goself(\'' + itemM.cls + '.html\')');

                // oLi.setAttribute('onclick', 'tabdidselected(\'' + (i+1) + '\')');
            }
            oLi.style.backgroundImage = "url(img/tabbar/" + ((check(itemM.cls + ".html") ? itemM.imgName + '_' + (i + 1) + "_y" : itemM.imgName + '_' + (i + 1) + '_n')) + ".png)"
            oLi.innerHTML = itemM.name;
            frag.appendChild(oLi);
        }
        oUL.appendChild(frag);
        $('.shared').html(oUL);
        Comm.resizeSection();
    }
};

function clickedTabbar(page) {
    if (app.needLoginCheck(true)) return;
    Comm.goself(page);
}


//上拉
//下拉
//请求地址  / 请求类型
//数据返回
//空数据图片 、空数据提示文字、空数据按钮文字 、 空数据按钮事件
//一个主动调用的下拉刷新的事件
function MERefresh(selector, meConfig) {

    var t = this;

    var refreshOption = {
        mescrollId: '', //刷新容器的id----------------------必须
        clearEmptyId: '', //list列表的id----------------------必须

        //下拉刷新配置
        needHeadRefresh: true, //是否支持下拉刷新
        refreshUrl: null, //刷新的接口----------------------必须
        refreshParm: {}, //刷新的参数
        refreshTypeGet: true, //下拉是否为get请求----------------------必须
        refresh_cb: null,

        //上拉加载配置
        needFootRefresh: true, //是否支持上拉加载
        moreUrl: null, //加载更多的接口 -- 如果没有默认为刷新的接口
        moreParm: {}, //上拉加载的参数
        moreTypeGet: true, //上拉是否为get请求
        more_cb: null,
        pagesize: 10,

        //没有数据时的配置
        nodataIcon: 'inc/mescroll/mescroll-empty1.png',
        nodataTip: '抱歉，没有找到相关信息~',
        nodataButtonTex: '点击刷新',
        nodataClicked: function (d) { //点击按钮的回调,默认null
            t.MeRefScroll.triggerDownScroll();
        },
        hasHeadRefCb: false,
        hasfootRefCb: false,
        getNum: 0,
    };
    //合并参数 json 
    refreshOption = app.assign(refreshOption, meConfig);

    //ajax 
    function SLNetwork(rqType, apistr, params, cb, addMore) {
        var newParms = params;
        var PgInfo = {
            pagesize: 10,
            pageno: 1
        };

        if (params.pagesize > 0) {
            newParms.pagesize = params.pagesize;
        } else {
            newParms.pagesize = PgInfo.pagesize;
        }
        if (params.pageno > 0) {
            newParms.pageno = params.pageno;
        } else {
            newParms.pageno = PgInfo.pageno;
        }

        if (rqType == 'post') {
            AJAX.POST(apistr, newParms, function (data) {
                data.data = data.data || null;
                if (cb) {
                    cb(data);
                }
                if (data.code == 1 && addMore) {
                    if (newParms.pagesize * newParms.pageno >= data.totalCount) {
                        newParms.pageno -= 1;
                    }
                } else {
                    newParms.pageno = data.curPage;
                }
            });
        } else if (rqType == 'get') {
            AJAX.GET(appendApi(apistr, newParms), function (data) {
                if (cb) {
                    cb(data)
                }
                if (data.code == 1 && addMore) {
                    if (newParms.pagesize * newParms.pageno >= data.totalCount) {
                        newParms.pageno -= 1;
                    }
                } else {
                    newParms.pageno = data.curPage;
                }
            });
        }
    }

    //initScroll
    function initMeScroll(mescrollId, clearEmptyId) {
        var opt = t.refreshOption;
        opt.hasHeadRefCb = opt.refresh_cb ? true : false;
        opt.hasHeadRef = opt.more_cb ? true : false;

        opt.clearEmptyId = clearEmptyId || opt.clearEmptyId;
        opt.mescrollId = mescrollId || opt.mescrollId;

        opt.nodataTip = opt.nodataTip ? opt.nodataTip : '抱歉，没有找到相关信息~';
        opt.nodataButtonTex = opt.nodataButtonTex ? opt.nodataButtonTex : '点击刷新';
        opt.btnClick = opt.btnClick || function () { //点击按钮的回调,默认null
            mescroll.triggerDownScroll()
        };


        var optionParm = {
            //下拉刷新的所有配置项
            down: {
                use: opt.needHeadRefresh, //是否初始化下拉刷新; 默认true
                callback: refreshFunction,
                offset: 60, //触发刷新的距离,默认80
                auto: false,
                autoShowLoading: true,

                outOffsetRate: 0.2, //超过指定距离范围外时,改变下拉区域高度比例;值小于1且越接近0,越往下拉高度变化越小;
                bottomOffset: 20, //当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
                minAngle: 45, //向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
                hardwareClass: "mescroll-hardware", //硬件加速样式;解决iOS下拉因隐藏进度条而闪屏的问题,参见mescroll.css
            },
            //上拉加载的所有配置项
            up: {
                // isLock: true,
                use: opt.needFootRefresh, //是否初始化上拉加载; 默认true
                auto: opt.needFootRefresh ? true : false, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认true
                callback: moreFunction, //上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: opt.pagesize, //每页数据条数
                    time: null //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
                },
                empty: {
                    icon: opt.nodataIcon, //图标,默认null
                    tip: opt.nodataTip, //提示
                    //btntext: opt.nodataButtonTex, //按钮,默认""
                    //btnClick: opt.btnClick,
                },

                clearId: opt.clearEmptyId, //加载第一页时需清空数据的列表id; 如果此项有值,将不使用clearEmptyId的值;
                clearEmptyId: opt.clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法,默认null;
                noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                offset: 60, //离底部的距离
                isBounce: false, //是否允许ios的bounce回弹;默认true,允许回弹; 此处配置为false,可解决微信,QQ,Safari等等iOS浏览器列表顶部下拉和底部上拉露出浏览器灰色背景和卡顿2秒的问题
                lazyLoad: {
                    use: true, // 是否开启懒加载,默认false
                    attr: 'imgurl', // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
                    showClass: 'mescroll-lazy-in', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
                    delay: 500, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
                    offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
                }
            }
        }

        if (!t.refreshOption.refresh_cb && !t.refreshOption.refresh_cb_doNothing) {
            optionParm.down = null;
        }
        var mescroll = new MeScroll(opt.mescrollId, optionParm);
        t.MeRefScroll = mescroll;
        return mescroll;
    }

    t.refreshOption = refreshOption;
    var _selector = selector ? selector.split(',') : ''; //Document element元素 
    t.configurationDone = (typeof _selector == 'object') ? initMeScroll(_selector[0], _selector[1]) : function initRefresh(mescrollId, clearEmptyId) {
        initMeScroll(mescrollId, clearEmptyId);
    }
    //刷新调用
    t.refreshFunction = refreshFunction;
    t.downRefresh = function () {
        t.MeRefScroll.optUp.page.num = 1;
        t.MeRefScroll.triggerDownScroll();
    }

    function refreshFunction() {
        console.log('——————————————————————————————————————————————————————刷新');

        if ((!t.refreshOption.refresh_cb && !t.refreshOption.more_cb) || t.refreshOption.refresh_cb_doNothing) {
            setTimeout(function () {
                // t.MeRefScroll.endErr();
                merefresh.endRefresh();
                t.refreshOption.refresh_cb_doNothing && t.refreshOption.refresh_cb_doNothing();
            }, 400);
            return;
        }
        console.log('准备调用刷新的请求');
        var pageParams = {};
        pageParams.pageno = 1;
        pageParams.curpage = 1;
        pageParams.pagesize = t.refreshOption.pagesize;
        t.MeRefScroll.optUp.page.num = 1;

        var netType = t.refreshOption.refreshTypeGet ? 'get' : 'post';
        var netApi = t.refreshOption.refreshUrl;
        var netParms = t.refreshOption.refreshParm;

        var newNetParms = app.assign(netParms, pageParams); //合并两个对象


        if (config && config.noNetGetData && (!t.refreshOption.refreshUrl || !t.refreshOption.refreshUrl.length)) {
            var niseiData = {
                code: 1,
                data: [{}, {}],
                msg: '模拟获取数据成功',
                pageSize: t.refreshOption.getNum ? t.refreshOption.getNum : 2,
                totalCount: 10,
            };

            var ddd = [];
            for (var i = 0; i < (t.refreshOption.getNum ? t.refreshOption.getNum : 2); i++) {
                ddd.push({});
            }
            niseiData.data = ddd;

            setTimeout(function () {
                t.refreshOption.refresh_cb && t.refreshOption.refresh_cb(t, niseiData);
            }, 500);


            return;
        }


        SLNetwork(netType, netApi, newNetParms, function (data) {
            console.log('完成刷新的请求');
            if (!data.data) {
                data.data = [];
            }
            if (data.code == 1) {
                t.refreshOption.refresh_cb && t.refreshOption.refresh_cb(t, data);
                // t.MeRefScroll.resetUpScroll();
            } else {
                t.refreshOption.refresh_cb(t, data);
                //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                t.MeRefScroll.endErr();
            }
        });

    }

    //加载更多调用
    function moreFunction(page, d, v) {
        console.log('——————————————————————————————————————————————————————加载更多');

        if (!t.refreshOption.refresh_cb && !t.refreshOption.more_cb) {
            setTimeout(function () {
                t.MeRefScroll.endErr();
            }, 300)
            return;
        }
        console.log('准备调用 <加载> 的请求');
        var pageParams = {};
        pageParams.pageno = page.num || 1;
        pageParams.curpage = page.num || 1;
        pageParams.pagesize = t.refreshOption.pagesize;
        var netType = (t.refreshOption.moreUrl && t.refreshOption.moreUrl.length) ? (t.refreshOption.moreTypeGet ? 'get' : 'post') : (t.refreshOption.refreshTypeGet ? 'get' : 'post');
        var netApi = t.refreshOption.moreUrl || t.refreshOption.refreshUrl || '';

        var netParms = (t.refreshOption.moreUrl && t.refreshOption.moreUrl.length) ? t.refreshOption.moreParm : t.refreshOption.refreshParm;

        var newNetParms = app.assign(netParms, pageParams); //合并两个对象


        if (config && config.noNetGetData && (!t.refreshOption.refreshUrl || !t.refreshOption.refreshUrl.length)) {

            var niseiData = {
                code: 1,
                data: [{}, {}],
                msg: '模拟获取数据成功',
                pageSize: 2,
                totalCount: 10,
            };

            var ddd = [];
            for (var i = 0; i < (t.refreshOption.getNum ? t.refreshOption.getNum : 2); i++) {
                ddd.push({});
            }
            niseiData.data = ddd;


            setTimeout(function () {
                t.refreshOption.refresh_cb && t.refreshOption.refresh_cb(t, niseiData);
            }, 500);


            return;
        }


        SLNetwork(netType, netApi, newNetParms, function (data) {
            console.log('完成调用 <加载> 的请求');

            if (data.code == 1) {

                if (data.curPage == 1) {
                    t.refreshOption.temptotalCount = data.totalCount
                } else {
                    data.totalCount = t.refreshOption.temptotalCount;
                }
                if (t.refreshOption.more_cb) {
                    t.refreshOption.more_cb(t, data);
                } else if (t.refreshOption.refresh_cb) {
                    t.refreshOption.refresh_cb(t, data);
                }
            } else {
                data.data = [];
                t.refreshOption.refresh_cb(t, data);
                //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                t.MeRefScroll.endErr();
            }
        }, true);
    }

    //完成刷新和加载动作
    t.endRefresh = function endRefresh() {
        //结束下拉刷新和上拉加载
        t.MeRefScroll.endErr();
    }

    function receiveNew(listHtml) {
        var listQuery = '#' + t.refreshOption.clearEmptyId;
        $(listQuery).append(listHtml);
    }

    t.appendHtml = function (contentHtml) {
        receiveNew(contentHtml);
    }

    t.successEndRef = function (curCount, totleCount) {
        t.MeRefScroll.endBySize(curCount, totleCount); //必传参数(当前页的数据个数, 总数据量)
    }

    return t;
}

/*MeRefScroll End*/

var marr = [];
var times = 1;
var nextbc = null;

function next(t, id) {
    if (isNaN(t.value)) {
        t.value = "";
        return;
    }
    if (t.value.length == 1) {
        if (t.nextElementSibling) {
            t.nextElementSibling.focus();
        }
        marr.push(t.value);
    }

    if (t.value.length == 0) {
        if (t.previousElementSibling) {
            t.previousElementSibling.focus();
        }
        marr.pop();
        console.log(marr.join(""));
    }
    if (marr.length == 6) {
        t.blur();
        var psw = marr.join("");
        //h回调函数
        var _rid = (Comm.db('userinfo').roleid + 1);
        nextbc && nextbc('', _rid, psw);
    }
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
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>大链盟项目sl添加

//点击li（.class） 下的 b(.class) 执行cb回调
//在cb回调里面进行点击操作
function clickList(li, b, cb) {
    var sel = li + ' ' + b;
    if (li && b) {
        $(sel).unbind("click").die("click").undelegate("click").click(function () {
            if (cb) {
                var index = $(sel).index(this);
                cb(this, index);
            }
        })
    } else if (b) {
        $(b).unbind("click").die("click").undelegate("click").click(function () {
            if (cb) {
                var index = $(sel).index(this);
                cb(this, index);
            }
        });
    }
}

function unBind(sel) {
    $(sel).bind("click").die("click").undelegate("click");
}


//多个选项 点击某一个后为选中 其他为为选中
function meauChooseClick(li, b, cb, sidx) {
    clickList(li, b, function (o, index) {
        var d = li + ' ' + b;
        // $(d).removeClass('active');

        $(o).parent().find(b).removeClass('active');
        $(o).addClass('active');
        if (cb) {
            cb(o, index);
        }
    });
}

function checkBoxChoose(li, b, cb, sidx) {
    clickList(li, b, function (o, index) {
        var d = li + ' ' + b;
        if ($(o).hasClass('active')) {
            $(o).removeClass('active');
        } else {
            $(o).addClass('active');
        }

        if (cb) {
            cb(o, index);
        }
    });
}

//转2位小数
function $to2(v, len) {
    len = len || 2;
    //return parseFloat(num).toFixed(2);
    if (v == 0) {
        return parseFloat(v).toFixed(2);
    }
    if (v != null && v != "" && v != undefined) {
        return parseFloat(v).toFixed(2);
    }
}


Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


//***********************************************************************
function debugAlert(m) {
    if (config.SLTest) {
        Comm.alert(JSON.stringify(m));
    }

}

versionJS();

function versionJS() {
    var arr = $('script');
    for (var i = 0; arr && i < arr.length; i++) {
        var sriptE = arr[i];
        var ss = sriptE.src.split('?');
        var date = new Date;
        var timespan = date.getTime();
        sriptE.src = ss[0] + '?' + timespan;
        console.log(sriptE.src);
    }
}


function selfblur() {
    document.activeElement.blur();
}


function share() {
    pageShare();
}

function pageShare(des, page, img) {

    var url = config.SLShareBase + page;
    var picUrl = config.SLShareBase + 'img/appLogoIcon.png';

    var shareModel = {
        pic: picUrl,
        title: '古德博士',
        desc: '古德博士Des',
        url: url,
    };


    console.log(shareModel.url);
    Comm.shareUrl(shareModel, function (d) {
        if (d && d.code == 1) {
            Comm.message('分享成功！');
        }
    });
}

function regPush() {

    if (Comm.w9()) {
        var type = 0;
        if (Comm.ios()) {
            type = 2;
        } else {
            type = 1;
        }
        //注册推送
        Comm.registerPush({
            state: 1,
            devicetype: type,
            token: Comm.db('_token'),
            url: config.root + '/api/customer/device'
        }, function (e) {
        });
    }
}


function exitToken(cb) {
    var params = {
        devicetoken: '',
        devicetype: Comm.ios() ? '2' : '1'
    }

    AJAX.POST("/api/customer/device", params, function (data) {
        cb && cb();
    });
}


function exitToken(cb) {
    var params = {
        devicetoken: '',
        devicetype: Comm.ios() ? '2' : '1'
    }

    AJAX.POST("/api/customer/bingDeviceInfo", params, function (data) {
        cb && cb();
    });
}


function iosTime(time) {
    return time.replace(/-/g, '/');
}


function regPrice(money) {
    var reg = /^\d+(\.\d{0,2})?$/;
    var right = reg.test(money)
    if (!right) {
        Comm.message('金额请输入数字或小数，小数点后最多两位');
    }
    return right;
}

function logText(msg) {
    console.log('👿👿👿👿👿👿👿👿👿👿');
    console.log(msg);
    console.log('👿👿👿👿👿👿👿👿👿👿');
}


//处理输入框中的内容 防止代码注入
function DealInputText(text) {
    return text;
}

//将元转化为分
function moneyFen(p) {
    return Math.round(p * 100);
}

function timeReplace(time) {
    time = time.replace(/-/g, "/").replace(/\.0/g, "")
    return time;
}


/*************显示广告详情*************/
function showAdver(aid, type, adId) {

    if (type == 1) {
        Comm.go('clinicDetails.html?cid=' + aid);
    } else if (type == 2) {
        Comm.go('docDetail.html?did=' + aid);
    } else if (type == 3) { //百科文章  取itemid
        Comm.go('artical.html?type=1&aid=' + aid);
    } else if (type == 4) { //自己编写的文章  adverid
        Comm.go('artical.html?type=4&aid=' + adId);
    }

}


//扫码付款
function scanCode() {
    var userinfo = Comm.db('userinfo');
    if (app.needLoginCheck(true)) return;
    Comm.scanf(function (a) {
        if (a) {
            if (a && a.length) {
                var str = a;

                var arr = str.split('-GD-') || [];

                if (arr && arr.length == 4) {
                    var key = arr[1];
                    var name = arr[2];
                    Comm.go('scanSuccess.html?key=' + key + '&name=' + name);
                } else {
                    Comm.message('不能识别的二维码');
                }

                // var subL = 3;
                // var prestr = str.substr(0,subL);
                // var endstr = str.substr(str.length - subL,subL);
                //
                // if (prestr == endstr && prestr == 'GD-'){
                //     var getKey = str.replace(/GD-/g,'');
                //     Comm.go('scanSuccess.html?key='+getKey);
                // }

            } else {
                Comm.message('不能识别的二维码');
            }
        } else {
            Comm.message('不能识别的二维码');
        }
    });
}


/*************比较时间先后*************/
//
function checkDays(t2, t1) {
    if (t1 && t2) {
        var days = datedifference(t1, t2);
        return days;
    }
    return 0;
}

//比较两个时间
function datedifference(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式
    var dateSpan,
        tempDate,
        iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = (dateSpan); //Math.abs
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
};

/*************比较时间先后*************/


function validPrice(value) {
    var reg = /^\d+(\.\d{0,2})?$/;

    return reg.test(value);
}


//筛选出小数数字
function filterFloat(value) {
    if (/^\-?([0-9]+(\.[0-9]+)?|Infinity)$/
        .test(value))
        return Number(value);
    return -1;
}


/**************************************** 以下是小石头的代码-删除的话请询问 ********************************************/


/* 使用格式
       调用方式 dealStar('.starMark');
       <div class="starMark" star="4.3"></div>
      */
function dealStar(starQuery, width, space, num, full) {
    var arr = $(starQuery);
    arr.forEach(function (ele, idx) {

        $(ele).addClass('flex_start');

        var point = $(ele).attr('star');
        var fullStar = parseInt(point);
        var halfStarPer = Math.round(point % 1 * 100);
        var w = width || 10;
        var sp = space || 5;
        var n = num || 5;

        var mainW = w * n + sp * (n - 1);
        ele.style.width = mainW;


        $(ele).empty();



        console.log(halfStarPer);
        for (var i = 0; i < n; i++) {

            if (i < fullStar) {
                $(ele).append('<div class="baseStar star_full" idx="' + i + '" style="width: ' + w + 'px;height: ' + w + 'px;margin-right: ' + (i == n - 1 ? '0' : sp) + 'px;"></div>');
            } else if (i == fullStar && halfStarPer > 0) {
                var hStrEle = '<div class="baseStar star_defalt relative" style="width: ' + w + 'px;height: ' + w + 'px;margin-right: ' + (i == n - 1 ? '0' : sp) + 'px;">\n' +
                    '        <div class="baseStar star_full halfStar" style="width: ' + halfStarPer + '%;height: ' + w + 'px;margin-right: ' + (i == n - 1 ? '0' : sp) + 'px;background-size: ' + w + 'px ' + w + 'px;"></div>\n' +
                    '    </div>';
                $(ele).append(hStrEle);
            } else {
                $(ele).append('<div class="baseStar star_defalt" style="width: ' + w + 'px;height: ' + w + 'px;margin-right: ' + (i == n - 1 ? '0' : sp) + 'px;"></div>');
            }

        }
    });
}


//将list处理成{}
/*
 *   用keyWord作为key将数据保存到对象中
 * */
function dealListWithModel(list, keyWord, backModel) {
    var model = backModel || {};
    if (list && list.length) {
        list.forEach(function (a) {
            if (!a) return;
            model[a[keyWord]] = a;
        });
    }
    return model;
}


//预防重复点击
var repeadModel = {};

function preventRepeadClickDeal(cb, code, time) {

    //if false 直接返回
    //else true 延迟1s
    var clickType = repeadModel[code] || 0;


    switch (clickType) {
        case 0: { //第一次触发、或间隔一段时间后的第一次触发该时间
            repeadModel[code] = 1;
            cb && cb();
            setTimeout(function () {
                repeadModel[code] = 0;
            }, time || 1000);
            return;
        }
            break;
        case 1: { //
            return;
        }
            break;
        case 2: { //

        }
            break;

        default:
            break;

    }
}


/*****************************************************************************/

var RPageKey = 'refreshPagesModel';

//添加需要刷新的页面
function addNeedRefPage(needRefPage, data) {
    var refreshPages = Comm.db(RPageKey) || {};

    var page = needRefPage || '';
    var dataModel = {};
    dataModel.code = 1;
    dataModel.data = data || {};
    refreshPages[page] = dataModel;

    Comm.db(RPageKey, refreshPages);
}

//删除需要刷新的页面记录
function deleteNeedRefPage(page) {
    var refreshPages = Comm.db(RPageKey) || {};

    var dataModel = refreshPages[page] || {};
    if (dataModel.code == 1) {
        delete refreshPages[page];
    }

    Comm.db(RPageKey, refreshPages);
}

//检查当前页面是否需要刷新
function checkNeedRefreshPage(cb) {
    var curPage = location.href;

    var str = curPage.split('.html')[0];
    var arr = str.split('/');
    var curPage = arr[arr.length - 1];

    var refreshPages = Comm.db(RPageKey) || {};


    var dataModel = refreshPages[curPage] || {};
    if (dataModel.code == 1) {
        deleteNeedRefPage(curPage);
        cb && cb(dataModel.data);
    }

    nslog(curPage);
}

/*****************************************************************************/

/*
 *图片浏览器
 *  showImgId:图片img 容器的id
 * */
function addPhotoBroswer(showImgId) {
    var imgs = document.getElementById(showImgId);

    if (ImageView) {
        ImageView.show({
            pattern: 'default',
            selector: 'img',
            initDisplaySize: 'contain',
            initDisplayPositionX: 'center',
            initDisplayPositionY: 'center',
        });
    }
}


//显示类似协议文章的弹框（本页显示不跳转）
function showArticalAlert(title, content) {
    var aa = $('body .articalAlert');
    if (aa && aa.length) {

    } else {
        var html = '<div wtd="articalWindow" class="articalAlert">\n' +
            '\n' +
            '    <div class="alertFrame bg_lgray br5 center">\n' +
            '\n' +
            '        <div class="alertTt lh50 f18 bottomBorder bg_white">' + title + '</div>\n' +
            '\n' +
            '        <div class="alertContent p10 bg_white">' + content + '</div>\n' +
            '\n' +
            '        <div class="tab">\n' +
            '            <div class="bg_trans col_white center lh50 f18" onclick="Comm.showWindow()">关闭\n' +
            '            </div>\n' +
            '        </div>\n' +
            '\n' +
            '    </div>\n' +
            '\n' +
            '</div>';
        $('body').append(html)
    }

    Comm.showWindow('articalWindow');
}




//收藏、取消收藏
function collectionClicked(ele, itemId, itemtype, cb) {
    if (app.needLoginCheck(true)) return;
    preventRepeadClickDeal(function () {

        var collectId = $(ele).attr('cid');
        var isActive = $(ele).hasClass('active');
        var params = {
            itemid: itemId,
            itemtype: itemtype, //1-诊所 2-医生 3-百科
            cuscollectid: collectId,
        }

        var api = '';
        if (isActive) {
            api = '/api/collect/discollect'; //取消收藏
        } else {
            api = '/api/collect/collect'; //收藏
        }

        SLNetwork('post', api, params, function (data) {
            if (data.code == 1) {
                var collectionId = data.data || '';
                setIsFav(!isActive, ele, collectionId);
                // cb&&cb(data.data||null);
            } else {
                Comm.message(data.msg);
            }
        });
    }, 1);
}

//设置是否收藏
function setIsFav(isFav, ele, cid) {
    if (isFav) {
        $(ele).addClass('active');
    } else {
        $(ele).removeClass('active');
    }
    $(ele).attr('cid', cid);
}

//检查并设置收藏状态
function checkIsCollection(ele, itemId, itemtype) {
    // if (app.needLoginCheck(true)) return;
    var tempUserInfo = Comm.db('userinfo') || {};
    var params = {
        itemid: itemId,
        itemtype: itemtype, //1-诊所 2-医生 3-百科
        customerid: tempUserInfo.customerid || '',
    }
    if (itemId == -1) {
        return;
    }
    SLNetwork('post', '/api/collect/hascollect', params, function (data) {
        if (data.code == 1) {
            var m = data.data || {};
            var collectionId = m.cuscollectid || '';
            var isActive = m.hascuscollect || false;
            setIsFav(isActive, ele, collectionId);
        } else {
            Comm.message(data.msg);
        }
    });
}


//处理可预约时间表数据
function dealNetData(dataArr) {

    var newList = [];
    var tempDict = {};
    dataArr.forEach(function (ele, idx) {
        var index = parseInt(idx / 2);
        var indCount = idx % 2;
        if (indCount == 0) {
            tempDict = {
                date: ele.day,
                items: []
            };
        }
        tempDict.items.push(ele);
        if (indCount == 1) {
            newList.push(tempDict);
        }
        console.log(index + '__' + indCount);
    });

    console.log(newList);
    return newList;
}


function getStarDes(star) {
    var s = star || 0;

    //五颗星 ：非常满意  四颗星  ：满意  三颗星： 一般   二颗星：不满意   一颗星：  非常不满意

    if (s <= 1) {
        return '非常不满意';
    } else if (s > 1 && s <= 2) {
        return '不满意';
    } else if (s > 2 && s <= 3) {
        return '一般';
    } else if (s > 3 && s <= 4) {
        return '满意';
    } else if (s > 4 && s <= 5) {
        return '非常满意';
    }
    return '';
}


/*****************************************************************************/


/********************************分享页面页尾*********************************/
function replaceBindClick(qurey, cb) {
    $('section *').unbind('click').removeAttr('onclick').click(function () {
        cb && cb();
    });
}

var footCt = '<div class="flex_start m10" onclick="window.open(\'https://fir.im/Xzs\')">\n' +
    '        <img src="img/appLogoIcon.png" width="50px" alt="">\n' +
    '        <div class="ml10 lh25 flex_between flex1">\n' +
    '            <div class="grow3">古德博士,我更懂你</div>\n' +
    '            <div class="br5 col_white grow2 lh40 center bg_theme">点击下载</div>\n' +
    '        </div>\n' +
    '    </div>';
/*****************************************************************************/