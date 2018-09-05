import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Paragraph } from 'components/paragraph';
import { Input } from 'components/input';
import { InlineEdit, DisplayProps, InputProps } from 'components/inline-edit';
import { Text } from 'components/text';
import { View } from 'components/view';
import { DegreeItem } from './degree-item';
import { DescriptionAction } from './description-action';

const NumberInput = styled(Input)`
  border: 1px solid ${styles.grayLighter};
`;

interface CreditHourMinimumProps {}
interface CreditHourMinimumState {
  editing: boolean;
  minimumCreditHours: number;
}

export class CreditHourMinimum extends React.PureComponent<
  CreditHourMinimumProps,
  CreditHourMinimumState
> {
  constructor(props: CreditHourMinimumProps) {
    super(props);

    this.state = {
      editing: false,
      minimumCreditHours: 120,
    };
  }

  handleEdit = () => {
    this.setState({ editing: true });
  };
  handleBlur = () => {
    this.setState({ editing: false });
  };
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const minimumCreditHours = parseInt(value, 10);
    this.setState({ minimumCreditHours });
  };

  renderDisplay = (props: DisplayProps) => {
    return <Text {...props} />;
  };

  renderInput = (props: InputProps) => {
    return <NumberInput {...props} onChange={this.handleChange} type="number" />;
  };

  render() {
    const { minimumCreditHours, editing } = this.state;
    return (
      <DegreeItem title="Credit hour minimum">
        <DescriptionAction
          description={
            <React.Fragment>
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
            </React.Fragment>
          }
        >
          <InlineEdit
            editing={editing}
            onBlur={this.handleBlur}
            onEdit={this.handleEdit}
            value={minimumCreditHours.toString()}
            renderDisplay={this.renderDisplay}
            renderInput={this.renderInput}
          />
        </DescriptionAction>
      </DegreeItem>
    );
  }
}
