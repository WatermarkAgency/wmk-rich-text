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
  [key: string]: React.FunctionComponent<{ children: React.ReactNode }>;
} = {
  paragraph: ({
    children,
    style
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => (
    <div className="p" style={style}>
      {children}
    </div>
  ),
  "heading-1": ({
    children,
    style
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => <h1 style={style}>{children}</h1>,
  "heading-2": ({
    children,
    style
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => <h2 style={style}>{children}</h2>,
  "heading-3": ({
    children,
    style
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => <h3 style={style}>{children}</h3>,
  "heading-4": ({
    children,
    style
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => <h4 style={style}>{children}</h4>,
  "heading-5": ({
    children,
    style
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => <h5 style={style}>{children}</h5>,
  "heading-6": ({
    children,
    style
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
  }) => <h6 style={style}>{children}</h6>
};

export const NullComp = ({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
);

export interface BlockHash {
  [key: string]: (props: any) => JSX.Element;
}

export type RichTextChildren = (string | JSX.Element)[];

export type RichTextChild = string | JSX.Element;

export const blocksTypography = (
  node: RichTextNode,
  children: React.ReactNode,
  config?: {
    Component?: React.FunctionComponent<{
      node?: RichTextNode;
      children: React.ReactNode;
    }>;
    Wrapper?: React.FunctionComponent<{ children: React.ReactNode }>;
  }
) => {
  const TypeElement =
    node.nodeType in TypographyElements
      ? TypographyElements[node.nodeType]
      : ({ children }: { children: React.ReactNode }) => <>{children}</>;
  return config?.Component ? (
    config?.Wrapper ? (
      <config.Wrapper>
        <config.Component node={node}>{children}</config.Component>
      </config.Wrapper>
    ) : (
      <config.Component node={node}>{children}</config.Component>
    )
  ) : config?.Wrapper ? (
    <config.Wrapper>
      <TypeElement>{children}</TypeElement>
    </config.Wrapper>
  ) : (
    <TypeElement>{children}</TypeElement>
  );
};

export const blocksEmbeddedEntry = (
  node: RichTextNode,
  children?: [],
  blockHash?: BlockHash
) => {
  const entry = new EmbeddedBlock(
    node,
    blockHash
      ? blockHash
      : {
          Error: () => (
            <code>
              {children}
              Use: (node: RichTextNode) =&gt blocksEmbeddedEntry(node,
              blockHash), pass blockHash object.
              {console.log(`   Use: (node: RichTextNode) => blocksEmbeddedEntry(node,
              blockHash), pass blockHash object.`)}
            </code>
          )
        }
  );
  return entry.render();
};

export const blocksList = (
  node: RichTextBlock,
  children: React.ReactNode,
  config?: {
    Bullet?: JSX.Element;
    rowStyle?: React.CSSProperties;
    bulletSyle?: React.CSSProperties;
    textStyle?: React.CSSProperties;
  }
) => {
  const ListEl =
    node.nodeType in ListElements ? ListElements[node.nodeType] : NullComp;
  return config?.Bullet &&
    Array.isArray(node.content) &&
    Array.isArray(children) ? (
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
  children: [],
  Component?: React.FunctionComponent<{
    asset: ContentfulImageQuery;
    contentType: string;
  }>
) => {
  const asset = node?.reference?.data as ContentfulImageQuery;
  const type = asset?.file?.contentType || "";
  return Component ? (
    <Component asset={asset} contentType={type} />
  ) : type.match("image") ? (
    <WmkImage image={new Img(asset)} />
  ) : type.match("video") && asset?.file?.url ? (
    <ReactPlayer url={asset.file.url} />
  ) : (
    <NullComp>
      {children}
      <>{console.log(`error with type: ${type}`)}</>
    </NullComp>
  );
};

export const inlinesHyperlink = (
  node: RichTextNode,
  children: React.ReactNode,
  Component?: React.FunctionComponent<{
    node: RichTextNode;
    children: React.ReactNode;
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
  children: React.ReactNode,
  Component?: React.FunctionComponent<{
    asset: ContentfulAssetQuery;
    textNode: React.ReactNode;
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
  textNode: React.ReactNode;
}) => {
  return (
    <WmkLink to={asset?.file?.url} target="_blank">
      {handleRichTextChildren(textNode)}
    </WmkLink>
  );
};

export const handleRichTextChildren = (children: React.ReactNode) => {
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
  children: React.ReactNode,
  Component?: React.FunctionComponent<{
    node: RichTextNode;
    children: React.ReactNode;
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
  children: React.ReactNode,
  getTo?: (reference?: RichTextReference) => string
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
