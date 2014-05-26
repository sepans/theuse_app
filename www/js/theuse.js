   console.log('js');
        
        
        
        var device = {};
        
        var playCount = 0;
        
        var words = [] , word_index = 0;
        
        var rand_segment = [];
        var STATE_INIT =0, STATE_PLAY = 1, STATE_PAUSE = 2;
        
        
        var BLUE_ENDPOINT_OPTS = { endpoint:"Rectangle",
			paintStyle:{ width:15,height: 10,  fillStyle:'#AAA' },
			isSource:true,
			connectorStyle : { strokeStyle:"#00F" },
			isTarget:true, 
			anchor: "TopCenter",
			maxConnections : 3
	    };

        var _owl,
            areYouHere = true;
        
        
        $('#theuse').bind('pageinit', function(event) {
        	console.log('init');

		
		    console.log('ready');
		    document.addEventListener("deviceready", onBodyLoad, false);  // change to web



			onBodyLoad();
		});
		
		$(document).ready(function() {
		
			onBodyLoad(); // change to web

            
		});
		
        
        
        function onBodyLoad()
        {		
           // document.addEventListener("deviceready", onDeviceReady, false);
		    device.pageWidth = $(window).width();
		    device.pageHeight = $(window).height();

            console.log('carousel');
            $("#carousel").owlCarousel({singleItem: true, pagination: false, rewindNav: false, slideSpeed: 400});

            _owl = $('#carousel').data('owlCarousel');
            console.log(_owl);
            _owl.jumpTo(1);
		    


		
            


		    
            for(var i=0;i<content_info.length;i++) {
            	//console.log(content_info[i].display_title);
            	
            	

            	
            	var item;
                item = '<li class="item" id="item-'+i+'"><a href="#" class="rect" onclick="opentext('+i+')"></a><ul class="segments">';
                if(content_info[i].title=='youknow' || content_info[i].title=='dunno') {
                    item=item+'<li class="circ seg" ><a href="#" class="circ" onclick="play_track('+i+');"><input class="state" type="hidden" value="0"/></a></li>';
                
                }
                else {

                    for(var j=0;j<content_info[i].segments.length;j++) {
                        item=item+'<li class="circ seg-'+j+'"><a href="#" class="circ" onclick="play_track('+i+','+j+');"><input class="state" type="hidden" value="0"/></a></li>';
                    }
                }
	            item=item+'</ul></li>';
	           // console.log(item);
	           
	           
	          
	           
            	$('#items-list').append(item);
            } 
            var container = document.querySelector('#items-list');
            
            var msnry = new Masonry(  container, {
                  columnWidth: 24,
                  itemSelector: '.item'
            });
            
            
            
            jsPlumb.ready(function() {

                jsPlumb.Defaults.Container = $("#text-container");
                jsPlumb.importDefaults({
                    ConnectorZIndex:4000,
                    Connector :  "Straight" ,
                  //  Endpoint : "Blank",
                    PaintStyle : { lineWidth : 1, strokeStyle : "#00F" },
                    Anchors : [ "TopCenter", "BottomCenter" ]
                });
                /*

                //not needed since connections are made by tapping
                jsPlumb.bind("jsPlumbConnection", function(info) {
                
                
                    console.log('jsplumb');
                    var sourceText = info.source.text();
                    var targetText = info.target.text();
                    //sourceText=sourceText.replace(/\W/g, '');
                    //targetText=targetText.replace(/\W/g, '');
                    console.log('source '+sourceText);
                    console.log('target '+targetText);
                
                    $.getJSON("http://theuse.info/search_all.php?keyword="+sourceText+"&one=one", function(data1) {
                        console.log(data1);
                        $.getJSON("http://theuse.info/search_all.php?keyword="+targetText+"&one=one", function(data2) {
                            console.log(data2);
                        
                            $.ajax({
                                url: 'http://theuse.info/markov.php?order=5&length='+500+'&begining='+sourceText+'&content='+data1[0].sentence.substring(0,2000).trim()+' '+data2[0].sentence.substring(0,2000).trim(),
                                context: document.body
                                }).done(function(data) { 
                            
                                 console.log(info.source);
                                 console.log(info.source.parents('.synth').length>0);

                                 //generateMarkov(data,100,100,sourceText,targetText,info);
                           });								
                                        

                    
                        });
                    });
                

                
                    //console.log(sourceText);
                
                
              
              });

            */

            });  //jsplumb	
            
            
            
        }   //onbodyload
        
        function opentext(item) {

            if(areYouHere) {
                $('#youarehere').hide();
                areYouHere = false;
            }

            //remove generated texts and pipes
            $('.gen-text').remove();
            $('svg').remove();

            $('#text-container h2').text(content_info[item].display_title);
            var spans = wrapTextInSpans(content_info[item].body);
            $('#text-container p').html(spans);
           // $('#text-container').show();
            //scrollLeft(0);

            _owl.goTo(0);


            
            $('#text-container p .aword').on("click",function() {
                
                synthesize(this);

            });
        
        }

        function synthesize(element) {
            console.log($(element).text());
                $(element).css('color','#00F');
                words[word_index] = {element:$(element),text: $(element).text()};
                //words[word_index].text = $(element).text();
                console.log('new word '+words[word_index]);
                word_index = (word_index+1)%2;
                
                if(word_index==0) {
                
                    var container =$('<div class="gen-text"></div>').appendTo('#text-container');
                     
                     console.log(container);
                     
                     
                     
                     //var leftMargin = 10+Math.round(Math.random()*10);
                     var widthSt = (50+Math.random()*40)+'%';
                     console.log(widthSt);
                     container.css('max-width', widthSt);
                     
                     container.css('top', (5+Math.random()*70)+'%');
                     container.css('left', (Math.random()*20)+'%');
                     
                     jsPlumb.connect({
                        source:words[0].element,
                        target:words[1].element
                    });


                    //TODO turn this to a single call
                    $.getJSON("http://theuse.info/search_all.php?keyword="+words[0].text+"&one=one", function(data1) {
                        console.log(data1);
                        $.getJSON("http://theuse.info/search_all.php?keyword="+words[1].text+"&one=one", function(data2) {
                        
                            $.ajax({
                                url: 'http://theuse.info/markov.php?order=5&length='+500+'&begining='+words[0].text+'&content='+data1[0].sentence.substring(0,2000).trim()+' '+data2[0].sentence.substring(0,2000).trim(),
                                context: document.body
                                }).done(function(data) { 
                                
                                 
                                 var text = data.substring(0,data.indexOf('.')+1);
                                 
                                 $(container).text(text);
 
                                 
                           });                              
                                        

                    
                        });
                    });
                }
                
                 jsPlumb.addEndpoint($(element),BLUE_ENDPOINT_OPTS);
                // jsPlumb.draggable($('#text-container p .aword'));
        }
        
        function wrapTextInSpans(text) {
            var spans = '';
            var words = text.split(" ");
            $.each(words, function(i, v) {
                
                 spans= spans.concat("<span class='aword'>"+v+" </span>");
            });
            
            return spans;
        
        }
        
        function onDeviceReady()
        {
            // do your thing!
        //    alert('ready');
        }
        
        function play_track(item,segment) {

            if(areYouHere) {
                $('#youarehere').hide();
                areYouHere = false;
            }
        
            console.log(item);
            
            var button= $('#item-'+item+' .seg-'+segment+' a.circ');
            var state=$('#item-'+item+' .seg-'+segment+' .state');

            if(segment==undefined) {
               segment = rand_segment[item]!=undefined ? rand_segment[item] : Math.round(Math.random()*content_info[item].segments.length);
               rand_segment[item] = segment;
               console.log('rand seg '+segment);

               button= $('#item-'+item+' .seg a.circ');
               state=$('#item-'+item+' .seg .state');
            
            }
            
            
            var filename = content_info[item].segments[segment];
            
            
            var audio_id = 'item-'+item+'-seg-'+segment;
            
            console.log(filename);
            console.log(audio_id);
            
            if(state.val()==STATE_INIT) {
                PGLowLatencyAudio.preloadAudio(audio_id, content_info[item].segments[segment], 1, function(result) { // success
                 /* 
                    seems success callback doesnt work. play after that works
                  
                    alert(result);
                    alert('playing '+audio_id+' '+filename);
                    PGLowLatencyAudio.play(audio_id, function(error) {alert(error);},function(msf) {alert(msg);}  );
                 //   PGLowLatencyAudio.play(audio_id);
                 
                 */
              
              }, function(error) { // error
                    alert('error audio file not found in the app '+audio_id+' '+filename);
              
              });

                    //alert('playing '+audio_id+' '+filename);
                    if(playCount==0) {
                   		 PGLowLatencyAudio.volume(audio_id,1,0);
                   	}
                    else if(playCount==1) {
                   		 PGLowLatencyAudio.volume(audio_id,0,1);
                   	}
                   	playCount++;
                    PGLowLatencyAudio.play(audio_id, function(error) {alert(error);},function(msf) {alert(msg);}  );
        
                button.css('background-color','#F00');
                state.val(STATE_PLAY);
            } 
            else if (state.val()==STATE_PLAY) {    // pausing
                
                button.css('background-color','#0F0');
                state.val(STATE_PAUSE);
                
                PGLowLatencyAudio.stop(audio_id);
                
                setTimeout(function() {
                    if(state.val()==STATE_PAUSE) {
                        cleanup(audio_id,item,button,state);
                    }
                    
                    
                },15000);   // unloading after 15 sec 

            
            }
            else if (state.val()==STATE_PAUSE) {    // resuming
                button.css('background-color','#F00');
                state.val(STATE_PLAY);

                PGLowLatencyAudio.play(audio_id);
            
            }
            console.log(segment);
            
        
        }
        
        
        function cleanup(audio_id,item,button,state) {

            console.log('unloading '+audio_id);
            button.css('background-color','#aaa');
            PGLowLatencyAudio.unload(audio_id);
            state.val(STATE_INIT);
            if(rand_segment[item]!=undefined) {
                rand_segment[item]=undefined;
            }

        
        }
        
        function playVid(title) {
        
        
//        window.plugins.videoPlayer.play('video/'+title+'.webm');
       // window.plugins.videoPlayer.play('file:///android_asset/www/video/itsatrick.mp4');
      //  window.plugins.videoPlayer.play('file:///android_asset/www/video/7.mov');

        //window.plugins.videoPlayer.play('video/itsatrick.mp4');
        
        }
        
        /*
        
        function playVid(title) {
            var video = document.getElementById('vid1');
            if(!video.paused) {
                 $('.vidbutton-'+title).css('background-color','green');
                video.pause();
                $(video).hide();
            }
            else {
                $('.vidbutton-'+title).css('background-color','red');
                
                if(!video.src) {
                    console.log('set source');
                    video.src= 'video/'+title+'.ogg';
                }

                    
               console.log(video.src);
               
               console.log('playing');
        
                $(video).show();
                video.play();
            }
            scrollRight();

            

            
        
        }
        
        */
        
        
  