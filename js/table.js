
// Javascript Document
var  orgid=getCookie("orgid"); //��֯id
var  searchvalue;//�ؼ���
var couType=[];//�γ�����
var classifyId=[];//�γ̷���
var COURSE_PAGE_SIZE = 20;  // ÿҳ���صĿγ̵ĸ���
$(function(){


    if(!localStorage.getItem('orgusername')){
        $.ajax({
            url: "/orguser.do?subtime=1&method=getSelfInfo&orgId=" + orgid,
            dataType: "json",
            success: function (data) {
                var result = data['result'];
                localStorage.setItem("orguserid", result.id);
                localStorage.setItem("orgusername", result.name);
            }
        });
    }
    if(localStorage.getItem('orgusername')=='undefined'){
        $.ajax({
            url: "/orguser.do?subtime=1&method=getSelfInfo&orgId=" + orgid,
            dataType: "json",
            success: function (data) {
                var result = data['result'];
                localStorage.setItem("orguserid", result.id);
                localStorage.setItem("orgusername", result.name);
            }
        });
    }

    // course.html ���ʻ�
    $('.i18n-course-title').find('li:first a').html($.i18n.prop('string_resource'));    // ��Դ
    $('.i18n-course-title').find('li:last').html($.i18n.prop('string_courselist')); // �γ��б�
    $('#btn-add-course').html($.i18n.prop('string_addcourse')); // ��ӿγ�
    $('.add-course-single').html($.i18n.prop('string_singleadd'));  // �������
    $('.i18n-batch-addcourse').html($.i18n.prop('string_batchimport')); // ��������.md
    $('.edit').html($.i18n.prop('string_edit'));    // �༭
    $('#btn-more').html($.i18n.prop('string_more'));    // ����
    $('.i18n-more-items').find('li:first a').html($.i18n.prop('string_top'));   // �ö�
    $('.i18n-more-items').find('li:nth-child(2) a').html($.i18n.prop('string_delete')); // ɾ��
    $('.i18n-more-items').find('li:last a').html($.i18n.prop('string_manauthory')); // ������Ȩ

    $('#course-class').find('span').before($.i18n.prop('string_coursesortshort'));  // �γ̷���
    $('.course-class-select').find('li:first a').html($.i18n.prop('string_coursesortshort'));  // �γ̷���

    $('#course-type').find('span').before($.i18n.prop('string_coursetype'));   // �γ�����
    //$('.course-type-select').find('li:first a').html($.i18n.prop('string_coursetype'));   // �γ�����
    //$('.course-type-select').find('li:nth-child(2) a').html($.i18n.prop('string_innerclass'));   //  �ڲ���ѵ��
    //$('.course-type-select').find('li:nth-child(3) a').html($.i18n.prop('string_broughtinnerclass'));    // �����ѵ��
    //$('.course-type-select').find('li:last a').html($.i18n.prop('string_expatriateclass'));    // ���ɹ�����

    $('.i18n-course-thead').find('th:nth-child(2) .th-coursename').text($.i18n.prop('string_coursenameshort')); // �γ�����
    $('.i18n-course-thead').find('th:nth-child(3) .th-courseclass').text($.i18n.prop('string_coursesortshort')); // �γ̷���
    $('.i18n-course-thead').find('th:nth-child(4) .th-coursetime').text($.i18n.prop('string_classdurationshort')); // �γ�ʱ��
    $('.i18n-course-thead').find('th:last .th-coursetype').text($.i18n.prop('string_coursetypeshort')); // �γ�����

    $('.i18n-delselectedcourse-title').html($.i18n.prop('string_delselectedcourse'));   // �Ƿ�ɾ����ѡ�γ�
    $('.suredel').html($.i18n.prop('string_delete'));   // ɾ��
    $('.closedel').html($.i18n.prop('string_cancel'));  //��ȡ��
    $('.i18n-addadmin-title').html($.i18n.prop('string_addadmin'));    // ��Ȩ����Ա
    $('.tomanager').html($.i18n.prop('string_sure'));   // ȷ��

    initialize();
    getcourse();
    add(orgid,3);//���ù���Ա
    // ��������
    $(".myscroll").scroll(function () {
        var pageDone = ($('#target').attr('data-size') != $("#target").attr("data-count"));
        if (checkscrollDiv($(this)) && pageDone) {
            $('#target').attr('data-size', '-1'); // ��ֹ�ظ�����
            getcourse();
        }
    });

    //�õ��γ̷���
    $.ajax({
        url:"/course.do?subtime=1&method=getCourseClassify&orgId="+ orgid ,
        dataType:"json",
        success:function(data){
            var result=data['result'];
            var h=[];
            $.each(result,function(i,value){
                h.push("<li><label class='checkbox-inline'><input type='checkbox' name='class-input' id='", value.id ,"'>", value.name ,"</label></li>");
            });
            $(".filter-class").append(h.join(""));
        }
    });

    //--------------------------------------------------------------------
    //�γ̷����ѯ
    $(".btn-search-class").on("click",function(){
        var classfiids=[];
        var classfinames=[];
        $(".filter-class").find("input:checked").each(function(){
            classfiids.push(this.id);
            classfinames.push($(this).parent().text());
        });

        classifyId=classfiids.concat([]);
        initialize();//��ʼ��
        getcourse();
        if(classfiids.length){
            $(".class-result").removeClass("dn").data("id",classfiids.join(",")).find(".result-value").text(classfinames.join(","));
        }else{
            $(".class-result").addClass("dn");
        }
        $(this).parents(".open").removeClass("open");
    });
    //�رտγ̷����ѯ
    $(".class-result .btn-close-result").on("click",function(){
        $(".class-result").addClass("dn");
        classifyId=[];
        initialize();//��ʼ��
        getcourse();
    });
    $(".btn-search-type").on("click",function(){
        var typeids=[];
        var typenames=[];
        $(".filter-type").find("input:checked").each(function(){
            typeids.push(this.id);
            typenames.push($(this).parent().text());
        });

        couType=typeids.concat([]);
        initialize();//��ʼ��
        getcourse();
        if(typeids.length){
            $(".type-result").removeClass("dn").data("id",typeids.join(",")).find(".result-value").text(typenames.join(","));
        }else{
            $(".type-result").addClass("dn");
        }
        $(this).parents(".open").removeClass("open");
    });
    //�رտγ����Ͳ�ѯ
    $(".type-result .btn-close-result").on("click",function(){
        $(".type-result").addClass("dn");
        couType=[];
        initialize();//��ʼ��
        getcourse();
    });
    //----------------------------------------------------------------------

    //�ؼ�������
    $('.input-search').bind('keypress', function (event) {
        if(event.keyCode == "13"){ //�س�������
            $("#target").attr('value', "-1").attr('pagedone', '0').attr("data-count",0); //ҳ����ʼ��
            $(".tablebody").empty();//�������
            getcourse();
        }
    });
    $(".input-search").on("click",function(event){
        $(".search").hide();
        var a=event||window.event;
        a.stopPropagation();
        $(document).on("click",function(){
            if(checkundefined($(".input-search").val())==""){
                $(".search").show();
            }
        });
    });
    //ɾ��Ȩ���ж�
    $(".delcourse").click(function() {
        var courserid=[];
        var stop = true;
        $("input[name='check']:checked").each(function () {
            courserid.push($(this).attr("id"));
            var sourceid=$(this).attr("id");
            stop=power(sourceid,3);//��ѯȨ��
            if (!stop) { //����ѭ��
                $(".error").show();
                $(".reason").html("�޴�Ȩ��");    // ɾ������
                timecut();
                return false;
            }
        });
        if (stop) {
            $('#delcourse').modal('show');
        }
    });

    //ɾ���γ�
    $(".suredel").click(function(){
        var courserid=[];
        $("input[name='check']:checked").each(function(){
            courserid.push($(this).attr("id"));
        });
        var allcourseid=courserid.join(",");
            $.ajax({
                url:"/course.do?subtime=1&method=deleteCourse&couIdStr="+ allcourseid,
                async:false,
                dataType:"json",
                success:function(data){
                    var result=data['result'];
                    if(result==0){
                        $(".error").show();
                        $(".reason").html($.i18n.prop('string_delerror'));    // ɾ������
                        timecut();
                        return false;
                    }else{
                        $(".closedel").trigger("click");//�ر�
                        initialize();//���ֲ�����ʼ��
                        getcourse();
                    }
                }
            });

    });
    //�ж����ù���ԱȨ��
    $(".setmanager").click(function(){
        var courserid=[];
        var stop = true;
        $("input[name='check']:checked").each(function () {
            courserid.push($(this).attr("id"));
            var sourceid=$(this).attr("id");
            stop=power(sourceid,3);//��ѯȨ��
            if (!stop) { //����ѭ��
                $(".error").show();
                $(".reason").html("�޴�Ȩ��");    // ɾ������
                timecut();
                return false;
            }
        });
        if (stop) {
            $('#setmanager').modal('show');
        }
    });

    //��ӿγ̽���ҳ��
    $(".add-course-single").click(function(){
        localStorage.removeItem("projectid");
        localStorage.removeItem('courseid');
        localStorage.removeItem('lecturerid');
        localStorage.removeItem('agencyid');
        window.location.href="/pages/resource/newcourse.html";
    });

    // �������ϴ���ʼ����
    initUploaderFunc("course");


    //�ö�
    $(".stick").click(function(){
        var courserid=[];
        var maxpri=$(".tablebody").find("tr").eq(0).find("input").attr("data-id");
        var pri=[];//�������ȼ�
        $("input[name='check']:checked").each(function(i){
            courserid.push($(this).attr("id"));
            var now=parseInt(maxpri)+parseInt(i)+parseInt(1);
            pri.push(now);
        });
        var allcourseid=courserid.join(",");
        var priority="{'ordId':'"+ orgid +"','type':'1','ids':["+allcourseid+"],'pri':["+ pri +"]}";
        $.ajax({
            url:"/res.do?subtime=1&method=priority",
            type:'POST',
            data:{'priority':priority},
            dataType:"json",
            success:function(data){
                var result=data['result'];
                if(result){
                    initialize();//��ʼ��
                    getcourse();
                }
            }
        });
    });

    $('#btn-add-course').prop('disabled', false);


    //�γ�����
    $("#usertable").on("click",".getcourseinfo",function(){
        localStorage.removeItem("projectid");
        localStorage.removeItem('courseid');
        localStorage.removeItem('lecturerid');
        localStorage.removeItem('agencyid');
        var courseid=$(this).parent().prev().find("input").attr("id");
        localStorage.setItem("courseid",courseid);
        //�ж�Ȩ��,��ͬȨ�޲�ͬ����
        if(power(courseid,3)){
            window.location.href="/pages/resource/courseedit.html";
        }else{
            window.location.href="/pages/resource/coursedetail.html";
        }
    });


});
//�õ��γ���Ϣ
function getcourse(){
    loading(true);
    var pageIndex=parseInt($("#target").val())+parseInt(1);//�ڼ�ҳ
    searchvalue=$(".input-search").val();//�ؼ���
    gettableid(orgid,1);//�õ������id

    var datajson={"orgId": orgid,'couTypes':"["+couType.join(",")+"]",'pageIndex':pageIndex,'searchValue':searchvalue,'classifyIds':"["+classifyId+"]"};
    if(!classifyId.length){
        delete datajson.classifyIds;
    }
    if(!couType.length){
        delete datajson.couTypes;
    }
    $.ajax({
        url:"/course.do?subtime=1&method=queryCourseInfoList",
        type:"POST",
        data: datajson,
        dataType:"json",
        async:false,
        success:function(data){
            var result=data['result']['list'];
            var h = [];
            $.each(result,function(i,value){
                var str=value.classifys;
                var coursetype;
                if (value.type=="1") {
                    coursetype='string_innerclass';
                }else if (value.type=="2") {
                    coursetype='string_broughtinnerclass';
                }else if (value.type=="3") {
                    coursetype='string_expatriateclass';
                }
                if(value.classifys.length){
                    if(str.length>1){
                        var h1=[];
                        for(var i=0;i<str.length;i++){
                                h1.push("<li>",str[i].name,"</li>");
                        }
                        h.push("<tr><td><input type='checkbox' name='check' id='", value.id ,"' data-id='", value.priority ,"'></td><td class='hand'><a class='getcourseinfo gesture'>", value.name ,"</a></td><td class='classkind hand'><span>", value.classifys[0].name ,"...</span><ul class='list-unstyled list-course-type'>", h1.join("") ,"</ul></td><td>", value.hour ,"</td><td>", $.i18n.prop(coursetype) ,"</td></tr>");
                    }else{
                        h.push("<tr><td><input type='checkbox' name='check' id='", value.id ,"' data-id='", value.priority ,"'></td><td class='hand'><a class='getcourseinfo gesture'>", value.name ,"</a></td><td class='hand'>", value.classifys[0].name ,"</td><td>", value.hour ,"</td><td>", $.i18n.prop(coursetype) ,"</td></tr>");
                    }
                }else {
                    h.push("<tr><td><input type='checkbox' name='check' id='", value.id ,"' data-id='", value.priority ,"'></td><td class='hand'><a class='getcourseinfo gesture'>", value.name ,"</a></td><td class='hand'></td><td>", value.hour ,"</td><td>", $.i18n.prop(coursetype) ,"</td></tr>");
                }
            });
            loading();
            $(".tablebody").append(h.join(""));
            var $target = $("#target");
            var pagesize = data['result']['totalSize'];   // ������
            $target.attr("data-size", pagesize);
            var pagecount = $target.attr("data-count") - -result.length; // ��ǰ����
            $target.attr("data-count", pagecount);
            // ��ǰҳ��
            $target.attr('value', pageIndex);
            // �Ƿ������һҳ
            var $parent = $('.tablebody').parent().parent().parent();
            if (pagesize == pagecount) {
                scrollLoadStatus($parent, '1', pagecount, pagesize);
            } else {
                scrollLoadStatus($parent, '0', pagecount, pagesize);
            }
            var tablewidth=$(".table-title").width();
            var onSampleResized = function(e){
                var msg =[];
                var ids=[];
                var columns = $(e.currentTarget).find("th");
                columns.each(function(){
                    var pre=percentage( $(this).width(),tablewidth);
                    msg.push(''+pre+'');
                    ids.push($(this).attr("id"));
                });

                var widthStr="{'id':["+ids+"],'type':1,'width':["+msg+"]}";
                drawtable(orgid,widthStr); //����ı�ĸ��п��
            };
            $("#usertable").colResizable({
                liveDrag:true,
                gripInnerHtml:"<div class='grip'></div>",
                draggingClass:"dragging",
                onResize:onSampleResized
            });
            $(".JCLRgrip").css("height", $("#usertable").height());
            // $(".JCLRgrip").css("height", $(".scroll").height());
            $(".tableSort").updateTable();
            $(".operate-group").removeClass("operate-group-show");//���±�ʱ���ز�����
        }
    });
}
//��ʼ��
function initialize(){
    $("#usertable").trigger("update");
    $("#target").attr('value', "-1").attr('pagedone', '0')
        .attr("data-size", "0").attr("data-count", "0"); //ҳ����ʼ��
    $(".tablebody").empty();//�������
    $(".input-search").val("");//���������
    //��ֹĳЩ����
    $("#btn-more").attr("disabled","true");
    $("#btn-more").css("cursor","default");
}
