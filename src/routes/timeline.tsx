import * as React from 'react';
import { View, Text } from '../components/base';

interface SemesterBlockProps { }



function SemesterBlock(props: SemesterBlockProps) {
  return <View width={20} border>
    <View>
    </View>
    <Text>Semester block</Text>
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
        <SemesterBlock />
      </View>
    </View>
  }
}