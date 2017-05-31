/// <reference path="../jquery-1.11.2.min.js" />

; (function (window, jQuery, undefined) {
    var config = {};
    var basePath = "";


    var page = {
        //初始化
        Init: function (inConfig) {
            config = inConfig;
            basePath = config.basePath;

        },
        //初始化事件
        InitEvents: function () {

        },
        //初始化数据
        InitData: function () {

        }
    };

    //事件类
    var events = {

    }

    //用户信息相关操作
    var userMethods = {

    };

    //目录菜单相关操作
    var menuMethods = {

    };

    //页面加载相关操作
    var loadMethods = {

    }

    //全局变量，请勿重新定义（多个JS文件需要区分）
    window.SaasPageInit = page.Init;
})(window, jQuery)