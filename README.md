# hr-tool-fe

/components: Chứa các components dùng chung trong cả dự án

/hooks : chứa các hooks dùng chung

/layouts : layout chính của dự án

/assets : chứa các tài nguyên dự án như ảnh,logo,scss.

/assets/scss: lưu file scss.

/api : tất cả config liên quan đến call api.

/utils : chứa các function được tái sử dụng nhiều lần.

/pages : chứa tất cả component (pages) trong dự án.

/constants : chứa tất cả các config, settings, biến tĩnh.

/translation: chứa tất cả các thông tin liên quan đến đa ngôn ngữ.

/app/store: config store of redux toolkit.

# rules:

- Khai báo component sử dụng general function
- Những dữ liệu cố định đưa ra file constant
- Các router khai báo tại file App
- Các text có đa ngôn ngữ đẩy vào trong src/translation/locales/...
- Cách sử dụng scss: tạo file scss trong thư mục asset/scss sau đó import vào trong file app.scss
- Đặt tên class theo BEM
