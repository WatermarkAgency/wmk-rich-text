## wmk-rich-text

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
          ... on ContentfulLink {
            contentful_id
            title
            url
          }
          ... on ContentfulBlog {
            contentful_id
            image {
              gatsbyImageData
              title
              file {
                url
                contentType
              }
              description
            }
            path
            title
          }
        }
      }
    }
  }
`;
```

The _\_\_typename_ field is important. It helps identify what references data is being called during block processing.

The _contentful\_id_ field is important, and is required to match references within Rich Text raw data.

Failure to include those queried fields will result in error messages.

### RichTextReact

```jsx
<RichTextReact content={RichText} options={richTextOptions} />
```

The content prop must be instantiated RichText, and the options prop is now required and must be in @contentful/rich-text-types Options format.

### EmbeddedBlock

```tsx
    [BLOCKS.EMBEDDED_ENTRY]: (node: RichTextNode) => {
      const entry = new EmbeddedBlock(node, CompHash);
      return entry.render();
    }
```

Intended to be used within richTextOptions on the [BLOCKS.EMBEDDED_ENTRY] key, this component will help associate custom JSX with queried embedded blocks in Contentful Rich Text data.

Node will be of type RichTextNode, which is an extension of Contentful's rich text types but also includes reference data. NOTE: since there is only one reference per block, the property name has been changed to reflect that: *reference* instead of references.

Pass the queried node along with a Component hash object. The hash object must have keys that correspond to each block's _\_\_typename_.


#### Example Component Hash Object

Each associated component will get reference data passed as props. If the component can use those props outright, it can be a simple key: Component relationship.

If the associated component needs to pre-process the given reference props, the best was is to return the Component in an inline functional component like with the ContentfulBlog example below.

```tsx
const CompHash = {
  ContentfulLink: LinkBlockComponent,
  ContentfulBlog: ({
    image,
    title,
    path
  }: {
    image: ContentfulImageQuery;
    title: string;
    path: string;
  }) => <BlogBlockComponent image={new Img(image)} title={title} path={path} />
};
```
