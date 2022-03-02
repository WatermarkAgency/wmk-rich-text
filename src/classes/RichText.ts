import {
  Block,
  Document,
  Inline,
  Text,
  TopLevelBlock
} from "@contentful/rich-text-types";

export interface RichTextReference {
  __typename: string;
  [key: string]: any;
}

export interface RichTextTopLeveBlock extends TopLevelBlock {
  references: RichTextReference;
}

export interface RichTextDocument extends Document {
  content: RichTextTopLeveBlock[];
}

export interface RichTextQuery {
  raw?: string;
  references?: RichTextReference[];
}

export interface RichTextBlock extends Block {
  references: RichTextReference;
}

export interface RichTextInline extends Inline {
  references: RichTextReference;
}

export interface RichTextText extends Text {
  references: RichTextReference;
}

/**
 * @class - Reshapes Contentful RichText data into
 * usable JSON for rendering. Also keeps track of
 * corresponding Asset/Entry references and associates
 * the data accordingly
 */
export class RichText {
  /**
   *
   */
  raw: string;
  json?: RichTextDocument;
  references: any[];

  constructor(node: RichTextQuery) {
    const _refs = node.references ? node.references : [];
    const raw = node.raw;
    const json: Document = JSON.parse(raw);
    let refCount = 0;
    this.raw = raw;
    this.json = Array.isArray(json.content)
      ? {
          ...json,
          content: json.content.map((j) => {
            const { nodeType } = j;
            let r = null;
            switch (true) {
              case Array.isArray(nodeType.match(/^embedded/)):
                r = _refs[refCount];
                refCount++;
                break;
              case Array.isArray(nodeType.match(/paragraph|heading/)):
                j.content.forEach(
                  (pCon: RichTextBlock | RichTextInline | RichTextText) => {
                    const nodeType = pCon.nodeType;
                    if (nodeType.match(/^entry|asset/)) {
                      r = _refs[refCount];
                      refCount++;
                      pCon.references = r;
                    }
                  }
                );
                break;
              case Array.isArray(nodeType.match(/list/)):
                j.content.forEach((lCon: TopLevelBlock) => {
                  const listCon = Array.isArray(lCon.content)
                    ? lCon.content
                    : [];
                  listCon.forEach(
                    (pCon: RichTextBlock | RichTextInline | RichTextText) => {
                      const nodeType = pCon.nodeType;
                      if (nodeType.match(/^entry|asset/)) {
                        r = _refs[refCount];
                        refCount++;
                        pCon.references = r;
                      }
                    }
                  );
                });
                break;
              case Array.isArray(nodeType.match(/quote/)):
                j.content.forEach((bCon: TopLevelBlock) => {
                  const blockQuote = Array.isArray(bCon.content)
                    ? bCon.content
                    : [];
                  blockQuote.forEach(
                    (pCon: RichTextBlock | RichTextInline | RichTextText) => {
                      const nodeType = pCon.nodeType;
                      if (nodeType.match(/^entry|asset/)) {
                        r = _refs[refCount];
                        refCount++;
                        pCon.references = r;
                      }
                    }
                  );
                });
                break;
              case Array.isArray(nodeType.match(/hr/)):
                break;
              default:
                console.log(
                  "The node: " +
                    nodeType +
                    " is not yet supported in the RichText class."
                );
            }
            return { ...j, references: r };
          })
        }
      : undefined;
    this.references = _refs;
  }
  excerpt = (chars: number = 156): string => {
    const content = this.json.content;
    let ret = ``;
    if (Array.isArray(content)) {
      content.forEach((text) => {
        const type = text.nodeType;
        if (type === "paragraph") {
          const innerContent = text.content as (
            | RichTextBlock
            | RichTextInline
            | RichTextText
          )[];
          if (Array.isArray(innerContent)) {
            innerContent.forEach((line) => {
              if (line.nodeType === "text") {
                ret = ret + line.value;
              } else {
                console.log("error: this should not happen:", line.content);
                //ret = ret + line.content[0].value;
              }
            });
          }
        }
      });
    }
    return ret.length > chars ? ret.slice(0, chars) + "..." : ret;
  };
}
