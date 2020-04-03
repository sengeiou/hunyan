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
    // options.biao_id=1;
    // options.content='123';

    super.onLoad(options);
   this.Base.setMyData({
     show:false,
     biao_id:this.Base.options.biao_id,
     city_id: this.Base.options.city_id,
     biaoname:this.Base.options.biaoname
   })
   
  }
  onMyShow() {
    var that = this;
    var api = new ShangjiaApi;
    var arr =[];
    var biao_id = this.Base.getMyData().biao_id;
    var city_id = this.Base.getMyData().city_id;
    api.shangjialist({ biaoqian_id: biao_id, city_id}, (shangjialist)=>{
      
      this.Base.setMyData({ shangjialist })
    })
    wx.setNavigationBarTitle({
      title: this.Base.options.biaoname,
    })
  }
  
  qiehuan(){
    var show = this.Base.getMyData().show;
    this.Base.setMyData({ show: !show})
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