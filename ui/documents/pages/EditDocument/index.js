import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@apollo/client/react/hoc';

import Loading from '../../../global/components/Loading';
import NotFound from '../../../global/pages/NotFound';
import DocumentEditor from '../../components/DocumentEditor';
import { editDocument as editDocumentQuery } from '../../queries/Documents.gql';

const EditDocument = ({ data, history }) => (
  <React.Fragment>
    {!data.loading ? (
      <React.Fragment>
        {data.document ? <DocumentEditor doc={data.document} history={history} /> : <NotFound />}
      </React.Fragment>
    ) : (
      <Loading />
    )}
  </React.Fragment>
);

EditDocument.propTypes = {
  data: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default graphql(editDocumentQuery, {
  options: ({ match }) => ({
    variables: {
      _id: match.params._id,
    },
  }),
})(EditDocument);
