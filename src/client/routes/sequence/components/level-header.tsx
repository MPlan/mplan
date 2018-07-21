import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';
import { oneLine } from 'common-tags';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Modal } from 'components/modal';

const Container = styled(View)`
  margin: ${styles.space(-1)};
`;
const Title = styled(Text)`
  color: ${styles.textLight};
  font-weight: bold;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const Spacer = styled.div`
  margin-bottom: ${styles.space(-1)};
`;

interface LevelHeaderProps {
  level: number;
}

interface LevelHeaderState {
  modalOpen: boolean;
}

export class LevelHeader extends React.PureComponent<LevelHeaderProps, LevelHeaderState> {
  constructor(props: LevelHeaderProps) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  }

  handleModalOpen = () => {
    this.setState(previousState => ({
      ...previousState,
      modalOpen: true,
    }));
  };

  handleModalClose = () => {
    this.setState(previousState => ({
      ...previousState,
      modalOpen: false,
    }));
  };

  render() {
    const { level } = this.props;
    const title = `Level ${level}`;
    return (
      <Container>
        <Title onClick={this.handleModalOpen}>{title}</Title>
        <Modal
          title={title}
          open={this.state.modalOpen}
          size="medium"
          onBlurCancel={this.handleModalClose}
        >
          {/*if*/ level <= 0 ? (
            <View>
              <Text>These courses have been found to have no prerequisites!</Text>
              <Spacer />
              <Text strong>
                Disclaimer: even though the courses in this level don't have prerequisites does not
                mean you can take them. Some courses other restrictions besides prerequisite
                courses.
              </Text>
              <Spacer />
              <Text>E.g. to take Engineering 400, you must have senior standing.</Text>
            </View>
          ) : (
            <View>
              <Text>
                These courses have been found to have {level} {level > 1 ? 'levels' : 'level'} deep
                of prerequisites.
              </Text>
              <Spacer />
              <Text>
                This means that in order to take a course in this level, you need to have at least{' '}
                {level} {level > 1 ? 'semesters' : 'semester'} before taking any classes in this
                level.
              </Text>
              <Spacer />
              <Text>If you have any questions, contact your advisor.</Text>
            </View>
          )}
        </Modal>
      </Container>
    );
  }
}
