// ==UserScript==
// @name         jira
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  try to take over the world!
// @author       You
// @include      https://jira.autsoft.hu/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	window.onload = function() {
		console.log('tooooomiu')

	}

    window.addEventListener('keyup', function(e){

    }, true);


    window.addEventListener('keydown', function(e){

    }, true);

    var floatBar = document.createElement('div');
	floatBar.id = 'ekr-script-float-bar';
    floatBar.style.width = '';
    floatBar.style.position = 'fixed';
    floatBar.style.bottom = '100px';
    floatBar.style.left = '0';
    floatBar.style.zIndex = '9999';
    function addBtn(name, fun, tt) {
        var btnel = document.createElement('button');
        btnel.style.display = 'block';
        btnel.className = 'btn btn-secondary mx-0 px-0';
        btnel.textContent = name;
		if (tt) btnel.setAttribute('title', tt);
        btnel.onclick = fun;
        floatBar.appendChild(btnel);
    }
    function addBtn2(name, fun, tt) {
        var btnel = document.createElement('button');
        btnel.style.display = 'block';
        btnel.style.marginLeft = '10px';
        btnel.className = 'btn btn-secondary mx-0 px-0';
        btnel.textContent = name;
		if (tt) btnel.setAttribute('title', tt);
        btnel.onclick = fun;
        floatBar.appendChild(btnel);
    }
    function copy(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input)
    return result;
 }

    var rows = [];

    var update = (vals) => {
        console.log('upds')
        document.getElementById('ekr-script-float-bar').innerHTML = ''
        rows.forEach((x, i) => {
            addBtn(x, () => {}, "");
            if(x !== 'Empty') {
            vals[i].forEach(x => {
                addBtn2(x, () => {
copy( x[1].split('-')[0] + `
`)
                }, "");
            });
            }
        });
        document.body.appendChild(floatBar);
    }



    window.addEventListener('click', function(e){
        window.setTimeout(x => {
            if(!document.getElementById('started')) {
                document.getElementById('ekr-script-float-bar').innerHTML = ''
            } else {
            document.body.appendChild(floatBar);
           
            		$.ajax ( {
    type:       'GET',
    headers: {
    },
    //url:        'http://gitlab.ads.sagem.hu/users/bordakt/calendar_activities?date=2019-6-11',
    url:        'http://localhost:3000?date='+started.value,
    success:    function (x) {
        rows = JSON.parse(x).keys
        update(JSON.parse(x).vals)
    }
} );
    }
        }, 0);
    }, true);



	window.addEventListener('keypress', function(e){
		if(e.key == '+') kezb(true)
		else if(e.key == '-') kezb(false)
	});

})();