/* eslint-disable react/display-name */
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@rebass/grid';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { Github } from '@styled-icons/fa-brands/Github';
import { Twitter } from '@styled-icons/fa-brands/Twitter';
import { isURL, matches } from 'validator';
import { Formik, Field, Form } from 'formik';

import Container from '../../components/Container';
import { H1, P } from '../../components/Text';
import StyledInputField from '../../components/StyledInputField';
import StyledInputGroup from '../../components/StyledInputGroup';
import StyledHr from '../../components/StyledHr';
import CollectivePickerAsync from '../../components/CollectivePickerAsync';
import OnboardingProfileCard from './OnboardingProfileCard';
import OnboardingSkipButton from './OnboardingSkipButton';

import withViewport, { VIEWPORTS } from '../../lib/withViewport';

const messages = defineMessages({
  placeholder: {
    id: 'onboarding.contact.placeholder',
    defaultMessage: 'Write the name of who you want to invite',
  },
  twitterError: { id: 'onboarding.error.twitter', defaultMessage: 'Please enter a valid Twitter handle.' },
  githubError: { id: 'onboarding.error.github', defaultMessage: 'Please enter a valid Github handle.' },
  websiteError: { id: 'onboarding.error.website', defaultMessage: 'Please enter a valid URL.' },
});

const initialValues = {
  website: '',
  githubHandle: '',
  twitterHandle: '',
};

const validate = values => {
  const errors = {};

  if (isURL(values.website) === false) {
    errors.website = this.props.intl.formatMessage(this.messages['websiteError']);
  }
  // https://github.com/shinnn/github-username-regex
  if (matches(values.githubHandle, /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i) === false) {
    errors.githubHandle = this.props.intl.formatMessage(this.messages['githubError']);
  }

  if (matches(values.twitterHandle, /^[a-zA-Z0-9_]{1,15}$/) === false) {
    // https://stackoverflow.com/questions/11361044/twitter-name-validation
    errors.twitterHandle = this.props.intl.formatMessage(this.messages['twitterError']);
  }

  return errors;
};

const OnboardingContentBox = withViewport(function OnboardingContentBox({
  step,
  collective,
  updateAdmins,
  addContact,
  LoggedInUser,
  viewport,
  inputRef,
}) {
  const [admins, setAdmins] = useState([], admins => updateAdmins(admins));
  const intl = useIntl();
  const { formatMessage } = intl;
  const removeAdmin = collective => {
    const filteredAdmins = admins.filter(admin => admin.member.id !== collective.id);
    setAdmins(filteredAdmins);
  };

  return (
    <Container display="flex" flexDirection="column" width={['90%', '80%']} alignItems="center">
      {step === 0 && (
        <Flex flexDirection="column" alignItems="center" maxWidth={['336px']}>
          <H1
            fontSize={['H5']}
            lineHeight={['H5']}
            fontWeight="bold"
            color="black.900"
            textAlign="center"
            mb={[4]}
            mx={[2, null]}
          >
            <FormattedMessage
              id="onboarding.collective.created"
              defaultMessage="The {collective} Collective has been created!"
              values={{ collective: collective.name }}
            />
            &nbsp;🎉
          </H1>
          {viewport === VIEWPORTS.MOBILE && (
            <Fragment>
              <OnboardingSkipButton />
            </Fragment>
          )}
        </Flex>
      )}
      {step === 1 && (
        <Fragment>
          <Flex maxWidth={['336px']}>
            <H1 fontSize={['H5']} lineHeight={['H5']} fontWeight="bold" color="black.900" textAlign="center" mb={4}>
              <FormattedMessage id="onboarding.admins.header" defaultMessage="Add administrators" />
            </H1>
          </Flex>
          <Flex px={3} width="100%">
            <P my={2} fontSize="Caption" textTransform="uppercase" color="black.700">
              <FormattedMessage id="administrators" defaultMessage="Administrators" />
            </P>
            <Flex flexGrow={1} alignItems="center">
              <StyledHr width="100%" ml={2} />
            </Flex>
          </Flex>
          {admins.length > 0 && (
            <Flex px={3} width="100%" flexWrap="wrap">
              {admins.map(admin => (
                <OnboardingProfileCard
                  key={admin.member.id}
                  collective={admin.member}
                  adminCollective={LoggedInUser.collective}
                  removeAdmin={removeAdmin}
                />
              ))}
            </Flex>
          )}
          <Flex px={3} width="100%">
            <P my={2} fontSize="Caption" textTransform="uppercase" color="black.700">
              <FormattedMessage id="onboarding.admins.invite" defaultMessage="Invite administrators" />
            </P>
            <Flex flexGrow={1} alignItems="center">
              <StyledHr width="100%" ml={2} />
            </Flex>
          </Flex>

          <Flex my={2} px={3} flexDirection="column" width="100%">
            <CollectivePickerAsync
              creatable
              collective={null}
              preload={true}
              types={['USER']}
              onChange={option => {
                // only assign admins if they are not in the list already
                const duplicates = admins.filter(admin => admin.member.id === option.value.id);
                this.setState(
                  state => ({
                    admins: duplicates.length ? admins : [...state.admins, { role: 'ADMIN', member: option.value }],
                  }),
                  () => updateAdmins(this.state.admins),
                );
              }}
              placeholder={formatMessage(messages.placeholder)}
            />
          </Flex>
          <P my={2} fontSize="Caption" color="black.500" textAlign="center">
            <FormattedMessage
              id="onboarding.admins.caption"
              defaultMessage="Admins can modify the Collective page and approve expenses."
            />
          </P>
        </Fragment>
      )}
      {step === 2 && (
        <Fragment>
          <Box maxWidth={['336px']}>
            <H1 fontSize={['H5']} lineHeight={['H5']} fontWeight="bold" color="black.900" textAlign="center" mb={4}>
              <FormattedMessage id="onboarding.contact.header" defaultMessage="Links and contact info" />
            </H1>
          </Box>
          <Flex flexDirection="column" width="100%">
            <Formik
              ref={inputRef}
              validate={validate}
              initialValues={initialValues}
              onSubmit={values => console.log(values)}
              validateOnChange={true}
            >
              {formik => {
                const { values, errors, touched } = formik;

                return (
                  <Form>
                    <P>
                      <FormattedMessage id="onboarding.contact.website" defaultMessage="Do you have a website?" />
                    </P>
                    <StyledInputField
                      my={[3, 2]}
                      htmlFor="website"
                      value={values.website}
                      error={touched.website && errors.website}
                    >
                      {inputProps => (
                        <Field
                          as={StyledInputGroup}
                          type="text"
                          prepend="http://"
                          placeholder="www.agora.com"
                          {...inputProps}
                        />
                      )}
                    </StyledInputField>
                    <P>
                      <FormattedMessage
                        id="onboarding.contact.connect"
                        defaultMessage="Connect your social platforms"
                      />
                    </P>
                    <P my={2} fontSize="Caption" color="black.500">
                      <FormattedMessage
                        id="onboarding.contact.social"
                        defaultMessage="Tell your contributors how to reach your Collective through social media."
                      />
                    </P>
                    <Flex alignItems="center">
                      <Twitter size={20} color="black.500" />
                      <StyledInputField
                        ml={2}
                        my={2}
                        htmlFor="twitterHandle"
                        flexGrow={1}
                        value={values.twitterHandle}
                        error={touched.twitterHandle && errors.twitterHandle}
                      >
                        {inputProps => (
                          <Field as={StyledInputGroup} type="text" placeholder="agora" prepend="@" {...inputProps} />
                        )}
                      </StyledInputField>
                    </Flex>
                    <Flex alignItems="center">
                      <Github size={20} color="black.500" />
                      <StyledInputField
                        ml={2}
                        my={2}
                        htmlFor="githubHandle"
                        flexGrow={1}
                        value={values.githubHandle}
                        error={touched.githubHandle && errors.githubHandle}
                      >
                        {inputProps => (
                          <Field
                            as={StyledInputGroup}
                            type="text"
                            placeholder="agoraos"
                            prepend="github.com/"
                            {...inputProps}
                          />
                        )}
                      </StyledInputField>
                    </Flex>
                  </Form>
                );
              }}
            </Formik>
          </Flex>
        </Fragment>
      )}
    </Container>
  );
});

export default React.forwardRef((props, ref) => {
  return <OnboardingContentBox {...props} inputRef={ref} />;
});
