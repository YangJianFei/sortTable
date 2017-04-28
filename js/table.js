
// Javascript Document
var  orgid=getCookie("orgid"); //组织id
var  searchvalue;//关键字
var couType=[];//课程类型
var classifyId=[];//课程分类
var COURSE_PAGE_SIZE = 20;  // 每页加载的课程的个数
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

    // course.html 国际化
    $('.i18n-course-title').find('li:first a').html($.i18n.prop('string_resource'));    // 资源
    $('.i18n-course-title').find('li:last').html($.i18n.prop('string_courselist')); // 课程列表
    $('#btn-add-course').html($.i18n.prop('string_addcourse')); // 添加课程
    $('.add-course-single').html($.i18n.prop('string_singleadd'));  // 单个添加
    $('.i18n-batch-addcourse').html($.i18n.prop('string_batchimport')); // 批量导入.md
    $('.edit').html($.i18n.prop('string_edit'));    // 编辑
    $('#btn-more').html($.i18n.prop('string_more'));    // 更多
    $('.i18n-more-items').find('li:first a').html($.i18n.prop('string_top'));   // 置顶
    $('.i18n-more-items').find('li:nth-child(2) a').html($.i18n.prop('string_delete')); // 删除
    $('.i18n-more-items').find('li:last a').html($.i18n.prop('string_manauthory')); // 管理授权

    $('#course-class').find('span').before($.i18n.prop('string_coursesortshort'));  // 课程分类
    $('.course-class-select').find('li:first a').html($.i18n.prop('string_coursesortshort'));  // 课程分类

    $('#course-type').find('span').before($.i18n.prop('string_coursetype'));   // 课程类型
    //$('.course-type-select').find('li:first a').html($.i18n.prop('string_coursetype'));   // 课程类型
    //$('.course-type-select').find('li:nth-child(2) a').html($.i18n.prop('string_innerclass'));   //  内部内训课
    //$('.course-type-select').find('li:nth-child(3) a').html($.i18n.prop('string_broughtinnerclass'));    // 外采内训课
    //$('.course-type-select').find('li:last a').html($.i18n.prop('string_expatriateclass'));    // 外派公开课

    $('.i18n-course-thead').find('th:nth-child(2) .th-coursename').text($.i18n.prop('string_coursenameshort')); // 课程名称
    $('.i18n-course-thead').find('th:nth-child(3) .th-courseclass').text($.i18n.prop('string_coursesortshort')); // 课程分类
    $('.i18n-course-thead').find('th:nth-child(4) .th-coursetime').text($.i18n.prop('string_classdurationshort')); // 课程时长
    $('.i18n-course-thead').find('th:last .th-coursetype').text($.i18n.prop('string_coursetypeshort')); // 课程类型

    $('.i18n-delselectedcourse-title').html($.i18n.prop('string_delselectedcourse'));   // 是否删除所选课程
    $('.suredel').html($.i18n.prop('string_delete'));   // 删除
    $('.closedel').html($.i18n.prop('string_cancel'));  //　取消
    $('.i18n-addadmin-title').html($.i18n.prop('string_addadmin'));    // 授权管理员
    $('.tomanager').html($.i18n.prop('string_sure'));   // 确定

    initialize();
    getcourse();
    add(orgid,3);//设置管理员
    // 滚动加载
    $(".myscroll").scroll(function () {
        var pageDone = ($('#target').attr('data-size') != $("#target").attr("data-count"));
        if (checkscrollDiv($(this)) && pageDone) {
            $('#target').attr('data-size', '-1'); // 防止重复加载
            getcourse();
        }
    });

    //得到课程分类
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
    //课程分类查询
    $(".btn-search-class").on("click",function(){
        var classfiids=[];
        var classfinames=[];
        $(".filter-class").find("input:checked").each(function(){
            classfiids.push(this.id);
            classfinames.push($(this).parent().text());
        });

        classifyId=classfiids.concat([]);
        initialize();//初始化
        getcourse();
        if(classfiids.length){
            $(".class-result").removeClass("dn").data("id",classfiids.join(",")).find(".result-value").text(classfinames.join(","));
        }else{
            $(".class-result").addClass("dn");
        }
        $(this).parents(".open").removeClass("open");
    });
    //关闭课程分类查询
    $(".class-result .btn-close-result").on("click",function(){
        $(".class-result").addClass("dn");
        classifyId=[];
        initialize();//初始化
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
        initialize();//初始化
        getcourse();
        if(typeids.length){
            $(".type-result").removeClass("dn").data("id",typeids.join(",")).find(".result-value").text(typenames.join(","));
        }else{
            $(".type-result").addClass("dn");
        }
        $(this).parents(".open").removeClass("open");
    });
    //关闭课程类型查询
    $(".type-result .btn-close-result").on("click",function(){
        $(".type-result").addClass("dn");
        couType=[];
        initialize();//初始化
        getcourse();
    });
    //----------------------------------------------------------------------

    //关键字搜索
    $('.input-search').bind('keypress', function (event) {
        if(event.keyCode == "13"){ //回车键搜索
            $("#target").attr('value', "-1").attr('pagedone', '0').attr("data-count",0); //页数初始化
            $(".tablebody").empty();//清空数据
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
    //删除权限判断
    $(".delcourse").click(function() {
        var courserid=[];
        var stop = true;
        $("input[name='check']:checked").each(function () {
            courserid.push($(this).attr("id"));
            var sourceid=$(this).attr("id");
            stop=power(sourceid,3);//查询权限
            if (!stop) { //跳出循环
                $(".error").show();
                $(".reason").html("无此权限");    // 删除出错
                timecut();
                return false;
            }
        });
        if (stop) {
            $('#delcourse').modal('show');
        }
    });

    //删除课程
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
                        $(".reason").html($.i18n.prop('string_delerror'));    // 删除出错
                        timecut();
                        return false;
                    }else{
                        $(".closedel").trigger("click");//关闭
                        initialize();//部分操作初始化
                        getcourse();
                    }
                }
            });

    });
    //判断设置管理员权限
    $(".setmanager").click(function(){
        var courserid=[];
        var stop = true;
        $("input[name='check']:checked").each(function () {
            courserid.push($(this).attr("id"));
            var sourceid=$(this).attr("id");
            stop=power(sourceid,3);//查询权限
            if (!stop) { //跳出循环
                $(".error").show();
                $(".reason").html("无此权限");    // 删除出错
                timecut();
                return false;
            }
        });
        if (stop) {
            $('#setmanager').modal('show');
        }
    });

    //添加课程进入页面
    $(".add-course-single").click(function(){
        localStorage.removeItem("projectid");
        localStorage.removeItem('courseid');
        localStorage.removeItem('lecturerid');
        localStorage.removeItem('agencyid');
        window.location.href="/pages/resource/newcourse.html";
    });

    // 把批量上传初始化了
    initUploaderFunc("course");


    //置顶
    $(".stick").click(function(){
        var courserid=[];
        var maxpri=$(".tablebody").find("tr").eq(0).find("input").attr("data-id");
        var pri=[];//排列优先级
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
                    initialize();//初始化
                    getcourse();
                }
            }
        });
    });

    $('#btn-add-course').prop('disabled', false);


    //课程详情
    $("#usertable").on("click",".getcourseinfo",function(){
        localStorage.removeItem("projectid");
        localStorage.removeItem('courseid');
        localStorage.removeItem('lecturerid');
        localStorage.removeItem('agencyid');
        var courseid=$(this).parent().prev().find("input").attr("id");
        localStorage.setItem("courseid",courseid);
        //判断权限,不同权限不同操作
        if(power(courseid,3)){
            window.location.href="/pages/resource/courseedit.html";
        }else{
            window.location.href="/pages/resource/coursedetail.html";
        }
    });


});
//得到课程信息
function getcourse(){
    loading(true);
    var pageIndex=parseInt($("#target").val())+parseInt(1);//第几页
    searchvalue=$(".input-search").val();//关键字
    gettableid(orgid,1);//得到表格列id

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
            var pagesize = data['result']['totalSize'];   // 总人数
            $target.attr("data-size", pagesize);
            var pagecount = $target.attr("data-count") - -result.length; // 当前人数
            $target.attr("data-count", pagecount);
            // 当前页码
            $target.attr('value', pageIndex);
            // 是否是最后一页
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
                drawtable(orgid,widthStr); //保存改变的各列宽度
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
            $(".operate-group").removeClass("operate-group-show");//更新表时隐藏操作条
        }
    });
}
//初始化
function initialize(){
    $("#usertable").trigger("update");
    $("#target").attr('value', "-1").attr('pagedone', '0')
        .attr("data-size", "0").attr("data-count", "0"); //页数初始化
    $(".tablebody").empty();//清空数据
    $(".input-search").val("");//搜索框清空
    //禁止某些操作
    $("#btn-more").attr("disabled","true");
    $("#btn-more").css("cursor","default");
}
