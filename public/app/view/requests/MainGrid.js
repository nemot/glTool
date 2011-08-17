Ext.define('Gl.view.requests.MainGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.requestsgrid',

  flex:1,
  store: 'Clients',
  sortableColumns:false,

  columns:{
    items: [
      {header: '№', dataIndex:'id', width:50},
      {header: 'Клиент', dataIndex: 'client_name', flex:1},
      {header: 'Дата выдачи', dataIndex: 'client_name'},
      {header: 'Вагонов', dataIndex: 'client_name'},
      {header: 'Ст.ОТПР.', dataIndex: 'client_name'},
      {header: 'Ст.НАЗН.', dataIndex: 'client_name'},
      {header: 'Груз', dataIndex: 'client_name'},
      {header: 'Сумма ЖД', dataIndex: 'client_name'},
      {header: 'Сумма Клиенту', dataIndex: 'client_name'},
      {header: 'Доход', dataIndex: 'client_name'},
    ],
    defaults: {menuDisabled:true}
  },

  tbar:[
    {text:'Добавить', iconCls:'add', id:"requestAddBtn"}
  ],

  

  initComponent: function(){
    this.listeners = {
      itemcontextmenu: this.showContextMenu
    };
    this.dockedItems = [
      { xtype: 'pagingtoolbar', store: 'Clients', dock: 'bottom', displayInfo: false }
    ];
    this.callParent();

  },

  showContextMenu: function(view, rec, item, index, e){
    e.stopEvent();
    // TODO Сделат менюшку
  }

})
