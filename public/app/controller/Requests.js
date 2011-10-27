Ext.define('Gl.controller.Requests', {
  extend: 'Ext.app.Controller',

  models:['Request'],
  stores:['Requests'],

  init: function() {
    this.control({
      "requestsgrid":{itemdblclick: this.showRequestWindow},
      "#requestAddBtn":{click: this.showNewRequestWindow}
    })
  },

  showNewRequestWindow: function(){
    window.open('/requests/new','Новая заявка', 'width=1000,height=650,location=no,menubar=no')
  },
  
  showRequestWindow: function(){
    var rec = Ext.ComponentQuery.query('requestsgrid')[0].getSelectionModel().getSelection()[0];
    if(rec) {
      window.open('/requests/'+rec.get('id'),'Заявка №'+rec.get('id'), 'width=1100,height=630,location=no,menubar=no')
    } else {
      window.open('/requests/new','Новая заявка', 'width=1000,height=650,location=no,menubar=no')
    }
    
  }
  
});

