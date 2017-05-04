using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace wwall.Model.WeChat
{
    public abstract class ReceiveModel
    {
        /// <summary>
        /// 接收方帐号（收到的OpenID）
        /// </summary>
        public string ToUserName { get; set; }

        /// <summary>
        /// 发送方帐号（一个OpenID）
        /// </summary>
        public string FromUserName { get; set; }

        /// <summary>
        /// 消息创建时间 （整型）
        /// </summary>
        public string CreateTime { get; set; }

        /// <summary>
        /// 消息类型
        /// </summary>
        public string MsgType { get; set; }

        /// <summary>
        /// 当前实体的XML字符串
        /// </summary>
        public string Xml { get; set; }
    }

    /// <summary>
    /// 接收普通消息-文本消息
    /// </summary>
    public class Receive_Text : ReceiveModel
    {
        /// <summary>
        /// 文本消息内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 消息id，64位整型
        /// </summary>
        public string MsgId { get; set; }
    }

    /// <summary>
    /// 接收点击菜单事件推送
    /// </summary>
    public class Receive_Event : ReceiveModel
    {
        /// <summary>
        /// 文本消息内容
        /// </summary>
        public string Event { get; set; }

        /// <summary>
        /// 消息id，64位整型
        /// </summary>
        public string EventKey { get; set; }
    }
}
