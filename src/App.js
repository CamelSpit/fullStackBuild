import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {Switch, Route} from 'react-router-dom';
import Home from './components/Home';
import Private from './components/Private';


class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/private' component={Private}/>
        </Switch>
      </div>
    );
  }
}

export default App;
