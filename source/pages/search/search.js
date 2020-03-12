// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ShangjiaApi } from "../../apis/shangjia.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    // options.content='123';
   
    super.onLoad(options);
    this.Base.setMyData({
      content: this.Base.options.content,
      focus:false
    })
  }
  onMyShow() {
    var that = this;
    var api = new ShangjiaApi;
    var content = this.Base.getMyData().content;
    api.shangjialist({}, (shangjialist)=>{
      var arr = [];
      for(var i=0;i<shangjialist.length;i++){
        if (shangjialist[i].guanjianzi.indexOf(content)>-1){
          arr.push(shangjialist[i]);
        }
      }
      this.Base.setMyData({ shangjialist:arr})
    })
  }
  setPageTitle(instinfo) {
    wx.setNavigationBarTitle({
      title: '搜索',
    })
  }
  sendmsg(e){
    var content = e.detail.value;
    this.Base.setMyData({
      content,
      focus:false
    })
    this.onMyShow();
  }
  cancel(){
    this.Base.setMyData({
      content:''
    })
    this.onMyShow();
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.sendmsg = content.sendmsg;
body.cancel = content.cancel;
Page(body)