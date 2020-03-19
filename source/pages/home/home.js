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
    super.onLoad(options);
    this.Base.setMyData({
      city:'',
      fuwu:'',
      StatusBar: getApp().globalData.StatusBar,
      CustomBar: getApp().globalData.CustomBar,
      Custom: getApp().globalData.Custom,
    })
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    var memberinfo = this.Base.getMyData().memberinfo;
    this.Base.setMyData({memberinfo})

    instapi.indexbanner({}, (indexbanner) => {
      this.Base.setMyData({
        indexbanner, currentimg:indexbanner[0].img
      });
    });

    var shangjiaapi = new ShangjiaApi();
    shangjiaapi.type({}, (type)=>{
      this.Base.setMyData({
        type
      })
    })

    var cityapi = new CityApi();
    cityapi.citylist({}, (citylist)=>{
      var multiArray = [[],[]];
      var customIndex=[0,0];
      for(var i=0;i<citylist.length;i++){
        multiArray[0].push(citylist[i]);
       
      }
      for (var j = 0; j < citylist[customIndex[0]].qu.length; j++) {
        multiArray[1].push(citylist[customIndex[0]].qu[j]);
      }
     
      
      this.Base.setMyData({ citylist, multiArray, customIndex})
    })

  }

  bindRegionChange(e) {

    console.log(e);
   var citylist = this.Base.getMyData().citylist;
    if (e.detail.value[1]==null){
      e.detail.value[1]=0;
    }
    var city = citylist[e.detail.value[0]].name + citylist[e.detail.value[0]].qu[e.detail.value[1]].name
    console.log(city);
    var city1 = citylist[e.detail.value[0]].name;
    var cityqu = citylist[e.detail.value[0]].qu[e.detail.value[1]].name
    // return
    this.Base.setMyData({
      city: city,city1,cityqu
    })

  }
  bindMultiPickerColumnChange(e){
    console.log(e,'kkk');
    var customIndex = this.Base.getMyData().customIndex;
    var multiArray = this.Base.getMyData().multiArray;
    var citylist = this.Base.getMyData().citylist;
    customIndex[e.detail.column] = e.detail.value;
    console.log(customIndex,'customIndex');

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
    var city1 = this.Base.getMyData().city1;
    var cityqu = this.Base.getMyData().cityqu;
    var fuwu = this.Base.getMyData().fuwu;
    var fuwu_id = this.Base.getMyData().fuwu_id;
    console.log(city,fuwu,'pp')
    var memberinfo=this.Base.getMyData().memberinfo;
    console.log(memberinfo);
    if(city=='' && memberinfo.city==''){
      city1='北京市';
    }else if(city==''){
      city=memberinfo.city+memberinfo.qu;
      city1 = memberinfo.city;
        cityqu = memberinfo.qu;
    }
    console.log(city)
    wx.navigateTo({
      url: '/pages/hunyan/hunyan?city=' + city1 + '&cityqu=' + cityqu + '&fuwu=' + fuwu + '&fuwu_id=' + fuwu_id,
    })

  }
  bannerclick(e){
    var id = e.currentTarget.id;
    if (id != 0) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + id,
      })
    }
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
body.bindMultiPickerColumnChange = content.bindMultiPickerColumnChange;
body.bannerclick = content.bannerclick;
Page(body)