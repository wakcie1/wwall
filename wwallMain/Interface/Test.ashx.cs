using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using wwall.Bussiness;
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

            var resutl = WeChatBussiness.GetAccessToken();
            context.Response.ContentType = "text/plain";
            context.Response.Write(string.Format("token:{0}  ", resutl));
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