const { initDB } = require('./db');

initDB().then(()=> {
  console.log('DB initialized');
  process.exit(0);
}).catch(e=>{
  console.error(e);
  process.exit(1);
});
