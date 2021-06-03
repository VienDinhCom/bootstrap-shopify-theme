# 🛍 Bootstrap Shopify Theme

A free [**Shopify Theme**](https://github.com/maxvien/bootstrap-shopify-theme) built with [**Bootstrap**](https://getbootstrap.com/), [BEM](http://getbem.com/), [Theme Tools](https://shopify.dev/tools/themes), [Swiper](https://swiperjs.com/), [Gulp](https://gulpjs.com/), [Parcel](https://parceljs.org/), [Liquid](https://shopify.github.io/liquid/), [SASS](https://sass-lang.com/), [PostCSS](https://postcss.org/), [ESNext](https://en.wikipedia.org/wiki/ECMAScript#ES.Next), ... and [Passion](https://www.urbandictionary.com/define.php?term=Passion).

## Experience

These are my experience when I have been working on this theme:

- Designing & Building [Shopify Themes](https://github.com/maxvien/bootstrap-shopify-theme) from Scratch.
- Using [Bootstrap@5](https://getbootstrap.com/) to Create a Nice User Interface.
- Using [BEM Methodology](http://getbem.com/) to Create Minimal, Reusable Source Code.
- Using [Liquid](https://shopify.github.io/liquid/), [SASS](https://sass-lang.com/), [ESNext](https://en.wikipedia.org/wiki/ECMAScript#ES.Next) to Develop the Theme Fashionably.
- Using [CSS Media Queries](https://www.w3schools.com/css/css_rwd_mediaqueries.asp) to Create a Mobile-First and Responsive Design.
- Using [PostCSS](https://postcss.org/) to Make CSS Code Compatible with Old Browsers.
- Using [CoreJS](https://github.com/zloirock/core-js) to Make JavaScript Code Compatible with Old Browsers.
- Using [Swiper](https://swiperjs.com/) to Create Beautiful, Touchable, Responsive Sliders.
- Using [Shopify Theme Scripts](https://github.com/Shopify/theme-scripts) to Solve Theme Problems Faster.
- Using [Shopify Theme Kit](https://github.com/Shopify/themekit) to Develop and Deploy the Theme.
- Using [Shopify Theme Check](https://github.com/Shopify/theme-check), [ESlint](https://eslint.org/) to Follow Theme Best Practices.
- Using [Gulp](https://gulpjs.com/) to Automate & Enhance the Development Workflow.
- Using [Parcel](https://parceljs.org/) to Bundle all SCSS, JavaScript, Font, Image, ... Assets.
- Using [BrowserSync](https://github.com/Browsersync/browser-sync) to Reload the Browser Automatically When Saving the Files.
- Using [Liquid](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid) & [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) Visual Studio Code Extensions to Format the Source Code.

If you like the project, please hit the **STAR** button to support my work. ⭐️

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

## Configuration

To config the project, you need to copy and rename the `config.yml.example` file to the `config.yml` file. Then update the `store`, `password`, `theme_id` properties.

There are two sections in the `config.yml` file:

- The `development` section is for your **development** store.
- The `production` section is for your **production** store.

```yml
development:
  store: store-name.myshopify.com
  password: store-admin-api-password
  theme_id: store-theme-id

production:
  store: store-name.myshopify.com
  password: store-admin-api-password
  theme_id: store-theme-id
```

### Store Property

To fill the `store` property, you copy your store's **hostname** and paste it to the `config.yml` file.

### Password Property

To fill the `password` property, please follow these steps:

1. From your Shopify admin, click **Apps**.
2. Near the bottom of the page, click **Manage private apps**.
3. If private app development is disabled, then click **Enable private app development**. Only the store owner can [enable private app development](https://help.shopify.com/en/manual/apps/private-apps?#enable-private-app-development-from-the-shopify-admin).
4. Click **Create new private app**.
5. In the **App details** section, fill out the app name and your email address.
6. In the **Admin API** section, click **Show inactive Admin API permissions**.
7. Scroll to the **Themes** section and select **Read and write** from the dropdown.
8. Click **Save**.
9. Read the private app confirmation dialog, then click **Create app**.
10. In the **Admin API** section of the **App**, copy the **password** and paste it into the `config.yml` file.

### Theme ID Property

To fill the `theme_id` property, please follow these steps:

1. From your Shopify admin, click **Online Store**.
2. At the top of the **Online Store** menu, click **Themes**.
3. In the **Current theme** section, click **Actions** and select **Duplicate** to backup your current theme.
4. Next, click the **Customize** button.
5. There is a link like this `https://store-name.myshopify.com/admin/themes/[theme_id]/editor` on your browser's address bar. Copy the **theme_id** and paste it into the `config.yml` file.

## Development

To develop the theme, you need to follow the [**Configuration**](#configuration) to config the `development` section in the `config.yml` file.

Next, run this command to run the **development** server.

```bash
yarn dev
```

Open `https://localhost:8080/?preview_theme_id=[theme_id]` with your browser to see the result.

### Shopify Theme Check

To follow Shopify Theme best practices, you need to install [Shopify Theme Check](https://github.com/Shopify/theme-check#installation).

### Visual Studio Code Extensions

To speed up your productivity, you can install these extensions:

- [Liquid](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid)
- [ESlint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Theme Check](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode)
- [IntelliSense for CSS](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)

## Production

To deploy the theme, you need to follow the [**Configuration**](#configuration) to config the `production` section in the `config.yml` file.

Next, run this command to deploy the theme to your **production** store.

```bash
yarn deploy
```

## Related Projects

* **[Next Shopify Storefront](https://github.com/Maxvien/next-shopify-storefront)** • A real-world Shopping Cart built with TypeScript, NextJS, React, Redux, Apollo Client, Shopify Storefront GraphQL API, ... and Material UI.
* **[Shopify Theme Customizer](https://github.com/Maxvien/shopify-theme-customizer)** • An effective development tool for customizing existing Shopify themes. It's built with Gulp, Theme Kit, Theme Check, BrowserSync, ... and Passion.
* **[Shopify Data Faker](https://github.com/Maxvien/shopify-data-faker)** • A Shopify development tool for generating dummy store data.
