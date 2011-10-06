Ext.define('Rq.store.Places', {
  extend: 'Ext.data.Store',


  model:'Rq.model.Place',

  autoLoad:true, 
  sorters: [{property : 'id', direction: 'DESC'}],
  data: places,


  getMinId:function(){
    var minId=0;
    this.each(function(rec){
      minId = parseInt(rec.get('id'))<minId ? parseInt(rec.get('id')) : minId 
    });
    return minId
  },

  listeners: {
    remove: function(store, record, index){
      Rq.view.CarsGrid.removeColumn(record)
//      Rq.view.CarsGrid.removePlaceFromStore(record)
    }
  },


});
