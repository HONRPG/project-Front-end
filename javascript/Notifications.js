 function loadNotifications() {
            const container = document.getElementById('notification-container');
            container.innerHTML = ''; // ล้างค่าเดิม
            let hasContent = false;

            // 1. ตรวจสอบสถานะการจองคิวของผู้ใช้งาน
            const user = JSON.parse(localStorage.getItem('up_badminton_user'));
            const queues = JSON.parse(localStorage.getItem('up_badminton_queues')) || [];
            
            if (user && user.name) {
                const userName = user.name.toLowerCase();
                let userQueue = null;
                let queueIndex = -1;

                // หาคิวที่ผู้ใช้ลงชื่อไว้
                for (let i = 0; i < queues.length; i++) {
                    if (queues[i].players.some(p => p && p.toLowerCase() === userName)) {
                        userQueue = queues[i];
                        queueIndex = i;
                        break;
                    }
                }

                if (userQueue) {
                    hasContent = true;
                    let title, desc, iconBg, iconSvg;

                    // ถ้าอยู่ใน 4 คิวแรก = ได้เล่นแล้ว
                    if (queueIndex < 4) {
                        title = "ถึงคิวของคุณแล้ว";
                        desc = `เชิญเข้าใช้บริการสนามได้เลย (คุณอยู่คิวที่ ${userQueue.id})`;
                        iconBg = "bg-[#58E36D]"; // สีเขียว
                        iconSvg = `<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />`;
                    } else {
                        // ถ้าคิวมากกว่า 4 = รอสนาม
                        title = "จองคิวสำเร็จ";
                        desc = `คุณอยู่ในคิวที่ ${userQueue.id} โปรดรอจนกว่าจะถึงคิวของคุณ`;
                        iconBg = "bg-blue-400"; // สีฟ้า
                        iconSvg = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />`;
                    }

                    container.innerHTML += `
                        <div class="bg-white rounded-[24px] p-6 shadow-sm flex items-center gap-6 border border-white/50 animate-fade-in">
                            <div class="w-20 h-20 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="white" class="w-10 h-10">
                                    ${iconSvg}
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-bold text-2xl text-black">${title}</h3>
                                <p class="text-base text-gray-500">${desc}</p>
                                <p class="text-sm text-u-purple mt-1 font-medium">อัปเดตล่าสุด</p>
                            </div>
                        </div>
                    `;
                }
            }

            // 2. โหลดประกาศปิดสนามจากแอดมิน
            const adminLogs = JSON.parse(localStorage.getItem('admin_logs')) || [];
            if (adminLogs.length > 0) {
                hasContent = true;
                // reverse เพื่อให้อันล่าสุดอยู่บน
                adminLogs.reverse().forEach((log, index) => {
                    const timeText = index === 0 ? "เมื่อสักครู่" : "ก่อนหน้านี้";
                    container.innerHTML += `
                        <div class="bg-white rounded-[24px] p-6 shadow-sm flex items-center gap-6 border border-white/50 animate-fade-in" style="animation-delay: 0.1s;">
                            <div class="w-20 h-20 flex items-center justify-center flex-shrink-0">
                                <img src="https://cdn-icons-png.flaticon.com/512/1997/1997888.png" alt="announcement" class="w-16 h-16 object-contain">
                            </div>
                            <div class="flex-1">
                                <h3 class="font-bold text-2xl text-black">ประกาศปิดปรับปรุงสนาม</h3>
                                <p class="text-base text-gray-500 leading-snug">สนามแบดมินตัน อาคารสงวนเสริมศรี จะปิดปรับปรุงชั่วคราว <span class="font-bold text-gray-700">${log.court}</span> ในวันที่ <span class="font-bold text-gray-700">${log.date}</span> เนื่องจาก ${log.reason} ขออภัยในความไม่สะดวก</p>
                                <p class="text-sm text-u-purple mt-1 font-medium">${timeText}</p>
                            </div>
                        </div>
                    `;
                });
            }

            // ถ้าไม่มีการแจ้งเตือนอะไรเลย
            if (!hasContent) {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <p class="text-gray-400 text-lg">ยังไม่มีการแจ้งเตือนในขณะนี้</p>
                    </div>`;
            }
        }

window.onload = loadNotifications;