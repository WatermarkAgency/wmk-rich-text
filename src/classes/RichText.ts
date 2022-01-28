import get from "lodash/get";

export interface RichTextJsonContent {
  content: {
    data: {};
    marks: [];
    nodeType: string;
    value: string;
    content?: {
      data: {};
      marks: [];
      nodeType: string;
      value: string;
      content?: {
        data: {};
        marks: [];
        nodeType: string;
        value: string;
        content?: [];
        references?: {};
      }[];
    }[];
  }[];
  data: {};
  nodeType: string;
  references: [];
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
  json: {
    nodeType: string;
    data: object;
    content: RichTextJsonContent[];
  };
  references: [];

  constructor(node: object) {
    const _refs = get(node, `references`, []);
    const raw = get(node, `raw`);
    const json = raw ? JSON.parse(raw) : get(node, `json`);
    let refCount = 0;
    this.raw = get(node, `raw`);
    this.json = Array.isArray(get(json, `content`))
      ? {
          ...json,
          content: json.content.map(
            (j: {
              nodeType: string;
              data: object;
              content?: {
                nodeType: string;
                data: object;
                references: {};
                content: [];
              }[];
            }) => {
              const { nodeType } = j;
              let r = null;
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
            }
          )
        }
      : null;
    this.references = _refs;
  }
  excerpt = (chars: number = 156, _content: RichText): string => {
    const content: RichTextJsonContent[] = _content?.json?.content;
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
