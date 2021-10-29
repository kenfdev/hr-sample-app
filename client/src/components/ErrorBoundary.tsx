import React from 'react';

export default class ErrorBoundary extends React.Component {
  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
    // window.location.href = '/login';
  }

  render() {
    return this.props.children;
  }
}
