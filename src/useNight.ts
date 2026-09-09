import {useCallback, useEffect, useReducer, useState} from 'react';
import {Action, createNight, reducer, restore, STORAGE_KEY} from './model';

export function useNight() {
  const [storageAvailable,setStorageAvailable]=useState(true);
  const [night,dispatch]=useReducer(reducer,undefined,()=>{
    try{return restore(localStorage.getItem(STORAGE_KEY));}catch{return createNight();}
  });
  useEffect(()=>{
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(night));}catch{setStorageAvailable(false);}
  },[night]);
  useEffect(()=>{const timer=window.setInterval(()=>dispatch({type:'TICK',wall:Date.now()}),1000);return()=>clearInterval(timer);},[]);
  const act=useCallback((action:Action)=>{dispatch({type:'TICK',wall:Date.now()});dispatch(action);},[]);
  return {night,act,storageAvailable};
}
