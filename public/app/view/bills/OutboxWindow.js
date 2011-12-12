Ext.define('Gl.view.bills.OutboxWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.outboxwindow',
  title:'Исходящий счет', 
  width:800, height:550, modal:false, layout:'fit',

  items:[
    {xtype:'form', frame:true, id:"outboxForm", disabledCls:'form-disabled',  layout:'border', items:[
      {xtype:'panel', region:'west', width:200, layout:'anchor', frame:'true', items:[
        {xtype:'hidden', name:'inbox', value:false},
        {xtype:'hidden', name:'id', id:'outboxIdField', value:null},
        {xtype:'combo', fieldLabel:'Клиент', name:'client_id', id:'outboxClientIdField', allowBlank:false,
          pageSize: 30, displayField: 'name', valueField:'id', typeAhead: false,
          hideTrigger:true, anchor: '100%', minChars:2,
          store: Ext.create('Ext.data.Store', { pageSize: 30,
            fields: [{name:'id', type:'int'}, {name:'name', type:'string'}],
            proxy:{type:'rest', url:'/clients/autocomplete', reader: {type:'json', root:'nodes', totalProperty:'total'}}
          }),        
          listConfig: { loadingText: 'Поиск...', emptyText: 'Ни чего не найдено.',
            getInnerTpl: function() { return '{name}'; }},
        },
        {xtype:'textfield', fieldLabel:'Номер счета', name:'number', id:'outboxNumber', 
          allowBlank:false },
        {xtype:'numberfield', fieldLabel:'Итого сумма', hideTrigger: true, decimalSeparator:',', 
          selectOnFocus:true, name:'summ', id:'outboxSumm',
        },
//        {xtype:'datefield', fieldLabel:'Выставлен клиенту', name:'sent_at', id:'sentAtField', emptyText:'Еще не выставлен'},
//        {xtype:'fieldset', title:'Документы', id:'outboxDownloadLinks', items:[
//          {xtype:'label', id:'outboxDownloadLink', html:''},
//        ]},
      ], defaults:{labelAlign:'top', anchor:'100%'}},
  
      {xtype:'panel', region:'center',  frame:true,  layout:'anchor', items:[
        {xtype:'label', text:'Заявки:'},
        {xtype:'grid', name:'requests', height: 400, hideHeaders:false, margin:'0 0 10 0', columnLines:true, id:'outboxRequestsGrid',
          store: new Ext.create('Ext.data.Store', {
            fields:Ext.create('Gl.model.Request').fields, data:[], autoLoad:false, 
          }),
          columns:{
            items:[
              {header:'№', dataIndex:'id', width:40},
              {header:'КЛИЕНТУ', dataIndex:'client_sum', width:65, renderer:Ext.util.Format.usMoney, align:'right'},
              {header:'ДТ.ВЫДАЧИ', dataIndex: 'date_of_issue',xtype: 'datecolumn', format:'d.m.Y', align:'center', width:70},
              {header:'ВАГ', dataIndex:'cars_num', width:30},
              {header:'ГРУЗ', dataIndex:'load_name', flex:1},
              {header: 'СТ.ОТПР.', dataIndex: 'station_from_name', width:82, align: 'center'},
              {header: 'СТ.НАЗН.', dataIndex: 'station_to_name', width:82, align: 'center'},
              {header:' ',dataIndex:'id', width:30, renderer:function(v){
                return "<img src='/ext/shared/icons/app/delete.png' requestId='"+v+"' class='requestDeleteBnt' onclick='Gl.App.controllers.getAt(4).removeRequestFromList("+v+")'/>"
              }}
            ], defaults:{menuDisabled:true }
          },
        },
      ], defaults:{labelAlign:'top', anchor:'100%'}},
    ]} // EO Form
  ],
  buttons:[
    {text:'Закрыть', handler:function(){ Ext.ComponentQuery.query('outboxwindow')[0].close() }, height:35, padding:'0 5 0 10' },
    {text:'Сохранить', iconCls:'save', id:'preformOutboxBillBtn', height:35, padding:'0 5 0 10'},
    {text:'Сохранить', iconCls:'save', id:'saveOutboxBillBtn', height:35, padding:'0 5 0 10', hidden:true}
  ],
  listeners: {
    afterrender: function(){
      Ext.ComponentQuery.query('#outboxClientIdField')[0].focus()
    },

  }
});
