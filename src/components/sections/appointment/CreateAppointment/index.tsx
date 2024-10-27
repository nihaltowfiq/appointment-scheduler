'use client';

import { appointmentSchema } from '@/libs/schemas';
import { AppointmentFormData, User } from '@/libs/types';
import { db } from '@/services/firebase';
import { errorToast, successToast } from '@/services/toast';
import { getAppState } from '@/store/features';
import { formatDate, generateUID } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { parseDate, parseTime } from '@internationalized/date';
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  TimeInput,
} from '@nextui-org/react';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

export function CreateAppointment({ user, isOpen, onOpenChange }: Props) {
  const [isLoading, setLoading] = useState(false);

  const scheduler = useSelector(getAppState);
  const defaultValues = {
    date: '',
    description: '',
    time: '',
    title: '',
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues,
  });

  const onSubmit = async (data: AppointmentFormData) => {
    const { title, description, date, time } = data;
    setLoading(true);

    try {
      const appointmentData = {
        id: generateUID(),
        title,
        description,
        date,
        time,
        scheduler,
        receiver: user, // Should be selected by user
        status: 'pending',
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      successToast({ message: 'Scheduled an appointment!' });
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ message }: any) {
      errorToast({ message });
    } finally {
      setLoading(false);
    }
  };

  // const formatter = useDateFormatter({ dateStyle: 'short', timeStyle: 'long' });

  const handleClose = () => {
    onOpenChange();
    reset({ ...defaultValues });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} placement="top-center">
      <ModalContent>
        {(_) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Appointment
            </ModalHeader>
            <ModalBody className="mb-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <Input
                  fullWidth
                  variant="bordered"
                  label="Title"
                  placeholder="Enter a title"
                  {...register('title')}
                  isInvalid={!!errors.title}
                  errorMessage={errors.title?.message}
                />
                <Input
                  fullWidth
                  variant="bordered"
                  label="Description"
                  placeholder="Enter a description"
                  {...register('description')}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description?.message}
                />
                <DatePicker
                  fullWidth
                  variant="bordered"
                  className="w-full"
                  label="Date"
                  value={
                    watch('date') ? parseDate(formatDate(watch('date'))) : null
                  }
                  onChange={(e) => {
                    setValue('date', `${e.year}-${e.month}-${e.day}`);
                  }}
                  isInvalid={!!errors.date}
                  errorMessage={errors.date?.message}
                />

                <TimeInput
                  fullWidth
                  hideTimeZone
                  label="Time"
                  variant="bordered"
                  hourCycle={12}
                  value={watch('time') ? parseTime(watch('time')) : null}
                  onChange={(e) => {
                    setValue('time', e.toString());
                  }}
                  isInvalid={!!errors.time}
                  errorMessage={errors.time?.message}
                />

                <Button
                  fullWidth
                  type="submit"
                  color="primary"
                  variant="solid"
                  isLoading={isLoading}
                >
                  Submit
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

type Props = {
  user: User | null;
  isOpen: boolean;
  onOpenChange: () => void;
};
