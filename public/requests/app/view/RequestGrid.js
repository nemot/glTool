Ext.define('Rq.view.RequestGrid', {
  extend: 'Ext.grid.property.Grid',
  alias : 'widget.requestgrid',
  rec: null,
  title:'Заявка  ',
  columnLines:true, hideHeaders:true, 
  nameField: 'name',
  valueField: 'value',

  propertyNames:{
    a_client_id:"Клиент",
    b_station_from_id: "Ст.ОТПР",
    c_station_to_id: "Ст.НАЗН",
    d_load_id: "Груз",
    e_date_of_issue: "Дата. выдачи",
    f_valid_until: "Действ. до",
    g_type_of_transportation: "Вид перевозки",
    h_ownership: "Принадл. сост",
    i_car_type_id: "Род подв. сост.",
    j_sender: "Отправитель",
    k_receiver: "Получатель",
    l_gu12: "ГУ-12",
    m_rate_for_car: "Ставка за",
    p_cars_num: "<span class='bold'>Кол-во вагонов</span>",
    q_common_tonnage: "<span class='bold'>Суммарн. тоннаж</span>",
    n_client_sum: "<span class='bold'>Сумма КЛ.</span>",
    o_jd_sum:"<span class='bold'>Сумма ЖД.</span>"
  },

  customRenderers: {
    a_client_id: function(v){ return this.up().rec.get('client_name')},
    i_car_type_id: function(v){ return this.up().rec.get('car_type_name')},
    b_station_from_id: function(v){ return this.up().rec.get('station_from_name')},
    c_station_to_id: function(v){ return this.up().rec.get('station_to_name')},
    d_load_id: function(v){ return this.up().rec.get('load_name')},
    m_rate_for_car: function(v){ return v ? 'Вагон' : 'Тонну'},
    n_client_sum: function(v) {return "<span class='bold'>"+v+"</span>"},
    o_jd_sum: function(v) {return "<span class='bold'>"+v+"</span>"},
    p_cars_num: function(v) {return "<span class='bold'>"+v+"</span>"},
    q_common_tonnage: function(v) {return "<span class='bold'>"+v+"</span>"},
    e_date_of_issue: function(v){ return Ext.Date.format(v,'d.m.y')},
    f_valid_until: function(v){ return Ext.Date.format(v,'d.m.y')}
  },

  customEditors: {

    m_rate_for_car: Ext.create('Ext.form.field.ComboBox', {
      store:[[true, 'Вагон'], [false, 'Тонну']], queryMode:'local', editable:false,
    }),
    
    b_station_from_id: Ext.create('Rq.view.Autocomplete', {pr_url:'/stations', pr_name:'station_from_name', pr_id:"station_from_id"}),
    c_station_to_id: Ext.create('Rq.view.Autocomplete', {pr_url:'/stations', pr_name:'station_to_name', pr_id:"station_to_id"}),
    d_load_id: Ext.create('Rq.view.Autocomplete', {pr_url:'/loads', pr_name:'load_name', pr_id:"load_id"}),
    
    a_client_id: Ext.create('Rq.view.Autocomplete', {pr_url:'/clients/autocomplete', pr_name:'client_name', pr_id:"client_id"}),
    
    // Выбор клиента
//    a_client_id: Ext.create('Ext.form.field.ComboBox', {
//      queryMode: 'local', displayField: 'name', valueField: 'id', editable:true,
//      store: new Ext.data.Store({ autoLoad:true,
//        fields: [ {name:'id', type:'int'}, {name:'name',  type:'string'}],
//        proxy: { type: 'rest', url : '/clients', reader: {type:'json', root:'clients'} },
//      }),
//      listeners:{
//        select:function(field, val){ 
//          Ext.ComponentQuery.query('requestgrid')[0].rec.set('client_name',val[0].get('name'))
//          Ext.ComponentQuery.query('requestgrid')[0].rec.set('client_id',val[0].get('id'))
//        }
//      }
//    }),

    // Рода подвижного состава
    i_car_type_id: Ext.create('Ext.form.field.ComboBox', {
      queryMode: 'local', displayField: 'name', valueField: 'id', editable:false,
      store: new Ext.data.Store({ autoLoad:true, fields: [ {name:'id', type:'int'},{name:'name', type:'string'}],
        data:car_types,
      }),
      listeners:{
        select:function(field, val){ 
          Ext.ComponentQuery.query('requestgrid')[0].rec.set('car_type_name',val[0].get('name'));
          Ext.ComponentQuery.query('requestgrid')[0].rec.set('car_type_id',val[0].get('id'));
        }
      }
    }),

    h_ownership: Ext.create('Ext.form.field.ComboBox', {
      store:[['МПС', 'МПС'], ['СПС', 'СПС']], queryMode:'local', editable:false
    }),
  },

  disableEditingForFields: function(e){
    switch(e.record.data.name){
      case "n_client_sum": e.cancel=true; break;
      case "o_jd_sum": e.cancel=true; break;
      case "p_cars_num": e.cancel=true; break;
      case "q_common_tonnage": e.cancel=true; break;
    }
  },

  initComponent: function(params){

    this.source = this.rec.getProperties();
    this.on('propertychange',this.dataChanged);
    this.on('beforeedit', this.disableEditingForFields);
    this.title +=' №'+this.rec.get('id')+'&nbsp;&nbsp;&nbsp;';
    this.title += '<a href="javascript:Rq.controller.Requests.showDocsWindow()" class="a-right" style="display:none;">Документы</a>';
    this.callParent();
    
  },


  dataChanged: function(source, recordId, value, oldValue, options){
    // Запись в модельку
    current_request.setFromProperties(source)
    // И пересчитываем заявку
    if(Ext.ComponentQuery.query('requestgrid')[0] && Ext.ComponentQuery.query('costsgrid')[0]) {
      Rq.controller.Requests.calculateRequest()
    }
  }
});

