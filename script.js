const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

// Lớp Hạt (Particle)
class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1; // Độ mờ
        this.friction = 0.98; // Ma sát làm chậm lại
        this.gravity = 0.05; // Trọng lực kéo xuống
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity; // Hạt rơi xuống
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.015; // Mờ dần
        this.draw();
    }
}

// Hàm tạo vụ nổ hình trái tim
function createHeartExplosion(x, y) {
    const particleCount = 150; // Số lượng hạt
    const power = 3; // Sức nổ
    const color = 'hsl(0, 100%, 70%)'; // Màu đỏ hồng

    for (let i = 0; i < particleCount; i++) {
        // Công thức toán học của hình trái tim
        const t = (Math.PI / (particleCount / 2)) * i;
        const velX = power * 1.5 * Math.pow(Math.sin(t), 3);
        const velY = power * -(1.3 * Math.cos(t) - 0.5 * Math.cos(2 * t) - 0.2 * Math.cos(3 * t) - 0.1 * Math.cos(4 * t));
        
        particles.push(new Particle(x, y, color, { x: velX, y: velY }));
    }
}

// Vòng lặp animation (vẽ liên tục)
function animate() {
    requestAnimationFrame(animate);
    // Tạo nền mờ dần (hiệu ứng vệt mờ)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        if (particle.alpha > 0) {
            particle.update();
        } else {
            particles.splice(index, 1); // Xóa hạt đã mờ
        }
    });
}

// Bắn một quả pháo hoa ở vị trí ngẫu nhiên
function launchFirework() {
    const x = Math.random() * canvas.width;
    // Bắn ở nửa trên màn hình
    const y = (Math.random() * canvas.height / 2) + (canvas.height / 4); 
    createHeartExplosion(x, y);
}

// Bắn quả đầu tiên
launchFirework();

// Bắn pháo hoa mới sau mỗi 3 giây
setInterval(launchFirework, 3000);


animate(); // Bắt đầu vòng lặp

// Xử lý khi thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
