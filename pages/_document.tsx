import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

export default class Document extends NextDocument {
  // fontUrl = 'https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap'

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* ROOT STYLES HERE */}
          <style>{`
            #__next {
            }
          `}</style>

          {/* START FONT BOILERPLATE */}
          {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link rel="preload" as="style" href={this.fontUrl} />
          <link
            rel="stylesheet"
            href={this.fontUrl}
            media="print"
            // @ts-ignore
            onLoad="this.media='all'"
          />
          <noscript>
            <link rel="stylesheet" href={this.fontUrl} />
          </noscript> */}
          {/* END FONT BOILERPLATE */}

          {/* START FONT BOILERPLATE */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet" />
          {/* END FONT BOILERPLATE */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
