import {
  documentToReactComponents,
  NodeRenderer,
  Options
} from "@contentful/rich-text-react-renderer";
import {
  AssetHyperlink,
  Block,
  EntryHyperlink,
  Inline
} from "@contentful/rich-text-types";
import * as React from "react";
import { RichText, RichTextDocument } from ".";
import { RichTextReference } from ".";
import { RichTextBlock, RichTextInline } from "./classes/RichText";
import { getRichTextOptions } from "./options/richTextOptions";

export interface RichTextAssetHyperlink extends AssetHyperlink {
  reference?: RichTextReference;
}

export interface RichTextEntryHyperlink extends EntryHyperlink {
  reference?: RichTextReference;
}

export interface RichTextNodeRenderer extends NodeRenderer {
  (
    node: RichTextBlock | RichTextInline | Block | Inline,
    children: React.ReactNode
  ): React.ReactNode;
}

export interface RichTextRenderMark {
  [k: string]: RichTextMarkRender
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
  content?: RichText;
  options?: RichTextOptions;
}) => {
  if (content) {
    const json = content.richText();
    return json ? (
      <>
        {documentToReactComponents(
          json as RichTextDocument,
          options || getRichTextOptions()
        )}
      </>
    ) : (
      <></>
    );
  } else {
    return <></>;
  }
};
