window.__require=function e(t,a,n){function i(s,o){if(!a[s]){if(!t[s]){var r=s.split("/");if(r=r[r.length-1],!t[r]){var l="function"==typeof __require&&__require;if(!o&&l)return l(r,!0);if(c)return c(r,!0);throw new Error("Cannot find module '"+s+"'")}}var m=a[s]={exports:{}};t[s][0].call(m.exports,function(e){return i(t[s][1][e]||e)},m,m.exports,e,t,a,n)}return a[s].exports}for(var c="function"==typeof __require&&__require,s=0;s<n.length;s++)i(n[s]);return i}({Cell:[function(e,t,a){"use strict";cc._RF.push(t,"76bdd60owVH4pw5zIauqL9Z","Cell");var n=e("GameData");cc.Class({extends:cc.Component,properties:{mIndexLabel:cc.Label,mImg:cc.Sprite,mNameLabel:cc.Label,mScoreLabel:cc.Label,mOpenId:{default:null,visible:!1},mDepth:{default:0,visible:!1},mBack:[cc.SpriteFrame],mNameNode:cc.Node,mScoreNode:cc.Node},start:function(){},init:function(e,t,a,i,c,s){var o=this;this.node.getComponent(cc.Sprite).spriteFrame=this.mBack[e%2],this.mIndexLabel.string=e;var r=wx.createImage();r.onload=function(){var e=new cc.Texture2D;e.initWithElement(r),e.handleLoadedTexture(),o.mImg.spriteFrame=new cc.SpriteFrame(e)},r.src=t,s===n.instance.openId?(this.mNameNode.color=cc.color(255,215,0,255),this.mScoreNode.color=cc.color(255,215,0,255)):(this.mNameNode.color=cc.color(255,255,255,255),this.mScoreNode.color=cc.color(255,255,255,255)),this.mNameLabel.string=a,this.mDepth=i,this.mScoreLabel.string=c,this.mOpenId=s}}),cc._RF.pop()},{GameData:"GameData"}],GameData:[function(e,t,a){"use strict";cc._RF.push(t,"a4088K8L65KaYRJ6k5c71R/","GameData");var n=cc.Class({extends:cc.Component,statics:{instance:null},properties:{openId:0,maxScore:0,maxDepth:0,friendData:[],isDataDirty:!1,isDisplayDirty:!1}});n.instance=new n,t.exports=n,cc._RF.pop()},{}],List:[function(e,t,a){"use strict";cc._RF.push(t,"ec221wJw31OwJ4fJ8Ruulbq","List");var n=e("GameData");cc.Class({extends:cc.Component,properties:{mPool:{default:null,visible:!1},mCell:cc.Prefab},start:function(){null===this.mPool&&(this.mPool=new cc.NodePool)},createRankItem:function(e,t,a,n,i,c){var s=this.mPool.get();s||(s=cc.instantiate(this.mCell)),s.getComponent("Cell").init(e+1,t,a,n,i,c),s.y=-50-76*e,this.node.addChild(s)},cleanAllCell:function(){for(var e=this.node.children,t=0;t<e.length;t++){var a=e[t];this.mPool.put(a)}},UpdateRankList:function(){this.cleanAllCell();for(var e=0;e<n.instance.friendData.length;e++){var t=n.instance.friendData[e];this.createRankItem(e,t.avatarUrl,t.nickname,t.KVDataList[0].value,t.KVDataList[1].value,t.openid)}},update:function(e){n.instance.isDisplayDirty&&(this.UpdateRankList(),n.instance.isDisplayDirty=!1)}}),cc._RF.pop()},{GameData:"GameData"}],wxOpenData:[function(e,t,a){"use strict";cc._RF.push(t,"7ccc4NeCYpMwqlFkkXeUKA1","wxOpenData");var n=e("GameData");cc.Class({extends:cc.Component,properties:{},start:function(){var e=this;wx.onMessage(function(t){switch(t.message){case"SetOpenId":n.instance.openId=t.openid,n.instance.isDataDirty=!0;case"UploadGameData":e.UploadGameData(t.score,t.depth)}})},UploadGameData:function(e,t){var a=Math.max(e,n.instance.maxScore),i=Math.max(t,n.instance.maxDepth);(a>n.instance.maxScore||i>n.instance.maxDepth)&&(n.instance.maxScore=a,n.instance.maxDepth=i,wx.setUserCloudStorage({KVDataList:[{key:"depth",value:""+n.instance.maxDepth},{key:"score",value:""+n.instance.maxScore}],success:function(){console.log("\u4e0a\u4f20\u6210\u529f!"),n.instance.isDataDirty=!0}}))},GetUserGameData:function(){wx.getUserCloudStorage({keyList:["depth","score"],success:function(e){console.log("\u4e0b\u8f7d\u73a9\u5bb6\u6e38\u620f\u6570\u636e\u6210\u529f!"),e.KVDataList.length>0&&(n.instance.maxDepth=e.KVDataList[0].value,n.instance.maxScore=e.KVDataList[1].value)}})},GetFriendGameData:function(){var e=this;wx.getFriendCloudStorage({keyList:["depth","score"],success:function(t){console.log("\u4e0b\u8f7d\u597d\u53cb\u6e38\u620f\u6570\u636e\u6210\u529f!"),n.instance.friendData=t.data,e.SortFriendGameData(),n.instance.isDisplayDirty=!0}})},SortFriendGameData:function(){n.instance.friendData.sort(function(e,t){var a=parseInt(e.KVDataList[0].value),n=parseInt(t.KVDataList[0].value);return a<=n?1:a>n?-1:void 0})},update:function(e){n.instance.isDataDirty&&(this.GetUserGameData(),this.GetFriendGameData(),n.instance.isDataDirty=!1)}}),cc._RF.pop()},{GameData:"GameData"}]},{},["Cell","GameData","List","wxOpenData"]);