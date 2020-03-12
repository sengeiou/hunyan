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
    options.fuwu_id=1;
    super.onLoad(options);
    this.Base.setMyData({
      city: this.Base.options.city,
      // city:'北京市 北京市',
      fuwu:this.Base.options.fuwu
    })
  }
  onMyShow() {
    var that = this;
    var shangjiaapi = new ShangjiaApi();
    // shangjiaapi.lunbo({}, (lunbo) => {
    //   this.Base.setMyData({
    //     lunbo
    //   });
    // });
    var lunbo = [];
    var duanlunbo =[];
    var seq = 0;
    shangjiaapi.type({}, (type) => {
      for(var i=0;i<type.length;i++){
        if(type[i].id == this.Base.options.fuwu_id){
          seq = type[i].seq-1;
          lunbo=type[i].dinbu;
          duanlunbo=type[i].zhonbu;
        }
      }
      this.Base.setMyData({
        type,lunbo,duanlunbo,seq
      })
    })
    this.getbiaoqian();
    this.getlist();

    var cityapi = new CityApi();
    cityapi.citylist({}, (citylist) => {
      var multiArray = [[], []];
      var customIndex = [0, 0];
      for (var i = 0; i < citylist.length; i++) {
        multiArray[0].push(citylist[i]);

      }
      for (var j = 0; j < citylist[customIndex[0]].qu.length; j++) {
        multiArray[1].push(citylist[customIndex[0]].qu[j]);
      }


      this.Base.setMyData({ citylist, multiArray, customIndex })
    })

  }

  getbiaoqian(){
    var shangjiaapi = new ShangjiaApi();
    shangjiaapi.biaoqian({ shanjialeixin_id: this.Base.options.fuwu_id}, (biaoqian) => {

      this.Base.setMyData({
        biaoqian
      });
    });
  }

  getlist(){

    var shangjiaapi = new ShangjiaApi();
    var that = this;
    var arr = [];
    shangjiaapi.shangjialist({}, (shangjialist) => {

      for(var i=0;i<shangjialist.length;i++){
        for(var j=0;j<shangjialist[i].types.length;j++){
          if (shangjialist[i].types[j].id == that.Base.options.fuwu_id ){
            arr.push(shangjialist[i]);
          }
        }
      }

      this.Base.setMyData({
        shangjialist:arr
      });
    });
  }
  qiehuan(e){
    console.log(e);
    var idx = e.currentTarget.dataset.currentidx;
    var id = e.currentTarget.id;
    this.Base.options.fuwu_id=id;
    this.Base.setMyData({
      seq:idx
    })
    this.onMyShow();
  }
  sendmsg(e){
    console.log(e);
    var content = e.detail.value;
    if(content!=''){
      wx.navigateTo({
        url: '/pages/search/search?content='+content,
      })
    }
  }
  bindRegionChange(e) {

    console.log(e);
    var citylist = this.Base.getMyData().citylist;
    if (e.detail.value[1] == null) {
      e.detail.value[1] = 0;
    }
    var city = citylist[e.detail.value[0]].name + citylist[e.detail.value[0]].qu[e.detail.value[1]].name
    console.log(city);
    // return
    this.Base.setMyData({
      city: city
    })

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
Page(body)