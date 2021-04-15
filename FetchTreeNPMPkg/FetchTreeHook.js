import componentObj from './componentStore';
import { Component } from 'react';

//Declare FetchTreeHook that user will import into their codebase
class FetchTreeHook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dummy: true,
    };
  }

  render() {
    window.postMessage({ type: 'componentObj', payload: componentObj }, "*");
    //Trigger state change to populate data in panel
    setTimeout(() => {
      this.setState({
        dummy: true,
      });
    }, 2000);
    return null;
  }
}

export default FetchTreeHook;