Ext.define('Rq.store.TransitStations', {
  extend: 'Ext.data.Store',


  // model:'Rq.model.TransitStation',
  fields:[
    {name:'id', type:'int'}, {name:'station_id', type:'int'}, {name:'station_name', type:'string'}
  ],

  autoLoad:true, 
  sorters: [{property : 'id', direction: 'ASC'}],
  data: transit_stations,


  getMinId:function(){
    var minId=0;
    this.each(function(rec){
      minId = parseInt(rec.get('id'))<minId ? parseInt(rec.get('id')) : minId 
    });
    return minId
  }

});
