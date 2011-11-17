Ext.define('Gl.view.bills.MainGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.billsgrid',
  flex:1,
  store: 'Bills', 
  sortableColumns:false,
  columnLines:true,

  plugins: [{
      ptype: 'rowexpander',
      rowBodyTpl : [
          '<p><b>На заявки:</b> {requests_count}</p>',
          '<p><b>Отправлена:</b> {created_at} пользователем {created_user_name}</p>',
          '<p><b>Итого:</b> {created_at} пользователем {created_user_name}</p>',
      ]
  }],

  columns:{
    items: [
      {header: '№', dataIndex:'number', width:80, align:'center'},
      {header: 'Сумма', dataIndex:'summ', renderer:Ext.util.Format.usMoney, align:'right', width:90},
      {header: 'Откат', dataIndex:'backwash', renderer:Ext.util.Format.usMoney, align:'right', width:80, 
        hidden:current_user.is_engineer()},
      {header: 'Клиент', dataIndex:'client_name', flex:1},
      {header: 'Сформирован', dataIndex:'created_at', align:'center', width:85, renderer:function(v){
        return v ? Ext.Date.format(v,'d.m.Y') : "<span style='color:red'>Нет</span>"
      }},
      {header: 'Выставлен', dataIndex:'sent_at', align:'center', width:85, renderer:function(v){
        return v ? "<span style='color:green'>"+Ext.Date.format(v,'d.m.Y')+"</span>" : "<span style='color:red'>Нет</span>"
      }},
      {header: 'Оплачен', dataIndex:'payed_at',  align:'center', width:85, renderer:function(v){
        return v ? "<span style='color:green'>"+Ext.Date.format(v,'d.m.Y')+"</span>" : "<span style='color:red'>Нет</span>"
      }},
      {header: 'Создатель', dataIndex:'created_user_name', width:100, align:'center'}
    ],
    defaults: {menuDisabled:true, sortable:false}
  },

  tbar:{
    items:[
      {text:'Создать', iconCls:'add', id:'addBillBtn'},
      '->',
      '-',
      {text:'Исходящие', enableToggle:true, toggleGroup:'billtype',  width:100, action:'outbox'},
      {text:'Входящие', enableToggle:true, toggleGroup:'billtype', height:30, width:100, action:'inbox'},
    ],
    defaults: { height:30, },
    style:'padding-left:10px;' 
  },

  initComponent: function(){
    this.listeners = {
    };

    this.dockedItems = [
      { xtype: 'pagingtoolbar', store: 'Bills', dock: 'bottom', displayInfo: false },
    ];
    this.callParent();
    
  },








})
