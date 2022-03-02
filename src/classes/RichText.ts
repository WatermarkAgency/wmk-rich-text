import {
  Block,
  Document,
  Inline,
  Text,
  TopLevelBlock
} from "@contentful/rich-text-types";

export interface RichTextTopLeveBlock extends TopLevelBlock {
  references: any[];
}

export interface RichTextDocument extends Document {
  content: RichTextTopLeveBlock[];
}

export interface RichTextQuery {
  raw: string;
  references: any[];
}

export interface RichTextBlock extends Block {
  references: object;
}

export interface RichTextInline extends Inline {
  references: object;
}

export interface RichTextText extends Text {
  references: object;
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
            if (nodeType.match(/^embedded/)) {
              r = _refs[refCount];
              refCount++;
            } else if (nodeType.match(/paragraph|heading/)) {
              j.content.map(
                (pCon: RichTextBlock | RichTextInline | RichTextText) => {
                  const nodeType = pCon.nodeType;
                  if (nodeType.match(/^entry|asset/)) {
                    r = _refs[refCount];
                    refCount++;
                    pCon.references = r;
                  }
                }
              );
            } else {
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
