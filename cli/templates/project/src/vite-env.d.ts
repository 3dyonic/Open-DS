/// <reference types="vite/client" />

// The docs page template is MDX, loaded by Storybook.
declare module "*.mdx" {
  const Page: () => JSX.Element;
  export default Page;
}
