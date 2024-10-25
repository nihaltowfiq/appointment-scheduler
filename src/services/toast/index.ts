import { Bounce, toast, ToastOptions } from "react-toastify";

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

export const successToast = ({ message, ...rest }: ToastType) => {
  toast.success(message, {
    ...toastOptions,
    ...rest,
  });
};

export const errorToast = ({ message, ...rest }: ToastType) => {
  toast.error(message, {
    ...toastOptions,
    ...rest,
  });
};

type ToastType = ToastOptions & {
  message: string;
};
