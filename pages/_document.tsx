import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* ROOT STYLES */}
          <style>{`
            #__next {
            }
          `}</style>

          {/* FONTS */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet" />

          {/* FAVICON */}
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#000000" />
          <meta name="theme-color" content="#ffffff" />

          {/* META */}
          <title>Deck Viewer - Adventure Cards</title>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
          <noscript>
            <img
              src="https://queue.simpleanalyticscdn.com/noscript.gif"
              alt=""
              referrerPolicy="no-referrer-when-downgrade"
            />
          </noscript>
        </body>
      </Html>
    )
  }
}
