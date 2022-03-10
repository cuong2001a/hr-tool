export const FORM_FIELD = [
  {
    name: 'id',
    hidden: true,
  },
  {
    name: 'fullname',
    placehoder: 'nameplace',
    rule: [
      {
        required: true,
        message: 'Vui lòng nhập họ và tên!',
      },
      {
        validator: (_, val) => {
          let message = 'Họ và tên chỉ có thể từ 3 đến 200 ký tự!';
          let check = false;
          if (val?.length > 3 && val?.length < 200) {
            check = true;
            message = '';
          }
          if (!val) {
            check = true;
            message = '';
          }
          return check ? Promise.resolve(message) : Promise.reject(message);
        },
      },
    ],
  },
  {
    name: 'username',
    placehoder: 'usernameplace',
    rule: [
      {
        required: true,
        message: 'Vui lòng nhập tên người dùng!',
      },
      {
        validator: (_, val) => {
          let message =
            'Tên người dùng phải viết liền không dấu và không có ký tự đặc biệt!';
          let check = false;
          if (!val?.includes(' ')) {
            check = true;
            message = '';
          }
          return check ? Promise.resolve(message) : Promise.reject(message);
        },
      },
    ],
  },
  {
    name: 'email',
    placehoder: 'emailplace',
    rule: [
      {
        required: true,
        message: 'Vui lòng nhập email!',
      },
      {
        type: 'email',
        message: 'Vui lòng nhập đúng định dạng email!',
      },
    ],
  },
];

export const STATUS_FIELD = ['Khóa', 'Hoạt động'];
