import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Hello, I'm Amovane, a software engineer from china. I'm learning
          blockchain technology in recent time. I've made some opensource projects on <a href="https://github.com/amovane" target="_blank"> Amovane's Github</a>.
        </p>
        <p>
          This's my blog, I'll share some personal experiences about programing.
        </p>
      </section>
    </Layout>
  );
}
