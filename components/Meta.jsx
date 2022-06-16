import Head from "next/head";

export default function Meta({ description = "", url = "", title = "" }) {
  return (
    <Head>
      <meta name="description" content={description}></meta>
      <meta property="og:url" content={url}></meta>
      <meta property="og:type" content="website"></meta>
      <meta property="og:title" content={title}></meta>
      <meta property="og:description" content={description}></meta>
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta name="twitter:title" content={title}></meta>
      <meta name="twitter:description" content={description}></meta>
      <meta name="twitter:site" content={url}></meta>
      <title>{title}</title>

      <link rel="icon" href={process.env.NEXT_PUBLIC_LOGO} />
      <link rel="canonical" href={url} />
    </Head>
  );
}
