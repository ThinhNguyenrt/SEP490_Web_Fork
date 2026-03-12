# Tài khoản test chức năng Chat

## ✅ Đã sửa các lỗi:
1. **Navigation sai**: Recruiter login giờ đã đi đúng vào RecruiterHome
2. **Tin nhắn không đồng bộ**: Đã fix bằng cách dùng `messageRoomId` chung cho cả hai bên
3. **Role chỉ có 2 loại**: Hệ thống chỉ có `user` và `recruiter` (không có `company`)

## 🎯 Hướng dẫn test

### 1. Đăng nhập làm Ứng viên (User/Talent)
**Xem tin nhắn từ các công ty và nhà tuyển dụng**

| Email | Password | Tên hiển thị |
|-------|----------|--------------|
| user@gmail.com | user123 | User mặc định |
| nguyenvanan@gmail.com | 123456 | Nguyễn Văn An |
| tranthib@gmail.com | 123456 | Trần Thị Bình |
| lehoangminh@gmail.com | 123456 | Lê Hoàng Minh |
| phamdieu@gmail.com | 123456 | Phạm Thị Diệu |
| dangvanem@gmail.com | 123456 | Đặng Văn Em |
| vohuong@gmail.com | 123456 | Võ Thị Hương |
| hoangkhoa@gmail.com | 123456 | Hoàng Minh Khoa |

**Khi đăng nhập, bạn sẽ thấy:**
- Google Inc.
- FPT Software
- Microsoft Vietnam
- VNG Corporation
- Amazon Web Services
- Phạm Cường - HR Manager
- Trần Thu Hà - Talent Acquisition
- Nguyễn Minh Tuấn - Head of IT

---

### 2. Đăng nhập làm Công ty / Nhà tuyển dụng (Recruiter)
**Xem tin nhắn từ các ứng viên**

| Email | Password | Tên công ty/Recruiter |
|-------|----------|---------|
| google@company.com | 123456 | Google Inc. |
| fpt@company.com | 123456 | FPT Software |
| microsoft@company.com | 123456 | Microsoft Vietnam |
| vng@company.com | 123456 | VNG Corporation |
| aws@company.com | 123456 | Amazon Web Services |
| moderator@gmail.com | moderator123 | Company mặc định |
| recruiter@gmail.com | recruiter123 | Recruiter mặc định |
| phamcuong@recruiter.com | 123456 | Phạm Cường - HR Manager |
| thuha@recruiter.com | 123456 | Trần Thu Hà - Talent Acquisition |
| minhtuan@recruiter.com | 123456 | Nguyễn Minh Tuấn - Head of IT |

**Khi đăng nhập, bạn sẽ thấy:**
- Nguyễn Văn An - Frontend Developer
- Trần Thị Bình - Full Stack Developer
- Lê Hoàng Minh - UI/UX Designer
- Phạm Thị Diệu - Backend Developer
- Đặng Văn Em - Mobile Developer
- Võ Thị Hương - Data Analyst
- Hoàng Minh Khoa - DevOps Engineer

---

## 💬 Tin nhắn mẫu có sẵn

Một số conversations đã có sẵn tin nhắn để test (sẽ tự động load khi vào trang chat lần đầu):
- **Google Inc. ↔ Nguyễn Văn An** (messageRoomId: 1001) - 4 tin nhắn
- **FPT Software ↔ Trần Thị Bình** (messageRoomId: 1002) - 3 tin nhắn

**Tin nhắn được đồng bộ hai chiều:**
- Khi user gửi tin nhắn cho company → company sẽ nhận được
- Khi company trả lời → user sẽ thấy ngay lập tức
- Tất cả dùng chung messageRoomId để đảm bảo đồng bộ

---

## 🔄 Cách test đầy đủ

**QUAN TRỌNG: Trước khi test, hãy xóa localStorage cũ:**
1. Mở Developer Tools (F12)
2. Vào tab **Console**
3. Gõ lệnh: `localStorage.clear()`
4. Refresh trang (F5)

**Bước test:**
1. Đăng nhập bằng tài khoản **user@gmail.com** / **user123**
2. Vào phần **Tin nhắn**
3. Chọn một conversation (ví dụ: Google Inc.)
4. Xem tin nhắn có sẵn và gửi tin nhắn mới
5. Đăng xuất
6. Đăng nhập bằng tài khoản **google@company.com** / **123456**
7. Vào phần **Tin nhắn**
8. Xem tin nhắn từ phía công ty - **Bạn sẽ thấy tin nhắn đồng bộ!**

**Test chat giữa Hoàng Khoa và AWS:**
1. Đăng nhập **hoangkhoa@gmail.com** / **123456**
2. Vào **Tin nhắn** → Chọn **Amazon Web Services**
3. Gửi tin nhắn: "Xin chào, em muốn ứng tuyển vị trí AWS DevOps"
4. Đăng xuất
5. Đăng nhập **aws@company.com** / **123456**  
6. Vào **Tin nhắn** → Chọn **Hoàng Minh Khoa**
7. **Bạn sẽ thấy tin nhắn từ Hoàng Khoa!** ✅

---

## 📝 Ghi chú

- Tất cả tin nhắn được lưu trong **localStorage** với key `chat_messages_room_{messageRoomId}`
- Mỗi user chỉ thấy tin nhắn phù hợp với role của họ
- Navigation về Home tự động điều hướng đúng trang (TalentHome hoặc RecruiterHome)
- **Tin nhắn đã được đồng bộ hai chiều**: User và Company/Recruiter dùng chung messageRoomId

## 🔧 Cơ chế hoạt động

### Mapping messageRoomId giữa các bên:
```
Hoàng Minh Khoa (user) ↔ Amazon Web Services (company) → Room 1008
Nguyễn Văn An (user) ↔ Google Inc. (company) → Room 1001
Trần Thị Bình (user) ↔ FPT Software (company) → Room 1002
Lê Hoàng Minh (user) ↔ Phạm Cường (recruiter) → Room 1003
Phạm Thị Diệu (user) ↔ Microsoft Vietnam (company) → Room 1004
Đặng Văn Em (user) ↔ Trần Thu Hà (recruiter) → Room 1005
Võ Thị Hương (user) ↔ VNG Corporation (company) → Room 1006
```

Khi một bên gửi tin nhắn, tin nhắn được lưu vào localStorage với key là messageRoomId. Bên kia khi mở conversation cũng dùng cùng messageRoomId nên sẽ thấy tin nhắn đồng bộ!
