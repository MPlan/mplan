import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';
import { DropdownMenu } from './dropdown-menu';
import { Button } from './button';
import { DegreeDescription } from './degree-description';
import { DegreeCreditHours } from './degree-credit-hours';
import { MasteredDegreeGroup } from './mastered-degree-group';
import { groupBy } from 'rxjs/operators';

const Container = styled(View)`
  margin: 0 auto;
`;
const Title = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin-right: ${styles.space(1)};
`;
const TitleRow = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  max-width: 50rem;
  margin-bottom: ${styles.space(0)};
`;
const Separator = styled.div`
  width: 0.1rem;
  align-self: stretch;
  background-color: ${styles.grayLight};
  margin-right: ${styles.space(0)};
`;
const Header = styled(View)`
  margin: ${styles.space(1)};
`;
const Card = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  box-shadow: ${styles.boxShadow(0)};
`;
const Body = styled(View)`
  flex: 1;
  margin: 0 ${styles.space(1)};
  margin-bottom: ${styles.space(1)};
  max-width: 50rem;
`;
const GroupHeader = styled(Text)`
  margin-bottom: ${styles.space(-1)};
  font-size: ${styles.space(1)};
  color: ${styles.textLight};
`;
const GroupSubHeader = styled(Text)`
  margin-bottom: ${styles.space(0)};
  color: ${styles.textLight};
`;
const Hr = styled.hr`
  width: 100%;
  margin-bottom: ${styles.space(0)};
`;
const DegreeGroups = styled(View)``;
const Row = styled(View)`
  flex-direction: row;
`;

const titleDropdownActions = {
  rename: {
    text: 'Rename',
    icon: 'pencil',
  },
  delete: {
    text: 'Delete',
    icon: 'trash',
    color: styles.red,
  },
};

const initialState = {};
type InitialState = typeof initialState;
interface MasteredDegreeDetailState extends InitialState {}

export interface MasteredDegreeDetailProps {
  catalog: Model.Catalog;
  masteredDegree: Model.MasteredDegree;
  onDegreeUpdate: (update: (degree: Model.MasteredDegree) => Model.MasteredDegree) => void;
}

export class MasteredDegreeDetail extends React.Component<
  MasteredDegreeDetailProps,
  MasteredDegreeDetailState
> {
  constructor(props: MasteredDegreeDetailProps) {
    super(props);
    this.state = initialState;
  }

  handleTitleActions = (action: keyof typeof titleDropdownActions) => {};

  handleDescriptionChange = (html: string) => {
    this.props.onDegreeUpdate(degree => degree.set('descriptionHtml', html));
  };
  handleCreditsChange = (minimumCredits: number) => {
    this.props.onDegreeUpdate(degree => degree.set('minimumCredits', minimumCredits));
  };
  handleDegreeGroupUpdate(
    groupToUpdate: Model.MasteredDegreeGroup,
    groupUpdate: (group: Model.MasteredDegreeGroup) => Model.MasteredDegreeGroup,
  ) {
    this.props.onDegreeUpdate(degree =>
      degree.update('masteredDegreeGroups', groups => {
        const indexToUpdate = groups.findIndex(group => group.id === groupToUpdate.id);
        if (indexToUpdate < 0) return groups;
        return groups.update(indexToUpdate, groupUpdate);
      }),
    );
  }

  handleDeleteGroup(groupToDelete: Model.MasteredDegreeGroup) {
    this.props.onDegreeUpdate(degree => {
      return degree.update('masteredDegreeGroups', groups =>
        groups.filter(group => group.id !== groupToDelete.id),
      );
    });
  }

  render() {
    const { masteredDegree } = this.props;
    return (
      <Container>
        <Header>
          <TitleRow>
            <Title>{masteredDegree.name}</Title>
            <Separator />
            <DropdownMenu
              header={masteredDegree.name}
              actions={titleDropdownActions}
              onAction={this.handleTitleActions}
            />
          </TitleRow>
          <TitleRow>
            <Text color={styles.textLight}>
              This is the mastered degree template for {masteredDegree.name}. Any changes you make
              to this mastered degree will affect students who have chosen this degree in MPlan.
            </Text>
          </TitleRow>
        </Header>
        <Body>
          <DegreeDescription
            masteredDegree={masteredDegree}
            onDescriptionChange={this.handleDescriptionChange}
          />
          <DegreeCreditHours
            minimumCredits={masteredDegree.minimumCredits}
            onChange={this.handleCreditsChange}
          />
          <DegreeGroups>
            <GroupHeader>Degree groups</GroupHeader>
            <GroupSubHeader>
              A degree group is a set of courses that a student must satisfy as part of their degree
              such as "CIS Core" or "Technical Electives". Each group can set a whitelist,
              blacklist, credit minimum, credit maximum, and/or default courses.
            </GroupSubHeader>
            <Hr />
            {masteredDegree.masteredDegreeGroups.map(group => (
              <MasteredDegreeGroup
                key={group.id}
                masteredDegreeGroup={group}
                onDegreeGroupUpdate={update => this.handleDegreeGroupUpdate(group, update)}
                onDeleteGroup={() => this.handleDeleteGroup(group)}
                catalog={this.props.catalog}
              />
            ))}
            {/*if*/ masteredDegree.masteredDegreeGroups.count() === 0 ? (
              <Text strong>There are no degree groups. Click the blue plus to create one.</Text>
            ) : null}
          </DegreeGroups>
          <GroupHeader>Publish</GroupHeader>
          <GroupSubHeader>
            This degree won't be usable by students until it is published.
          </GroupSubHeader>
          <Card>
            <Row>
              <Text style={{fontWeight: 'bold', marginRight: styles.space(0)}}>Current status:</Text>
              <Text style={{marginRight: styles.space(0)}}>Not published</Text>
              <Text style={{marginRight: styles.space(0)}}>Edited. Changes not published.</Text>
              <Text style={{marginRight: styles.space(0)}}>Published</Text>
              <Button>Publish</Button>
            </Row>
          </Card>
        </Body>
      </Container>
    );
  }
}
