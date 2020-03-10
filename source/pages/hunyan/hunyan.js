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
    options.fuwu_id=1;
    super.onLoad(options);
    this.Base.setMyData({
      // city: this.Base.options.city,
      city:'北京市 北京市',
      fuwu:this.Base.options.fuwu
    })
  }
  onMyShow() {
    var that = this;
    var shangjiaapi = new ShangjiaApi();
    shangjiaapi.lunbo({}, (lunbo) => {
      this.Base.setMyData({
        lunbo
      });
    });
   
    shangjiaapi.type({}, (type) => {
      this.Base.setMyData({
        type
      })
    })
    this.getbiaoqian();
  }

  getbiaoqian(){
    var shangjiaapi = new ShangjiaApi();
    shangjiaapi.biaoqian({ shanjialeixin_id: this.Base.options.fuwu_id}, (biaoqian) => {
      this.Base.setMyData({
        biaoqian
      });
    });
  }
  
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getbiaoqian = content.getbiaoqian;
Page(body)