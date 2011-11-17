Ext.define('Gl.view.bills.OutboxWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.outboxwindow',
  title:'Новый исходящий счет',
  width:800, height:550, modal:false, layout:'fit',

  items:[
    {xtype:'form', frame:true, id:"outboxForm",  layout:'border', items:[
      {xtype:'panel', region:'west', width:200, layout:'anchor', frame:'true', items:[
        {xtype:'hidden', name:'inbox', value:false},
        {xtype:'hidden', name:'id', value:null},
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
          allowBlank:false, value:'GL-', disabled:true},
        {xtype:'numberfield', fieldLabel:'Итого сумма', hideTrigger: true, decimalSeparator:',', disabled:true,
          selectOnFocus:true, name:'summ', id:'outboxSumm',
        },
        {xtype:'datefield', fieldLabel:'Выставлен клиенту', name:'sent_at', emptyText:'Еще не выставлен', disabled:true,},
        {xtype:'fieldset', title:'Документы', disabled:true, items:[
          {xtype:'label', html:'<a href="#">Скачать оригинал</a><div class="small_date">21.12.2011</div>'},
//          {xtype:'label', html:'<div class="small_date">22.12.2011</div><a href="#">Измененная версия</a><br/>'},
//          {xtype:'label', html:'<div class="small_date">22.12.2011</div><a href="#">Измененная версия</a>'},
//          {xtype:'label', html:'<hr>'},
//          {xtype:'filefield', fieldLabel:'Измененный документ', name:'f', labelAlign:'top'},
//          {xtype:'button',text:'Загрузить'},
        ]},
        
        
      ], defaults:{labelAlign:'top', anchor:'100%'}},
  
      {xtype:'panel', region:'center',  frame:true,  layout:'anchor', items:[
        {xtype:'label', text:'Заявки:'},
        {xtype:'grid', name:'requests', height: 400, hideHeaders:false, margin:'0 0 10 0', columnLines:true, id:'outboxRequestsGrid',
          disabled:true,
          store: new Ext.create('Ext.data.Store', {
            fields:Ext.create('Gl.model.Request').fields, data:[], autoLoad:true 
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
            ],
            defaults:{menuDisabled:true}
          },
        },
      ], defaults:{labelAlign:'top', anchor:'100%'}},
      
    ]}
  ],
  buttons:[
    {text:'Отмена', handler:function(){ Ext.ComponentQuery.query('outboxwindow')[0].close() }, height:35, padding:'0 5 0 10' },
    {text:'Сформировать', iconCls:'forming', id:'preformOutboxBillBtn', height:35, padding:'0 5 0 10'}
  ],
  listeners: {
    afterrender: function(){
      // Фокус на поле клиента
      Ext.ComponentQuery.query('#outboxClientIdField')[0].focus()
    },

  }
});
