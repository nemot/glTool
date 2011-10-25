Ext.define('Rq.view.CostsGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.costsgrid',
  
  title:'Доп. сборы',
  store: 'Costs',
  columnLines:true,

  selType: 'rowmodel',
  plugins: [ Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 , listeners:{
    edit: function(){
      // Пересчитываем заявку
      Rq.controller.Requests.calculateRequest()
    }
  }}) ],

  // Колонки
  columns:[

    {header: 'Страна', dataIndex:'place_id', menuDisabled:true, field:{
      xtype:'combo', queryMode: 'local', displayField: 'country_name', valueField: 'id', editable:false,
      store: 'Places', listeners:{select:function(field, val){
        var rec = Ext.ComponentQuery.query('costsgrid')[0].getSelectionModel().getSelection()[0];
        rec.set('country_name', val[0].get('country_name'))
      }}
    }, renderer:function(v, a, rec){
        return rec.get('country_name')
    }},

    {header: 'Наименование', dataIndex:'name', flex:1, menuDisabled:true, field:{xtype:'textfield', selectOnFocus:true}},

    {header: 'ЖД', dataIndex:'rate_jd', menuDisabled:true, renderer:function(v){
      return v.toFixed(2).toString().replace("\.", ',')
    }, field:{xtype:'numberfield', hideTrigger: true, decimalSeparator:',', selectOnFocus:true}},

    {header: 'Клиенту', dataIndex:'rate_client', menuDisabled:true, renderer:function(v){
      return v.toFixed(2).toString().replace("\.", ',')
    }, field:{xtype:'numberfield', hideTrigger: true, decimalSeparator:',', selectOnFocus:true}},

    {header: 'Вид оплаты', dataIndex:'payment_type', menuDisabled:true, renderer:function(v){
      return ["Разовый", "За вагон", "За тонну"][parseInt(v)]
    }, field:{xtype:'combo',queryMode: 'local', editable:false, store:[[0, 'Разовый'], [1, 'За вагон'],[2, 'За тонну']]}}
  ],

  initComponent: function(){
    this.listeners = {
      itemcontextmenu: this.showContextMenu,
      containercontextmenu: this.showContainerContextMenu
    };
    this.callParent();
  },

  // Отображает контекстное меню для таблички
  showContainerContextMenu: function(view, e){
    var grid = Ext.ComponentQuery.query('costsgrid')[0];
    var menu = Ext.create('Ext.menu.Menu', { items: [] });
    var addAction = {text:'Добавить', iconCls:'add', id:'addCostsMenuItem'};
    menu.add(addAction);
    menu.showAt(e.getXY())
  },
  
  // Отображает контекстное меню для айтема
  showContextMenu: function(view, rec, item, index, e){
    var grid = Ext.ComponentQuery.query('costsgrid')[0];
    var rec = grid.getSelectionModel().getSelection()[0];
    var menu = Ext.create('Ext.menu.Menu', { items: [] });
    var deleteAction = {text:'Удалить', iconCls:'delete', id:'deleteCostsMenuItem', handler:function(){
      grid.getStore().remove(rec);
    }};
    var addAction = {text:'Добавить', iconCls:'add', id:'addCostsMenuItem'};
    menu.add(addAction);
    menu.add('');
    menu.add(deleteAction);
    menu.showAt(e.getXY())
  },

})
