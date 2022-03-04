import {
  documentToReactComponents,
  NodeRenderer,
  Options
} from "@contentful/rich-text-react-renderer";
import { AssetHyperlink, EntryHyperlink } from "@contentful/rich-text-types";
import * as React from "react";
import { RichText, RichTextDocument } from ".";
import { RichTextReference } from ".";
import { RichTextBlock, RichTextInline } from "./classes/RichText";

export interface RichTextAssetHyperlink extends AssetHyperlink {
  reference: RichTextReference;
}

export interface RichTextEntryHyperlink extends EntryHyperlink {
  reference: RichTextReference;
}

export interface RichTextNodeRenderer extends NodeRenderer {
  (
    node: RichTextBlock | RichTextInline,
    children: React.ReactNode
  ): React.ReactNode;
}

export interface RichTextRenderNode {
  [k: string]: RichTextNodeRenderer;
}

export interface RichTextOptions extends Options {
  renderNode?: RichTextRenderNode;
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
