import * as React from 'react';
import * as Model from '../models';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { Button } from './button';
import { Fa } from './fa';
const RichTextEditor = require('react-rte').default;

const Container = styled(View)`
  flex-shrink: 0;
`;
const Header = styled(Text)`
  margin-bottom: ${styles.space(-1)};
  font-size: ${styles.space(1)};
  color: ${styles.textLight};
`;
const SubHeader = styled(Text)`
  margin-bottom: ${styles.space(-1)};
  color: ${styles.textLight};
`;
const Card = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  box-shadow: ${styles.boxShadow(0)};
  margin-bottom: ${styles.space(1)};
`;
const ButtonContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
`;
const DescriptionNonEdit = styled(View)`
  &,
  & * {
    font-family: ${styles.fontFamily};
  }
`;
const Row = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
`;

const initialState = {
  value: RichTextEditor.createEmptyValue(),
  editing: false,
};
type InitialState = typeof initialState;
interface DegreeDescriptionState extends InitialState {}
export interface DegreeDescriptionProps {
  masteredDegree: Model.MasteredDegree;
  onDescriptionChange: (html: string) => void;
}

export class DegreeDescription extends React.Component<
  DegreeDescriptionProps,
  DegreeDescriptionState
> {
  constructor(props: DegreeDescriptionProps) {
    super(props);
    this.state = {
      ...initialState,
      value: RichTextEditor.createValueFromString(props.masteredDegree.descriptionHtml, 'html'),
    };
  }

  componentWillReceiveProps(nextProps: DegreeDescriptionProps) {
    if (nextProps.masteredDegree !== this.props.masteredDegree) {
      this.setState(previousState => ({
        ...previousState,
        editing: false,
        value: RichTextEditor.createValueFromString(
          nextProps.masteredDegree.descriptionHtml,
          'html',
        ),
      }));
    }
  }

  handleOnChange = (value: any) => {
    this.setState(previousState => ({
      ...previousState,
      value,
    }));
  };

  handleCancelClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editing: false,
      value: RichTextEditor.createValueFromString(
        this.props.masteredDegree.descriptionHtml,
        'html',
      ),
    }));
  };

  handleSaveClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editing: false,
    }));
    this.props.onDescriptionChange(this.state.value.toString('html'));
  };

  handleEditClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editing: true,
    }));
  };

  render() {
    return (
      <Container>
        <Header>Description</Header>
        <SubHeader>
          This description is displayed in the student's degree page under the degree name. It may
          be helpful to include links to official documentation for the degree such as curriculum
          requirement sheets in this description.
        </SubHeader>
        <Card>
          {/*if*/ this.state.editing ? (
            <View>
              <RichTextEditor value={this.state.value} onChange={this.handleOnChange} />
              <ButtonContainer>
                <Button onClick={this.handleCancelClick}>
                  <Fa icon="times" />
                  <Text style={{ marginLeft: styles.space(-1) }}>Cancel</Text>
                </Button>
                <Button onClick={this.handleSaveClick}>
                  <Fa icon="check" color={styles.blue} />
                  <Text style={{ marginLeft: styles.space(-1) }}>Save</Text>
                </Button>
              </ButtonContainer>
            </View>
          ) : (
            <View>
              <Row>
                <Button onClick={this.handleEditClick}>
                  <Fa icon="pencil" />
                  <Text style={{ marginLeft: styles.space(-1) }}>Edit</Text>
                </Button>
              </Row>
              <DescriptionNonEdit
                dangerouslySetInnerHTML={{ __html: this.props.masteredDegree.descriptionHtml }}
              />
            </View>
          )}
        </Card>
      </Container>
    );
  }
}
