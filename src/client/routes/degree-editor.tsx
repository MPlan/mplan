import * as React from 'react';
import * as Model from '../models';
import { View, Text } from '../components';
import styled from 'styled-components';

const Container = styled(View)``;

export class DegreeEditor extends Model.store.connect() {
  render() {
    return <Container />;
  }
}
