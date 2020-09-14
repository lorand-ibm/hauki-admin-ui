import React from 'react';
import NavigationAndFooterWrapper from './components/navigation-and-footer-wrapper/NavigationAndFooterWrapper';
import './App.css';

export default function App(): JSX.Element {
  return (
    <div className="App">
      <NavigationAndFooterWrapper>
        <div id="main">Demosisältöä</div>
      </NavigationAndFooterWrapper>
    </div>
  );
}
