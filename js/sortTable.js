(function () {

    $(document).on("click", ".tableSort th", function () {
        sortTable($(this));//表排序
        watchIconnave();//监听结果条宽度变化
    });

    //对表格排序
    function sortTable($thisTH) {
        var tableObject, tbHeadTh, tbBody, tbBodyTr, tableClass, sortState, thisIndex, dataType;
        dataType = $thisTH.attr("type"); //获取当前点击列的 type

        if (dataType == "nosort") {//如果不排序则不执行操作
            return false;
        }
        tableObject = $thisTH.parents('.tableSort');//获取id为tableSort的table对象
        tbHeadTh = tableObject.children('thead').find('tr th');//获取thead下的tr下的th
        tbBody = tableObject.children('tbody');//获取table对象下的tbody
        tbBodyTr = tbBody.find('tr');//获取tbody下的tr
        tableClass = checkundefined(tableObject.attr("class")).match(/tableNum_[0-9]+/);

        if (!tableClass) {//没有随机class就放初始值trs进window  第一点击列
            tableObject.find("thead th[type!='nosort']").append("<span class='iconsort'><i class='iconfont icon-arrowup'></i><i class='iconfont icon-arrowdown'></i></span>");
            var random = Math.round(Math.random() * 1000000);
            tableObject.addClass("tableNum_" + random);
            tableClass = "tableNum_" + random;
            window["tableNum_" + random] = tbBodyTr;

            //监听dom改变
            //var MutationObserver = window.MutationObserver ||
            //    window.WebKitMutationObserver ||
            //    window.MozMutationObserver;
            //var mutationObserverSupport = !!MutationObserver;
            //if(mutationObserverSupport){
            //    var callback = function(records) {
            //        updateTable("."+tableClass);
            //    };
            //    var mo = new MutationObserver(callback);
            //    var option = {
            //        'childList': true,
            //        'subtree': true
            //    };
            //    mo.observe(document.querySelector("."+tableClass+" tbody"), option);
            //}
        }

        sortState = checkundefined($thisTH.attr("_sortType")).match(/headerSortDown|headerSortUp|sortNo/) || "sortNo";//得到当前列头的class
        $thisTH.siblings().attr("_sortType","");

        thisIndex = tbHeadTh.index($thisTH);//获取th所在的列号

        var trsValue = new Array();  //创建一个新的列表
        tbBodyTr.each(function () { //遍历所有的tr标签
            var tds = $(this).find('td');//查找所有的 td 标签
            //将当前的点击列 push 到一个新的列表中
            //包括 当前行的 类型、当前索引的 值，和当前行的值
            var tdText=$(tds[thisIndex]).text();
            var tdDateText=$(tds[thisIndex]).data("date");
            trsValue.push(dataType + ".separator" + ("date"==dataType?tdDateText:tdText) + ".separator" + $(this).prop("outerHTML"));
        });
        var len = trsValue.length;//获取所有要拍戏的列的长度
        if (sortState == "headerSortDown") {//  当为升序时
            trsValue.reverse();//???
            $thisTH.attr("_sortType","headerSortUp");
            $("." + tableClass).find("tbody").empty();
            for (var i = 0; i < len; i++) {//循环放入排序后的值
                $("." + tableClass).find("tbody").append(trsValue[i].split(".separator")[2]);
            }

            //显示结果条 $("#406").contents().filter(function(){ return this.nodeType==3;}).text()
            var $sortresult=tableObject.parents(".tableSortParent").find(".sort-result");
            $sortresult.removeClass("dn").data("index",thisIndex).data("type",dataType).data("table",tableClass).find(".result-name").text("降序");
            $sortresult.find(".result-value").text($thisTH.find("[class*='th-']").text());

        } else if (sortState == "sortNo") {//当未排序时

            $thisTH.attr("_sortType","headerSortDown");
            trsValue=sortArray(dataType,trsValue);//排序
            $("." + tableClass).find("tbody").empty();
            for (var i = 0; i < len; i++) {//循环放入排序后的值
                $("." + tableClass).find("tbody").append(trsValue[i].split(".separator")[2]);
            }

            //显示结果条
            var $sortresult=tableObject.parents(".tableSortParent").find(".sort-result");
            $sortresult.removeClass("dn").data("index",thisIndex).data("type",dataType).data("table",tableClass).find(".result-name").text("升序");
            $sortresult.find(".result-value").text($thisTH.find("[class*='th-']").text());

        } else if (sortState == "headerSortUp") {//当为降序时

            tbBody.empty().append(window[tableClass]);
            $thisTH.attr("_sortType","sortNo");

            //隐藏结果条
            tableObject.parents(".tableSortParent").find(".sort-result").addClass("dn");
        }
    }

    //排序结果条删除
    $(".sort-result").on("click",".btn-close-result",function(){
        var $this=$(this).parent();
        var table=$this.data("table");
        $("."+table).find("tbody").empty().append(window[table]).end().find("thead").find("th").eq($this.data("index")).attr("_sortType","sortNo");

        $this.addClass("dn");

        //监听是否应该显示前一个后一个操作按钮
        watchIconnave();
    });

    //IP转成整型 ？？？？？
    function ip2int(ip) {
        var num = 0;
        ip = ip.split(".");
        //Number() 函数把对象的值转换为数字。
        num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
        return num;
    }

    //更新数据源 table tableclass
    $.fn.updateTable=function(){
        $(".allcheck,#allcheck").prop("checked",false);//将表格全选设置为不选中
        var $table=$(this);
        var tableObject, tbBody, tbBodyTr, tableClass, sortState, thisIndex, dataType;

        tableClass = checkundefined($table.attr("class")).match(/tableNum_[0-9]+/);
        if (!tableClass) {//没有随机class就
            return false;
        }

        tableObject = $table;//获取id为tableSort的table对象
        thisIndex=$table.parents(".tableSortParent").find(".sort-result").data("index");//获取th所在的列号
        var $thisTH=$table.find("thead").find("th").eq($table.parents(".tableSortParent").find(".sort-result").data("index"));
        dataType = $thisTH.attr("type"); //获取当前点击列的 type
        tbBody = tableObject.children('tbody');//获取table对象下的tbody
        tbBodyTr = tbBody.find('tr');//获取tbody下的tr
        window[tableClass]=tbBodyTr;

        sortState = checkundefined($thisTH.attr("_sortType")).match(/headerSortDown|headerSortUp|sortNo/) || "sortNo";//得到当前列头的class
        $thisTH.siblings().attr("_sortType","");

        var trsValue = new Array();  //创建一个新的列表
        tbBodyTr.each(function () { //遍历所有的tr标签
            var tds = $(this).find('td');//查找所有的 td 标签
            //将当前的点击列 push 到一个新的列表中
            //包括 当前行的 类型、当前索引的 值，和当前行的值
            var tdText=$(tds[thisIndex]).text();
            var tdDateText=$(tds[thisIndex]).data("date");
            trsValue.push(dataType + ".separator" + ("date"==dataType?tdDateText:tdText) + ".separator" + $(this).prop("outerHTML"));
        });
        var len = trsValue.length;//获取所有要拍戏的列的长度
        if (sortState == "headerSortUp") {//  当为降序时
            trsValue=sortArray(dataType,trsValue);
            trsValue.reverse();
            $("." + tableClass).find("tbody").empty();
            for (var i = 0; i < len; i++) {//循环放入排序后的值
                $("." + tableClass).find("tbody").append(trsValue[i].split(".separator")[2]);
            }

        } else if (sortState == "headerSortDown") {//当为升序时
            trsValue=sortArray(dataType,trsValue);
            $("." + tableClass).find("tbody").empty();
            for (var i = 0; i < len; i++) {//循环放入排序后的值
                $("." + tableClass).find("tbody").append(trsValue[i].split(".separator")[2]);
            }
        }
    };

    //单纯的对数据list排序
    $.fn.sortList=function(obj){
        var defObj={
            "class":null,
            "dataType":"string",
            "sortType":"up"
        };
        $.extend(defObj,obj);
        var dataClass=defObj.class;//排序的元素Class (不写代表用第一元素的内容)
        var dataType=defObj.dataType;//排序的数据类型 number date ip string(默认string)
        var sortType=defObj.sortType;//排序的方式 up down(默认为up)

        //生成排序用的数据
        var $listParent=$(this);
        var listValue = new Array();  //创建一个新的列表
        $listParent.children().each(function () {
            var $this=$(this);
            var sortData;
            if(!dataClass){
                sortData=$this;
            }else{
                sortData=$this.find("."+dataClass);
            }
            var sortText="";
            if("date"==dataType){
                if(!dataClass){
                    sortText=sortData.text().substr(0,10);
                }else{
                    sortText=sortData.data("date");
                }
            }else{
                sortText=sortData.text().substr(0,10);
            }
            listValue.push(dataType + ".separator" + sortText + ".separator" + $this.prop("outerHTML"));
        });

        //排序
        listValue=sortArray(dataType,listValue);
        if("down"==sortType){
            listValue.reverse();
        }
        $listParent.empty();
        for(var i=0;i<listValue.length;i++){
            $listParent.append(listValue[i].split(".separator")[2]);
        }
    };

    //对数组排序 dataType排序的类型 trsValue排序的数组
    function sortArray(dataType,trsValue){
        var len=trsValue.length;
        for (var i = 0; i < len; i++) {//遍历所有的行
            for (var j = i + 1; j < len; j++) {
                var value1 = trsValue[i].split(".separator")[1];//当前值
                var value2 = trsValue[j].split(".separator")[1];//当前值的下一个
                if (dataType == "number") {
                    //js 三元运算  如果 values1 等于 '' （空） 那么，该值就为0，否则 改值为当前值
                    value1 = value1 == "" ? 0 : value1;
                    value2 = value2 == "" ? 0 : value2;
                    if (parseFloat(value1) > parseFloat(value2)) {//如果当前值 大于 下一个值
                        var temp = trsValue[j];
                        trsValue[j] = trsValue[i];
                        trsValue[i] = temp;
                    }
                } else if (dataType == "ip") {
                    if (ip2int(value1) > ip2int(value2)) {
                        var temp = trsValue[j];
                        trsValue[j] = trsValue[i];
                        trsValue[i] = temp;
                    }
                }else if(dataType == "date"){
                    try {
                        value1 = isNaN(value1) ? value1 : value1 * 1000;
                        value2 = isNaN(value2) ? value2 : value2 * 1000;
                    }catch(e){}
                    if(new Date(value1).getTime() > new Date(value2).getTime()){
                        var temp = trsValue[j];
                        trsValue[j] = trsValue[i];
                        trsValue[i] = temp;
                    }
                } else {
                    //JavaScript localeCompare() 方法 用本地特定的顺序来比较两个字符串。
                    if (value1.localeCompare(value2) > 0) {//该方法不兼容谷歌浏览器
                        var temp = trsValue[j];
                        trsValue[j] = trsValue[i];
                        trsValue[i] = temp;
                        var valueTemp=value1;
                        value1=value2;
                        value2=valueTemp;
                    }
                    //自动识别number类型
                    value1 = value1 == "" ? 0 : value1;
                    value2 = value2 == "" ? 0 : value2;
                    if (parseFloat(value1) > parseFloat(value2)) {//如果当前值 大于 下一个值
                        var temp = trsValue[j];
                        trsValue[j] = trsValue[i];
                        trsValue[i] = temp;
                    }
                }
            }
        }
        return trsValue;
    }
})();