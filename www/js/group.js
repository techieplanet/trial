
$(document ).delegate("#grouppage", "pageshow", function() {
        getUsersList();
});

function getUsersList(){
    //alert("groups");
     
//     var data = '{"1":{"firstname":"Rewane","middlename":"Ola","lastname":"Sarumi"},'+
//                '"2":{"firstname":"Segun","middlename":"Titus","lastname":"Ikpomsah"},' +
//                '"3":{"firstname":"Ogeche","middlename":"Fred","lastname":"Agba"},' +
//                '"4":{"firstname":"Wale","middlename":"Michael","lastname":"Adesanya"},' +
//                '"5":{"firstname":"Mustapha","middlename":"Patrick","lastname":"Pinna"}' +
//                '}';
//     var members = JSON.parse(data);
        var html = '';
        _db.transaction(function(tx){
                            tx.executeSql('SELECT * FROM cthx_health_worker',[],
                                function(tx,resultSet){
                                    //console.log('len: ' + resultSet.rows.length);
                                    if(resultSet.rows.length>0){
                                        //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                        for(var i=0; i<resultSet.rows.length; i++){
                                            var member = resultSet.rows.item(i);
                                            html += '<li class="" data-icon="false" >';
                                            html +=     '<label data-theme="d">';
                                            html +=        capitalizeFirstLetter(member['firstname']) + ' ' + capitalizeFirstLetter(member['middlename']) + ' ' + capitalizeFirstLetter(member['lastname']);
                                            html +=        '<input type="checkbox" name="group-checkbox" id="'+ capitalizeFirstLetter(member['worker_id']) + '"/>';                                            
                                            html +=     '</label>';
                                            html += '</li>';
                                        }
                                        //console.log('html: ' + html);
                                        $('#membersList').append(html);
                                        $("#grouppage").trigger('create');
                                    }
                                    else
                                        $('#membersList').html(html);
                                });                       
                    },
                    function (error){}                    
            );

     
}


function groupLogin(){
    var checked = $('input[type="checkbox"]:checked'); var count='';
    _sessionUsersList = [];
    
    for(var i=0; i < checked.length; i++)
        _sessionUsersList.push(checked[i].id);
        
    _sessionType = 2;   //set session type
    $.mobile.changePage( "training.html" );
    
}