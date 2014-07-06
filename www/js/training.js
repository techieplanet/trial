/*
 *  Displays a pop up to help background processes complete before user accesses videp
 */
$(document ).delegate("#trainingpage", "pageshow", function() {
    console.log('trainingpage logging inside pageshow');
    $('#vsPopup').popup('open');
    setTimeout($('#vsPopup').popup('close'),2000);
});


/*
 *  Initializes the training page
 *  1. Fetches the video file name from database based on topic id selected
 *  2. Stores details of session into database
 *  2. Define next and previous buttons where needed
 */
 $(document ).delegate("#trainingpage", "pageinit", function() {                              
     _db.transaction(handleTopicVideo,
                    function(error){alert('Error loading training video')}, //errorCB
                    function(){  //succesCB
                            //set next and previous id for video nav buttons
                            setNextPrevious(_topicID,_moduleID);
                        }  
            );
                
                
      /*
       *    Video event monitor: This updates the session as completed when the video ends
       */
      var video = document.getElementById('videoscreen');
      video.addEventListener('ended', function(e){
          _updateMode = true;
          _db.transaction(startTrainingSession,function(){})
      }, false);
      
      video.addEventListener('play', function(e){
          //start the training session, wait for its success to remove popup
          _db.transaction(startTrainingSession,function(){})
      }, false);
            
 });//end pageinit
 
 
 /*
 * This method fetches the video file name for the selected topic from the database
 */
 function handleTopicVideo(tx){
     //ensure that updatemode is always false at beginning of every topic
     //no matter what route - new page entry or via nav buttons
     _updateMode = false;
     
     tx.executeSql('SELECT * FROM cthx_training WHERE training_id='+_topicID,[],
                function(tx,resultSet){  //query success callback
                    if(resultSet.rows.length > 0){
                        var row = resultSet.rows.item(0);
                        //set the training title
                        $('.videotitle').html(row['training_title']);
                        _videoFile = row['video_file'];  //use public variable in deviceready successCB
                        
                        attachVideoFile(); //find and add the video to the video tag                        
                    }
                },
                function(error){
                    console.log('Error in handleTopicVideo');
                }
        );
 }//end getvideo file
 
 
 


/*
  * This method fetches the actuall .mp4 video file from the dedicated videos directory on device
  * The video directory and video file name are already stored in public vars _videoDir and _videoFile respectively
  */
function attachVideoFile(){
     //return;
     //alert("filepath: " + _videoDir + "/" + _videoFile)
       window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fileSystem){
                rootDirectoryEntry = fileSystem.root;
                //alert('root: ' + fileSystem.root.fullPath);
                
                var filePath = _videoDir + "/" + _videoFile;
                
                 /*
                    * This method (getFile) is used to look up a directory. It does not create a non-existent direcory.
                    * Args:
                    * DirectoryEntry object: provides file look up method
                    * dirPath: path to directory to look up relative to DirectoryEntry
                 */
                rootDirectoryEntry.getFile(
                        filePath, {create: false}, 
                        function(entry){
                            //alert('videoscreen entry.toURL: '+ entry.toURL());
                            if(!entry.isFile) return;
                            var video = document.getElementById("videoscreen");
                            video.setAttribute('src',entry.toURL());
                        },
                        function(error){
                            //alert("No Video Found: " + JSON.stringify(error) + "\n Switching to Default Video.");
                            alert("No Video Found. \n Switching to Default Video.");
                        }
                 );
                
            }, 
            function(error) {
                alert("File System Error: " + JSON.stringify(error));
            }
          );
              
     
 }//end trainingPageDeviceReady()
 
 
 //saves a training session at start. Status is always 1 at start for incomplete
 //SESSION STATUS: 1- IN PROGESS/INCOMPLETE, 2- COMPLETED
 function saveTrainingSession(tx, sessionUserID){
     //SESSION STATUS: 1- IN PROGESS, 2- COMPLETED
     //alert('recording session...' + sessionUsersList[0])
          
     //for(var key in sessionUsersList){
         //alert('key ' + sessionUsersList[key]);
         //session id is auto
        var fields = '("start_time","end_time","status","session_type","worker_id","module_id","training_id")';
        var values = '(' +
                  '"' + getNowDate() + '",' + //start datetime
                  'NULL,' + //end datetime,
                  '"1",' + //session status - inprogress or completed
                  '"' + _sessionType + '",' +   //session type
                  '"' + sessionUserID + '",' +  //worker id
                  '"' + _moduleID  + '",' + //module id
                  '"' + _topicID + '")';    //training (topic) id
        
        var query = 'INSERT INTO cthx_training_session ' + fields + ' VALUES ' + values;
        //alert(query);
        tx.executeSql(query);
     //}
     
 }
 
 
 
 //updates a training session at end of video. 
 //SESSION STATUS: 1- IN PROGESS/INCOMPLETE, 2- COMPLETED
 function saveTrainingSession(tx, sessionUserID){
        //alert('recording session...' + sessionUsersList[0])
          
        var fields = '"start_time","end_time","status","session_type","worker_id","module_id","training_id"';
        var values = '"' + getNowDate() + '",' + //start datetime
                  'NULL,' + //end datetime,
                  '"1",' + //session status - inprogress or completed
                  '"' + _sessionType + '",' +   //session type
                  '"' + sessionUserID + '",' +  //worker id
                  '"' + _moduleID  + '",' + //module id
                  '"' + _topicID + '"';    //training (topic) id
        
        DAO.save(tx, 'cthx_training_session', fields, values);      
  }
 
 
 //saves a training session at start. Status is always 1 at start for incomplete
 //SESSION STATUS: 1 - INCOMPLETE, 2 - COMPLETE
 function updateTrainingSession(tx, rowID){
     console.log('updating session...' + rowID)
          
        var fields = 'end_time,status,session_type';
        var values =  getNowDate() + ',' + //end datetime
                  '2,' + //session status - inprogress or completed
                  _sessionType;   //session type
        
        DAO.update(tx, 'cthx_training_session', fields, values, 'session_id', rowID );
 }
 
 
 
 function startTrainingSession(tx){
     for(var i=0; i<_sessionUsersList.length; i++){
        
        //closure : this closure serves just the one user id involved per loop
        (function(i){
            setTimeout(function(){
                var query = "SELECT * FROM cthx_training_session s JOIN  cthx_training t WHERE worker_id=" + _sessionUsersList[i] +
                            " AND s.training_id="+_topicID + " AND t.training_id="+_topicID + 
                            " AND status=1"; //any session type
                 console.log('update mode: ' + _updateMode);
                 
                _db.transaction(function(tx){
                           tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        //_updateMode==false part ensure that new session is only started in new video sessions
                                        //and not every time the user replays the video while not having navigated away from the video
                                        if(resultSet.rows.length==0 && _updateMode==false){  
                                            // if record does not exist for user, i.e. hasnt started a session for the topic
                                            saveTrainingSession(tx, _sessionUsersList[i]) ; //no record, save session
                                            console.log('just saved session for ' + _sessionUsersList[i]);
                                        }
                                        else if(resultSet.rows.length>0 && _updateMode == true){
                                            //record found, update session if in update mode i.e. if video ended
                                                var row = resultSet.rows.item(0);
                                                updateTrainingSession(tx, row['session_id']) ; //no record, save session
                                        }
                                            
                                    }   
                            );// end tx
                                
                            //check if to set _updateMode to false. 
                            //Checking at this very point is important to guard against losing the value during the asynchronous calls
                            //if(i==_sessionUsersList.length-1)
                              //  _updateMode = false;
                            
                    },//end db function
                    function(error){
                        
                    }
                );//end db transaction         
            }, i*1000)
        })(i);
        
    }//end for
 }
 
 
 function setNextPrevious(topicID, moduleID){
     console.log('inside startNextPrevious. module id: ' + moduleID + ', topic id: ' + topicID);
     _db.transaction(function(tx){
                       var query = 'SELECT * FROM cthx_training WHERE module_id='+moduleID + ' ORDER BY training_id';
                       console.log('query: ' + query);
                       tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                console.log('number of topics in module: ' + len);
                                if(len>0){
                                    var firstID = resultSet.rows.item(0)['training_id'];
                                    var lastID = resultSet.rows.item(len-1)['training_id'];
                                    var currentID = topicID;
                                    //console.log('firstID: ' + firstID + ', lastID: ' + lastID + ', currentID: ' + currentID);
                                    
                                    if(currentID > firstID){
                                        //console.log('inside comparison 1 currentID > firstID')
                                        $('#prevvideo').attr('onclick','loadTraining('+ (currentID-1) + ')');
                                        $('#prevvideo').removeClass('hidden');
                                    }
                                    if(currentID==firstID){
                                        $('#prevvideo').addClass('hidden');
                                    }
                                    
                                    
                                    if(currentID < lastID){
                                        //console.log('inside comparison 2 currentID < lastID')
                                        $('#nextvideo').attr('onclick','loadTraining('+ (currentID+1) + ')');
                                        $('#nextvideo').removeClass('hidden');
                                    }
                                    if(currentID==lastID){
                                        $('#nextvideo').addClass('hidden');
                                    }
                                        
                                }
                            }//end resultset function 
                        );//end tx
                },//end main db function 
                function(error){}
        );//end transaction 
 }
 

function loadTraining(topicID){
    $('#vsPopup').popup('open');
    console.log('loadTraining- topicID: ' + _topicID + ', update mode: ' + _updateMode);
    _topicID = topicID;
    _db.transaction(handleTopicVideo,
                    function(error){alert('nextTraining: Error loading training video')}, //errorCB
                    function(){  //succesCB
//                          //start the training session, wait for its success to remove popup
                            console.log('nextTraining: sucess for startTrainingSession');
                            _db.transaction(startTrainingSession,
                                              function(error){alert("Error Starting Session")},
                                              function(){
                                                    //set next and previous id for buttons
                                                    setNextPrevious(_topicID,_moduleID);
                                                    $('#vsPopup').popup('close');
                                              }
                                         );
                        }  
            );
}


 var playing = false;
function playVideo() {
    alert('inside play method');
    var video = document.getElementById('videoscreen');
    if(playing==false){
        video.play();
        playing = true;
    }
    else if(playing==true){
        video.pause();
        playing = false;
    }
}  