import * as React from 'react';
import * as Model from 'models';
import { Page } from 'components/page';

interface DegreeEditorProps {
  masteredDegrees: Model.MasteredDegree.Model[];
}

export class DegreeEditor extends React.PureComponent<DegreeEditorProps, {}> {
  render() {
    return <Page title="Degree Editor" subtitle="Edit degrees here">test</Page>;
  }
}
