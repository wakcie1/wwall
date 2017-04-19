using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace wwall.Bussiness
{
    using System.Web;

    public class WeChatBussiness
    {
         protected string Token;

        /// <summary>
        /// 构造函数，不带参数
        /// 曹鹏飞
        /// 2016-9-27 17:24:54
        /// </summary>
        public WeChatBussiness() { }

        /// <summary>
        /// 构造函数，带一个参数
        /// </summary>
        /// <param name="token"></param>
        public WeChatBussiness(string token)
        {
            Token = token;
        }

        public void Start()
        {
            if (HttpContext.Current.Request.HttpMethod.ToUpper() == "GET")
            {
                Auth();
            }
            else
            { }
        }

        /// <summary>
        /// 验证签名
        /// 曹鹏飞
        /// 2016-9-27 17:40:39
        /// </summary>
        public void Auth()
        {
            string echoStr = HttpContext.Current.Request.QueryString["echoStr"];
            if (CheckSignature())
            {
                if (!string.IsNullOrEmpty(echoStr))
                {
                    HttpContext.Current.Response.Write(echoStr);
                    HttpContext.Current.Response.End();
                }
            }
        }

        /// <summary>
        /// 验证签名（不加密）
        /// 曹鹏飞
        /// 2016-9-27 17:34:48
        /// </summary>
        /// <returns></returns>
        private bool CheckSignature()
        {
            // * 将token、timestamp、nonce三个参数进行字典序排序  
            // * 将三个参数字符串拼接成一个字符串进行sha1加密  
            // * 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信。  
            string signature = HttpContext.Current.Request.QueryString["signature"];
            string timestamp = HttpContext.Current.Request.QueryString["timestamp"];
            string nonce = HttpContext.Current.Request.QueryString["nonce"];
            //加密/校验流程：  
            //1. 将token、timestamp、nonce三个参数进行字典序排序  
            string[] arrTmp = { Token, timestamp, nonce };
            Array.Sort(arrTmp);//字典排序  
            //2.将三个参数字符串拼接成一个字符串进行sha1加密  
            string tmpStr = string.Join("", arrTmp);
            tmpStr = Sha1(tmpStr);
            tmpStr = tmpStr.ToLower();
            var dicEx = new Dictionary<string, string> { { "request", signature }, { "response", tmpStr } };

            //3.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信。  
            if (tmpStr == signature)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// sha1散列算法
        /// 曹鹏飞
        /// 2016-9-27 17:39:12
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private static string Sha1(string text)
        {
            byte[] cleanBytes = Encoding.Default.GetBytes(text);
            byte[] hashedBytes = System.Security.Cryptography.SHA1.Create().ComputeHash(cleanBytes);
            return BitConverter.ToString(hashedBytes).Replace("-", "");
        }
    }
}
