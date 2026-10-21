import { YouTube } from "./YouTube";

/**
 * The body of a post written in the admin: HTML from the editor. YouTube
 * embeds the editor placed are swapped for the site's own player, which
 * loads nothing until play is pressed; everything else is set as it came.
 */
const YT_BLOCK = /<div[^>]*data-youtube-video[^>]*>[\s\S]*?<\/div>/gi;

export function RichBody({ html }: { html: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  const re = new RegExp(YT_BLOCK.source, "gi");
  while ((m = re.exec(html))) {
    if (m.index > last) parts.push(<div key={`h${i++}`} className="ins-rich" dangerouslySetInnerHTML={{ __html: html.slice(last, m.index) }} />);
    const id = m[0].match(/embed\/([A-Za-z0-9_-]{11})/)?.[1];
    const title = m[0].match(/title="([^"]*)"/)?.[1] ?? "Video";
    if (id) parts.push(<YouTube key={`v${i++}`} id={id} title={title} cover={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} eager={false} />);
    last = m.index + m[0].length;
  }
  if (last < html.length) parts.push(<div key={`h${i++}`} className="ins-rich" dangerouslySetInnerHTML={{ __html: html.slice(last) }} />);
  return <>{parts}</>;
}
