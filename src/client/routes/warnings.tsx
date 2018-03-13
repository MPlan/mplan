import * as React from 'react';
import { View, Text } from '../components';
import * as Model from '../models';
import * as styles from '../styles';
import { flatten } from '../../utilities/utilities';
import styled from 'styled-components';

const WarningsContainer = styled(View) `
  flex: 1;
  overflow: auto;
  padding: ${styles.space(0)};
  border-top: ${styles.border};
`;

const WarningsContent = styled(View) `
  flex: 1;
  overflow: auto;
`;

const Warning = styled(View) `
  border: ${styles.border};
  padding: ${styles.space(0)};
`;

export class Warnings extends Model.store.connect() {
  render() {

    // const warnings = flatten(
    //   this.store.semesters.map(semester =>
    //     semester.warningsNeverRanDuringCurrentSeason(this.store.catalog)
    //   )
    // );

    // return <WarningsContainer>
    //   <View><Text strong large>Warnings</Text></View>
    //   <WarningsContent>{
    //     warnings.map((warning, i) => <Warning key={i}>
    //       <Text>{warning}</Text>
    //     </Warning>)}
    //   </WarningsContent>
    // </WarningsContainer>;

    return <View><Text>WIP</Text></View>;
  }
}
