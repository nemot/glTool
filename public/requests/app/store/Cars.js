Ext.define('Rq.store.Cars', {
  extend: 'Ext.data.Store',
  
  sorters: [{property : 'id', direction: 'DESC'}],
  model:'Rq.model.Car',
  autoLoad:true, 
  data: cars

});
