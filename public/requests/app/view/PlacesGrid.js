Ext.define('Rq.view.PlacesGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.placesgrid',
  
  title:'Территории',
  store: 'Places',

  selType: 'rowmodel',
  plugins: [
      Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
      })
  ],

  columnLines:true,

  columns:[
    {header: 'Страна', dataIndex:'country_name', menuDisabled:true},
    {header: 'Экспедитор', dataIndex:'exp_id', flex:1, menuDisabled:true, 
      renderer:function(v, metaData, rec){return rec.get('expeditor_name')},
      field:{
        xtype:'combo', queryMode: 'local', displayField: 'name', valueField: 'id', editable:false,
        store: new Ext.data.Store({ autoLoad:true,
          fields: [ {name:'id', type:'int'}, {name:'name',  type:'string'}],
          proxy: { type: 'rest', url : '/clients', reader: {type:'json', root:'clients'} , extraParams: { only_exp:true }},
        }),
        listeners:{
          select:function(field, val, options){ 
            var grid = Ext.ComponentQuery.query('placesgrid')[0];
            var rec = grid.getSelectionModel().getSelection()[0];
            rec.set('exp_id', val[0].get('id'))
            rec.set('expeditor_name', val[0].get('name'))
          }
        }
      }
    },
  ],

  initComponent: function(){
    this.listeners = {
      itemcontextmenu: this.showContextMenu,
      containercontextmenu: this.showContainerContextMenu
    };
    this.callParent();

  },

  showContainerContextMenu: function(view, e){
    var grid = Ext.ComponentQuery.query('placesgrid')[0];
    var addCountryAction = { text:'Добавить страну', iconCls:'add', menu:{ items:[ ] }};

    var menu = Ext.create('Ext.menu.Menu', { items: [] });
    
    var countriesStore = Ext.create('Rq.store.Countries', {});
    countriesStore.each(function(c){
      var existInPlaces = grid.getStore().findBy(function(r,id ){
        return r.get('country_id').toString()==c.get('id').toString()
      });

      if(existInPlaces==-1) {
        addCountryAction.menu.items.push({text:c.get('name'), handler:function(){
          var rs = grid.getStore().add({id:grid.getStore().getMinId()-1, expeditor_name:'', exp_id:0, country_name:c.get('name'), country_id:c.get('id')})[0];
          Rq.view.CarsGrid.addPlaceToStore(rs);
          Rq.view.CarsGrid.addColumn(rs);
          Ext.ComponentQuery.query('carsgrid')[0].getView().refresh();
        }})
      }
    })
    menu.add(addCountryAction);
    menu.showAt(e.getXY())
  },// EO showContainerContextMenu

  showContextMenu: function(view, rec, item, index, e){
    var grid = Ext.ComponentQuery.query('placesgrid')[0];
    var rec = grid.getSelectionModel().getSelection()[0];

    var deleteAction = {
      iconCls: 'delete', text: 'Удалить',
      handler: function(widget, event) {
        grid.getStore().remove(rec);
      }
    };

    var addCountryAction = { text:'Добавить страну', iconCls:'add', menu:{
      items:[ ]
    }};

    var menu = Ext.create('Ext.menu.Menu', {
        items: []
    });
    
    var countriesStore = Ext.create('Rq.store.Countries', {});
    countriesStore.each(function(c){
      var existInPlaces = grid.getStore().findBy(function(r,id ){
        return r.get('country_id').toString()==c.get('id').toString()
      });

      if(existInPlaces==-1) {
        addCountryAction.menu.items.push({text:c.get('name'), handler:function(){
          var rs = grid.getStore().add({id:grid.getStore().getMinId()-1, expeditor_name:'', exp_id:0, country_name:c.get('name'), country_id:c.get('id')})[0];
          Rq.view.CarsGrid.addPlaceToStore(rs);
          Rq.view.CarsGrid.addColumn(rs);
          Ext.ComponentQuery.query('carsgrid')[0].getView().refresh();
        }})
      }
    })

    menu.add(addCountryAction);
    menu.add('-');
    menu.add(deleteAction);

    menu.showAt(e.getXY())
  }, //EO showContextMenu

})
