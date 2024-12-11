const {
    createPool
} = require('mysql')

const pool = createPool({
    host : "localhost",
    user : "root",
    password : "",
    database:"task-manager",
    connectionLimit: 10
})

pool.query(`select * from user`,(err,result,fields)=>{
if(err){
    return console.log(err);
    
}
return console.log(result);

})