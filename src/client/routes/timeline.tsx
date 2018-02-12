import * as React from 'react';
import { View, Text } from '../components/base';
import * as Styles from '../components/styles';
import * as Record from 'recordize';
import * as Model from '../models';
import * as Immutable from 'immutable';
import { Box } from '../components/box';
import { Semester } from '../components/semester';
import { Button } from '../components/button';

interface CreateSemesterProps {
  onCreateClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
}

function CreateSemester(props: CreateSemesterProps) {
  return <View border margin padding justifyContent="center" alignItems="center">
    <Button onClick={props.onCreateClick}><Text>+ new semester</Text></Button>
  </View>;
}


export class Timeline extends Model.store.connect({
  get: store => ({
    semesters: store.semesters,
  }),
  set: store => store,
}) {

  handleMouseUp = () => {
    this.setStore(previousState => ({
      ...previousState,
      dragging: false,
    }))
  }

  handleMouseMove = (e: MouseEvent) => {
    this.setStore(previousState => ({
      ...previousState,
      x: e.clientX,
      y: e.clientY,
    }))
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove);
    super.componentDidMount();
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
    super.componentWillUnmount();
  }

  handleCourseMouseDown = (e: React.MouseEvent<HTMLDivElement>, course: Model.Course) => {
    const offsetLeft = e.currentTarget.offsetLeft;
    const offsetTop = e.currentTarget.offsetTop;
    const offsetX = e.pageX - offsetLeft;
    const offsetY = e.pageY - offsetTop;
    this.setStore(previousState => ({
      ...previousState,
      selectedCourseId: course._id.toHexString(),
      dragging: true,
      offsetX,
      offsetY,
    }))
  }

  handleCourseMouseUp = (e: React.MouseEvent<HTMLDivElement>, course: Model.Course) => {
    this.setStore(previousState => ({
      ...previousState,
      dragging: false,
    }))
  }

  onCreateSemesterBefore = () => {
    const id = Model.ObjectId();
    this.setGlobalStore(store => {
      const firstSemester = store.semesters[0];
      const { season, year } = firstSemester.previousSemester();
      return store.update('semesterMap', semesterMap =>
        semesterMap.set(id.toHexString(), new Model.Semester({
          _id: id,
          season,
          year,
        })));
    });
  }

  onCreateSemesterAfter = () => {
    const id = Model.ObjectId();
    this.setGlobalStore(store => {
      const firstSemester = store.semesters[store.semesters.length - 1];
      const { season, year } = firstSemester.nextSemester();
      return store.update('semesterMap', semesterMap =>
        semesterMap.set(id.toHexString(), new Model.Semester({
          _id: id,
          season,
          year,
        })));
    });
  }

  render() {
    return <View _="timeline" flex row>
      <View _="content" flex overflow>
        <View _="header" padding row>
          <View flex>
            <Text strong extraLarge>Timeline</Text>
            <Text>Create your MPlan here.</Text>
          </View>
          <View alignItems="flex-end">
            <Text strong>Expected Graduation:</Text>
            <Text strong large>April 2018</Text>
          </View>
        </View>
        <View _="semester-block-container" flex row overflow>
          <CreateSemester onCreateClick={this.onCreateSemesterBefore} />
          {this.state.semesters.map(semester => <Semester
            semester={semester}
          />)}
          <CreateSemester onCreateClick={this.onCreateSemesterAfter} />
        </View>
      </View>
      <View><Box /></View>
    </View>
  }
}