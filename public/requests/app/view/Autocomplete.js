Ext.define('Rq.view.Autocomplete',{

  extend:'Ext.form.field.ComboBox',  

  alias:'widget.autocomplete',
  pageSize: 50,
  
  pr_name: '',
  pr_id: '',
  pr_url:'/persons',

  

  displayField: 'name', valueField:'id', typeAhead: false,
  hideLabel: true, hideTrigger:true, anchor: '100%', minChars:2,

  listConfig: {
      loadingText: 'Поиск...',
      emptyText: 'Ни чего не найдено.',
      // Custom rendering template for each item
      getInnerTpl: function() {
        return '{name}';
      }
  },
  
  constructor: function(cfg) {
    this.initConfig(cfg);
    this.store = Ext.create('Rq.store.Autocomplete', { pr_url: this.config.pr_url}),

    this.listeners = {
      select: function(cmp, val){
        grid =  Ext.ComponentQuery.query('requestgrid')[0];
        grid.rec.set(this.config.pr_id,val[0].get('id'));
        grid.rec.set(this.config.pr_name,val[0].get('name'));
        grid.fireEvent('propertychange');
      }
    };

    this.callParent();
  },
  
})
