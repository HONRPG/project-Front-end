 window.onload = function() {
            // ดึงข้อมูลผู้ใช้จากการล็อคอิน (คีย์ up_badminton_user)
            let savedData = localStorage.getItem('up_badminton_user');
            
            if(savedData) {
                const user = JSON.parse(savedData);
                
                // ตรวจสอบว่าใช่อีเมล admin@up.ac.th หรือไม่
                if(user.email === 'admin@up.ac.th') {
                    // กำหนดค่าต่างๆ ลงในฟอร์ม (ถ้าตอนล็อคอินไม่ได้ใส่ชื่อมา ให้แสดงค่า Default)
                    const adminName = user.name || "ผู้ดูแลระบบ ศูนย์กีฬา";
                    const staffId = user.staffId || "EMP-ADMIN";

                    document.getElementById('display-name').textContent = adminName;
                    document.getElementById('name-display').textContent = adminName;
                    document.getElementById('input-email').textContent = user.email;
                    document.getElementById('display-staff-id').textContent = staffId;
                    document.getElementById('input-staff-id').textContent = staffId;

                    if(user.phone) {
                        document.getElementById('phone-input').value = user.phone;
                    }
                } else {
                    // ถ้าเข้าสู่ระบบด้วยอีเมลอื่น (นิสิตทั่วไป) ให้เด้งกลับไปหน้าโปรไฟล์ธรรมดา
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่มีสิทธิ์เข้าถึง',
                        text: 'หน้านี้สำหรับผู้ดูแลระบบเท่านั้น',
                        confirmButtonColor: '#6C2B97'
                    }).then(() => {
                        window.location.href = 'profile.html'; 
                    });
                }
            } else {
                // ถ้ายังไม่ได้ล็อคอินเลย ให้กลับไปหน้าล็อคอิน
                window.location.href = 'login.html';
            }
        };

        function saveProfile() {
            const phone = document.getElementById('phone-input').value;
            
            if(phone.length < 9) {
                Swal.fire({ icon: 'error', title: 'เบอร์โทรไม่ถูกต้อง', text: 'กรุณากรอกเบอร์โทรศัพท์ให้ครบถ้วน', confirmButtonColor: '#6C2B97' });
                return;
            }

            const savedData = localStorage.getItem('up_badminton_user');
            if(savedData) {
                let user = JSON.parse(savedData);
                user.phone = phone; // อัปเดตเบอร์โทรของ Admin ลงในคีย์เดิม
                localStorage.setItem('up_badminton_user', JSON.stringify(user));

                Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', text: 'อัปเดตเบอร์โทรศัพท์เรียบร้อยแล้ว', confirmButtonColor: '#6C2B97', timer: 2000 });
            }
        }

        function logout() {
            Swal.fire({
                title: 'ยืนยันการออกจากระบบ?', text: "คุณต้องการออกจากระบบใช่หรือไม่", icon: 'question',
                showCancelButton: true, confirmButtonColor: '#6C2B97', cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่, ออกจากระบบ', cancelButtonText: 'ยกเลิก'
            }).then((result) => {
                if (result.isConfirmed) {
                    // เคลียร์ข้อมูลล็อคอินออกจากระบบ
                    localStorage.removeItem('up_badminton_user');
                    window.location.href = 'index.html'; 
                }
            })
        }