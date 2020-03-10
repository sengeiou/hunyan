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
    super.onLoad(options);
    this.Base.setMyData({
      city:'',
      fuwu:''
    })
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    var memberinfo = this.Base.getMyData().memberinfo;
    this.Base.setMyData({memberinfo})
    instapi.indexbanner({}, (indexbanner) => {
      this.Base.setMyData({
        indexbanner
      });
    });
    var shangjiaapi = new ShangjiaApi();
    shangjiaapi.type({}, (type)=>{
      this.Base.setMyData({
        type
      })
    })
  }

  bindRegionChange(e) {

    console.log(e);
    var city = e.detail.value[0] + " " + e.detail.value[1] + " " + e.detail.value[2]
    console.log(city);
    // return
    this.Base.setMyData({
      city: city
    })

  }
  fuwuFn(e){
    console.log(e);
    var type = this.Base.getMyData().type;
    var cur = e.detail.value;
    var name = type[cur].name;
    var fuwu_id=type[cur].id;
    console.log(type,name)
    this.Base.setMyData({
      fuwu:name,
      fuwu_id: fuwu_id
    })
  }
  fuwutkFn(){
    wx.navigateTo({
      url: '/pages/fuwu/fuwu',
    })
  }
  yinsifn(){
    wx.navigateTo({
      url: '/pages/yinsi/yinsi',
    })
  }
  huoqu(){
    var city = this.Base.getMyData().city;
    var fuwu = this.Base.getMyData().fuwu;
    var fuwu_id = this.Base.getMyData().fuwu_id;
    console.log(city,fuwu,'pp')
    if(city==''){
      city='北京市';
    }
    wx.navigateTo({
      url: '/pages/hunyan/hunyan?city=' + city + '&fuwu=' + fuwu + '&fuwu_id=' + fuwu_id,
    })

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindRegionChange = content.bindRegionChange;
body.fuwuFn = content.fuwuFn;
body.fuwutkFn = content.fuwutkFn;
body.yinsifn = content.yinsifn;
body.huoqu = content.huoqu;
Page(body)