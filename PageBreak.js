// src/components/PageBreak.js
import { Node, mergeAttributes } from '@tiptap/core';

const PageBreak = Node.create({
  name: 'pageBreak',
  group: 'block',
  atom: true,

  parseHTML() {
    return [{ tag: 'div.page-break' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'page-break' })];
  },
});

export default PageBreak;
