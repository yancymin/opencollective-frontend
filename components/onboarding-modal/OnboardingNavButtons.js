/* eslint-disable prefer-arrow-callback */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '@rebass/grid';
import { FormattedMessage } from 'react-intl';

import StyledRoundButton from '../../components/StyledRoundButton';
import StyledButton from '../../components/StyledButton';

import { Router } from '../../server/pages';
import withViewport, { VIEWPORTS } from '../../lib/withViewport';

const params = {
  0: {
    disabled: true,
    routerStepForward: 'administrators',
  },
  1: {
    disabled: false,
    routerStepBack: undefined,
    routerStepForward: 'contact',
  },
  2: {
    disabled: false,
    routerStepBack: 'administrators',
  },
};

const getStepParams = (step, param) => {
  return params[step][param];
};

const OnboardingNavButtons = withViewport(function OnboardingNavButtons({
  step,
  mode,
  slug,
  submitCollectiveInfo,
  loading,
  viewport,
  inputRef,
  handleClick,
}) {
  return (
    <Flex>
      {step === 2 ? (
        <Fragment>
          {viewport === VIEWPORTS.MOBILE ? (
            <StyledButton
              mx={1}
              buttonStyle="primary"
              disabled={getStepParams(step, 'disabled')}
              onClick={() => {
                Router.pushRoute('collective-with-onboarding', {
                  slug,
                  mode,
                  step: getStepParams(step, 'routerStepBack'),
                });
              }}
            >
              <FormattedMessage id="contribute.prevStep" defaultMessage="Previous step" />
            </StyledButton>
          ) : (
            <StyledRoundButton
              mx={1}
              size={48}
              disabled={getStepParams(step, 'disabled')}
              onClick={() => {
                Router.pushRoute('collective-with-onboarding', {
                  slug,
                  mode,
                  step: getStepParams(step, 'routerStepBack'),
                });
              }}
            >
              ←
            </StyledRoundButton>
          )}

          <StyledButton buttonStyle="primary" type="submit" onClick={handleClick} ref={inputRef} loading={loading}>
            <FormattedMessage id="Finish" defaultMessage="Finish" />
          </StyledButton>
        </Fragment>
      ) : (
        <Fragment>
          {viewport === VIEWPORTS.MOBILE ? (
            <StyledButton
              mx={1}
              buttonStyle="primary"
              disabled={getStepParams(step, 'disabled')}
              onClick={() => {
                Router.pushRoute('collective-with-onboarding', {
                  slug,
                  mode,
                  step: getStepParams(step, 'routerStepBack'),
                });
              }}
            >
              <FormattedMessage id="contribute.prevStep" defaultMessage="Previous step" />
            </StyledButton>
          ) : (
            <StyledRoundButton
              mx={1}
              size={48}
              disabled={getStepParams(step, 'disabled')}
              onClick={() => {
                Router.pushRoute('collective-with-onboarding', {
                  slug,
                  mode,
                  step: getStepParams(step, 'routerStepBack'),
                });
              }}
            >
              ←
            </StyledRoundButton>
          )}
          {viewport === VIEWPORTS.MOBILE ? (
            <StyledButton
              mx={1}
              buttonStyle="primary"
              onClick={() => {
                Router.pushRoute('collective-with-onboarding', {
                  slug,
                  mode,
                  step: getStepParams(step, 'routerStepForward'),
                });
              }}
            >
              <FormattedMessage id="contribute.nextStep" defaultMessage="Next step" />
            </StyledButton>
          ) : (
            <StyledRoundButton
              mx={1}
              size={48}
              onClick={() => {
                Router.pushRoute('collective-with-onboarding', {
                  slug,
                  mode,
                  step: getStepParams(step, 'routerStepForward'),
                });
              }}
            >
              →
            </StyledRoundButton>
          )}
        </Fragment>
      )}
    </Flex>
  );
});

// class OnboardingNavButtons extends React.Component {
//   static propTypes = {
//     step: PropTypes.number,
//     slug: PropTypes.string,
//     mode: PropTypes.string,
//     submitCollectiveInfo: PropTypes.func,
//     loading: PropTypes.bool,
//     viewport: PropTypes.object,
//   };
// }

// export default withViewport(OnboardingNavButtons);

// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => {
  return <OnboardingNavButtons {...props} inputRef={ref} />;
});
