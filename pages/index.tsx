import { Box, Button, Container, styled, TextField, Typography, useMediaQuery } from '@material-ui/core';
import Head from 'next/head';
import React, { useEffect } from 'react';

import NoSsr from '../components/NoSsr';

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'var(--color-font-main)',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'var(--color-font-main)',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--color-font-main)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-font-main)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-font-main)',
    },
  },
});

export default function Home() {
  const [url, setUrl] = React.useState<string>('');
  const largeScreen = useMediaQuery('(min-width:600px)');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('url')) goToSite(params.get('url'));
    else if (params.get('text')) goToSite(params.get('text'));
  }, []);

  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToSite(url);
  };
  return (
    <NoSsr>
      <Head>
        <title>Skip App</title>
        <meta name="application-name" content="Skip App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Skip App" />
        <meta name="description" content="Best Skip App in the world" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Box display="flex" height="100%" flexDirection="column">
        <Container>
          <Box display="flex" flexDirection="column" mt={4} style={{}}>
            <Typography align="center" variant="h5" gutterBottom>
              A super simple app with one purpose, no ads, no tracking and no cookies.
            </Typography>
            <form onSubmit={onSubmit} style={{ width: '100%' }}>
              <StyledTextField
                id="url"
                label="Url"
                placeholder="Paste link here"
                value={url}
                onChange={onUrlChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: { color: 'var(--color-font-main)' },
                }}
                InputProps={{
                  style: { color: 'var(--color-font-main)' },
                }}
              />
              <Box mt={2} />
              <Typography variant="body1" gutterBottom>
                Enter the url of any page with annoying content that needs to be skipped and you will be redirected to a
                site where you shuould be able to read you content unobstructed.
              </Typography>
              <Typography variant="body1" gutterBottom>
                Also, if you would like to save this site site as an executable bookmarklet, you will be able to click a
                bookmark whilst you are on the offending page and be automatically redirected.
              </Typography>
              <NoSsr>
                <Typography variant="body1" gutterBottom>
                  Simply drag{' '}
                  {!isServer() && (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `<a href="javascript:window.location.replace(\`${window?.location?.origin}/?url=\$\{window.location.href\}\`);"
                       title='Skip it!'>This link</a>`,
                      }}
                    ></span>
                  )}{' '}
                  to your book marks bar. Then head to a site where you want to skip, and click the book bark whilst
                  there.
                </Typography>
              </NoSsr>
              <Typography variant="body1" gutterBottom>
                Alternatively, if you are on mobile, you should also get a prompt asking your to add this site to your
                home screen. By installing this Progressive Web App (PWA) you will be able to
              </Typography>
              <ul>
                <li>Access this site as a fullscreen app experience the same way you would access a normal app</li>
                <li>
                  Ability to &quot;Share&quot; any url that you are currently on straight to the app - this can be done
                  in as little as two clicks!
                </li>
              </ul>
              <Box mt={18} />
            </form>
            <Box flexGrow={1} />
            <Box position="fixed" bottom={24} right={0} width="100%" display="flex" justifyContent="center">
              <Button
                style={{ width: largeScreen ? '50%' : '80%' }}
                variant="contained"
                color="primary"
                onClick={onSubmit}
                disabled={url.length === 0}
              >
                Skip it!
              </Button>
              <Box mt={4} />
            </Box>
          </Box>
        </Container>
      </Box>
    </NoSsr>
  );
}

function goToSite(url: string) {
  const redirectTo = `https://archive.ph/newest/${url}`;
  window.location.replace(redirectTo);
}

function isServer() {
  return typeof window === `undefined`;
}
