left.style.transition = '0s';

var objLoader = new THREE.OBJLoader();

// Scene

var l_scene = new THREE.Scene();
var r_scene = new THREE.Scene();

// Camera

var camera = new THREE.PerspectiveCamera(
	75,
	document.documentElement.clientWidth/document.documentElement.clientHeight, 
	1,
	1000
);
camera.position.set(0, 0, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));
l_scene.add(camera);
r_scene.add(camera);

// Renderer

var l_renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
var r_renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

//l_renderer.setClearColor(0xdddddd, 1.0);
l_renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
r_renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);

l_renderer.domElement.id = "left-bg";
l_renderer.domElement.style.left = incl_shift + "px";
l_renderer.domElement.style.transform = "skew(" + incl_deg + "deg, 0deg)";

r_renderer.domElement.id = "right-bg";

document.getElementById('left').appendChild(l_renderer.domElement);
document.getElementById('right').appendChild(r_renderer.domElement);

// Lighting

var ambient_light = new THREE.AmbientLight(0xaaaaaa, 0.5);
r_scene.add(ambient_light);
var light = new THREE.PointLight( 0xffffff, 1, 100);
light.position.set(0, 0, 8);
l_scene.add( light );
var light2 = new THREE.PointLight( 0xffffff, 1, 100);
light2.position.set(0, 0, 8);
r_scene.add(light2);

// Fog

l_scene.fog = new THREE.Fog(0x111111, 5, 100);
r_scene.fog = new THREE.Fog(0xdddddd, 5, 100);

// Objects
var l_pyramid, r_pyramid;
var l_jcb, r_jcb, l_heading, r_heading;

LoadMeshes();
LoadObjects();
LoadTunnels();

var triangle = new THREE.Geometry();
triangle.vertices = [
	new THREE.Vector3(1, 0, 0),
	new THREE.Vector3(-1, 0, 0),
	new THREE.Vector3(0, 0, 1)
];
triangle.faces = [new THREE.Face3(0, 1, 2)];

//var tri_mesh = new THREE.Mesh(triangle, materials);
//scene.add(tri_mesh);

// Animation

left.style.transition = '.5s';

function animate() {
	//tri_mesh.position.y += 0.01;
	//tri_mesh.rotation.x += 0.01;
	//tri_mesh.position.z += 0.01;
	l_pyramid.rotation.y -= 0.01;
	r_pyramid.rotation.y += 0.01;
	l_renderer.render(l_scene, camera);
	r_renderer.render(r_scene, camera);
	setTimeout( function() {
		requestAnimationFrame(animate);
	}, 1000 / 60 );
};
animate();

window.onresize = function() {
	
	init();

	document.getElementById('left').style.transition = '0s';
	camera.aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
	camera.updateProjectionMatrix();

	l_renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
	r_renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);

	l_renderer.domElement.id = "left-bg";
	l_renderer.domElement.style.left = incl_shift + "px";
	l_renderer.domElement.style.transform = "skew(" + incl_deg + "deg, 0deg)";
	document.getElementById('left').style.transition = '.5s';
}


document.addEventListener('mousemove', function(e){
	var mouseX = e.pageX;
	var mouseY = e.pageY;

	camera.position.set((mouseX - page_width / 2) / 500, -(mouseY - page_height / 2) / 500, 10);	
});

document.addEventListener('mouseout', function(e) {
	var left = document.getElementById('left');
	left.style.width = (page_width / 2 + (page_height * Math.tan(Math.PI * incl_deg / 180))).toString() + "px";
	camera.position.set(0, 0, 10);	
});

function Init3D() {

}

function AssignMaterial(object, material) {
	object.traverse(function(child){
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
	});
}

function LoadMeshes() {
	var geometry = new THREE.Geometry();

	var vertices = [
		new THREE.Vector3(0, 2, 0),
		new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(0, 0, 1),
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(0, 0, -1),
		new THREE.Vector3(0, -2, 0)
	];

	var faces = [
		new THREE.Face3(0, 1, 2),
		new THREE.Face3(0, 2, 3),
		new THREE.Face3(0, 3, 4),
		new THREE.Face3(0, 4, 1),
		new THREE.Face3(1, 2, 5),
		new THREE.Face3(2, 3, 5),
		new THREE.Face3(3, 4, 5),
		new THREE.Face3(4, 1, 5),
	];

	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.computeFaceNormals();

	l_pyramid = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x222222, side: THREE.DoubleSide}));
	l_scene.add(l_pyramid);
	l_pyramid.position.y = 5;

	r_pyramid = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x888888, side: THREE.DoubleSide}));
	r_scene.add(r_pyramid);
	r_pyramid.position.y = -5;
}

function LoadTunnels() {
	var curve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 0, -200),
	    new THREE.Vector3(0, -50, -50),
	    new THREE.Vector3(0, 50, 50),
	    new THREE.Vector3(0, 0, 200)
	]);

	var geometry = new THREE.TubeGeometry(curve, 4, 20, 6, false);
	var material = new THREE.MeshBasicMaterial( { color: 0xdddddd, side: THREE.BackSide} );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.scale.set(1, 2, 1);
	l_scene.add(mesh);

	var r_curve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 0, -200),
	    new THREE.Vector3(0, 50, -50),
	    new THREE.Vector3(0, -50, 50),
	    new THREE.Vector3(0, 0, 200)
	]);

	var r_mesh = new THREE.Mesh(
		new THREE.TubeGeometry(r_curve, 4, 20, 6, false), 
		new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide})
	);
	r_mesh.scale.set(1, 2, 1);
	r_scene.add(r_mesh);
}

function LoadObjects() {
	objLoader.load('models/jcbreath.obj', function (object) {
    	l_jcb = object;
    	AssignMaterial(l_jcb, new THREE.MeshPhongMaterial({color: 0x111111, side: THREE.DoubleSide}));
	    l_scene.add(l_jcb);
	    l_jcb.position.x -= 0.05;
	    l_jcb.position.z += 3;
	    l_jcb.rotation.x += Math.PI / 2;
	});

	objLoader.load('models/jcbreath.obj', function (object) {
	    r_jcb = object;
	    AssignMaterial(r_jcb, new THREE.MeshPhongMaterial({color: 0x999999, side: THREE.DoubleSide}));
	    r_scene.add(r_jcb);
	    r_jcb.position.x -= 0.05;
	    r_jcb.position.z += 3;
	    r_jcb.rotation.x += Math.PI / 2;
	});

	objLoader.load('models/proj.obj', function (object) {
    	l_heading = object;
    	AssignMaterial(l_heading, new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide}));
	    l_scene.add(l_heading);
	    l_heading.position.y -= 5;
	    l_heading.position.z += -1;
	    l_heading.rotation.x += Math.PI / 2;
	});

	objLoader.load('models/about.obj', function (object) {
    	r_heading = object;
    	AssignMaterial(r_heading, new THREE.MeshPhongMaterial({color: 0x333333, side: THREE.DoubleSide}));
	    r_scene.add(r_heading);
	    r_heading.position.y += 5;
	    r_heading.position.z += -1;
	    r_heading.rotation.x += Math.PI / 2;
	});
}