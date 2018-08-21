import PropTypes from "prop-types";
import React, { Component } from "react";

import AppSearchContext from "./AppSearchContext";

/**
 * The AppSearchProvider is the glue that connects the AppSearchDriver to
 * our React App.
 *
 * It "subscribes" to the AppSearchDriver in order to be notified of state
 * changes. It then syncs that state with its own state and passes that state
 * down to child components in a React Context. It will also pass down "Actions"
 * from the AppSearchDriver, which allow child components to update state.
 *
 * Any "Container" component placed within this context will have access
 * to the Driver's state and Actions.
 *
 */
class AppSearchProvider extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    driver: PropTypes.shape({
      getActions: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired,
      subscribeToStateChanges: PropTypes.func.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = props.driver.getState();
    props.driver.subscribeToStateChanges(state => this.setState(state));
  }

  render() {
    const { children, driver } = this.props;

    const providerValue = {
      ...this.state,
      ...driver.getActions()
    };

    return (
      <AppSearchContext.Provider value={providerValue}>
        {children(providerValue)}
      </AppSearchContext.Provider>
    );
  }
}

export default AppSearchProvider;
