'use strict';
//var winObj;
var db;



  
 


function _delete(id) {
  const resultRows=[];
  const stmt = db.prepare("delete from fruits where id =?");
  stmt.bind([id]).stepReset();

  //db.exec({
  //  sql: "DELETE FROM fruits WHERE id = "+ id ,
  //  rowMode: "object",
    //resultRows,
  //})

  db.exec({
    sql: "SELECT * FROM fruits",//実行するSQL
    rowMode: "object",
    resultRows,//returnValue:
  });
  return resultRows;
}

//複数のカラムを対象に並び替えを行う
//address カラムの値でソートした上で address カラムの値が同じデータに対して old カラムの値でソートします。
//ORDER BY句の後に記述する順番に気を付けて下さい。
//SELECT * FROM fruits order by address asc, old asc;

function _sort(asc){
 const resultRows=[];
 db.exec({
    sql: "SELECT * FROM fruits order by id "+asc ,//昇順でソートしてみます。
    rowMode: "object",
    resultRows,
  });
  return resultRows;
}

function _insert(_rack,_contaner,_parts) {
  const resultRows = [];
  //const stmt = db.prepare("insert into fruits values(?, ?, ?)");
  //stmt.bind([_id, _name, _price]).stepReset();
  db.exec({
    sql: "insert into fruits(rack,contaner,parts) values ($a,$b,$c)",
    // bind by parameter name...
    bind: {$a: _rack , $b: _contaner ,$c: _parts}
  });

  db.exec({
    sql: "SELECT * FROM fruits",//実行するSQL
    rowMode: "object",//コールバックの最初の引数のタイプを指定します,
    //'array'(デフォルト), 'object', 'stmt'現在のStmtをコールバックに渡します
    resultRows,//returnValue:
  });
  return resultRows;
}




//main()
(function () {
  const T = self.SqliteTestUtil;
  const toss = function(...args){throw new Error(args.join(' '))};
  const debug = console.debug.bind(console);
  const eOutput = document.querySelector('#test-output');
  const logC = console.log.bind(console)
  const logE = function(domElement){
    eOutput.append(domElement);
  };
  const logHtml = function(cssClass,...args){
    const ln = document.createElement('div');
    if(cssClass) ln.classList.add(cssClass);
    ln.append(document.createTextNode(args.join(' ')));
    logE(ln);
  }
  const log = function(...args){
    logC(...args);
    logHtml('',...args);
  };
  const warn = function(...args){
    logHtml('warning',...args);
  };
  const error = function(...args){
    logHtml('error',...args);
  };
 




    //////////////////////////////////
    //////////////////////////////
    const runTests = function(sqlite3){
      const capi = sqlite3.capi,
            oo = sqlite3.oo1,
            wasm = sqlite3.wasm;
      log("Loaded module:",capi.sqlite3_libversion(), capi.sqlite3_sourceid());
      T.assert( 0 !== capi.sqlite3_vfs_find(null) );
      if(!capi.sqlite3_vfs_find('kvvfs')){
        error("This build is not kvvfs-capable.");
        return;
      }
      
     

      const dbStorage = 0 ? 'session' : 'local';
      const theStore = 's'===dbStorage[0] ? sessionStorage : localStorage;
      const db = new oo.JsStorageDb( dbStorage );
      // Or: oo.DB(dbStorage, 'c', 'kvvfs')
      log("db.storageSize():", db.storageSize());  
      



      function insert(_rack,_contaner,_parts) {
        const resultRows = [];
        
        db.exec({
          sql: "insert into fruits(rack,contaner,parts) values ($a,$b,$c)",
          // bind by parameter name...
          bind: {$a: _rack , $b: _contaner ,$c: _parts}
        });
      
        db.exec({
          sql: "SELECT * FROM fruits",//実行するSQL
          rowMode: "object",//コールバックの最初の引数のタイプを指定します,
          //'array'(デフォルト), 'object', 'stmt'現在のStmtをコールバックに渡します
          resultRows,//returnValue:
        });
        return resultRows;
      }
    





      
     

      const rack = document.querySelector('#rack');
      const next = document.getElementById("contaner");
      const rackresult= document.querySelector( "#rackresult" )
      const contanerresult = document.querySelector( "#contanerresult" );
      //const focus = () => document.getElementById('contaner').focus()
      rack.addEventListener('input', function () {
        const resultRows=[];
        contanerresult.innerText="ContanerResults";
        rackresult.innerText = "RackResults";
        // focusがあたっている要素を取得
        const elem = document.activeElement;
        // 3文字入力したらフォーカスを外す
        if(elem.value.length >= 1) {
          try{
            db.exec({
                sql: "SELECT * FROM fruits where rack="+this.value ,//昇順でソートしてみます。
                rowMode: "object",
                resultRows,
              });
          }catch(e){
            error(e.message);
          }
          if(resultRows.length==0){
            rackresult.innerText = elem.value+" is Not registered";
          }else{
            for( var i=0; i<resultRows.length; i++) {
              contanerresult.innerText= contanerresult.innerText + "... "+ resultRows[i].contaner ;
            }
            elem.blur();
            next.innerText = `要素「${elem.id}」のフォーカスを外しました。`;
            next.focus();


          }

         
        }
        //contaner.value="";
      });


      const contaner = document.querySelector('#contaner');
      //result = document.querySelector('#result');
      contaner.addEventListener('input', function () {
        //result.textContent = this.value;
        const resultRows=[];
        try{
          db.exec({
             sql: "SELECT * FROM fruits where contaner="+this.value ,//昇順でソートしてみます。
             rowMode: "object",
             resultRows,
            });
           log("...sort to ID=1 Result rows:",JSON.stringify(resultRows[0].name,undefined,2));
           
           result.textContent = resultRows[0].name;

           const parts = document.querySelector( "#partsresult" );
           parts.textContent= resultRows[0].name ;

           //const contaner = document.querySelector( "#contanerresult" );
           //contaner.textContent= resultRows[0].price ;

           const rack = document.querySelector( "#rackresult" );
           rack.textContent= resultRows[0].gram ;
        }catch(e){
          error(e.message);
        }
        
      });





      //const parts = document.getElementById("#parts");
      const parts = document.querySelector("#parts");
      //contanerresult= document.querySelector( "#contanerresult" )
      //rackresult = document.querySelector('#rackresult');
      //result = document.querySelector('#result');
      parts.addEventListener('input', function () {
        //result.textContent = this.value;
        const resultRows=[];
        contanerresult.innerText="ContanerResults";
        rackresult.innerText = "RackResults";
        // focusがあたっている要素を取得
        const elem = document.activeElement;
        // 3文字入力したらフォーカスを外す
        if(elem.value.length >= 5) {
          try{
            db.exec({
                sql: "SELECT * FROM fruits where parts="+this.value ,//昇順でソートしてみます。
                rowMode: "object",
                resultRows,
              });
          }catch(e){
            error(e.message);
          }
          if(resultRows.length==0){
            rackresult.innerText = elem.value+" is Not registered";
          }else{
            for( var i=0; i<resultRows.length; i++) {
              contanerresult.innerText= resultRows[i].contaner ;
              rackresult.innerText= resultRows[i].rack ;
            }
            elem.blur();
            //next.innerText = `要素「${elem.id}」のフォーカスを外しました。`;
            //next.focus();


          }

        }
        
      });










  
      document.querySelector('#btn-clear-log').addEventListener('click',function(){
        eOutput.innerText = '';
      });
      document.querySelector('#btn-clear-storage').addEventListener('click',function(){
        const sz = db.clearStorage();
        log("kvvfs",db.filename+"Storage cleared:",sz,"entries.");
      });


      //insert
      document.querySelector('#btn-init-db').addEventListener('click', function () {
        try {
          db.exec("CREATE TABLE IF NOT EXISTS fruits(id INTEGER PRIMARY KEY ,rack,contaner,parts INTEGER DEFAULT 'NO VALUE')");
          
          
          log("Insert using a prepared statement...");
          let i;
          let q = db.prepare([
            "insert into fruits(rack,contaner,parts) ",
            "values(?,?,?)"
          ]);
          try {
            q.bind(1,1).bind(2,1).bind(3,10500).stepReset();
            q.bind(1,1).bind(2,2).bind(3,10600).stepReset();
            q.bind(1,1).bind(2,3).bind(3,10700).stepReset();
            for( i = 105; i <= 107; ++i ){
                q.bind(1,i).bind(2,i*10).bind(3,i*100).stepReset();
            }
            var ret = insert(99, 99, 99); 
          }finally{
            q.finalize();
          } 
          
          const resultRows = [];
          db.exec({
            sql: "SELECT * FROM fruits",//実行するSQL
            rowMode: "object",//コールバックの最初の引数のタイプを指定します,
            //'array'(デフォルト), 'object', 'stmt'現在のStmtをコールバックに渡します
            resultRows,//returnValue:
          });
          log("DB Delete All. and Reconfiguration");
          log("..._insert...Result rows:", JSON.stringify(resultRows, undefined, 2));
         
        }catch(e){
          error(e.message);
        }
      });






      const btnSelect = document.querySelector('#btn-sort-db-rows-order');
      btnSelect.addEventListener('click',function(){
        log("DB rows:Asc");
        document.getElementById("btn-clear-log").click();
        const resultRows=[];
        try{
          db.exec({
            sql: "SELECT * FROM fruits order by rack asc" ,//昇順でソートしてみます。
            rowMode: "object",
            resultRows,
          });
        }catch(e){
          error(e.message);
        }
        log("...sort to Asc Result rows:",JSON.stringify(resultRows,undefined,2)); 
      });


      const btnSelectAsc = document.querySelector('#btn-sort-db-rows-asc');
      btnSelectAsc.addEventListener('click',function(){
        log("DB rows:Desc");
        document.getElementById("btn-clear-log").click();
        const resultRows=[];
        try{
          
          db.exec({
             sql: "SELECT * FROM fruits order by id desc" ,//昇順でソートしてみます。
             rowMode: "object",
             resultRows,
           });
          
        }catch(e){
          error(e.message);
        }
        log("...sort to Desc Result rows:",JSON.stringify(resultRows,undefined,2)); 
      });



      document.querySelector('#btn-storage-size').addEventListener('click',function(){
        log("size.storageSize(",dbStorage,") says", db.storageSize(),
            "bytes");
      });
      

     

      const resultRows = [];
      db.exec({
        sql: "SELECT * FROM fruits",//実行するSQL
        rowMode: "object",//コールバックの最初の引数のタイプを指定します,
        //'array'(デフォルト), 'object', 'stmt'現在のStmtをコールバックに渡します
        resultRows,//returnValue:
      });
      log("ref....._insert...Result rows:", JSON.stringify(resultRows, undefined, 2));
    
      log("Storage backend:",db.filename);
      if(0===db.selectValue('select count(*) from sqlite_master')){
        log("DB is empty. Use the init button to populate it.");
        log("DB が空です。(Re)init db ボタンを使用して入力します。");
      }else{
        log("DB contains data from a previous session. Use the Clear Ctorage button to delete it.");
        log("DBには、前のセッションのデータが含まれています。[Clear storage]ボタンを使用して削除します.");
        //btnSelect.click();
      }
    

    };
 

    sqlite3InitModule(self.sqlite3TestModule).then((sqlite3)=>{
      runTests(sqlite3);
      //demo1(sqlite3);//実行メソッド
    });


})();





function jsTestFunction(msg){

    //dialogconfirm();

    if (window.confirm("TrackBall Checkを終了します。")){
        open('about:blank', '_self').close();    //一度再表示してからClose 
    };
    
}

function jsInit(msg) {
  const T = self.SqliteTestUtil;
  const toss = function(...args){throw new Error(args.join(' '))};
  const debug = console.debug.bind(console);
  const eOutput = document.querySelector('#test-output');
  const logC = console.log.bind(console)
  const logE = function(domElement){
    eOutput.append(domElement);
  };
  const logHtml = function(cssClass,...args){
    const ln = document.createElement('div');
    if(cssClass) ln.classList.add(cssClass);
    ln.append(document.createTextNode(args.join(' ')));
    logE(ln);
  }
  const log = function(...args){
    logC(...args);
    logHtml('',...args);
  };
  const warn = function(...args){
    logHtml('warning',...args);
  };
  const error = function(...args){
    logHtml('error',...args);
  };



  //const sqlite3 = await window.sqlite3InitModule();

  //const { DB } = sqlite3.oo1;
  // Use :memory: storage
  //const db = new DB();






 
};






























