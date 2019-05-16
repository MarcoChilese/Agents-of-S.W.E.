const app = require('./app')
app.startServer();



// app.db['telegraf'].checkStatus(5000).then(host => {
// 	if(host[0].online)
// 		console.log(`${host[0].url.host} responded in ${host[0].rtt}ms running ${host[0].version}`)
// 	else
// 		console.log(`${host[0].url.host} is offline :(`);
// });

// app.db['telegraf'].getDatasourcesFields('cpu').then(r => {
// 	console.log(r); 
// });