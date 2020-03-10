// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
var WxParse = require('../../wxParse/wxParse');
import { ApiUtil } from "../../apis/apiutil.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.info({}, (instinfo) => {
      instinfo.ystk = ApiUtil.HtmlDecode(instinfo.ystk);

      WxParse.wxParse('content', 'html', instinfo.ystk, that, 10);

    })
  }
  setPageTitle(instinfo) {
    wx.setNavigationBarTitle({
      title: "隐私条款",
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
Page(body)