import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Page } from 'components/page';
import { Text } from 'components/text';
import { View } from 'components/view';
import { Button, DangerButton } from 'components/button';
import { Fa } from 'components/fa';
import { FloatingActionButton } from 'components/floating-action-button';
import { Modal } from 'components/modal';

const Table = styled(View)`
  flex: 1 1 auto;
  background-color: white;
  box-shadow: ${styles.boxShadow(0)};
  margin: 0 ${styles.space(1)};
  padding: 1rem 0;
  max-width: 40rem;
  margin-bottom: ${styles.space(1)};
`;
const TableRow = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(1)};
  align-items: center;
  transition: all 200ms;
  min-height: 4rem;
  &:hover {
    background-color: ${styles.whiteBis};
  }
`;
const UniqueName = styled(Text)`
  margin-right: auto;
`;
const Title = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin: 0 ${styles.space(1)};
  margin-bottom: ${styles.space(0)};
`;
const SearchRow = styled(View)`
  flex-direction: row;
  min-height: 3rem;
  align-items: center;
  border-bottom: 1px solid ${styles.grayLighter};
  padding-bottom: ${styles.space(-1)};
`;
const SearchInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  margin: 0 ${styles.space(1)};
  flex: 1 1 auto;
`;
const AddInput = styled.input`
  background-color: transparent;
  border: 1px solid ${styles.grayLighter};
  min-height: 3rem;
  padding: 0 ${styles.space(0)};
  margin-bottom: ${styles.space(0)};
`;
const SearchIcon = styled(Fa)`
  margin-right: ${styles.space(1)};
  margin-left: ${styles.space(0)};
`;
const TableBody = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
`;
const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  ${Button} {
    margin-left: ${styles.space(-1)};
  }
`;
const NoMatch = styled(Text)`
  margin: ${styles.space(1)};
`;
const Description = styled(Text)`
  margin-bottom: ${styles.space(0)};
`;
const ButtonIcon = styled(Fa)`
  margin-right: ${styles.space(-2)};
`;

const actions = {
  add: {
    text: 'New admin',
    icon: 'plus',
    color: styles.blue,
  },
};

interface AdminProps {
  admins: string[];
  onAdd: (admin: string) => void;
  onRemove: (admin: string) => void;
}

interface AdminState {
  addModalOpen: boolean;
  search: string;
  uniqueNameToRemove: string | undefined;
  uniqueNameToAdd: string | undefined;
}

export class Admin extends React.PureComponent<AdminProps, AdminState> {
  constructor(props: AdminProps) {
    super(props);

    this.state = {
      addModalOpen: false,
      search: '',
      uniqueNameToRemove: '',
      uniqueNameToAdd: '',
    };
  }

  handleClickSearchRow = () => {
    const inputElement = document.querySelector('.admin-search') as HTMLInputElement | null;
    if (!inputElement) return;
    inputElement.focus();
  };

  handleModalOpen = () => {
    this.setState(previousState => ({
      ...previousState,
      addModalOpen: true,
      uniqueNameToAdd: '',
    }));
  };

  handleModalClose = () => {
    this.setState(previousState => ({
      ...previousState,
      addModalOpen: false,
    }));
  };

  handleAddAdmin = () => {
    this.setState(previousState => ({
      ...previousState,
      addModalOpen: false,
    }));
    const uniqueNameToAdd = this.state.uniqueNameToAdd;
    if (!uniqueNameToAdd) return;
    this.props.onAdd(uniqueNameToAdd);
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    this.setState(previousState => ({
      ...previousState,
      search,
    }));
  };

  handleRemoveAdmin(uniqueNameToRemove: string) {
    this.setState(previousState => ({
      ...previousState,
      uniqueNameToRemove,
    }));
  }

  handleCancelRemove = () => {
    this.setState(previousState => ({
      ...previousState,
      uniqueNameToRemove: undefined,
    }));
  };

  handleAddAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uniqueNameToAdd = e.currentTarget.value;
    this.setState(previousState => ({
      ...previousState,
      uniqueNameToAdd,
    }));
  };

  handleReallyRemoveAdmin = () => {
    const uniqueNameToRemove = this.state.uniqueNameToRemove;
    if (!uniqueNameToRemove) return;
    this.props.onRemove(uniqueNameToRemove);
    this.setState(previousState => ({
      ...previousState,
      uniqueNameToRemove: '',
    }));
  };

  renderSubtitle = () => {
    return <Text color={styles.textLight}>Add and remove admins on this page.</Text>;
  };

  render() {
    const { admins } = this.props;
    const { addModalOpen, search, uniqueNameToRemove, uniqueNameToAdd } = this.state;

    const filteredAdmins = admins
      .filter(admin => admin.toLowerCase().includes(search.toLowerCase().trim()))
      .map(uniqueName => (
        <TableRow key={uniqueName}>
          <UniqueName>{uniqueName}</UniqueName>
          <Button onClick={() => this.handleRemoveAdmin(uniqueName)}>Remove</Button>
        </TableRow>
      ));

    return (
      <Page title="Manage Admins" renderSubtitle={this.renderSubtitle}>
        <Title>Current Admins</Title>
        <Table>
          <SearchRow onClick={this.handleClickSearchRow}>
            <SearchInput
              className="admin-search"
              placeholder="search for admins..."
              onChange={this.handleSearchChange}
            />
            <SearchIcon icon="search" />
          </SearchRow>
          <TableBody>
            {filteredAdmins}
            {filteredAdmins.length <= 0 ? <NoMatch>No admins match "{search}"</NoMatch> : null}
          </TableBody>
        </Table>
        <FloatingActionButton
          message="Add admin..."
          actions={actions}
          onAction={this.handleModalOpen}
        />
        <Modal
          title="Add new admin"
          open={addModalOpen}
          size="medium"
          onBlurCancel={this.handleModalClose}
        >
          <AddInput
            placeholder="Type a uniquename to add."
            value={uniqueNameToAdd}
            onChange={this.handleAddAdminChange}
          />
          <Actions>
            <Button onClick={this.handleModalClose}>Cancel</Button>
            <Button onClick={this.handleAddAdmin}>+ Add Admin</Button>
          </Actions>
        </Modal>
        <Modal
          open={!!uniqueNameToRemove}
          title="Are you sure?"
          onBlurCancel={this.handleCancelRemove}
          size="medium"
        >
          <Description>
            Are you sure you want to remove {uniqueNameToRemove} as an admin?
          </Description>
          <Actions>
            <Button onClick={this.handleCancelRemove}>
              <ButtonIcon icon="times" />
              Cancel
            </Button>
            <DangerButton onClick={this.handleReallyRemoveAdmin}>
              <ButtonIcon icon="trash" />
              Yes, remove {uniqueNameToRemove}
            </DangerButton>
          </Actions>
        </Modal>
      </Page>
    );
  }
}
