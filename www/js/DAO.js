
var DAO = {   //begin class
  resultSet : "setttt",
  firstName:"John Doe",
  
  
     //this.name = 'John';
  
  selectAll : function (tablename){
    
    _db.transaction(
            function(tx){
                var query = "SELECT * FROM " + tablename;
                console.log('selectAll: ' + query);
                tx.executeSql(query,[],
                            function(tx,resultSet){
                                if(resultSet.rows.length>0){
                                    _resultSet = resultSet.rows;
                                }
                            }
                    );//tx ends
            },
            function(error){
                alert("Error querying "+tablename)
            }
    )
    
},// end selectAll


 selectQuery : function(query){
    _db.transaction(
            function(tx){
                tx.executeSql(query,[],
                            function(tx,resultSet){
                                if(resultSet.rows.length>0){
                                    //this.resultSet = resultSet.rows;
                                    _resultSet = resultSet.rows;
                                    //console.log(query);
                                    //console.log('query res: ' + this.resultSet.item(0)['training_id']);
                                }
                                else
                                    _resultSet = null;
                            }
                    );//tx ends
            },
            function(error){
                alert("Error executing query ")
            }
    )
},// end selectQuery


    save: function(tx,tablename,fields,values){
        var query = 'INSERT INTO ' + tablename + ' (' + fields + ') VALUES (' + values + ')';
        console.log(query);
        tx.executeSql(query);
    },
    
    
    update: function(tx,tablename,fields,values,keyFieldName, keyFieldValue){
        console.log('update fields: ' + fields);
        console.log('update values: ' + values);
        
        fieldsArray = fields.split(",");
        valuesArray = values.split(",");
        
        console.log(fieldsArray);
        console.log(valuesArray);
        
        var query = 'UPDATE ' + tablename + ' SET ';
        for(var i=0; i<fieldsArray.length; i++){
            query += '"' + fieldsArray[i] + '" = "' + valuesArray[i] + '",';
        }
        //remove trailing comma
        query = query.substring(0,query.length-1);
        
        //add WHERE clause
        query += ' WHERE ' + keyFieldName + ' = "' + keyFieldValue + '"';
        console.log(query);
        tx.executeSql(query);
    }
    

}// end class