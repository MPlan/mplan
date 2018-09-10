import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Field } from 'components/field';

interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
  focused?: boolean;
}
const Label = styled.label<LabelProps>`
  padding: ${styles.space(-1)};
  background-color: ${styles.white};
  border: ${props => (props.focused ? '2px' : '1px')} solid
    ${props => (props.focused ? styles.blue : styles.grayLighter)};
  display: flex;
`;
const Select = styled.select`
  flex: 1 1 auto;
  border: none;
  outline: none;
  background-color: transparent;
`;
const Option = styled.option``;

interface SelectFieldProps<T> {
  label: string;
  items: { displayName: string; value: T }[];
  onChange: (t: T) => void;
}
interface SelectFieldState {
  focused: boolean;
}

export class SelectField<T> extends React.PureComponent<SelectFieldProps<T>, SelectFieldState> {
  constructor(props: SelectFieldProps<T>) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  handleFocus = () => {
    this.setState({ focused: true });
  };
  handleBlur = () => {
    this.setState({ focused: false });
  };
  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = e.currentTarget.value;
    const item = this.props.items[index as any];
    if (!item) return;
    this.props.onChange(item.value);
  };

  render() {
    const { label, items } = this.props;
    const { focused } = this.state;

    return (
      <Field focused={focused} label={label}>
        <Label focused={focused}>
          <Select onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange}>
            {items.map((item, index) => (
              <Option key={index} value={index}>
                {item.displayName}
              </Option>
            ))}
          </Select>
        </Label>
      </Field>
    );
  }
}
