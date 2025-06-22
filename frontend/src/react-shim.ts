// React compatibility shim for Vercel build environment
import * as ReactNamespace from 'react';
import * as ReactDOMNamespace from 'react-dom';

// Export React with all hooks explicitly
export const React = ReactNamespace;
export const ReactDOM = ReactDOMNamespace;

export const {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useReducer,
  useLayoutEffect,
  createContext,
  createElement,
  Fragment,
  Component,
  memo,
  forwardRef,
  Children,
  isValidElement,
} = ReactNamespace;

export default ReactNamespace;