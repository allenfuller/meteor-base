import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import Navigation from '../../global/components/Navigation';

import Authenticated from '../../global/components/Authenticated';
import Authorized from '../../global/components/Authorized';
import Public from '../../global/components/Public';

import Index from '../../global/pages/Index';

import Documents from '../../global/pages/Documents';
import ViewDocument from '../../documents/pages/ViewDocument';
import EditDocument from '../../global/pages/EditDocument';

import Profile from '../../users/pages/Profile';
import Signup from '../../users/pages/Signup';
import Login from '../../users/pages/Login';
import Logout from '../../global/pages/Logout';

import VerifyEmail from '../../users/pages/VerifyEmail';
import RecoverPassword from '../../users/pages/RecoverPassword';
import ResetPassword from '../../users/pages/ResetPassword';

import AdminUsers from '../../global/pages/AdminUsers';
import AdminUser from '../../global/pages/AdminUser';
import AdminUserSettings from '../../admin/pages/AdminUserSettings';

import NotFound from '../../global/pages/NotFound';
import Footer from '../../global/components/Footer';

import Terms from '../../global/pages/Terms';
import Privacy from '../../global/pages/Privacy';
import ExamplePage from '../../global/pages/ExamplePage';

import VerifyEmailAlert from '../../global/components/VerifyEmailAlert';
import GDPRConsentModal from '../../global/components/GDPRConsentModal';

import withTrackerSsr from '../../../modules/withTrackerSsr';
import getUserName from '../../../modules/getUserName';

import Styles from './styles';

class App extends React.Component {
  state = { ready: false, afterLoginPath: null };

  componentDidMount() {
    this.setPageReady();
  }

  setPageReady = () => {
    this.setState({ ready: true });
  };

  setAfterLoginPath = (afterLoginPath) => {
    this.setState({ afterLoginPath });
  };

  render() {
    const { props, state, setAfterLoginPath } = this;
    return (
      <Styles.App ready={state.ready} loading={`${props.loading}`}>
        {props.authenticated && (
          <VerifyEmailAlert
            userId={props.userId}
            emailVerified={props.emailVerified}
            emailAddress={props.emailAddress}
          />
        )}
        {props.authenticated && <GDPRConsentModal userId={props.userId} />}
        <Navigation {...props} {...state} />
        <Grid>
          <Switch>
            <Route exact name="index" path="/" component={Index} />

            <Authenticated
              exact
              path="/documents"
              component={Documents}
              setAfterLoginPath={setAfterLoginPath}
              {...props}
              {...state}
            />
            <Route exact path="/documents/:_id" component={ViewDocument} />
            <Authenticated
              exact
              path="/documents/:_id/edit"
              component={EditDocument}
              setAfterLoginPath={setAfterLoginPath}
              {...props}
              {...state}
            />

            <Authenticated
              exact
              path="/profile"
              component={Profile}
              setAfterLoginPath={setAfterLoginPath}
              {...props}
              {...state}
            />
            <Public path="/signup" component={Signup} {...props} {...state} />
            <Public path="/login" component={Login} {...props} {...state} />
            <Route
              path="/logout"
              render={(routeProps) => (
                <Logout {...routeProps} setAfterLoginPath={setAfterLoginPath} />
              )}
              {...props}
              {...state}
            />

            <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
            <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
            <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />

            <Route name="terms" path="/terms" component={Terms} />
            <Route name="privacy" path="/privacy" component={Privacy} />
            <Route name="examplePage" path="/example-page" component={ExamplePage} />

            <Authorized
              exact
              allowedRoles={['admin']}
              path="/admin/users"
              pathAfterFailure="/"
              component={AdminUsers}
              setAfterLoginPath={setAfterLoginPath}
              {...props}
              {...state}
            />
            <Authorized
              exact
              allowedRoles={['admin']}
              path="/admin/users/settings"
              pathAfterFailure="/"
              component={AdminUserSettings}
              setAfterLoginPath={setAfterLoginPath}
              {...props}
              {...state}
            />
            <Authorized
              exact
              allowedRoles={['admin']}
              path="/admin/users/:_id"
              pathAfterFailure="/"
              component={AdminUser}
              setAfterLoginPath={setAfterLoginPath}
              {...props}
              {...state}
            />

            <Route component={NotFound} />
          </Switch>
        </Grid>
        <Footer />
      </Styles.App>
    );
  }
}

App.defaultProps = {
  loading: true,
  userId: '',
  emailAddress: '',
  emailVerified: false,
  authenticated: false,
};

App.propTypes = {
  loading: PropTypes.bool,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool,
  authenticated: PropTypes.bool,
};

export default withTrackerSsr(() => {
  const app = Meteor.subscribe('app');
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !app.ready() && !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: Roles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user.emails[0] && user.emails[0].verified : true,
  };
})(App);