var express = require('express');
var mailer = require('express-mailer');
var bodyParser = require('body-parser');
var app = express();
var sworm = require('sworm');
var oracledb = require('oracledb');
var Sequelize = require('sequelize-oracle')


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: '*/*'}));
app.use(express.static(__dirname + "/application"));


var db = new Sequelize('orcl', 'nikita', 'Fizusa26', {
	database: 'orcl',
	username: 'nikita',
	password: 'Fizusa26',
	dialect: 'oracle'
});

const Avia = db.define('AVIA');
const Enter_data = db.define('ENTER_DATA');
const Staff = db.define('STAFF');
const Reg_clients = db.define('REG_CLIENTS');
const Client = db.define('CLIENT');
const Phys_client = db.define('PHYS_CLIENT');
const En_client = db.define("EN_CLIENT");
const Reserve = db.define('RESERVE');
const Sell_tours = db.define("SELL_TOURS");
const Tours = db.define("TOURS", {}, {freezeTableName: true});
const Hotels = db.define("HOTELS", {}, {freezeTableName: true});
const Cities = db.define("CITIES");
const Countries = db.define("COUNTRIES");

var router = express.Router();

var errorHandler = function(error){
	return JSON.parse(JSON.stringify(error))['message'].split(" ")[0];
}

router.post('/find', function(req, res) {
	db.query('SELECT * FROM HOTELS INNER JOIN TOURS on (HOTELS.HOTEL_ID = TOURS.HOTEL_ID) WHERE\
	 HOTELS.CITY_ID = :cid AND HOTELS.STARS = :stars AND\
	 TOURS.DAYS = :days AND TOURS.FOOD_TYPE = :food_type',
	{	
			replacements: {cid: req.body.cid, stars: req.body.stars, days: req.body.days, food_type: req.body.food_type.toLowerCase()}, 
			type: Sequelize.QueryTypes.SELECT 
	})
	.then((result) => {
		console.log(result);
		if(result.length == 0) {
			res.status(404).send(JSON.stringify({message: "Sorry, there aren't tours for you"}));
		}
		else{
			res.status(200).send(JSON.stringify(result));
		}
	},
	(error) => res.status(500).send(JSON.stringify({message: "Database timeout"})));
});



router.post('/reserve', 
	function(req, res, next){
	Enter_data.findAll({
		attributes:[[Sequelize.fn('COUNT', Sequelize.col('LOGIN')), 'count']],
		where: {
			LOGIN: req.body.email
		}
	}).then(result => {
		var was_reg = (result[0].dataValues.count > 0);
		req.was_reg = was_reg;
		next();
	})
}, function(req, res, next){
	db.query("CALL MAKE_RESERVE(:name, :mail, :phone, :tid, :tcount)", {
		replacements: {name: req.body.name, mail: req.body.email, phone: req.body.phone, tid: req.body.tid, tcount: 1}
	}).then((result) => {
		next();
	}, (error) =>{
		var err_code = errorHandler(error);
		if (err_code == 'ORA-20103:'){
			res.status('403').send(JSON.stringify({message: "You already reserved this tour"}));
		}
		if(err_code == 'ORA-20102:'){
			res.status('402').send(JSON.stringify({message: "Tour limit exceeded"}));
		}
	});
}, function(req, res){
	Enter_data.findAll({
		attributes: ['LOGIN', 'PASS'],
		where: {
			LOGIN: req.body.email
		}
	}).then(result => {
		if(!req.was_reg) {
			res.status('200').send(JSON.stringify({message: "Thank you for registration and reserving, "
														 + req.body.name + ". Your password was sent to your email"}));
		}
		else
		{
			res.status('200').send(JSON.stringify({message: "Thank you for reserving, "
														 + req.body.name + ". We remind your password on your email"}));
		}
	})
});


router.get('/find_tours/:cname', function(req, res, next) {
	Countries.findAll({
		attributes: ['COUNTRY_ID','NAME'],
		where: {
			NAME: req.params.cname 
		}
	}).then(
	(result) => {
		var data = {
			message: "",
			cid: -1
		};
		if (result.length == 0) {
			data.message = "Country not founded";
			res.status(404).send(JSON.stringify(data));
		}
		else {
			data.message = "Country founded";
			data.cid = result[0].dataValues['COUNTRY_ID'];
			res.status(200).send(JSON.stringify(data));
		}
	},
	(error) => res.status(500).send(JSON.stringify({message: "Database timeout"}))
	);
});

router.get('/find_cities/:cid', function(req, res, next) {
	Cities.findAll({
		attributes: ['CITY_ID', 'NAME'],
		where: {
			COUNTRY_ID: req.params.cid
		}
	}).then(
	(result) => {
		var data = [];
		var n = result.length;
		if(n == 0) {
			res.status(404).send(JSON.stringify({message: "No cities"}));
		}
		else {
			for(var key in result) {
				var city = {
					cid: result[key].dataValues['CITY_ID'],
					name: result[key].dataValues['NAME']
				};
				data.push(city);
			}
			res.status(200).send(JSON.stringify(data));
		}
	}, 
	(error)=>res.status(500).send(JSON.stringify({message: "Database timeout"})));

})



app.use('', router);
app.listen(8080, function () {
  console.log('Example app listening on port 3000!');
});
