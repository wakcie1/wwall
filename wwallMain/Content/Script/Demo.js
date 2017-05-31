/// <reference path="../jquery-1.11.2.min.js" />

; (function (window, jQuery, undefined) {
    var config = {};
    var basePath = "";
    //页面参数
    var pageInfo = {
        topMenuIndex: "",
        leftMenuIndex: "",
        minMenuIndex: "",
        pageType: false,
    };

    //菜单
    var menuInfo = {
        activeLi: $('.leftMenu.active > li.active'),
        activeLastLi: $('.leftMenu.active > li.active > li.active'),
    };

    var page = {
        //初始化
        Init: function (inConfig) {
            config = inConfig;
            basePath = config.basePath;
            page.InitData();
            page.InitEvents();
        },
        //初始化事件
        InitEvents: function () {
            $("#mainMenu").on('click', 'li', events.topMenuClick);
            $("#side-menu").on('click', '.leftMenu ul>li>span[data-href]', events.secondMenuClick);
            $('#side-menu').on('mouseover', '.leftMenu > li', events.mouseOverLeftMenu);
            $('#side-menu').on('mouseleave', events.mouseLeaveLeftMenu);
            $("#navBar #side-menu").on("click", "li", events.leftMenuClick);
            $("body").on("click", ".menuIco", events.menuIcoSm);
            $("body").on("click", ".myWorkSpace", events.myWorkSpaceClick);
            //$('#edit_user').on('click', events.showUserDialog);
            menuMethods.setToggle($(".userInfo"), $(".userDetailInfo"));
            menuMethods.setToggle($(".mes-remind"), $(".mes-list"));
            //页面边框调整自适应
            window.onresize = function () {
                events.openToggle();
            }
            //页面返回跳转页面
            window.onpopstate = function () {
                loadMethods.showOtherPage();
            }
        },
        //初始化数据
        InitData: function () {
            userMethods.getUserInfo();
            menuMethods.getSaasMenu();
            messageRemind.getInformationRemind();
        }
    };

    //事件类
    var events = {
        //打开收起左侧菜单
        openToggle: function () {
            menuMethods.openToggle();
        },
        //导航菜单点击
        topMenuClick: function () {
            var num = pageInfo.topMenuIndex = $(this).attr("data-ename");
            history.pushState({ menuList: num }, "title", "?menuList=" + num);
            loadMethods.showOtherPage();
            //判断是否是 第一个是否在展开
            var twoLevelMenu = $("#side-menu > ul[data-ename=" + num + "]");
            if (twoLevelMenu.find('> li:nth-child(1) > .thirdMenu').height() > 0) {
                $("#side-menu > .active > li:first-child > .thirdMenu > li:first-child > span[data-href]").trigger("click");
            } else {
                $("#side-menu > .active > li:first-child").trigger("click");
                $("#side-menu > .active > li:first-child > .thirdMenu > li:first-child > span[data-href]").trigger("click");
            }
        },
        //左一级菜单点击 
        leftMenuClick: function () {
            var num = "";
            //二级菜单
            if ($(this).parent().hasClass("leftMenu")) {
                num = pageInfo.leftMenuIndex = $(this).attr("data-ename");
                num = pageInfo.topMenuIndex + "|" + num;
                menuMethods.toggleHeight($(this));
            }
            else {
                //三级菜单
                menuInfo.activeLastLi = $(this);
                num = pageInfo.minMenuIndex = $(this).attr("data-ename");
                num = pageInfo.topMenuIndex + "|" + pageInfo.leftMenuIndex + "|" + num;
            }
            history.pushState({ leftList: num }, "title", "?menuList=" + num);
            loadMethods.showOtherPage();

            return false;

        },
        //二级菜单点击
        secondMenuClick: function () {
            var href = $(this).attr("data-href");
            menuInfo.activeLi = $('.leftMenu.active > li.active');
            menuInfo.activeLastLi = $(this.parentNode);
            $('.workspaceActive').removeClass('workspaceActive');
            loadMethods.pageLoad(href);
        },
        //划过左菜单
        mouseOverLeftMenu: function () {
            if ($(this).parents('#navBar').hasClass('menu-sm')) {
                $(this).addClass('active').siblings('li').removeClass('active');
                var num = "";
                if ($(this).parent().hasClass("leftMenu")) {
                    num = pageInfo.leftMenuIndex = $(this).attr("data-ename");
                    num = pageInfo.topMenuIndex + "|" + num;
                } else {
                    num = pageInfo.minMenuIndex = $(this).attr("data-ename");
                    num = pageInfo.topMenuIndex + "|" + pageInfo.leftMenuIndex + "|" + num;

                }
                history.pushState({ leftList: num }, "title", "?menuList=" + num);

                //判断是否触底
                var thirdMenu = $(this).find('.thirdMenu');
                var thirdMenuHeight = thirdMenu.find('li').height() * thirdMenu.find('li').length;
                var toBottom = $(window).height() - $(this).offset().top;
                var moveDis = thirdMenuHeight - toBottom;
                if (thirdMenuHeight > toBottom) {
                    thirdMenu.css('top', '-' + moveDis + 'px');
                }
            }
        },
        //离开左菜单
        mouseLeaveLeftMenu: function () {
            if ($('#navBar').hasClass('menu-sm')) {
                $('#side-menu .leftMenu > li.active').removeClass('active');
                menuInfo.activeLi.addClass('active');
            }
        },
        //左菜单缩进
        menuIcoSm: function () {
            if (!$("#navBar").hasClass("menu-sm")) {
                $("#navBar").addClass("menu-sm");
            } else {
                //fix a bug
                var curSM = $("#side-menu .leftMenu.active").children("li.active").find('.thirdMenu');
                var curMM = curSM.find('li.active');
                if (curSM.height() == 0) {
                    curSM.trigger('click');
                    curMM.addClass('active');
                }
                $("#navBar").removeClass("menu-sm");
            }
        },
        //我的工作台点击
        myWorkSpaceClick: function () {
            var curSecondMenu = $('#side-menu .leftMenu.active>li.active');
            curSecondMenu.removeClass('active').find('.thirdMenu').css('height', 0).find();
            curSecondMenu.find('.icon-right').css('transform', 'rotate(-90deg)');
            $('#mainMenu>li.active').removeClass('active');
            curSecondMenu.find('.thirdMenu > .active').removeClass('active');
            history.pushState({ leftList: '' }, "title", '/sell/');
            //将activeLastLi设置为jq空对象
            menuInfo.activeLastLi = $('');
            loadMethods.showMyWorkSpace();
        },
        //编辑我的信息
        showUserDialog: function () {
            var id = this.attr("data-id");
            //TODO:账号用户编辑页面
            var userEditUrl = basePath + 'SCPDepartmentAndUser/UserBasicEdit?id=' + id + '&pagetype=' + 1;
            $('#eui-dialog-userinfo').empty().append('<iframe src="' + userEditUrl + '"></iframe>');
            var dialogHeight = window.screen.height > 1000 ? "700px" : "500px";
            $('#eui-dialog-userinfo').find('iframe').width(1000);
            $('#eui-dialog-userinfo').find('iframe').height(dialogHeight);
            $('#eui-dialog-userinfo').find('iframe').css("border", "none");
            $("#eDialog-useInfo").eDialog('show');
        },
    }

    //用户信息相关操作
    var userMethods = {
        //获取登录用户信息
        getUserInfo: function () {
            var loginOutUrl = basePath + 'Login/Logout';
            $.ajax({
                url: basePath + 'Workbench/GetUserInfo',//TODO:获取saas登录用户
                dataType: 'json',
                success: function (data) {
                    var showclick = "";
                    if ($("#ModifyUserInformation").val() == "1") {
                        showclick = "data-id = '" + data.Id + ")'";
                    }
                    var detailHtml = '<div class="userInfor">\
                            <div class ="userBigImg"><img id="edit_user" src="' + data.Avatars + '" alt="编辑个人信息"' + showclick + ' /></div>\
                            <div class="userInforTxt">\
                            <p>' + data.Name + '（' + data.JobNum + '）' + '<br/>' + data.DepartName + '</p>\
                            </div></div>\
                            <a class="updata" target="_blank" id="updata" href="/sell/common/VersionUpgradeDesc/ConfigurationDesc">升级说明</a>\
                            <a href="' + loginOutUrl + '" class="logout">退出</a>';
                    $('.userDetailInfo').empty().append(detailHtml);

                    //TODO:SAAS升级说明
                    $("#updata").on("click", function () {
                        if ($("#verTxt")[0]) {
                            $("#verTxt")[0].contentWindow.versionShowObj.modules.versionShowBox.handles.updataDescript(1);
                        }
                        var url = basePath + 'home/InsertVersionUpgradeReadingRecord';   //插入阅读记录
                        $.post(url, null, null);
                        messageRemind.getInformationRemind(2);
                    });
                    if ($("#VersionUpgradeShow").val() == "0") {
                        $("#updata").remove();
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        },
    };

    //目录菜单相关操作
    var menuMethods = {
        //获取并加载目录
        getSaasMenu: function () {
            $.ajax({
                url: basePath + 'home/getmenu', //TODO：Saas菜单获取
                type: 'post',
                dataType: 'json',
                timeout: 20000,
                success: function (data) {
                    if (data.length) {
                        var dataList = data;
                        $('.topMenu .mainMenu').html("");
                        $("#side-menu").html("");
                        var getlist = '';
                        var li = '',
                            liClass = '';
                        for (var i = 0; i < data.length; i++) {
                            //加载默认二级菜单
                            var parentnum = i;
                            if (dataList[parentnum].SubMenuInfo.length) {
                                //二级菜单
                                getlist += '<ul class="leftMenu" data-ename="' + dataList[i].NameEN.toLowerCase() + '">';
                                li += '<li data-spmtype="btn" data-spmcontrolid="menu_' + dataList[i].NameEN + '" data-spmvalue="0" data-ename="' + dataList[i].NameEN.toLowerCase() + '" data-href="' + dataList[i].SubMenuInfo[0].SubMenuInfo[0].Url + '" class="fa ' + dataList[i].GetMenuPicClass + '" ordernum="' + i + '" name="' + data[i].NameCN + '"><span title="' + data[i].NameCN + '">' + data[i].NameCN + '</span></li>';
                                for (var j = 0; j < dataList[parentnum].SubMenuInfo.length; j++) {
                                    getlist += '<li ordernum="' + j + '" parentnum="' + parentnum + '" data-ename="' + dataList[parentnum].SubMenuInfo[j].NameEN.toLowerCase() + '"  name="' + dataList[parentnum].SubMenuInfo[j].NameCN + '"><span data-spmtype="btn" data-spmcontrolid="menu_' + dataList[parentnum].SubMenuInfo[j].NameEN + '" data-spmvalue="0" data-href="javascript:void(0)"><i class="fa icon-order ' + dataList[parentnum].SubMenuInfo[j].GetMenuPicClass + '"></i><span class="menuItem">' + dataList[parentnum].SubMenuInfo[j].NameCN + '</span><i class="icon-right"></i></span><ul class="thirdMenu">';
                                    //加载三级菜单
                                    var thirdMenuLength = dataList[parentnum].SubMenuInfo[j].SubMenuInfo.length;
                                    if (thirdMenuLength) {
                                        if (thirdMenuLength == 1) {
                                            getlist += '<li data-spmtype="btn" data-spmcontrolid="menu_' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[0].NameEN + '" data-spmvalue="0" data-ename="' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[0].NameEN.toLowerCase() + '"  class="noLine" id="' + p + '" name="' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[0].NameCN + '" data-href="' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[0].Url + '"><span data-href="' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[0].Url + '"><span>' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[0].NameCN + '</span></span></li>';
                                        } else {
                                            for (var p = 0; p < dataList[parentnum].SubMenuInfo[j].SubMenuInfo.length; p++) {
                                                getlist += '<li data-spmtype="btn" data-spmcontrolid="menu_' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[0].NameEN + '" data-spmvalue="0" data-ename="' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[p].NameEN.toLowerCase() + '"  id="' + p + '" name="' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[p].NameCN + '" data-href="' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[p].Url + '"><span data-href="' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[p].Url + '"><span title="' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[p].NameCN + '">' + dataList[parentnum].SubMenuInfo[j].SubMenuInfo[p].NameCN + '</span></span></li>';
                                            }
                                        }
                                    }
                                    getlist += '</ul></li>';
                                }
                            }
                            getlist += '</ul>';
                        }
                        spm.init();
                        $("#side-menu").html(getlist);
                        $('.topMenu .mainMenu').html(li);

                        spm.init();

                        pageInfo.topMenuIndex = $("#mainMenu li").eq(0).attr("data-ename");
                        pageInfo.leftMenuIndex = $("#side-menu ul").eq(0).attr("data-ename");
                        pageInfo.minMenuIndex = $("li", $("#side-menu ul").eq(0)).eq(0).attr("data-ename");

                        $('#side-menu > ul:nth-child(1)').addClass('active');

                        loadMethods.loadOrJump();
                        setTimeout(this.openToggle, 1000);
                    }
                    else {
                        $('.topMenu .mainMenu').html("");
                        var notFound = basePath + 'UnAuthorized/unauthorize';
                        var url = ' <iframe id="ifm" src="' + notFound + '" width="100%" height="100%" style="border:none;"></iframe>';
                        $('#mainSide').html(url);
                    }
                }
            });
        },
        //打开收起左侧菜单
        openToggle: function () {
            //分辨率1600以下收起
            if (document.body.clientWidth <= 1600) {
                if (!$("#navBar").hasClass("menu-sm") && $("#IsShrinkMenu").val() == 1) {
                    $("#navBar").addClass("menu-sm");
                }
            } else {
                if ($("#navBar").hasClass("menu-sm")) {
                    $("#navBar").removeClass("menu-sm");
                }
            }
        },
        //切换高度
        toggleHeight: function (elem) {
            var minList = elem.find("ul");
            var minListHeight = minList.height();
            if (minListHeight != 0) {
                //二级菜单收缩时去掉点击后的动画
                if (elem.parents("#navBar").hasClass("menu-sm")) {
                    return;
                };
                minList.animate({ "height": 0 }, 200);
                elem.find(".icon-right").css({
                    'transform': 'rotate(-90deg)'
                });
            }
            else {
                elem.find(".icon-right").css({
                    'transform': 'rotate(0deg)'
                });
                var tarH = 38 * minList.find("li").length;
                minList.parent().siblings("li").find(".icon-right").css({
                    'transform': 'rotate(-90deg)'
                });
                minList.animate({ "height": tarH }, 200).parent().siblings("li").find("ul").animate({ "height": 0 }, 200);
            };
        },
        //向下显示和隐藏
        setToggle: function (dom, target) {
            var timer = null;
            dom.hover(function () {
                clearTimeout(timer);
                target.slideDown(100);
                //target.show();
            }, function () {
                timer = setTimeout(function () {
                    target.hide();
                }, 100);
            });
            target.hover(function () {
                clearTimeout(timer);
                target.slideDown(100);
            }, function () {
                target.hide();
            });
        }
    };

    //页面加载相关操作
    var loadMethods = {
        //打开我的工作台
        showMyWorkSpace: function () {
            this.pageLoad(basePath + "/SaaSHome/Welcome");
            var location = $(".tabList");
            $(".tabList").empty();
            var setName = "工作台";
            location.append('当前位置： <a class="icon-angle-right" style="cursor:pointer;" data-href="' + basePath + "/SaaSHome/Welcome" + '">' + setName + '</a><div class="tabList-ad"></div>');
            $('.myWorkSpace').addClass('workspaceActive');

        },
        //跳转URL指定页面 或 加载工作台首页
        loadOrJump: function () {
            //debugger
            if (window.location.href.split("menuList=")[1]) {
                this.showOtherPage(true);
            } else {
                this.showMyWorkSpace();
            }
        },
        //跳转指定页面
        showOtherPage: function (needload) {
            var menuInit = this.getURLParameter().menulist;
            if (menuInit) {
                var argList = menuInit.split("|");
                pageInfo.topMenuIndex = argList[0] || "";
                pageInfo.leftMenuIndex = argList[1] || "";
                pageInfo.minMenuIndex = argList[2] || "";
            }
            $(".active").removeClass("active");
            var LM = $("#mainMenu>li[data-ename=" + pageInfo.topMenuIndex + "]");
            var MM = $("#side-menu>ul[data-ename=" + pageInfo.topMenuIndex + "]").addClass("active").children("li[data-ename=" + pageInfo.leftMenuIndex + "]");
            var SM = MM.find("li[data-ename=" + pageInfo.minMenuIndex + "]");
            LM.addClass("active");
            MM.addClass("active");
            menuInfo.activeLastLi.addClass("active");
            pageInfo.minMenuIndex && !isNaN(pageInfo.minMenuIndex) && SM.addClass("active");
            if (needload) {
                menuMethods.toggleHeight(MM);
                //有地址 正常跳转
                if (SM.length > 0) {
                    SM.addClass("active");
                    this.pageLoad($("span[data-href]", SM).attr("data-href"));
                }
                    //只有一级地址
                else if (pageInfo.topMenuIndex && !pageInfo.leftMenuIndex && LM.length > 0) {
                    LM.click();
                }
                    //有二级地址 没有三级地址 默认加载第一条三级地址url
                else if (pageInfo.leftMenuIndex && !pageInfo.minMenuIndex && MM.length > 0) {
                    SM = $("li", MM).eq(0);
                    SM.click();
                    this.pageLoad($("span[data-href]", SM).attr("data-href"));
                } else {
                    $(".limited").show();
                    setTimeout(function () {
                        $(".limited").hide();
                        this.showMyWorkSpace();
                    }, 2000);
                }
            } else {
                this.locationCurrent();
            }
        },
        //加载页面
        pageLoad: function (pageLink, pageType) {
            if (pageInfo.pageType) {
                $("#mainSide").load(pageLink, function (response, status, xhr) {
                    if (status == "error") {
                        $("#mainSide").load("404.html");
                    }
                });
            } else {
                $("#mainSide").html("<iframe id='ifm' src=" + pageLink + " width='100%' height='100%' style='border:none;'></iframe>");
            }
            this.locationCurrent();
            //loading层
            $(".main-loading").show();
            try {
                var iframeDoc = $('#ifm')[0].contentWindow;
                iframeDoc.addEventListener('DOMContentLoaded', function (event) {
                    $(".main-loading").hide();
                }, false);
                $('#ifm').on('load', function () {
                    $(".main-loading").hide();
                });
            }
            catch (err) {
                setTimeout(function () {
                    $(".main-loading").hide();
                }, 2000);
            }
        },
        //显示当前位置
        locationCurrent: function () {
            var location = $(".tabList");
            var txtUrl3 = "";
            $(".tabList").empty();
            location.append('<div class="tabList-ad"></div>');
            if ($("#mainMenu>li").length) {
                $("#mainMenu>li").each(function () {
                    if ($(this).hasClass('active')) {
                        var txtUrl1 = $(this).attr("data-href");
                        var txt1 = $(this).attr("name");
                        //console.log(txt1);
                        location.append('当前位置： <a class="icon-angle-right" data-hrefNo="' + txtUrl1 + '">' + (txt1 ? txt1 : "") + '</a>');
                    }
                });
            }
            if ($(".leftMenu>li").each(function () {
                    if ($(this).hasClass('active')) {
                        var txtUrl1 = $(this).attr("data-href");
                        var txt1 = $(this).attr("name");
                //console.log(txt1);
                        location.append('<a class="icon-angle-right" data-hrefNo="' + txtUrl1 + '">' + (txt1 ? ">&nbsp" + txt1 : "") + '</a>');
            }
            }));
            if ($(".leftMenu>li>ul>li").each(function () {
                    if ($(this).hasClass('active')) {
                        txtUrl3 = $(this).attr("data-href");
                        var txt1 = $(this).attr("name");
                //console.log(txt1);
                        location.append('<a class="icon-angle-right" data-href="' + txtUrl3 + '">' + (txt1 ? ">&nbsp" + txt1 : "") + '</a>');
            }
            }));
        },
        //获取URL参数
        getURLParameter: function () {
            var url = location.search.toLowerCase();
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                str = str.split("&");
                for (var i = 0; i < str.length; i++) { theRequest[str[i].split("=")[0]] = unescape(str[i].split("=")[1]); }
            }
            return theRequest;
        },
    }

    //消息公告提醒相关
    var messageRemind = {
        //消息提醒模块
        getInformationRemind: function (whereisneedcutdown) {  //whereisneedcutdown   0页面默认加载，1阅读完公告后加载，2阅读完升级说明后加载，3查看提醒消息后加载
            var url = basePath + "home/GetInformationRemind";
            $.post(url, null, function (data) {
                if (data.IsSuccess) {
                    if (whereisneedcutdown == 2 && data.VersionUpIntroduction > 0) {
                        data.VersionUpIntroduction = data.VersionUpIntroduction - 1;
                    }
                    var messagecount = parseInt(data.NoticeUnRead) + parseInt(data.VersionUpIntroduction) + parseInt(data.MessageUnRead);
                    if (messagecount > 0) {
                        $(".mes-remind").css("display", "block");
                        $("#showMessageUnRead").text(messagecount);
                        var innerhtmltxt = "";
                        if (data.NoticeUnRead > 0) {
                            innerhtmltxt += "<li><span class='mes-num'>" + data.NoticeUnRead + "</span><span class='mes-txt'>条未读公告</span><a href='javascript:void(0);' class='mes-check' id='shownoticeunread'>立即查看</a></li>";

                        }
                        if (data.VersionUpIntroduction > 0) {
                            innerhtmltxt += " <li><span class='mes-num'>" + data.VersionUpIntroduction + "</span><span class='mes-txt'>条升级说明提醒</span><a href='/sell/common/VersionUpgradeDesc/ConfigurationDesc' target='_blank' class='mes-check' id='showVersionUpgrade'>立即查看</a></li>";
                        }
                        if (data.MessageUnRead > 0) {
                            innerhtmltxt += " <li><span class='mes-num'>" + data.MessageUnRead + "</span><span class='mes-txt'>条消息未读提醒</span><a href='javascript:void(0);'  class='mes-check' id='showMessageUnReadPage'>立即查看</a></li>";
                        }
                        $(".mes-list").html(innerhtmltxt);
                        if ($("#shownoticeunread").length > 0) {
                            $("#shownoticeunread").click(function () {
                                var url = basePath + "noticecategory/Index";
                                $("#ifm").attr("src", url);
                            });
                        }
                        if ($("#showMessageUnReadPage").length > 0) {
                            $("#showMessageUnReadPage").click(function () {
                                var url = basePath + "Notification/Index";
                                $("#ifm").attr("src", url);
                            });
                        }
                        if ($("#showVersionUpgrade").length > 0) {
                            $("#showVersionUpgrade").click(function () {
                                $("#updata").click();
                            });
                        }
                    } else {
                        $(".mes-remind").css("display", "none");
                    }
                }
            });
        }
    }

    //全局变量，请勿重新定义（多个JS文件需要区分）
    window.SaasPageInit = page.Init;
})(window, jQuery)