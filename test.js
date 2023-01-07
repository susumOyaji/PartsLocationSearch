(async () => {
    const sqlite3 = await window.sqlite3InitModule();

    const { DB } = sqlite3.oo1;
    // Use :memory: storage
    const db = new DB();

    db.exec("CREATE TABLE IF NOT EXISTS users(id INTEGER, name TEXT)");

    const stmt = db.prepare("insert into users values(?, ?)");
    stmt.bind([1, "Alice"]).stepReset();
    stmt.bind([2, "Bob"]).stepReset();
    stmt.finalize();

    // const resultRows = [];
    // db.exec({
    //sql: "select * from users where name=" + "'Bob'",
    //     sql: "SELECT * FROM users where name='Bob'",
    //     rowMode: "object",
    //     resultRows,
    // });


    function _song(song) {
        var song;
        var sqlString = `select * from users where name='${song}'`;

        const resultRows = [];
        db.exec({
            //sql: "select * from users where name=" + "'Bob'",
            sql: sqlString,
            rowMode: "object",
            resultRows,
        });
        console.log(sqlString);
        return resultRows;
    }

    // Logs { id, name }[]
    console.log(_song('Bob'));
})();