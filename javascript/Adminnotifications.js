function loadNotifications() {
            const container = document.getElementById('notification-container');
            const logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');

            // ถ้าไม่มีประวัติการปิดสนามเลย
            if (logs.length === 0) {
                container.innerHTML = '<p class="text-center text-gray-500 mt-10">ยังไม่มีการแจ้งเตือนใหม่</p>';
                return;
            }

            container.innerHTML = ''; // ล้างข้อมูลเดิมออกก่อน

            // นำข้อมูลมาวนลูปสร้าง (reverse เพื่อให้อันล่าสุดอยู่ด้านบน)
            logs.reverse().forEach((log, index) => {
                // จำลองเวลา: อันแรกล่าสุดให้ขึ้น "เมื่อสักครู่" อันถัดไปขึ้น "1วันที่แล้ว"
                const timeText = index === 0 ? "เมื่อสักครู่" : "1วันที่แล้ว";

                const logHTML = `
                    <div class="bg-white rounded-[24px] p-6 shadow-sm flex items-center gap-6 border border-white/50 transition-all hover:shadow-md">
                        <div class="w-20 h-20 flex items-center justify-center flex-shrink-0">
                            <img src="https://cdn-icons-png.flaticon.com/512/1997/1997888.png" alt="announcement" class="w-16 h-16 object-contain">
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-2xl text-black">ประกาศปิดปรับปรุงสนาม</h3>
                            <p class="text-base text-gray-500 leading-snug">
                                ประกาศปิดปรับปรุง ${log.court} ชั่วคราวในวันที่ ${log.date} เนื่องจาก ${log.reason} ขออภัยในความไม่สะดวก
                            </p>
                            <p class="text-sm text-u-purple mt-1 font-medium">${timeText}</p>
                        </div>
                    </div>
                `;
                container.innerHTML += logHTML;
            });
        }

        // โหลดข้อมูลเมื่อเปิดหน้าเว็บ
        window.onload = loadNotifications;