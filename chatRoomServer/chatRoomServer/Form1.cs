using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Fleck;
using Newtonsoft.Json;
using Beans;

namespace chatRoomClient
{
    public partial class Form1 : Form
    {
        Random rd = new Random();
        List<MessageInfo> messageArray = new List<MessageInfo>();
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            FleckLog.Level = LogLevel.Debug;
            var allSockets = new List<IWebSocketConnection>();
            //IDictionary<string, IWebSocketConnection> dic_Sockets = new Dictionary<string,IWebSocketConnection>();
            var server = new WebSocketServer("ws://192.168.170.1:7181");
            richTextBox1.Text = "服务已启动";
            server.Start(socket =>
            {
                socket.OnOpen = () => //当建立Socket链接时执行此方法
                {
                    allSockets.Add(socket);
                };

                socket.OnClose = () =>// 当关闭Socket链接时执行此方法
                {
                    allSockets.Remove(socket);
                };

                socket.OnMessage = message =>// 接收客户端发送过来的信息
                {
                    var NewMesage = DataContractJsonDeserialize<MessageInfo>(message);
                    messageArray.Add(NewMesage);
                    string oldMessage = ToJSON(messageArray);
                    for (int i = 0;i < allSockets.Count;i++)
                    {
                        allSockets[i].Send(oldMessage);
                    }
                    
                };
            });

            //var input = Console.ReadLine();
            //while (input != "exit")
            //{
            //    foreach (var socket in allSockets.ToList())
            //    {
            //        socket.Send(input);
            //    }
            //    input = Console.ReadLine();
            //}
        }
        public static T DataContractJsonDeserialize<T>(string json)
        {
            var serializer = JsonConvert.DeserializeObject<T>(json);
            return serializer;
        }
        public static string ToJSON(object o)
        {
            if (o == null)
            {
                return null;
            }
            return JsonConvert.SerializeObject(o);
        }
    }
}
