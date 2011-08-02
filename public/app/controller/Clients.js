Ext.define('Gl.controller.Clients', {
    extend: 'Ext.app.Controller',

    models:['Client'],
    stores:['Clients'],

    init: function() {
      this.control({
        "#clientAddBtn":{click:this.showNewClientWindow},
        "#clientSaveButton":{click:this.saveClient},
        "#editClientBtn": {click:this.editClient},
        "clientsgrid":{itemdblclick:this.editClient},
      })
    },

    editClient: function(btn){
      Ext.create("Gl.view.clients.ClientWindow", {
        rec: Ext.ComponentQuery.query('clientsgrid')[0].getSelectionModel().getSelection()[0]
      }).show();
    },
  
    saveClient: function(btn){
      var form = Ext.getCmp('clientForm').getForm();
      var store = Ext.ComponentQuery.query('clientsgrid')[0].getStore();
      var rec = Ext.ComponentQuery.query('clientwindow')[0].rec;

      if(Ext.ComponentQuery.query('clientwindow')[0].rec.getId() > 1)
        rec.beginEdit()
      
      rec.set(form.getValues());

      if(Ext.ComponentQuery.query('clientwindow')[0].rec.getId() > 1)
        rec.endEdit()

      // Только в том случае если у нее нет еще ID
      if(Ext.ComponentQuery.query('clientwindow')[0].rec.getId() < 1) {
        store.add(rec);
        store.load();
      }
      Ext.ComponentQuery.query('clientwindow')[0].close();
      
    },

    showNewClientWindow: function(btn){
      Ext.create("Gl.view.clients.ClientWindow", {
        rec: Ext.ModelManager.create({}, 'Gl.model.Client')
      }).show();
    },
});

