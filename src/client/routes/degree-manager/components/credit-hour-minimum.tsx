import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Paragraph } from 'components/paragraph';
import { CreditHourEditor } from 'components/credit-hour-editor';
import { DegreeItem } from './degree-item';
import { DescriptionAction } from './description-action';

interface CreditHourMinimumProps {
  minimumCreditHours: number;
  onChange: (minimumCreditHours: number) => void;
}

export class CreditHourMinimum extends React.PureComponent<CreditHourMinimumProps, {}> {
  render() {
    const { minimumCreditHours, onChange } = this.props;
    return (
      <DegreeItem title="Credit hour minimum">
        <DescriptionAction
          description={
            <>
              <Paragraph>
                All degree programs must have credit hour minimum. This number represents the
                minimum amount of credit hours required in order to graduate with this degree.
              </Paragraph>
              <Paragraph>
                If the student does not have enough courses on their degree worksheet to total the
                credit hour minimum, they will be presented with a warning.
              </Paragraph>
              <Paragraph>
                <strong>Note:</strong> MPlan is <em>not</em> a degree audit. Though this credit hour
                minimum provides some degree validation, it is not meant to be thorough.
              </Paragraph>
            </>
          }
        >
          <CreditHourEditor creditHours={minimumCreditHours} onChange={onChange} />
        </DescriptionAction>
      </DegreeItem>
    );
  }
}
