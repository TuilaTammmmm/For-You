const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let fireworkParticles = []; // Các hạt tạo nên quả pháo hoa trước khi nổ

const colors = ['#FFC0CB', '#FF69B4', '#FF1493', '#DB7093', '#C71585']; // Các màu hồng/đỏ

// Lớp Hạt (Particle) - dùng cho các tia lửa sau khi nổ
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.friction = 0.99;
        this.gravity = 0.05;
        this.decay = Math.random() * 0.03 + 0.01; // Tốc độ mờ dần ngẫu nhiên
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay; // Mờ dần theo decay
        if (this.alpha <= 0) {
            this.alpha = 0; // Đảm bảo không bị âm
        }
        this.draw();
    }
}

// Lớp Pháo hoa (FireworkParticle) - dùng cho "quả bom" bay lên
class FireworkParticle {
    constructor(startX, startY, endX, endY, color) {
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.distance = Math.hypot(endX - startX, endY - startY);
        this.currentDistance = 0;
        this.velocity = { x: (endX - startX) / 60, y: (endY - startY) / 60 }; // Tốc độ di chuyển
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.currentDistance = Math.hypot(this.x - this.startX, this.y - this.startY);
        this.alpha -= 0.02; // Mờ dần khi bay lên
        this.draw();
    }
}


// Hàm tạo vụ nổ hình trái tim
function createHeartExplosion(x, y, baseColor) {
    const particleCount = 100; // Số lượng hạt nhỏ
    const power = 3.5; // Sức nổ
    
    // Tạo 50% hạt màu chủ đạo, 50% hạt màu ngẫu nhiên khác
    for (let i = 0; i < particleCount; i++) {
        let color = Math.random() < 0.5 ? baseColor : colors[Math.floor(Math.random() * colors.length)];

        // Công thức toán học của hình trái tim (lần này là phân tán, không phải đường viền)
        // Điều chỉnh để hạt bay ra từ tâm
        const t = (Math.PI * 2 / particleCount) * i;
        
        let velX = power * (16 * Math.pow(Math.sin(t), 3)) / 16;
        let velY = power * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
        
        // Đảo ngược trục Y để trái tim hướng lên
        velY *= -1;

        // Thêm một chút ngẫu nhiên để trông tự nhiên hơn
        velX += (Math.random() - 0.5) * 1.5;
        velY += (Math.random() - 0.5) * 1.5;

        particles.push(new Particle(x, y, 2, color, { x: velX, y: velY }));
    }
}


// Vòng lặp animation chính
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Hiệu ứng vệt mờ
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cập nhật và vẽ các hạt pháo hoa (sau khi nổ)
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        if (particle.alpha > 0) {
            particle.update();
        } else {
            particles.splice(i, 1);
        }
    }

    // Cập nhật và vẽ các "quả bom" pháo hoa đang bay lên
    for (let i = fireworkParticles.length - 1; i >= 0; i--) {
        const fwParticle = fireworkParticles[i];
        if (fwParticle.currentDistance >= fwParticle.distance || fwParticle.alpha <= 0) {
            // Đến đích hoặc đã mờ, thì nổ
            createHeartExplosion(fwParticle.endX, fwParticle.endY, fwParticle.color);
            fireworkParticles.splice(i, 1);
        } else {
            fwParticle.update();
        }
    }
}

// Hàm phóng một quả pháo hoa
function launchFirework() {
    const startX = canvas.width / 2; // Bắt đầu từ giữa dưới
    const startY = canvas.height;

    // Vị trí nổ ngẫu nhiên ở phần trên màn hình
    const endX = Math.random() * canvas.width * 0.6 + canvas.width * 0.2; // Từ 20% đến 80% chiều rộng
    const endY = Math.random() * canvas.height * 0.4 + canvas.height * 0.1; // Từ 10% đến 50% chiều cao

    const color = colors[Math.floor(Math.random() * colors.length)];
    fireworkParticles.push(new FireworkParticle(startX, startY, endX, endY, color));
}

// Bắt đầu vòng lặp animation
animate();

// Phóng pháo hoa ban đầu
launchFirework();

// Phóng pháo hoa mới sau mỗi 2-4 giây
setInterval(launchFirework, Math.random() * 2000 + 2000); // Ngẫu nhiên từ 2 đến 4 giây

// Xử lý khi thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
