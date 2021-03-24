import {test1, testDR, fetchUser, fetchPosts} from './fakeApi';
import React from 'react';

console.log(test1);
console.log(testDR);

export class ClassTest extends React.Component {
  componentDidMount() {
    fetchUser();
  }

  render() {
    return(
    <h1>Hello World</h1>
    )
  }
}

export const CreateClassTest = React.createClass({
  componentDidMount() {
    fetchPosts();
  },

  render() {    
     return (  
         <div>    
          <h2>    
            {this.state.title}   
          </h2>    
          <p>User Name: {this.props.name}</p>  
          <p>User Age: {this.props.age}</p>  
        </div>  
     );    
  }  
    
})
