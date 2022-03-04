import {
  documentToReactComponents,
  Options,
  RenderNode
} from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  AssetHyperlink,
  EntryHyperlink,
  Table,
  TableRow,
  TableHeaderCell,
  TableCell
} from "@contentful/rich-text-types";
import * as React from "react";
import { RichText, RichTextDocument } from ".";
import { RichTextReference, RichTextTopLevelBlock } from ".";

export interface RichTextAssetHyperlink extends AssetHyperlink {
  reference: RichTextReference;
}

export interface RichTextEntryHyperlink extends EntryHyperlink {
  reference: RichTextReference;
}

export interface RichTextRenderNode extends RenderNode {
  [BLOCKS.DOCUMENT]: (
    node: RichTextDocument,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.PARAGRAPH]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.HEADING_1]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.HEADING_2]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.HEADING_3]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.HEADING_4]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.HEADING_5]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.HEADING_6]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.EMBEDDED_ENTRY]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.UL_LIST]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.OL_LIST]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.LIST_ITEM]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.QUOTE]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.HR]: () => JSX.Element;
  [BLOCKS.TABLE]: (node: Table, children: React.ReactNode) => JSX.Element;
  [BLOCKS.TABLE_ROW]: (
    node: TableRow,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.TABLE_HEADER_CELL]: (
    node: TableHeaderCell,
    children: React.ReactNode
  ) => JSX.Element;
  [BLOCKS.TABLE_CELL]: (
    node: TableCell,
    children: React.ReactNode
  ) => JSX.Element;
  [INLINES.ASSET_HYPERLINK]: (node: RichTextAssetHyperlink) => JSX.Element;
  [INLINES.ENTRY_HYPERLINK]: (node: RichTextEntryHyperlink) => JSX.Element;
  [INLINES.EMBEDDED_ENTRY]: (node: RichTextTopLevelBlock) => JSX.Element;
  [INLINES.HYPERLINK]: (
    node: RichTextTopLevelBlock,
    children: React.ReactNode
  ) => JSX.Element;
}

export interface RichTextOptions extends Options {
  renderNode: RichTextRenderNode;
}

export const RichTextReact = ({
  content,
  options
}: {
  content: RichText;
  options: RichTextOptions;
}) => {
  const { json }: { json?: RichTextDocument } = { ...content };
  return json ? <>{documentToReactComponents(json, options)}</> : <></>;
};
