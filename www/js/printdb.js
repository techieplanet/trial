
$(document ).delegate("#printdbpage", "pageinit", function() {
//    alert('printdbpage');
    _db.transaction(querySessionTable, 
        function(error){'error collecting database data'}
    );
});


function querySessionTable(tx){
//    alert('querySessionTable');
    var query = 'SELECT * FROM cthx_training_session';
    var html ='';
    tx.executeSql(query,[],
                function(tx,resultSet){
                    if(resultSet.rows.length>0){
                        html += '<h4>TRAINING SESSION TABLE DATA</h4>';
                        for(var i=0; i<resultSet.rows.length; i++){
                            var row = resultSet.rows.item(i);
                            html += '<h6><strong>Session ID: </strong>' + row['session_id'] + '</h6>';
                            html += '<h6><strong>Start Time: </strong>' + row['start_time'] + '</h6>';
                            html += '<h6><strong>End Time: </strong>' + row['end_time'] + '</h6>';
                            html += '<h6><strong>Status: </strong>' + row['status'] + '</h6>';
                            html += '<h6><strong>Session Type: </strong>' + row['session_type'] + '</h6>';
                            html += '<h6><strong>Worker ID: </strong>' + row['worker_id'] + '</h6>';
                            html += '<h6><strong>Module ID: </strong>' + row['module_id'] + '</h6>';
                            html += '<h6><strong>Training ID: </strong>' + row['training_id'] + '</h6>';
                            html += '<h1>&nbsp;</h1>';
                        }
                        
                        $('#datacontainer').html(html);
                    }
                    else{
                        html += '<h4>TRAINING SESSION TABLE DATA</h4>';
                        html += '<p>No data found.</p>';
                        $('#datacontainer').html(html);
                    }
                },
                function(error){
                    alert('data fetch error')
                }
            );
}