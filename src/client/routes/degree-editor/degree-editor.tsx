import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import { Page } from 'components/page';
import { Text } from 'components/text';

interface DegreeEditorProps {
  masteredDegrees: Model.MasteredDegree.Model[];
}

export class DegreeEditor extends React.PureComponent<DegreeEditorProps, {}> {
  render() {
    return (
      <Page
        title="Degree Editor"
        subtitle={<Text color={styles.textLight}>Edit degrees here</Text>}
      >
        test
      </Page>
    );
  }
}
