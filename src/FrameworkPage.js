import { Component, createRef } from 'react';

export class FrameworkPage extends Component {
  #ref = createRef();

  render() {
    // Check the public/ folder for the definition of this custom element.
    // The code for this page has been built using Snap Framework, so it needed to
    // be located in a place outside of React's reach.
    return <snapjs-framework-page ref={this.#ref}/>;
  }

  componentWillUnmount() {
    this.#ref.current.api.uninit();
  }
}
