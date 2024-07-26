import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, changePage, approveOrder } from "../../../redux/slices/orderSlice"; 
import { Table, Spin, Space, Button, message, Dropdown, Menu } from "antd";
import PaginationComponent from "../../../components/PaginationComponents";

const orderStatusOptions = {
  WAITING: "Waiting",
  CONFIRM: "Confirm",
  DELIVERY: "Delivery",
  CANCELLED: "Cancelled",
  SUCCESS: "Success",
  DENIED: "Denied",
};

export default function Order() {
  const orders = useSelector((state) => state.orders.content);
  const number = useSelector((state) => state.orders.number);
  const total = useSelector((state) => state.orders.total);
  const size = useSelector((state) => state.orders.size);
  const isLoading = useSelector((state) => state.orders.isLoading);

  const dispatch = useDispatch();

  const handleChangePage = (page, pageSize) => {
    dispatch(changePage({ page: page - 1, size: pageSize }));
    dispatch(fetchAllOrders({ page: page - 1, size: pageSize }));
  };

  useEffect(() => {
    dispatch(fetchAllOrders({ page: number, size }));
  }, [number, size, dispatch]);


  const handleApprove = async (orderId, orderStatusName) => {
    try {
      await dispatch(approveOrder({ orderId, orderStatusName })).unwrap();
      message.success('Order status updated successfully');
    } catch (error) {
      message.error('Failed to update order status');
      console.error('Approve error:', error);
    }
  };

  const renderStatusMenu = (orderId) => (
    <Menu>
      {Object.entries(orderStatusOptions).map(([key, label]) => (
        <Menu.Item key={key} onClick={() => handleApprove(orderId, key)}>
          {label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      sorter: (a, b) => a.serialNumber.localeCompare(b.serialNumber),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Receive Name',
      dataIndex: 'receiveName',
      key: 'receiveName',
      sorter: (a, b) => a.receiveName.localeCompare(b.receiveName),
    },
    {
      title: 'Receive Address',
      dataIndex: 'receiveAddress',
      key: 'receiveAddress',
      sorter: (a, b) => a.receiveAddress.localeCompare(b.receiveAddress),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString()}đ`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => orderStatusOptions[status],
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Dropdown overlay={renderStatusMenu(record.orderId)} trigger={['click']}>
            <Button type="link">Change Status</Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const data = orders?.map((item) => ({
    key: item.orderId,
    orderId: item.orderId,
    serialNumber: item.serialNumber,
    receiveName: item.receiveName,
    receiveAddress: item.receiveAddress,
    customerName: item.userName,
    totalPrice: item.totalPrice,
    status: item.status,
  }));
  console.log(data);

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="order-table">
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      )}
      <PaginationComponent
        current={number + 1}
        total={total}
        pageSize={size}
        onChange={handleChangePage}
      />
    </>
  );
}
