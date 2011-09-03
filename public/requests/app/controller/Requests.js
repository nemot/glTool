Ext.define('Rq.controller.Requests', {
  extend: 'Ext.app.Controller',

  models:['Request', 'User', 'Client', 'Station', 'Code', 'Car', 'Place', 'Country'],
  stores:['Countries', 'Cars', 'Places', 'Costs', 'Clients'],

  init: function() {
    current_user = new Rq.model.User(current_user);
    current_request = new Rq.model.Request(current_request);
    this.control({
//      "requestsgrid":{itemdblclick: this.showRequestWindow},
//      "#requestAddBtn":{click: this.showRequestWindow}
    })
  },
  
  
  
});

