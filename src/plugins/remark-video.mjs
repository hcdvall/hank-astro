// Turns Markdown images that point at a video (`![alt](/media/x.mp4)`)
// into an autoplaying, looping, muted <video>, so clips read like GIFs.
const VIDEO = /\.(mp4|webm)$/i;
const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function walk(node) {
  node.children?.forEach((child, i) => {
    if (child.type === 'image' && VIDEO.test(child.url)) {
      node.children[i] = {
        type: 'html',
        value: `<video src="${escape(child.url)}" autoplay loop muted playsinline aria-label="${escape(child.alt ?? '')}"></video>`,
      };
    } else {
      walk(child);
    }
  });
}

export default function remarkVideo() {
  return walk;
}
