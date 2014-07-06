/*
 *  PUBLIC VARIABLES
 */
//sessionType: 1 - INDIVIDUAL SESSION, 2 - GROUP SESSION, 3 - TEST SESSION
var _sessionType;  
var _appName = 'HCWTrainer';
var _db, _tx; //makes these visible to all methods
var _categoryID=0, _moduleID=0, _topicID=0;
var _loggedInUserID = -1, _sessionUsersList=[];
var _videoDir='CHAI/Videos', _videoFile='';
var _resultSet = null;
var _updateMode = false;


/********************** Index Page   **********************/        
$(document ).delegate("#mainpage", "pageinit", function() {
    //////$('a.trans').attr('data-transition','slide');
  
   //put the following into deviceready event listener to disable back button totally
   //navigator.app.overrideBackbutton(true);
        
     document.addEventListener("backbutton", function(e){
            if($.mobile.activePage.is('#mainpage')){
                e.preventDefault();
                //quits the app
                quitApp();
            }
            else if($.mobile.activePage.is('#trainingpage')){
                alert("Disabled while on video.");
                e.preventDefault();
            }
            else {
                navigator.app.backHistory()
            }
        }, false);
});

function quitApp(){
    navigator.notification.confirm(
        'Are you sure you want to quit?', // message
         function(index){if(index==2) navigator.app.exitApp();},            // callback to invoke with index of button pressed
         _appName,           // title
        ['No','Yes']     // buttonLabels
    );
}

function createToolbarIcons(){
    var html ='';
    
    //Context-Menu Icon
    html += '<a class="toolbar-icon context-menu" href="#quickMenu" data-rel="popup" data-inline="true" data-transition="pop">&nbsp;</a>';
    
    //Login icon
    html += '<a href="login.html" class="toolbar-icon profile">Login</a>';
          
    //notifications icon
    html += '<a href="profile.html" class="toolbar-icon notification">Notifications</a>'
    
    $('#toolbar-actions').html(html);
}

function createQuickLinks(){
    var html ='';
    html += '<ul id="quickList" data-role="listview" data-theme="d" >';
    html +=     '<li data-icon="false"><a href="index.html" id="main">Main Menu</a></li>'
    html +=     '<li data-icon="false"><a href="help.html" id="help">Help</a></li>'
    html +=     '<li data-icon="false"><a href="login.html" id="gator">Log In</a></li>'
    html += '</ul>';
    $('#quickMenu').html(html);
    $("#quickList").listview();
}
/********************** Index Page   **********************/        
 
 
/**********************
*   Populates the Training Categories Page with details of categories in the database
*   Opens database, load for categories data and display it on a list.
**********************/

//$(document).on('pagebeforeshow', "#categoriespage", function (event, data) {
//    var parameters = $(this).data("url").split("?")[1];;
//    parameter = parameters.replace("stype=",""); 
//    _sessionType = parameter;
//    //alert('stype: '+ parameter);
//});

$(document ).delegate("#categoriespage", "pageshow", function() {
        ////$('a.trans').attr('data-transition','slide');
});

$(document ).delegate("#categoriespage", "pageinit", function() {
        ////$('a.trans').attr('data-transition','slide');
              
        //create database or open it if created
        //_db = window.openDatabase("chaidbpx", "1.0", "CHAI mlearning App DB", 200000); 
        
        //categories query: an asynchronous call
        _db.transaction(queryCategories,errorCB);    
 });
  
 function queryCategories(tx){
    tx.executeSql('SELECT * FROM cthx_category',[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    if(len>0){  //if not empty table
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                              $('#categoriesList').append(
                                  '<li class="articleblock">' +
                                     '<a href="" onclick="changeToModule(' + row['category_id']+ '); return false;" class="trans" >' +
                                          '<img src="img/logo.png" />' +
                                         '<h3>'+
                                              row['category_name']+
                                          '</h3>' +
                                          '<p class="marginbottom20">'+row['description']+'</p>' +
                                     '</a>' +
                                  '</li>'
                              );
                         }
                    }
                    else{
                        $('#categoriesList').append('<li class="">No categories found.</li>'); 
                    }
                        
                     
                    $("#categoriesList").listview();
                    //$("#categoriesList").trigger("create");  
                },
                    function errorCB(error){
                        alert('Error loading categories: ' + JSON.stringify(error));
                    }
                );
                
 }
 
 function errorCB(error){
     alert('Database error: ' + JSON.stringify(error));
 }

function changeToModule(cat_id){
    _categoryID = cat_id;
    //$.mobile.changePage( "modules.html", { transition: "slide"} );    
    $.mobile.changePage( "modules.html");    
}


/********************** Categories Page   **********************/        








/********************** Modules Page   **********************/        
$(document ).delegate("#modulespage", "pageshow", function() {
        ////$('a.trans').attr('data-transition','slide');
});

$(document ).delegate("#modulespage", "pageinit", function() {
    //_db = window.openDatabase("chaidbpx", "1.0", "CHAI mlearning App DB", 200000); //open database   
    _db.transaction(queryModules,errorCB);    //modules query: an asynchronous call
});



/*
 * This method fetches modules for the selected category id from the database
 * The category id is already stored in _categoryID on clicking category on UI.
 * Arg tx implicit fom transaction call provides access to db functions.
 */
function queryModules(tx){
    tx.executeSql('SELECT * FROM cthx_training_module where category_id='+_categoryID,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    if(len>0){
                        var count=0, html='', blocksPerRow=4; 
                        console.log('length selected: ' + len);
                        
                        var i = 0;
                        while (i<len){
                            if(i%4==0)  //new row
                                html += '<div class="iconrow">';
                                    for(var j=0; j<blocksPerRow; j++){
                                       //console.log('this iteration i: ' + i);
                                       if(i==len) break;
                                       //console.log('after break');
                                       var row = resultSet.rows.item(i);
                                       html += '<a class="iconblock trans" onclick="changeToTopic(' + row['module_id'] + '); return false;" href="topics.html" data-theme="a">';
                                       html +=    '<img src="icon.png" />';
                                       html +=    '<p>' + row['module_title'] + '</p>';
                                       html += '</a>'
                                       i++;  //increment i so we keep counting on var len in outer loop
                                    }
                                html += '</div>';  //close row
                         }
                         
                         //insert markup at the beginning of content.
                         $('#content').prepend(html);  
                    }
                    else{
                        $('#content').prepend('No modules found.');
                    }
                     
                },
                function errorCB(error){
                    alert('Error loading modules: ' + JSON.stringify(error));
                }
            );//end execution
                
 }
 
 
 /*
  *This method switched the screen to the topics page after selecting a module.
  */
 function changeToTopic(mod_id){
    _moduleID = mod_id;
    $.mobile.changePage( "topics.html" );
}
/********************** Modules Page   **********************/    



/********************** Job Aid Page   **********************/        
$(document ).delegate("#jobaidpage", "pageshow", function() {
        ////$('a.trans').attr('data-transition','slide');
});
/********************** Job Aid Page   **********************/    





/********************** FAQ Page   **********************/        
$(document ).delegate("#faqpage", "pageshow", function() {
        ////$('a.trans').attr('data-transition','slide');
        
        $('#faqpage .articleblock').click(function(){
            //alert($(this).attr('id'));
             $('#faqpage .articleblock').not(this).each(function(){
                $(this).next('.articlecontent').slideUp();
            });

            var icon ='';
            icon = $(this).attr('data-icon') == 'arrow-d' ? 'arrow-u' : 'arrow-d';

            $(this).buttonMarkup({ icon: icon });
            $(this).next('.articlecontent').slideToggle('slow');
        });
});

$( document ).delegate("#faqpage", "pageinit", function() {
    $('#faqpage .articlecontent').css('display','none');
    
    //this pulls the contents from the internet
    //getContent();
});

function getContent(){
    var url = 'http://techieplanetltd.com/chai/fetcher.php';
    
    //display loading image 
    var loading = '<p style="padding:20px;text-align:center;"><img style="margin:auto;" src="../img/ajax-loader.gif"></p>';
    $("#articles-ul li.articleblock:first-child + li.articlecontent").html(loading);
    
    $.get(url,{},function(data){
        $("#articles-ul li.articleblock:first-child + li.articlecontent").html(data);
        //$("li.articlecontent").html(data);
    });
}
/********************** FAQ Page   **********************/   




/********************** Assessment Page   **********************/
$(document ).delegate("#assessmentpage", "pageshow", function() {
    $('#prev').hide();
    getQuestion(1);
});

function getQuestion(qNumber){
        var data = '{"1":{"question":"What is the capital of Nigeria?","A":"Abuja","B":"Lagos","C":"Abia","D":"Ogun","Answer":"A"},'+
                    '"2":{"question":"What is the capital of Ghana?","A":"Kumasi","B":"Accra","C":"Lagos","D":"Ogun","Answer":"B"},' +
                    '"3":{"question":"What is the capital of England?","A":"Bradford","B":"London","C":"Manchester","D":"Liverpool","Answer":"B"},' +
                    '"4":{"question":"What is the capital of South Africa?","A":"Cape Town","B":"Bloemfontein","C":"Johanesburg","D":"Pretoria","Answer":"D"}' +
                    '}';
        var questions = JSON.parse(data);
        var questionObj = questions[qNumber];
        var html="";
        
        $('#question_number').html('Question '+qNumber);
        $('#question li').html(questionObj["question"]);        
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-A" value="A" />';
        html +=     '<label for="radio-choice-A">' + questionObj["A"] + '</label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-B" value="B" />';
        html +=     '<label for="radio-choice-B">' + questionObj["B"] + '</label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-C" value="C" />';
        html +=     '<label for="radio-choice-C">' + questionObj["C"] + '</label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-D" value="D" />';
        html +=     '<label for="radio-choice-D">' + questionObj["D"] + '</label>';
       
        $("#options").html(html);
        $("#question").css('display','block');
        $("#nextprev").css('display','block');
        //$('#prev').hide();
        $('#qnumber').val(qNumber);
        $("#assessmentpage").trigger("create");
        //$( "#lightbox" ).popup( "close" );
}

function nextQuestion(){
    var qnumber = $('#qnumber').val();
    qnumber = parseInt(qnumber)+1;
    if(qnumber==4) {
        $('#next').hide();
    } 
    getQuestion(qnumber);
    $('#prev').show();
}

function prevQuestion(){
    var qnumber = $('#qnumber').val();
    qnumber = parseInt(qnumber)-1;
    if(qnumber==1) {
        $('#prev').hide();
    } 
    getQuestion(qnumber);
    $('#next').show();
}
/********************** Assessment Page   **********************/           



/********************** Login Page   **********************/           
$(document ).delegate("#assessmentpage", "pageshow", function() {
    
});


/*
 *  This function handles individual login actions that come via the topics -> session popup route.
 *  It will always go to the training page after login. 
 */
function sessionLogin(){
    
       var user = $('#username').val();
       var pass = $('#password').val();
       var query = "SELECT * FROM cthx_health_worker WHERE username='" + user + "' AND password='" + pass + "'";
       
       _db.transaction(function(tx){
                        tx.executeSql(query,[],
                             function(tx,resultSet){
                                 if(resultSet.rows.length > 0){
                                     var row = resultSet.rows.item(0);
                                     _loggedInUserID = row['worker_id'];  //register user as logged in
                                     
                                     //switch toolbar login button
                                     //$('#toolbar-login').addClass('hidden');
                                     //$('#toolbar-login').removeClass('hidden');
                                     
                                      if(_topicID > 0){   // means a topic has been selected
                                         //set up array containing logged in user
                                         _sessionType = 1;
                                         _sessionUsersList = [_loggedInUserID];
                                         $.mobile.changePage( "training.html" );
                                      }
                                     else  // go to profile page if logging in but not accessing training yest
                                         $.mobile.changePage( "profile.html" );
                                     
                                 }
                                 else{
                                     navigator.notification.alert(
                                          'Wrong username or password. Try again.',  // message
                                          function(){},         // callback
                                          _appName,            // title
                                          'OK'                  // buttonName
                                      );
                                 }
                             }
                         );
                   },
                function (error){},  //errorCB
                function (){} //successCB
        );//end transaction
            
   } 
/********************** Login Page   **********************/           



/********************** Helper Methods **********************/           
function clearInputs(){
    $('input[type="text"],input[type="password"]').val("");
}

function capitalizeFirstLetter(s)
{
    var str = s.toString();
    return str.substring(0,1).toUpperCase() + str.substring(1,str.length);
}

function getNowDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;//January is 0!`
    var yyyy = today.getFullYear();
    
    if(dd<10){dd='0'+dd}
    if(mm<10){mm='0'+mm}
    
    var now = yyyy+'-'+mm+'-'+dd;
    return now;
}
/********************** Helper Methods **********************/           