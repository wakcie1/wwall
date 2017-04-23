using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace wwall.Model.WeChat
{
    /// <summary>
    /// 微信Access_token
    /// </summary>
    public class AcToken
    {
        /// <summary>
        /// token
        /// </summary>
        public string Access_token { get; set; }

        /// <summary>
        /// 过期时间
        /// </summary>
        public int Expires_in { get; set; }
    }
}
