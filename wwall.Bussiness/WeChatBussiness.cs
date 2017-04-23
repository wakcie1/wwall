using System;
using System.Web;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using wwall.Core;
using Newtonsoft.Json;
using wwall.Model.WeChat;
using System.IO;
using System.Xml;

namespace wwall.Bussiness
{
    public class WeChatBussiness
    {
        /// <summary>
        /// 验证签名
        /// </summary>
        public static void Auth(string myToken)
        {
            if (HttpContext.Current.Request.HttpMethod.ToUpper() != "GET")
            {
                return;
            }
            string echoStr = HttpContext.Current.Request.QueryString["echoStr"];
            if (CheckSignature(myToken))
            {
                if (!string.IsNullOrEmpty(echoStr))
                {
                    HttpContext.Current.Response.Write(echoStr);
                    HttpContext.Current.Response.End();
                }
            }
        }

        /// <summary>
        /// 获取普通Token
        /// </summary>
        /// <returns></returns>
        public static string GetAccessToken()
        {
            var acToken = CommonHelper.GetXmlValue("WeChatCommonToken", "token");
            var expiresDate = CommonHelper.GetXmlValue("WeChatCommonToken", "expires_date");
            bool needGetNewToken = false;
            if (string.IsNullOrEmpty(acToken))
            {
                needGetNewToken = true;
            }
            else if (!string.IsNullOrEmpty(expiresDate))
            {
                var expTime = Convert.ToDateTime(expiresDate);
                if (expTime < DateTime.Now)
                {
                    needGetNewToken = true;
                }
            }
            if (needGetNewToken)
            {
                var acTokenUrl = string.Format("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}", "wxf01595a1ef2473eb", "ffd1da2b291582bdc858195517140e77");
                var result = CommonHelper.GetWebRequest(acTokenUrl);
                var acTokenModel = JsonConvert.DeserializeObject<AcToken>(result);
                acToken = acTokenModel.Access_token;
                CommonHelper.SetXmlValue("WeChatCommonToken", "token", acToken);
                CommonHelper.SetXmlValue("WeChatCommonToken", "expires_date", DateTime.Now.AddSeconds(acTokenModel.Expires_in - 200).ToString("yyyy-MM-dd HH:mm:ss"));
            }

            return acToken;
        }

        /// <summary>
        /// 处理微信请求
        /// </summary>
        public static void ProcessWeChatPost()
        {
            string result = "";
            string postString = string.Empty;
            if (HttpContext.Current.Request.HttpMethod.ToUpper() == "POST")
            {
                using (Stream stream = System.Web.HttpContext.Current.Request.InputStream)
                {
                    Byte[] postBytes = new Byte[stream.Length];
                    stream.Read(postBytes, 0, (Int32)stream.Length);
                    postString = Encoding.UTF8.GetString(postBytes);
                    if (!string.IsNullOrEmpty(postString))
                    {
                        string SendToWx = string.Empty;
                        //这里写方法解析Xml
                        XmlDocument xml = new XmlDocument();//
                        xml.LoadXml(postString);
                        XmlElement xmlElement = xml.DocumentElement;
                        //这里进行判断MsgType
                        switch (xmlElement.SelectSingleNode("MsgType").InnerText)
                        {
                            case "text":
                                break;
                            case "image":
                                break;
                            case "voice":
                                break;
                            case "video":
                                break;
                            case "shortvideo":
                                break;
                            case "location":
                                break;
                            case "link":
                                break;
                            case "event":
                                string eventKey = xmlElement.SelectSingleNode("EventKey").InnerText == null ? "" : xmlElement.SelectSingleNode("EventKey").InnerText;
                                switch (xmlElement.SelectSingleNode("Event").InnerText)
                                {
                                    case "subscribe":
                                        if (string.IsNullOrEmpty(eventKey))
                                        {
                                            //model = new Models.Receive_Event();
                                        }
                                        else
                                        {
                                            //model = new Models.Receive_Event_Scan();
                                        }
                                        break;
                                    case "unsubscribe":
                                        break;
                                    case "SCAN":
                                        break;
                                    case "LOCATION":
                                        break;
                                    case "CLICK":

                                        break;
                                    case "VIEW":
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                result = "没有识别的类型消息：" + xmlElement.SelectSingleNode("MsgType").InnerText;

                                break;
                        }
                        if (!string.IsNullOrEmpty(SendToWx))
                        {
                            System.Web.HttpContext.Current.Response.Write(SendToWx);
                            System.Web.HttpContext.Current.Response.End();
                        }
                        else
                        {
                            result = "回传数据为空";

                        }
                    }
                    else
                    {
                        result = "微信推送的数据为：" + postString;
                    }
                }
            }
        }

        #region 私有方法

        /// <summary>
        /// 验证签名（不加密）
        /// 2016-9-27 17:34:48
        /// </summary>
        /// <returns></returns>
        private static bool CheckSignature(string myToken)
        {
            // * 将token、timestamp、nonce三个参数进行字典序排序  
            // * 将三个参数字符串拼接成一个字符串进行sha1加密  
            // * 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信。  
            string signature = HttpContext.Current.Request.QueryString["signature"];
            string timestamp = HttpContext.Current.Request.QueryString["timestamp"];
            string nonce = HttpContext.Current.Request.QueryString["nonce"];
            //加密/校验流程：  
            //1. 将token、timestamp、nonce三个参数进行字典序排序  
            string[] arrTmp = { myToken, timestamp, nonce };
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
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private static string Sha1(string text)
        {
            byte[] cleanBytes = Encoding.Default.GetBytes(text);
            byte[] hashedBytes = System.Security.Cryptography.SHA1.Create().ComputeHash(cleanBytes);
            return BitConverter.ToString(hashedBytes).Replace("-", "");
        }

        /// <summary>
        /// 获取文本回复内容
        /// </summary>
        /// <param name="StrXml"></param>
        /// <returns></returns>
        private static string GetWxTextXml(string StrXml)
        {
            string result = string.Empty;
            //加载xml
            XmlDocument textXml = new XmlDocument();
            textXml.LoadXml(StrXml);
            XmlElement xmlElement = textXml.DocumentElement;
            //转成model对象
            Receive_Text model = new Receive_Text()
            {
                ToUserName = xmlElement.SelectSingleNode("ToUserName").InnerText,
                FromUserName = xmlElement.SelectSingleNode("FromUserName").InnerText,
                CreateTime = xmlElement.SelectSingleNode("CreateTime").InnerText,
                MsgType = xmlElement.SelectSingleNode("MsgType").InnerText,
                Content = xmlElement.SelectSingleNode("Content").InnerText,
                MsgId = xmlElement.SelectSingleNode("MsgId").InnerText
            };
            //数据组织拼接返回xml
            if (model.Content == "你好！")
            {
                //返回的xml
                result = string.Format(MessageXml.TextMsg, model.FromUserName, model.ToUserName, CommonHelper.ConvertDateTimeInt(DateTime.Now), "你好！接口测试通过了！恭喜你！");
            }
            return result;
        }
        #endregion
    }
}
