Ext.define('Rq.controller.Requests', {
  extend: 'Ext.app.Controller',

  models:['Request', 'User', 'Client', 'Station', 'Code', 'Car', 'Place', 'Country'],
  stores:['Countries', 'Cars', 'Places', 'Costs', 'Clients', 'TransitStations'],

  init: function() {
    current_user = new Rq.model.User(current_user);
    current_request = new Rq.model.Request(current_request);
    this.control({
      "#addCodesMenuItem": {click:this.showAddCodesWindow},
      "#addTransitStationMenuItem": {click:this.addTransitStation},
      "#addCodesSubmitBtn": {click:this.addCodesToGrid},
      "#fromField": {specialkey:function(f,e){if(e.getKey() == e.ENTER){this.addCodesToGrid()}}},
      "#toField": {specialkey:function(f,e){if(e.getKey() == e.ENTER){this.addCodesToGrid()}}},
      "#deleteCarsMenuItem": {click:this.deleteCars},
      "#addCostsMenuItem": {click:this.addCosts},
      "#docsLink": {click:this.showDocsWindow},
//      "requestsgrid":{itemdblclick: this.showRequestWindow},
      "#saveRequestBtn": {click: this.saveRequest}
    })

  },


  // Добавляет транзитную станцию и начинает ее редактировать
  addTransitStation: function(){
    var transitStationsGrid = Ext.ComponentQuery.query('transitstationsgrid')[0];
    var transitStationsStore = transitStationsGrid.getStore();
    transitStationsStore.add({request_id:current_request.get('id'), station_id:null, station_name:''});
    setTimeout(function(){
      transitStationsGrid.plugins[0].startEdit(transitStationsStore.last(), transitStationsGrid.columns[0])
    }, 300)
  },


  saveRequest: function(){
    // Getting needed data
    var lmask = new Ext.LoadMask(Ext.ComponentQuery.query('requestviewport')[0], {msg:" Сохраняем..."});
    var carRecords = []; var placeRecords = []; var costRecords = []; var tsRecords = [];
    Ext.ComponentQuery.query('carsgrid')[0].getStore().each(function(rec){ 
      carRecords.push(Ext.encode(rec.data)) 
    })    
    Ext.ComponentQuery.query('placesgrid')[0].getStore().each(function(rec){ 
      placeRecords.push(Ext.encode(rec.data)) 
    })
    Ext.ComponentQuery.query('costsgrid')[0].getStore().each(function(rec){ 
      costRecords.push(Ext.encode(rec.data)) 
    })
    Ext.ComponentQuery.query('transitstationsgrid')[0].getStore().each(function(rec){ 
      tsRecords.push(Ext.encode(rec.data)) 
    })

    lmask.show();
    // Sending it to server
    Ext.Ajax.request({
      url: '/requests/',
      params: {
        request: Ext.encode(current_request.data),
        cars: Ext.encode(carRecords), 
        places: Ext.encode(placeRecords), 
        costs: Ext.encode(costRecords),
        transit_stations: Ext.encode(tsRecords)
      },
      success: function(response){
        var obj = Ext.decode(response.responseText);
        lmask.hide();
        if(window.opener.Ext.ComponentQuery.query('requestsgrid')[0])
          window.opener.Ext.ComponentQuery.query('requestsgrid')[0].getStore().load();
        window.close();
      }, 
      failure: function(response){
        lmask.hide();
        Ext.example.msg('Ошибка на сервере!', 'Произошла ошибка на сервере. Было послано письмо администратору с описанием проблемы.');
      }
    });

  },
  


  statics: {

    
    // Отображает окошко с документами
    showDocsWindow: function(){
      var win = Ext.create('Ext.window.Window',{
        id:'docsWindow',
        title:'Документы',
        closable:true, width:500, height:400, modal:true, layout:'fit',
        items:[ { autoScroll: true, style:'background:white !important;',
            xtype: 'dataview',
            store: 'Cars',
            tpl: Ext.create('Ext.XTemplate',
              '<tpl for=".">',
              '<div class="document-item">',
                  '<h3><a href="#" target="_blank">{tonnage}</a></h3>',
                  '<p>{codes}</p>',
              '</div></tpl>',
              { formatDate: function(value){ return Ext.Date.format(value, 'M j, Y'); }
            }),
            itemSelector: 'div.document-item'
          }
        ],
        buttons:[
          {text:'Ок', handler:function(){ win.close() }},
        ]
      });
      win.show();
    },

    // Пересчитывает заявку
    calculateRequest: function() { 
      var requestGrid = Ext.ComponentQuery.query('requestgrid')[0];
      var carsGrid = Ext.ComponentQuery.query('carsgrid')[0];
      var costsGrid = Ext.ComponentQuery.query('costsgrid')[0];

      // Считаем кол-во вагонов и общий тонаж
      var cars_num = 0;
          common_tonnage = 0;
          jd_sum = 0;
          client_sum = 0;

      carsGrid.getStore().each(function(car){ 
        if(car.get('in_use')){  // Все, кроме возврата
          cars_num+=1; 
          common_tonnage += parseInt(car.get('tonnage'));

          // Считаем ставки
          if(current_request.get("rate_for_car")){ // Если ствка за вагон
            client_sum = client_sum - 0 + car.get('rate_client')
            jd_sum = jd_sum - 0 + car.get('rate_jd_real')
          } else { // Если ставка за тонну
            client_sum = client_sum - 0 + (car.get('rate_client')*car.get('tonnage'))
            jd_sum = jd_sum  - 0 + (car.get('rate_jd_real')*car.get('tonnage'))
          }
        }
      })
      
      // Считаем накладные расходы
      costsGrid.getStore().each(function(cost){ 
        switch(cost.get('payment_type')) {
          case 0: // Разовый
            client_sum = client_sum - 0 + cost.get('rate_client')*1;
            jd_sum = jd_sum - 0 + cost.get('rate_jd')*1;
            break;
          case 1: // За вагон
            client_sum = client_sum - 0 + cost.get('rate_client')*cars_num;
            jd_sum = jd_sum - 0 + cost.get('rate_jd')*cars_num;
            break;
          case 2: // За тонну
            client_sum = client_sum - 0 + cost.get('rate_client')*common_tonnage;
            jd_sum = jd_sum - 0 + cost.get('rate_jd')*common_tonnage;
            break;
        }
      })

      // Пишем это все в модельку заявки
      current_request.set('cars_num',cars_num);
      current_request.set('common_tonnage',common_tonnage);
      current_request.set('jd_sum',jd_sum.toFixed(2));
      current_request.set('client_sum',client_sum.toFixed(2));

      // Даем новый сурс для RequestGrid
      requestGrid.setSource(current_request.getProperties())
      
    }
  },

  // Добавляет доп сборы
  addCosts: function(){
    var store = Ext.ComponentQuery.query('costsgrid')[0].getStore();
    var placesStore = Ext.ComponentQuery.query('placesgrid')[0].getStore()
    var country_name = (placesStore.count()==1) ? placesStore.first().get('country_name') : ""
    var place_id = (placesStore.count()==1) ? placesStore.first().get('id') : null
    store.add({id:store.getMinId()-1, place_id:place_id, country_name:country_name});
  },

  // Удаляет вагоны
  deleteCars: function(){
    var store = Ext.ComponentQuery.query('carsgrid')[0].getStore();
    var rec = Ext.ComponentQuery.query('carsgrid')[0].getSelectionModel().getSelection()[0];
    store.remove(rec);
  },

  // Добавляет коды из окошка в таблицу кодов
  addCodesToGrid: function(){
    var form = Ext.ComponentQuery.query('#addCodesForm')[0].getForm()
    var carsStore = Ext.ComponentQuery.query('carsgrid')[0].getStore();
    var placesStore = Ext.ComponentQuery.query('placesgrid')[0].getStore();

    // Проверяем форму на пустые значения
    if(form.isValid()){
      var values = form.getValues()
      if(values['from']>values['to'] && values['to']>0){ // Проверям на правильность введения
        Ext.example.msg('Ошибка пользователя.', 'Код "С" должен быть больше чем код "По"');
      } else { // Ну и собственно добавляем сами коды если все нормально
        var fromCode = parseInt(values['from']);
        var toCode = values['to']=="" ? fromCode : parseInt(values['to']);
        // Сначала в пустые коды существующих вагонов
        carsStore.each(function(car){
          Ext.each(car.get('codes'), function(code){
            if(parseInt(code.place_id)==values['place_id']){
              if(code.number=="" && fromCode<=toCode){ // Только в пустые ячейки
                code.number = fromCode; fromCode+=1
              }
            }
          });
        });
        // Ну и если остались не добавленые коды, то добавляем вагоны
        var cars = []
        while(fromCode<=toCode){
          var car = {id:carsStore.getMinId()-1, codes:[]};
          placesStore.each(function(place){
            car.codes.push({
              number: (parseInt(values['place_id'])==parseInt(place.get('id')) ? fromCode.toString() : ''),
              place_id:place.get('id'),
              rate_client:0,
              rate_jd_real:0,
              rate_jd:0,
              id:null,
              car_id:carsStore.getMinId()-1
            });
          });
          cars.push(car)
          fromCode+=1;
        }
        if(cars.length>0){carsStore.add(cars)};
        // В добавок обновляем отображение таблички вагонов
        Ext.ComponentQuery.query('carsgrid')[0].getView().refresh();

        // А уж потом закрываем окошко
        Ext.ComponentQuery.query('#addCodesWindow')[0].close()
      }
    }
  },
  
  // Создает окошко для добавления кодов
  showAddCodesWindow: function(){
    var placesStore = Ext.ComponentQuery.query('placesgrid')[0].getStore();
    
    if(placesStore.count()>0) { // Только если есть хоть один плейс
      var countryFieldValue = (placesStore.count()==1) ? placesStore.first().get('id') : null
      var win = Ext.create('Ext.window.Window',{
        id:'addCodesWindow',
        title:'Добавить коды',
        closable:true, width:300, height:170, modal:true, layout:'fit',
        items:[
          {xtype:'form', frame:true, id:'addCodesForm', items:[
              {fieldLabel:'Страна', name:'place_id', id:"codesPlaceIdField",
                xtype:'combo', queryMode: 'local', displayField: 'country_name', valueField: 'id', editable:false,
                store: placesStore, hideTrigger:false,
                value: countryFieldValue
              },
              {fieldLabel:'С', name:'from', id:'fromField'},
              {fieldLabel:'По', name:'to', id:'toField', allowBlank:true, emptyText:'Можно не указывать...'}
            ], 
            defaults:{labelWidth:50, anchor:'95%', hideTrigger:true, xtype:'numberfield', allowBlank:false}
          }
        ],
        buttons:[
          {text:'Отмена', handler:function(){ win.close() }},
          {text:'Добавить', iconCls:'add', id:'addCodesSubmitBtn'}
        ],
        listeners:{ afterrender:function(){ 
          if(!countryFieldValue) {
            Ext.getCmp('codesPlaceIdField').focus() 
          } else {
            Ext.getCmp('fromField').focus()
          }
          
        } }// Фокус на первое поле ввода
      });
      win.show();
    } else { // Если плейсы пусты показываем алерт
      Ext.example.msg('Ошибка пользователя.', 'Добавьте хотя бы одну страну с экспедитором.');
    }
  }
  
  
});

