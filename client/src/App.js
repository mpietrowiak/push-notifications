import React, { Component } from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import { styled } from '@material-ui/core/styles';

const StyledPaper = styled(Paper)({
  padding: '20px'
});

const StyledButton = styled(Button)({
  marginRight: '10px'
});

const App = () => {
  return (
    <Container>
      <StyledPaper>
        <h1>Push notifications demo</h1>
        <StyledButton variant="contained" color="primary">Subscribe to push</StyledButton>
        <StyledButton variant="contained" color="secondary">Unsubscribe from push</StyledButton>
      </StyledPaper>
    </Container>
  )
};

export default App;