import * as yup from 'yup';

// schema pour validate les champs inputs email, password
export const userSchema = yup.object().shape({
  userName: yup
    .string()
    .email("Email invalid")
    .required("Please enter your email"),
  password: yup
    .string()
    .required("Please enter your password")
    .min(6, 'Password has minimum 6 characters ')
    .max(20, 'Password has minimum 20 characters ')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/, " Password must be between 6 and 20 characters, 1 uppercase, 1 lowercase, 1 special character (@$!%*#?&.)")
})