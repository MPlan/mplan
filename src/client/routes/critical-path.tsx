import * as React from 'react';
import * as Model from '../models';
import { View, Text, Button } from '../components';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';
import styled from 'styled-components';
import * as styles from '../styles';
import { flatten } from '../../utilities/utilities';

const SvgContainer = styled(View) `
  flex: 1;
  background-color: ${styles.background};
  z-index: 30;
`;

export class CriticalPath extends Model.store.connect() {

  componentDidMount() {

    function dragstarted(d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const catalog = this.store.catalog;
    const preferredCourses = this.store.user.preferredCourses;

    const courseClosure = this.store.user.closure(catalog).toArray();

    const nodesForD3 = courseClosure.map(course => /*if*/ course instanceof Model.Course
      ? { id: `${course.subjectCode} ${course.courseNumber}` }
      : { id: `${course}` }
    );

    const linksForD3 = flatten(courseClosure.map(course => {
      const targets = (/*if*/ course instanceof Model.Course
        ? course
          .bestOption(catalog, preferredCourses)
          .map(c => c instanceof Model.Course
            ? `${c.subjectCode} ${c.courseNumber}`
            : c
          )
          .toArray()
        : [course]
      );

      const courseString = (/*if*/ course instanceof Model.Course
        ? `${course.subjectCode} ${course.courseNumber}`
        : course
      );

      return targets.map(target => ({
        source: courseString,
        target
      }));
    }));

    console.log('nodesForD3', nodesForD3);
    console.log('linksForD3', linksForD3);

    const svg = select('.critical-path-svg');
    const width = parseInt(svg.attr('width'), 10);
    const height = parseInt(svg.attr('height'), 10);

    const simulation = forceSimulation()
      .force("link", forceLink().id((d: any) => d.id).distance(10))
      .force("charge", forceManyBody().strength(-500))
      .force("center", forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(linksForD3)
      .enter()
      .append("line")
      .attr('stroke', 'blue');

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodesForD3)
      .enter()
      .append("svg:text")
      .text(function (d: any, i) {
        return d.id
      })
      .style("fill", "#555")
      .style("font-family", "Arial")
      .style("font-size", 12)
      .call((drag() as any)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));;

    simulation
      .nodes(nodesForD3)
      .on("tick", ticked);

    (simulation as any).force("link").links(linksForD3);

    function ticked() {
      link
        .attr("x1", function (d) { return (d as any).source.x; })
        .attr("y1", function (d) { return (d as any).source.y; })
        .attr("x2", function (d) { return (d as any).target.x; })
        .attr("y2", function (d) { return (d as any).target.y; });

      node
        .attr("x", function (d) { return (d as any).x; })
        .attr("y", function (d) { return (d as any).y; })
      // .attr("x2", function (d) { return (d as any).x; })
      // .attr("y2", function (d) { return (d as any).y; });
    }
  }

  render() {
    return <View>
      <Button onClick={() => { this.componentDidMount() }}>refresh graph</Button>
      <View>
        <Text strong>Courses in degree</Text>
        <View>
          {this.store.user.degree
            .map(course => /*if*/ course instanceof Model.Course
              ? `${course.subjectCode} ${course.courseNumber}`
              : course
            )
            .map((courseName, index) => <Text key={index}>{courseName}</Text>)
          }
        </View>
      </View>
      <SvgContainer>
        <svg width={1280} height={800} className="critical-path-svg" />
      </SvgContainer>
    </View>;
  }
}
