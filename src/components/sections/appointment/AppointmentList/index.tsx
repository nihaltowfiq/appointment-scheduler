'use client';

import {
  ChevronDownIcon,
  SearchIcon,
  VerticalDotsIcon,
} from '@/components/icons';
import { Appointment } from '@/libs/types';
import {
  getAppointments,
  updateAppointmentStatus,
} from '@/services/firebase/appointment';
import { errorToast } from '@/services/toast';
import { capitalize, formatDateTime } from '@/utils';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { getCookie } from 'cookies-next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { statusColor, statusOptions } from './constants';

export function AppointmentList() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Appointment[]>([]);
  const [rowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const uid = getCookie('uid');
  const hasSearchFilter = Boolean(filterValue);

  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {
    try {
      setLoading(true);
      const result = (await getAppointments()) as Appointment[];
      if (result) setData(result);
    } catch ({ message }: any) {
      errorToast({ message });
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = useMemo(() => {
    let filteredUsers = [...data];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      const now = new Date();

      filteredUsers = filteredUsers.filter((user) => {
        const itemDateTime = new Date(`${user.date}T${user.time}`);

        if (Array.from(statusFilter).includes('past')) {
          return itemDateTime < now;
        } else if (Array.from(statusFilter).includes('upcoming')) {
          return itemDateTime >= now;
        }

        return true;
      });
    }

    return filteredUsers;
  }, [data, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const updateAppointment = async (
    id: string,
    status: Appointment['status']
  ) => {
    try {
      setLoading(true);
      await updateAppointmentStatus(id, status);
      getAllUsers();
    } catch ({ message }: any) {
      errorToast({ message });
    } finally {
      setLoading(false);
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between mt-4 gap-4">
        <div className="w-2/3">
          <Input
            isClearable
            className="w-full"
            placeholder="Search by title..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="w-1/3 flex gap-3">
          <Dropdown className="w-full">
            <DropdownTrigger className="flex">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="flat"
                className="w-full"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={(e) => setStatusFilter(e as string)}
            >
              {statusOptions.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {capitalize(status.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }, [filterValue, data.length, onSearchChange, hasSearchFilter, statusFilter]);

  const bottomContent = useMemo(() => {
    if (!data.length) return null;

    return (
      <div className="py-2 px-2 flex justify-evenly items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [items.length, page, pages, hasSearchFilter]);

  const renderCell = useCallback(
    (appointment: Appointment, columnKey: string) => {
      const cellValue = appointment[columnKey as keyof Appointment] as string;
      const isIssuedByMe = appointment.scheduler.uid == uid;

      const person =
        appointment.scheduler.uid == uid
          ? appointment.receiver
          : appointment.scheduler;

      switch (columnKey) {
        case 'details':
          return (
            <div className="flex flex-col">
              <h5 className="text-medium">{appointment.title}</h5>
              <p className="text-xs text-default-500 leading-1">
                {appointment.description}
              </p>
              <p className="text-sm">
                {formatDateTime(appointment.time, appointment.date)}
              </p>
              <p className="text-default-500">
                Issued by:{' '}
                <span className="text-default-800 font-medium">
                  {appointment.scheduler.name}
                </span>
              </p>
            </div>
          );
        case 'user':
          return (
            <div className="flex flex-col">
              <p className="text-bold">{person.name}</p>
              <p className="text-bold text-xs text-default-500">
                {person.username}
              </p>
              <p className="text-bold text-small text-default-500">
                {person.occupation}
              </p>
            </div>
          );
        case 'status':
          return (
            <Chip
              size="sm"
              variant="flat"
              color={statusColor[appointment.status] as any}
              className="capitalize"
            >
              {appointment.status}
            </Chip>
          );
        case 'actions':
          return (
            <Dropdown className="min-w-fit" placement="bottom">
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-600" />
                </Button>
              </DropdownTrigger>

              {!isIssuedByMe && appointment.status === 'pending' && (
                <DropdownMenu className="w-fit">
                  <DropdownItem
                    color="success"
                    onClick={() =>
                      updateAppointment(appointment.id, 'accepted')
                    }
                  >
                    Accept
                  </DropdownItem>
                  <DropdownItem
                    color="danger"
                    onClick={() =>
                      updateAppointment(appointment.id, 'declined')
                    }
                  >
                    Decline
                  </DropdownItem>
                </DropdownMenu>
              )}
              {isIssuedByMe && appointment.status !== 'cancelled' && (
                <DropdownMenu className="w-fit">
                  <DropdownItem
                    color="danger"
                    onClick={() =>
                      updateAppointment(appointment.id, 'cancelled')
                    }
                  >
                    Cancel
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <Table
      isStriped
      isHeaderSticky
      aria-label="Table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[687px]',
      }}
      topContent={topContent}
      topContentPlacement="outside"
      className="w-full lg:max-w-[768px] mx-auto"
    >
      <TableHeader>
        <TableColumn key="details">Details</TableColumn>
        <TableColumn key="user">User</TableColumn>
        <TableColumn key="status">Status</TableColumn>
        <TableColumn key="actions">Actions</TableColumn>
      </TableHeader>
      <TableBody
        items={items}
        isLoading={isLoading}
        loadingState={isLoading ? 'loading' : 'idle'}
        loadingContent={<Spinner />}
        emptyContent={'No users found'}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
