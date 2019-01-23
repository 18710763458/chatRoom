var app = new Vue({
	el: "#app",
	data: {
		test: "简单聊天室",
		importString:"",//输入框的内容
		messageLog:[],//收到的消息
		xing:["赵","钱","孙","李","周","吴","郑","王","冯","陈","褚"],
		ming:["彦龙", "浩鹏","天一", "铁刚","君昊","国艳","恩德","文雅","文轩","文博"],
		name:"",
		sendMessage:{},
		otherNameArray :[]
	},
	methods: {
		randomName(min,max){
			return Math.floor(Math.random() * (max - min) + min); 
		},
		initWebSocket() { //初始化weosocket
			const wsuri = 'ws://192.168.170.1:7181'; //ws地址
			this.websock = new WebSocket(wsuri);
			this.websock.onopen = this.websocketonopen;

			this.websock.onerror = this.websocketonerror;

			this.websock.onmessage = this.websocketonmessage;
			this.websock.onclose = this.websocketclose;
		},

		websocketonopen() {
			console.log("WebSocket连接成功");
		},
		websocketonerror(e) { //错误
			console.log("WebSocket连接发生错误");
		},
		websocketonmessage(e) { //数据接收

			//messageLog.push(e.data);
//			setInterval(function(){
//				
//			},1000)
//			console.log(e.data)
			this.messageLog = []
			this.otherNameArray = []
			let result =  JSON.parse(e.data);
			console.log(result)
			for(let i = 0;i < result.length;i++){
				this.messageLog.push(result[i]);
				if(this.otherNameArray.indexOf(result[i].name) < 0){
					this.otherNameArray.push(result[i].name);
				}
			}
		},

		websocketsend(e){ //数据发送
			console.log(e)
			if(e.type == "keypress"){
				
				if(e.keyCode == 13){
					this.sendMessage.name = this.name
					this.sendMessage.message = this.importString
					this.websock.send(JSON.stringify(this.sendMessage));
					this.importString = ""
				}
			}else{
				console.log(555)
				this.sendMessage.name = this.name
				this.sendMessage.message = this.importString
				this.websock.send(JSON.stringify(this.sendMessage));
				this.importString = ""
			}
			
		},

		websocketclose(e) { //关闭
			this.websock.send("exit");
			//this.websock.close();
		},
	},
	mounted() {
      this.initWebSocket()
      if(!sessionStorage.getItem("newName")){
      	 this.name = this.xing[this.randomName(0,this.xing.length - 1)] + this.ming[this.randomName(0,this.ming.length - 1)];
//		console.log(this.name);
		sessionStorage.setItem("newName",this.name);
      }else{
      	this.name = sessionStorage.getItem("newName");
      }
   },
   created(){

   },
    destroyed(){
      this.websocketclose();
    }
})