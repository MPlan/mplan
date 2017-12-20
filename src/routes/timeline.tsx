import * as React from 'react';
import { View, Text } from '../components/base';
import * as Color from '../components/colors';
import * as Record from 'recordize';
import * as Model from '../models';

interface SemesterBlockProps {
  semester: Model.Semester,
}

function Semester(props: SemesterBlockProps) {
  const semester = props.semester;
  return <View width={20}>
    <View border flex padding margin>
      <View name="heading" row justifyContent="space-between">
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
      name="course"
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

interface TimelineState { }

export class Timeline extends Model.Store.connect({
  get: store => ({
    semesters: store.semesterList,
    courseInBucket: store.bucketList,
    dragging: store.dragging,
    selectedCourse: store.selectedCourse,
    selectedCourseId: store.selectedCourseId,
    x: store.x,
    y: store.y,
    offsetX: store.offsetX,
    offsetY: store.offsetY,
  }),
  set: (store, values: any) => {
    const newSelectedCourseId = values.selectedCourseId;
    const newDragging = values.dragging;
    const newX = values.x;
    const newY = values.y;
    return store
      .set('selectedCourseId', newSelectedCourseId)
      .set('dragging', newDragging)
      .set('x', newX)
      .set('y', newY);
  }
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


  render() {
    this.state
    return <View name="timeline" flex row style={{ maxWidth: '100%' }}>
      {/*if*/ this.state.dragging
        ? <View
          width={20}
          style={{
            position: 'absolute',
            top: this.state.y + this.state.offsetY,
            left: this.state.x + this.state.offsetX,
          }}
        >
          <Course
            course={this.state.selectedCourse}
            onMouseDown={() => { }}
            onMouseUp={() => { }}
          />
        </View>
        : null
      }
      <View name="content" flex>
        <View name="header" padding row>
          <View flex>
            <Text strong extraLarge>Timeline {/*if*/ this.state.dragging ? 'Dragging' : ''}</Text>
            <Text>Create your MPlan here.</Text>
          </View>
          <View alignItems="flex-end">
            <Text strong>Expected Graduation:</Text>
            <Text strong large>April 2018</Text>
          </View>
        </View>
        <View name="semester-block-container" flex row overflow="auto">
          {this.state.semesters.map(semester => <Semester
            key={semester.id}
            semester={semester}
          />)}
        </View>
      </View>
      <View name="sidebar" backgroundColor={Color.background} width={20} padding>
        <View name="my-degree" flex>
          <Text large strong>My Degree</Text>
        </View>
        <View name="my-degree" flex>
          <View>
            <Text large strong>Starred Courses</Text>
          </View>
          <View flex>
            {this.state.courseInBucket.map(course => <Course
              key={course.id}
              course={course}
              onMouseUp={() => {
                this.setStore(previousState => ({
                  ...previousState,
                  dragging: false,
                }))
              }}
              onMouseDown={(e) => {
                const offsetLeft = e.currentTarget.offsetLeft;
                const offsetTop = e.currentTarget.offsetTop;
                const offsetX = e.pageX - offsetLeft;
                const offsetY = e.pageY - offsetTop;
                this.setStore(previousState => ({
                  ...previousState,
                  selectedCourseId: course.id,
                  dragging: true,
                  offsetX,
                  offsetY,
                }))
              }}
            />)}
          </View>
        </View>
      </View>
    </View>
  }
}