// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  ShangjiaApi
} from "../../apis/shangjia.api.js";
import {
  ShanjiaApi
} from "../../apis/shanjia.api.js";
import {
  CityApi
} from "../../apis/city.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    // options.biao_id = 1;
    // options.content='123';
    // options.city_id = 1;

    super.onLoad(options);
    this.Base.setMyData({
      StatusBar: getApp().globalData.StatusBar,
      CustomBar: getApp().globalData.CustomBar,
      Custom: getApp().globalData.Custom,
      biao_id: this.Base.options.biao_id,
      city_id: this.Base.options.city_id,
      biaoname: this.Base.options.biaoname,
      city: this.Base.options.city,
      chuxian: '',
      isshare:this.Base.options.isshare
    })

  }
  onMyShow() {
    var that = this;
    var api = new ShangjiaApi;
    var arr = [];
    var biao_id = this.Base.getMyData().biao_id;
    var city_id = this.Base.getMyData().city_id;
    var date = new Date();
    var year = date.getFullYear();
    var mon = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var starttime = year + '/' + mon+'/'+day;
    console.log(starttime,'sttt')
    api.shangjialist({
      biaoqian_id: biao_id,
      city_id
    }, (shangjialist) => {

      this.Base.setMyData({
        shangjialist,
        starttime,
        cityqu: '',
        date: '',
        prices: '',
        zhuo: '',
        seq: -1,
        quan: -1,
        jiage: -1,
        xinji: -1,
        zhush: -1,
        cityqu_id: '',
        shangquan_id: '',
        price_id: '',
        xingji_id: '',
        zhuoshu_id: '',
      })
    })
    api.biaodetail({
      id: biao_id
    }, (biaodetail) => {
      this.Base.setMyData({
        biaodetail
      })
    })
    this.quyu();
    this.yusuan();
    this.zhuoshu();
    this.getxingji();
    this.getcityman();
    this.getcity();
  }
  getcity(){
    var cityapi = new CityApi();
    cityapi.citylist({}, (citylist) => {
      this.Base.setMyData({
        citylist
      })
    })
  }
  getcityman(){
    var cityapi = new CityApi();
    var city_id = this.Base.getMyData().city_id;
    cityapi.cityman({
      city_id: city_id
    }, (cityman) => {
      this.Base.setMyData({
        cityman
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
  getxingji(){
    var shanjiaapi = new ShanjiaApi();
    shanjiaapi.xingjilist({}, (xingjilist) => {
      this.Base.setMyData({
        xingjilist
      })
    })
  }
  qiehuan() {
    var show = this.Base.getMyData().show;
    this.Base.setMyData({
      show: !show
    })
  }
  todetail(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
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
  bindDateChange(e) {
    this.Base.setMyData({
      date: e.detail.value
    })
  }
  shaixuan(e) {
    var cur = e.currentTarget.id;
    var chuxian = this.Base.getMyData().chuxian;
    if (chuxian==cur){
      this.Base.setMyData({
        chuxian:''
      })
    }else {
      this.Base.setMyData({
        chuxian: cur
      })
    }
    
    console.log(e)
    var query = wx.createSelectorQuery().in(this);
    var that = this;
    console.log(query);
    query.select("#sx").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      console.log('res', res)
      for (var i = 0; i < res.length; i++) {
        if (res[i] != null) {
          if ("sx" == res[i].id) {
            wx.pageScrollTo({
              scrollTop: res[i].height - 130,
              duration: 300,
            })
          }
        }

      }
    })
  }
  xuanqu(e) {
    var idx = e.currentTarget.id;
    var qulist = this.Base.getMyData().qulist;
    var biao_id = this.Base.getMyData().biao_id;
    var city_id = this.Base.getMyData().city_id;
    // console.log(qulist[idx])
    // return
    if(idx=="-1"){
      var cityqu_id ="";
    }else {
      var cityqu_id = qulist[idx].id;
    }
    var price_id = this.Base.getMyData().price_id;
    var zhuoshu_id = this.Base.getMyData().zhuoshu_id;
    var xingji_id = this.Base.getMyData().xingji_id;
    var api = new ShangjiaApi();
      this.Base.setMyData({
        seq: idx,
        cityqu_id: cityqu_id
      })
  }
  xuanshanqu(e){
   var seq = this.Base.getMyData().seq;
    var qulist = this.Base.getMyData().qulist;
    var biao_id = this.Base.getMyData().biao_id;
    var city_id = this.Base.getMyData().city_id;
    var sq_id = e.currentTarget.dataset.sq;
    var quan = e.currentTarget.dataset.squan;
    var price_id = this.Base.getMyData().price_id;
    var cityqu_id=this.Base.getMyData().cityqu_id;
    var zhuoshu_id = this.Base.getMyData().zhuoshu_id;
    var xingji_id = this.Base.getMyData().xingji_id;
    var api = new ShangjiaApi();
    api.shangjialist({
      biaoqian_id: biao_id,
      city_id: city_id,
      cityqu_id: cityqu_id,
      shangquan_id: sq_id,
      price_id: price_id,
      zhuoshu_id: zhuoshu_id,
      xingji_id: xingji_id
    }, (shangjialist) => {

      this.Base.setMyData({
        shangjialist: shangjialist,
        chuxian: '',
        quan: quan,
        shangquan_id: sq_id
      })
    })
  }
  xuanprices(e){
    console.log(e)
    var idx = e.currentTarget.id;
    var yusuanlist =this.Base.getMyData().yusuanlist;
    
      var price_id = yusuanlist[idx].id;
    
      this.Base.setMyData({
        price_id: price_id,
        jiage: idx,
      })
  
  }
  xuanzuo(e){
    var idx = e.currentTarget.id;
    var zhuoshulist = this.Base.getMyData().zhuoshulist;
    this.Base.setMyData({
      zhuoshu_id: zhuoshulist[idx].id,
      zhush: idx,
    })
  }
  save(){
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
        chuxian:''
      })
    })
  }
  xuanxingji(e){
    console.log(e)
    var idx = e.currentTarget.id;
    var xingjilist = this.Base.getMyData().xingjilist;
    var biao_id = this.Base.getMyData().biao_id;
    var city_id = this.Base.getMyData().city_id;
    var cityqu_id = this.Base.getMyData().cityqu_id;
    var shangquan_id = this.Base.getMyData().shangquan_id;
    var price_id=this.Base.getMyData().price_id;
    var api = new ShangjiaApi();

      var xingji_id = xingjilist[idx].id;
    

    this.Base.setMyData({
      xinji: idx,
      xingji_id: xingji_id
    })

  }
  getzhixuan(){
    var quyu = this.Base.getMyData().cityqu;
    var hunqi = this.Base.getMyData().date;
    var yusuan = this.Base.getMyData().prices;
    var zhuoshu = this.Base.getMyData().zhuo;
    var city=this.Base.getMyData().city;
    if (quyu.trim()==''){
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
      mobile:this.Base.getMyData().memberinfo.mobile
    },(res)=>{
      console.log(res);
      if(res){
        this.toast('发送成功');
      }
      // for(var i=0;i<cityman.length;i++){
       

      // }
      
    })
  }
  quxiao(){
    this.Base.setMyData({
      chuxian:''
    })
  }
  chenshiFn(e){
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
      path: '/pages/jiudianlist/jiudianlist?biao_id=' + this.Base.getMyData().biao_id + '&city_id=' + this.Base.getMyData().city_id + "&biaoname=" + this.Base.getMyData().biaoname + "&city=" + this.Base.getMyData().city+'&isshare=1',
    }
  }
  backhome(){
    wx.navigateTo({
      url: '/pages/home/home',
    })
  }
  zhidin() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
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
body.quyu = content.quyu;
body.cityFn = content.cityFn;
body.bindDateChange = content.bindDateChange;
body.yusuan = content.yusuan;
body.zhuoshu = content.zhuoshu;
body.priceFn = content.priceFn;
body.zhuoFn = content.zhuoFn;
body.shaixuan = content.shaixuan;
body.xuanqu = content.xuanqu;
body.xuanshanqu = content.xuanshanqu;
body.xuanprices = content.xuanprices;
body.getxingji = content.getxingji;
body.xuanxingji = content.xuanxingji;
body.getzhixuan = content.getzhixuan;
body.xuanzuo = content.xuanzuo;
body.save = content.save;
body.quxiao = content.quxiao;
body.getcityman = content.getcityman;
body.getcity = content.getcity;
body.chenshiFn = content.chenshiFn;
body.todetail = content.todetail;
body.onShareAppMessage = content.onShareAppMessage;
body.backhome = content.backhome;
body.zhidin = content.zhidin;
Page(body)