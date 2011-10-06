Ext.define('Rq.store.Autocomplete',{
  extend:'Ext.data.Store',

  pageSize: 50,
  fields: [{name:'id', type:'int'}, {name:'name', type:'string'}],
  
  constructor: function(cfg) {   
    this.initConfig(cfg);
    this.proxy = { type: 'rest',  url: this.config.pr_url,
      reader: { type: 'json', root: 'nodes', totalProperty: 'total' }
    }
    this.callParent();
  },

  

  
})
