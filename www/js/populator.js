/*
 * THIS FILE IS MEANT TO POPULATE/SETUP THE DB TABLES FOR A FRESH DEMO INSTALLATION OF THE APP
 * THE DATA HERE ARE FOR DEMO PURPOSES ONLY. 
 * EACH METHOD CALL IN THE POPULATE() METHOD SETS UP A TABLE
 */

           
function openDb(){
    //alert("inside opendb")
    //create database or open it if created
    _db = window.openDatabase("chaidbpx", "1.0", "CHAI mlearning App DB", 200000); 
    _db.transaction(populateDB, errorCB, successCB);                           
}
            
function populateDB(tx){
    //alert("inside populatedb")
       _tx = tx;  //set tx for global use at first opportunity
       setUpCategoryTable(tx);
       setUpTrainingModules(tx);
       setUpTopics(tx);
       setUpWorkers(tx);
       setUpTrainingSession(tx);
}
            
function successCB(){
    //$('#result').html('Successfully populated db tables')
    //alert('Successfully populated db tables')
}
            
function errorCB(error){
    //$('#result').html('Error populating db tables: ' + JSON.stringify(error));
    alert('Error populating db tables: ' + JSON.stringify(error));
}


function setUpCategoryTable(tx){
    //alert("inside setpcat")
    tx.executeSql('DROP TABLE IF EXISTS cthx_category');
    tx.executeSql('CREATE TABLE IF NOT EXISTS cthx_category (category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,category_name TEXT, description TEXT);');
    tx.executeSql('INSERT INTO cthx_category(category_name,description) VALUES ("Emergency Obstetric Care", "This is about infant health")');
    tx.executeSql('INSERT INTO cthx_category(category_name,description) VALUES ("Family Health Planning", "This is about keeping your family healthy. Yes, healthy.")');
}

function setUpTrainingModules(tx){
    //alert('inside setmodules');
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_module');
    tx.executeSql('CREATE TABLE cthx_training_module (module_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, module_title TEXT, remarks TEXT, admin_id INTEGER, category_id INTEGER)');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Antenatal Care Series", "this is the module for antenatal care","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Postnatal Care Series","this is module about post natal care","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Introduction to Family Planning Education","this is module on family planning","12","2")');
    
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Postnatal Care Series 2","this is module about post natal care","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Advanced Family Planning Education","this is module on family planning","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Family Planning Benefits","this is module on family planning","12","1")');   
}

function setUpTopics(tx){
    //alert('inside settopics');
    tx.executeSql('DROP TABLE IF EXISTS cthx_training');
    tx.executeSql('CREATE TABLE cthx_training (training_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, training_title TEXT, video_file TEXT, guide_file TEXT, image_file TEXT, module_id INTEGER)');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file,guide_file,image_file,module_id) VALUES ("Referring A Sick Baby","refer_sick_baby.mp4","","refer_baby.png","1")' );
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file,guide_file,image_file,module_id) VALUES ("The Cold Baby","cold_baby.mp4","","cold_baby.png","1")' );
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file,guide_file,image_file,module_id) VALUES ("Breathing Problems","breathing_problems.mp4","","breathing.png","1")' );
}


function setUpWorkers(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_health_worker');
    tx.executeSql('CREATE TABLE "cthx_health_worker" ("worker_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT, "username" TEXT, "password" TEXT, "firstname" TEXT, "middlename" TEXT, "lastname" TEXT, "gender" TEXT, "email" TEXT, "phone" TEXT, "supervisor" INTEGER, "cadre_id" INTEGER, "facility_id" INTEGER)');
    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("1","Mr","chappy","chappy","chapman","chapman","chapman","male","chapman@fmail.com","1234567890","1","1","1")');
    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("2","mr","wally","wally","wally","wally","wally","male","wally@gmail.com","1234567890","1","1","1")');
    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("3","miss","katty","katty","katty","katty","katty","male","katty@gmail.com","1234567890","1","1","1")');
}



function setUpTrainingSession(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_session');
    tx.executeSql('CREATE TABLE "cthx_training_session" ("session_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "start_time" DATETIME, "end_time" DATETIME, "status" INTEGER, "session_type" INTEGER, "worker_id" INTEGER, "module_id" INTEGER, "training_id" INTEGER);');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","worker_id","module_id","training_id") VALUES ("1",NULL,NULL,"1","1","1","1","1");');
}