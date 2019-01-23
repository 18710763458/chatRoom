using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Beans
{
    public class MessageInfo
    {
        [DataMember]
        public string name { get; set; }
        [DataMember]
        public string message { get; set; }
    }
}