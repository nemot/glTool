Ext.define('Gl.controller.Clients', {
    extend: 'Ext.app.Controller',

    models:['Client'],
    stores:['Clients', 'ClientTransactions'],

    init: function() {
      this.control({
        "#clientAddBtn":{click:this.showNewClientWindow},
        "#clientSaveButton":{click:this.saveClient},
        "#editClientBtn": {click:this.editClient},
        "#financesClientBtn": {click:this.showFinances},

        "clientsgrid":{itemdblclick: this.editClient},
        // Транзакции        
        "#clientFinancesGrid": {itemclick:this.editTransaction},
        "#addTransactionBtn": {click:this.addTransaction},
        "#deleteTransactionBtn": {click:this.deleteTransaction},
        "#saveTransactionBtn": {click:this.saveTransaction},
        "#clearTransactionFormBtn": {click:this.clearTransactionForm},
        // Права доступа
//        "#permissionsClientBtn": {click: this.showPermissionsWindow},
        "#downloadReportAction":{click: this.showReportsWindow}
      })
    },

    showReportsWindow: function(){
      Ext.ComponentQuery.query('clientsgrid')[0].getSelectionModel().getSelection()[0]
    },

    showPermissionsWindow: function(){
      Ext.create("Gl.view.clients.PermissionsWindow", {
        rec: Ext.ComponentQuery.query('clientsgrid')[0].getSelectionModel().getSelection()[0]
      }).show();
    },

    deleteTransaction: function(){
      var rec = Ext.getCmp('clientFinancesGrid').getSelectionModel().getSelection()[0];

      var deleteConfirmationText =  "Вы хотите удалить пополнение счета?<br/><br/>"
          deleteConfirmationText += "После удаление баланс будет пересчитан.</i><br/><br/>"
      Ext.Msg.confirm('Ванимание', deleteConfirmationText, function(answer){
        if(answer=="yes"){ 
          // Удаляем запись
          Ext.getCmp('clientFinancesGrid').getStore().remove(rec);
          // Reset формы
          Ext.getCmp('newTransactionForm').getForm().reset();
          // Меняем кнопочки
          Ext.getCmp('addTransactionBtn').setVisible(true);
          Ext.getCmp('deleteTransactionBtn').setVisible(false);
          Ext.getCmp('saveTransactionBtn').setVisible(false);
          Ext.getCmp('clearTransactionFormBtn').setVisible(false);
          // Снимаем выделение с таблицы
          Ext.getCmp('clientFinancesGrid').getSelectionModel().deselectAll();
          // И фокусируем поле суммы
          Ext.getCmp('clientFinancesValueField').focus();
        }
      })
      
    },

    saveTransaction: function(){
      var form = Ext.getCmp('newTransactionForm').getForm();
      var rec = form.getRecord();
      if(form.isValid()){
        rec.beginEdit();
        rec.set(form.getValues())
        rec.endEdit();
        this.clearTransactionForm();
      }
    },

    clearTransactionForm: function(){
      Ext.getCmp('newTransactionForm').getForm().reset();
      // Меняем кнопочки
      Ext.getCmp('addTransactionBtn').setVisible(true);
      Ext.getCmp('deleteTransactionBtn').setVisible(false);
      Ext.getCmp('saveTransactionBtn').setVisible(false);
      Ext.getCmp('clearTransactionFormBtn').setVisible(false);
      // Снимаем выделение с таблицы
      Ext.getCmp('clientFinancesGrid').getSelectionModel().deselectAll();
      // И фокусируем поле суммы
      Ext.getCmp('clientFinancesValueField').focus();
    },

    editTransaction: function(){
      var form = Ext.getCmp('newTransactionForm').getForm();
      var rec = Ext.getCmp('clientFinancesGrid').getSelectionModel().getSelection()[0];
      form.loadRecord(rec);
      // Меняем кнопочки
      Ext.getCmp('addTransactionBtn').setVisible(false);
      Ext.getCmp('deleteTransactionBtn').setVisible(true);
      Ext.getCmp('saveTransactionBtn').setVisible(true);
      Ext.getCmp('clearTransactionFormBtn').setVisible(true);
    },

    addTransaction: function(btn){
      var form = Ext.getCmp('newTransactionForm').getForm();
      var store = Ext.getCmp('clientFinancesGrid').getStore();
      if(form.isValid()){
        var vals = form.getValues();
        store.add(form.getValues());
        form.reset();
        Ext.getCmp('clientFinancesValueField').focus();
      }
    },


    showFinances: function(btn){
      Ext.create("Gl.view.clients.FinancesWindow", {
        rec: Ext.ComponentQuery.query('clientsgrid')[0].getSelectionModel().getSelection()[0]
      }).show();
    },

    editClient: function(btn){
      var selectedClient = Ext.ComponentQuery.query('clientsgrid')[0].getSelectionModel().getSelection()[0];
      Ext.create("Gl.view.clients.ClientWindow", {
        title:selectedClient.get('name'),
        rec: selectedClient
      }).show();
    },
  
    saveClient: function(btn){
      var form = Ext.getCmp('clientForm').getForm();
      var store = Ext.ComponentQuery.query('clientsgrid')[0].getStore();
      var rec = Ext.ComponentQuery.query('clientwindow')[0].rec;

      if(Ext.ComponentQuery.query('clientwindow')[0].rec.getId() > 1)
        rec.beginEdit()
      console.log(form.getValues())
      rec.set(form.getValues());

      if(Ext.ComponentQuery.query('clientwindow')[0].rec.getId() > 1)
        rec.endEdit()

      // Только в том случае если у нее нет еще ID
      if(Ext.ComponentQuery.query('clientwindow')[0].rec.getId() < 1) {
        store.add(rec);
        store.on('load', function(store){store.load(); store.un('load')});
      }
      Ext.ComponentQuery.query('clientwindow')[0].close();
      
    },

    showNewClientWindow: function(btn){
      Ext.create("Gl.view.clients.ClientWindow", {
        rec: Ext.ModelManager.create({}, 'Gl.model.Client')
      }).show();
    },
});

