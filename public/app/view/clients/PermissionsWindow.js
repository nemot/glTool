Ext.define('Gl.view.CheckboxColumn', {
  extend:'Ext.grid.column.Boolean',
  alias:'widget.cbcolumn',
  align:'center',
  falseText:'<span class="pred">Нет</span>',
  trueText:"<span class='pgreen'>Да</span>",
  renderer: function(val){
    return val ? "<span class='pgreen'>Да</span>" : "<span class='pred'>Нет</span>"
  },
  menuDisabled:true,

  initComponent: function(params){
    this.callParent();
  }
})


Ext.define('Gl.view.clients.PermissionsWindow', {
  extend: 'Ext.window.Window',
  alias : 'widget.permissionswindow',
  width:500, height:600, modal:true, layout: {type: 'border'},
  rec: null,
  title:'',

  buttons:[
    {text:'Закрыть', height:25, handler:function(){ 
      Ext.ComponentQuery.query('permissionswindow')[0].close();
    }},
  ],

  initComponent: function(params){

    // Закидываем в айтемы окошко
    this.items = [
      {xtype:'grid', region:'center', store: 'Users',
        columnLines:true, loadMask:true,
        store: Ext.create('Ext.data.Store', {
          autoLoad:true, autoSync:true, 
          fields:[
            {name:'id', type:'int'}, 
            'login', 'fio',
            {name:'has_access_to_client?', type:'boolean'},  
            {name:'role_id', type:'int'}, 
            'role_name'
          ],
          proxy: {
            type: 'rest',
            url : '/clients/'+this.rec.get('id')+"/users",
            reader: {type:'json', root:'users'},
            writer: {type:'json', root:'users', writeAllFields:true}
          }
        }),
        columns:[
          {header: 'Доступ', dataIndex:'has_access_to_client?', xtype:'cbcolumn', value:false, width:50},
          {header: 'Логин', dataIndex:'login', width:70, menuDisabled:true},
          {header: 'ФИО', dataIndex:'fio', flex:1, menuDisabled:true},
          {header: 'Права доступа', dataIndex:'role_name', width:120, menuDisabled:true},
        ], 
        listeners:{
          itemclick:function(view, rec, item, index, e){
            // Смена доступа к клиенту
            if(rec.get('role_id')==4) {
              rec.set('has_access_to_client?', !rec.get('has_access_to_client?'))
            } else {
              Ext.example.msg('', 'Изменить права доступа можно только для инженера.');
            }
            
          }
        }
      }
    ];

    

    this.title = "Доступ пользователей к клиенту: "+this.rec.get('name');


    this.callParent();
  }
});

