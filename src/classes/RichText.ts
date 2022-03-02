import { Document } from "@contentful/rich-text-types";

export interface RichTextQuery {
  raw: string;
  references: any[];
}

export interface ReferenceData {
  [key: string]: any;
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
  json?: Document;
  references: any[];
  constructor(_node: RichTextQuery) {
    const node = _node ? { ..._node } : undefined;
    const _refs = node?.references ? node.references : [];
    const raw = node?.raw ? node.raw : "";
    const json: Document = raw ? JSON.parse(raw) : undefined;
    let refCount = 0;
    const refactorRefs = (json: Document) => {
      const refData: ReferenceData = {};
      if (json && Array.isArray(json.content)) {
        json.content.forEach((j) => {
          const { nodeType } = j;
          let r = null;
          if (nodeType.match(/^embedded/)) {
            r = _refs[refCount];
            refCount++;
          } else if (nodeType.match(/paragraph|heading/)) {
            j.content.map((pCon) => {
              const pNodeType = pCon.nodeType;
              if (pNodeType.match(/^entry|asset/)) {
                r = _refs[refCount];
                refCount++;
                // pCon.references = r;
                refData[pCon.data.target.sys.id] =
                  typeof r === "object" && Object.keys(r).length > 0
                    ? { ...r }
                    : {
                        type: "error",
                        error:
                          "Query data is missing or this content is archived. ",
                      };
              }
            });
          } else {
            // console.log(
            //   "The node: " +
            //     nodeType +
            //     " is not yet supported in the RichText class."
            // );
          }

          return { ...j };
        });
      } else {
        return undefined;
      }
      const ret =
        json && Array.isArray(json.content)
          ? {
              ...json,
              references: refData,
            }
          : undefined;
      //console.log(Object.keys(refData).length > 0 && ret);
      return ret;
    };
    this.raw = raw;
    this.json = refactorRefs(json);

    this.references = _refs;
  }
  excerpt = (chars: number = 156): string => {
    const content = this.json.content;
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
                console.log(
                  "This shouldn't happen:",
                  line,
                  line.content,
                  line.content[0]
                );
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
