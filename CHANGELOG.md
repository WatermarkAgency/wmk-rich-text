# Changelog: `wmk-rich-text`

Notable changes to this project will be documented in this file.

### [3.1.0] (2022-05-18)

#### Bug Fixes / Feature 

- Fixed ability to match multiple instances of the same reference within content
- Requires addition of contentful_id to reference graphql query
- Added error messaging log for bad reference queries

### [2.3.4] (2022-05-13)

#### Bug Fixes

- Properly traverses links within lists and assigns reference data.

### [2.2.8] (2022-03-08)

#### Bug Fixes

- Preserve \_\_typename key to prevent disappearing content bug
- Allow for RichTextReact to consume content that is "undefined"

### [2.2.3] (2022-03-04)

#### Bug Fixes

- Noticed major performance issue in excerpt() method. Stopgap measure stops looping through rich text once character limit reached.

### [2.2.0] (2022-03-04)

#### Bug Fixes

- Customized RichTextReact options prop typing

#### Features

- RichTextNode type has replaced usage of RichTextTopLevelBlock as renderNode's node definition.

### [2.1.6] (2022-03-03)

#### Features

- New API for associated blocks/components with Contentful embeds
- Several new exported interfaces for better type checking

#### Bug Fixes

- Type checking RichText inputs

#### Chores

- Added a CHANGELOG file
- Documentation in README
