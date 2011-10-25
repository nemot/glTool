Ext.define('Rq.Application', {
    extend: 'Ext.app.Application',
    name: 'Rq',

    requires: [],

    controllers: [
      'Requests'
    ],


    autoCreateViewport: true,

    launch: function() {
      
      Rq.App = this;
      // When google analytics event tracking script present on page
      if (Rq.initEventTracking) {
          Rq.initEventTracking();
      }
      
      // Отрубаем контекстное меню по всему приложению
      Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
      Ext.getBody().on("keypress", function(e, htmlEl, obj, options){
//        switch(e.getCharCode()) {
//          case 99: // c key 
//            Rq.controller.Requests.showAddCodesWindow()
//            break;
//        }
//        console.log()
      })
      
    }
});

