using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using wwall.Bussiness;
using wwall.Core;

namespace wwallMain.Controllers
{
    public class BaseController : Controller
    {
        public ActionResult Index()
        {
            string code = "";
            if (Request.QueryString["code"] != null && Request.QueryString["code"].ToString() != "")
            {
                string corpId = "wxf01595a1ef2473eb";
                string secret = "ffd1da2b291582bdc858195517140e77";

                string accessToken = WeChatBussiness.GetAccessToken();
                code = Request.QueryString["code"].ToString();

                string url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + corpId + "&secret=" + secret + "&code=" + code + "&grant_type=authorization_code";
                string jsonResult = CommonHelper.GetWebRequest(url);

                WebAccessToken OAuthUser_Model = JsonConvert.DeserializeObject<WebAccessToken>(jsonResult);

                string url1 = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + accessToken + "&openid=" + OAuthUser_Model.openid + "&lang=zh_CN";
                string jsonResultUser = CommonHelper.GetWebRequest(url1);

                UserInfoBase userinfo = JsonConvert.DeserializeObject<UserInfoBase>(jsonResultUser);

                if (userinfo.subscribe == "0")
                {
                    ViewBag.Message = "你没关注我们";
                }
                else
                {
                    ViewBag.Message = "成功";
                    ViewBag.UserInfo = userinfo;
                }
            }
            return View();
        }

    }
}
