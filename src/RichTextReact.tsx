import {
  documentToReactComponents,
  Options
} from "@contentful/rich-text-react-renderer";
import * as React from "react";
import { RichText, RichTextDocument } from ".";

export const RichTextReact = ({
  content,
  options
}: {
  content: RichText;
  options: Options;
}) => {
  const { json }: { json?: RichTextDocument } = { ...content };
  return json ? <>{documentToReactComponents(json, options)}</> : <></>;
};
