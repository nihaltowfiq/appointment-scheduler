'use client';

import { db } from '@/services/firebase';
import { errorToast } from '@/services/toast';
import {
  Button,
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
  User,
} from '@nextui-org/react';
import { collection, getDocs, query } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { columns } from './constants';
import { SearchIcon } from './SearchIcon';
import { VerticalDotsIcon } from './VerticalDotsIcon';

export function UsersList() {
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [rowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState('');

  const [page, setPage] = useState(1);

  useEffect(() => {
    async function getAllUsers() {
      try {
        setLoading(true);
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef);
        const querySnapshot = await getDocs(userQuery);
        setUsers(querySnapshot.docs.map((doc) => doc.data()));
      } catch ({ message }: any) {
        errorToast({ message });
      } finally {
        setLoading(false);
      }
    }
    getAllUsers();
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [users, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // const sortedItems = useMemo(() => {
  //   return [...items].sort((a, b) => {
  //     const first = a[sortDescriptor.column];
  //     const second = b[sortDescriptor.column];
  //     const cmp = first < second ? -1 : first > second ? 1 : 0;

  //     return sortDescriptor.direction === 'descending' ? -cmp : cmp;
  //   });
  // }, [sortDescriptor, items]);

  const renderCell = useCallback((user: any, columnKey: string) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'full', src: user.avatar }}
            description={user.username}
            name={cellValue}
          >
            {user.name}
          </User>
        );
      case 'role':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case 'actions':
        return (
          <Dropdown className="min-w-fit" placement="bottom">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <VerticalDotsIcon className="text-default-600" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu className="w-fit">
              <DropdownItem>Create Appointment</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

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

  const topContent = useMemo(() => {
    return (
      <div className="w-full mt-4">
        <Input
          isClearable
          className="w-[70%] mx-auto"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>
    );
  }, [filterValue, users.length, onSearchChange, hasSearchFilter]);

  const bottomContent = useMemo(() => {
    if (!users.length) return null;

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

  return (
    <Table
      isHeaderSticky
      aria-label="Table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[687px]',
      }}
      // sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      className="w-full lg:max-w-[768px] mx-auto"
      // onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            // allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={items}
        isLoading={isLoading}
        loadingContent={<Spinner />}
        emptyContent={'No users found'}
      >
        {(item) => (
          <TableRow key={item.uid}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
