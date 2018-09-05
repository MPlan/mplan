import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Paragraph } from 'components/paragraph';
import { DegreeItem } from './degree-item';
import { View } from 'components/view';

const Content = styled(View)`
  padding: 0 ${styles.space(0)};
`;
const ReactQuillWrapper = styled(View)`
  display: box;
  padding: 0 ${styles.space(0)};
`;

interface DescriptionEditorProps {}

export class DescriptionEditor extends React.PureComponent<DescriptionEditorProps, {}> {
  render() {
    return (
      <DegreeItem title="Degree description">
        <Content>
          <Paragraph>Edit the description of this degree here.</Paragraph>
          <Paragraph>
            The degree description will appear under the degree name on the student's degree
            worksheet. It is recommend to include a link to any official degree
            curriculums/requirements here.
          </Paragraph>
        </Content>
        <ReactQuillWrapper>
          <ReactQuill onChange={() => {}} />
        </ReactQuillWrapper>
      </DegreeItem>
    );
  }
}
