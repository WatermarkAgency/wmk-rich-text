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
      content?: [];
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
    const excerpt = (
      chars: number = 156,
      _content: RichText
    ): string => {
      const content: RichTextJsonContent[] = _content?.json?.content;
      let ret = ``;
      if (Array.isArray(content)) {
        //content.reverse();
        content.forEach((text) => {
          const type = text.nodeType;
          if (type === "paragraph") {
            const innerContent = text.content;
            if (Array.isArray(innerContent)) {
              innerContent.forEach((line) => {
                //console.log(line);
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
      return ret.slice(0, chars) + "..."; //this.content.json.content[
    };
    let refCount = 0;
    this.raw = get(node, `raw`);
    this.json = Array.isArray(get(json, `content`))
      ? {
          ...json,
          content: json.content.map(
            (j: { nodeType: string; data: object; content: object[] }) => {
              const { nodeType } = j;
              let r = null;
              if (nodeType.indexOf("embedded-") === 0) {
                r = _refs[refCount];
                refCount++;
              }
              return { ...j, references: r };
            }
          )
        }
      : null;
    this.references = _refs;
  }
}
