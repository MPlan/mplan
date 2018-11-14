import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { wait } from 'utilities/utilities';
import { searchList } from 'utilities/search-list';

import { View } from 'components/view';
import { Text, TextProps } from 'components/text';
import { GiantAutosuggest } from 'components/giant-autosuggest';
import { PrimaryButton } from 'components/button';
import { Fa } from 'components/fa';
import { Paragraph } from 'components/paragraph';
import { createInfoModal } from 'components/info-modal';

const Root = styled(View)`
  background-color: ${styles.deepCove};
  flex: 1 1 auto;
  position: relative;
`;
const Slide = styled(View)`
  position: absolute;
  height: 100%;
  width: 100%;
  transition: left 500ms;
`;
const Box = styled(View)`
  margin: auto;
  width: 64rem;
  max-width: 100vw;
  align-items: flex-start;
`;
const Title = styled(Text)`
  font-size: ${styles.space(4)};
  color: ${styles.turbo};
  font-weight: bold;
`;
const Subtitle = styled(Text)`
  color: ${styles.white};
  font-size: ${styles.space(3)};
  font-weight: bold;
  margin-bottom: ${styles.space(1)};
`;
const Description = styled(Text)`
  color: ${styles.white};
  font-size: ${styles.space(2)};
  margin-bottom: ${styles.space(0)};
`;
const Arrow = styled(Fa)`
  margin-left: ${styles.space(0)};
`;
const YearInfo = styled(Text)`
  color: ${styles.white};
  font-size: ${styles.space(1)};
  margin-bottom: ${styles.space(0)};
`;
interface SuggestionProps extends TextProps {
  selected?: boolean;
}
const Suggestion = styled<SuggestionProps>(Text)`
  font-size: ${styles.space(2)};
  background-color: ${props => (props.selected ? styles.deepKoamaru : 'transparent')};
  color: ${styles.turbo};
  padding: ${styles.space(0)};
`;
const Mail = styled.a`
  color: ${styles.turbo};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: ${styles.beeKeeper};
  }
`;
const Link = styled.a`
  color: ${styles.blue};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &:active {
    color: ${styles.active(styles.blue)};
  }
`;
const NotPart = styled(Text)`
  margin-top: ${styles.space(0)};
  color: ${styles.white};
  &:hover {
    text-decoration: underline;
    color: ${styles.beeKeeper};
  }
  &:active {
    color: ${styles.active(styles.beeKeeper)};
  }
`;
const SelectedDegree = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${styles.space(0)};
`;
const SelectedDegreeName = styled(Text)`
  font-size: ${styles.space(3)};
  font-weight: bold;
  color: ${styles.turbo};
  flex: 1 1 auto;
`;
const Times = styled(Fa)`
  margin-left: ${styles.space(2)};
  color: ${styles.white};
  &:hover {
    color: ${styles.hover(styles.white)};
  }
  &:active {
    color: ${styles.active(styles.white)};
  }
`;

interface WelcomeProps {
  degrees: Model.MasteredDegree.Model[];
}

interface WelcomeState {
  gotStarted: boolean;
  search: string;
  selectedDegreeId: string | undefined;
}

const getDisplayText = (degree: Model.MasteredDegree.Model) => degree.name;
const getKey = (degree: Model.MasteredDegree.Model) => degree.id;

export class Welcome extends React.PureComponent<WelcomeProps, WelcomeState> {
  state: WelcomeState = {
    gotStarted: false,
    search: '',
    selectedDegreeId: undefined,
  };

  searchRef = React.createRef<HTMLInputElement>();
  buttonRef = React.createRef<HTMLButtonElement>();
  infoModal = createInfoModal();
  notPartInfoModal = createInfoModal();

  get degrees() {
    return searchList(this.props.degrees, getDisplayText, this.state.search);
  }

  get selectedDegreeName() {
    const { selectedDegreeId } = this.state;
    const { degrees } = this.props;
    if (!selectedDegreeId) return undefined;
    const selectedDegree = degrees.find(degree => degree.id === selectedDegreeId);
    if (!selectedDegree) return undefined;
    return selectedDegree.name;
  }

  componentDidMount() {
    const buttonElement = this.buttonRef.current;
    if (!buttonElement) return;
    buttonElement.focus();
  }

  async componentDidUpdate(_: any, previousState: WelcomeState) {
    if (!previousState.gotStarted && this.state.gotStarted) {
      const searchElement = this.searchRef.current;
      if (!searchElement) return;
      await wait(500);
      searchElement.focus();
    }
  }

  handleGetStarted = () => {
    this.setState({ gotStarted: true });
  };

  handleSearch = (search: string) => {
    this.setState({ search });
  };

  handleSelectDegree = (selectedDegreeId: string) => {
    this.setState({ selectedDegreeId });
  };
  handleUnselectDegree = () => {
    this.setState({ selectedDegreeId: undefined });
  };

  renderSuggestion = (degree: Model.MasteredDegree.Model, selected: boolean) => {
    return <Suggestion selected={selected}>{degree.name}</Suggestion>;
  };

  render() {
    const { gotStarted } = this.state;
    const InfoModal = this.infoModal.Modal;
    const NotPartModal = this.notPartInfoModal.Modal;

    return (
      <>
        <Root>
          <Slide style={{ left: gotStarted ? '-100%' : 0 }}>
            <Box>
              <Title>It's nice to meet you,</Title>
              <Subtitle>Welcome to MPlan!</Subtitle>
              <Description>
                MPlan is a degree planner that makes it simple to understand your degree and plan
                for your future.
              </Description>
              <PrimaryButton innerRef={this.buttonRef} onClick={this.handleGetStarted}>
                Get Started <Arrow icon="chevronRight" />
              </PrimaryButton>
            </Box>
          </Slide>
          <Slide style={{ left: gotStarted ? 0 : '100%' }}>
            <Box>
              <Subtitle>Tell us your degree:</Subtitle>
              <YearInfo>
                Pick the degree with the year you enrolled in it
                <br />
                or ask your <Mail href="mailto:umd-cecs-undergrad@umich.edu">CECS advisor</Mail> if
                you need additional assistance.
              </YearInfo>
              {this.selectedDegreeName ? (
                <SelectedDegree>
                  <SelectedDegreeName>{this.selectedDegreeName}</SelectedDegreeName>
                  <Times icon="times" size="4x" onClick={this.handleUnselectDegree} />
                </SelectedDegree>
              ) : (
                <GiantAutosuggest
                  focus={gotStarted}
                  items={this.degrees}
                  getDisplayText={getDisplayText}
                  getKey={getKey}
                  onSelectSuggestion={this.handleSelectDegree}
                  renderSuggestion={this.renderSuggestion}
                  onSearch={this.handleSearch}
                  onClickDontSee={this.infoModal.open}
                />
              )}

              <PrimaryButton>
                Let's begin <Arrow icon="chevronRight" />
              </PrimaryButton>
              <NotPart onClick={this.notPartInfoModal.open}>
                Not part of the College of Engineering and Computer Science?
              </NotPart>
            </Box>
          </Slide>
        </Root>
        <InfoModal title="Don't see your degree?">
          <Paragraph>MPlan is a degree planner that is curated by academic advisors.</Paragraph>
          <Paragraph>
            Currently, MPlan is only supported by the Advising Office of the College of Engineering
            and Computer Science.
          </Paragraph>
          <Paragraph>
            If you are a CECS student and you don't see your degree, please contact{' '}
            <Link href="mailto:mailto:umd-cecs-undergrad@umich.edu">CECS advising</Link>.
          </Paragraph>
          <Text>
            If you would like to request MPlan be available for other colleges, please{' '}
            <Link href="https://goo.gl/forms/gXeFMCTGVIHE9HDX2" target="_blank">
              use this form
            </Link>
            .
          </Text>
        </InfoModal>
        <NotPartModal title="Not part of the College of Engineering and Computer Science?">
          <Paragraph>
            MPlan is curated by the CECS advising office with CECS students in mind. However, that
            doesn't mean that MPlan can't be used by all students at the University.
          </Paragraph>
          <Paragraph>
            Use{' '}
            <Link href="https://goo.gl/forms/gXeFMCTGVIHE9HDX2" target="_blank">
              this form
            </Link>{' '}
            to request MPlan be available for other colleges and we'll notify your respective
            advising departments.
          </Paragraph>
          <Text>Thank you!</Text>
        </NotPartModal>
      </>
    );
  }
}
