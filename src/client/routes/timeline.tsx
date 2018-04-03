import * as React from 'react';
import { View, Text, Box, Button, Course, Semester, CourseWithPrerequisites } from '../components';
import * as styles from '../styles';
import * as Record from 'recordize';
import * as Model from '../models';
import * as Immutable from 'immutable';
import { Warnings } from './warnings';
import styled from 'styled-components';

const CreateSemesterContainer = styled(View)`
  /* border: ${styles.border}; */
  margin: ${styles.space(0)};
  padding: ${styles.space(0)};
  justify-content: center;
  align-items: center;
  background-color: white;
  box-shadow: ${styles.boxShadow(0)};
`;

const Level = styled(View)`
  width: 20rem;
  min-width: 20rem;
  margin: 1rem;
`;

const LevelCard = styled(View)`
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(0)};
  overflow: auto;
  flex: 1;

  & > * {
    flex-shrink: 0;
  }
`;

const LevelHeader = styled(View)`
  margin: ${styles.space(0)};
  /* margin-left: ${styles.space(-1)}; */
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

interface CreateSemesterProps {
  onCreateClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function CreateSemester(props: CreateSemesterProps) {
  return (
    <CreateSemesterContainer>
      <Button onClick={props.onCreateClick}>
        <Text>+ new semester</Text>
      </Button>
    </CreateSemesterContainer>
  );
}

const TimelineContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  position: relative;
`;

const FloatingCourseContainer = styled(View)`
  position: absolute;
`;

const Content = styled(View)`
  flex: 1;
  overflow: auto;
`;

const Header = styled(View)`
  padding: ${styles.space(0)};
  flex-direction: row;
`;

const HeaderMain = styled(View)`
  flex: 1;
`;

const HeaderRight = styled(View)``;

const SemesterBlockContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  overflow: auto;
`;

const SideBar = styled(View)`
  width: 20rem;
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(0)};
`;

export class Timeline extends Model.store.connect() {
  handleMouseMove = (e: MouseEvent) => {
    // this.setGlobalStore(store => store
    //   .set('x', e.clientX)
    //   .set('y', e.clientY)
    // );
  };

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleCourseMouseDown = (e: React.MouseEvent<HTMLDivElement>, course: Model.Course) => {
    // const offsetLeft = e.currentTarget.offsetLeft;
    // const offsetTop = e.currentTarget.offsetTop;
    // const offsetX = e.pageX - offsetLeft;
    // const offsetY = e.pageY - offsetTop;
    // this.setStore(store => store
    //   .set('selectedCourseId', course.id)
    //   .set('dragging', true)
    //   .set('offsetX', offsetX)
    //   .set('offsetY', offsetY)
    // );
  };

  handleCourseMouseUp = (e: React.MouseEvent<HTMLDivElement>, course: Model.Course) => {
    // this.setStore(store => store.set('dragging', false))
  };

  onCreateSemesterBefore = () => {
    // const id = Model.ObjectId();
    // this.setGlobalStore(store => {
    //   const firstSemester = store.semesters[0];
    //   const { season, year } = firstSemester.previousSemester();
    //   return store.update('semesterMap', semesterMap =>
    //     semesterMap.set(id.toHexString(), new Model.Semester({
    //       _id: id,
    //       season,
    //       year,
    //     })));
    // });
  };

  onCreateSemesterAfter = () => {
    // const id = Model.ObjectId();
    // this.setGlobalStore(store => {
    //   const firstSemester = store.semesters[store.semesters.length - 1];
    //   const { season, year } = firstSemester.nextSemester();
    //   return store.update('semesterMap', semesterMap =>
    //     semesterMap.set(id.toHexString(), new Model.Semester({
    //       _id: id,
    //       season,
    //       year,
    //     })));
    // });
  };

  handleMouseEnterSemester = (semester: Model.Semester) => {
    // console.log('mouse enter');
    // this.setGlobalStore(store => store
    //   .set('mouseIsOverSemester', true)
    //   .set('lastMouseOverSemesterId', semester.id)
    // );
  };

  handleMouseLeaveSemester = (semester: Model.Semester) => {
    // console.log('mouse elave')
    // this.setGlobalStore(store => store.set('mouseIsOverSemester', false));
  };

  handleCourseSemesterDeleteClick(course: Model.Course, semester: Model.Semester) {
    // this.setGlobalStore(store => {
    //   return store.update('semesterMap', semesterMap =>
    //     semesterMap.update(semester.id, s =>
    //       s.update('courseMap', courseMap =>
    //         courseMap.delete(course.id))));
    // });
  }

  onCourseMouseDown(course: Model.Course) {
    // this.setGlobalStore(store => store
    //   .set('selectedCourseId', course.id)
    //   .set('dragging', true)
    // );
  }

  render() {
    return (
      <TimelineContainer>
        <Content>
          <Header>
            <HeaderMain>
              <Text strong extraLarge>
                Timeline
              </Text>
              <Text>Create your MPlan here.</Text>
            </HeaderMain>

            <HeaderRight>
              <Text strong>Expected Graduation:</Text>
              <Text strong large>
                April 2018
              </Text>
            </HeaderRight>
          </Header>

          <SemesterBlockContainer />
        </Content>
      </TimelineContainer>
    );
  }
}
