import './App.css';
import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { styled } from '@material-ui/core/styles';
import PushNotificationsDemo from './PushNotificationsDemo';
import { SnackbarProvider } from 'notistack';

const StyledPaper = styled(Paper)({
  padding: '20px'
});

const App = () => (
  <SnackbarProvider>
    <Container>
      <StyledPaper>
        <h1>Push notifications</h1>

        <PushNotificationsDemo />
      </StyledPaper>
    </Container>
  </SnackbarProvider>
);

export default App;