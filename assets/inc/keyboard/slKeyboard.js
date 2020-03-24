
/*
* 数字输入键盘 更新时间
* 石磊
* 最新修改
* 1.2019-06-26 6:18
* */


var SLKeyBoard = function (keyBoxId,contentId,isKeyBoardPoint) {

    if (!contentId){
        console.log('没有设置容器 contentId');
        return;
    }

    var that = this;
    this.isKeyBoardPoint = isKeyBoardPoint ? isKeyBoardPoint : false;//默认为false 表示number
    this.contentId = contentId;
    this.id = keyBoxId;

    this.maxIntegerLength = 9;
    this.maxPointLength = 2;
    this.holderText = '请输入';
    this.textChangedBlock = null;


    if (contentId) {
        this.contentEle = $('#' + this.contentId);
    }


    this.init = function () {
        var keyBoardHtml = '\n' +
            '<div class="numb_box bg_keyboard" style="display: none;">\n' +
            '                <div class="xiaq_tb" style="background-color: #f5f5f5;">\n' +
            '                    <img src="inc/keyboard/jftc_14.jpg" height="10">\n' +
            '                </div>\n' +
            '                <ul class="nub_ggg">\n' +
            '                    <li><a href="javascript:void(0);" class="zf_num">1</a></li>\n' +
            '                    <li><a href="javascript:void(0);" class="zj_x zf_num">2</a></li>\n' +
            '                    <li><a href="javascript:void(0);" class="zf_num">3</a></li>\n' +
            '                    <li><a href="javascript:void(0);" class="zf_num">4</a></li>\n' +
            '                    <li><a href="javascript:void(0);" class="zj_x zf_num">5</a></li>\n' +
            '                    <li><a href="javascript:void(0);" class="zf_num">6</a></li>\n' +
            '                    <li><a href="javascript:void(0);" class="zf_num">7</a></li>\n' +
            '                    <li><a href="javascript:void(0);" class="zj_x zf_num">8</a></li>\n' +
            '                    <li><a href="javascript:void(0);" class="zf_num">9</a></li>\n';

        if (this.isKeyBoardPoint) {
            keyBoardHtml += '<li><a href="javascript:void(0);" class="zf_num zf_point">.</a></li>\n';
        } else {
            keyBoardHtml += '<li><a href="javascript:void(0);" class="zf_empty">清空</a></li>\n';
        }

        keyBoardHtml += '\n' +
            '                    <li><a href="javascript:void(0);" class="zj_x zf_num">0</a></li>\n' +
            '                    <li><a href="javascript:void(0);" class="zf_del">删除</a></li>\n' +
            '                </ul>\n' +
            '            </div>\n' +
            '            <div class="hbbj"></div>';


        $('#' + keyBoxId).html(keyBoardHtml);


        var keyBoardSel = '#' + this.id + ' .numb_box';
        this.keyBoardSel = keyBoardSel;






        $(function () {
            setPlaceHolderText();
            that.dissmissKeyBoard = function () {
                $(that.keyBoardSel).slideUp(300);
            }

            that.showKeyBoard = function () {
                var text = $(that.contentEle).text();
                that.len = text.length || 0;
                if (text == that.holderText){
                    that.len = 0;
                }
                $('.numb_box').slideUp(300);
                setTimeout(function () {
                    $(that.keyBoardSel).slideDown(300);
                },100);
            }

            //数字显示隐藏
            var dismissSel = '#' + that.id + ' .xiaq_tb';
            $(dismissSel).click(function () {
                that.dissmissKeyBoard();
            });


            //点击键盘按钮
            that.len = 0;
            $('#' + that.id + " .nub_ggg li .zf_num").click(function () {

                event.stopPropagation();

                if (that.len < that.maxIntegerLength) {
                    var inText = $(this).text();
                    var basic = $(that.contentEle).text();

                    if (basic == that.holderText){
                        basic = '';
                    }

                    var arr = basic.split('.')||[];

                    if (arr.length == 2) {
                        var pointStr = arr[1];
                        if (inText == '.'){
                            return;
                        } else if (pointStr.length >= that.maxPointLength){
                            return;
                        }
                    }

                    basic += (inText);
                    $(that.contentEle).text(basic);
                    that.len++;
                    console.log(basic);
                    that.textChangedBlock&&that.textChangedBlock(basic);

                    if (that.len == that.maxIntegerLength) {
                        setTimeout(function () {
                            console.log('最大了');
                        }, 100);
                    };
                }


            });

            //删除
            $('#' + that.id + " .nub_ggg li .zf_del").click(function () {
                event.stopPropagation();
                if (that.len > 0) {
                    var basic = $(that.contentEle).text();
                    if (basic && basic.length) {
                        basic = basic.substr(0, basic.length - 1);
                        $(that.contentEle).text(basic);
                        that.textChangedBlock&&that.textChangedBlock(basic);
                    }
                    that.len--;
                    if (that.len <= 0){
                        setPlaceHolderText();
                    }
                    console.log(basic);
                }
            });

            //清空
            $('#' + that.id + " .nub_ggg li .zf_empty").click(function () {
                event.stopPropagation();
                $('#' + that.contentId).text('');
                that.textChangedBlock&&that.textChangedBlock(0);
                that.len = 0;
                setPlaceHolderText();
            });


            function setPlaceHolderText() {
                $(that.contentEle).text(that.holderText);
            }

        });
    }

    /*init*/


};









