Ext.define('Gl.controller.Bills', {
  extend: 'Ext.app.Controller',
  models:['Bill'],
  stores:['Bills', 'Deltas'],

  init: function() {
    this.control({
      "billsgrid":{afterrender: this.toggleOutbox, itemdblclick:this.showAddBillWindow},
      'button[action=outbox]':{click:this.toggleOutbox},
      'button[action=inbox]':{click:this.toggleInbox},
      "#unpayedBillsBtn": {toggle:this.toggleUnPayed},
      '#addBillBtn':{click:this.showAddBillWindow},
      '#preformOutboxBillBtn': {click:this.preformOutboxBillBtn},
      'outboxwindow': {
        close:this.outboxWindowClose, hide:this.outboxWindowClose, 
        show:this.outboxWindowShow,
      },
      '#outboxClientIdField': {select:this.outboxClientSelected},
      "#addInboxBillBtn": {click: this.inboxWindowShow},
      "#saveInboxBill": {click: this.saveInboxBill},
      "#deltaButton": {click: this.showDeltasWindow}
    })
  },

  showDeltasWindow: function(){
    if(!current_user.is_engineer()){
      // Создаем окошко
      var win = Ext.create("Ext.window.Window", {
        title: 'Платежи по дельте',
        width: 600, height:500, modal:true, layout:'fit',
        items:[
          {xtype:'grid', store:'Deltas', id:'deltasgrid', selType: 'rowmodel', 
            tbar:[ 
              {text:'Добавить', iconCls:'add', handler:function(){
                Ext.ComponentQuery.query('#deltasgrid')[0].getStore().add({note:'', sum:0, created_at:Ext.Date.now()})
              }}, {iconCls:'delete', text:'Удалить', itemId:"delete", disabled:true, handler:function(){
                grid = Ext.ComponentQuery.query('#deltasgrid')[0];
                grid.getStore().remove(grid.getSelectionModel().getSelection()[0])
              }},'-',
              {id:'totalDeltaSum',  xtype:'label',
                html:'<span class="large">Остаток дельты: <b>'+Ext.util.Format.usMoney(total_delta)+'</b></span>'}
            ],
            plugins: [ Ext.create('Ext.grid.plugin.RowEditing', { clicksToEdit: 2}) ],
            columns:{ items:[
              
              {header:'Сумма', dataIndex:'sum', width:100, align:'right', renderer:Ext.util.Format.usMoney, 
                editor:{xtype:'numberfield', hideTrigger: true, decimalSeparator:',', selectOnFocus:true, allowBlank:false}
              },
              {header:'Дата', dataIndex:'date_of_transfer', width:90, xtype: 'datecolumn', format:'d.m.Y', 
                editor:{xtype:'datefield', allowBlank:false}, align:'center'
              },
              {header:'Примечание', dataIndex:'note', flex:1, editor:{xtype:'textfield'}},
            ], defaults:{sortable:false, menuDisabled:true}},
            dockedItems: [
              { xtype: 'pagingtoolbar', store: 'Deltas', dock: 'bottom', displayInfo: false },
            ],
            listeners: {
              afterrender:function(grid){
                grid.getSelectionModel().on('selectionchange', function(selModel, selections){
                    grid.down('#delete').setDisabled(selections.length === 0);
                })
              }
            }
          }
        ],
        buttons:[
          {text:'Закрыть', handler:function(){win.close()}, height:35}
        ], 
      });
      win.show()
    } // EO current_user.is_engineer check
    
  },

  saveInboxBill: function(){
    // Собираем остальные поля
    var vals = Ext.getCmp("inboxForm").getForm().getValues()
    var win = Ext.ComponentQuery.query('inboxwindow')[0];
    win.setLoading('Сохраняем. Подождите...');
    Ext.Ajax.request({
      url: '/bills/create_inbox', method:'POST',
      params: {
        bill: Ext.encode({
          id:vals.id, client_id:vals.client_id, inbox:vals.inbox, number:vals.number, summ:vals.summ,
        })
      },
      success: function(response){
        var obj = Ext.decode(response.responseText);
        win.setLoading(false) // конечно же енейблим окошко
        win.close();
        Ext.getStore('Bills').load()
      }, 
      failure: function(response){
        win.setLoading(false);
        Gl.App.serverError();
      }
    });
  },

  loadInboxForm: function(rec_id){
    var win = Ext.ComponentQuery.query('inboxwindow')[0];
    win.setLoading('Загружаются данные...');
    Ext.Ajax.request({ url: (rec_id==null ? '/bills/new' : "/bills/"+rec_id.toString()), method:'GET',
      success: function(response){
        win.setLoading(false);
        var resp = Ext.decode(response.responseText);
        // Пишем значения в формочку
        Ext.getCmp("inboxForm").getForm().setValues({
          id: parseInt(resp.bill.id),
          number: resp.bill.number.toString(),
          summ: resp.bill.summ.toFixed(2),
        });
        if(rec_id!=null){ // Если существующий счет
          // Ищем клиента
          Gl.model.Client.load(resp.bill.client_id,{success:function(rec){
            Ext.ComponentQuery.query("#inboxClientIdField")[0].setValue(rec);
            var requests_store = Ext.getStore('Requests');
            requests_store.getProxy().extraParams.outbox_client_id = rec.get('id'); requests_store.load();
          }})
        }
      },
      failure: function(response){
        win.setLoading(false);
        Gl.App.serverError();
      }
    })
  },

  inboxWindowShow: function(){
    var win = Ext.create('Gl.view.bills.InboxWindow');
    win.show();
    var rec = Ext.ComponentQuery.query('billsgrid')[0].getSelectionModel().getSelection()[0];
    if(rec)
      this.loadInboxForm(rec.get('id'))
    else
      this.loadInboxForm()
  },

  // Загрузка данных в формочку аутбокса
  loadOuboxForm: function(rec_id){
    var win = Ext.ComponentQuery.query('outboxwindow')[0];
    win.setLoading('Загружаются данные...');
    Ext.Ajax.request({ url: (rec_id==null ? '/bills/new' : "/bills/"+rec_id.toString()), method:'GET',
      success: function(response){
        win.setLoading(false);
        var resp = Ext.decode(response.responseText);
        // Пишем значения в формочку
        Ext.getCmp("outboxForm").getForm().setValues({
          id: parseInt(resp.bill.id),
          number: resp.bill.number.toString(),
          summ: resp.bill.summ.toFixed(2),
//          created_at: Ext.Date.parse(resp.bill.sent_at,'c'),
        });
        if(rec_id!=null){ // Если существующий счет
//          Ext.ComponentQuery.query('#outboxClientIdField')[0].disable()
          // Ищем клиента
          Gl.model.Client.load(resp.bill.client_id,{success:function(rec){
            Ext.ComponentQuery.query("#outboxClientIdField")[0].setValue(rec);
//            Ext.ComponentQuery.query('#outboxClientIdField')[0].enable();

            var requests_store = Ext.getStore('Requests');
            requests_store.getProxy().extraParams.outbox_client_id = rec.get('id'); requests_store.load();
          }})
        }
        // Подгружаем заявки
        var outboxStore = Ext.ComponentQuery.query('#outboxRequestsGrid')[0].getStore();
        outboxStore.loadData(resp.bill.requests)
      },
      failure: function(response){
        win.setLoading(false);
        Gl.App.serverError();
      }
    })
  },
  
  checkDisabledForOutboxFields: function(){
    
  },

  // Сохраняем и счет
  preformOutboxBillBtn: function(){
    // Собираем заявки
    var requestIDS = [];
    Ext.ComponentQuery.query('#outboxRequestsGrid')[0].getStore().each(function(rq){ requestIDS.push(rq.get('id')) })
    // Собираем остальные поля
    var vals = Ext.getCmp("outboxForm").getForm().getValues()
    var win = Ext.ComponentQuery.query('outboxwindow')[0];
    win.setLoading('Сохраняем. Подождите...');
    Ext.Ajax.request({
      url: '/bills/', method:'POST',
      params: {
        bill: Ext.encode({
          id:vals.id, client_id:vals.client_id, inbox:vals.inbox, number:vals.number, summ:vals.summ,
          request: requestIDS 
        })
      },
      success: function(response){
        var obj = Ext.decode(response.responseText);
        win.setLoading(false) // конечно же енейблим окошко
//        // Прописываем id в формочку
//        Ext.ComponentQuery.query('#outboxIdField')[0].setValue(parseInt(obj.bill.id))
        win.close();
        Ext.getStore('Bills').load()
      }, 
      failure: function(response){
        win.setLoading(false);
        Gl.App.serverError();
      }
    });

  },

  updateRequestsStore: function(){
    store = Ext.getStore('Requests');
    
    grid = Ext.ComponentQuery.query('requestsgrid')[0];
    controller  = Gl.App.controllers.findBy(function(v){ return v.id=="Requests"})

    // Дизейблим ненужные кнопочки
    Ext.ComponentQuery.query('topmenu > button[action=users]')[0].disable();
    Ext.ComponentQuery.query('topmenu > button[action=bills]')[0].disable();
    Ext.ComponentQuery.query('topmenu > button[action=clietns]')[0].disable();
    
//    console.log(store)
//    console.log(grid)
  },

  // При открытии окошка
  outboxWindowShow: function(){
    
    var rec = Ext.ComponentQuery.query('billsgrid')[0].getSelectionModel().getSelection()[0];
    if(rec){ 
      this.loadOuboxForm(rec.get('id')) 
      if(rec.get('sent')){ // Если отослан - то изменять уже нельзя
        Ext.ComponentQuery.query('#outboxSumm')[0].disable();
        Ext.ComponentQuery.query('#outboxNumber')[0].disable();
        Ext.ComponentQuery.query('#outboxRequestsGrid')[0].disable();
        Ext.ComponentQuery.query('#outboxClientIdField')[0].disable();
        Ext.ComponentQuery.query('#preformOutboxBillBtn')[0].disable();
//        Ext.ComponentQuery.query('#sentAtField')[0].disable();
      }
    } else { 
      this.loadOuboxForm(); 
      this.updateRequestsStore() 
      
    }
    // Отображаем заявки
    Gl.App.controllers.getAt(0).onRequestsClick(Ext.ComponentQuery.query('button[action=requests]')[0])
    // Отображаем колонку с инвойсом
    var obRequestsStore = Ext.ComponentQuery.query('#outboxRequestsGrid')[0].getStore();
    var requestGrid = Ext.ComponentQuery.query('requestsgrid')[0];
    requestGrid.headerCt.items.getAt(0).show();
    requestGrid.on('itemclick', function(view,rec){
      var obVals = Ext.getCmp("outboxForm").getForm().getValues();
      // Добавляем в локальный стор
      if(obRequestsStore.findExact('id', rec.get('id'))==-1 && obVals['client_id']==rec.get('client_id')) {
        rec.set('has_invoice',true);
        obRequestsStore.add(Ext.clone(rec));
        view.refresh();
      }
      // Общая сумма
      var outboxSumm = 0.00;
      obRequestsStore.each(function(r){
        outboxSumm += r.get('client_sum');
      });
      Ext.ComponentQuery.query('#outboxSumm')[0].setValue(outboxSumm.toFixed(2));
      rec.commit();
    })
    
  },

  // При закрытии окошка
  outboxWindowClose: function(){
    if(Ext.ComponentQuery.query('requestsgrid')[0]){
      Ext.ComponentQuery.query('requestsgrid')[0].headerCt.items.getAt(0).show();
      Gl.App.controllers.getAt(0).onBillsClick(Ext.ComponentQuery.query('button[action=bills]')[0])
    }
      
//    var requests_store = Ext.ComponentQuery.query('requestsgrid')[0].getStore();
    var requests_store = Ext.getStore('Requests');
    delete requests_store.getProxy().extraParams.outbox_client_id; requests_store.load();
    
    Ext.ComponentQuery.query('topmenu > button[action=users]')[0].enable()
    Ext.ComponentQuery.query('topmenu > button[action=bills]')[0].enable()
    Ext.ComponentQuery.query('topmenu > button[action=clietns]')[0].enable()
  },

  // Удаляет заявку из списка
  removeRequestFromList: function(request_id){
    var requestsStore = Ext.ComponentQuery.query("#outboxRequestsGrid")[0].getStore()
    requestsStore.removeAt(requestsStore.findExact('id', request_id));
    r = Ext.getStore('Requests').findRecord('id',request_id);
    r.set('has_invoice', false)
    Ext.ComponentQuery.query('requestsgrid')[0].getView().refresh();

    // Общая сумма
    var outboxSumm = 0.00;
    requestsStore.each(function(r){
      outboxSumm += r.get('client_sum');
    });
    Ext.ComponentQuery.query('#outboxSumm')[0].setValue(outboxSumm.toFixed(2));
    
  },

  outboxClientSelected: function(cmp, val){
    var requests_store = Ext.getStore('Requests');
    requests_store.getProxy().extraParams.outbox_client_id = val[0].get('id');
    requests_store.load();
    Ext.ComponentQuery.query("#outboxRequestsGrid")[0].getStore().removeAll()
    Ext.ComponentQuery.query('requestsgrid')[0].enable();
  },

  showAddBillWindow: function(){
    if (Ext.getStore('Bills').getProxy().extraParams.inbox) {
      this.inboxWindowShow()
    } else {
      var win = Ext.create("Gl.view.bills.OutboxWindow",{});
      win.show();
    }
    
  },

  toggleUnPayed: function(cmp, pressed){
    Ext.getStore('Bills').getProxy().extraParams.only_unpayed = pressed;
    Ext.getStore('Bills').load();
  },

  toggleOutbox: function(){
    Ext.ComponentQuery.query('button[action=outbox]')[0].toggle(true);
    var store = Ext.ComponentQuery.query('billsgrid')[0].getStore();
    store.getProxy().extraParams.inbox = false;
    store.load();
    
    Ext.ComponentQuery.query('#addBillBtn')[0].show()
    Ext.ComponentQuery.query('#addInboxBillBtn')[0].hide();
    Ext.ComponentQuery.query('billsgrid')[0].headerCt.items.getAt(2).show();
    Ext.ComponentQuery.query('billsgrid')[0].headerCt.items.getAt(4).show();
  },

  toggleInbox: function(){
    Ext.ComponentQuery.query('button[action=inbox]')[0].toggle(true);
    var store = Ext.ComponentQuery.query('billsgrid')[0].getStore();
    store.getProxy().extraParams.inbox = true;
    store.load();
    Ext.ComponentQuery.query('#addBillBtn')[0].hide()
    Ext.ComponentQuery.query('#addInboxBillBtn')[0].show()
    Ext.ComponentQuery.query('billsgrid')[0].headerCt.items.getAt(2).hide();
    Ext.ComponentQuery.query('billsgrid')[0].headerCt.items.getAt(4).hide();
  },

  
});

