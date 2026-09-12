import Footer from "../../components/Footer";

export default function ShowcaseContactFooter({ footerId, pageKey, description, tagline, links = [], note }) {
  return <Footer footerId={footerId} pageKey={pageKey} description={description} tagline={tagline} pageLinks={links} note={note} />;
}
