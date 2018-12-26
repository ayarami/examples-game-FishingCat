require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
require('src/settings.df554');
var settings = window._CCSettings;
require('main.7ceb0');
require(settings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.d7159.js');
require('./libs/engine/index.js');

wxDownloader.REMOTE_SERVER_ROOT = "";
wxDownloader.SUBCONTEXT_ROOT = "FishingCatSub";
var pipeBeforeDownloader = cc.loader.md5Pipe || cc.loader.assetLoader;
cc.loader.insertPipeAfter(pipeBeforeDownloader, wxDownloader);

if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
    require('./libs/sub-context-adapter');
}
else {
    // Release Image objects after uploaded gl texture
    cc.macro.CLEANUP_IMAGE_CACHE = true;
}

window.boot();