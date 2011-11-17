Ext.define('Gl.controller.TopMenu', {
    extend: 'Ext.app.Controller',

    init: function() {
      this.control({
        'topmenu': {afterrender: this.afterTopMenuRendered},
        'maincontainer': {afterrender: this.showDefaultController},
        'topmenu > button[action=users]': { click: this.onUsersClick },
        'topmenu > button[action=requests]': { click: this.onRequestsClick },
        'topmenu > button[action=clietns]': { click: this.onClientsClick },
        'topmenu > button[action=bills]': { click: this.onBillsClick },
      });
    },

    afterTopMenuRendered: function(cmp){
      cmp.query('button[action=bills]')[0].toggle(true);
    },

    showDefaultController: function(mainContainer){
      this.addToMainContainer({xtype:'billsgrid'})
    },

    onUsersClick: function(self){
      self.toggle(true);
      this.addToMainContainer({xtype:'usersgrid'})
    },
    
    onClientsClick: function(self){
      self.toggle(true);
      this.addToMainContainer({xtype:'clientsgrid'})
    },

    onRequestsClick: function(self){
      self.toggle(true)
      this.addToMainContainer({xtype:'requestsgrid'})
    },

    onBillsClick: function(self){
      self.toggle(true)
      this.addToMainContainer({xtype:'billsgrid'})
    },

    addToMainContainer: function(cmp){
      var mainContainer = Ext.ComponentQuery.query('maincontainer')[0];
      mainContainer.removeAll();
      mainContainer.add(cmp);
    }


});
