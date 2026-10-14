// Turns Markdown images that point at a video (`![alt](/media/x.mp4)`)
// into an autoplaying, looping, muted <video>, so clips read like GIFs.
//
// The URL goes in a <source> child rather than <video src>: Chromium tries to
// load a src while the ClientRouter is still parsing the next page off-screen,
// fails, and never retries once the page is swapped in.
const VIDEO = /\.(mp4|webm)$/i;
const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function walk(node) {
  node.children?.forEach((child, i) => {
    const match = child.type === 'image' && child.url.match(VIDEO);
    if (match) {
      const type = `video/${match[1].toLowerCase()}`;
      node.children[i] = {
        type: 'html',
        value: `<video autoplay loop muted playsinline aria-label="${escape(child.alt ?? '')}"><source src="${escape(child.url)}" type="${type}"></video>`,
      };
    } else {
      walk(child);
    }
  });
}

export default function remarkVideo() {
  return walk;
}
