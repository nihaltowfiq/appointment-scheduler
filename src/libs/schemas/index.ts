import * as Yup from 'yup';

export const signInSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export const signUpSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
