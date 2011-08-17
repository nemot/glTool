/**
 * The main viewport, split in to a west and center region.
 * The North region should also be shown by default in the packaged
 * (non-live) version of the docs. TODO: close button on north region.
 */
Ext.define('Gl.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
      'Gl.view.TopMenu',
      'Gl.view.MainContainer',

      'Gl.view.users.MainGrid',
      'Gl.view.users.UserWindow',
      'Gl.view.users.EditUserWindow',
      'Gl.view.users.ChangePasswordWindow',

      'Gl.view.clients.MainGrid',
      'Gl.view.clients.ClientWindow',
      'Gl.view.clients.FinancesWindow',
      'Gl.view.clients.PermissionsWindow',

      'Gl.view.requests.MainGrid',
    ],
    id: 'viewport',
    layout: 'border',

    initComponent: function() {
      this.items = [{region:'north', xtype:'topmenu'},{region:'center', xtype:'maincontainer'}];
      this.callParent(arguments);
    }
});
