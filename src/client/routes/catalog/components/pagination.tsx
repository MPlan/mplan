import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';
import { IconButton } from 'components/icon-button';

const Root = styled(View)``;
const RowsPerPage = styled(Text)`
  margin-right: ${styles.space(-1)};
`;
const Select = styled.select``;
const Option = styled.option``;
const Range = styled(View)``;

interface PaginationProps {
  page: number;
  count: number;
  rowsPerPage: number;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number) => void;
}

export class Pagination extends React.PureComponent<PaginationProps> {
  get from() {
    const { count, page, rowsPerPage } = this.props;
    return count === 0 ? 0 : page * rowsPerPage + 1;
  }

  get to() {
    const { count, page, rowsPerPage } = this.props;
    return Math.min(count, (page + 1) * rowsPerPage);
  }

  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.currentTarget.value, 10);
    this.props.onChangeRowsPerPage(value);
  };

  handlePrevious = () => {};
  handleNext = () => {};

  render() {
    const { rowsPerPage, count } = this.props;

    return (
      <Root>
        <RowsPerPage>Rows per page:</RowsPerPage>
        <Select onChange={this.handleChange} value={rowsPerPage}>
          <Option value="10">10</Option>
          <Option value="25">25</Option>
          <Option value="50">50</Option>
        </Select>
        <Range>
          {this.from} - {this.to} of {count}
        </Range>
        <IconButton onClick={this.handlePrevious}>
          <Fa icon="chevronLeft" />
        </IconButton>
        <IconButton onClick={this.handleNext}>
          <Fa icon="chevronRight" />
        </IconButton>
      </Root>
    );
  }
}
