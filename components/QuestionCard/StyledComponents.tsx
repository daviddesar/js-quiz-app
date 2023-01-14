import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const ModalContentContainer = styled(Box)({
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  backgroundColor: '#252525',
  color: 'white',
  padding: '24px',
  borderRadius: '8px',
});

export const PrimaryButton = styled(Button)({
  backgroundColor: 'white',
  color: 'black',
  ':hover': {
    backgroundColor: 'white',
    color: 'black',
  },
});
