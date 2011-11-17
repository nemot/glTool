Ext.define('Gl.view.requests.MainGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.requestsgrid',

  flex:1,
  store: 'Requests',
  sortableColumns:false,
  columnLines:true,

  

  viewConfig: {
      plugins: {
          ptype: 'gridviewdragdrop',
          dragGroup: 'firstGridDDGroup',
          dropGroup: 'secondGridDDGroup',
      },
      listeners: {
          
      }
  },

  columns:{
    items: [
      {header:'В инвойсе', dataIndex:'has_invoice', width:80, align:'center', renderer:function(v){
        return v ? "<span style='color:green'>Да</span>" : "<span style='color:red'>Нет</span>"
      }, hidden:true},
      {header: '№', dataIndex:'id', width:50},
      {header: 'КЛИЕНТ', dataIndex: 'client_name', flex:1},
      {header: 'ДАТА ВЫДАЧИ', dataIndex: 'date_of_issue',xtype: 'datecolumn', format:'d.m.Y', align:'center'},
      {header: 'ДЕЙСТВ. ДО', dataIndex: 'valid_until',xtype: 'datecolumn', format:'d.m.Y', align:'center', hidden:true},
      {header: 'ВАГОНОВ', dataIndex: 'cars_num', width:60, align:'center'},
      {header: 'ТОННАЖ', dataIndex: 'common_tonnage', width: 60, align:'right', renderer:function(v, opts, rec){
        return (rec.get("load_id")==1) ? "-" : v+" тн."
      }},
      {header: 'СТ.ОТПР.', dataIndex: 'station_from_name', width:120, align: 'center'},
      {header: 'СТ.НАЗН.', dataIndex: 'station_to_name', width:120, align: 'center'},
      {header: 'ГРУЗ', dataIndex: 'load_name', width:150, align:'center'},
      {header: 'ЖД', dataIndex: 'jd_sum', width:80, renderer:Ext.util.Format.usMoney, align:'right' },
      {header: 'КИЕНТУ', dataIndex: 'client_sum', width:80, renderer:Ext.util.Format.usMoney, align:'right' },
      {header: 'ДОХОД', dataIndex: 'profit', width:80,  renderer:Ext.util.Format.usMoney, align:'right' },
    ],
    defaults: {menuDisabled:false}
  },

  tbar:[
    {text:'Добавить', iconCls:'add', id:"requestAddBtn"}, 
    '-',
    {text:'Только порожняк', enableToggle: true, toggleHandler: function(btn, state){
      var store = Ext.ComponentQuery.query('requestsgrid')[0].getStore();
      store.getProxy().extraParams.loadless=state;
      store.load();
    }},
    '->',
    {xtype:'textfield', id:'requestsQueryField', emptyText:'Поиск...', listeners: {
      specialkey: function(field,e ) {
        if (e.getKey() == e.ENTER) {
          var store = Ext.ComponentQuery.query('requestsgrid')[0].getStore();
          store.getProxy().extraParams.query=field.getValue(); store.load();
        }
      }
    }},
    {xtype:'combo', queryMode:'local', editable:false, width:85, value:'code',
      store:[['code', 'Код'], ['car', 'Вагон'],["request","№ заявки"],["client","Клиент"]],
      listeners:{select:function(field, val){ 
        var store = Ext.ComponentQuery.query('requestsgrid')[0].getStore();
        store.getProxy().extraParams.find_param=field.getValue();
      }}
    },
    '-',
    
  ],


  initComponent: function(){
    this.listeners = {
      itemcontextmenu: this.showContextMenu
    };
    this.dockedItems = [
      { xtype: 'pagingtoolbar', store: 'Requests', dock: 'bottom', displayInfo: false },
    ];
    this.callParent();

  },

  showContextMenu: function(view, rec, item, index, e){
    e.stopEvent();
    var grid = Ext.ComponentQuery.query('requestsgrid')[0];
    var rec = grid.getSelectionModel().getSelection()[0];
    var menu = Ext.create('Ext.menu.Menu', { items: [] });
    var deleteAction = {text:'Удалить', iconCls:'delete', id:'deleteRequestMenuItem', handler:function(){
      Ext.Msg.confirm('Ванимание', 'Действительно удалить эту заявку?', function(answer){
        if(answer=="yes"){ grid.getStore().remove(rec); }
      },{icon:Ext.window.MessageBox.QUESTION})
    }};
    
//    menu.add('-');
    menu.add(deleteAction);
    menu.showAt(e.getXY())
  }



















})
