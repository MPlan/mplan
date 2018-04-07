import * as React from 'react';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { ActionableText } from './actionable-text';
import { CategoryItem } from './category-item';
import * as styles from '../styles';
import * as Model from '../models';
import * as Immutable from 'immutable';
import * as uuid from 'uuid/v4';

/*
 * each filter should:
 * 
 * * react to changes in the search
 * * show/hide more results
 * * 
 */

const Container = styled(View)`
  padding: ${styles.space(0)};
`;
const Header = styled(Text)`
  font-weight: ${styles.bold};
`;
const Item = styled(Text)`
  margin-left: ${styles.space(0)};
`;
const List = styled(View)``;

export interface Filter {
  id: string;
  apply: (course: Model.Course) => boolean;
}

export interface CategoryProps {
  name: string;
  courses: Immutable.Seq.Indexed<Model.Course>;
  categoryPicker: (course: Model.Course) => string;
  onFilterChange: (filter: Filter) => void;
}
interface CategoryState {
  activeCategories: { [key: string]: boolean | undefined };
}

export class Category extends React.Component<CategoryProps, CategoryState> {
  categoryId = uuid();
  constructor(props: CategoryProps) {
    super(props);
    this.state = {
      activeCategories: {},
    };
  }

  get distinctCategories() {
    return this.props.courses
      .map(course => this.props.categoryPicker(course))
      .reduce((distinctSet, pickedCategory) => {
        return distinctSet.set(pickedCategory, (distinctSet.get(pickedCategory) || 0) + 1);
      }, Immutable.Map<string, number>());
  }

  handleCategoryChange(category: string) {
    this.setState(previousState => {
      const previousActiveCategories = previousState.activeCategories;

      const newActiveCategories = {
        ...previousActiveCategories,
        [category]: !previousActiveCategories[category],
      };

      this.props.onFilterChange({
        id: this.categoryId,
        apply: (course: Model.Course) => {
          const category = this.props.categoryPicker(course);
          if (!newActiveCategories[category]) {
            return false;
          }
          return true;
        },
      });

      return {
        ...previousState,
        activeCategories: newActiveCategories,
      };
    });
  }

  render() {
    return (
      <Container>
        <Header>{this.props.name}</Header>
        <List>
          {this.distinctCategories
            .entrySeq()
            .sortBy(c => c[0])
            .take(10)
            .map(([category, count]) => (
              <CategoryItem
                category={category}
                count={count}
                checked={!!this.state.activeCategories[category]}
                onCategoryChange={() => {
                  this.handleCategoryChange(category);
                }}
              />
            ))}
        </List>
      </Container>
    );
  }
}
