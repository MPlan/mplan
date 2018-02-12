import * as React from 'react';
import { View, Text } from '../components/base';
import * as Styles from '../components/styles';
import * as Record from 'recordize';
import * as Model from '../models';
import * as Immutable from 'immutable';
import { Box } from '../components/box';

interface SemesterBlockProps {
  courses: Immutable.Set<Model.Course>,
  semester: Model.Semester,
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void,
  onCourseMouseDown: (e: React.MouseEvent<HTMLDivElement>, course: Model.Course) => void,
  onCourseMouseUp: (e: React.MouseEvent<HTMLDivElement>, course: Model.Course) => void,
}

function Semester(props: SemesterBlockProps) {
  const semester = props.semester;
  return <View
    width={20}
    flex={{ flexShrink: 0 }}
    onMouseUp={props.onMouseUp}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
    style={{}}
  >
    <View border flex padding margin>
      <View _="heading" row justifyContent="space-between">
        <Text strong>{semester.name}</Text>
        <Text>{semester.count()} Courses</Text>
      </View>
      <View flex>
      </View>
    </View>
  </View>
}

interface CourseProps {
  course: Model.Course,
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void,
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void,
}
interface CourseState {
  hovering: boolean,
}
class Course extends React.Component<CourseProps, CourseState> {
  constructor(props: CourseProps) {
    super(props);
    this.state = {
      hovering: false,
    }
  }
  render() {
    const { course } = this.props;
    return <View
      _="course"
      border
      margin={{ vertical: true }}
      padding
      onMouseDown={this.props.onMouseDown}
      onMouseUp={this.props.onMouseUp}
    >
      <Text>{course.name}</Text>
    </View>
  }
}

export class Test extends Model.store.connect({
  get: store => ({
    x: store.x,
    y: store.y,
  }),
  set: (store, v) => store.set('x', v.x).set('y', v.y)
}) { }

export class Timeline extends Model.store.connect({
  get: store => ({

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

  render() {
    this.state
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
        <View _="semester-block-container" flex row overflow="auto">
        </View>
      </View>
      <View><Box /></View>
    </View>
  }
}