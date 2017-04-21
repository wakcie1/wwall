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
            var weChat = new WeChatBussiness("wanghao123");
            weChat.Start();
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