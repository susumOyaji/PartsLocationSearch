'use strict';


(function () {
  const T = self.SqliteTestUtil;
  const toss = function (...args) { throw new Error(args.join(' ')) };
  const debug = console.debug.bind(console);
  const eOutput = document.querySelector('#test-output');
  const logC = console.log.bind(console)
  const logE = function (domElement) {
    eOutput.append(domElement);
  };
  const logHtml = function (cssClass, ...args) {
    const ln = document.createElement('div');
    if (cssClass) ln.classList.add(cssClass);
    ln.append(document.createTextNode(args.join(' ')));
    logE(ln);
  }
  const log = function (...args) {
    logC(...args);
    logHtml('', ...args);
  };
  const warn = function (...args) {
    logHtml('warning', ...args);
  };
  const error = function (...args) {
    logHtml('error', ...args);
  };





  //////////////////////////////////
  //////////////////////////////
  const runTests = function (sqlite3) {
    const capi = sqlite3.capi,
      oo = sqlite3.oo1,
      wasm = sqlite3.wasm;
    log("Loaded module:", capi.sqlite3_libversion(), capi.sqlite3_sourceid());
    T.assert(0 !== capi.sqlite3_vfs_find(null));
    if (!capi.sqlite3_vfs_find('kvvfs')) {
      error("This build is not kvvfs-capable.");
      return;
    }



    const dbStorage = 0 ? 'session' : 'local';
    const theStore = 's' === dbStorage[0] ? sessionStorage : localStorage;
    const db = new oo.JsStorageDb(dbStorage);
    // Or: oo.DB(dbStorage, 'c', 'kvvfs')
    log("db.storageSize():", db.storageSize());


    document.querySelector('#btn-clear-storage').addEventListener('click', function () {
      const sz = db.clearStorage();
      log("kvvfs", db.filename + "Storage cleared:", sz, "entries.");
    });




    
    document.querySelector('#parts').addEventListener('click', function () {
      const result = document.querySelector("#parts-output");
      const resultRows = [];
      //result.innerText="Contanerquantity";

      // focusがあたっている要素を取得
      const elem = document.activeElement;
      // 3文字入力したらフォーカスを外す
      if (elem.value.length >= 1) {
        try {
          db.exec({
            sql: "SELECT * FROM fruits where parts=" + this.value,//昇順でソートしてみます。
            rowMode: "object",
            resultRows,
          });
        } catch (e) {
          error(e.message);
        }
        if (resultRows.length == 0) {
          result.innerText = elem.value + " is Not registered";
        } else {
          for (var i = 0; i < resultRows.length; i++) {
            result.innerText = resultRows[i].contaner;
            result.innerText = result.innerText + " - " + resultRows[i].rack;
          }
          elem.blur();
          //next.innerText = `要素「${elem.id}」のフォーカスを外しました。`;
          //next.focus();


        }

      }

    });


    document.querySelector('#contaner').addEventListener('input', function () {
      //result.textContent = this.value;
      const resultRows = [];
      try {
        db.exec({
          sql: "SELECT * FROM fruits where contaner=" + this.value,//昇順でソートしてみます。
          rowMode: "object",
          resultRows,
        });
        log("...sort to ID=1 Result rows:", JSON.stringify(resultRows[0].contaner, undefined, 2));

        result.textContent = resultRows[0].parts;

        //const parts = document.querySelector( "#partsresult" );
        //result.textContent= resultRows[0].parts ;

        //const contaner = document.querySelector( "#contanerresult" );
        //contaner.textContent= resultRows[0].price ;

        const rack = document.querySelector("#rackresult");
        rack.textContent = resultRows[0].gram;
      } catch (e) {
        error(e.message);
      }

    });


    document.querySelector('#rack').addEventListener('input', function () {
      const next = document.getElementById("contaner");
      //const rackresult= document.querySelector( "#rackresult" )
      const result = document.querySelector("#result");
      //const focus = () => document.getElementById('contaner').focus()
      const resultRows = [];
      result.innerText = "Regiserd Contaner";
      //rackresult.innerText = "RackResults";
      // focusがあたっている要素を取得
      const elem = document.activeElement;
      // 3文字入力したらフォーカスを外す
      if (elem.value.length >= 1) {
        try {
          db.exec({
            sql: "SELECT * FROM fruits where rack=" + this.value,//昇順でソートしてみます。
            rowMode: "object",
            resultRows,
          });
        } catch (e) {
          error(e.message);
        }
        if (resultRows.length == 0) {
          result.innerText = elem.value + " is Not Regiserd Rack";
        } else {
          for (var i = 0; i < resultRows.length; i++) {
            result.innerText = result.innerText + " ... " + resultRows[i].contaner;
          }
          elem.blur();
          next.innerText = `要素「${elem.id}」のフォーカスを外しました。`;
          next.focus();


        }


      }
      //contaner.value="";
    });





    document.querySelector('#select').addEventListener('change', function () {
      var a = document.getElementById("select").value;
      var s = a.charAt(0);//

      switch (s) {
        case "": //「data」が「p」の時実行する。
          console.log("該当するものがありません。");
          break;
        case "c": //「data」が「c」の時実行する。
          console.log("Contaner");
          document.getElementById("contaner").focus();
          break;
        case "r"://「data」が「r」の時実行する。
          console.log("Rack");
          document.getElementById("rack").focus();
          break;
        default: //上該のすべてのCASEに当てはまらないときに実行する。
          console.log("Parts");
          document.getElementById("parts").focus();
          document.getElementById('parts').value = a;
          /// clickイベントを発火させる
          document.getElementById('parts').click()

          break;
      }

    });

  };

  sqlite3InitModule(self.sqlite3TestModule).then((sqlite3) => {
    runTests(sqlite3);
    //demo1(sqlite3);//実行メソッド
  });



})();