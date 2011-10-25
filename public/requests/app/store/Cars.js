Ext.define('Rq.store.Cars', {
  extend: 'Ext.data.Store',
  
  sorters: [{property : 'id', direction: 'DESC'}],
  model:'Rq.model.Car',
  autoLoad:true, 
  data: cars,


  getMinId:function(){
    var minId=0;
    this.each(function(rec){
      minId = parseInt(rec.get('id'))<minId ? parseInt(rec.get('id')) : minId 
    });
    return minId
  },

  listeners: {
    add: function(){ 
      if(Ext.ComponentQuery.query('requestgrid')[0] && Ext.ComponentQuery.query('costsgrid')[0]) {
        Rq.controller.Requests.calculateRequest()
      }
    },
    remove: function(){ 
      if(Ext.ComponentQuery.query('requestgrid')[0] && Ext.ComponentQuery.query('costsgrid')[0]) {
        Rq.controller.Requests.calculateRequest()
      }
    }
  }

  

});
