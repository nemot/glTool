Ext.define('Rq.store.Costs', {
  extend: 'Ext.data.Store',
  fields:[
    {name:'id', type:'int'},
    {name:'place_id', type:'int', defaultValue:null},
    {name:'country_name', type:'string', defaultValue:''},
    {name:'name', type:'string', defaultValue:''},
    {name:'rate_jd', type:'float', defaultValue:0},
    {name:'rate_client', type:'float', defaultValue:0},
    {name:'payment_type', type:'int', defaultValue:0}
  ],

  autoLoad:true, 
  sorters: [{property : 'id', direction: 'DESC'}],
  
  data: costs,

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
    }
  }

});
