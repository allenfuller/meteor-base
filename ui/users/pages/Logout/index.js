import React, { useContext, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

import Icon from '../../../global/components/Icon';
import { AuthContext } from '../../../global/context/Authentication';
import Styles from './styles';

const { facebook, productName, twitterUsername } = Meteor.settings.public;
const facebookUsername = facebook && facebook.username;

const Logout = () => {
  const { resetAuthState } = useContext(AuthContext);

  useEffect(() => {
    Meteor.logout();
    resetAuthState();
  }, []);

  return (
    <Styles.Logout>
      <img
        src="https://s3-us-west-2.amazonaws.com/cleverbeagle-assets/graphics/email-icon.png"
        alt="Clever Beagle"
      />
      <h1>Stay safe out there.</h1>
      <p>{`Don't forget to like and follow ${productName} elsewhere on the web:`}</p>
      <ul className="FollowUsElsewhere">
        <li>
          <a
            href={`https://facebook.com/${facebookUsername}?utm_source=app&utm_medium=referral&utm_campaign=logoutPage`}
          >
            <Icon iconStyle="brand" icon="facebook" />
          </a>
        </li>
        <li>
          <a
            href={`https://twitter.com/${twitterUsername}?utm_source=app&utm_medium=referral&utm_campaign=logoutPage`}
          >
            <Icon iconStyle="brand" icon="twitter" />
          </a>
        </li>
      </ul>
    </Styles.Logout>
  );
};

export default Logout;
