import * as React from 'react';
import * as Model from 'models';
import {
  isAndPrerequisite,
  isOrPrerequisite,
  isCoursePrerequisite,
  isStringPrerequisite,
} from 'models/models';
import * as styles from 'styles';
import styled from 'styled-components';
import { parsePrerequisiteString } from 'sync/catalog-umd-umich/courses/parse/prerequisites';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Modal } from 'components/modal';
import { Prerequisite } from 'components/prerequisite';
import { NewTabLink } from 'components/new-tab-link';
import { Button, DangerButton } from 'components/button';
import { ActionableText } from 'components/actionable-text';

function replaceCourseStrings(
  prerequisite: Model.Prerequisite,
  catalog: Model.Catalog,
): Model.Prerequisite {
  if (isAndPrerequisite(prerequisite) || isOrPrerequisite(prerequisite)) {
    const operands = isAndPrerequisite(prerequisite) ? prerequisite.and : prerequisite.or;
    const transformedOperands = operands.map(operand => replaceCourseStrings(operand, catalog));
    return isAndPrerequisite(prerequisite)
      ? { and: transformedOperands }
      : { or: transformedOperands };
  }
  if (isCoursePrerequisite(prerequisite)) return prerequisite;
  if (typeof prerequisite !== 'string') return prerequisite;

  const match = /(\w*) (\w*)(\*)?/.exec(prerequisite.toUpperCase().trim());
  if (!match) return prerequisite;

  const subjectCode = match[1];
  const courseNumber = match[2];
  const previousOrConcurrent = (match[3] || '').includes('*') ? 'CONCURRENT' : 'PREVIOUS';

  const courseInCatalog = !!catalog.getCourse(subjectCode, courseNumber);
  if (!courseInCatalog) return prerequisite;

  return [subjectCode, courseNumber, previousOrConcurrent] as [
    string,
    string,
    'PREVIOUS' | 'CONCURRENT'
  ];
}

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
  max-width: 42rem;
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
  max-width: 42rem;
`;
const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  ${Button}:not(:first-child) {
    margin-left: ${styles.space(0)};
  }
`;
const ClearOverride = styled(View)`
  margin-right: auto;
  flex-direction: row;
`;

function transformPrerequisiteToString(prerequisite: Model.Prerequisite | undefined): string {
  if (!prerequisite) return '';

  if (isStringPrerequisite(prerequisite)) return prerequisite;
  if (isCoursePrerequisite(prerequisite)) {
    const [subjectCode, courseNumber, previousOrConcurrent] = prerequisite;
    return `${subjectCode} ${courseNumber}${previousOrConcurrent === 'CONCURRENT' ? '*' : ''}`;
  }

  if (isAndPrerequisite(prerequisite)) {
    const joined = prerequisite.and
      .map(operand => transformPrerequisiteToString(operand))
      .join(' AND ');
    return `(${joined})`;
  }

  if (isOrPrerequisite(prerequisite)) {
    const joined = prerequisite.or
      .map(operand => transformPrerequisiteToString(operand))
      .join(' OR ');
    return `(${joined})`;
  }
  throw new Error('Unmet prerequisite case when transforming prerequisite to a string');
}

export interface PrerequisiteEditorProps {
  open: boolean;
  globalOverrideExists: boolean;
  localOverrideExists: boolean;
  course: Model.Course;
  catalog: Model.Catalog;
  onClose: () => void;
  isAdmin: boolean;
  onSaveUser: (course: Model.Course, prerequisites: Model.Prerequisite) => void;
  onSaveGlobal: (course: Model.Course, prerequisites: Model.Prerequisite) => Promise<void>;
  onRemoveUser: (course: Model.Course) => void;
  onRemoveGlobal: (course: Model.Course) => Promise<void>;
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

    const parsed = safeParsePrerequisiteString(
      transformPrerequisiteToString(props.course.prerequisitesConsideringOverrides),
    );
    const parsedWithCourses = parsed ? replaceCourseStrings(parsed, props.catalog) : undefined;

    this.state = {
      prerequisite: parsedWithCourses,
      textareaEmpty: true,
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;

    const parsed = safeParsePrerequisiteString(value);
    const parsedWithCourses = parsed ? replaceCourseStrings(parsed, this.props.catalog) : undefined;

    this.setState(previousState => ({
      ...previousState,
      textareaEmpty: !value,
      prerequisite: parsedWithCourses,
    }));
  };

  handleSaveLocally = () => {
    const prerequisite = this.state.prerequisite;
    if (!prerequisite) return;

    this.props.onSaveUser(this.props.course, prerequisite);
    this.props.onClose();
  };

  handleSaveGlobally = () => {
    const prerequisite = this.state.prerequisite;
    if (!prerequisite) return;

    this.props.onSaveGlobal(this.props.course, prerequisite);
    this.props.onClose();
  };

  handleRemoveGlobally = () => {
    this.props.onRemoveGlobal(this.props.course);
    this.props.onClose();
  };

  handleRemoveLocally = () => {
    this.props.onRemoveUser(this.props.course);
    this.props.onClose();
  };

  render() {
    const {
      course,
      open,
      onClose,
      globalOverrideExists,
      localOverrideExists,
      isAdmin,
    } = this.props;
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
            s, and parentheses <Code>()</Code>:
            <ul>
              <li>
                The interpreted results will be displayed on the left. A term will turn{' '}
                <ActionableText>blue</ActionableText> if it matches with a course that exists in the
                catalog.
              </li>
              <li>
                Add an asterisk <Code>*</Code> to denote that a course can be taken concurrently.
              </li>
              <li>
                You may use more parentheses <Code>()</Code> if the interpreted results are not what
                you expect.
              </li>
            </ul>
          </Instructions>
          <Row>
            <TextAreaColumn>
              <ColumnTitle>Enter prerequisite expression here:</ColumnTitle>
              <TextArea
                defaultValue={transformPrerequisiteToString(
                  course.prerequisitesConsideringOverrides,
                )}
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
                <Prerequisite prerequisite={prerequisite} disableLinks />
              )}
            </ResultsColumn>
          </Row>
          <Disclaimer>
            <strong>Disclaimer:</strong> Editing prerequisites in MPlan{' '}
            <strong>
              <em>does not</em>
            </strong>{' '}
            change them in the school information system.{' '}
            {isAdmin ? (
              <React.Fragment>
                As an admin you can choose apply prerequisite overrides globally across MPlan
                (visible to all user of MPlan) or specifically on your account (only visible to
                you).
              </React.Fragment>
            ) : (
              <React.Fragment>
                <strong>Note that these edits are only visible to you</strong>. You may need to
                submit a <NewTabLink href={petitionLink}>student petition</NewTabLink> in order to
                register. Please contact your advisor if you have any questions.
              </React.Fragment>
            )}
          </Disclaimer>
          <Actions>
            <ClearOverride>
              {isAdmin ? (
                globalOverrideExists ? (
                  <DangerButton onClick={this.handleRemoveGlobally}>
                    Remove Global Override
                  </DangerButton>
                ) : null
              ) : null}
              {localOverrideExists && (
                <DangerButton onClick={this.handleRemoveLocally}>
                  Remove {isAdmin ? 'Local' : ''} Override
                </DangerButton>
              )}
            </ClearOverride>
            <Button onClick={onClose}>Cancel</Button>
            {isAdmin && <Button onClick={this.handleSaveGlobally}>Save Globally</Button>}
            <Button onClick={this.handleSaveLocally}>Save {isAdmin ? 'Locally' : ''}</Button>
          </Actions>
        </Container>
      </Modal>
    );
  }
}
