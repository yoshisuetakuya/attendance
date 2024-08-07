import { AppBar, Toolbar, Typography } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          勤怠管理システム
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
