// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ShangjiaApi } from "../../apis/shangjia.api.js";
import { CityApi } from "../../apis/city.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    // options.fuwu_id=1;
    var fuwu_id = options.fuwu_id;
    if (fuwu_id == "undefined") {
      fuwu_id = 1;
    }
    super.onLoad(options);
    this.Base.setMyData({
      StatusBar: getApp().globalData.StatusBar,
      CustomBar: getApp().globalData.CustomBar,
      Custom: getApp().globalData.Custom,
      city: this.Base.options.city,
      // city:'北京市',
      cityqu: this.Base.options.cityqu,
      fuwu_id: fuwu_id,
      lianwo:false,
    })
    this.getcity();
  }
  onMyShow() {
    var that = this;
   
    this.getbiaoqian();
    this.getlist();
    this.gettype();
    
    this.Base.setMyData({
      jiazai: false
    })
  }
  gettype(){
    var shangjiaapi = new ShangjiaApi();
    var lunbo = [];
    var duanlunbo = [];
    var seq = 0;
    var fuwu_id = this.Base.getMyData().fuwu_id;
    var city_id = this.Base.getMyData().city_id;
    shangjiaapi.type({city_id:city_id}, (type) => {
  
      for (var i = 0; i < type.length; i++) {
        if (type[i].id == fuwu_id) {
          seq = type[i].seq - 1;
          lunbo = type[i].dinbu;
          duanlunbo = type[i].zhonbu;
        }
      }
      this.Base.setMyData({
        type, lunbo, duanlunbo, seq
      })
    })
  }
getcity(){
  var cityapi = new CityApi();
  var city = this.Base.getMyData().city;
  cityapi.citylist({}, (citylist) => {
    var multiArray = [[], []];
    var customIndex = [0, 0];
    for (var i = 0; i < citylist.length; i++) {
      multiArray[0].push(citylist[i]);
      if (citylist[i].name==city){
        var city_id = citylist[i].id;
      }
    }
    for (var j = 0; j < citylist[customIndex[0]].qu.length; j++) {
      multiArray[1].push(citylist[customIndex[0]].qu[j]);
    }


    this.Base.setMyData({ citylist, multiArray, customIndex, city_id })
  })
}
  getbiaoqian(){
    var shangjiaapi = new ShangjiaApi();
    var fuwu_id = this.Base.getMyData().fuwu_id;
    shangjiaapi.biaoqian({ shanjialeixin_id: fuwu_id}, (biaoqian) => {

      this.Base.setMyData({
        biaoqian
      });
    });
  }

  getlist(){

    var shangjiaapi = new ShangjiaApi();
    var that = this;
    var arr = [];
    var fuwu_id = this.Base.getMyData().fuwu_id;
    var city_id = this.Base.getMyData().city_id;
    shangjiaapi.shangjialist({ city_id: city_id}, (shangjialist) => {
      
      for(var i=0;i<shangjialist.length;i++){
        var baiqianname = '';
        var index = shangjialist[i].money.indexOf('.');
        
        shangjialist[i].zhenshu = shangjialist[i].money.slice(0,index+1);
        shangjialist[i].xiaoshu = shangjialist[i].money.slice(index + 1, index+3);

        // shangjialist[i].typename = shangjialist[i].types[0];
        for(var j=0;j<shangjialist[i].types.length;j++){
          if (shangjialist[i].types[j].id == fuwu_id ){
            arr.push(shangjialist[i]);
          }
        }
        for(var k=0;k<shangjialist[i].biaoqian.length;k++){
         
          if(baiqianname!=''){
            // baiqianname +='/'+ shangjialist[i].biaoqian[k].name;
          }else {
            baiqianname += shangjialist[i].biaoqian[0].name;
          }
        }
        shangjialist[i].baiqianname = baiqianname;
      }

      this.Base.setMyData({
        shangjialist: arr
      });
    });
  }
  qiehuan(e){
    console.log(e);
    var idx = e.currentTarget.dataset.currentidx;
    var id = e.currentTarget.id;
    // this.Base.options.fuwu_id=id;
    var fuwu_id = this.Base.getMyData().fuwu_id;
    this.Base.setMyData({
      seq:idx,
      fuwu_id:id,
      lianwo:false
    })
    this.onMyShow();
  }
  sendmsg(e){
    console.log(e);
    var content = e.detail.value;
    var content2 = this.Base.getMyData().content2;
    if((content!='' && content!=undefined) || content2!=undefined){
      if(content2!=undefined){
        content = content2;
      }
      wx.navigateTo({
        url: '/pages/search/search?content='+content,
      })
    }else {
      wx.showToast({
        title: '请输入搜索内容',
        icon:'none'
      })
      return 
    }
  }
  conFn(e){
      this.Base.setMyData({
        content2:e.detail.value
      })
  }
  bindRegionChange(e) {

    console.log(e);
    var citylist = this.Base.getMyData().citylist;
    if (e.detail.value[1] == null) {
      e.detail.value[1] = 0;
    }

    var city = citylist[e.detail.value[0]].name ;
    console.log(city);
    var cityqu = citylist[e.detail.value[0]].qu[e.detail.value[1]].name;
 
    this.Base.setMyData({
      city: city,
      cityqu: cityqu,
      city_id: citylist[e.detail.value[0]].id
    })
    this.onMyShow();

  }
  bindMultiPickerColumnChange(e) {
    console.log(e, 'kkk');
    var customIndex = this.Base.getMyData().customIndex;
    var multiArray = this.Base.getMyData().multiArray;
    var citylist = this.Base.getMyData().citylist;
    customIndex[e.detail.column] = e.detail.value;
    console.log(customIndex, 'customIndex');

      for (var j = 0; j < citylist.length; j++) {
        var arr = [];
        if (j == customIndex[0]) {
          for (var i = 0; i < citylist[j].qu.length; i++) {
            arr.push(citylist[j].qu[i]);
          }
          multiArray[1] = arr;
        }

      }
    

    console.log(multiArray, 'customIndex');

    this.Base.setMyData({
      multiArray,
      customIndex
    })

  }
  biaodetail(e){
    console.log(e);
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/list/list?biao_id='+id,
    })
  }
  todetail(e){
    var id = e.currentTarget.id;
    if(id!=0){
      wx.navigateTo({
        url: '/pages/detail/detail?id='+id,
      })
    }
  }
  onReachBottom(){
    this.Base.setMyData({
      jiazai: true
    });
    // this.onMyShow();
  }
  aboutus(){
    wx.navigateTo({
      url: '/pages/lianxi/lianxi',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getbiaoqian = content.getbiaoqian;
body.getlist = content.getlist;
body.qiehuan = content.qiehuan;
body.sendmsg = content.sendmsg;
body.bindMultiPickerColumnChange = content.bindMultiPickerColumnChange;
body.bindRegionChange = content.bindRegionChange;
body.biaodetail = content.biaodetail;
body.getcity = content.getcity;
body.gettype = content.gettype;
body.conFn = content.conFn;
body.todetail = content.todetail;
body.onReachBottom = content.onReachBottom;
body.aboutus = content.aboutus;
Page(body)