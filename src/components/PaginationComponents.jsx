import React from 'react';
import { Pagination } from 'antd';

const PaginationComponent = ({ current, total, pageSize, onChange }) => (
  <Pagination
    current={current}
    total={total}
    pageSize={pageSize}
    onChange={onChange}
  />
);

export default PaginationComponent;
