
var state = 'encode';

var elEncode = document.getElementById('encode');
var elDecode = document.getElementById('decode');
var elInput  = document.getElementById('input');
var elResult = document.getElementById('result');

elEncode.addEventListener('click', function (e) {
	state = 'encode';
	elEncode.classList.add('active');
	elDecode.classList.remove('active');
	elInput.value = elResult.value = "";
});

elDecode.addEventListener('click', function (e) {
	state = 'decode';
	elEncode.classList.remove('active');
	elDecode.classList.add('active');
	elInput.value = elResult.value = "";
});

elInput.addEventListener('input', function (e) {
	var input = elInput.value;

	if (state == 'encode')
		elResult.value = btoa(input);

	if (state == 'decode')
		elResult.value = atob(input);
});
