using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using wwall.Core;

namespace wwallMain.Interface
{
    /// <summary>
    /// Test 的摘要说明
    /// </summary>
    public class Test : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {

            CommonHelper.SetXmlValue("WeChatCommonToken", "token", "1111");

            var value1 = CommonHelper.GetXmlValue("WeChatCommonToken", "token");
            var value2 = CommonHelper.GetXmlValue("WeChatCommonToken", "expires_date");
            context.Response.ContentType = "text/plain";
            context.Response.Write(string.Format("token:{0}  ", value1));
            context.Response.Write(string.Format("WeChatCommonToken:{0}  ", value2));
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