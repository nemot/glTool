Ext.define('Rq.store.Places', {
  extend: 'Ext.data.Store',


  model:'Rq.model.Place',

  autoLoad:true, 
  sorters: [{property : 'id', direction: 'ASC'}],
  data: places,


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
    remove: function(store, record, index){
      Rq.view.CarsGrid.removeColumn(record)
      Rq.view.CarsGrid.removePlaceFromStore(record)
      Ext.ComponentQuery.query('carsgrid')[0].getStore().each(function(rec){
        Rq.view.CarsGrid.recalcRates(rec);
      });      

      if(Ext.ComponentQuery.query('requestgrid')[0] && Ext.ComponentQuery.query('costsgrid')[0]) {
        Rq.controller.Requests.calculateRequest()
      }
    }
  }


});
