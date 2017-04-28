(function () {

    $(document).on("click", ".tableSort th", function () {
        sortTable($(this));//������
        watchIconnave();//�����������ȱ仯
    });

    //�Ա������
    function sortTable($thisTH) {
        var tableObject, tbHeadTh, tbBody, tbBodyTr, tableClass, sortState, thisIndex, dataType;
        dataType = $thisTH.attr("type"); //��ȡ��ǰ����е� type

        if (dataType == "nosort") {//�����������ִ�в���
            return false;
        }
        tableObject = $thisTH.parents('.tableSort');//��ȡidΪtableSort��table����
        tbHeadTh = tableObject.children('thead').find('tr th');//��ȡthead�µ�tr�µ�th
        tbBody = tableObject.children('tbody');//��ȡtable�����µ�tbody
        tbBodyTr = tbBody.find('tr');//��ȡtbody�µ�tr
        tableClass = checkundefined(tableObject.attr("class")).match(/tableNum_[0-9]+/);

        if (!tableClass) {//û�����class�ͷų�ʼֵtrs��window  ��һ�����
            tableObject.find("thead th[type!='nosort']").append("<span class='iconsort'><i class='iconfont icon-arrowup'></i><i class='iconfont icon-arrowdown'></i></span>");
            var random = Math.round(Math.random() * 1000000);
            tableObject.addClass("tableNum_" + random);
            tableClass = "tableNum_" + random;
            window["tableNum_" + random] = tbBodyTr;

            //����dom�ı�
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

        sortState = checkundefined($thisTH.attr("_sortType")).match(/headerSortDown|headerSortUp|sortNo/) || "sortNo";//�õ���ǰ��ͷ��class
        $thisTH.siblings().attr("_sortType","");

        thisIndex = tbHeadTh.index($thisTH);//��ȡth���ڵ��к�

        var trsValue = new Array();  //����һ���µ��б�
        tbBodyTr.each(function () { //�������е�tr��ǩ
            var tds = $(this).find('td');//�������е� td ��ǩ
            //����ǰ�ĵ���� push ��һ���µ��б���
            //���� ��ǰ�е� ���͡���ǰ������ ֵ���͵�ǰ�е�ֵ
            var tdText=$(tds[thisIndex]).text();
            var tdDateText=$(tds[thisIndex]).data("date");
            trsValue.push(dataType + ".separator" + ("date"==dataType?tdDateText:tdText) + ".separator" + $(this).prop("outerHTML"));
        });
        var len = trsValue.length;//��ȡ����Ҫ��Ϸ���еĳ���
        if (sortState == "headerSortDown") {//  ��Ϊ����ʱ
            trsValue.reverse();//???
            $thisTH.attr("_sortType","headerSortUp");
            $("." + tableClass).find("tbody").empty();
            for (var i = 0; i < len; i++) {//ѭ������������ֵ
                $("." + tableClass).find("tbody").append(trsValue[i].split(".separator")[2]);
            }

            //��ʾ����� $("#406").contents().filter(function(){ return this.nodeType==3;}).text()
            var $sortresult=tableObject.parents(".tableSortParent").find(".sort-result");
            $sortresult.removeClass("dn").data("index",thisIndex).data("type",dataType).data("table",tableClass).find(".result-name").text("����");
            $sortresult.find(".result-value").text($thisTH.find("[class*='th-']").text());

        } else if (sortState == "sortNo") {//��δ����ʱ

            $thisTH.attr("_sortType","headerSortDown");
            trsValue=sortArray(dataType,trsValue);//����
            $("." + tableClass).find("tbody").empty();
            for (var i = 0; i < len; i++) {//ѭ������������ֵ
                $("." + tableClass).find("tbody").append(trsValue[i].split(".separator")[2]);
            }

            //��ʾ�����
            var $sortresult=tableObject.parents(".tableSortParent").find(".sort-result");
            $sortresult.removeClass("dn").data("index",thisIndex).data("type",dataType).data("table",tableClass).find(".result-name").text("����");
            $sortresult.find(".result-value").text($thisTH.find("[class*='th-']").text());

        } else if (sortState == "headerSortUp") {//��Ϊ����ʱ

            tbBody.empty().append(window[tableClass]);
            $thisTH.attr("_sortType","sortNo");

            //���ؽ����
            tableObject.parents(".tableSortParent").find(".sort-result").addClass("dn");
        }
    }

    //��������ɾ��
    $(".sort-result").on("click",".btn-close-result",function(){
        var $this=$(this).parent();
        var table=$this.data("table");
        $("."+table).find("tbody").empty().append(window[table]).end().find("thead").find("th").eq($this.data("index")).attr("_sortType","sortNo");

        $this.addClass("dn");

        //�����Ƿ�Ӧ����ʾǰһ����һ��������ť
        watchIconnave();
    });

    //IPת������ ����������
    function ip2int(ip) {
        var num = 0;
        ip = ip.split(".");
        //Number() �����Ѷ����ֵת��Ϊ���֡�
        num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
        return num;
    }

    //��������Դ table tableclass
    $.fn.updateTable=function(){
        $(".allcheck,#allcheck").prop("checked",false);//�����ȫѡ����Ϊ��ѡ��
        var $table=$(this);
        var tableObject, tbBody, tbBodyTr, tableClass, sortState, thisIndex, dataType;

        tableClass = checkundefined($table.attr("class")).match(/tableNum_[0-9]+/);
        if (!tableClass) {//û�����class��
            return false;
        }

        tableObject = $table;//��ȡidΪtableSort��table����
        thisIndex=$table.parents(".tableSortParent").find(".sort-result").data("index");//��ȡth���ڵ��к�
        var $thisTH=$table.find("thead").find("th").eq($table.parents(".tableSortParent").find(".sort-result").data("index"));
        dataType = $thisTH.attr("type"); //��ȡ��ǰ����е� type
        tbBody = tableObject.children('tbody');//��ȡtable�����µ�tbody
        tbBodyTr = tbBody.find('tr');//��ȡtbody�µ�tr
        window[tableClass]=tbBodyTr;

        sortState = checkundefined($thisTH.attr("_sortType")).match(/headerSortDown|headerSortUp|sortNo/) || "sortNo";//�õ���ǰ��ͷ��class
        $thisTH.siblings().attr("_sortType","");

        var trsValue = new Array();  //����һ���µ��б�
        tbBodyTr.each(function () { //�������е�tr��ǩ
            var tds = $(this).find('td');//�������е� td ��ǩ
            //����ǰ�ĵ���� push ��һ���µ��б���
            //���� ��ǰ�е� ���͡���ǰ������ ֵ���͵�ǰ�е�ֵ
            var tdText=$(tds[thisIndex]).text();
            var tdDateText=$(tds[thisIndex]).data("date");
            trsValue.push(dataType + ".separator" + ("date"==dataType?tdDateText:tdText) + ".separator" + $(this).prop("outerHTML"));
        });
        var len = trsValue.length;//��ȡ����Ҫ��Ϸ���еĳ���
        if (sortState == "headerSortUp") {//  ��Ϊ����ʱ
            trsValue=sortArray(dataType,trsValue);
            trsValue.reverse();
            $("." + tableClass).find("tbody").empty();
            for (var i = 0; i < len; i++) {//ѭ������������ֵ
                $("." + tableClass).find("tbody").append(trsValue[i].split(".separator")[2]);
            }

        } else if (sortState == "headerSortDown") {//��Ϊ����ʱ
            trsValue=sortArray(dataType,trsValue);
            $("." + tableClass).find("tbody").empty();
            for (var i = 0; i < len; i++) {//ѭ������������ֵ
                $("." + tableClass).find("tbody").append(trsValue[i].split(".separator")[2]);
            }
        }
    };

    //�����Ķ�����list����
    $.fn.sortList=function(obj){
        var defObj={
            "class":null,
            "dataType":"string",
            "sortType":"up"
        };
        $.extend(defObj,obj);
        var dataClass=defObj.class;//�����Ԫ��Class (��д�����õ�һԪ�ص�����)
        var dataType=defObj.dataType;//������������� number date ip string(Ĭ��string)
        var sortType=defObj.sortType;//����ķ�ʽ up down(Ĭ��Ϊup)

        //���������õ�����
        var $listParent=$(this);
        var listValue = new Array();  //����һ���µ��б�
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

        //����
        listValue=sortArray(dataType,listValue);
        if("down"==sortType){
            listValue.reverse();
        }
        $listParent.empty();
        for(var i=0;i<listValue.length;i++){
            $listParent.append(listValue[i].split(".separator")[2]);
        }
    };

    //���������� dataType��������� trsValue���������
    function sortArray(dataType,trsValue){
        var len=trsValue.length;
        for (var i = 0; i < len; i++) {//�������е���
            for (var j = i + 1; j < len; j++) {
                var value1 = trsValue[i].split(".separator")[1];//��ǰֵ
                var value2 = trsValue[j].split(".separator")[1];//��ǰֵ����һ��
                if (dataType == "number") {
                    //js ��Ԫ����  ��� values1 ���� '' ���գ� ��ô����ֵ��Ϊ0������ ��ֵΪ��ǰֵ
                    value1 = value1 == "" ? 0 : value1;
                    value2 = value2 == "" ? 0 : value2;
                    if (parseFloat(value1) > parseFloat(value2)) {//�����ǰֵ ���� ��һ��ֵ
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
                    //JavaScript localeCompare() ���� �ñ����ض���˳�����Ƚ������ַ�����
                    if (value1.localeCompare(value2) > 0) {//�÷��������ݹȸ������
                        var temp = trsValue[j];
                        trsValue[j] = trsValue[i];
                        trsValue[i] = temp;
                        var valueTemp=value1;
                        value1=value2;
                        value2=valueTemp;
                    }
                    //�Զ�ʶ��number����
                    value1 = value1 == "" ? 0 : value1;
                    value2 = value2 == "" ? 0 : value2;
                    if (parseFloat(value1) > parseFloat(value2)) {//�����ǰֵ ���� ��һ��ֵ
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