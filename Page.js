'use strict';


(function () {

   
    const parts = document.querySelector("#parts");
    parts.addEventListener('input', function () {
     
      const resultRows=[];
      result.innerText="Contanerquantity";
     
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
          result.innerText = elem.value+" is Not registered";
        }else{
          for( var i=0; i<resultRows.length; i++) {
            result.innerText= resultRows[i].contaner ;
            result.innerText= result.innerText+" - "+resultRows[i].rack ;
          }
          elem.blur();
          //next.innerText = `要素「${elem.id}」のフォーカスを外しました。`;
          //next.focus();


        }

      }
      
    });





    document.querySelector('#select').addEventListener('change',function()
    {
        var a = document.getElementById( "select" ).value ;
        var s = a.charAt(0);//

        switch(s){
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
                document.getElementById('parts').value=a;
               
            break;
        }
       
    });

})();