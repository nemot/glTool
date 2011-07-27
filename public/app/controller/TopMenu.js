Ext.define('Gl.controller.TopMenu', {
    extend: 'Ext.app.Controller',

    init: function() {
      this.control({
        'topmenu': {afterrender: this.afterTopMenuRendered},
        'maincontainer': {afterrender: this.addUsersGridToContainer},
        'topmenu > button[action=users]': { click: this.onUsersClick },
        'topmenu > button[action=statements]': { click: this.onStatementsClick },
        'topmenu > button[action=clietns]': { click: this.onClientsClick },
        'topmenu > button[action=reports]': { click: this.onReportsClick },
      });
    },

    afterTopMenuRendered: function(cmp){
      cmp.query('button[action=users]')[0].toggle(true);
    },

    addUsersGridToContainer: function(mainContainer){
      this.addToMainContainer({xtype:'usersgrid'})
    },

    onUsersClick: function(self){
      self.toggle(true);
      this.addToMainContainer({xtype:'usersgrid'})
    },
    
    onClientsClick: function(self){
      self.toggle(true);
      this.addToMainContainer({xtype:'button', text:'clients'})
    },

    onStatementsClick: function(self){
      self.toggle(true)
      this.addToMainContainer({xtype:'button', text:'Statements'})
    },

    onReportsClick: function(self){
      self.toggle(true)
      this.addToMainContainer({xtype:'button', text:'reports'})
    },

    addToMainContainer: function(cmp){
      var mainContainer = Ext.ComponentQuery.query('maincontainer')[0];
      mainContainer.removeAll();
      mainContainer.add(cmp);
    }


});
