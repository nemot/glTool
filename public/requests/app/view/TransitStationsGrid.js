Ext.define('Rq.view.TransitStationsGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.transitstationsgrid',
  
  title:'Транзитные станции',
  store: 'TransitStations',
  columnLines:true,
  emptyText:'Не добавлены',

  selType: 'rowmodel',
  plugins: [ Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 }) ],

  // Колонки
  columns:[
    {header:'', flex:1, dataIndex:'station_id', menuDisabled:true,
      editor: { xtype:'combo',pageSize: 50,
        displayField: 'name', valueField:'id', typeAhead: false,
        hideLabel: true, hideTrigger:true, anchor: '100%', minChars:2,
        store: Ext.create('Rq.store.Autocomplete', { pr_url: "/stations"}),
        listConfig: { loadingText: 'Поиск...', emptyText: 'Ни чего не найдено.',
            getInnerTpl: function() { return '{name}'; }
        },
        listeners: {
          select: function(cmp, val, b){
            rec = Ext.ComponentQuery.query('transitstationsgrid')[0].plugins[0].getActiveRecord();
            rec.set("station_id",val[0].get('id'));
            rec.set("station_name",val[0].get('name'));
    //        grid.fireEvent('propertychange');
          }
        }

      },
      renderer: function(v,options,rec){ return rec.get('station_name')}
    },  
  ],

  initComponent: function(){
    this.listeners = {
      itemcontextmenu: this.showContextMenu,
      containercontextmenu: this.showContainerContextMenu
    };
    this.callParent();
    console.log(this.getView().emptyText)
    this.getView().emptyText = "Hello there!"
  },


  // Отображает контекстное меню для таблички
  showContainerContextMenu: function(view, e){
    var grid = Ext.ComponentQuery.query('transitstationsgrid')[0];
    var menu = Ext.create('Ext.menu.Menu', { items: [] });
    var addAction = {text:'Добавить <i class="hint">*Ctrl+M</i>', iconCls:'add', id:'addTransitStationMenuItem'};
    menu.add(addAction);
    menu.showAt(e.getXY())
  },

  // Отображает контекстное меню для айтема
  showContextMenu: function(view, rec, item, index, e){
    var grid = Ext.ComponentQuery.query('transitstationsgrid')[0];
    var rec = grid.getSelectionModel().getSelection()[0];
    var menu = Ext.create('Ext.menu.Menu', { items: [] });
    var deleteAction = {text:'Удалить', iconCls:'delete', id:'deleteTransitStationMenuItem', handler:function(){
      grid.getStore().remove(rec);
    }};
    var addAction = {text:'Добавить <i class="hint">*Ctrl+M</i>', iconCls:'add', id:'addTransitStationMenuItem'};
    menu.add(addAction);
    menu.add('');
    menu.add(deleteAction);
    menu.showAt(e.getXY())
  },


})
