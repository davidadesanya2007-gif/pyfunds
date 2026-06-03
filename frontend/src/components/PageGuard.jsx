import PageLoader from "./PageLoader";

function PageGuard({ loading, children }) {

  if (loading) {

    return <PageLoader />;

  }

  return children;

}

export default PageGuard;