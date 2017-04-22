using System;
using System.Xml;
using System.Text;
using System.Linq;
using System.Configuration;
using System.Web.Configuration;
using System.Collections.Generic;
using System.Net;
using System.IO;

namespace wwall.Core
{
    public class CommonHelper
    {
        /// <summary>
        /// 获取配置文件值
        /// </summary>
        /// <param name="key">Key</param>
        /// <returns>Value</returns>
        public static string GetAppValue(string key)
        {
            return WebConfigurationManager.AppSettings[key];
        }

        /// <summary>
        /// 获取两层XML结构的数据值
        /// </summary>
        /// <param name="fatherNode"></param>
        /// <param name="childNode"></param>
        /// <returns></returns>
        public static string GetXmlValue(string fatherNode, string childNode)
        {
            var result = string.Empty;
            var xmlDoc = new XmlDocument();
            string path = System.AppDomain.CurrentDomain.BaseDirectory;
            xmlDoc.Load(string.Format("{0}\\App_Data\\{1}", path, "CommonData.xml"));
            var xmlNode = xmlDoc.SelectSingleNode(fatherNode);
            var nodeList = xmlNode.ChildNodes;
            foreach (XmlNode node in nodeList)
            {
                if (node.Name.Equals(childNode))
                {
                    result = node.InnerText;
                    break;
                }
            }
            return result;
        }

        /// <summary>
        /// 设置两层XML结构的数据值
        /// </summary>
        /// <param name="fatherNode"></param>
        /// <param name="childNode"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static void SetXmlValue(string fatherNodeName, string childNodeName, string value)
        {
            var xmlDoc = new XmlDocument();

            string path = string.Format("{0}\\App_Data\\{1}", System.AppDomain.CurrentDomain.BaseDirectory, "CommonData.xml");
            xmlDoc.Load(path);
            var fatherNode = xmlDoc.SelectSingleNode(fatherNodeName);
            if (fatherNode == null)
            {
                fatherNode = xmlDoc.CreateNode("", fatherNodeName, "");
                xmlDoc.AppendChild(fatherNode);
            }
            var childNode = fatherNode.SelectSingleNode(childNodeName);
            if (childNode == null)
            {
                childNode = xmlDoc.CreateNode("", childNodeName, "");

                fatherNode.AppendChild(childNode);
            }
            childNode.InnerText = value;
            xmlDoc.Save(path);
        }


        private static string PostWebRequest(string postUrl, string paramData, Encoding dataEncode)
        {
            string ret = string.Empty;
            try
            {
                byte[] byteArray = dataEncode.GetBytes(paramData); //转化
                HttpWebRequest webReq = (HttpWebRequest)WebRequest.Create(new Uri(postUrl));
                webReq.Method = "POST";
                webReq.ContentType = "application/x-www-form-urlencoded";
                webReq.ContentLength = byteArray.Length;
                Stream newStream = webReq.GetRequestStream();
                newStream.Write(byteArray, 0, byteArray.Length);//写入参数
                newStream.Close();
                HttpWebResponse response = (HttpWebResponse)webReq.GetResponse();
                StreamReader sr = new StreamReader(response.GetResponseStream(), Encoding.Default);
                ret = sr.ReadToEnd();
                sr.Close();
                response.Close();
                newStream.Close();
            }
            catch (Exception ex)
            {

            }
            return ret;
        }
    }
}
