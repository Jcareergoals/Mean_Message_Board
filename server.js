var express = require('express'); 
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 
var path = require('path'); 

var app = express(); 

app.use(express.static(path.join(__dirname, '/static'))); 
app.use(bodyParser.urlencoded()); 

app.set('views', path.join(__dirname, '/views')); 
app.set('view engine', 'ejs'); 

mongoose.connect('mongodb://localhost/message_board'); 

var messageSchema = new mongoose.Schema({
	name: String,
	text: String, 
	date: {type: Date, default: new Date}
}); 
mongoose.model('messages', messageSchema); 
var messages = mongoose.model('messages');

// ROUTES
app.get('/', function(req, res){
	messages.find({}, function(err, data){
		res.render('index', {messages:data}); 
	});
});
app.post('/messages', function(req, res){
	var message = new messages({
		name: req.body.name, 
		text: req.body.text, 
		date: new Date
	}); 
	message.save(function(err, data){
  		if(err){
  			console.log("There was an error"); 
  		} else {
  			res.redirect('/');
  		}
	}); 
});
app.post('/comments/:id', function(req, res){
	console.log("COMMENT: "); 
	console.log("_id:"+req.params.id); 
	console.log(req.body);
	console.log("=================="); 
	res.redirect('/'); 
});

app.listen(8888, function(){
	console.log("Listening at port: 8888"); 
});