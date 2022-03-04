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
    const props = data?.data;
    const getCompFromHash = (
      type: string
    ): React.FunctionComponent<typeof props> => {
      const RetComp = type in hash ? hash[type] : undefined;
      if (!RetComp) {
        console.log(`No component ${type} defined in component hash table`);
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
