function weeklyCalendar(dataArr, options, showData) {
    var that = this,
        _date = new Date(),
        currentDay = _date.getDay(),
        currentAPM = _date.getHours() >= 12 ? 1 : 0;
        weekNum = $("#id_week_title").attr("ids");
    that.dataArr = dataArr;
    that.options = options;

    var description = {
        firstTitle: '观看直播',
        nextTitle: '下载讲义',
        listTitle: '讲义列表',
        methodsTitle: '下载'
    }
    var format = function (num) {
        var _f = num < 10 ? '0' + num : num;
        return _f
    }

    var createWeek = function () {
        var lis = '';
        var weeks_ch = ['&nbsp;','周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        for (var i = 0, len = weeks_ch.length; i < len; i++) {

            if (i == 0){
                lis += '<div class="flex15">\n' +
                    '                <li>'+weeks_ch[i]+'</li>\n' +
                    '                <li class="dayTime">&nbsp;</li>\n' +
                    '            </div>';
            } else {
                lis += '<div>\n' +
                    '                <li>'+weeks_ch[i]+'</li>\n' +
                    '                <li class="dayTime'+(i-1)+'"></li>\n' +
                    '            </div>';
            }

        }
        ;
        $("#weekUl").html(lis);
    }
    var countTime = function (n) {
        var getTime = _date.getTime() + (24 * 60 * 60 * 1000) * n;
        var needDate = new Date(getTime);
        var getYear = needDate.getFullYear();
        var getMonth = needDate.getMonth() + 1;
        var getDate = needDate.getDate();
        var obj = {
            'year': getYear,
            'month': getMonth,
            'date': getDate
        };
        return obj
    }
    var createDate = function (cDay) {
        var _cDay = cDay;
        var dateHtml = '';
        var currY = format(_date.getFullYear()),
            currM = format(_date.getMonth() + 1),
            currD = format(_date.getDate());

        // dateHtml += '<section class="flex15">'
        //     + '<ul class="optionsU f10">'
        //     + '<li class="center bg_white">\n' +
        //     '        <div>上午</div>\n' +
        //     '        <div>'+options.apm.am+'</div>\n' +
        //     '    </li>\n' +
        //     '    <li class="center bg_white">\n' +
        //     '        <p>下午</p>\n' +
        //     '        <p>'+options.apm.pm+'</p>\n' +
        //     '    </li>'
        //     + '</ul>'
        //     + '</section>';

        dateHtml += '<section class="flex15">'
            + '<ul class="optionsU f10">'
            + '<li class="center bg_white">\n' +
            '        <div>'+options.apm.am+'AM</div>\n' +
            '    </li>\n' +
            '    <li class="center bg_white">\n' +
            '        <p>'+options.apm.pm+'PM</p>\n' +
            '    </li>'
            + '</ul>'
            + '</section>';




        for (var i = _cDay; i < _cDay + 7; i++) {
            var dday = format(countTime(i).date);
            var idx = (i-cDay)%7;
            var sel = '.dayTime'+idx;
            $(sel).text(dday);

            // debugger
            if (currY == countTime(i).year && currM == countTime(i).month && currD == countTime(i).date) {
                dateHtml += '<section data-year=' + countTime(i).year + ' data-month=' + countTime(i).month + ' data-date=' + countTime(i).date + ' data-weekD=' + idx + '>'
                    + '<ul class="optionsUl" data-year=' + countTime(i).year + ' data-month=' + countTime(i).month + ' data-date=' + countTime(i).date + '>'
                    + '</ul>'
                    + '</section>';
            } else {
                dateHtml += '<section data-year=' + countTime(i).year + ' data-month=' + countTime(i).month + ' data-date=' + countTime(i).date  + ' data-weekD=' + idx + '>'
                    + '<ul class="optionsUl" data-year=' + countTime(i).year + ' data-month=' + countTime(i).month + ' data-date=' + countTime(i).date + '>'
                    + '</ul>'
                    + '</section>'
            }
        }
        $("#calendarBox").html(dateHtml);
        reminder();
    }

    var reminder = function () {
        var optionsUl = $(".optionsUl");

        var currentNYR = app.formatDate(new Date());

        $.each(optionsUl, function (index, element) {
            var optionsHtml = '';
            var $element = $(element);
            var ele_year = format($element.attr('data-year')),
                ele_month = format($element.attr('data-month')),
                ele_date = format($element.attr('data-date'));

            var skip = false;

            $.each(that.dataArr, function (ind, ele) {

                var show_date = ele.date.split('-');
                if (ele_year == show_date[0] && ele_month == show_date[1] && ele_date == show_date[2]) {
                    $element.prev().addClass("active");
                    $.each(ele.items, function (_index, _ele) {


                        // debugger
                        //status 0 不能约  1 可以约  2已满
                        //是否可预约
                        if (_ele.status == 0 || (currentNYR == _ele.day && currentAPM == 1 && _index == 0)){
                            optionsHtml += '<li class="flex_center bg_white">'
                                + '<p>' + '' + '</p>';
                        } else if (_ele.status == 1){
                            optionsHtml += '<li class="flex_center bg_theme col_white canOrder" dayType="'+_index+'" onclick="itemClicked(this)">'
                                + '<p class="f10">' + '预约' + '</p>';
                        } else if (_ele.status == 2){
                            optionsHtml += '<li class="flex_center bg_lgray col_gray">'
                                + '<p>' + '已满' + '</p>';
                        }
                        console.log(_ele.status);

                        if (showData) {
                            optionsHtml += '<article>'
                                + '<a href="javascript:void(0)">' + description.firstTitle + '</a>'
                                + '<a href="javascript:void(0)" onclick="downListShow(this)">' + description.nextTitle + '</a>'
                                + '</article>'
                                + '<div class="down_list" onclick="downListHide(this)">'
                                + '<div class="down_list_c" onclick="stopmp()">'
                                + '<h1>' + description.listTitle + '</h1>'
                                + '<div class="jy_list">'
                            $.each(_ele.downList, function (index_, element_) {
                                optionsHtml += '<p>' + element_.downName + '<a data-address="' + element_.downAddress + '" href="javascript:void(0)">' + description.methodsTitle + '</a></p>'
                            })
                            optionsHtml += '</div>'
                                + '<h5 onclick="closeDownList(this)"></h5>'
                        }
                        optionsHtml += '</li>'
                    })
                    skip = true;

                    return true
                }
            })
            if (!skip){
                optionsHtml += '<li class="flex_center bg_white">'
                    + '<p>' + '' + '</p></li>';
                optionsHtml += '<li class="flex_center bg_white">'
                    + '<p>' + '' + '</p></li>';
            }


            $(element).html(optionsHtml);
        })
    }
    var changeWeek = function (weekNum) {

        var _cDay = -currentDay + (7 * weekNum);

        var firstDay = format(countTime(_cDay).year) + '-' + format(countTime(_cDay).month) + '-' + format(countTime(_cDay).date);

        options['changeWeek'](firstDay);

        var firstDay = createDate(-currentDay + (7 * weekNum));
        $("#id_week_title").attr("ids", weekNum);
        titleTime();
    }

    $("#prevWeek").on("click", function () {
        weekNum--;
        changeWeek(weekNum);
    })
    $("#nextWeek").on("click", function () {
        weekNum++;
        changeWeek(weekNum);
    })
    var titleTime = function () {
        var section = $("#calendarBox").find("section");
        var titleHtml = '';
        titleHtml += format($(section[1]).attr('data-month')) + '月' + format($(section[1]).attr('data-date')) + '日 - '
            + format($(section[7]).attr('data-month')) + '月' + format($(section[7]).attr('data-date')) + '日';
        $("#showDate").html(titleHtml);
    }
    $("#calendarBox").on("click", "h2", function () {
        var textDate = $(this).text();
        $(this).addClass("select");
        $(this).parent().siblings().find('h2').removeClass("select");
        options['clickDate'](textDate);
    })
    var initWeeklyCalendar = function () {
        createWeek();
        createDate(-currentDay);
        titleTime();
    }();
    $(".jy_list").on("click", "a", function () {
        options['clickDownLoad'](this);
    })




    that.initWeeklyCalendar = function () {
        createWeek();
        createDate(-currentDay + (7 * weekNum));
        titleTime();
    };



    return that;
}

function downListShow(that) {
    that.parentNode.parentNode.getElementsByClassName('down_list')[0].style.display = "block";
}

function downListHide(that) {
    that.style.display = "none";
}

function closeDownList(that) {
    that.parentNode.parentNode.style.display = "none";
}

function stopmp(e) {
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
}


function itemClicked(that,dayType){
    var element = that.parentNode.parentNode;
    var ele_year = $(element).attr('data-year'),
        ele_month = $(element).attr('data-month'),
        ele_date = $(element).attr('data-date'),
        ele_weekD = $(element).attr('data-weekd');
    // debugger


    $('.canOrder').removeClass('active');
    $(that).addClass('active');

    var type = parseInt($(that).attr('dayType'));
    console.log(dayType == 1 ? '下午' : '上午');

    var date = ele_year + '-' + ele_month + '-' + ele_date;

    this.options['chooseDayTime'](date,type,ele_weekD);


}

