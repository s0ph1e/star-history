const express = require('express');

const app = express();

app.set('port', process.env.PORT || 3001);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('build'));
}

app.listen(app.get('port'), () => {
	console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
