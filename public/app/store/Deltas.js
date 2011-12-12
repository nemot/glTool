Ext.define('Gl.store.Deltas', {
  extend: 'Ext.data.Store',
  fields: [
    {name:'id', type:'int'},
    {name:'note',type:'string'},
    {name:'sum', type:'float'},
    {name:'date_of_transfer', type:'date', dateFormat:'c'},
    {name:'created_at', type:'date', dateFormat:'c'}
  ],
  listeners:{
    datachanged:function(recs){
      Ext.Ajax.request({
        url: '/deltas/total', method:'GET',
        success: function(response){
          var resp = Ext.decode(response.responseText);
          total_delta = resp.total;
          var field = Ext.ComponentQuery.query('#totalDeltaSum')[0];
          if(field) { field.setText('<span class="large">Остаток дельты: <b>'+Ext.util.Format.usMoney(total_delta)+'</b></span>',false)};
        }, 
        failure: function(response){ Gl.App.serverError(); }
      });
    },
  },

  autoLoad:true, autoSync:true,
  sorters: [{property : 'date_of_transfer', direction: 'DESC'}],
  proxy: {
    type: 'rest',
    url : '/deltas',
    reader: {type:'json', root:'nodes',},
    writer: {type:'json', root:'nodes', writeAllFields:true}
  }

});
