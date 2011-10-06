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
  }
});
