import * as React from "react";
import { RenderMark, RenderText } from "@contentful/rich-text-react-renderer";
import { INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types";
import {
  blocksEmbeddedEntry,
  blocksList,
  blocksTypography,
  inlinesHyperlink,
  inlinesAssetHyperlink,
  inlinesEmbeddedEntry,
  inlinesEntryHyperlink
} from "../handlers/handlers";
import { RichTextNode } from "../classes/RichText";
import { RichTextRenderNode } from "..";

export const getRichTextOptions = (options?: {
  renderNode?: RichTextRenderNode;
  renderMark?: RenderMark;
  renderText?: RenderText;
}) => {
  const renderNode: RichTextRenderNode = {
    [BLOCKS.PARAGRAPH]:
      options?.renderNode[BLOCKS.PARAGRAPH] ||
      defaultNodeRenderers[BLOCKS.PARAGRAPH],
    [BLOCKS.PARAGRAPH]:
      options?.renderNode[BLOCKS.PARAGRAPH] ||
      defaultNodeRenderers[BLOCKS.PARAGRAPH],
    [BLOCKS.HEADING_1]:
      options?.renderNode[BLOCKS.HEADING_1] ||
      defaultNodeRenderers[BLOCKS.HEADING_1],
    [BLOCKS.HEADING_2]:
      options?.renderNode[BLOCKS.HEADING_2] ||
      defaultNodeRenderers[BLOCKS.HEADING_2],
    [BLOCKS.HEADING_3]:
      options?.renderNode[BLOCKS.HEADING_3] ||
      defaultNodeRenderers[BLOCKS.HEADING_3],
    [BLOCKS.HEADING_4]:
      options?.renderNode[BLOCKS.HEADING_4] ||
      defaultNodeRenderers[BLOCKS.HEADING_4],
    [BLOCKS.HEADING_5]:
      options?.renderNode[BLOCKS.HEADING_5] ||
      defaultNodeRenderers[BLOCKS.HEADING_5],
    [BLOCKS.HEADING_6]:
      options?.renderNode[BLOCKS.HEADING_6] ||
      defaultNodeRenderers[BLOCKS.HEADING_6],
    [BLOCKS.EMBEDDED_ENTRY]:
      options?.renderNode[BLOCKS.EMBEDDED_ENTRY] ||
      defaultNodeRenderers[BLOCKS.EMBEDDED_ENTRY],
    [BLOCKS.UL_LIST]:
      options?.renderNode[BLOCKS.UL_LIST] ||
      defaultNodeRenderers[BLOCKS.UL_LIST],
    [BLOCKS.OL_LIST]:
      options?.renderNode[BLOCKS.OL_LIST] ||
      defaultNodeRenderers[BLOCKS.OL_LIST],
    [BLOCKS.LIST_ITEM]:
      options?.renderNode[BLOCKS.OL_LIST] ||
      defaultNodeRenderers[BLOCKS.LIST_ITEM],
    [BLOCKS.QUOTE]:
      options?.renderNode[BLOCKS.QUOTE] || defaultNodeRenderers[BLOCKS.QUOTE],
    [BLOCKS.HR]:
      options?.renderNode[BLOCKS.HR] || defaultNodeRenderers[BLOCKS.HR],
    [INLINES.ASSET_HYPERLINK]:
      options?.renderNode[INLINES.ASSET_HYPERLINK] ||
      defaultNodeRenderers[INLINES.ASSET_HYPERLINK],
    [INLINES.EMBEDDED_ENTRY]:
      options?.renderNode[INLINES.EMBEDDED_ENTRY] ||
      defaultNodeRenderers[INLINES.EMBEDDED_ENTRY],
    [INLINES.ENTRY_HYPERLINK]:
      options?.renderNode[INLINES.ENTRY_HYPERLINK] ||
      defaultNodeRenderers[INLINES.ENTRY_HYPERLINK],
    [INLINES.HYPERLINK]:
      options?.renderNode[INLINES.HYPERLINK] ||
      defaultNodeRenderers[INLINES.HYPERLINK]
  };
  const renderMark = options?.renderMark || defaultMarkRenderers;
  const renderText = options?.renderText;
  return {
    renderNode,
    renderMark,
    renderText
  };
};

const defaultNodeRenderers: RichTextRenderNode = {
  [BLOCKS.PARAGRAPH]: blocksTypography,
  [BLOCKS.HEADING_1]: blocksTypography,
  [BLOCKS.HEADING_2]: blocksTypography,
  [BLOCKS.HEADING_3]: blocksTypography,
  [BLOCKS.HEADING_4]: blocksTypography,
  [BLOCKS.HEADING_5]: blocksTypography,
  [BLOCKS.HEADING_6]: blocksTypography,
  [BLOCKS.EMBEDDED_ENTRY]: (node: RichTextNode) => blocksEmbeddedEntry(node),
  [BLOCKS.UL_LIST]: blocksList,
  [BLOCKS.OL_LIST]: blocksList,
  [BLOCKS.LIST_ITEM]: (node, children) => (
    <li key={node.nodeType}>{children}</li>
  ),
  [BLOCKS.QUOTE]: (node, children) => (
    <blockquote key={node.nodeType}>{children}</blockquote>
  ),
  [BLOCKS.HR]: () => <hr />,
  [INLINES.ASSET_HYPERLINK]: inlinesAssetHyperlink,
  [INLINES.ENTRY_HYPERLINK]: inlinesEntryHyperlink,
  [INLINES.EMBEDDED_ENTRY]: inlinesEmbeddedEntry,
  [INLINES.HYPERLINK]: inlinesHyperlink
};

// const defaultRenderText = (text: string): React.ReactNode => {
//   return text.split("\n").reduce((children, textSegment, index) => {
//     return [...children, index > 0 && <br key={index} />, textSegment];
//   }, []);
// };

const defaultMarkRenderers: RenderMark = {
  [MARKS.BOLD]: (text) => <b>{text}</b>,
  [MARKS.ITALIC]: (text) => <i>{text}</i>,
  [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
  [MARKS.CODE]: (text) => <code>{text}</code>
};

// function defaultInline(type: string, node: Inline): React.ReactNode {
//   return (
//     <span key={node.data.target.sys.id}>
//       type: {node.nodeType} id: {node.data.target.sys.id}
//     </span>
//   );
// }
