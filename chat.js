(function (){
var deviceList = $('#peeps'),
				users =[];

            var button = PUBNUB.$('dashboard');
            var pubnub = PUBNUB.init({
			publish_key   : 'demo',
			subscribe_key : 'demo',
			uuid : 'human'
			
			
		})
            
            // sending a reply to the devices
            pubnub.bind('click', button, function () {
                pubnub.publish({
                    channel: 'userz',
                    presence: function(m){console.log(m)},
                    message: $('#clientText').val()
                   
                });
            });

            pubnub.subscribe({
                channel: 'iotchannel',
                 message: printdevices,
                 presence: function(message,channel){
                	
                	if(message.action == "join"){
                		var index;
                		var returnvar  = 0;
                		
                		for(index = 0;index<users.length;++index){
                			if(users[index] == message.uuid)
                			{
                				returnvar = 0;
                				break;
                			}
                			else
                				returnvar = 1;
                		}
                		if(returnvar == 1)
                		{
                			users.push(message.uuid);
                			deviceList.append("<li text-align:center>" +"<b>"+ message.uuid + "</b>"+"</li>");
                		}
                	}
                	else{
          				users.splice(users.indexOf(message.uuid), 1);
          				deviceList.find(message.uuid).remove();
        			}	
                }
            });
            // channel that devices publish to is "iotchannel"
//channel that user publishes to is "userz"

            // subscribing to the channel that the user publishes to
            pubnub.subscribe({
			channel : 'userz',
			message : printuserz	
			});
            
            pubnub.here_now({
   channel : 'userz',
   callback : function(m){console.log(JSON.stringify(m))}
 });
            
            
function printuserz(message) {
    $('#chatz').append("<div class='bubble--alt bubble'>" +"<img src = 'human.jpg' height = '45' width='45'>   " + message + "</div>");
}

function printdevices(message) {
    $('#chatz').append("<div class=bubble>" +"<img src = 'embedded_device.png' height = '45' width='45'>  " + message + "</div>");
}

})();
