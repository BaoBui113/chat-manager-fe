import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .required("Tên người dùng là bắt buộc")
    .min(2, "Tên người dùng phải có ít nhất 2 ký tự")
    .max(50, "Tên người dùng không được quá 50 ký tự"),
  email: yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số"
    ),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
