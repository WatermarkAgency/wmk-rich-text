import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import * as React from "react";
import { RichText } from "../../dist";
import { Document } from "@contentful/rich-text-types";

export interface RichTextOptions {
  renderNode: {
    [key: string]: (node: object, children?: React.ReactChild) => JSX.Element;
  };
}

export const RichTextReact = ({
  content,
  options
}: {
  content: RichText;
  options: RichTextOptions;
}) => {
  const { json } = { ...content };
  return <>{documentToReactComponents(json, options)}</>;
};
