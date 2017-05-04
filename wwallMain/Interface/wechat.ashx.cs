using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using wwall.Bussiness;

namespace wwallMain.Interface
{
    /// <summary>
    /// wechat 的摘要说明
    /// </summary>
    public class wechat : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            //微信验证
            if (HttpContext.Current.Request.HttpMethod.ToUpper() == "GET")
            {
                WeChatBussiness.Auth("wanghao123");
            }
            //推送请求
            if (HttpContext.Current.Request.HttpMethod.ToUpper() == "POST")
            {
               var result =  WeChatBussiness.ProcessWeChatPost();
               if (result == "A2")
               {
                   HttpContext.Current.Response.Redirect("~/Base/Index");
               }
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}