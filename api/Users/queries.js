import queryRoles from './actions/queryRoles';
import queryUser from './actions/queryUser';
import exportUserData from './actions/exportUserData';
import queryUsers from './actions/queryUsers';

export default {
  users: (parent, args, context) => {
    return queryUsers({
      currentUser: context.user,
      search: args.search ? new RegExp(args.search, 'i') : null,
      limit: args.perPage,
      skip: args.currentPage * args.perPage - args.perPage,
      sort: {
        'profile.name.last': 1,
        'services.facebook.first_name': 1,
        'services.google.name': 1,
        'services.github.username': 1,
      },
    });
  },
  user: (parent, args, context) => {
    const userIdFromParentQuery = parent && parent.userId;
    return queryUser({
      userIdToQuery: userIdFromParentQuery || args._id || context.user._id,
    });
  },
  exportUserData: (parent, args, { user }) => {
    return exportUserData({
      user,
    });
  },
  queryRoles,
};
