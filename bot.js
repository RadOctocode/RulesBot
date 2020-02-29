var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Discord = require('discord.js');
const Config = require('./auth.json'); 


var client = new Discord.Client();

client.on('ready', () =>{

   console.log('Logged in as $(client.user.tag)!');

});


client.on('message', msg =>{
   const input = msg.content.split(' ');
   console.log(input.length);  

	
    if(input[0] === '!spell'){
	var spellName = input[1].replace(/\s+/g,'-').toLowerCase();
	reqURL = reqURL.concat('http://www.dnd5eapi.co/api/spells/',spellName);
	category = 1;
   }
   
   	else if(input[0] === '!condition'){
		if(input.length > 1){
		var condName = input[1].toLowerCase();
   		let reqURL = 'http://www.dnd5eapi.co/api/conditions/';
	   	reqURL = reqURL.concat(condName);

		let request = new XMLHttpRequest();
		request.open('GET', reqURL);

		request.onload = function(){
			if(this.status == 200){
				let data = JSON.parse(this.responseText);
				console.log(data);
				msg.channel.send(data.desc);
			
			}
			else{
				msg.channel.send("couldn't find that condition");
			}
		}

			request.send();
		}

	}
   
	
   


});

client.login(Config.token);

