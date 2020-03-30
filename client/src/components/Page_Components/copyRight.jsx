// React
import React from 'react';
// Material
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

export default function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/ReqApp">
          Req
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }