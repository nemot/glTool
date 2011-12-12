Ext.define('Gl.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
      'Gl.view.TopMenu',
      'Gl.view.MainContainer',

      'Gl.view.RowExpander',
      'Ext.selection.CheckboxModel',

      'Gl.view.users.MainGrid',
      'Gl.view.users.UserWindow',
      'Gl.view.users.EditUserWindow',
      'Gl.view.users.ChangePasswordWindow',

      'Gl.view.clients.MainGrid',
      'Gl.view.clients.ClientWindow',
      'Gl.view.clients.FinancesWindow',
      'Gl.view.clients.PermissionsWindow',

      'Gl.view.bills.TabPanel',
      'Gl.view.bills.MainGrid',
//      'Gl.view.bills.OutboxWindow',
//      'Gl.view.bills.InboxWindow',

      'Gl.view.requests.MainGrid',
    ],
    id: 'viewport',
    layout: 'border',

    initComponent: function() {
      this.items = [{region:'north', xtype:'topmenu'},{region:'center', xtype:'maincontainer'}];
      this.callParent(arguments);
    }
});
