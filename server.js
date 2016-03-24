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

var Schema = mongoose.Schema; 

// message model schema 
var messageSchema = new mongoose.Schema({
	name: String,
	text: String, 
	comments: [{type: Schema.Types.ObjectId, ref: 'comments'}], 
	date: {type: Date, default: new Date}
}); 
var commentSchema = new mongoose.Schema({
	_messages: {type: Schema.Types.ObjectId, ref: 'messages'},
	name: String, 
	text: String, 
	date: {type: Date, default: new Date}
});
mongoose.model('messages', messageSchema);
mongoose.model('comments', commentSchema); 

var messages = mongoose.model('messages');
var comments = mongoose.model('comments');
// ROUTES
app.get('/', function(req, res){
	// messages.find({}, function(err, data){
	// 	res.render('index', {messages:data}); 
	// });
	// ===== Use the commented out code above to exclude comments ==== 
	messages.find({})
	.populate('comments') 
	.exec(function(err, data){
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


// To send comment data to db 
app.post('/comments/:id', function(req, res){
	messages.findOne({_id: req.params.id}, function(err, message){
		var commentData = new comments({
			name: req.body.name, 
			text: req.body.text, 
			date: new Date
		});
		console.log("This is comment data");
		console.log(commentData);
		console.log("This is the message data"); 
		console.log(message);
		// link the two collections 
		commentData._messages = message._id;
		// push comments to comment array in messages collection 
		message.comments.push(commentData);
		message.comments.push(commentData._msg);
		// save comment to data
		console.log('data was pushed');
		commentData.save(function(err){
			message.save(function(err){
				if(err){
					console.log('Error!:');
					console.log(err); 
				} else {
					res.redirect('/');
				}
			});
		}); 
	});
});















app.listen(8888, function(){
	console.log("Listening at port: 8888"); 
});