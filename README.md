## wmk-rich=text

### RichText class

```jsx
new RichText(node: RichTextQuery)
```

1. Consumes Contentful RichText data and converts it to format compatible with <RichTextReact> component.

2. Relocates embedded reference data to within the requisite content nodes inside each rich text's blocks JSON object.

#### Sample GraphQL RichText Query

```js
const sampleQuery = graphql`
  {
    contentfulPost {
      content {
        raw
        references {
          __typename
          ... on contentfulLink {
            title
            url
          }
        }
      }
    }
  }
`;
```

The _\_\_typename_ field is important. It helps identify what references data is being called during block processing.

### RichTextReact

```jsx
<RichTextReact content={RichText} options={richTextOptions} />
```

The content prop must be instantiated RichText, and the options prop is now required and must be in @contentful/rich-text-types Options format.

### EmbeddedBlock

```js
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const entry = new EmbeddedBlock(node, CompHash);
      return entry.render();
    }
```

Intended to be used within richTextOptions on the [BLOCKS.EMBEDDED_ENTRY] key, this component will help associate custom JSX with queried embedded blocks in Contentful Rich Text data.

Pass the queried node along with a Component hash object. The hash object must have keys that correspond to each block's _\_\_typename_.

#### Example Component Hash Object

Each associated component will get reference data passed as props. If the component can use those props outright, it can be a simple key: Component relationship.

If the associated component needs to pre-process the given reference props, the best was is to return the Component in an inline functional component like with the ContentfulBlog example below.

```tsx
const CompHash = {
  ContentfulLink: LinkComponent,
  ContentfulBlog: ({
    image,
    title,
    path
  }: {
    image: ContentfulImageQuery;
    title: string;
    path: string;
  }) => <ContentfulBlog image={new Img(image)} title={title} path={path} />
};
```
