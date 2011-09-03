Ext.define('Gl.view.requests.MainGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.requestsgrid',

  flex:1,
  store: 'Requests',
  sortableColumns:false,
  columnLines:true,

  columns:{
    items: [
      {header: '№', dataIndex:'id', width:50},
      {header: 'Клиент', dataIndex: 'client_name', flex:1},
      {header: 'Дата выдачи', dataIndex: 'date_of_issue',xtype: 'datecolumn', format:'d.m.Y'},
      {header: 'Вагонов', dataIndex: 'cars_num', width:60},
      {header: 'Ст.ОТПР.', dataIndex: 'station_from_name', width:150},
      {header: 'Ст.НАЗН.', dataIndex: 'station_to_name', width:150},
      {header: 'Груз', dataIndex: 'load_name', width:150},
      {header: 'Сумма ЖД', dataIndex: 'jd_sum', width:70},
      {header: 'Сумма Клиенту', dataIndex: 'client_sum', width:170},
      {header: 'Доход', dataIndex: ''},
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
      { xtype: 'pagingtoolbar', store: 'Requests', dock: 'bottom', displayInfo: false }
    ];
    this.callParent();

  },

  showContextMenu: function(view, rec, item, index, e){
    e.stopEvent();
    // TODO Сделат менюшку
  }

})
