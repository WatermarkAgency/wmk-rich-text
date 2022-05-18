import {
  Block,
  Document,
  Inline,
  Text,
  TopLevelBlock
} from "@contentful/rich-text-types";

export interface RichTextReferenceQuery {
  __typename: string;
  contentful_id: string;
  [key: string]: any;
}

export interface RichTextReference {
  __typename: string;
  data: { [key: string]: any };
}

export interface RichTextTopLevelBlock extends TopLevelBlock {
  reference?: RichTextReference;
}

export interface RichTextDocument extends Document {
  content: RichTextTopLevelBlock[];
}

export interface RichTextQuery {
  raw?: string;
  references?: RichTextReferenceQuery[];
}

export interface RichTextBlock extends Block {
  reference?: RichTextReference;
}

export interface RichTextInline extends Inline {
  reference?: RichTextReference;
}

export interface RichTextText extends Text {
  reference?: RichTextReference;
}

export interface RichtTextNodeData {
  target: {
    sys: {
      id: string;
      linkType: string;
      type: string;
    };
  };
}

export type RichTextNode = RichTextText | RichTextBlock | RichTextInline;

enum BLOCKTYPE {
  EMBEDDED = "embedded",
  PARAGRAPH = "paragraph",
  HEADING = "heading",
  ENTRY = "entry",
  ASSET = "asset",
  HORIZONTAL_RULE = "hr",
  LIST = "list",
  TEXT = "text",
  INLINE = "inline"
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
  raw?: string;
  private json?: Document;
  references: { [key: string]: RichTextReferenceQuery };
  constructor(node: RichTextQuery) {
    const _refs = node?.references ? node.references : [];
    const raw = node?.raw;
    const json: Document = raw ? JSON.parse(raw) : undefined;
    const refHash: { [key: string]: RichTextReferenceQuery } = {};
    this.raw = raw;
    this.references = _refs.reduce((hash, ref) => {
      hash[ref.contentful_id] = ref;
      return hash;
    }, refHash);
    this.json = json;
  }
  private getRef = (id: string) => {
    return id in this.references ? this.references[id] : undefined;
  };
  private handleRef = (
    block: Block | Inline
  ): RichTextBlock | RichTextInline => {
    const data = block.data as RichtTextNodeData;
    const reference = { ...this.getRef(data.target.sys.id) };
    return reference?.__typename
      ? {
          ...block,
          reference: {
            __typename: reference.__typename,
            data: { ...reference }
          }
        }
      : {
          ...block,
          reference: {
            __typename: "error",
            data: { error: "check query, make sure to add contentful_id" }
          }
        };
  };
  private hasRef = (block: Block | Inline | Text) => {
    return Array.isArray(
      block.nodeType.match(
        new RegExp(
          `${BLOCKTYPE.EMBEDDED}|${BLOCKTYPE.ENTRY}|${BLOCKTYPE.ASSET}`
        )
      )
    );
  };
  private traverseBlocks = (
    content: (Block | Inline | Text)[]
  ): (RichTextBlock | RichTextInline | RichTextText)[] => {
    return content.map((block) => {
      return this.hasRef(block)
        ? this.handleRef(block as Block | Inline)
        : "content" in block
        ? ({
            ...block,
            content: this.traverseBlocks(block.content)
          } as RichTextBlock | RichTextInline)
        : block;
    });
  };
  richText = () => {
    const ret =
      this.json && Array.isArray(this.json.content)
        ? { ...this.json, content: this.traverseBlocks([...this.json.content]) }
        : undefined;
    console.log(ret);
    return ret;
  };

  excerpt = (chars: number = 156): string => {
    const content = this.json?.content;
    let ret = ``;
    if (Array.isArray(content)) {
      content.forEach((text) => {
        const type = text.nodeType;
        if (type === "paragraph") {
          const innerContent = text.content as RichTextNode[];
          if (Array.isArray(innerContent)) {
            let count = 0;
            while (ret.length < chars && count < innerContent.length) {
              innerContent.forEach((line) => {
                if (line.nodeType === "text") {
                  ret = ret + line.value;
                  count++;
                } else {
                  ret =
                    Array.isArray(line.content) &&
                    line.content[0] &&
                    "value" in line.content[0]
                      ? line.content[0]?.value
                      : "";
                  count++;
                }
              });
            }
          }
        }
      });
    }
    return ret.length > chars ? ret.slice(0, chars) + "..." : ret;
  };
}
