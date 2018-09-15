import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { DegreeItem } from './degree-item';
import { View } from 'components/view';

const Content = styled(View)`
  padding: 0 ${styles.space(0)};
`;
const ReactQuillWrapper = styled(View)`
  padding: 0 ${styles.space(0)};
  min-height: 15rem;
  .quill {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  .ql-container {
    flex: 1 1 auto;
  }
`;

interface DescriptionEditorProps {
  descriptionHtml: string;
  onChange: (description: string) => void;
}

export class DescriptionEditor extends React.PureComponent<DescriptionEditorProps, {}> {
  render() {
    const { children, descriptionHtml, onChange, ...restOfProps } = this.props;
    return (
      <DegreeItem title="Description" {...restOfProps}>
        <Content>{children}</Content>
        <ReactQuillWrapper>
          <ReactQuill defaultValue={descriptionHtml} onChange={onChange} />
        </ReactQuillWrapper>
      </DegreeItem>
    );
  }
}
