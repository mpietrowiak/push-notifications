import './App.css';
import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { styled } from '@material-ui/core/styles';
import PushNotificationsDemo from './PushNotificationsDemo';

const StyledPaper = styled(Paper)({
  padding: '20px'
});

const App = () => (
  <Container>
    <StyledPaper>
      <h1>Push notifications</h1>

      <PushNotificationsDemo />
    </StyledPaper>
  </Container>
);

export default App;