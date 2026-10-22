# Trang chủ, ảnh Blog và Sự kiện

## Sử dụng

- Vào `/admin/home`, tìm **Blog / Sự kiện trên trang chủ**, chọn **Sự kiện** hoặc **Blog** rồi nhấn **Save All Changes**.
- Khi chưa có lựa chọn trong dữ liệu cũ, trang chủ hiển thị **Sự kiện**. Mỗi nguồn có tiêu đề, nhãn và nút xem tất cả riêng; chuyển nguồn không xóa nội dung đã nhập cho nguồn còn lại.
- Trang chủ lấy ba bài mới nhất theo thời điểm tạo. Nút xem tất cả và liên kết từng bài dẫn đến đúng mục đã chọn. Nhãn mặc định hỗ trợ tiếng Việt và tiếng Anh.
- Trong trình soạn thảo Blog hoặc Sự kiện, đặt con trỏ vào nội dung rồi nhấn **Chèn ảnh**. Có thể tải một/nhiều ảnh từ thiết bị hoặc chèn đường dẫn ảnh, kèm mô tả ảnh tùy chọn. Mỗi ảnh tải lên tối đa 10 MB.
- Trong lúc tải ảnh, nội dung tạm khóa và nút đăng bài bị vô hiệu hóa. Khi tải thất bại, thông báo lỗi xuất hiện và nội dung hiện có được giữ lại.

## Hiển thị ảnh

- Danh sách Blog có hai cột trên máy tính; ảnh dùng khung 4:3 lớn hơn.
- Danh sách Sự kiện dành nhiều chiều rộng hơn cho ảnh.
- Ảnh đầu bài Sự kiện có vùng hiển thị lớn hơn, giữ trọn ảnh; khi không có thư viện ảnh, ưu tiên ảnh gốc.
- Ảnh đầu bài Blog và vùng nội dung Blog/Sự kiện được mở rộng. Ảnh trong nội dung co theo chiều rộng bài viết, giữ tỷ lệ và vừa màn hình điện thoại.

## Kiểm tra

- `npm run build` kiểm tra bản production và TypeScript.
- `scripts/test-home-content.cjs` kiểm tra lưu lựa chọn nguồn, giữ nguyên dữ liệu phần khác, giữ riêng nhãn Blog/Sự kiện, từ chối nguồn không hợp lệ, lưu ảnh giữa hai đoạn văn và hiển thị trên trang công khai.
- Chạy script trên máy chủ thử cục bộ với MongoDB riêng đã có dữ liệu mẫu. Không dùng máy chủ cục bộ đang kết nối cơ sở dữ liệu production. API ghi bài có chức năng sao lưu vào `data/`; cần khôi phục các tệp dữ liệu mẫu sau khi thử.
- Kiểm tra giao diện trực tiếp: chuyển hai nguồn và lưu; xem bản Việt/Anh; chèn ảnh đầu/giữa/cuối nội dung; hoàn tác/làm lại; tải ảnh thật lên Cloudinary; dán HTML có ảnh nhúng; lỗi đường dẫn/tệp không hợp lệ; khóa nút đăng khi tải ảnh.
- Kiểm tra ở chiều rộng 390 px: trang chủ, danh sách Blog/Sự kiện, chi tiết Blog/Sự kiện không tràn ngang.
- ESLint so với bản gốc: không thêm lỗi mới; các tệp đã sửa còn các lỗi có sẵn (chủ yếu `any` và ký tự trích dẫn trong JSX).
