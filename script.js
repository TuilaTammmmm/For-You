document.addEventListener('DOMContentLoaded', () => {
    const heartsContainer = document.querySelector('.hearts-container');
    const timerElement = document.getElementById('timer');

    // ==========================================================
    // == BẠN CHỈNH NGÀY KỶ NIỆM CỦA MÌNH Ở ĐÂY (Năm, Tháng-1, Ngày) ==
    // Ví dụ: 20 tháng 10 năm 2024 -> new Date(2024, 9, 20)
    // (Tháng trong JavaScript bắt đầu từ 0 (tháng 1) đến 11 (tháng 12))
    const startDate = new Date(2024, 9, 20, 0, 0, 0); // 00:00 ngày 20/10/2024
    // ==========================================================

    // Danh sách các màu "lá tim"
    const colors = [
        '#ffc0cb', '#ff69b4', '#ff1493', '#e0115f', 
        '#d8bfd8', '#fa8072', '#ffb6c1', '#ffa07a'
    ];

    const totalHearts = 500; // Tổng số "lá tim"
    let heartCount = 0;

    // 1. Hàm tạo ra một trái tim nhỏ
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');

        // Công thức toán học để tạo điểm ngẫu nhiên BÊN TRONG hình trái tim
        // (Phương trình tham số của đường cong trái tim)
        const t = Math.random() * 2 * Math.PI;
        // Phân phối điểm ngẫu nhiên bên trong hình
        const r = Math.pow(Math.random(), 0.5); 
        const scale = 18; // Kích thước tổng thể của trái tim lớn

        const x = r * scale * 16 * Math.pow(Math.sin(t), 3);
        const y = -r * scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        // Định vị tâm của trái tim lớn
        // (300px là tâm của container 600px, 180px là chiều cao từ trên xuống)
        const centerX = 300; 
        const centerY = 180; 

        heart.style.left = (centerX + x) + 'px';
        heart.style.top = (centerY + y) + 'px';

        // Chọn một màu ngẫu nhiên
        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.setProperty('--heart-color', color);

        heartsContainer.appendChild(heart);
    }

    // 2. Hàm cập nhật đồng hồ đếm
    function updateTimer() {
        const now = new Date();
        const diff = now - startDate; // Khoảng cách thời gian (miligiây)

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Hiển thị ra màn hình
        timerElement.textContent = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
    }

    // 3. Bắt đầu chạy
    
    // Gọi hàm tạo tim lặp đi lặp lại để tạo hiệu ứng "tự tạo dần"
    const heartInterval = setInterval(() => {
        createHeart();
        heartCount++;
        if (heartCount >= totalHearts) {
            clearInterval(heartInterval); // Dừng tạo khi đủ số lượng
        }
    }, 20); // Tạo 1 tim mới mỗi 20 miligiây

    // Chạy đồng hồ
    updateTimer(); // Chạy lần đầu ngay lập tức
    setInterval(updateTimer, 1000); // Cập nhật mỗi giây
});
