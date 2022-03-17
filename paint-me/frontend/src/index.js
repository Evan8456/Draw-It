import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import { ChakraProvider } from '@chakra-ui/react';
import drawing from "./assets/draw.jpeg"

const initial = {page: "login"};

const logInReducer = (state=initial, action) => {
  switch(action.type) {
    case "CARDTYPE":
      state = {page: action.payload};
  }


  return state;
};

const startState = {
  private: [{name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}],
  public: [{name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}, {name:"Title", drawing: drawing}]
}

const dashboardReducer = (state=startState, action) => {
  let temp;
  switch(action.type) {
    case "addPrivate":
      temp = {...state}
      temp.private = temp.private + action.payload
      return temp
    case "addPublic":
      temp = {...state}
      temp.public = temp.public + action.payload
      return temp
    case "removePrivate":
      temp = {...state}
      temp.private =  temp.private.filter((e) => {return (e.name != action.payload.name && e.drawing != action.payload.drawing)})
      return temp
    case "removePublic":
      temp = {...state}
      temp.public =  temp.public.filter((e) => {return (e.name != action.payload.name && e.drawing != action.payload.drawing)})
      return temp
    default:
      return state;
  }
}

const store = createStore(combineReducers({login: logInReducer, dashboard: dashboardReducer}));

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
