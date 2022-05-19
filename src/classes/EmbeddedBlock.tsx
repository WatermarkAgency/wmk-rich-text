import React from "react";
import { RichTextNode } from "..";

const NullComponent = () => <></>;

export interface ComponentHashTable {
  [key: string]: React.FunctionComponent<any>;
}

export class EmbeddedBlock {
  props: { [key: string]: any };
  Comp: React.FunctionComponent<any>;
  hash: ComponentHashTable;
  constructor(node: RichTextNode, hash: ComponentHashTable) {
    const data = node?.reference;
    const type = data?.__typename;
    const contentful_id = data?.data?.contentful_id;
    const props = data?.data;
    const getCompFromHash = (
      type: string
    ): React.FunctionComponent<typeof props> => {
      const RetComp =
        type === "error"
          ? () => (
              <>
                {console.log(
                  `problem with rich text reference query`,
                  data.data
                )}
              </>
            )
          : type in hash
          ? hash[type]
          : undefined;
      if (!RetComp) {
        if (!contentful_id) {
          console.log(
            `contentful_id is missing on reference data for ${type} / ${data?.data?.__typename}
            }`
          );
        } else {
          if (type === "error") {
            console.log(
              `Error retrieving reference data for ${type} / ${contentful_id}`
            );
          } else {
            console.log(
              `No ${type} component defined in hash for contentful_id: ${contentful_id}.`
            );
          }
        }
      }
      return RetComp ? RetComp : NullComponent;
    };
    this.props = props;
    this.Comp = type ? getCompFromHash(type) : NullComponent;
    this.hash = hash;
  }
  render() {
    const Jsx = this.Comp;
    const props = this.props;
    return <Jsx {...props} />;
  }
  setComp(Comp: React.FunctionComponent<any>) {
    this.Comp = Comp ? Comp : NullComponent;
  }
}
