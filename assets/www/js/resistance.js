		var votes_required = { 5: [ 0, 2, 3, 2, 3, 3 ],
				   6: [ 0, 2, 3, 4, 3, 4 ],
				   7: [ 0, 2, 3, 3, 4, 4 ],
				   8: [ 0, 3, 4, 4, 5, 5 ],
				   9: [ 0, 3, 4, 4, 5, 5 ],
				   10: [ 0, 3, 4, 4, 5, 5] };

		var fails_required = { 5: [ 0, 1, 1, 1, 1, 1 ],
				   6: [ 0, 1, 1, 1, 1, 1 ],
				   7: [ 0, 1, 1, 1, 2, 1 ],
				   8: [ 0, 1, 1, 1, 2, 1 ],
				   9: [ 0, 1, 1, 1, 2, 1 ],
				   10: [ 0, 1, 1, 1, 2, 1 ] };

		function shuffle(array) {
			var m = array.length, t, x;
			while (m) {
			    x = Math.floor(Math.random() * m--);
			    t = array[m];
			    array[m] = array[x];
			    array[x] = t;
			}
			return array;
		}

		function resize(){
			if ( windows == 0 ) {
				var h;
				var w;
				if ( $(window).height() >= $(window).width() ) {
					h = $(window).height();
					w = $(window).width();
				} else {
					w = $(window).height();
					h = $(window).width();  
				}    
					$('#startpage').css( 'height', h - 48  );
					$('#startpage').css( 'width', w );
				} else {
					$('#startpage').css( 'height', 1280 - 48 );
					$('#startpage').css( 'width', 720 );
					$('.apppage').css( 'border-color', 'black' );
					$('.apppage').css( 'border', '1px solid' );					
				}
				$('.apppage').css( 'height', $('#startpage').css( 'height' ) );
				$('.apppage').css( 'width', $('#startpage').css( 'width' ) );
				$('#mainboard').css( 'visibility', 'visible' );
				
			}
			
		;(function($) {
		    $.fn.textfill = function(options) {
			var fontSize = options.maxFontPixels;
			var ourText = $('span:visible:first', this);
			var maxHeight = $(this).height();
			var maxWidth = $(this).width();
			var textHeight;
			var textWidth;
			do {
			    ourText.css('font-size', fontSize);
			    textHeight = ourText.height();
			    textWidth = ourText.width();
			    fontSize = fontSize - 1;
			} while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
			return this;
		    }
		})(jQuery);

		function resizeothertext() {
			$( '#startpage' ).css( 'font-size', $( '#noofplayers > span' ).css( 'font-size' ) );
			$( '#title' ).css( 'font-size', $( '#noofplayers > span' ).css( 'font-size' ) );
			$( '#mainboard' ).css( 'font-size', $( '#noofplayers > span' ).css( 'font-size' ) );
			$( '#networkcreatepage' ).css( 'font-size', $( '#noofplayers > span' ).css( 'font-size' ) );
			$( '#networkjoinpage' ).css( 'font-size', $( '#noofplayers > span' ).css( 'font-size' ) );

			$( 'button' ).css( 'font-size', $( '#noofplayers > span' ).css( 'font-size' ) );
			$( 'select' ).css( 'font-size', $( '#noofplayers > span' ).css( 'font-size' ) );
			$( 'input' ).css( 'font-size', $( '#noofplayers > span' ).css( 'font-size' ) );
			$( '#spinner' ).css( 'font-size', $( '#noofplayers > span' ).css( 'font-size' ) );
			$( '#mainboard' ).css( 'display', 'none' );
		}


		function makeId()
		{
		    var text = "";
		    var possible = "ACDEFGHJKMNPQRTUWXZ234679";
		    for( var i=0; i < 8; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		    return text;
		}

		function startNetworkGame(){
			$( '#startpage' ).css( 'display', 'none' );
			$( '#networkcreatepage' ).css( 'display', 'block' );				
			room_id = makeId();
			$( '#playeridmsg').html( 'The room code for joining this game is<br><br>' + room_id  );
			loadFireBase();

		}

		function joinNetworkGame() {
			$( '#startpage' ).css( 'display', 'none' );
			$( '#networkjoinpage' ).css( 'display', 'block' );
			loadFireBase();
		}

		function startLocalGame() {
			$( '#startpage' ).css( 'display', 'none' );
			$( '#localcreatepage' ).css( 'display', 'block' );
		}

		function loadFireBase(){
			filename = 'https://cdn.firebase.com/v0/firebase.js';
			document.getElementsByTagName('head')[0]
			.appendChild(
				document.createElement('script')
			).src = filename;
		}

		function showblocker( ) {
			$( '#blocker' ).css( 'display', 'block' );
			$( '#spinner' ).css( 'display', 'block' );
		}
		function hideblocker( ) {
			$( '#blocker' ).css( 'display', 'none' );
			$( '#spinner' ).css( 'display', 'none' );
		}
            
            function blinks(hide) {
                if(hide==1) {
                    $('.alert').css( 'visibility', 'visible' );
                    hide = 0;
                }
                else { 
                    $('.alert').css( 'visibility', 'hidden' );
                    hide = 1;
                }
                setTimeout("blinks("+hide+")",400);
            }
            
	
			function startFireBase(){
				data_ref.on('child_added', function(snapshot) {
					hideblocker();
					votes = snapshot.val();
					console.log( votes );
					if ( votes.length == $( "#totalmissionplayers" ).val() ) {	
						data_ref.remove( function ( error ){
							if ( error ) {
								hideblocker();
								$( '#othermessage' ).html( 'Error contacting server' );
							} else {
								hideblocker();
							}
							data_ref = new Firebase('https://' + room_id + '-rfy3iu2rj0x.firebaseio-demo.com/');
						});
						renderresults( votes );
					} else if ( votes.length > $( "#totalmissionplayers" ).val() ) {
						$( '#othermessage' ).html( 'Too many votes! Votes reset' );
						showblocker();
						data_ref.remove( function ( error ){
							if ( error ) {
								hideblocker();
								$( '#othermessage' ).html( 'Error contacting server' );
							} else {
								hideblocker();
							}
						});
					} else {
						var s = '';
						var votesremaining = $( "#totalmissionplayers" ).val() - votes.length;
						if ( votesremaining > 1 ) {
							s = 's';
						}
						$( '#othermessage' ).html( '<strong>The group is waiting on ' + votesremaining + ' vote' + s +'...</strong>' );
					}
				});
				perm_data_ref.on('child_added', function(snapshot) {
					hideblocker();
					perm_data = snapshot.val();
					
					$( '#roundcounter' ).html( 'Quest ' + perm_data.round );
					console.log( 'perm_data', perm_data );
					console.log( perm_data_ref );
				});
			}
	    
			function changeTotalCounter(){
				if ( $( "#totalmissionplayers" ).val() < $( "#localmissionplayers" ).val() ) {
					$( "#totalmissionplayers" ).val( $( "#localmissionplayers" ).val() );
					alert( 'Total number of players connot be less than the amount of players using this device' );
				}
			}
			
			function vote( result ){
				$( '#votereset' ).html( 'Reset Votes' );
				$( '#othermessage' ).html( '' );
				local_count--;
				if ( local_count <= 0 ){
					$( '#votestatus' ).html( "Local votes remaining: " + local_count );
					$( '#viewresults' ).removeAttr( "disabled" );
					$( '#votefailure' ).attr( "disabled", "disabled" );
					$( '#votesuccess' ).attr( "disabled", "disabled" );
					$( '#cardcontainer' ).html( '<div id="card1"><a href="#"><img class="bigcards" src="img/back.png"></a></div><div id="card2"><a href="#"><img class="bigcards" src="img/back.png"></a></div>' );
					votes.push( result );
					votes = shuffle( votes );
					
					total_mission_players = votes_required[perm_data.total_players][perm_data.round];
					if ( game_type == 'network' ){
						local_mission_players = $( "#localmissionplayers" ).val();
					} else {
						local_mission_players = total_mission_players;
					}
					
					console.log( total_mission_players );
					
					if ( ( game_type == 'network' ) && ( total_mission_players  != local_mission_players ) ) {
						showblocker();
						data_ref.push( votes );
					} else {
						renderresults( votes );
					}
				} else {
					$( '#cardcontainer' ).html( '<div id="card1"><a href="#" onclick="viewcards()"><img class="bigcards" src="img/back.png"></a></div><div id="card2"><a href="#" onclick="viewcards()"><img class="bigcards" src="img/back.png"></a></div>' );
					$( '#votestatus' ).html( "Local votes remaining: " + local_count );
					votes.push( result );
					renderFakeVotes();
				}
			}
			
			function renderresults( results ) {
				results = shuffle( results );
				var fails = 0;
				var successes = 0;
				voteresults = '';
				for ( i=0;i<results.length;i++ ) {
					if ( results[i] == 'fail' ) fails++;
					if ( results[i] == 'success' ) successes++;
					voteresults += '<img class="smallcards" src="img/' + results[i] + '.png">';
				}
				console.log( 'fails_required', fails_required[perm_data.total_players][perm_data.round] );
				if ( fails >= fails_required[perm_data.total_players][perm_data.round]){
					if ( windows != 1 && sound == 1 ){
						var snd = new Media( 'file:///android_asset/www/sounds/tpirhorns.wav' );
						snd.play();
					}
					$( '#round' + perm_data.round ).html( '<img src="img/E.png" class="winloss" />' );
					$( '#othermessage' ).html( 'Evil wins quest ' + perm_data.round + '!' );
					perm_data.evil_wins++;
					
				} else {
					if ( windows != 1 && sound == 1 ) {
						var snd = new Media( 'file:///android_asset/www/sounds/ff-fanfare.mp3' );
						snd.play();
					}
					$( '#round' + perm_data.round ).html( '<img src="img/G.png" class="winloss" />' );
					$( '#othermessage' ).html( 'Good wins quest ' + perm_data.round + '!' )
					perm_data.good_wins++;	
				}
				perm_data.round++;
				if ( perm_data.round < 6 ) {
					//$( '#roundcounter' ).html( 'Round ' + perm_data.round );
					$( '#votereset' ).attr( 'onclick', 'voteReset( ' + perm_data.round + ' )' );
					$( '#votereset' ).html( '<span class="alert">Continue to Quest ' + perm_data.round + '...</span>' );
				}
				if ( perm_data.good_wins == 3 ){
					alert( 'Good wins!' );
					$('#votereset').attr( 'onclick', 'resetGame()' );
					$( '#votereset' ).html( 'Start New Game' );
					
				} else if ( perm_data.evil_wins == 3 ) {
					alert( 'Evil wins!' );
					$('#votereset').attr( 'onclick', 'resetGame()' );
					$( '#votereset' ).html( 'Start New Game' );
				}
				$('#votestatus').html( 'Success: ' + successes + ' - Fail: ' + fails );
				$('#voteresults').html( voteresults );
			}

			function resetLocalCounter(){
				$( '#cardcontainer' ).html( '<div id="card1"><a href="#" onclick="viewcards()"><img class="bigcards" src="img/back.png"></a></div><div id="card2"><a href="#" onclick="viewcards()"><img class="bigcards" src="img/back.png"></a></div>' );
				votes = [];
				if ( game_type == 'network' ){
					local_count = $( "#localmissionplayers" ).val();
				} else {
					local_count = votes_required[perm_data.total_players][perm_data.round];
				}
				$( '#votestatus' ).html( "Local votes remaining: " + local_count );
				renderFakeVotes();
			}

			function voteReset( rnd ){
				$( '#votereset' ).attr( 'class', '' );
				$( '#votereset' ).html( 'Reset Votes' );
				$( '#roundcounter' ).html( 'Quest ' + rnd );
				$( '#othermessage' ).html( 'Votes Reset' );
				if ( fails_required[total_players][rnd] == 2 ) {
					$( '#failsmessage' ).html( '(Two fail cards required to fail)');
				} else {
					$( '#failsmessage' ).html( '' );
				}
				resetLocalCounter( );
				if ( game_type == 'network' ) {
					showblocker();
					data_ref.remove( function(error){
						hideblocker();
						if (error) {
							$('#othermessage').html( 'Error communicating with server' );
						} else {
							$('#othermessage').html( 'Votes reset' );
						}
						data_ref = new Firebase('https://' + room_id + '-rfy3iu2rj0x.firebaseio-demo.com/');
						console.log( 'data_ref', data_ref )
					} );
				} else {
					if ( typeof rnd !== 'undefined' ) {
						if ( rnd == 0 ) {
							$('#othermessage').html( '' );
						}
					} else {
						$('#othermessage').html( 'Votes reset' );
					}
				}
	
			}
			
			function joinGame(){
				room_id = $( '#codeinput' ).val().toUpperCase().trim();
				if ( room_id.length != 8 || !/[ACDEFGHJKMNPQRTUWXZ234679]/.test( room_id ) ){
					$( '#codestatus' ).html( 'Invalid room code!' );
				} else {
					perm_data_ref = new Firebase('https://' + room_id + '-perm-rfy3iu2rj0x.firebaseio-demo.com/');
					data_ref = new Firebase('https://' + room_id + '-rfy3iu2rj0x.firebaseio-demo.com/');
					startFireBase();
					if ( perm_data.exists != 1 ) {
						$( '#codestatus' ).html( 'Room does not exist or is expired.' );
					} else {
						$( '#networkjoinpage' ).css( 'display', 'none' );
						$( '#mainboard' ).css( 'display', 'block' );						
					}
				}
			}

			function startGame( type ){
				game_type = type;
				$( '#startpage' ).css( 'display', 'none' );
				$( '#networkcreatepage' ).css( 'display', 'none' );
				$( '#localcreatepage' ).css( 'display', 'none' );
				$( '#networkjoinpage' ).css( 'display', 'none' );
								
				$( '#mainboard' ).css( 'display', 'block' );
				is_master = true;
				
				if ( game_type == 'network' ) {
					total_players = $( '#totalnetworkplayers' ).val();
					data_ref= new Firebase('https://' + room_id + '-rfy3iu2rj0x.firebaseio-demo.com/');
					perm_data_ref= new Firebase('https://' + room_id + '-perm-rfy3iu2rj0x.firebaseio-demo.com/');
					startFireBase();
					local_count = $( "#localmissionplayers" ).val();
					perm_data_ref.push( { exists: 1,
							      round: 1,
							      total_players: total_players,
							      good_wins: 0,
							      evil_wins: 0
							});
		
				} else {
					total_players = $( '#totallocalplayers' ).val();
					$( '#noofplayers' ).css( 'display', 'none' );
					$( '#localmissionplayers' ).css( 'display', 'none' );
					perm_data.exists = 1;
					perm_data.round = 1;
					perm_data.total_players = total_players;
					perm_data.good_wins = 0;
					perm_data.evil_wins = 0;
					local_count = votes_required[total_players][perm_data.round];
				}
				$( '#roundcounter' ).html( 'Quest ' + perm_data.round );
				renderRounds();
				console.log( perm_data );
			}
			
			function renderRounds(){
				for ( i = 1; i < 6; i++ ) {
					$( '#round' + i ).html( '<img src="img/' + votes_required[ perm_data.total_players ][i] + '.png" class="winloss" />' );
				}
				renderFakeVotes();
			}
			
			function renderFakeVotes(){
				placeholders = '';
				for ( i=0; i< votes.length; i++ ){
					placeholders += '<img src="img/back.png" class="smallcards" />';
				}
				for ( i=0; i < votes_required[perm_data.total_players][perm_data.round] - votes.length; i++ ){
					placeholders += '<img src="img/blank.png" class="smallcards" />';
				}
				$( '#voteresults' ).html( placeholders );
			}
			
			function viewcards() {
				$( '#othermessage' ).html( '' );
				var cards = [ 'success', 'fail' ];
				shuffle( cards );
				$( '#cardcontainer' ).html( '<div id="card1"><a href="javascript:vote( \'' + cards[0] + '\')"><img class="bigcards" src="img/' + cards[0] + '.png"></a></div><div id="card2"><a href="javascript:vote( \'' + cards[1] + '\' )"><img class="bigcards" src="img/' + cards[1] + '.png"></a></div>' );		
			}
			
			function resetGame() {
				voteReset();
				local_count;
				is_master = false;
				players;
				votes = [];
				data_ref;
				perm_data_ref;
				room_id;
				perm_data = {};
				total_mission_players;
				total_players;
				local_mission_players;
				game_type;
				placeholders = '';
				$( '#mainboard' ).css( 'display', 'none' );
				$( '#startpage' ).css( 'display', 'block' );
				$( '#voteresults' ).html( '' );
				$( '#votestatus' ).html( '&nbsp;' );
				$( '#othermessage' ).html( '' );
				$('#votereset').attr( 'onclick', 'voteReset( 1 )' );
				$( '#votereset' ).html( 'Reset Votes' );
			}
			
			function toggleSound( snd ) {
				sound = snd;
				if ( snd == 0 ){
					$( '#sound' ).html( '<a href="javascript:toggleSound(1);">Turn on Sound</a>' );
				} else {
					$( '#sound' ).html( '<a href="javascript:toggleSound(0);">Turn off Sound</a>' );
				}
			}
			
			function menuClick(){
				$('#clickme').trigger('click');
			}
            		
			$( document ).ready( function (){
				resize();
				$('.jtextfill').textfill({ maxFontPixels: 40 });
				resizeothertext();
				$('header nav').meanmenu();
				blinks( 0 );
			});