import * as React from 'react';
import { View, Text } from '../components/base';
import * as Model from '../models';
import * as Styles from '../components/styles';
import { flatten } from '../../utilities/utilities'

export class Warnings extends Model.store.connect() {
  render() {

    const warnings = flatten(
      this.store.semesters.map(semester =>
        semester.warningsNeverRanDuringCurrentSeason(this.store.catalog)
      )
    );

    return <View
      flex
      overflow
      padding
      style={{ borderTop: `solid 0.10rem ${Styles.border}` }}
    >
      <View><Text strong large>Warnings</Text></View>
      <View flex overflow>{
        warnings.map((warning, i) => <View
          key={i}
          border
          padding
          margin={{ bottom: true }}
        >
          <Text>{warning}</Text>
        </View>)}
      </View>

    </View>;
  }
}
