var panorama, viewer, container, infospot, urls, box, menuBar, menuBtn, autoCon, position = [], arr, x, y, z, musicNF, spots, modals, panoArr = [], timerId, index = 0 ;

var bar = document.querySelector('#bar');
box = document.getElementById('cardBox');
menuBar = document.getElementById('menuBar');
menuBtn = document.getElementById('menuBtn');
autoCon = document.getElementById('autoCon');
musicNF = document.getElementById('musicNF');


// 이미지 정보 저장
urls = [
	'./img/img2.jpg',
	'./img/img3.jpg',
	'./img/img4.jpg',
	'./img/img5.jpg'
];
// 핫스팟 정보 저장
spots = [
	{ k1: '796.38, -649.36, -5000.00', k2: '2171.10,-1318.29,-4295.12' },
	{ k1: '-2042.39,-759.05,-4497.36', k2: '5000.00, 142.45, 173.28' },
	{ k1: '-2042.39,-759.05,-4497.36' },
	{ k1: '612.28, -813.37, -5000.00' }
];
// 모달 정보 저장
modals = [
	{ num: 1, title: '모달 테스트', str: '모달 테스트 텍스트 입니다.' }
]
container = document.querySelector('#container');


// ===== ===== 핫스팟 포커스 ===== =====

var curves = [], easings = [];

// Focus tweening parameter
parameters = {
	amount: 50,
	duration: 1000,
	curve: 'Exponential',
	easing: 'Out',
	iterative: false
};

// ====== ====== 핫스팟 포커스 ====== ======
function getPropertyArray ( object ) {
	var array = [];

	for ( var name in object ) {
		array.push( name );
	}
	return array;
}

curves = getPropertyArray( TWEEN.Easing );

function iterativeFocus ( enabled ) {

	if ( !enabled ) {
		clearTimeout( timerId );
		return;
	}
	onFocus.call( panorama.children[ index++ ] );

	if ( index === panorama.children.length ) {
		index = 0;
	}
	timerId = setTimeout( iterativeFocus.bind( this, enabled ), parameters.duration + 500 );
}

function onFocus () {
	this.focus( parameters.duration, TWEEN.Easing[ parameters.curve ][ parameters.easing ] );
}



// ======= ======= 상단에 이미지 로딩 바 ======= =======
function onProgressUpdate(event) {
	var percentage = event.progress.loaded / event.progress.total * 100;
	bar.style.width = percentage + "%";
	if (percentage >= 100) {
		bar.classList.add('hide');
		setTimeout(function () {
			bar.style.width = 0;
		}, 1000);
	}
}


// ===== ===== ===== 핫스팟 생성 함수 ===== ===== ===== 
function createInfospot(arr) {
	for (var i = 0; i < Object.keys(arr).length; i++) {
		position = Object.values(arr[i]);
		for (var k = 0; k < Object.keys(arr[i]).length; k++) {
			var infospot = new PANOLENS.Infospot(250, PANOLENS.DataImage.Info);
			infospot.position.set(position[k]);
			console.log(position[k]);
			panorama.add(infospot);
		}
	}
}


// ======= ======= 뷰어 ======= =======
viewer = new PANOLENS.Viewer({
	container: container,
	output: 'console',
	autoHideInfospot: false,
	autoRotate: true,
	autoRotateSpeed: 0.3,
	controlBar: true,
	controlButtons: ['fullscreen']
});

// Enter panorama when load completes
function onButtonClick(targetPanorama) {
	bar.classList.remove('hide');
	viewer.setPanorama(targetPanorama);
}

// ====== ====== ====== html에 carousel 요소 추가, setpanorama ====== ====== ======

function createPano() {
	for (i = 0; i < urls.length; i++) {
		url = urls[i];

		photo = document.createElement('div');
		photo.classList.add('item');
		var t = document.createTextNode((i + 1) + '번 이미지');
		photo.url = url;
		photo.name = i;

		imgbox = document.createElement('img');
		imgbox.setAttribute('src', urls[i]);

		photo.appendChild(imgbox);
		photo.appendChild(t);
		box.appendChild(photo);

		// ===== ===== ===== 모달창 이벤트 함수 ===== ===== =====
		function show() {
			document.querySelector(".background").className = "background show";
		}

		function close() {
			document.querySelector(".background").className = "background";
		}

		// ===== ===== ===== 모달 생성 함수 ===== ===== =====
		function createModal(num, title, str) {
			let tagArea = document.getElementById('addModal');

			let showBtn = document.createElement('button');
			showBtn.setAttribute('id', 'show');

			let new_btn = document.createElement('div');
			new_btn.setAttribute('class', 'background');

			let new_div1 = document.createElement('div');
			new_div1.setAttribute('class', 'window');

			let new_div2 = document.createElement('div');
			new_div2.setAttribute('class', 'popup');

			let new_btn2 = document.createElement('span');
			new_btn2.innerHTML = '✖';
			new_btn2.setAttribute('id', 'close');
			new_div2.innerHTML = '<b>' + title + '</b> </br>';
			new_div2.innerHTML += '</br>';
			new_div2.innerHTML += str;

			tagArea.appendChild(new_btn);
			new_btn.appendChild(new_div1);
			new_div1.appendChild(new_div2);
			new_div2.appendChild(new_btn2);

			if (photo.name == num) {
				infospot.addHoverText('클릭시 모달 띄워집니다.');
				infospot.addEventListener('click', show);
			}
			document.querySelector("#close").addEventListener("click", close);
		}
		// ===== ===== ===== 모달 생성 끝 ===== ===== =====
		var num = 1, title = '모달테스트입니다.', str = '모달테스트';

		// ==== ==== ==== 파노라마 생성 ==== ==== ====
		panorama = new PANOLENS.ImagePanorama(urls[i]);
		// 배열에 파노라마 정보 저장
		panoArr[photo.name] = panorama;
		panorama.addEventListener('progress', onProgressUpdate);

		//  ====== ====== ====== 핫스팟 생성 ====== ====== ======
		position = Object.values(spots[i]);
		for (var k = 0; k < Object.keys(spots[i]).length; k++) {
			infospot = new PANOLENS.Infospot(250, PANOLENS.DataImage.Info);
			// ','로 자르기
			arr = position[k].split(',');
			x = parseInt(arr[0]);
			y = parseInt(arr[1]);
			z = parseInt(arr[2]);

			infospot.position.set(x, y, z);
			infospot.addEventListener('click', onFocus);
			// 모달 함수
			createModal(num, title, str);
			panorama.add(infospot);
		}

		// ==== ==== ==== carousel 클릭 이벤트 ==== ==== ====
		photo.addEventListener('click', onButtonClick.bind(this, panorama));

		viewer.add(panorama);
	}
}
createPano();

// ===== ===== ===== 다른 이미지로 이동하는 화살표 핫스팟 추가 ===== ===== =====
panoArr[0].link(panoArr[1], new THREE.Vector3(-2030.43, -224.16, -5000.00));
var infospot2 = new PANOLENS.Infospot(250, PANOLENS.DataImage.Info, false);
infospot2.position.set(-3561.66, -1520.78, -3158.46);
infospot2.addEventListener('click', onFocus);
infospot2.addHoverText('텍스트 테스트');
panoArr[0].add(infospot2);

// ====== ====== ====== 슬라이드 메뉴 숨기기 ====== ====== ======
menuBtn.addEventListener('click', function () {
	box.classList.toggle('active');
});

// ====== ====== ====== 자동회전 ====== ====== ======
autoCon.addEventListener('click', function () {
	autoCon.classList.toggle('active');
	viewer.OrbitControls.autoRotate = !(viewer.OrbitControls.autoRotate);
});

// ====== ====== ====== Howler.js 음악 재생 / 버튼 조작====== ====== ======
var sound = new Howl({
	src: ['./bensound-anewbeginning.mp3'],
	volume: 1.0,
	autoplay: true,
	loop: true,
	onplay: () => {
		console.log('음악 재생');
	},
	onend: () => {
		console.log('음악 끝');
	}
});
sound.play();

// && 버튼 조작 
var music = document.getElementById('musicNF');
music.addEventListener('click', function () {
	musicNF.classList.toggle('active');
	if (sound.playing()) {
		sound.pause();
	} else {
		sound.play();
	}
});
