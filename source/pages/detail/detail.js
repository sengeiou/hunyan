// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ShangjiaApi } from "../../apis/shangjia.api.js";
import { AliyunApi } from "../../apis/aliyun.api.js";
var WxParse = require('../../wxParse/wxParse');
import { ApiUtil } from "../../apis/apiutil.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    // options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      StatusBar: getApp().globalData.StatusBar,
      CustomBar: getApp().globalData.CustomBar,
      Custom: getApp().globalData.Custom,
      tian:false,
      focus:false
    })
  }
  onMyShow() {
    var that = this;
    var shangjiaapi = new ShangjiaApi();
    shangjiaapi.shangjiadetail({id:this.Base.options.id},(detail)=>{
      detail.chandi = ApiUtil.HtmlDecode(detail.chandi);

      WxParse.wxParse('content', 'html', detail.chandi, that, 10);
      this.Base.setMyData({ detail})
    })
    this.getyuyue();
  }
  getyuyue(){
    var date = new Date();
    console.log(date.getTime());
    var today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + '00:00:00';
    var todayw = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+'23:59:59';
    console.log(today, 'today', todayw);
    var shangjiaapi = new ShangjiaApi();
    var arr =[];
    shangjiaapi.yuyuelist({
      // member_id:this.Base.getMyData().memberinfo.id,
    }, (yuyuelist)=>{
      for (var i = 0; i < yuyuelist.length;i++){
        yuyuelist[i].shijian = yuyuelist[i].shijian.replace(/-/g,'/');
        console.log(new Date(yuyuelist[i].shijian).getTime())
        console.log(new Date(today).getTime(), 'today');
        if (new Date(today).getTime() < new Date(yuyuelist[i].shijian).getTime() && new Date(todayw).getTime() > new Date(yuyuelist[i].shijian).getTime()){
          arr.push(yuyuelist[i]);
        }
      }
      this.Base.setMyData({ yuyuelist:arr})
    })
  }
  
  yuyue(){
    var yuyuelist = this.Base.getMyData().yuyuelist;
    var instinfo = this.Base.getMyData().instinfo;
    var detail = this.Base.getMyData().detail;
    if (detail.sendmsg=='A'){
      var citymanager_id = detail.citymanager[0].id;
      var citymanager_phone = detail.citymanager[0].mobile;
    } else if (detail.sendmsg == 'B') {
      var i = (Math.random() * (detail.citymanager.length-1)).toFixed(0);
      var citymanager_id = detail.citymanager[i].id;
      var citymanager_phone = detail.citymanager[0].mobile;
    }
    var that = this;
    var name = this.Base.getMyData().name;
    if (name=="" || name==undefined){
      wx.showToast({
        title: '请输入您的姓名！',
        icon:'none'
      })
      return
    }
    var shangjiaapi = new ShangjiaApi();
    var aliyunapi = new AliyunApi();
    if (instinfo.cishu - yuyuelist.length>0){
      wx.showModal({
        title: '预约',
        content: '今天剩余预约次数为：' + (instinfo.cishu - yuyuelist.length) + '次',
        cancelText: '取消',
        confirmText: '预约',
        success: (res) => {
          console.log(res);
          if (res.confirm) {
            aliyunapi.sendsms({
              phone: citymanager_phone,
              name: name,
              shanghu: detail.name,
              memphone: that.Base.getMyData().memberinfo.mobile
            }, (sendsms)=>{
              shangjiaapi.yuyue({
                // member_id: this.Base.getMyData().memberinfo.id,
                shanjia_id: this.Base.options.id,
                citymanager_id: citymanager_id
              }, (yuyue) => {
                console.log(yuyue)
                if (yuyue.code == '0') {
                  
                  wx.showToast({
                    title: '发送成功',
                  })
                  that.getyuyue();
                  return
                } else {
                  wx.showToast({
                    title: '发送失败',
                    icon: 'none'
                  })
                  return
                }
                that.Base.setMyData({
                  tian: false,
                  focus:false
                })
              })
            })
           
          }
        }
      })
    }else {
      wx.showToast({
        title: '今天的预约次数已经用完了！请明天再预约',
        icon:'none'
      })
      return 
    }
  
  }
  quedin(){
    this.Base.setMyData({
      tian: true,
      focus:true
    })
  } 
  quxiao(){
    this.Base.setMyData({
      tian:false,
      focus:false
    })
  }
  nameFn(e){
    this.Base.setMyData({
      name:e.detail.value
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.yuyue = content.yuyue;
body.getyuyue = content.getyuyue;
body.quedin = content.quedin;
body.quxiao = content.quxiao;
body.nameFn = content.nameFn;
Page(body)