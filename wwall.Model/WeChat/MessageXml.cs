using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace wwall.Model.WeChat
{
    public class MessageXml
    {
        #region 文本xml
        /// <summary>
        /// ToUserName:用户ID（OpenID）
        /// FromUserName：开发者
        /// CreateTime：时间
        /// Content：内容
        /// </summary>
        public static string TextMsg
        {
            get
            {
                return @"
                    <xml>
                    <ToUserName><![CDATA[{0}]]></ToUserName>
                    <FromUserName><![CDATA[{1}]]></FromUserName> 
                    <CreateTime>{2}</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[{3}]]></Content>
                    </xml>
                    ";
            }
        }
        #endregion
    }
}
