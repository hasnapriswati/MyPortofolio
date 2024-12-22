
document.addEventListener('DOMContentLoaded', function() {
  var projectModal = document.getElementById('projectModal')
  projectModal.addEventListener('show.bs.modal', function (event) {
    var button = event.relatedTarget
    var card = button.closest('.card')
    var title = card.querySelector('.card-title').textContent
    var description = card.querySelector('.card-text').textContent
    var image = card.querySelector('img').src
    
    var modalTitle = projectModal.querySelector('.modal-title')
    var modalBody = projectModal.querySelector('.modal-body')
    
    modalTitle.textContent = title
    document.getElementById('modalProjectTitle').textContent = title
    document.getElementById('modalProjectDescription').textContent = description
    document.getElementById('modalProjectImage').src = image
  })
})

function animateText(elementId, speed) {
const element = document.getElementById(elementId);
const text = element.innerText;
element.innerHTML = '';

for (let i = 0; i < text.length; i++) {
const span = document.createElement('span');
span.textContent = text[i];
span.classList.add('hidden');
element.appendChild(span);

setTimeout(() => {
  span.classList.add('fade-in');
}, speed * i); // Menggunakan parameter speed sebagai interval
}
}


let tentangScene, tentangCamera, tentangRenderer, tentangParticles;

function initTentangBackground() {
const container = document.querySelector('.tentang');
tentangScene = new THREE.Scene();
tentangCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 2000);
tentangRenderer = new THREE.WebGLRenderer({ canvas: document.getElementById('tentangBackground'), alpha: true });
tentangRenderer.setSize(container.clientWidth, container.clientHeight);

const geometry = new THREE.BufferGeometry();
const vertices = [];
const textureLoader = new THREE.TextureLoader();
const sprite = textureLoader.load('https://threejs.org/examples/textures/sprites/square1.png');

for (let i = 0; i < 5000; i++) {
  const x = Math.random() * 2000 - 1000;
  const y = Math.random() * 2000 - 1000;
  const z = Math.random() * 2000 - 1000;
  vertices.push(x, y, z);
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const material = new THREE.PointsMaterial({
  size: 4,
  sizeAttenuation: true,
  map: sprite,
  alphaTest: 0.5,
  transparent: true,
  color: 0x0f0f0f
});

tentangParticles = new THREE.Points(geometry, material);
tentangScene.add(tentangParticles);

tentangCamera.position.z = 1000;

animateTentangBackground();
}

function animateTentangBackground() {
requestAnimationFrame(animateTentangBackground);

tentangParticles.rotation.x += 0.0002;
tentangParticles.rotation.y += 0.0002;

const positions = tentangParticles.geometry.attributes.position.array;
const time = Date.now() * 0.00005;

for (let i = 0; i < positions.length; i += 3) {
  positions[i] += Math.sin(time + positions[i] * 0.0005) * 0.3;
  positions[i + 1] += Math.cos(time + positions[i + 1] * 0.0005) * 0.3;
}

tentangParticles.geometry.attributes.position.needsUpdate = true;

tentangRenderer.render(tentangScene, tentangCamera);
}

function onTentangWindowResize() {
const container = document.querySelector('.tentang');
tentangCamera.aspect = container.clientWidth / container.clientHeight;
tentangCamera.updateProjectionMatrix();
tentangRenderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onTentangWindowResize, false);

// Inisialisasi variabel global
function initBannerBackground() {
  const container = document.querySelector('.banner');
  bannerScene = new THREE.Scene();
  bannerCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 2000);
  bannerRenderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bannerBackground'), alpha: true });
  bannerRenderer.setSize(container.clientWidth, container.clientHeight);

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const colors = [];
  const particleCount = 5000;

  // Buat spiral galaxy
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 500;
    const spiral = angle + (radius / 50);
    
    const x = Math.cos(spiral) * radius;
    const y = Math.sin(spiral) * radius;
    const z = (Math.random() - 0.5) * 50;

    vertices.push(x, y, z);

    // Warna gradien
    const color = new THREE.Color();
    color.setHSL(radius / 500, 1, 0.5);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  bannerParticles = new THREE.Points(geometry, material);
  bannerScene.add(bannerParticles);

  bannerCamera.position.z = 1000;

  animateBannerBackground();
}

function animateBannerBackground() {
  requestAnimationFrame(animateBannerBackground);

  bannerParticles.rotation.z += 0.001;
  bannerParticles.rotation.x = Math.sin(Date.now() * 0.0001) * 0.2;

  bannerRenderer.render(bannerScene, bannerCamera);
}

// Handle window resize
function onBannerWindowResize() {
  const container = document.querySelector('.banner');
  if (!container || !bannerCamera || !bannerRenderer) return;

  bannerCamera.aspect = container.clientWidth / container.clientHeight;
  bannerCamera.updateProjectionMatrix();
  bannerRenderer.setSize(container.clientWidth, container.clientHeight);
}

// Event listeners
window.addEventListener('resize', onBannerWindowResize, false);

// Inisialisasi saat DOM loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing banner');
  initBannerBackground();
});



let scene, camera, renderer, imagePlane;

function init() {
const container = document.querySelector('.image-content');
scene = new THREE.Scene();
camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('backgroundCanvas'), alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);

const textureLoader = new THREE.TextureLoader();
textureLoader.load('banner.png', function(texture) {
  const aspectRatio = texture.image.width / texture.image.height;
  const planeGeometry = new THREE.PlaneGeometry(2, 2 / aspectRatio);
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  imagePlane = new THREE.Mesh(planeGeometry, material);
  scene.add(imagePlane);

  camera.position.z = 1;
  adjustImagePosition();
});

animate();
}

function animate() {
requestAnimationFrame(animate);

if (imagePlane) {
  imagePlane.position.y = Math.sin(Date.now() * 0.001) * 0.05;
}

renderer.render(scene, camera);
}

function adjustImagePosition() {
if (imagePlane) {
  const container = document.querySelector('.image-content');
  const containerAspect = container.clientWidth / container.clientHeight;
  const imageAspect = imagePlane.geometry.parameters.width / imagePlane.geometry.parameters.height;

  // Gunakan persentase untuk mengatur ukuran gambar
  const desiredWidthPercentage = 90; // Gambar akan mengisi 90% lebar container
  const scaleX = (desiredWidthPercentage / 100) * 2; // Karena scene Three.js memiliki lebar 2 unit

  let scaleY;
  if (containerAspect > imageAspect) {
    // Container lebih lebar, sesuaikan tinggi
    scaleY = scaleX / imageAspect;
  } else {
    // Container lebih tinggi, sesuaikan lebar
    scaleY = 2 * (desiredWidthPercentage / 100) / containerAspect;
    scaleX = scaleY * imageAspect;
  }

  imagePlane.scale.set(scaleX, scaleY, 1);

  // Posisikan gambar di tengah
  imagePlane.position.x = 0;
  imagePlane.position.y = 0;
}
}

function onWindowResize() {
const container = document.querySelector('.image-content');
renderer.setSize(container.clientWidth, container.clientHeight);
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();
adjustImagePosition();
}

window.addEventListener('resize', onWindowResize, false);

init();

// (function() {
// emailjs.init("PAlABIoUl0A4oZ1dU");
// })();

// function kirimPesan() {
// // Collect form data
// var nama = document.getElementById("nama").value;
// var email = document.getElementById("email").value;
// var phone = document.getElementById("phone").value;
// var pesan = document.getElementById("pesan").value;

// // Prepare the email parameters
// var emailParams = {
//   from_name: nama,
//   from_email: email,
//   phone: phone,
//   message: pesan
// };

// // Send the email
// emailjs.send("service_ijal", "template_ijal", emailParams)
//   .then(function(response) {
//     alert("Pesan berhasil dikirim!");
//   }, function(error) {
//     alert("Gagal mengirim pesan. Silakan coba lagi.");
//   });
// }
// kirimPesan();

document.addEventListener('DOMContentLoaded', function() {
// Inisialisasi Three.js backgrounds
initBannerBackground();
initTentangBackground();

// Inisialisasi animasi teks
animateText('nama', 90);
animateText('salam', 200);

// Event listener untuk form kontak
});

