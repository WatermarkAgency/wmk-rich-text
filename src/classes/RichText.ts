import { Block, Document } from "@contentful/rich-text-types";

export interface ContentfulRichTextQuery {
  raw: string;
  references?: { [key: string]: any }[];
}

export interface RichTextJson extends Document {
  references?: { [key: string]: any }[];
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
   * @param {Object} node - a Contentful RichText node
   */
  raw: string;
  json: RichTextJson;
  references?: { [key: string]: any }[];

  constructor(node: ContentfulRichTextQuery) {
    const _refs = node?.references || [];
    const raw = node.raw;
    const json: Document = JSON.parse(raw);
    let refCount = 0;
    this.raw = raw;
    this.json = Array.isArray(json.content)
      ? {
          ...json,
          content: json.content.map((j: Block) => {
            const { nodeType } = j;
            let r: { [key: string]: any } = undefined;
            if (nodeType.match(/^embedded/)) {
              r = _refs[refCount];
              refCount++;
            } else if (nodeType.match(/paragraph|heading/)) {
              j.content.map((pCon) => {
                const nodeType = pCon.nodeType;
                if (nodeType.match(/^entry|asset/)) {
                  r = _refs[refCount];
                  refCount++;
                  pCon.references = r;
                }
              });
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
      : null;
    this.references = _refs;
  }
  excerpt = (chars: number = 156, _content?: RichText): string => {
    const content: Block[] = _content
      ? _content?.json?.content
      : this.json.content;
    let ret = ``;
    if (Array.isArray(content)) {
      content.forEach((text) => {
        const type = text.nodeType;
        if (type === "paragraph") {
          const innerContent = text.content;
          if (Array.isArray(innerContent)) {
            innerContent.forEach((line) => {
              if (line.nodeType === "text") {
                ret = ret + line.value;
              } else {
                ret = ret + line.content[0].value;
              }
            });
          }
        }
      });
    }
    return ret.slice(0, chars) + "...";
  };
}
