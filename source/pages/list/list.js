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
     cityqu_id: this.Base.options.cityqu_id,
     city_id: this.Base.options.city_id
   })
  }
  onMyShow() {
    var that = this;
    var api = new ShangjiaApi;
    var arr =[];
    var biao_id = this.Base.getMyData().biao_id;
    var cityqu_id = this.Base.getMyData().cityqu_id;
    var city_id = this.Base.getMyData().city_id;
    api.biaodetail({ id: biao_id, city_id, cityqu_id }, (biaodetail)=>{
      for (var k = 0; k < biaodetail.shanjia.length; k++) {
        biaodetail.shanjia[k].topnum = (biaodetail.shanjia[k].taocan.length + biaodetail.shanjia[k].biao.length) > 10 ? 290 - ((biaodetail.shanjia[k].taocan.length + biaodetail.shanjia[k].biao.length) / 10) * 18 : 290
      }
      var shangjialist = biaodetail.shanjia;
      this.Base.setPageTitle(biaodetail);
      this.Base.setMyData({ biaodetail, shangjialist})
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