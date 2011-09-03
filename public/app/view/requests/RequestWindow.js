
Ext.define('Gl.view.requests.RequestWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.requestwindow',
  width:550, height:330, modal:true, layout:'fit',
  rec: null,
  title:'Заявка', maximized:true,

  buttons:[
    {text:'Отмена', height:25, handler:function(){ 
      Ext.ComponentQuery.query('requestwindow')[0].close() 
    }},
    {text:'Сохранить', iconCls:'save', height:25, id:'requestSaveButton'}
  ],

  initComponent: function(params){
    // Фокусируем первое поле
//    this.listeners = {afterrender:function(){Ext.getCmp('clientNameField').focus()}}
    // Закидываем в айтемы форму
    this.items = [
      {layout: 'hbox', id:"clientForm", defaults:{border:false, frame:false},
        items:[
          { flex:1, items:[

            {xtype:'propertygrid', columnLines:true, hideHeaders:true, 
              title:'Заявка', source:this.rec.data,
              propertyNames:{
                client_name:"Клиент",
                station_from: "Ст.ОТПР",
                station_to: "Ст.НАЗН",
                load: "Груз",
                date_of_issue: "Дата. выдачи",
                valid_until: "Действ. до",
                type_of_transportation: "Вид перевозки",
                ownership: "Принадл. сост",
                car_type: "Род подв. сост.",
                sender: "Отправитель",
                receiver: "Получатель",
                gu12: "ГУ-12",
                rate_for_car: "Ставка за",
                cars_num: "<span class='bold'>Кол-во вагонов</span>",
                common_tonnage: "<span class='bold'>Суммарн. тоннаж</span>",
                total_client: "<span class='bold'>Сумма КЛ.</span>",
                total_jd:"<span class='bold'>Сумма ЖД.</span>"
              }

            }

          ]},{items:[
            // Вагоны
          ]}  
        ]
      }
    ];

    // Меняем название окошка если запись не новая
//    if(this.rec.getId()>1)
//      this.title = "Изменение клиента: '"+this.rec.get('name')+"'"

    this.callParent();
  }
});
