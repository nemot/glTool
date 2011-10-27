Ext.define('Rq.view.CarsGrid', {
  extend: 'Ext.grid.Panel',
  alias : 'widget.carsgrid',
  
  title:'Вагоны и коды',
  height:419, flex:1, columnLines:true,
  store: 'Cars',
  selType: 'rowmodel',
  lastEditorId: null,
  jdRealColumn: {header: '~~~~~~~~', dataIndex:'', width:1, hidden:true, disabled:true}, // Пустышка.

  plugins: [ Ext.create('Ext.grid.plugin.CellEditing', {id:'carsEditPlugin', clicksToEdit: 1, listeners:{
    validateedit:function(editor,e,options){
      if(e.field.toString() == "codes"){
        var carsgrid = Ext.ComponentQuery.query('carsgrid')[0];
        var lastEditorField = Ext.getCmp(carsgrid.lastEditorId);
        var newValue = lastEditorField.getValue();
        newValue = lastEditorField.param!="number" ? parseFloat(newValue.toString().replace(",", '\.')) : newValue
        var code = Ext.Array.filter(e.record.get('codes'), function(i){
          return i.place_id==lastEditorField.place_id
        })[0];
        eval("code."+lastEditorField.param+" = newValue")
        Rq.view.CarsGrid.recalcRates(e.record);
        carsgrid.lastEditorId = null;
        carsgrid.getView().refresh();
        e.cancel = true;
        // И пересчитываем заявку
        Rq.controller.Requests.calculateRequest()
      }
    
      if(e.field.toString() == "rate_jd_real" && !current_user.is_engineer()){
        Ext.each(e.record.get('codes'), function(c){ c.rate_jd_real = 0.00; })
      }

      if(e.field.toString() == "rate_jd"){
        Ext.each(e.record.get('codes'), function(c){ c.rate_jd = 0.00; })
      }
      
      if(e.field.toString() == "rate_client"){
        Ext.each(e.record.get('codes'), function(c){ c.rate_client = 0.00; })
      }

    }, 
    edit: function(){
      // Пересчитываем заявку
      Rq.controller.Requests.calculateRequest()
    }
  }}) ],
  

  columns:{

    items:[
      {header: 'Номер', dataIndex:'number', flex:1, field:{xtype:'textfield'}, selectOnFocus:true},
      {header: 'Вес', dataIndex:'weight', width:45, xtype: 'numbercolumn', hidden:true, 
        field:{xtype:'numberfield', hideTrigger: true, decimalSeparator:','}, selectOnFocus:true},
      {header: 'Тнж.', dataIndex:'tonnage', width:35, field:{xtype:'numberfield', hideTrigger: true, allowDecimals:false},
        tdCls:'border-right', cls:'border-right', selectOnFocus:true },
      {header: 'Дата отгр.', dataIndex:'shipping_date', xtype:'datecolumn', format:'d.m.Y', width:70, hidden:true, 
        field:{xtype:'datefield'}, selectOnFocus:true},
      {header: 'Накладная', dataIndex:'waybill', width:70, hidden:true, field:{xtype:'textfield'}, tdCls:'border-right', 
        cls:'border-right', selectOnFocus:true },
    ], defaults:{}
  },


  initComponent: function(){
    this.listeners = {
      afterrender: this.addColumnsAfterRender,
      itemcontextmenu: this.showContextMenu,
      containercontextmenu: this.showContainerContextMenu
    };

    // TODO После изменении ставок на вагон соответствующие ставки на коды обнуляются
    // Добавляем колонки со ставками возвратом
    if(!current_user.is_engineer()) {
      this.jdRealColumn = {
        header: '<b> ЖДР</b>', dataIndex:'rate_jd_real', width:55, xtype: 'numbercolumn', format:'0.00',  align:'right',
        field:{xtype:'numberfield', hideTrigger: true, decimalSeparator:',', selectOnFocus:true}, tdCls:'bold'
      }
    }
    this.columns.items.push({header: '<b>ИТОГО</b>', dataIndex:'', columns:[
      this.jdRealColumn,
      {header: '<b>ЖД</b>', dataIndex:'rate_jd', width:55, xtype: 'numbercolumn', format:'0.00',  align:'right',
        field:{xtype:'numberfield', hideTrigger: true, decimalSeparator:',', selectOnFocus:true}, tdCls:'bold' },
      {header: '<b>КЛИЕНТ</b>', dataIndex:'rate_client', width:55, xtype: 'numbercolumn', format:'0.00',  align:'right',
        field:{xtype:'numberfield', hideTrigger: true, decimalSeparator:',' , selectOnFocus:true}, tdCls:'bold'}
    ]})
//    this.columns.items.push()
    this.columns.items.push({
      header: 'Возв.', dataIndex:'in_use', width:40, renderer:function(v){ return v ? "Нет" : "Да" }, 
      field:{xtype:'combo', queryMode: 'local', editable:false, store:[[true, 'Нет'], [false, 'Да']]}
    })

    
    this.callParent();
    
  },

  // Отображает контекстное меню для таблички
  showContainerContextMenu: function(view, e){
    var grid = Ext.ComponentQuery.query('carsgrid')[0];
    var menu = Ext.create('Ext.menu.Menu', { items: [] });

    var addAction = {text:'Добавить коды <i class="hint">*Ctrl+C</i>', iconCls:'add', id:'addCodesMenuItem'};
    menu.add(addAction);
    menu.showAt(e.getXY())
  },
  
  // Отображает контекстное меню для айтема
  showContextMenu: function(view, rec, item, index, e){
    var grid = Ext.ComponentQuery.query('carsgrid')[0];
    var rec = grid.getSelectionModel().getSelection()[0];
    var menu = Ext.create('Ext.menu.Menu', { items: [] });
    var deleteAction = {text:'Удалить', iconCls:'delete', id:'deleteCarsMenuItem'}
    var addAction = {text:'Добавить коды <i class="hint">*Ctrl+C</i>', iconCls:'add', id:'addCodesMenuItem'};
    var fillSameWayAction = { text:'Заполнить так же', iconCls:'edit', menu:{
      items:[ ]
    }};
     // Запонение ставками
    fillSameWayAction.menu.items.push({text:'Ставки <i class="hint">*Ctrl+F</i>', handler:function(){
      var carsStore = Ext.ComponentQuery.query('carsgrid')[0].getStore();
      var selectedCar = Ext.ComponentQuery.query('carsgrid')[0].getSelectionModel().getSelection()[0];
      if(!selectedCar){selectedCar = carsStore.first()}
      carsStore.each(function(car){
        if(car!=selectedCar) {
          Ext.each(car.get('codes'), function(code, index){
            code.rate_jd_real = selectedCar.get('codes')[index].rate_jd_real;
            code.rate_jd = selectedCar.get('codes')[index].rate_jd;
            code.rate_client = selectedCar.get('codes')[index].rate_client;
          })
          Rq.view.CarsGrid.recalcRates(car);
          car.beginEdit();
          car.set('rate_jd_real', selectedCar.get('rate_jd_real'))
          car.set('rate_jd', selectedCar.get('rate_jd'))
          car.set('rate_client', selectedCar.get('rate_client'))
          car.endEdit(); 
        }
      });
      Rq.controller.Requests.calculateRequest()
    }});

    fillSameWayAction.menu.items.push('-')

    // Заполнение весом
    fillSameWayAction.menu.items.push({text:'Вес', handler:function(){
      var carsStore = Ext.ComponentQuery.query('carsgrid')[0].getStore();
      var selectedCar = Ext.ComponentQuery.query('carsgrid')[0].getSelectionModel().getSelection()[0];
      carsStore.each(function(car){
        car.set('weight', selectedCar.get('weight'))
      })
    }})
    // Заполнение тоннажом
    fillSameWayAction.menu.items.push({text:'Тоннаж', handler:function(){
      var carsStore = Ext.ComponentQuery.query('carsgrid')[0].getStore();
      var selectedCar = Ext.ComponentQuery.query('carsgrid')[0].getSelectionModel().getSelection()[0];
      carsStore.each(function(car){
        car.set('tonnage', selectedCar.get('tonnage'))
      });
      Rq.controller.Requests.calculateRequest()
    }})
  
    // Заполнение датой отгрузки
    fillSameWayAction.menu.items.push({text:'Дата отгрузки', handler:function(){
      var carsStore = Ext.ComponentQuery.query('carsgrid')[0].getStore();
      var selectedCar = Ext.ComponentQuery.query('carsgrid')[0].getSelectionModel().getSelection()[0];
      carsStore.each(function(car){
        car.set('shipping_date', selectedCar.get('shipping_date'))
      })
    }})
    
    
    
    menu.add(addAction);
    menu.add(fillSameWayAction);
    menu.add('');
    menu.add(deleteAction);
    menu.showAt(e.getXY())
  },

  statics: {
    // Пересчитывает ставки для одного вагона
    recalcRates: function(record){
      var rate_jd_sum = 0.00,
          rate_client_sum = 0.00,
          rate_jd_real_sum = 0.00;
      Ext.each(record.get('codes'), function(i){
        rate_jd_sum += i.rate_jd; rate_client_sum += i.rate_client; 
        if(!current_user.is_engineer()){rate_jd_real_sum += i.rate_jd_real};
      })
      if(!current_user.is_engineer()){record.set('rate_jd_real', rate_jd_real_sum)};
      record.set('rate_jd', rate_jd_sum);
      record.set('rate_client', rate_client_sum);
    },

    // Удаляет плейс из кодов у всех вагонов
    removePlaceFromStore: function(place) {
      Ext.ComponentQuery.query('carsgrid')[0].getStore().each(function(car){
        var nc = car.get('codes').map(function(code){ if(code.place_id.toString() != place.get('id').toString()){return  code} })
        car.set('codes', Ext.Array.clean(nc))
      });
    },

    // Удаляет колонки, созданые для плейса
    removeColumn: function(pl){
      var cmp = Ext.ComponentQuery.query('carsgrid')[0];
      var column = null;
      do{
        column = cmp.headerCt.items.findBy(function(rec){
          return rec.dataIndex.toString()==pl.get('id').toString()
        });
        cmp.headerCt.remove(column);
      } while(column)

      cmp.headerCt.remove(cmp.headerCt.items.findBy(function(rec){
        if(rec.place_id){
          return rec.place_id.toString()==pl.get('id').toString()
        } else {
          return false
        }
      }));

      cmp.getView().refresh();
    },

    // Добавляем плейс к кодам для всех вагонов
    addPlaceToStore: function(place){
      var store = Ext.ComponentQuery.query('carsgrid')[0].getStore();
      store.each(function(car){
        car.get('codes').push({
          car_id: car.get('id'), id: -1, number: "", place_id: place.get('id'), rate_client: 0, rate_jd: 0, rate_jd_real: 0
        })
      });
    },

    // Добавляем колонку для кода в табличку
    addColumn: function(pl){
      var cmp = Ext.ComponentQuery.query('carsgrid')[0];
      var countriesStore = Ext.getStore('Countries');
      var short_name = countriesStore.getById(pl.get('country_id')).get('short_name')        
        if(short_name==""){short_name = countriesStore.getById(pl.get('country_id')).get('name')}
      var codesNum = Ext.ComponentQuery.query('placesgrid')[0].getStore().count()-1;

      var ratesColumn = {header:short_name, dataIndex:pl.get('id'), columns:[], cls:'border-right'};
      
      // Ставка ЖДР
      if(!current_user.is_engineer()){
      ratesColumn.columns.push({header:"ЖДР", dataIndex:'codes',width:55, editable:true, align:'right',
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            return Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id') 
            })[0].rate_jd_real.toFixed(2).toString().replace("\.", ',');
          },
          field:{xtype:'textfield', place_id:pl.get('id'), param:'rate_jd_real', listeners:{focus:function(c, options){
            Ext.ComponentQuery.query('carsgrid')[0].lastEditorId = c.id;
            col = cmp.plugins[0].getActiveColumn(); rec = cmp.plugins[0].getActiveRecord();
            c.setValue(Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id')
            })[0].rate_jd_real.toFixed(2).toString().replace("\.", ','))
            c.focus(true)
          }}},
          getEditor:function(record, defaultValue){return Ext.create('Ext.grid.CellEditor', {field:this.field})}
        })
      }
      // Ставка ЖД
      ratesColumn.columns.push({header:"ЖД", dataIndex:'codes', width:55, editable:true, align:'right',
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            return Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id') 
            })[0].rate_jd.toFixed(2).toString().replace("\.", ',');
          },
          field:{xtype:'textfield', place_id:pl.get('id'), param:'rate_jd', listeners:{focus:function(c, options){
            Ext.ComponentQuery.query('carsgrid')[0].lastEditorId = c.id;
            col = cmp.plugins[0].getActiveColumn(); rec = cmp.plugins[0].getActiveRecord();
            c.setValue(Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id')
            })[0].rate_jd.toFixed(2).toString().replace("\.", ','))
            c.focus(true)
          }}},
          getEditor:function(record, defaultValue){return Ext.create('Ext.grid.CellEditor', {field:this.field})}
        })
      // Ставка КЛИЕНТУ
      ratesColumn.columns.push({header:"КЛ.", dataIndex:"codes", width:55, tdCls:'border-right', cls:'border-right', align:'right',
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            return Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id') 
            })[0].rate_client.toFixed(2).toString().replace("\.", ',');
          },
          field:{xtype:'textfield', place_id:pl.get('id'), param:'rate_client', listeners:{focus:function(c, options){
            Ext.ComponentQuery.query('carsgrid')[0].lastEditorId = c.id;
            col = cmp.plugins[0].getActiveColumn(); rec = cmp.plugins[0].getActiveRecord();
            c.setValue(Ext.Array.filter(rec.get('codes'), function(i){ 
              return i.place_id==pl.get('id')
            })[0].rate_client.toFixed(2).toString().replace("\.", ','))
            c.focus(true)
          }}},
          getEditor:function(record, defaultValue){return Ext.create('Ext.grid.CellEditor', {field:this.field})}

        })

      cmp.headerCt.insert(cmp.columns.length-2-codesNum, Ext.create('Ext.grid.column.Column', ratesColumn))
      // Добавляем коды для каждого плейса
//      short_name = countriesStore.getById(pl.get('country_id')).get('short_name') 
      cmp.headerCt.insert(cmp.columns.length-1, Ext.create('Ext.grid.column.Column', 
        {header:"Код "+short_name, dataIndex:"codes", place_id:pl.get('id'), width:70, 
          renderer:function(data, metaData, rec, rowIndex, colIndex, store, view){
            return Ext.Array.filter(rec.get('codes'), function(i){ return i.place_id==pl.get('id') })[0].number
          },
          field:{xtype:'textfield', place_id:pl.get('id'), param:'number', listeners:{focus:function(c, options){
            Ext.ComponentQuery.query('carsgrid')[0].lastEditorId = c.id;
            col = cmp.plugins[0].getActiveColumn(); rec = cmp.plugins[0].getActiveRecord();
            c.setValue(Ext.Array.filter(rec.get('codes'), function(i){ return i.place_id==pl.get('id')})[0].number)
          }}},
          getEditor:function(record, defaultValue){return Ext.create('Ext.grid.CellEditor', {field:this.field})}
        }
      ))
      cmp.plugins.push(Ext.create('Ext.grid.plugin.CellEditing', {id:'carsEditPlugin', clicksToEdit: 1}))
    }
  },

  // То, что происходит после рендера таблица
  addColumnsAfterRender: function(cmp, options){
    var placesStore = Ext.ComponentQuery.query('placesgrid')[0].getStore();
    var countriesStore = Ext.getStore('Countries');
    // Добавляем ставки для каждого плейса
    placesStore.each(function(pl){
      Rq.view.CarsGrid.addColumn(pl)
    })

  },



})
