import { Container } from '../../pages/questions/index';
import { default as GoToIcon } from '@mui/icons-material/Plagiarism';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

const ButtonIconClick = styled(IconButton)({
  color: 'white',
});

const Menu = () => {
  return (
    <Container sx={{ marginBottom: 3 }}>
      <ButtonIconClick>
        <GoToIcon />
      </ButtonIconClick>
    </Container>
  );
};

export default Menu;
