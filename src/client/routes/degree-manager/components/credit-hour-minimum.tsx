import * as React from 'react';
import { shallowEqualNoFunctions } from 'utilities/shallow-equal-no-functions';

import { Paragraph } from 'components/paragraph';
import { CreditHourEditor } from 'components/credit-hour-editor';
import { createInfoModal } from 'components/info-modal';
import { ActionableText } from 'components/actionable-text';
import { Text } from 'components/text';
import { DegreeItem } from 'routes/degree-manager/components/degree-item';
import { DescriptionAction } from 'routes/degree-manager/components/description-action';

interface CreditHourMinimumProps {
  minimumCreditHours: number;
  onChange: (minimumCreditHours: number) => void;
}

export class CreditHourMinimum extends React.Component<CreditHourMinimumProps, {}> {
  shouldComponentUpdate(nextProps: CreditHourMinimumProps) {
    return !shallowEqualNoFunctions(this.props, nextProps);
  }

  infoModal = createInfoModal();

  render() {
    const { minimumCreditHours, onChange } = this.props;
    const InfoModal = this.infoModal.Modal;
    return (
      <>
        <DegreeItem title="Credit hour minimum">
          <DescriptionAction
            description={
              <>
                <Paragraph>
                  All degree programs must have credit hour minimum. This number represents the
                  minimum amount of credit hours required in order to graduate with this degree.
                </Paragraph>
                <Paragraph>
                  If the student does not have enough courses on their degree worksheet to total the
                  credit hour minimum, they will be presented with a warning.
                </Paragraph>
                <Paragraph>
                  <strong>Note:</strong> MPlan is <em>not</em> a degree audit. Though this credit
                  hour minimum provides some degree validation, it is not meant to be thorough.
                </Paragraph>
                <ActionableText onClick={this.infoModal.open}>
                  Click here for more info
                </ActionableText>
              </>
            }
          >
            <CreditHourEditor creditHours={minimumCreditHours} onChange={onChange} />
          </DescriptionAction>
        </DegreeItem>
        <InfoModal title="Credit hour minimum">
          <Text>More info coming soon.</Text>
        </InfoModal>
      </>
    );
  }
}
