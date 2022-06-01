import { RichTextNode } from "../classes/RichText";
import { EmbeddedBlock } from "../classes/EmbeddedBlock";
import React from "react";
import {
  ContentfulAssetQuery,
  ContentfulImageQuery,
  Img,
  WmkImage
} from "wmk-image";
import { WmkLink } from "wmk-link";
import { RichTextReference, RichTextBlock } from "../classes/RichText";

import { Container, Row, Col } from "react-bootstrap";
import ReactPlayer from "react-player";

const ListElements: {
  [key: string]: React.FunctionComponent<{
    children: React.ReactNode;
    style?: React.CSSProperties;
  }>;
} = {
  "ordered-list": ({
    children,
    style
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => {
    return <ol style={style}>{children}</ol>;
  },
  "unordered-list": ({
    children,
    style
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => {
    return <ul style={style}>{children}</ul>;
  }
};

const TypographyElements: {
  [key: string]: React.FunctionComponent<{ children: RichTextChildren }>;
} = {
  paragraph: ({
    children,
    style
  }: {
    children: RichTextChildren;
    style?: React.CSSProperties;
  }) => (
    <div className="p" style={style}>
      {handleRichTextChildren(children)}
    </div>
  ),
  "heading-1": ({
    children,
    style
  }: {
    children: RichTextChildren;
    style?: React.CSSProperties;
  }) => <h1 style={style}>{handleRichTextChildren(children)}</h1>,
  "heading-2": ({
    children,
    style
  }: {
    children: RichTextChildren;
    style?: React.CSSProperties;
  }) => <h2 style={style}>{handleRichTextChildren(children)}</h2>,
  "heading-3": ({
    children,
    style
  }: {
    children: RichTextChildren;
    style?: React.CSSProperties;
  }) => <h3 style={style}>{handleRichTextChildren(children)}</h3>,
  "heading-4": ({
    children,
    style
  }: {
    children: RichTextChildren;
    style?: React.CSSProperties;
  }) => <h4 style={style}>{handleRichTextChildren(children)}</h4>,
  "heading-5": ({
    children,
    style
  }: {
    children: RichTextChildren;
    style?: React.CSSProperties;
  }) => <h5 style={style}>{handleRichTextChildren(children)}</h5>,
  "heading-6": ({
    children,
    style
  }: {
    children: RichTextChildren;
    style?: React.CSSProperties;
  }) => <h6 style={style}>{handleRichTextChildren(children)}</h6>
};

export const NullComp = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export interface BlockHash {
  [key: string]: (props: { [key: string]: any }) => JSX.Element;
}

export type RichTextChildren = (string | JSX.Element)[];

export type RichTextChild = string | JSX.Element;

export const blocksTypography = (
  node: RichTextNode,
  children: RichTextChildren,
  config?: {
    Component?: React.FunctionComponent<{
      node: RichTextNode;
      children: RichTextChildren;
    }>;
    Wrapper?: React.FunctionComponent<{ children: React.ReactNode }>;
  }
) => {
  const TypeElement =
    node.nodeType in TypographyElements
      ? TypographyElements[node.nodeType]
      : ({ children }: { children: RichTextChildren }) => (
          <>{handleRichTextChildren(children)}</>
        );
  return config?.Component ? (
    config?.Wrapper ? (
      <config.Wrapper>
        <config.Component node={node} children={children}></config.Component>
      </config.Wrapper>
    ) : (
      <config.Component node={node} children={children} />
    )
  ) : config?.Wrapper ? (
    <config.Wrapper>
      <TypeElement>
        <></>
        {handleRichTextChildren(children)}
      </TypeElement>
    </config.Wrapper>
  ) : (
    <TypeElement>
      <></>
      {handleRichTextChildren(children)}
    </TypeElement>
  );
};

export const blocksEmbeddedEntry = (
  node: RichTextNode,
  blockHash?: BlockHash
) => {
  const entry = new EmbeddedBlock(
    node,
    blockHash
      ? blockHash
      : {
          Error: () => (
            <code>
              Use: (node: RichTextNode) =&gt blocksEmbeddedEntry(node,
              blockHash), pass blockHash object.
            </code>
          )
        }
  );
  return entry.render();
};

export const blocksList = (
  node: RichTextBlock,
  children: RichTextChildren,
  config?: {
    Bullet?: JSX.Element;
    rowStyle?: React.CSSProperties;
    bulletSyle?: React.CSSProperties;
    textStyle?: React.CSSProperties;
  }
) => {
  const ListEl =
    node.nodeType in ListElements
      ? ListElements[node.nodeType]
      : ({ children }: { children: React.ReactNode }) => <>{children}</>;
  return config?.Bullet && Array.isArray(node.content) ? (
    <Container>
      <ListEl style={config?.Bullet ? { listStyleType: "none" } : undefined}>
        {node.content.map((n, i) => {
          return (
            <Row
              key={n.nodeType + i}
              style={
                config?.rowStyle || {
                  padding: `0.25rem 0rem`,
                  display: "flex",
                  alignItems: "flex-start"
                }
              }>
              <Col xs="auto" style={config?.bulletSyle}>
                {config.Bullet}
              </Col>
              <Col style={config?.textStyle}>
                {handleRichTextChildren([children[i]])}
              </Col>
            </Row>
          );
        })}
      </ListEl>
    </Container>
  ) : (
    <ListEl>{handleRichTextChildren(children)}</ListEl>
  );
};

export const blocksEmbeddedAsset = (
  node: RichTextNode,
  Component?: React.FunctionComponent<{
    asset: ContentfulImageQuery;
    contentType: string;
  }>
) => {
  const asset = node?.reference?.data as ContentfulImageQuery;
  const type = asset?.file?.contentType;
  return Component ? (
    <Component asset={asset} contentType={type} />
  ) : type.match("image") ? (
    <WmkImage image={new Img(asset)} />
  ) : type.match("video") && asset?.file?.url ? (
    <ReactPlayer url={asset.file.url} />
  ) : (
    <NullComp>
      <>{console.log(`error with type: ${type}`)}</>
    </NullComp>
  );
};

export const inlinesHyperlink = (
  node: RichTextNode,
  children: RichTextChildren,
  Component?: React.FunctionComponent<{
    node: RichTextNode;
    children: RichTextChildren;
  }>
) => {
  return Component ? (
    <Component node={node} children={children} />
  ) : (
    <WmkLink to={node.data.uri as string} target="_blank">
      {handleRichTextChildren(children)}
    </WmkLink>
  );
};

export const inlinesAssetHyperlink = (
  node: RichTextNode,
  children: RichTextChildren,
  Component?: React.FunctionComponent<{
    asset: ContentfulAssetQuery;
    textNode: RichTextChildren;
  }>
) => {
  const asset = node?.reference?.data as ContentfulAssetQuery;
  return Component ? (
    <Component asset={asset} textNode={children} />
  ) : (
    <DefaultAssetLink asset={asset} textNode={children} />
  );
};

const DefaultAssetLink = ({
  asset,
  textNode
}: {
  asset: ContentfulAssetQuery;
  textNode: RichTextChildren;
}) => {
  return (
    <WmkLink to={asset?.file?.url} target="_blank">
      {handleRichTextChildren(textNode)}
    </WmkLink>
  );
};

export const handleRichTextChildren = (children: RichTextChildren) => {
  return (
    <>
      {Array.isArray(children)
        ? children.map((n, i) => {
            return typeof n === "string" ? (
              <NullComp key={i + n}>{n}</NullComp>
            ) : (
              <NullComp key={`${i}${n.type === "string" ? n.type : "symbol"}`}>
                {n}
              </NullComp>
            );
          })
        : null}
    </>
  );
};

export const inlinesEmbeddedEntry = (
  node: RichTextNode,
  children: RichTextChildren,
  Component?: React.FunctionComponent<{
    node: RichTextNode;
    children: RichTextChildren;
  }>
) => {
  return Component ? (
    <Component node={node} children={children} />
  ) : (
    <>{`No Component Present for ${node.nodeType}`}</>
  );
};

export const inlinesEntryHyperlink = (
  node: RichTextNode,
  children: RichTextChildren,
  getTo?: (reference: RichTextReference) => string
) => {
  const noTo = () => {
    console.log("no getTo function for node:", node);
    return `#`;
  };
  return (
    <WmkLink to={getTo ? getTo(node.reference) : noTo()}>
      {handleRichTextChildren(children)}
    </WmkLink>
  );
};
