window.onload = function() {
            // Mockup Data ถ้าไม่มีใน LocalStorage เพื่อให้เห็นภาพ
            // localStorage.setItem('up_badminton_user', JSON.stringify({name: "ธนาธร จึงรุ่งเรืองกิจ", email: "66000001@up.ac.th", phone: "0812345678"}));

            const savedData = localStorage.getItem('up_badminton_user');
            if(savedData) {
                const user = JSON.parse(savedData);
                
                document.getElementById('display-name').textContent = user.name;
                
                // แก้ไข 3: เปลี่ยนจาก .value เป็น .textContent เพราะเป็น div แล้ว
                document.getElementById('name-display').textContent = user.name;
                
                document.getElementById('input-email').textContent = user.email;
                
                const studentId = user.email.split('@')[0];
                document.getElementById('display-student-id').textContent = studentId;
                document.getElementById('input-student-id').textContent = studentId;

                if(user.phone) {
                    document.getElementById('phone-input').value = user.phone;
                }
            }
        };

        function saveProfile() {
            // แก้ไข 4: ตัด Logic การดึงค่า Name ออก เพราะไม่ได้แก้ไขแล้ว
            const phone = document.getElementById('phone-input').value;
            
            // ลบการตรวจสอบชื่อว่าง (if name trim) ออก
            if(phone.length < 9) {
                Swal.fire({ icon: 'error', title: 'เบอร์โทรไม่ถูกต้อง', text: 'กรุณากรอกเบอร์โทรศัพท์ให้ครบถ้วน', confirmButtonColor: '#6C2B97' });
                return;
            }

            const savedData = localStorage.getItem('up_badminton_user');
            let user = savedData ? JSON.parse(savedData) : {};
            
            // แก้ไข 5: ไม่ต้องอัปเดต user.name = name; แล้ว
            user.phone = phone;
            
            localStorage.setItem('up_badminton_user', JSON.stringify(user));

            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', text: 'อัปเดตเบอร์โทรศัพท์เรียบร้อยแล้ว', confirmButtonColor: '#6C2B97', timer: 2000 });
        }

        function logout() {
            Swal.fire({
                title: 'ยืนยันการออกจากระบบ?', text: "คุณต้องการออกจากระบบใช่หรือไม่", icon: 'question',
                showCancelButton: true, confirmButtonColor: '#6C2B97', cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่, ออกจากระบบ', cancelButtonText: 'ยกเลิก'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'login.html'; 
                }
            })
        }
        