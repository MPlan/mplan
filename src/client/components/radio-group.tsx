import * as React from 'react';
import * as styles from 'styles';
import * as uuid from 'uuid/v4';
import styled from 'styled-components';

import { View } from 'components/view';
import { Radio } from 'components/radio';

const Root = styled(View)``;

interface RadioGroupProps {
  options: Array<{ value: string; label: string; description?: React.ReactNode }>;
  onChange: (key: string) => void;
  value: string;
}

export class RadioGroup extends React.PureComponent<RadioGroupProps, {}> {
  radioGroupId = `radio-group-${uuid()}`;

  render() {
    const { options, value } = this.props;
    return (
      <Root>
        {options.map(option => (
          <Radio
            name={this.radioGroupId}
            value={option.value}
            label={option.label}
            checked={option.value === value}
            description={option.description}
            onChange={() => this.props.onChange(option.value)}
          />
        ))}
      </Root>
    );
  }
}
