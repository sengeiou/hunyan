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
     show:false,
     biao_id:this.Base.options.biao_id
   })
  }
  onMyShow() {
    var that = this;
    var api = new ShangjiaApi;
    var arr =[];
    var  biao_id = this.Base.getMyData().biao_id;
    api.shangjialist({}, (shangjialist) => {

      for(var i=0;i<shangjialist.length;i++){
        for(var j=0;j<shangjialist[i].biaoqian.length;j++){
          if (shangjialist[i].biaoqian[j].id == biao_id){
            that.Base.setPageTitle(shangjialist[i].biaoqian[j]);
            arr.push(shangjialist[i]);
          }
        }
      }
     
      this.Base.setMyData({ shangjialist:arr })
    })
  }
  qiehuan(){
    var show = this.Base.getMyData().show;
    show=!show;
    this.Base.setMyData({ show})
  }
  todetail(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.sendmsg = content.sendmsg;
body.qiehuan = content.qiehuan;
body.todetail = content.todetail;
Page(body)