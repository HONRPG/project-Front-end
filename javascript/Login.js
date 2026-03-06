const masterAdmin = {
            email: "admin@up.ac.th",
            password: "admin123",
            name: "ผู้ดูแลระบบ",
            role: "admin"
        };

        function togglePassword() {
            const passwordInput = document.getElementById('passwordInput');
            const eyeOpen = document.getElementById('eyeOpen');
            const eyeClosed = document.getElementById('eyeClosed');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');
            } else {
                passwordInput.type = 'password';
                eyeOpen.classList.remove('hidden');
                eyeClosed.classList.add('hidden');
            }
        }

        function handleLogin(event) {
            event.preventDefault();

            const emailInput = document.getElementById('emailInput').value.trim().toLowerCase();
            const passwordInput = document.getElementById('passwordInput').value.trim();

            if (emailInput === "" || passwordInput === "") {
                Swal.fire({ icon: 'warning', title: 'กรุณากรอกข้อมูล', text: 'กรุณาใส่อีเมลและรหัสผ่าน', confirmButtonColor: '#6C2B97' });
                return;
            }

            // --- 2. ดึงฐานข้อมูลบัญชีทั้งหมด ---
            const allAccounts = JSON.parse(localStorage.getItem('up_badminton_accounts')) || [];

            // 3. ตรวจสอบบัญชี (เช็คทั้ง Admin และ User ทั่วไป)
            let foundUser = null;

            // เช็คว่าเป็น Admin หลักหรือไม่
            if (emailInput === masterAdmin.email && passwordInput === masterAdmin.password) {
                foundUser = masterAdmin;
            } else {
                // ค้นหาในรายการที่สมัครเข้ามา
                foundUser = allAccounts.find(acc => acc.email === emailInput && acc.password === passwordInput);
            }

            // 4. ตรวจสอบผลลัพธ์
            if (foundUser) {
                // บันทึกสถานะ "ผู้ใช้ปัจจุบันที่กำลัง Login"
                localStorage.setItem('up_badminton_user', JSON.stringify(foundUser));

                Swal.fire({
                    icon: 'success',
                    title: 'เข้าสู่ระบบสำเร็จ!',
                    text: `สวัสดีคุณ ${foundUser.name}`,
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // แยกหน้าตาม Role
                    if (foundUser.role === 'admin') {
                        window.location.href = 'AdminMainmenu.html';
                    } else {
                        window.location.href = 'Main menu.html';
                    }
                });
            } else {
                // กรณีไม่พบข้อมูล
                Swal.fire({
                    icon: 'error',
                    title: 'เข้าสู่ระบบไม่สำเร็จ',
                    text: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
                    confirmButtonColor: '#6C2B97'
                });
            }
        }
window.onload = renderUI;