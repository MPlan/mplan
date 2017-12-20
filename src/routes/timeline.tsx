import * as React from 'react';
import { View, Text } from '../components/base';

interface SemesterBlockProps { }



function SemesterBlock(props: SemesterBlockProps) {
  return <View width={20} margin>
    <View border flex padding>
      <Text>Semester block</Text>
    </View>
  </View>
}

interface TimelineState { }


export class Timeline extends React.Component<{}, TimelineState> {
  render() {
    return <View flex>
      <View padding row>
        <View flex>
          <Text strong extraLarge>Timeline</Text>
          <Text>Create your MPlan here.</Text>
        </View>
        <View alignItems="flex-end">
          <Text strong>Expected Graduation:</Text>
          <Text strong large>April 2018</Text>
        </View>
      </View>
      <View flex row>
        <View name="semester-block-container">
        </View>
        <SemesterBlock />
      </View>
    </View>
  }
}