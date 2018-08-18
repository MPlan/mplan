import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { parsePrerequisiteString } from 'sync/catalog-umd-umich/courses/parse/prerequisites';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Modal } from 'components/modal';
import { Prerequisite } from 'components/prerequisite';
import { NewTabLink } from 'components/new-tab-link';
import { Button } from 'components/button';

// function replaceCourseStringsWithRealCo

function safeParsePrerequisiteString(prerequisiteString: string) {
  try {
    return parsePrerequisiteString(prerequisiteString);
  } catch {
    return undefined;
  }
}

const petitionLink =
  'https://umdearborn.edu/cecs/undergraduate-programs/advising/academic-policies-and-forms';

const Container = styled(View)`
  flex: 1 1 auto;
`;
const Row = styled(View)`
  flex-direction: row;
  flex: 1 1 auto;
`;
const TextArea = styled.textarea`
  font-family: ${styles.fontFamily};
  resize: none;
  flex: 1 1 auto;
`;
const Instructions = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const TextAreaColumn = styled(View)`
  flex: 2 0 auto;
  margin-right: ${styles.space(0)};
`;
const ResultsColumn = styled(View)`
  flex: 3 0 auto;
`;
const ColumnTitle = styled(Text)`
  margin-bottom: ${styles.space(-2)};
  font-weight: bold;
`;
const Code = styled.code`
  background-color: ${styles.highlightBlue};
`;
const Disclaimer = styled(Text)`
  margin: ${styles.space(0)} 0;
`;
const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  ${Button}:not(:first-child) {
    margin-left: ${styles.space(0)};
  }
`;
const ClearOverride = styled(Button)`
  margin-right: auto;
`;

export interface PrerequisiteEditorProps {
  open: boolean;
  course: Model.Course;
  catalog: Model.Catalog;
  onClose: () => void;
}
interface PrerequisiteEditorState {
  prerequisite: Model.Prerequisite | undefined;
  textareaEmpty: boolean;
}

export class PrerequisiteEditor extends React.PureComponent<
  PrerequisiteEditorProps,
  PrerequisiteEditorState
> {
  constructor(props: PrerequisiteEditorProps) {
    super(props);
    this.state = {
      prerequisite: undefined,
      textareaEmpty: true,
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    this.setState(previousState => ({
      ...previousState,
      textareaEmpty: !value,
      prerequisite: safeParsePrerequisiteString(value),
    }));
  };

  render() {
    const { course, open, onClose } = this.props;
    const { prerequisite, textareaEmpty } = this.state;
    return (
      <Modal
        title={`Editing prerequisites for ${course.simpleName}`}
        open={open}
        size="extra-large"
        minHeight={35}
        onBlurCancel={onClose}
      >
        <Container>
          <Instructions>
            To edit this course's prerequisites, type them out using <Code>AND</Code>
            s, <Code>OR</Code>
            s, and <Code>()</Code> parenthesis. The interpreted results will be displayed on the
            left.
          </Instructions>
          <Row>
            <TextAreaColumn>
              <ColumnTitle>Enter prerequisite expression here:</ColumnTitle>
              <TextArea
                onChange={this.handleChange}
                placeholder={
                  'e.g.\n(MATH 115 or MPLS with a score of 116) and\n(CIS 150 or IMSE 150 or CCM 150)'
                }
              />
            </TextAreaColumn>
            <ResultsColumn>
              <ColumnTitle>Result:</ColumnTitle>
              {!prerequisite ? (
                textareaEmpty ? (
                  <Text>Your results will be displayed here.</Text>
                ) : (
                  <Text>Failed to read expression.</Text>
                )
              ) : (
                <Prerequisite prerequisite={prerequisite} />
              )}
            </ResultsColumn>
          </Row>
          <Disclaimer>
            <strong>Disclaimer:</strong> Editing prerequisites in MPlan{' '}
            <strong>
              <em>does not</em>
            </strong>{' '}
            change them in the school information system. You may need to submit a{' '}
            <NewTabLink href={petitionLink}>student petition</NewTabLink> or submit a correction in
            order to register. Please contact your advisor if you have any questions.
          </Disclaimer>
          <Actions>
            <ClearOverride>Remove Override</ClearOverride>
            <Button onClick={onClose}>Cancel</Button>
            <Button>Save</Button>
          </Actions>
        </Container>
      </Modal>
    );
  }
}
