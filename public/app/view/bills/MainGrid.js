Ext.define('Gl.view.bills.MainGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.billsgrid',
  flex:1,
  store: 'Bills', 
  sortableColumns:false,
  columnLines:true,

//  plugins: [{
//      ptype: 'rowexpander',
//      rowBodyTpl : [
//          '<p><b>На заявки:</b> {requests_count}</p>',
//          '<p><b>Отправлена:</b> {created_at} пользователем {created_user_name}</p>',
//          '<p><b>Итого:</b> {created_at} пользователем {created_user_name}</p>',
//      ]
//  }],
  plugins: [
      Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 })
  ],
  columns:{
    items: [
      {header: '№', dataIndex:'number', width:80, align:'center'},
      {header: 'Сумма', dataIndex:'summ', renderer:Ext.util.Format.usMoney, align:'right', width:90},
      {header: 'Завышен на', dataIndex:'backwash',align:'right', width:80, hidden:current_user.is_engineer(), renderer:function(v){
        str = Ext.util.Format.usMoney(v)
        if(v!=0)
          str = "<span class='red'>"+str+"</span>"
        return str
      }},
      {header: 'Клиент', dataIndex:'client_name', flex:1},
      {header: 'Заявок', dataIndex:'requests_count', width:50, align:'center'},
      
      {header: 'Сформирован', dataIndex:'created_at', align:'center', width:85, renderer:function(v){
        return v ? Ext.Date.format(v,'d.m.Y') : "<span style='color:red'>Нет</span>"
      }},
      {header: 'Выставлен', dataIndex:'sent_at', align:'center', width:85, renderer:function(v){
        return v ? "<span style='color:green'>"+Ext.Date.format(v,'d.m.Y')+"</span>" : "<span style='color:red'>Нет</span>"
      }, editor: { xtype:'datefield', allowBlank:true }},
      {header: 'Оплачен', dataIndex:'payed_at',  align:'center', width:85, renderer:function(v){
        return v ? "<span style='color:green'>"+Ext.Date.format(v,'d.m.Y')+"</span>" : "<span style='color:red'>Нет</span>"
      }, editor: { xtype:'datefield', allowBlank:true }},
      {header: 'Создатель', dataIndex:'created_user_name', width:100, align:'center'},
      {header: 'Файл', dataIndex:'id', width:130, sortable:false, renderer:function(v){
        return'<a href="/bills/'+v.toString()+'/get_invoice" style="color:black;" >Скачать оригинал</a>'
      }},
    ],
    defaults: {menuDisabled:true, sortable:false}
  },

  tbar:{
    items:[
      {text:'Создать', iconCls:'add', id:'addBillBtn'},
      {text:'Создать', iconCls:'add', id:'addInboxBillBtn'},
      '-',
      {text:'Не оплаченые', enableToggle:true, id:'unpayedBillsBtn'},
      '->',
      '-',
      {text:'Исходящие', enableToggle:true, toggleGroup:'billtype',  width:80, action:'outbox'},
      {text:'Входящие', enableToggle:true, toggleGroup:'billtype', height:30, width:80, action:'inbox'},
      {text:'Дельта', height:30, width:80, id:'deltaButton'},
    ],
    defaults: { height:30, },
    style:'padding-left:10px;' 
  },

  initComponent: function(){
    this.listeners = {
      itemclick:function(view, rec){
        
      },

      beforeedit:function(e,editor,options){
        if(e.field=="sent_at"){
          e.cancel = e.record.get("payed");
        }
        if(e.field=="payed_at"){
          e.cancel = !e.record.get("sent");
          if(e.record.get("sent")) {
            e.cancel = current_user.is_engineer();
          }
        }
      }
    };

    this.dockedItems = [
      { xtype: 'pagingtoolbar', store: 'Bills', dock: 'bottom', displayInfo: false },
    ];
    this.callParent();
    
  },



})



