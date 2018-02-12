import * as React from 'react';
import { View, Text } from '../components/base';
import * as Model from '../models';

export class Warnings extends Model.store.connect({
  get: store => ({ semesters: store.semesters, catalog: store.catalog }),
  set: store => store,
}) {
  render() {
    return <View flex overflow>
      {this.state.semesters
        .map(semester => semester.warningsNeverRanDuringCurrentSeason(this.state.catalog))
        .map((warning, i) => <Text key={i}>{warning}</Text>)
      }
    </View>;
  }
}
