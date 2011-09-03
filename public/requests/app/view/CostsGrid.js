Ext.define('Rq.view.CostsGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.costsgrid',
  
  title:'Доп. сборы',
  store: 'Costs',
  columnLines:true,
  columns:[
    {header: 'Страна', dataIndex:'country_name', menuDisabled:true},
    {header: 'Наименование', dataIndex:'name', flex:1, menuDisabled:true},
    {header: 'ЖД', dataIndex:'rate_jd', menuDisabled:true},
    {header: 'Клиенту', dataIndex:'rate_client', menuDisabled:true},
    {header: 'Вид оплаты', dataIndex:'payment_type', menuDisabled:true}
  ],

  initComponent: function(){
    this.listeners = {
//      itemcontextmenu: this.showContextMenu
    };
    this.callParent();

  }

})
