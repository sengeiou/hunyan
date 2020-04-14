// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ShangjiaApi } from "../../apis/shangjia.api.js";
import { CityApi } from "../../apis/city.api.js";
import {
  ShanjiaApi
} from "../../apis/shanjia.api.js";
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
     StatusBar: getApp().globalData.StatusBar,
     CustomBar: getApp().globalData.CustomBar,
     Custom: getApp().globalData.Custom,
     show:false,
     biao_id:this.Base.options.biao_id,
     city_id: this.Base.options.city_id,
     biaoname:this.Base.options.biaoname,
     city: this.Base.options.city,
     cityqu_id: '',
     shangquan_id: '',
     price_id: '',
     xingji_id: '',
     zhuoshu_id: '',
     isshare: this.Base.options.isshare
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
    var date = new Date();
    var year = date.getFullYear();
    var mon = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var starttime = year + '/' + mon + '/' + day;
    api.biaodetail({
      id: biao_id
    }, (biaodetail) => {
      this.Base.setMyData({
        biaodetail,
        starttime
      })
    })
    this.getcity();
    this.quyu();
    this.yusuan();
    this.zhuoshu();
  }
  getcity() {
    var cityapi = new CityApi();
    cityapi.citylist({}, (citylist) => {
      this.Base.setMyData({
        citylist
      })
    })
  }
  quyu() {
    var cityapi = new CityApi();
    var city_id = this.Base.getMyData().city_id;
    cityapi.qulist({
      city_id: city_id
    }, (qulist) => {
      this.Base.setMyData({
        qulist
      })
    })
  }
  yusuan() {
    var shanjiaapi = new ShanjiaApi();
    shanjiaapi.yusuanlist({}, (yusuanlist) => {
      this.Base.setMyData({
        yusuanlist
      })
    })
  }
  zhuoshu() {
    var shanjiaapi = new ShanjiaApi();
    shanjiaapi.zhuoshulist({}, (zhuoshulist) => {
      this.Base.setMyData({
        zhuoshulist
      })
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
  onShareAppMessage() {
    console.log(this.Base.getMyData().city)
    return {
      title: '',
      desc: '',
      path: '/pages/list/list?biao_id=' + this.Base.getMyData().biao_id + '&city_id=' + this.Base.getMyData().city_id + "&biaoname=" + this.Base.getMyData().biaoname + "&city=" + this.Base.getMyData().city,
    }
  }
  chenshiFn(e) {
    console.log(e)
    var citylist = this.Base.getMyData().citylist;
    var cur = e.detail.value;
    var city_id = citylist[cur].id;
    var city = citylist[cur].name;
    this.Base.setMyData({
      city,
      city_id
    })
    this.onMyShow();
  }
  cityFn(e) {
    var qulist = this.Base.getMyData().qulist;
    var cur = e.detail.value;
    var name = qulist[cur].name;
    var qu_id = qulist[cur].id;
    this.Base.setMyData({
      cityqu: name,
      cityqu_id: qu_id
    })
    this.save();
  }
  priceFn(e) {
    var yusuanlist = this.Base.getMyData().yusuanlist;
    var cur = e.detail.value;
    var name = yusuanlist[cur].name;
    var qu_id = yusuanlist[cur].id;
    this.Base.setMyData({
      prices: name,
      prices_id: qu_id
    })
  }
  zhuoFn(e) {
    var zhuoshulist = this.Base.getMyData().zhuoshulist;
    var cur = e.detail.value;
    var name = zhuoshulist[cur].name;
    var qu_id = zhuoshulist[cur].id;
    this.Base.setMyData({
      zhuo: name,
      zhuo_id: qu_id
    })
  }
  save() {
    var biao_id = this.Base.getMyData().biao_id;
    var city_id = this.Base.getMyData().city_id;
    var cityqu_id = this.Base.getMyData().cityqu_id;
    var shangquan_id = this.Base.getMyData().shangquan_id;
    var api = new ShangjiaApi();

    var price_id = this.Base.getMyData().price_id;
    var zhuoshu_id = this.Base.getMyData().zhuoshu_id;
    var xingji_id = this.Base.getMyData().xingji_id;
    api.shangjialist({
      biaoqian_id: biao_id,
      city_id: city_id,
      price_id: price_id,
      cityqu_id: cityqu_id,
      shangquan_id: shangquan_id,
      zhuoshu_id: zhuoshu_id,
      xingji_id: xingji_id
    }, (shangjialist) => {

      this.Base.setMyData({
        shangjialist: shangjialist,
        chuxian: ''
      })
    })
  }
  bindDateChange(e) {
    this.Base.setMyData({
      date: e.detail.value
    })
  }
  getzhixuan() {
    var quyu = this.Base.getMyData().cityqu;
    var hunqi = this.Base.getMyData().date;
    var yusuan = this.Base.getMyData().prices;
    var zhuoshu = this.Base.getMyData().zhuo;
    var city = this.Base.getMyData().city;
    if (quyu.trim() == '') {
      this.toast('区域不能为空！');
      return
    }
    if (hunqi.trim() == '') {
      this.toast('婚期不能为空！');
      return
    }
    if (yusuan.trim() == '') {
      this.toast('预算不能为空！');
      return
    }
    if (zhuoshu.trim() == '') {
      this.toast('桌数不能为空！');
      return
    }
    var api = new ShangjiaApi();
    var cityman = this.Base.getMyData().cityman;
    api.addzhixuan({
      city,
      quyu,
      hunqi,
      yusuan,
      zhuoshu,
      mobile: this.Base.getMyData().memberinfo.mobile
    }, (res) => {
      console.log(res);
      if (res) {
        this.toast('发送成功');
      }
      // for(var i=0;i<cityman.length;i++){


      // }

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
body.onShareAppMessage = content.onShareAppMessage;
body.getcity = content.getcity;
body.yusuan = content.yusuan;
body.zhuoshu = content.zhuoshu;
body.quyu = content.quyu;
body.priceFn = content.priceFn;
body.chenshiFn = content.chenshiFn;
body.zhuoFn = content.zhuoFn;
body.shaixuan = content.shaixuan;
body.cityFn = content.cityFn;
body.save = content.save;
body.bindDateChange = content.bindDateChange;
body.getzhixuan = content.getzhixuan;
Page(body)