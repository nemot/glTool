Ext.define('Gl.controller.Bills', {
  extend: 'Ext.app.Controller',

  models:['Bill'],
  stores:['Bills'],

  init: function() {
    this.control({
      "billsgrid":{afterrender: this.toggleOutbox},
      'button[action=outbox]':{click:this.toggleOutbox},
      'button[action=inbox]':{click:this.toggleInbox},
      '#addBillBtn':{click:this.showAddBillWindow},
      '#preformOutboxBillBtn': {click:this.preformOutboxBillBtn},
      'outboxwindow': {close:this.outboxWindowClose, show:this.outboxWindowShow, afterrender:this.cleanupOutboxForm},
      '#outboxClientIdField': {select:this.outboxClientSelected}
    })
  },

  // Сохраняем и счет
  preformOutboxBillBtn: function(){
    // Собираем заявки
    var requestIDS = [];
    Ext.ComponentQuery.query('#outboxRequestsGrid')[0].getStore().each(function(rq){
      requestIDS.push(rq.get('id'))
    })
    // Собираем остальные поля
    var vals = Ext.getCmp("outboxForm").getForm().getValues()

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
        
//        lmask.hide();
//        if(window.opener.Ext.ComponentQuery.query('requestsgrid')[0])
//          window.opener.Ext.ComponentQuery.query('requestsgrid')[0].getStore().load();
//        window.close();
      }, 
      failure: function(response){
//        lmask.hide();
        Ext.example.msg('Ошибка на сервере!', 'Произошла ошибка на сервере. Было послано письмо администратору с описанием проблемы.');
      }
    });

    console.log(requestIDS)
    console.log(vals)
  },

  // Чистим формочку
  cleanupOutboxForm: function(){
    Ext.ComponentQuery.query('#outboxRequestsGrid')[0].getStore().removeAll();
  },

  // При открытии окошка
  outboxWindowShow: function(){
    Gl.App.controllers.getAt(0).onRequestsClick(Ext.ComponentQuery.query('button[action=requests]')[0])
    Ext.ComponentQuery.query('topmenu > button[action=users]')[0].disable();
    Ext.ComponentQuery.query('topmenu > button[action=bills]')[0].disable();
    Ext.ComponentQuery.query('topmenu > button[action=clietns]')[0].disable();
  
    var obRequestsStore = Ext.ComponentQuery.query('#outboxRequestsGrid')[0].getStore();
    var requestGrid = Ext.ComponentQuery.query('requestsgrid')[0];
    // Отображаем колонку с инвойсом
    requestGrid.headerCt.items.getAt(0).show();
    // Дизейблим грид
    requestGrid.disable();
    requestGrid.on('itemclick', function(view,rec){
      // Добавляем в локальный стор
      console.log(obRequestsStore.findExact('id', rec.get('id')))
      if(obRequestsStore.findExact('id', rec.get('id'))==-1){
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
      Ext.ComponentQuery.query('#outboxSumm')[0].enable();
      Ext.ComponentQuery.query('#outboxNumber')[0].enable();
      Ext.ComponentQuery.query('#outboxRequestsGrid')[0].enable();
    })
  },

  // При закрытии окошка
  outboxWindowClose: function(){
    Ext.ComponentQuery.query('requestsgrid')[0].headerCt.items.getAt(0).show();
    var requests_store = Ext.ComponentQuery.query('requestsgrid')[0].getStore();
    delete requests_store.getProxy().extraParams.outbox_client_id; requests_store.load();
    Gl.App.controllers.getAt(0).onBillsClick(Ext.ComponentQuery.query('button[action=bills]')[0])
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
    
    if( requestsStore.count()==0 ){ // Дизейблим поля если заявок нет
      Ext.ComponentQuery.query('#outboxSumm')[0].disable();
      Ext.ComponentQuery.query('#outboxNumber')[0].disable();
      Ext.ComponentQuery.query('#outboxRequestsGrid')[0].disable();
    }
  },

  outboxClientSelected: function(cmp, val){
    var requests_store = Ext.getStore('Requests');
    requests_store.getProxy().extraParams.outbox_client_id = val[0].get('id');
    requests_store.load();
    Ext.ComponentQuery.query('requestsgrid')[0].enable();
  },

  showAddBillWindow: function(){
    var win = Ext.create("Gl.view.bills.OutboxWindow",{});
    win.show();
  },

  toggleOutbox: function(){
    Ext.ComponentQuery.query('button[action=outbox]')[0].toggle(true);
    var store = Ext.ComponentQuery.query('billsgrid')[0].getStore();
    store.getProxy().extraParams.inbox = false;
    store.load();
    Ext.ComponentQuery.query('#addBillBtn')[0].show()
  },

  toggleInbox: function(){
    Ext.ComponentQuery.query('button[action=inbox]')[0].toggle(true);
    var store = Ext.ComponentQuery.query('billsgrid')[0].getStore();
    store.getProxy().extraParams.inbox = true;
    store.load();
    Ext.ComponentQuery.query('#addBillBtn')[0].hide()
  },

  
});

