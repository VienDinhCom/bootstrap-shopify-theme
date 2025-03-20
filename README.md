# 🛍 Bootstrap Shopify Theme

A free [**Shopify Theme**](https://github.com/maxvien/bootstrap-shopify-theme) built with [**Bootstrap**](https://getbootstrap.com/), [BEM](http://getbem.com/), [Liquid](https://shopify.github.io/liquid/), [Sass](https://sass-lang.com/), [ESNext](https://en.wikipedia.org/wiki/ECMAScript#ES.Next), [Theme Tools](https://shopify.dev/tools/themes), ... and [Webpack](https://webpack.js.org/).

## Experience

When I started building this Shopify theme, I thought it would be simple. But as I got deeper, I realized there was more to it.  

I build themes from scratch, using [Bootstrap](https://getbootstrap.com/) to create a clean, user-friendly interface. I follow the [BEM Methodology](http://getbem.com/), which helps keep my code minimal and reusable.  

I work with [Liquid](https://shopify.github.io/liquid/), [SASS](https://sass-lang.com/), [ESNext](https://en.wikipedia.org/wiki/ECMAScript#ES.Next) to keep the theme modern and flexible. When problems arise, [Shopify Theme Scripts](https://github.com/Shopify/theme-scripts) help me solve them faster. I also use [Shopify Metafield](https://shopify.dev/docs/admin-api/rest/reference/metafield) to add extra details where needed.  

For visuals, I rely on [Swiper](https://swiperjs.com/) to create smooth, touch-friendly sliders and [CSS Media Queries](https://www.w3schools.com/css/css_rwd_mediaqueries.asp) to ensure a responsive, mobile-first design.  

To streamline development, I use the [Shopify Theme CLI](https://shopify.dev/themes/tools/cli) for deployment and [Webpack Encore](https://github.com/symfony/webpack-encore) to bundle assets. [PostCSS](https://postcss.org/) and [CoreJS](https://github.com/zloirock/core-js) help keep the theme compatible with older browsers.  

And of course, I follow best practices with [Shopify Theme Check](https://shopify.dev/themes/tools/theme-check), [ESlint](https://eslint.org/), [Stylelint](https://stylelint.io/), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)—because clean code makes everything easier.  

It’s a process. A learning curve. But in the end, it’s about crafting themes that work beautifully—for both the store owner and the customer.

If you like this project, hit the **STAR** button to bookmark it ⭐️

## Demonstration

- **Store Link**: https://maxvien-bootstrap.myshopify.com
- **Store Password**: `maxvien`

## Installation

Clone the source code into your computer.

```bash
git clone https://github.com/Maxvien/bootstrap-shopify-theme.git
```

Install the project's dependencies.

```bash
yarn install
```

## Usage

First of all, you need to install [Shopify CLI](https://shopify.dev/apps/tools/cli/installation) and login into your online store.

```bash
shopify login --store=your-store.myshopify.com
```

Then you can run the below commands to work with the theme.

### Serve

Run `webpack watch` and `serve` the theme in development mode.

```bash
yarn serve
```

### Push

Run `webpack build` and `push` the theme to your online store in production mode.

```bash
yarn push
```

### Pull

Safely `add` the current project files to the git staging area, then `pull` the theme from your online store, and `clean` untracked asset files.

```bash
yarn pull
```

### Test

Run unit `test` with jest and make sure the files are following the project workflow.

```bash
yarn test
```

### Lint

Analyze the code to find problems with `shopify theme check`, `eslint`, `stylelint` and `prettier`.

```bash
yarn lint
```

Automatically fix problems.

```bash
yarn fix
```

## Notes

### Theme Assets

All files inside the `theme/assets` directory are ignored by `git`, except files starting with the `static` keyword in their filename.

### Webpack Encore

[Symfony Webpack Encore](https://symfony.com/doc/current/frontend.html) is a simpler way to integrate Webpack into your application. It wraps Webpack, giving you a clean & powerful API for bundling JavaScript modules, pre-processing CSS & JS and compiling and minifying assets. Encore gives you professional asset system that’s a delight to use.

If you want to use [React](https://symfony.com/doc/current/frontend/encore/reactjs.html) or [Vue](https://symfony.com/doc/current/frontend/encore/vuejs.html) in the theme, you can follow the documentation [here](https://symfony.com/doc/current/frontend.html).

## Visual Studio Code Extensions

To speed up your productivity, you can install these extensions:

- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [Shopify Liquid](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode)
- [IntelliSense for CSS](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
- [Visual Studio IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)

## Related Projects

- **[Next Shopify Storefront](https://github.com/Maxvien/next-shopify-storefront)** •  A Shopping Cart built with TypeScript, Tailwind CSS, Headless UI, Next.js, React.js, Shopify Hydrogen React,... and Shopify Storefront GraphQL API.
- **[Shopify Data Faker](https://github.com/Maxvien/shopify-data-faker)** • A Shopify development tool for generating dummy store data.
